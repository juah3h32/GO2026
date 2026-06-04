/*!
 * GO2026 — Sitio Web Oficial de Grupo Ortiz
 * Copyright (c) 2026 JUAN PABLO CORONA CORONA — Desarrollador Web.
 * Todos los derechos reservados. Licencia propietaria (ver LICENSE).
 */
// src/lib/alert-center.js
// CENTRO UNICO de alertas WhatsApp. Todas las fuentes pasan por aqui para
// evitar duplicados y ruido. Dedup PERSISTENTE en DB (global_config), no en
// memoria — en serverless el Map en RAM no persiste entre invocaciones.
//
// NIVELES:
//   URGENTE (instantaneo) → alertaUrgente(): error 500, pagina caida, login
//     fallido, Cloudinary >=90%, sitio en mantenimiento.
//   DIARIO (resumen 1x/dia) → acumularResumen(): imagen/video/recurso suelto
//     roto, Cloudinary 75%.
//   NUNCA (solo log/panel): login correcto, eventos info/warn.
import { getConfig, setConfig } from './analytics-db.js';
import { notifyAdmins } from './health-alert.js';

const KEY_SEEN  = 'alert_seen';     // { "clave": epochSec } — dedup urgentes
const KEY_DIARIO = 'alert_diario';  // [ { tipo, detalle, ts } ] — cola del resumen

async function readJSON(key, def) {
  try { const r = await getConfig(key); return r ? JSON.parse(r) : def; } catch { return def; }
}

// Alerta URGENTE con dedup persistente. Si `key` ya se avisó dentro de la
// ventana, NO reenvia. Devuelve numero de envios (0 si dedup).
export async function alertaUrgente(key, texto, { ventanaMin = 60 } = {}) {
  const ahora = Math.floor(Date.now() / 1000);
  const seen = await readJSON(KEY_SEEN, {});
  const last = seen[key] || 0;
  if (ahora - last < ventanaMin * 60) return 0; // ya avisado hace poco

  // Limpieza: descarta claves mas viejas que 24h para que el objeto no crezca.
  for (const k of Object.keys(seen)) if (ahora - seen[k] > 86400) delete seen[k];
  seen[key] = ahora;
  await setConfig(KEY_SEEN, JSON.stringify(seen)).catch(() => {});

  return await notifyAdmins(texto);
}

// Agrega una falla menor a la cola del resumen diario (no envia ahora).
export async function acumularResumen(item) {
  try {
    const cola = await readJSON(KEY_DIARIO, []);
    // Evita acumular el mismo detalle repetido en el dia.
    const det = String(item?.detalle || '').slice(0, 160);
    if (cola.some(x => x.detalle === det)) return;
    cola.push({ tipo: item?.tipo || 'recurso', detalle: det, ts: Math.floor(Date.now() / 1000) });
    await setConfig(KEY_DIARIO, JSON.stringify(cola.slice(-100))).catch(() => {});
  } catch { /* no critico */ }
}

// Envia UN resumen con las fallas acumuladas y limpia la cola. Lo llama un cron.
export async function enviarResumenDiario() {
  const cola = await readJSON(KEY_DIARIO, []);
  if (!cola.length) return { ok: true, enviado: false, items: 0 };

  // Agrupar por tipo
  const porTipo = {};
  for (const it of cola) (porTipo[it.tipo] ||= []).push(it);
  const ETI = { imagen: 'imagenes', video: 'videos', recurso: 'recursos', estilo: 'CSS/JS', storage: 'almacenamiento' };
  const lineas = ['*RESUMEN DIARIO — grupo-ortiz.com*', ''];
  for (const [tipo, arr] of Object.entries(porTipo)) {
    lineas.push(`*${arr.length} ${ETI[tipo] || tipo}* con problema:`);
    for (const it of arr.slice(0, 6)) lineas.push(`- ${it.detalle.slice(0, 80)}`);
    if (arr.length > 6) lineas.push(`  …y ${arr.length - 6} mas`);
    lineas.push('');
  }
  lineas.push('Revisa cuando puedas. Las paginas caidas y errores graves se avisan al instante.');

  const sent = await notifyAdmins(lineas.join('\n'));
  await setConfig(KEY_DIARIO, '[]').catch(() => {}); // limpiar cola
  return { ok: true, enviado: sent > 0, items: cola.length };
}
