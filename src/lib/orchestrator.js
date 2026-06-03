// src/lib/orchestrator.js
// ANALYTIC BOT JP — orquestador. Coordina los agentes por área (paralelo),
// ensambla un reporte consolidado y decide la severidad. SOLO LECTURA.
import { AGENTS, runAgent } from './agents.js';
import { logSystemEvent, getLogStats } from './analytics-db.js';

// Corre todos los agentes en paralelo y arma el reporte para WhatsApp.
// Devuelve { text, severity, areas }.
export async function runOrchestrator() {
  const stats = await getLogStats().catch(() => ({}));
  const results = await Promise.all(AGENTS.map(runAgent));

  // Severidad global: seguridad/críticos = urgente; cualquier "no OK" = atención.
  const problemAreas = results.filter(r => r.text && r.text.trim().toUpperCase() !== 'OK' && !r.text.startsWith('('));
  const haySeguridad = (stats.security || 0) > 0 || (stats.critical || 0) > 0
    || results.some(r => r.key === 'JP-SEC' && r.text.trim().toUpperCase() !== 'OK' && !r.text.startsWith('('));

  let severity = 'ok';
  if (haySeguridad) severity = 'urgent';
  else if (problemAreas.length) severity = 'attention';

  const head = severity === 'urgent' ? '*URGENTE*'
    : severity === 'attention' ? '*Atención*'
    : '*Todo en orden*';

  const lineas = [`*ANALYTIC BOT JP* — análisis del día`, head, ''];
  if (severity === 'ok') {
    lineas.push('Todas las áreas operando bien: web, seguridad, backend y datos.');
  } else {
    // Mostrar primero seguridad, luego el resto con falla.
    const orden = ['JP-SEC', 'JP-API', 'JP-WEB', 'JP-DATA'];
    for (const key of orden) {
      const r = results.find(x => x.key === key);
      if (!r) continue;
      const t = (r.text || '').trim();
      if (!t || t.toUpperCase() === 'OK' || t.startsWith('(')) continue;
      lineas.push(`*${r.area}:* ${t}`);
    }
  }

  const text = lineas.join('\n');
  logSystemEvent({
    level: severity === 'urgent' ? 'critical' : (severity === 'attention' ? 'warn' : 'info'),
    category: 'monitor', source: 'orquestador',
    message: `Análisis diario: ${severity} (${problemAreas.length} área(s) con falla)`,
  }).catch(() => {});

  return { text, severity, areas: results };
}
