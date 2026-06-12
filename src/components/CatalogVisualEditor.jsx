// src/components/CatalogVisualEditor.jsx
// 3 modos:
//  - galeria: cuadros por division
//  - editar imagen: iframe ?edit=1&slide=N (in-place, sin pestana nueva)
//  - traducir: formulario por idioma (en/pt/zh/ar) con es como referencia
import React, { useState, useEffect } from 'react';

const LANGS = [
  { id: 'en', label: 'Ingles' },
  { id: 'pt', label: 'Portugues' },
  { id: 'zh', label: 'Chino' },
  { id: 'ar', label: 'Arabe' }
];

const LIGHT = {
  surface: '#FFFFFF', surface2: '#F8F9FB', text: '#111827',
  textSub: '#6B7280', border: '#E5E7EB', orange: '#FB670B'
};

const getT = (v) => (v && v.es ? v.es : v);

export default function CatalogVisualEditor({ P }) {
  const [catalogs, setCatalogs] = useState([]); // lista de catalogos [{slug, title, division, coverUrl, products}]
  const [activeSlug, setActiveSlug] = useState(null); // slug del catalogo siendo editado/traducido
  const [data, setData] = useState(null);
  const [err, setErr] = useState('');
  const [mode, setMode] = useState('gallery'); // gallery | edit | translate
  const [selected, setSelected] = useState(null);
  const [lang, setLang] = useState('en');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const c = {
    surface: P?.surface || LIGHT.surface,
    surface2: P?.surface2 || LIGHT.surface2,
    text: P?.text || LIGHT.text,
    textSub: P?.textSub || LIGHT.textSub,
    border: P?.border || LIGHT.border,
    orange: P?.orange || LIGHT.orange
  };

  useEffect(() => { loadCatalogs(); }, []);

  async function loadCatalogs() {
    try {
      const r = await fetch('/api/admin/catalogs', { credentials: 'same-origin' });
      if (!r.ok) throw new Error('No autorizado');
      const json = await r.json();
      setCatalogs(json.catalogs || []);
    } catch (e) { setErr(e.message); }
  }

  async function selectCatalogForEdit(slug) {
    setActiveSlug(slug);
    setErr('');
    try {
      const r = await fetch(`/api/admin/catalog?slug=${slug}`, { credentials: 'same-origin' });
      if (!r.ok) throw new Error('Error al cargar datos del catálogo');
      const json = await r.json();
      setData(json);
      setMode('translate'); // Por defecto al seleccionar vamos a traducir, o podemos quedarnos en gallery pero con el data cargado
    } catch (e) { setErr(e.message); }
  }

  const save = async () => {
    setSaving(true); setErr('');
    try {
      const res = await fetch(`/api/admin/catalog?slug=${activeSlug}`, { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(data) 
      });
      if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 2500); }
      else { const j = await res.json().catch(() => ({})); setErr(j.error || 'No se pudo guardar'); }
    } catch (e) { setErr(e.message); }
    setSaving(false);
  };

  // ───────────────── EDITAR IMAGEN (iframe) ─────────────────
  if (mode === 'edit' && selected) {
    const url = selected.slide != null
      ? `/${lang}/catalogo/${activeSlug}?edit=1&slide=${selected.slide}`
      : `/${lang}/catalogo/${activeSlug}?edit=1`;
    return (
      <div style={{ fontFamily: 'system-ui', color: c.text, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Bar c={c} title={selected.label} sub={`Catalogo: ${activeSlug} · Pagina completa · navega y edita`} onBack={() => setMode('gallery')} />
        <div style={{ height: '86vh', minHeight: 560, background: '#fff', borderRadius: 14, overflow: 'hidden', border: `1px solid ${c.border}`, boxShadow: '0 20px 50px rgba(0,0,0,.15)' }}>
          <iframe src={url} title={`Editor ${selected.label}`} style={{ width: '100%', height: '100%', border: 'none', display: 'block' }} />
        </div>
      </div>
    );
  }

  // ───────────────── TRADUCIR ─────────────────
  if (mode === 'translate' && data) {
    const isAr = lang === 'ar';
    const fieldDir = isAr ? 'rtl' : 'ltr';
    return (
      <div style={{ fontFamily: 'system-ui', color: c.text, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Bar c={c} title={`Traducir: ${activeSlug.toUpperCase()}`} sub="Edita cada idioma. El español es la referencia." onBack={() => { setMode('gallery'); setData(null); }}
          right={
            <button type="button" onClick={save} disabled={saving}
              style={{ background: saved ? '#22C55E' : c.orange, color: '#fff', border: 'none', padding: '9px 18px', borderRadius: 9, cursor: 'pointer', fontWeight: 800, fontSize: 13 }}>
              {saving ? 'Guardando...' : saved ? 'Guardado' : 'Guardar'}
            </button>
          } />

        {err && <p style={{ color: '#DC2626', fontSize: 13, margin: 0 }}>Error: {err}</p>}

        {/* selector de idioma */}
        <div style={{ display: 'flex', gap: 8 }}>
          {LANGS.map(l => (
            <button key={l.id} type="button" onClick={() => setLang(l.id)}
              style={{ padding: '8px 16px', borderRadius: 999, fontSize: 13, fontWeight: 700, cursor: 'pointer',
                border: `1px solid ${lang === l.id ? c.orange : c.border}`,
                background: lang === l.id ? c.orange : 'transparent', color: lang === l.id ? '#fff' : c.text }}>
              {l.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 22, maxHeight: '66vh', overflowY: 'auto', paddingRight: 6 }}>
          {/* Intro */}
          <Section c={c} title="Portada · Intro">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
              <Field c={c} dir={fieldDir} label="Título 1 (Naranja)" es={data.cover?.t1.es} value={data.cover?.t1[lang] || ''} onChange={v => { data.cover.t1[lang] = v; setData({ ...data }); }} />
              <Field c={c} dir={fieldDir} label="Título 2 (Gris)" es={data.cover?.t2.es} value={data.cover?.t2[lang] || ''} onChange={v => { data.cover.t2[lang] = v; setData({ ...data }); }} />
              <Field c={c} dir={fieldDir} label="División" es={data.cover?.division.es} value={data.cover?.division[lang] || ''} onChange={v => { data.cover.division[lang] = v; setData({ ...data }); }} />
            </div>
            <Field c={c} dir={fieldDir} label="Parrafo 1" es={data.intro.p1.es} value={data.intro.p1[lang] || ''} onChange={v => { data.intro.p1[lang] = v; setData({ ...data }); }} area />
            <Field c={c} dir={fieldDir} label="Titulo bio" es={data.intro.bioTitle.es} value={data.intro.bioTitle[lang] || ''} onChange={v => { data.intro.bioTitle[lang] = v; setData({ ...data }); }} />
            <Field c={c} dir={fieldDir} label="Parrafo 2" es={data.intro.p2.es} value={data.intro.p2[lang] || ''} onChange={v => { data.intro.p2[lang] = v; setData({ ...data }); }} area />
          </Section>

          {/* Productos */}
          <Section c={c} title="Lista de productos (portada)">
            {data.productos.map((p, i) => (
              <Field key={i} c={c} dir={fieldDir} label={`Producto ${i + 1}`} es={p.es} value={p[lang] || ''} onChange={v => { p[lang] = v; setData({ ...data }); }} />
            ))}
          </Section>

          {/* Fichas */}
          {data.fichas.map((f, i) => (
            <Section key={i} c={c} title={`Ficha · ${f.nombre.es}`}>
              <Field c={c} dir={fieldDir} label="Nombre" es={f.nombre.es} value={f.nombre[lang] || ''} onChange={v => { f.nombre[lang] = v; setData({ ...data }); }} />
              <Field c={c} dir={fieldDir} label="Descripcion" es={f.desc.es} value={f.desc[lang] || ''} onChange={v => { f.desc[lang] = v; setData({ ...data }); }} area />
              <div style={{ fontSize: 11, fontWeight: 700, color: c.textSub, textTransform: 'uppercase', marginTop: 4 }}>Caracteristicas</div>
              {f.specs.map((s, j) => (
                <div key={j} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <Field c={c} dir={fieldDir} label={`Caracteristica ${j + 1}`} es={s.c.es} value={s.c[lang] || ''} onChange={v => { s.c[lang] = v; setData({ ...data }); }} compact />
                  <Field c={c} dir={fieldDir} label="Tolerancia" es={s.tol.es} value={s.tol[lang] || ''} onChange={v => { s.tol[lang] = v; setData({ ...data }); }} compact />
                </div>
              ))}
            </Section>
          ))}
        </div>
      </div>
    );
  }

  // ───────────────── GALERIA ─────────────────
  return (
    <div style={{ fontFamily: 'system-ui', color: c.text }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 22, flexWrap: 'wrap' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, letterSpacing: -0.3 }}>CATALOGO · DIVISIONES</h2>
          <p style={{ margin: '6px 0 0', fontSize: 13, color: c.textSub, lineHeight: 1.5, maxWidth: 560 }}>
            Click en un cuadro para editar imagen. O traduce todos los textos por idioma.
          </p>
        </div>
        <div style={{ background: 'rgba(251,103,11,.05)', border: `1px solid ${c.orange}`, padding: '8px 14px', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: c.orange }}>IDM:</span>
          {LANGS.map(l => (
            <button key={l.id} onClick={() => setLang(l.id)} style={{ background: lang === l.id ? c.orange : 'transparent', color: lang === l.id ? '#fff' : c.orange, border: 'none', borderRadius: 6, padding: '4px 8px', fontSize: 11, fontWeight: 800, cursor: 'pointer' }}>
              {l.id.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {err && <p style={{ color: '#DC2626', fontSize: 13 }}>Error: {err}</p>}
      {catalogs.length === 0 && !err && <p style={{ color: c.textSub, fontSize: 13 }}>Cargando catálogos...</p>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 360px))', gap: 16 }}>
        {catalogs.map((cat) => (
          <div key={cat.slug}
            style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 16, overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 1px 3px rgba(0,0,0,.05)', transition: 'box-shadow .2s, transform .2s' }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,0,0,.10)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,.05)'; e.currentTarget.style.transform = 'none'; }}
          >
            <div style={{ height: 180, background: `linear-gradient(135deg, ${c.surface2} 0%, ${c.border} 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
              <img src={cat.coverUrl} alt={cat.title} style={{ maxWidth: '60%', maxHeight: '85%', objectFit: 'contain', filter: 'drop-shadow(0 12px 22px rgba(0,0,0,.16))' }} />
              <span style={{ position: 'absolute', top: 10, left: 10, fontSize: 9, fontWeight: 800, letterSpacing: 1, background: 'rgba(251,103,11,.12)', color: c.orange, padding: '4px 9px', borderRadius: 6 }}>CATALOGO</span>
            </div>
            <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800 }}>{cat.title}</h3>
              <p style={{ margin: 0, fontSize: 12, color: c.textSub }}>{cat.division} · {cat.products} productos</p>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 12 }}>
                <div onClick={() => { window.location.href = `/${lang}/catalogo/${cat.slug}?edit=1`; }}
                  style={{ background: c.orange, color: '#fff', padding: '10px', borderRadius: 10, fontWeight: 800, fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, cursor: 'pointer' }}>
                  <span>✎</span> Visual
                </div>
                <div onClick={() => selectCatalogForEdit(cat.slug)}
                  style={{ background: 'transparent', color: c.orange, border: `1px solid ${c.orange}`, padding: '10px', borderRadius: 10, fontWeight: 800, fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, cursor: 'pointer' }}>
                  <span>⠿</span> Textos
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Bar({ c, title, sub, onBack, right }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button type="button" onClick={onBack}
          style={{ background: 'transparent', color: c.text, border: `1px solid ${c.border}`, padding: '9px 14px', borderRadius: 9, cursor: 'pointer', fontWeight: 700, fontSize: 13 }}>
          ← Volver
        </button>
        <div>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800 }}>{title}</h3>
          <p style={{ margin: 0, fontSize: 12, color: c.textSub }}>{sub}</p>
        </div>
      </div>
      {right}
    </div>
  );
}

function Section({ c, title, children }) {
  return (
    <div style={{ border: `1px solid ${c.border}`, borderRadius: 12, padding: 16, background: c.surface, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <h4 style={{ margin: 0, fontSize: 13, fontWeight: 800, color: c.orange, textTransform: 'uppercase', letterSpacing: .5 }}>{title}</h4>
      {children}
    </div>
  );
}

function Field({ c, label, es, value, onChange, area, compact, dir }) {
  const inputStyle = {
    width: '100%', boxSizing: 'border-box', padding: compact ? '7px 10px' : '9px 12px',
    border: `1px solid ${c.border}`, borderRadius: 8, fontSize: 13, color: c.text,
    background: c.surface2, fontFamily: 'inherit', outline: 'none', direction: dir || 'ltr'
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <label style={{ fontSize: 10, fontWeight: 700, color: c.textSub, textTransform: 'uppercase', letterSpacing: .4 }}>{label}</label>
      <div style={{ fontSize: 11, color: c.textSub, lineHeight: 1.4 }}>{es}</div>
      {area
        ? <textarea value={value} onChange={e => onChange(e.target.value)} rows={3} style={inputStyle} />
        : <input value={value} onChange={e => onChange(e.target.value)} style={inputStyle} />}
    </div>
  );
}
