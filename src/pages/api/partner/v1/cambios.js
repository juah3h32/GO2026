// src/pages/api/partner/v1/cambios.js
// Espejo GO Radar §9 — registro de cambios del sitio, para que Radar haga
// polling (igual contrato que /api/v1/cambios de Radar, ver guía §6.5/§8.6).
// Por omisión NO regresa lo que la propia llave de Radar escribió aquí
// (`incluir_propios` lo trae) — así nunca hay rebote.
import { verifyRadarAuth } from '../../../../lib/verifyRadarKey.js';
import { getRadarChangelogSince, getVacanteById, getLeadById } from '../../../../lib/analytics-db.js';
import { serializeVacante } from './vacantes.js';
import { serializeCandidato } from './candidatos.js';

export const prerender = false;

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });
}

export async function GET({ request, url }) {
  const radar = await verifyRadarAuth(request);
  if (!radar) return json({ detail: { codigo: 'llave_invalida', mensaje: 'API key inválida o faltante.' } }, 401);

  const desde          = Number(url.searchParams.get('desde') || 0);
  const limite         = Number(url.searchParams.get('limite') || 100);
  const tiposParam      = url.searchParams.get('tipos');
  const tipos          = tiposParam ? tiposParam.split(',').map(t => t.trim()).filter(Boolean) : null;
  const incluirPropios = url.searchParams.get('incluir_propios') === 'true';

  const rows = await getRadarChangelogSince(desde, { tipos, incluirPropios, limite });

  const items = [];
  for (const row of rows) {
    if (row.tipo === 'baja_postulante') {
      items.push({ tipo: 'baja_postulante', id: row.entity_id, cuando: row.created_at, dato: null });
      continue;
    }
    if (row.tipo === 'vacante') {
      const v = await getVacanteById(row.entity_id);
      if (v) items.push({ tipo: 'vacante', id: v.id, cuando: row.created_at, dato: serializeVacante(v) });
      continue;
    }
    if (row.tipo === 'postulante') {
      const c = await getLeadById(row.entity_id);
      if (c) items.push({ tipo: 'postulante', id: c.id, cuando: row.created_at, dato: serializeCandidato(c) });
    }
  }

  const siguiente = rows.length ? rows[rows.length - 1].cursor : desde;
  return json({ items, siguiente, hay_mas: rows.length === limite });
}
