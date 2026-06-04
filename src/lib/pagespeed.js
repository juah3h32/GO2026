/*!
 * GO2026 — Sitio Web Oficial de Grupo Ortiz
 * Copyright (c) 2026 JUAN PABLO CORONA CORONA — Desarrollador Web.
 * Todos los derechos reservados. Licencia propietaria (ver LICENSE).
 * Prohibida su copia, modificacion o distribucion sin autorizacion escrita.
 */
// src/lib/pagespeed.js
// Google PageSpeed Insights API v5 — analisis de performance, SEO,
// accesibilidad y best practices. Key opcional via PAGESPEED_API_KEY.

const PSI_ENDPOINT = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';
const CATEGORIES   = ['PERFORMANCE', 'SEO', 'ACCESSIBILITY', 'BEST_PRACTICES'];

// ── Ejecutar analisis PSI para una estrategia (mobile|desktop) ────────────────
export async function runPagespeed(url, strategy = 'mobile') {
  const params = new URLSearchParams({ url, strategy });
  for (const c of CATEGORIES) params.append('category', c);
  const key = process.env.PAGESPEED_API_KEY || import.meta.env?.PAGESPEED_API_KEY || '';
  if (key) params.append('key', key);

  const res = await fetch(`${PSI_ENDPOINT}?${params}`, { signal: AbortSignal.timeout(120_000) });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`PSI ${strategy} HTTP ${res.status}: ${body.slice(0, 160)}`);
  }
  const data = await res.json();
  const lh   = data.lighthouseResult;
  if (!lh) throw new Error(`PSI ${strategy}: sin lighthouseResult`);

  const score = (cat) => {
    const s = lh.categories?.[cat]?.score;
    return typeof s === 'number' ? Math.round(s * 100) : null;
  };
  const audit = (id) => lh.audits?.[id]?.displayValue || null;

  // Top audits fallidos (score < 0.9, con peso en SEO o performance)
  const issues = [];
  for (const [id, a] of Object.entries(lh.audits || {})) {
    if (typeof a.score !== 'number' || a.score >= 0.9) continue;
    if (a.scoreDisplayMode !== 'binary' && a.scoreDisplayMode !== 'numeric' && a.scoreDisplayMode !== 'metricSavings') continue;
    issues.push({ id, title: a.title, score: a.score });
  }
  issues.sort((a, b) => a.score - b.score);

  return {
    strategy,
    performance:    score('performance'),
    seo:            score('seo'),
    accessibility:  score('accessibility'),
    best_practices: score('best-practices'),
    lcp:            audit('largest-contentful-paint'),
    cls:            audit('cumulative-layout-shift'),
    tbt:            audit('total-blocking-time'),
    issues:         issues.slice(0, 5).map(i => i.title),
  };
}

// ── Semaforo textual segun score ──────────────────────────────────────────────
function flag(score) {
  if (score == null) return '?';
  if (score >= 90) return 'OK';
  if (score >= 50) return 'ATENCION';
  return 'MAL';
}

// ── Construir mensaje de WhatsApp con el resumen ──────────────────────────────
export function buildWAReport({ mobile, desktop, siteUrl }) {
  const lines = [];
  lines.push('REPORTE PAGESPEED — GRUPO ORTIZ');
  lines.push(siteUrl);
  lines.push('');

  for (const r of [mobile, desktop].filter(Boolean)) {
    lines.push(`[${r.strategy.toUpperCase()}]`);
    lines.push(`Performance: ${r.performance ?? '-'} (${flag(r.performance)})`);
    lines.push(`SEO: ${r.seo ?? '-'} (${flag(r.seo)})`);
    lines.push(`Accesibilidad: ${r.accessibility ?? '-'} (${flag(r.accessibility)})`);
    lines.push(`Best Practices: ${r.best_practices ?? '-'} (${flag(r.best_practices)})`);
    if (r.lcp || r.cls || r.tbt) {
      lines.push(`LCP ${r.lcp || '-'} | CLS ${r.cls || '-'} | TBT ${r.tbt || '-'}`);
    }
    lines.push('');
  }

  const allIssues = [...new Set([...(mobile?.issues || []), ...(desktop?.issues || [])])].slice(0, 6);
  if (allIssues.length) {
    lines.push('A MEJORAR:');
    for (const t of allIssues) lines.push(`- ${t}`);
  } else {
    lines.push('Sin problemas relevantes detectados.');
  }

  return lines.join('\n').trim();
}
