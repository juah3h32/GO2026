// src/pages/api/reports/capture-slide.ts
// Genera el slide de capturas en un solo proceso Puppeteer.
// Las capturas se guardan en /tmp como archivos JPEG y se referencian con
// file:// URLs en el HTML del slide → Puppeteer las carga directamente del
// disco, evitando el bug conocido de data-URL en setContent().

import type { APIRoute } from 'astro';
import { verifyAdminToken } from '../../../lib/verifyAdminToken.ts';

import { existsSync, readFileSync, writeFileSync, unlinkSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { randomUUID } from 'crypto';

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
    // chromium no disponible en este entorno
    return {
      executablePath: await chromium.default.executablePath(),
      args: [...chromium.default.args, '--no-sandbox', '--allow-file-access-from-files'],
    };
  }
  const fromEnv = process.env.CHROME_PATH;
  if (fromEnv && existsSync(fromEnv)) {
    return { executablePath: fromEnv, args: ['--no-sandbox', '--disable-setuid-sandbox', '--allow-file-access-from-files'] };
  }
  for (const p of LOCAL_CHROME_PATHS) {
    if (existsSync(p)) {
      return { executablePath: p, args: ['--no-sandbox', '--disable-setuid-sandbox', '--allow-file-access-from-files'] };
    }
  }
  throw new Error('Chrome no encontrado. Define CHROME_PATH o instala Google Chrome.');
}

export const config = { maxDuration: 180 };

function localFileToBase64(relPath: string, mime: string): string {
  try {
    const abs = join(process.cwd(), 'public', relPath);
    if (!existsSync(abs)) return '';
    return `data:${mime};base64,${readFileSync(abs).toString('base64')}`;
  } catch { return ''; }
}

