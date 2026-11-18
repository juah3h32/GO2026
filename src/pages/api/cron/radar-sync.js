/*!
 * GO2026 — Sitio Web Oficial de Grupo Ortiz
 * Copyright (c) 2026 JUAN PABLO CORONA CORONA — Desarrollador Web.
 * Todos los derechos reservados. Licencia propietaria (ver LICENSE).
 * Prohibida su copia, modificacion o distribucion sin autorizacion escrita.
 */
// src/pages/api/cron/radar-sync.js
// Espejo GO Radar — Flujo D (Radar → sitio, por polling, no webhook — ver
// Espejo_Radar_GO_Oficial_Guia_Completa_13_11_26.md §8.6). Jala el registro
// de cambios DE RADAR (/api/v1/cambios) y aplica localmente vacantes,
// postulantes y bajas. Todo lo que aplica aquí usa origin:'radar_sync' — nunca
// dispara un push de vuelta a Radar (si lo hiciera, habría rebote infinito).
// Auth: igual patrón que los demás cron — CRON_SECRET_EXTERNAL (query/header)
// o token admin.
//
// GO_RADAR_MASTER_API_KEY ya está configurada y la API v1 de Radar ya está
// en producción (confirmado 14/11/26) — este cron corre en serio. Si algún
// día la llave faltara, radarGetCambios regresa { ok:false,
// codigo:'sin_configurar' } y este cron termina de inmediato sin tronar.
export const prerender = false;

import { verifyAdminToken } from '../../../lib/verifyAdminToken.ts';
import { radarGetCambios, radarEtapaToSiteStatus } from '../../../lib/go-radar-v1.js';
import {
  getRadarSyncState, setRadarSyncState,
  getVacanteByRadarId, getVacanteById, saveVacante, updateVacante, readVacantes,
  getLeadByRadarFolio, getLeadById, saveRecruitmentLead, updateRecruitmentLead, updateRecruitmentStatus, saveRadarReferencia,
} from '../../../lib/analytics-db.js';

const norm = (s) => (s || '').trim().toLowerCase();

// Carga inicial / anti-duplicado (guía §8.7): antes de crear una vacante
// nueva por lo que llega de Radar, buscar si YA existe una vacante local con
// el mismo título que todavía no está ligada (sin radar_id) — nació en el
// sitio y Radar también la tiene, así que se LIGA en vez de duplicarse.
// Ambigüedad (0 o 2+ coincidencias) → no se adivina, se crea nueva.
async function findUnlinkedVacanteByTitulo(titulo) {
  if (!titulo?.trim()) return null;
  const todas = await readVacantes(false, { isAdmin: true });
  const candidatas = todas.filter(v => !v.radar_id && norm(v.titulo) === norm(titulo));
  return candidatas.length === 1 ? candidatas[0].id : null;
}

const json = (o, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { 'Content-Type': 'application/json' } });

async function applyVacanteChange(item) {
  const dato = item.dato || {};
  if (dato.eliminada) return; // Radar nunca borra, pero por si acaso no hay nada que aplicar
  const radarId = String(item.id);
  let localId = await getVacanteByRadarId(radarId);
  if (!localId) localId = await findUnlinkedVacanteByTitulo(dato.titulo);
  const fields = {
    titulo: dato.titulo || '', area: dato.unidad || dato.area || '', ubicacion: dato.ubicacion || 'Morelia, Mich.',
    descripcion: dato.descripcion || '', activa: dato.estado !== 'cerrada',
  };
  if (localId) {
    // Solo se pisan los campos que Radar realmente manda — tipo/horario/
    // salario/requisitos/empresa/orden/multiples/link_externo son del sitio,
    // nunca los toca Radar, así que se preservan tal cual estaban.
    const actual = await getVacanteById(localId);
    if (!actual) return;
    await updateVacante({
      id: localId, ...fields,
      tipo: actual.tipo, horario: actual.horario, salario: actual.salario, requisitos: actual.requisitos,
      orden: actual.orden, multiples: actual.multiples, empresa: actual.empresa, link_externo: actual.link_externo,
      radar_id: radarId, origin: 'radar_sync',
    });
  } else {
    const created = await saveVacante({ ...fields, radar_id: radarId, origin: 'radar_sync' });
    return created.id;
  }
}

