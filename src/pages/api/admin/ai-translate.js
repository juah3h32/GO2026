// src/pages/api/admin/ai-translate.js
// Traduce un texto del catalogo a los demas idiomas con IA. Solo admin.
import { verifyAdminToken } from '../../../lib/verifyAdminToken.ts';

function canEditCatalog(role) {
  if (!role) return false;
  if (role.isAdminRole) return true;
  return Array.isArray(role.tabs) && role.tabs.includes('catalogo');
}
const json = (o, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { 'Content-Type': 'application/json' } });

const LANG_NAME = { es: 'español', en: 'inglés', pt: 'portugués', zh: 'chino simplificado', ar: 'árabe' };
const ALL = ['es', 'en', 'pt', 'zh', 'ar'];

export async function POST({ request }) {
  try {
    const role = await verifyAdminToken(request).catch(() => null);
    if (!canEditCatalog(role)) return json({ error: 'No autorizado' }, 401);

    const { text, fromLang } = await request.json();
    if (!text || typeof text !== 'string') return json({ error: 'Sin texto' }, 400);
    const from = ALL.includes(fromLang) ? fromLang : 'es';
    const targets = ALL.filter(l => l !== from);

    const key = import.meta.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY;
    if (!key) return json({ error: 'OPENAI_API_KEY no configurado' }, 500);

    const targetList = targets.map(l => `"${l}" (${LANG_NAME[l]})`).join(', ');
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        temperature: 0.2,
        max_tokens: 900,
        messages: [
          {
            role: 'system',
            content: `Eres traductor tecnico de un catalogo industrial de film stretch (Grupo Ortiz). Traduce con tono profesional y preciso. Reglas: conserva numeros, simbolos, unidades (In, Ft, Lb, Gauges, %, Gfr, Lbf) y normas (NOM-XXX, NMX-E-XXX) tal cual. No traduzcas la marca "Grupo Ortiz". Devuelve SOLO JSON valido, sin markdown.`
          },
          {
            role: 'user',
            content: `Texto en ${LANG_NAME[from]}:\n"""${text}"""\n\nTraducelo a estos idiomas: ${targetList}.\nResponde EXACTAMENTE con este JSON: {${targets.map(l => `"${l}": "..."`).join(', ')}}`
          }
        ]
      })
    });
    if (!res.ok) { const b = await res.text(); return json({ error: `IA HTTP ${res.status}: ${b.slice(0, 160)}` }, 502); }
    const data = await res.json();
    let content = (data.choices?.[0]?.message?.content || '').trim();
    content = content.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/i, '').trim();
    let translations;
    try { translations = JSON.parse(content); } catch { return json({ error: 'IA devolvio formato invalido' }, 502); }

    const clean = {};
    targets.forEach(l => { if (typeof translations[l] === 'string') clean[l] = translations[l]; });
    return json({ ok: true, translations: clean });
  } catch (error) {
    return json({ error: error.message }, 500);
  }
}