function buildSlideHTML(opts: {
  imageFiles: { label: string; filePath: string | null }[];
  commits: any[];
  weekLabel: string;
  fontBase64: string;
  logoBase64: string;
}): string {
  const { imageFiles, commits, weekLabel, fontBase64, logoBase64 } = opts;
  const OR = '#FB670B', BK = '#262626', CR = '#ECEBE0', GR = '#535353';

  const fontFace = fontBase64
    ? `@font-face{font-family:'MorganitePro';src:url('${fontBase64}') format('opentype');font-weight:800;font-style:normal;}`
    : '';

  const logoHtml = logoBase64
    ? `<img src="${logoBase64}" style="height:40px;object-fit:contain;display:block;" />`
    : `<span style="font-family:'MorganitePro',Helvetica,sans-serif;font-size:32px;color:${OR};">GO</span>`;

  const totalImp = commits.filter((c: any) => ['feat','fix','perf','update'].includes(c.type)).length;
  const uniqueAreas = new Set(commits.map((c: any) => c.area)).size;
  const half = Math.ceil(imageFiles.length / 2);
  const left  = imageFiles.slice(0, half);
  const right = imageFiles.slice(half);

  function card(item: { label: string; filePath: string | null }, idx: number) {
    // file:// URL → Puppeteer carga la imagen directo del disco, sin base64
    const imgHtml = item.filePath
      ? `<img src="file://${item.filePath}" style="width:100%;height:186px;object-fit:cover;object-position:top center;border-radius:6px;border:1px solid ${CR};display:block;" />`
      : `<div style="width:100%;height:186px;background:#f0efe6;border-radius:6px;border:1px solid ${CR};display:flex;align-items:center;justify-content:center;"><span style="color:#aaa;font-size:10px;">Sin captura</span></div>`;
    return `
    <div style="display:flex;flex-direction:column;gap:7px;margin-bottom:14px;">
      <div style="display:flex;align-items:center;gap:8px;">
        <div style="width:22px;height:22px;border-radius:50%;background:${BK};display:flex;align-items:center;justify-content:center;flex-shrink:0;">
          <span style="color:white;font-size:11px;font-weight:800;font-family:'MorganitePro',Helvetica,sans-serif;line-height:1;">${idx+1}</span>
        </div>
        <span style="font-family:'MorganitePro',Helvetica,sans-serif;font-size:15px;font-weight:800;color:${OR};text-transform:uppercase;letter-spacing:0.07em;line-height:1;">${item.label}</span>
      </div>
      ${imgHtml}
    </div>`;
  }

  return `<!DOCTYPE html><html><head><meta charset="UTF-8"/>
<style>
${fontFace}
*{box-sizing:border-box;margin:0;padding:0;}
body{width:1440px;height:810px;background:white;overflow:hidden;font-family:Helvetica,Arial,sans-serif;}
</style></head>
<body>
<div style="width:1440px;height:810px;background:white;display:flex;flex-direction:column;overflow:hidden;">

  <div style="display:flex;align-items:center;justify-content:space-between;padding:18px 36px 16px;border-bottom:2px solid ${CR};flex-shrink:0;">
    <div style="display:flex;align-items:center;gap:14px;">
      ${logoHtml}
      <div style="width:1px;height:38px;background:${CR};"></div>
      <div>
        <div style="font-family:'MorganitePro',Helvetica,sans-serif;font-size:44px;font-weight:800;line-height:1;color:${BK};text-transform:uppercase;">REPORTE SEMANAL</div>
        <div style="font-family:'MorganitePro',Helvetica,sans-serif;font-size:22px;font-weight:800;color:${OR};text-transform:uppercase;letter-spacing:0.09em;line-height:1;margin-top:2px;">CAMBIOS WEB · GO</div>
      </div>
    </div>
    <div style="background:${BK};color:white;padding:9px 22px;border-radius:999px;font-family:'MorganitePro',Helvetica,sans-serif;font-size:20px;font-weight:800;text-transform:uppercase;">${weekLabel}</div>
  </div>

  <div style="flex:1;display:flex;overflow:hidden;min-height:0;">
    <div style="flex:1;padding:18px 16px 14px 36px;overflow:hidden;border-right:1px solid ${CR};">
      ${left.map((s, i) => card(s, i)).join('')}
    </div>
    ${right.length ? `
    <div style="flex:1;padding:18px 16px 14px 20px;overflow:hidden;border-right:1px solid ${CR};">
      ${right.map((s, i) => card(s, left.length + i)).join('')}
    </div>` : ''}
    <div style="width:218px;flex-shrink:0;padding:22px 24px;display:flex;flex-direction:column;justify-content:center;align-items:center;gap:18px;background:${CR};">
      <div style="font-family:'MorganitePro',Helvetica,sans-serif;font-size:15px;font-weight:800;color:${BK};text-transform:uppercase;letter-spacing:0.11em;text-align:center;line-height:1.25;">RESUMEN<br/>DE LA SEMANA</div>
      <div style="width:100%;height:1px;background:rgba(38,38,38,0.18);"></div>
      <div style="text-align:center;">
        <div style="font-family:'MorganitePro',Helvetica,sans-serif;font-size:78px;font-weight:800;color:${OR};line-height:1;">${totalImp}</div>
        <div style="font-size:8.5px;font-weight:700;color:${GR};text-transform:uppercase;letter-spacing:0.13em;margin-top:3px;">CAMBIOS IMPORTANTES</div>
      </div>
      <div style="text-align:center;">
        <div style="font-family:'MorganitePro',Helvetica,sans-serif;font-size:78px;font-weight:800;color:${OR};line-height:1;">${imageFiles.length}</div>
        <div style="font-size:8.5px;font-weight:700;color:${GR};text-transform:uppercase;letter-spacing:0.13em;margin-top:3px;">SECCIONES REFINADAS</div>
      </div>
      <div style="text-align:center;">
        <div style="font-family:'MorganitePro',Helvetica,sans-serif;font-size:78px;font-weight:800;color:${BK};line-height:1;">${uniqueAreas}</div>
        <div style="font-size:8.5px;font-weight:700;color:${GR};text-transform:uppercase;letter-spacing:0.13em;margin-top:3px;">ÁREAS</div>
      </div>
    </div>
  </div>

</div>
</body></html>`;
}

