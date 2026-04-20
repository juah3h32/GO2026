import type { APIRoute } from 'astro';
import { verifyAdminToken } from '../../lib/verifyAdminToken.ts';
import puppeteer from 'puppeteer-core';
import { existsSync } from 'fs';

// Rutas locales de Chrome por SO
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

  throw new Error(
    'Chrome no encontrado. Instala Google Chrome o define la variable de entorno CHROME_PATH.'
  );
}

export const POST: APIRoute = async ({ request }) => {
  let browser: any = null; // Inicializado para evitar errores en el bloque 'finally'

  try {
    const adminRole = await verifyAdminToken(request);
    if (!adminRole) return new Response(JSON.stringify({ ok: false, error: 'No autorizado' }), { status: 401, headers: { 'Content-Type': 'application/json' } });

    const { html, filename = 'reporte.pdf' } = await request.json();

    const { executablePath, args } = await getBrowserConfig();

    browser = await puppeteer.launch({
      executablePath,
      args,
      headless: true,
    });

    const page = await browser.newPage();

    // Calidad retina para evitar pixelado
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

    await page.setContent(html, { waitUntil: 'networkidle0', timeout: 30_000 });

    const pdf = await page.pdf({
      preferCSSPageSize: true,
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    });

    // CORRECCIÓN: Envolvemos el Uint8Array en un Blob para que TypeScript 
    // lo reconozca como un BodyInit válido para Response.
    return new Response(new Blob([pdf], { type: 'application/pdf' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });

  } catch (err) {
    console.error('[export-pdf]', err);
    return new Response(
      JSON.stringify({ error: String(err) }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};