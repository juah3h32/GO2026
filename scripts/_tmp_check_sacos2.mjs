import { createClient } from '@libsql/client';
import 'dotenv/config';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const r = await client.execute({ sql: 'SELECT json FROM catalog_kv WHERE key = ?', args: ['digital-saco'] });
const obj = JSON.parse(r.rows[0].json);
obj.fichas.forEach((f, i) => {
  console.log(i, '-', f.nombre.es, '| img:', f.img, '| specs:', f.specs.length, '| desc len:', (f.desc.es||'').length);
});
process.exit(0);
