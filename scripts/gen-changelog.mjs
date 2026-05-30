// Genera public/changelog.json desde el historial de git
// Ejecutar: node scripts/gen-changelog.mjs
// Se corre automáticamente antes del build (ver package.json "prebuild")

import { execSync } from 'child_process';
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

function detectType(msg) {
  if (/^feat[:(]/i.test(msg)) return 'feat';
  if (/^fix[:(]/i.test(msg)) return 'fix';
  if (/^perf[:(]/i.test(msg)) return 'perf';
  if (/^chore[:(]/i.test(msg)) return 'chore';
  if (/^docs[:(]/i.test(msg)) return 'docs';
  if (/^refactor[:(]/i.test(msg)) return 'refactor';
  if (/^style[:(]/i.test(msg)) return 'style';
  // Commits de versión genérica (v2, V.2, v.1.0, es, etc.)
  if (/^[vV][\d.]|^[vV]\d|^\d+\.\d|^[vVeE][sS]$|^V\./i.test(msg)) return 'release';
  return 'update';
}

function detectArea(msg) {
  const m = msg.toLowerCase();
  if (/bolsas?|naturiz|flexib|cuerda|cordel|producto/i.test(m)) return 'Productos';
  if (/video|cloudinary|imagen|image|webp|mp4|fallback/i.test(m)) return 'Media';
  if (/i18n|traducc|idioma|langua|en,|pt,|ar,|zh,/i.test(m)) return 'i18n';
  if (/loader|animac|carrusel|carousel|spinner|lenis|gsap/i.test(m)) return 'UI';
  if (/mobile|móvil|movil|speed|perf|optim|lazy/i.test(m)) return 'Performance';
  if (/admin|bot|chat|api|auth|report|analytic/i.test(m)) return 'Admin/API';
  if (/reclut|recruit|vacante|\bcv\b/i.test(m)) return 'Reclutamiento';
  if (/seo|meta|og:|canonical|sitemap/i.test(m)) return 'SEO';
  return 'General';
}

function cleanMessage(msg) {
  return msg.replace(/^(feat|fix|perf|chore|docs|refactor|style):\s*/i, '').trim();
}

let output;
try {
  output = execSync(
    'git log --format="%H%x1f%ad%x1f%s" --date=short',
    { cwd: root, encoding: 'utf-8', timeout: 10000, stdio: ['pipe', 'pipe', 'ignore'] }
  );
} catch (e) {
  console.error('Error ejecutando git log:', e.message);
  process.exit(1);
}

const commits = output
  .split('\n')
  .filter(Boolean)
  .map(line => {
    const i1 = line.indexOf('\x1f');
    const i2 = line.indexOf('\x1f', i1 + 1);
    const hash    = line.slice(0, i1).slice(0, 7);
    const date    = line.slice(i1 + 1, i2);
    const subject = line.slice(i2 + 1);
    return {
      hash,
      date,
      message: cleanMessage(subject),
      rawMessage: subject,
      type: detectType(subject),
      area: detectArea(subject),
    };
  });

const stats = { total: commits.length, byType: {}, byArea: {}, byMonth: {}, byAreaType: {} };
commits.forEach(c => {
  stats.byType[c.type]  = (stats.byType[c.type]  || 0) + 1;
  stats.byArea[c.area]  = (stats.byArea[c.area]  || 0) + 1;
  const month = c.date.slice(0, 7);
  stats.byMonth[month]  = (stats.byMonth[month]  || 0) + 1;
  // Desglose por área+tipo (para cuellos de botella)
  if (!stats.byAreaType[c.area]) stats.byAreaType[c.area] = {};
  stats.byAreaType[c.area][c.type] = (stats.byAreaType[c.area][c.type] || 0) + 1;
});

const out = join(root, 'public', 'changelog.json');
writeFileSync(out, JSON.stringify({ commits, stats, generatedAt: new Date().toISOString() }, null, 2));
console.log(`✓ changelog.json generado — ${commits.length} commits`);
