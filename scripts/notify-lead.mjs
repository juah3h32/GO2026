// Envia la alerta de RH (WhatsApp) a los numeros autorizados para un registro ya guardado.
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
for (const line of readFileSync(join(ROOT, '.env'), 'utf-8').split('\n')) {
  const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)\s*$/);
  if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const { notifyCategoriaRH } = await import(join(ROOT, 'src/lib/notify.js'));

const candidato = {
  nombre: 'Liliana Coria Heredia',
  puesto: 'Auxiliar Administrativo Compras',
  edad: '23',
  estado_rep: 'Michoacán',
  colonia: 'Pátzcuaro, Michoacán',
  telefono: '4341064070',
  email: 'coriaheredialiliana@gmail.com',
  cvNombre: 'Cv_lch.pdf',
  en_lista_espera: 0,
};

const r = await notifyCategoriaRH(candidato);
console.log('Notificacion RH enviada:', JSON.stringify(r));
process.exit(0);
