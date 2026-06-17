// Recupera un registro de reclutamiento perdido (no llego al PASO 10) y lo guarda en la BD.
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
for (const line of readFileSync(join(ROOT, '.env'), 'utf-8').split('\n')) {
  const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)\s*$/);
  if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const { saveRecruitmentLead, readVacantes } = await import(join(ROOT, 'src/lib/analytics-db.js'));

const lead = {
  nombre: 'Liliana Coria Heredia',
  email: 'coriaheredialiliana@gmail.com',
  telefono: '4341064070',
  puesto: 'Auxiliar Administrativo Compras',
  edad: '23',
  estado_rep: 'Michoacán',
  colonia: 'Pátzcuaro, Michoacán',
  cvNombre: 'Cv_lch.pdf',
  mensaje: '',
  comentarios: 'Registro recuperado del chat (sesion s_1781658563869_7l5uep). CV adjuntado por el candidato pero el archivo no quedo en el log.',
  sessionId: 's_1781658563869_7l5uep',
  en_lista_espera: 0,
};

// Determinar lista de espera segun vacantes activas
try {
  const vac = (await readVacantes(true)) || [];
  const norm = s => (s||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'');
  const match = vac.some(v => norm(v.titulo).includes(norm(lead.puesto)) || norm(lead.puesto).includes(norm(v.titulo)));
  if (!vac.length || !match) lead.en_lista_espera = 1;
} catch {}

const r = await saveRecruitmentLead(lead);
console.log('Resultado:', JSON.stringify(r), '| en_lista_espera:', lead.en_lista_espera);
process.exit(0);
