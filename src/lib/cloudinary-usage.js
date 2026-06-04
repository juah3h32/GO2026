/*!
 * GO2026 — Sitio Web Oficial de Grupo Ortiz
 * Copyright (c) 2026 JUAN PABLO CORONA CORONA — Desarrollador Web.
 * Todos los derechos reservados. Licencia propietaria (ver LICENSE).
 * Prohibida su copia, modificacion o distribucion sin autorizacion escrita.
 */
// src/lib/cloudinary-usage.js
// Consulta el uso de la cuenta Cloudinary (Admin API /usage) para vigilar que
// no se agote el almacenamiento/creditos y se caigan los videos y PDFs.

// Devuelve { ok, usedPercent, detalle, plan } o { ok:false, error }.
export async function getCloudinaryUsage() {
  const cloudName = process.env.PUBLIC_CLOUDINARY_CLOUD_NAME || import.meta.env?.PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey    = process.env.PUBLIC_CLOUDINARY_API_KEY    || import.meta.env?.PUBLIC_CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET        || import.meta.env?.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) return { ok: false, error: 'Cloudinary no configurado' };

  const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64');
  let data;
  try {
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/usage`, {
      headers: { Authorization: `Basic ${auth}` },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) {
      const body = await res.text().catch(() => '');
      return { ok: false, error: `Cloudinary HTTP ${res.status}: ${body.slice(0, 140)}` };
    }
    data = await res.json();
  } catch (e) {
    return { ok: false, error: e.message };
  }

  // Cloudinary devuelve, segun el plan: credits.used_percent (planes con creditos)
  // o recursos sueltos storage/bandwidth/transformations con usage+limit.
  const pcts = [];
  const detalle = [];
  const pushRes = (label, usage, limit, usedPct) => {
    let p = null;
    if (typeof usedPct === 'number') p = usedPct;
    else if (typeof usage === 'number' && typeof limit === 'number' && limit > 0) p = (usage / limit) * 100;
    if (p != null) { pcts.push(p); detalle.push(`${label}: ${p.toFixed(0)}%`); }
  };

  if (data.credits) pushRes('creditos', data.credits.usage, data.credits.limit, data.credits.used_percent);
  if (data.storage) pushRes('almacenamiento', data.storage.usage, data.storage.limit, data.storage.used_percent);
  if (data.bandwidth) pushRes('ancho de banda', data.bandwidth.usage, data.bandwidth.limit, data.bandwidth.used_percent);
  if (data.transformations) pushRes('transformaciones', data.transformations.usage, data.transformations.limit, data.transformations.used_percent);

  if (!pcts.length) {
    // Plan sin used_percent ni limits expuestos: no se puede calcular %.
    return { ok: true, usedPercent: null, detalle: 'Cloudinary no expone limite en este plan; uso no medible por %.', plan: data.plan || '' };
  }

  const usedPercent = Math.round(Math.max(...pcts));
  return { ok: true, usedPercent, detalle: detalle.join(' | '), plan: data.plan || '' };
}
