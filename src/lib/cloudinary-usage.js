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

  // Cloudinary devuelve, segun el plan: credits.used_percent (planes con creditos,
  // incluido Free y PAYG) o recursos sueltos storage/bandwidth/transformations.
  const gb = (bytes) => (Number(bytes) / 1e9).toFixed(bytes >= 1e10 ? 0 : 1) + ' GB';
  const pctDe = (m) => {
    if (!m) return null;
    if (typeof m.used_percent === 'number') return m.used_percent;
    if (typeof m.usage === 'number' && typeof m.limit === 'number' && m.limit > 0) return (m.usage / m.limit) * 100;
    return null;
  };

  const pCreditos = pctDe(data.credits);

  // Desglose informativo SIEMPRE (aunque no haya % por falta de limite): muestra el
  // consumo real en unidades para saber QUE gasta los creditos (ancho de banda, etc.).
  const detalle = [];
  if (data.credits && typeof data.credits.usage === 'number') {
    const lim = data.credits.limit ? `/${data.credits.limit}` : '';
    detalle.push(`creditos ${data.credits.usage.toFixed(1)}${lim}${pCreditos != null ? ` (${pCreditos.toFixed(0)}%)` : ''}`);
  }
  if (data.storage?.usage)         detalle.push(`almacenamiento ${gb(data.storage.usage)}`);
  if (data.bandwidth?.usage)       detalle.push(`ancho de banda ${gb(data.bandwidth.usage)}/mes`);
  if (data.transformations?.usage) detalle.push(`transformaciones ${data.transformations.usage}/mes`);

  // PAYG = pago por uso: pasar el 100% NO tira el sitio, solo cobra excedente.
  // Free / planes con limite duro: al agotarse, se deja de servir contenido.
  const plan = data.plan || '';
  const isPayg = /payg|pay.?as.?you.?go/i.test(plan);

  // NUMERO REAL DE LA CUENTA = creditos (lo que muestra el dashboard y lo que
  // determina overage/bloqueo). NO mezclar sub-metricas: tomar el max inflaba el
  // total con picos de banda mensual y daba falsas alarmas.
  let usedPercent;
  if (pCreditos != null) {
    usedPercent = Math.round(pCreditos);
  } else {
    const otros = [pctDe(data.storage), pctDe(data.bandwidth), pctDe(data.transformations)].filter(p => typeof p === 'number');
    if (!otros.length) {
      return { ok: true, usedPercent: null, detalle: detalle.join(' | ') || 'Cloudinary no expone limite en este plan; uso no medible por %.', plan, isPayg };
    }
    usedPercent = Math.round(Math.max(...otros));
  }

  return { ok: true, usedPercent, detalle: detalle.join(' | '), plan, isPayg };
}