async function applyPostulanteChange(item) {
  const dato = item.dato || {};
  if (dato.anonimizado) return; // sin datos que aplicar
  const folio = dato.folio || item.external_id || '';

  // El postulante de Radar NO trae un campo "puesto" — trae `vacante.id` (el
  // id en Radar). Si esa vacante ya está ligada aquí (radar_id), usamos su
  // título; si no, queda sin puesto hasta que la vacante también se mirroree.
  let puesto = '';
  const vacanteRadarId = dato.vacante?.id;
  if (vacanteRadarId) {
    const localVacanteId = await getVacanteByRadarId(String(vacanteRadarId));
    if (localVacanteId) {
      const v = await getVacanteById(localVacanteId);
      puesto = v?.titulo || '';
    }
  }

  let localId = folio ? await getLeadByRadarFolio(folio) : null;

  if (!localId) {
    // Postulante que nació del lado de Radar y aún no existía aquí — se crea.
    if (!dato.nombre) return; // sin nombre no hay qué guardar (y sin permiso de lectura no vendría)
    const saved = await saveRecruitmentLead({
      nombre: dato.nombre, email: dato.correo || '', telefono: dato.telefono || '',
      puesto, edad: dato.edad ? String(dato.edad) : '',
      colonia: dato.colonia || '', estado_rep: dato.ubicacion || '',
      origin: 'radar_sync',
    });
    localId = saved.id;
    if (folio) await saveRadarReferencia(localId, folio).catch(() => {});
  } else {
    // Ya existía — refrescar lo que Radar sepa mejor que nosotros (nombre,
    // contacto, puesto si ya se pudo resolver). No se pisa con vacío.
    const patch = {};
    if (dato.nombre)   patch.nombre     = dato.nombre;
    if (dato.correo)   patch.email      = dato.correo;
    if (dato.telefono) patch.telefono   = dato.telefono;
    if (puesto)        patch.puesto     = puesto;
    if (dato.ubicacion) patch.estado_rep = dato.ubicacion;
    if (Object.keys(patch).length) await updateRecruitmentLead(localId, patch, 'radar_sync');
  }

  const lead = await getLeadById(localId);
  const nuevoStatus = radarEtapaToSiteStatus(dato.estado, lead?.status);
  await updateRecruitmentStatus(localId, nuevoStatus, {
    origin: 'radar_sync', radarEtapa: dato.estado || '',
    radarActualizadoPor: dato.actualizado_por_nombre || dato.actualizado_por || '',
  });
}

async function applyBajaPostulante(item) {
  // Radar quitó a esta persona. La guía dice que baja_postulante solo trae
  // id/external_id/vacante_id — sin folio. Solo lo podemos resolver cuando
  // el external_id es el nuestro (creado por el Flujo B, "go-web-cand-<id>");
  // para postulantes que nacieron por el bot (API v6) Radar no tiene ese
  // external_id, así que esos no se pueden ubicar aquí todavía.
  const m = /^go-web-cand-(\d+)$/.exec(item.external_id || '');
  if (!m) { console.warn('[radar-sync] baja_postulante sin external_id propio, no se pudo ubicar:', item.id); return; }
  // No hay columna de "retirado" — el mapeo más cercano sin inventar estado
  // nuevo es moverlo a descartado.
  await updateRecruitmentStatus(Number(m[1]), 'descartado', { origin: 'radar_sync' });
}

export async function runRadarSync({ limite = 100, maxPaginas = 10 } = {}) {
  const state = await getRadarSyncState();
  let cursor = state.cursor || null;
  let totalAplicados = 0;
  let paginas = 0;

  for (; paginas < maxPaginas; paginas++) {
    const res = await radarGetCambios({ desde: cursor, limite });
    if (!res.ok) {
      if (res.codigo === 'sin_configurar') return { ok: true, aplicados: 0, nota: 'Espejo con Radar no configurado todavía.' };
      await setRadarSyncState({ cursor, lastError: res.mensaje || res.codigo || 'error' });
      return { ok: false, error: res.mensaje || res.codigo, aplicados: totalAplicados };
    }
    const items = res.data?.items || [];
    for (const item of items) {
      try {
        if (item.tipo === 'vacante') await applyVacanteChange(item);
        else if (item.tipo === 'postulante') await applyPostulanteChange(item);
        else if (item.tipo === 'baja_postulante') await applyBajaPostulante(item);
        totalAplicados++;
      } catch (e) {
        console.warn(`[radar-sync] item ${item.tipo}/${item.id} falló:`, e.message);
      }
    }
    cursor = res.data?.siguiente || cursor;
    await setRadarSyncState({ cursor, lastError: null });
    if (!res.data?.hay_mas) break;
  }

  return { ok: true, aplicados: totalAplicados, paginas: paginas + 1, cursor };
}

async function run(request, url) {
  const secret = process.env.CRON_SECRET_EXTERNAL || import.meta.env?.CRON_SECRET_EXTERNAL || '';
  const qp     = url.searchParams.get('secret') || '';
  const hdr    = request.headers.get('x-cron-secret') || '';
  const authed = (secret && (qp === secret || hdr === secret)) || !!(await verifyAdminToken(request).catch(() => null));
  if (!authed) return json({ ok: false, error: 'No autorizado' }, 401);

  const out = await runRadarSync();
  return json(out, out.ok ? 200 : 500);
}

export async function GET({ request, url })  { return run(request, url); }
export async function POST({ request, url }) { return run(request, url); }
