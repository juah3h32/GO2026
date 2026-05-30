// src/pages/api/reports/capture-screenshots.ts
// Puppeteer screenshots del MISMO servidor que atiende la petición
// (localhost en dev, dominio público en producción) → sin bot-detection

import type { APIRoute } from 'astro';
import { verifyAdminToken } from '../../../lib/verifyAdminToken.ts';
import puppeteer from 'puppeteer-core';
import { existsSync } from 'fs';

const LOCAL_CHROME_PATHS = [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/usr/bin/google-chrome-stable',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
];

async function getBrowserConfig(): Promise<{ executablePath: string; args: string[] }> {
  const isServerless = !!(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);

  if (isServerless) {
    const chromium = await import('@sparticuz/chromium');
    return {
      executablePath: await chromium.default.executablePath(),
      args: [...chromium.default.args, '--no-sandbox'],
    };
  }

  const fromEnv = process.env.CHROME_PATH;
  if (fromEnv && existsSync(fromEnv)) {
    return { executablePath: fromEnv, args: ['--no-sandbox', '--disable-setuid-sandbox'] };
  }

  for (const p of LOCAL_CHROME_PATHS) {
    if (existsSync(p)) {
      return { executablePath: p, args: ['--no-sandbox', '--disable-setuid-sandbox'] };
    }
  }

  throw new Error('Chrome no encontrado. Instala Google Chrome o define CHROME_PATH.');
}

export const config = { maxDuration: 120 };

export const POST: APIRoute = async ({ request }) => {
  let browser: any = null;

  try {
    const adminRole = await verifyAdminToken(request);
    if (!adminRole) {
      return new Response(JSON.stringify({ ok: false, error: 'No autorizado' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const body = await request.json();

    // El cliente envía paths ('/es/', '/es/productos/'...), no URLs completas.
    // Construimos las URLs completas usando el origin del servidor actual:
    //   dev  → http://localhost:4321/es/
    //   prod → https://grupo-ortiz.com/es/
    const serverOrigin = new URL(request.url).origin;

    const rawTargets: { path: string; label: string }[] = (body.targets || []).slice(0, 6);

    if (!rawTargets.length) {
      return new Response(JSON.stringify({ ok: true, screenshots: [] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const targets = rawTargets.map(t => ({
      url: serverOrigin + t.path,
      path: t.path,
      label: t.label,
    }));

    const { executablePath, args } = await getBrowserConfig();

    browser = await puppeteer.launch({
      executablePath,
      args,
      headless: true,
    });

    const results: { path: string; label: string; base64: string | null }[] = [];

    // Capturar de a uno para evitar problemas de memoria con GSAP+video
    for (const target of targets) {
      const page = await browser.newPage();
      try {
        await page.setViewport({ width: 1280, height: 720, deviceScaleFactor: 1 });

        // User-agent real para evitar detección de bot
        await page.setUserAgent(
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
        );

        // Bloquear solo trackers externos (no recursos del sitio)
        await page.setRequestInterception(true);
        page.on('request', (req: any) => {
          const u = req.url();
          if (
            u.includes('analytics.google.com') ||
            u.includes('googletagmanager.com') ||
            u.includes('facebook.net') ||
            u.includes('hotjar.com') ||
            // Bloquear videos para carga más rápida (no afecta screenshot)
            (u.includes('.mp4') && !u.includes(serverOrigin))
          ) {
            req.abort();
          } else {
            req.continue();
          }
        });

        // Navegar al servidor local (dev) o al mismo dominio (prod)
        await page.goto(target.url, { waitUntil: 'domcontentloaded', timeout: 30_000 });

        // 1) Inyectar CSS para matar animaciones CSS inmediatamente
        await page.addStyleTag({
          content: `
            *, *::before, *::after {
              animation-duration: 0ms !important;
              animation-delay: 0ms !important;
              transition-duration: 0ms !important;
              transition-delay: 0ms !important;
            }
            video, iframe { visibility: hidden !important; }
          `,
        });

        // 2) Esperar que el JS hidrate (Astro islands)
        await new Promise(r => setTimeout(r, 2500));

        // 3) Kill GSAP y forzar visibilidad de todo el contenido
        await page.evaluate(() => {
          // Saltar todas las animaciones GSAP al frame final
          const g = (window as any).gsap;
          if (g?.globalTimeline) {
            g.globalTimeline.progress(1);
            g.globalTimeline.pause();
          }

          // Revelar elementos que GSAP dejó invisibles
          document.querySelectorAll<HTMLElement>('*').forEach(el => {
            const s = el.style;
            if (s.opacity === '0' || s.opacity === '0.001') s.opacity = '1';
            if (s.visibility === 'hidden') s.visibility = 'visible';
            if (s.display === 'none' && el.tagName !== 'SCRIPT' && el.tagName !== 'STYLE') {
              // No revelar scripts/styles, solo elementos visuales que GSAP ocultó
              // Verificar que el elemento tenga contenido antes de mostrarlo
            }
          });

          window.scrollTo(0, 0);
        });

        // 4) Un tick adicional para repintar
        await new Promise(r => setTimeout(r, 500));

        const buffer: Buffer = await page.screenshot({ type: 'jpeg', quality: 75 });
        const sizeKB = Math.round(buffer.length / 1024);
        console.log(`[capture-screenshots] ${target.label} → ${target.url} → ${sizeKB} KB`);

        results.push({ path: target.path, label: target.label, base64: buffer.toString('base64') });
      } catch (e) {
        console.error(`[capture-screenshots] ERROR ${target.url}:`, e);
        results.push({ path: target.path, label: target.label, base64: null });
      } finally {
        await page.close();
      }
    }

    // Preservar orden original de targets
    const ordered = rawTargets.map(t =>
      results.find(r => r.path === t.path) || { path: t.path, label: t.label, base64: null }
    );

    return new Response(JSON.stringify({ ok: true, screenshots: ordered }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('[capture-screenshots] FATAL:', err);
    return new Response(JSON.stringify({ ok: false, error: String(err) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  } finally {
    if (browser) await browser.close();
  }
};
