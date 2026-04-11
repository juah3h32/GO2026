import type { APIRoute } from 'astro';
import puppeteer from 'puppeteer-core';
import { existsSync } from 'fs';

// Rutas locales de Chrome por SO (dev / servidores tradicionales)
const LOCAL_CHROME_PATHS = [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', // macOS
  '/Applications/Chromium.app/Contents/MacOS/Chromium',           // macOS Chromium
  '/usr/bin/google-chrome-stable',                                 // Linux
  '/usr/bin/google-chrome',                                        // Linux
  '/usr/bin/chromium',                                             // Linux
  '/usr/bin/chromium-browser',                                     // Linux
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
];

async function getBrowserConfig(): Promise<{ executablePath: string; args: string[] }> {
  const isServerless = !!(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);

  if (isServerless) {
    // Producción serverless: usar @sparticuz/chromium (binario incluido en el bundle)
    const chromium = await import('@sparticuz/chromium');
    return {
      executablePath: await chromium.default.executablePath(),
      args: [...chromium.default.args, '--no-sandbox'],
    };
  }

  // Local / servidor tradicional: variable de entorno o auto-detección
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
  let browser;
  try {
    const { html, filename = 'reporte.pdf' } = await request.json();

    const { executablePath, args } = await getBrowserConfig();

    browser = await puppeteer.launch({
      executablePath,
      args,
      headless: true,
    });

    const page = await browser.newPage();

    // deviceScaleFactor: 2 → calidad retina (sin pixelado en gráficas SVG)
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

    await page.setContent(html, { waitUntil: 'networkidle0', timeout: 30_000 });

    const pdf = await page.pdf({
      // preferCSSPageSize respeta el @page { size: A4 landscape } del HTML
      preferCSSPageSize: true,
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    });

    return new Response(pdf, {
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
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  } finally {
    await browser?.close();
  }
};
