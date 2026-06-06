/*!
 * GO2026 — Sitio Web Oficial de Grupo Ortiz
 * Copyright (c) 2026 JUAN PABLO CORONA CORONA — Desarrollador Web.
 * Todos los derechos reservados. Licencia propietaria (ver LICENSE).
 * Prohibida su copia, modificacion o distribucion sin autorizacion escrita.
 */
// src/pages/api/cron/storage-check.js
// Vigila el uso de Cloudinary. Alerta por WhatsApp al cruzar 75% y 90% (una sola
// vez por umbral). Si se agota, los videos/PDFs dejan de servirse.
// Auth: CRON_SECRET_EXTERNAL (query/header) o token admin. notify=0 → no envia.
export const prerender = false;

import { getCloudinaryUsage } from '../../../lib/cloudinary-usage.js';
import { getConfig, setConfig, logSystemEvent } from '../../../lib/analytics-db.js';
import { alertaUrgente, acumularResumen } from '../../../lib/alert-center.js';
import { verifyAdminToken } from '../../../lib/verifyAdminToken.ts';

const json = (o, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { 'Content-Type': 'application/json' } });

export async function runStorageCheck({ notify = true } = {}) {
  const usage = await getCloudinaryUsage();
  if (!usage.ok) {
    await logSystemEvent({ level: 'warn', category: 'storage', source: 'storage-check', message: `No se pudo leer uso Cloudinary: ${usage.error}` }).catch(() => {});
    return { ok: false, error: usage.error };
  }
  if (usage.usedPercent == null) {
    return { ok: true, usedPercent: null, detalle: usage.detalle, alerted: false };
  }

  const pct = usage.usedPercent;
  const bucket = pct >= 90 ? 90 : pct >= 75 ? 75 : 0;
  const prev = parseInt((await getConfig('cloudinary_alert_bucket').catch(() => '0')) || '0', 10);

  let alerted = false;
  if (notify && bucket > prev) {
    // Cruzó hacia arriba un umbral nuevo. 90% = URGENTE (instantaneo);
    // 75% = al RESUMEN diario (no interrumpe).
    if (bucket >= 90) {
      // PAYG: pasar el limite NO tira el sitio, solo cobra el excedente. Free/limite
      // duro: al agotarse se dejan de servir videos/PDFs. Mensaje segun el caso.
      const cuerpo = usage.isPayg
        ? `*CLOUDINARY — CREDITOS AL ${pct}%*\n${usage.detalle}.\nVas a superar los creditos incluidos del plan ${usage.plan}; el excedente se cobra (el sitio NO se cae).\nRevisa consumo: console.cloudinary.com`
        : `*ALMACENAMIENTO CLOUDINARY CRITICO*\nUso al *${pct}%* (${usage.detalle}).\nRiesgo de que se caigan videos y PDFs.\nLibera espacio: console.cloudinary.com`;
      const n = await alertaUrgente('cloudinary:90', cuerpo, { ventanaMin: 720 });
      alerted = n > 0;
    } else {
      const nota = usage.isPayg ? 'cerca del limite incluido; el excedente se cobra' : 'conviene liberar espacio';
      await acumularResumen({ tipo: 'storage', detalle: `Cloudinary al ${pct}% (${usage.detalle}) — ${nota}` });
      alerted = true;
    }
    await logSystemEvent({ level: bucket >= 90 ? 'critical' : 'warn', category: 'storage', source: 'storage-check', message: `Cloudinary al ${pct}% (umbral ${bucket})` }).catch(() => {});
  }

  // Persistir SOLO si se avisó (sube el umbral) o si bajó (se liberó espacio → resetea
  // para volver a avisar si sube de nuevo). Con notify=0 no se consume el aviso.
  if (alerted || bucket < prev) await setConfig('cloudinary_alert_bucket', String(bucket)).catch(() => {});

  return { ok: true, usedPercent: pct, detalle: usage.detalle, bucket, alerted };
}

async function run(request, url) {
  const secret = process.env.CRON_SECRET_EXTERNAL || import.meta.env?.CRON_SECRET_EXTERNAL || '';
  const qp     = url.searchParams.get('secret') || '';
  const hdr    = request.headers.get('x-cron-secret') || '';
  const authed = (secret && (qp === secret || hdr === secret)) || !!(await verifyAdminToken(request).catch(() => null));
  if (!authed) return json({ ok: false, error: 'No autorizado' }, 401);

  const notify = url.searchParams.get('notify') !== '0';
  const out    = await runStorageCheck({ notify });
  return json(out, out.ok ? 200 : 500);
}

export async function GET({ request, url })  { return run(request, url); }
export async function POST({ request, url }) { return run(request, url); }