export const POST: APIRoute = async ({ request }) => {
  let browser: any = null;
  const tmpFiles: string[] = [];

  try {
    const adminRole = await verifyAdminToken(request);
    if (!adminRole) {
      return new Response(JSON.stringify({ ok: false, error: 'No autorizado' }), { status: 401 });
    }

    const { paths, labels, weekLabel, commits } = await request.json() as {
      paths: string[]; labels: string[]; weekLabel: string; commits: any[];
    };

    const serverOrigin = new URL(request.url).origin;
    const runId = randomUUID().slice(0, 8);

    const fontBase64 = localFileToBase64('fonts/MorganitePro-ExtraBold.otf', 'font/otf');
    const logoBase64 = localFileToBase64('images/logo/logoN.png', 'image/png');

    const { executablePath, args } = await getBrowserConfig();
    const puppeteer = (await import('puppeteer-core')).default; browser = await puppeteer.launch({ executablePath, args, headless: true });

    // ── PASO 1: Screenshot de cada página → archivo en /tmp ─────────────────
    const imageFiles: { label: string; filePath: string | null }[] = [];

    for (let i = 0; i < Math.min(paths.length, 6); i++) {
      const page = await browser.newPage();
      try {
        await page.setViewport({ width: 1280, height: 720, deviceScaleFactor: 1 });
        await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36');

        await page.setRequestInterception(true);
        page.on('request', (req: any) => {
          const u = req.url();
          if (u.includes('analytics.google.com') || u.includes('googletagmanager.com') ||
              (u.includes('.mp4') && !u.includes(serverOrigin))) {
            req.abort();
          } else { req.continue(); }
        });

        const url = serverOrigin + paths[i];
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 25_000 });

        // Kill animaciones CSS/GSAP y revelar contenido
        await page.addStyleTag({ content: `
          *,*::before,*::after{animation-duration:0ms!important;animation-delay:0ms!important;transition-duration:0ms!important;}
          video{visibility:hidden!important;}
          .lenis-smooth{overflow:auto!important;}
        ` });
        await page.evaluate((path: string) => {
          const g = (window as any).gsap;
          if (g?.globalTimeline) { g.globalTimeline.progress(1); g.globalTimeline.pause(); }
          // Revelar todo lo que GSAP ocultó
          document.querySelectorAll<HTMLElement>('*').forEach(el => {
            if (el.style.opacity === '0' || el.style.opacity === '0.001') el.style.opacity = '1';
            if (el.style.visibility === 'hidden') el.style.visibility = 'visible';
            if (el.style.transform && el.style.transform.includes('translate') &&
                el.style.transform !== 'none') el.style.transform = 'none';
          });

          // Scroll inteligente según la página — mostrar el contenido, no el hero
          if (path.startsWith('/es/') && path.split('/').filter(Boolean).length === 1) {
            // HOME: ir directamente al carrusel de divisiones
            const div = document.querySelector('.divisiones, .div-tape-wrap, [class*="division"]') as HTMLElement;
            if (div) { div.scrollIntoView({ behavior: 'instant', block: 'start' }); return; }
            // Fallback home: saltar el hero (primeros 100vh) para mostrar el carrusel
            window.scrollTo(0, window.innerHeight * 1.1);
          } else {
            // PÁGINAS DE PRODUCTO: mostrar el contenido principal (saltar el hero)
            const main = document.querySelector('main') as HTMLElement;
            if (main) {
              // Buscar la primera sección de producto/contenido debajo del hero
              const secs = Array.from(main.querySelectorAll('section, .section, .product-grid, .galeria, [class*="grid"], [class*="product"]')) as HTMLElement[];
              const first = secs.find(s => s.offsetTop > 80);
              if (first) { first.scrollIntoView({ behavior: 'instant', block: 'start' }); return; }
            }
            // Fallback: 25% del alto total
            window.scrollTo(0, document.body.scrollHeight * 0.22);
          }
        }, paths[i]);

        await new Promise(r => setTimeout(r, 1500));

        const buf: Buffer = await page.screenshot({ type: 'jpeg', quality: 78 });
        const filePath = join(tmpdir(), `go-slide-${runId}-${i}.jpg`);
        writeFileSync(filePath, buf);
        tmpFiles.push(filePath);
        console.log(`[capture-slide] ${labels[i]} → ${url} → ${Math.round(buf.length / 1024)} KB → ${filePath}`);
        imageFiles.push({ label: labels[i], filePath });
      } catch (e) {
        console.error(`[capture-slide] ERROR ${paths[i]}:`, e);
        imageFiles.push({ label: labels[i], filePath: null });
      } finally {
        await page.close();
      }
    }

    // ── PASO 2: Renderizar el slide con file:// URLs → screenshot ────────────
    const slideHtml = buildSlideHTML({ imageFiles, commits, weekLabel, fontBase64, logoBase64 });

    // Escribir el HTML en /tmp para cargarlo como file:// (garantiza que
    // las rutas file:// de las imágenes se resuelven correctamente)
    const htmlPath = join(tmpdir(), `go-slide-${runId}.html`);
    writeFileSync(htmlPath, slideHtml);
    tmpFiles.push(htmlPath);

    const slidePage = await browser.newPage();
    await slidePage.setViewport({ width: 1440, height: 810, deviceScaleFactor: 1.5 });

    // Cargar el HTML como file:// → los <img src="file://..."> se resuelven sin CORS
    await slidePage.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0', timeout: 30_000 });

    // Confirmar que las imágenes cargaron (naturalWidth > 0)
    const imgStatus = await slidePage.evaluate(() =>
      Array.from((document as any).images).map((img: any) => ({
        src: img.src.slice(0, 50),
        w: img.naturalWidth,
        complete: img.complete,
      }))
    );
    console.log('[capture-slide] img status:', JSON.stringify(imgStatus));

    await new Promise(r => setTimeout(r, 500));
    const slidePng: Buffer = await slidePage.screenshot({ type: 'png', fullPage: false });
    await slidePage.close();

    console.log(`[capture-slide] Slide PNG → ${Math.round(slidePng.length / 1024)} KB`);

    return new Response(new Blob([slidePng], { type: 'image/png' }), {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': 'attachment; filename="slide.png"',
      },
    });

  } catch (err) {
    console.error('[capture-slide] FATAL:', err);
    return new Response(JSON.stringify({ ok: false, error: String(err) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  } finally {
    if (browser) await browser.close();
    // Limpiar archivos temporales
    for (const f of tmpFiles) {
      try { unlinkSync(f); } catch {}
    }
  }
};
