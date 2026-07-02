import { createClient } from '@libsql/client';
import 'dotenv/config';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const r = await client.execute({ sql: 'SELECT json FROM catalog_kv WHERE key = ?', args: ['digital-saco'] });
const obj = JSON.parse(r.rows[0].json);
console.log('productos:', JSON.stringify(obj.productos, null, 0));
console.log('fichas count:', obj.fichas.length);
console.log(JSON.stringify(obj.fichas[0], null, 2));
process.exit(0);
