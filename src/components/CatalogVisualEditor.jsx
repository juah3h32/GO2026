// src/components/CatalogVisualEditor.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';

const LANGS = [
  { id: 'es', label: 'Español' },
  { id: 'en', label: 'Ingles' },
  { id: 'pt', label: 'Portugues' },
  { id: 'zh', label: 'Chino' },
  { id: 'ar', label: 'Arabe' }
];

const LIGHT = {
  surface: '#FFFFFF', surface2: '#F8F9FB', text: '#111827',
  textSub: '#6B7280', border: '#E5E7EB', orange: '#FB670B'
};

const EDIT_LANG = 'es';

export default function CatalogVisualEditor({ P, onClose }) {
  const [catalogs, setCatalogs] = useState([]);
  const [activeSlug, setActiveSlug] = useState(null);
  const [data, setData] = useState(null);
  const [err, setErr] = useState('');
  const [mode, setMode] = useState('gallery'); // gallery | translate
  const [lang, setLang] = useState('es');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [query, setQuery] = useState('');
  const [previewSlug, setPreviewSlug] = useState(null); // fullscreen preview (readonly)
  const [editSlug, setEditSlug] = useState(null);       // fullscreen edit (?edit=1)

  const c = {
    surface: P?.surface || LIGHT.surface,
    surface2: P?.surface2 || LIGHT.surface2,
    text: P?.text || LIGHT.text,
    textSub: P?.textSub || LIGHT.textSub,
    border: P?.border || LIGHT.border,
    orange: P?.orange || LIGHT.orange
  };

  useEffect(() => { loadCatalogs(); }, []);

  // Escape cierra cualquier overlay fullscreen
  useEffect(() => {
    if (!previewSlug && !editSlug) return;
    const fn = (e) => { if (e.key === 'Escape') { setPreviewSlug(null); setEditSlug(null); } };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [previewSlug, editSlug]);

  async function loadCatalogs() {
    try {
      const r = await fetch('/api/admin/catalogs', { credentials: 'same-origin' });
      if (!r.ok) throw new Error('No autorizado');
      const json = await r.json();
      setCatalogs(json.catalogs || []);
    } catch (e) { setErr(e.message); }
  }

  async function openTranslate(slug) {
    setActiveSlug(slug);
    setErr('');
    try {
      const r = await fetch(`/api/admin/catalog?slug=${slug}`, { credentials: 'same-origin' });
      if (!r.ok) throw new Error('Error al cargar datos del catálogo');
      const json = await r.json();
      setData(json);
      setMode('translate');
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

  // ───────────────── EDITOR fullscreen (portal) ─────────────────
  const editPortal = editSlug ? createPortal(
    <FullscreenOverlay
      src={`/${EDIT_LANG}/catalogo/${editSlug}?edit=1`}
      title={`Editor ${editSlug}`}
      onClose={() => setEditSlug(null)}
      onEdit={null}
      catalogs={catalogs}
      currentSlug={editSlug}
      onNavigate={s => setEditSlug(s)}
    />,
    document.body
  ) : null;

  // ───────────────── VISTA PREVIA fullscreen (portal) ─────────────────
  const previewPortal = previewSlug ? createPortal(
    <FullscreenOverlay
      src={`/${EDIT_LANG}/catalogo/${previewSlug}`}
      title={`Vista previa ${previewSlug}`}
      onClose={() => setPreviewSlug(null)}
      onEdit={() => { const s = previewSlug; setPreviewSlug(null); setEditSlug(s); }}
      catalogs={catalogs}
      currentSlug={previewSlug}
      onNavigate={s => setPreviewSlug(s)}
    />,
    document.body
  ) : null;

  // ───────────────── TRADUCIR ─────────────────
  if (mode === 'translate' && data) {
    const isAr = lang === 'ar';
    const fieldDir = isAr ? 'rtl' : 'ltr';
    return (
      <div style={{ fontFamily: 'system-ui', color: c.text, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Bar c={c}
          title={`Textos: ${activeSlug.toUpperCase()}`}
          sub={lang === 'es' ? 'Editando español (referencia)' : 'Edita la traduccion — español es la referencia en gris'}
          onBack={() => { setMode('gallery'); setData(null); }}
          right={
            <button type="button" onClick={save} disabled={saving}
              style={{ background: saved ? '#22C55E' : c.orange, color: '#fff', border: 'none', padding: '9px 18px', borderRadius: 9, cursor: 'pointer', fontWeight: 800, fontSize: 13 }}>
              {saving ? 'Guardando...' : saved ? 'Guardado' : 'Guardar'}
            </button>
          } />

        {err && <p style={{ color: '#DC2626', fontSize: 13, margin: 0 }}>Error: {err}</p>}

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {LANGS.map(l => (
            <button key={l.id} type="button" onClick={() => setLang(l.id)}
              style={{
                padding: '8px 16px', borderRadius: 999, fontSize: 13, fontWeight: 700, cursor: 'pointer',
                border: `1px solid ${lang === l.id ? c.orange : c.border}`,
                background: lang === l.id ? c.orange : 'transparent', color: lang === l.id ? '#fff' : c.text
              }}>
              {l.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 22, maxHeight: '66vh', overflowY: 'auto', paddingRight: 6 }}>
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

          <Section c={c} title="Lista de productos (portada)">
            {data.productos.map((p, i) => (
              <Field key={i} c={c} dir={fieldDir} label={`Producto ${i + 1}`} es={p.es} value={p[lang] || ''} onChange={v => { p[lang] = v; setData({ ...data }); }} />
            ))}
          </Section>

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
  const q = query.trim().toLowerCase();
  const filtered = q
    ? catalogs.filter(cat => (cat.title || '').toLowerCase().includes(q) || (cat.division || '').toLowerCase().includes(q))
    : catalogs;

  return (
    <>
      {editPortal}
      {previewPortal}
      <div style={{ fontFamily: 'system-ui', color: c.text }}>
        <div style={{ marginBottom: 22 }}>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, letterSpacing: -0.3 }}>CATALOGO · DIVISIONES</h2>
          <p style={{ margin: '6px 0 0', fontSize: 13, color: c.textSub, lineHeight: 1.5, maxWidth: 620 }}>
            Vista previa abre pantalla completa. Editar abre la pagina en nueva pestana para editar.
          </p>
        </div>

        {err && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#DC2626', fontSize: 13, background: 'rgba(220,38,38,.06)', border: '1px solid rgba(220,38,38,.25)', borderRadius: 10, padding: '10px 14px', marginBottom: 16 }}>
            <span style={{ fontWeight: 800 }}>Error:</span> {err}
          </div>
        )}

        {catalogs.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: '1 1 240px', maxWidth: 360 }}>
              <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: c.textSub, display: 'flex' }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
              </span>
              <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar division..."
                style={{ width: '100%', boxSizing: 'border-box', padding: '9px 12px 9px 34px', border: `1px solid ${c.border}`, borderRadius: 10, fontSize: 13, color: c.text, background: c.surface2, fontFamily: 'inherit', outline: 'none' }}
                onFocus={e => { e.currentTarget.style.borderColor = c.orange; }}
                onBlur={e => { e.currentTarget.style.borderColor = c.border; }} />
            </div>
            <span style={{ fontSize: 12, fontWeight: 700, color: c.textSub }}>
              {filtered.length} {filtered.length === 1 ? 'division' : 'divisiones'}
            </span>
          </div>
        )}

        {catalogs.length > 0 && filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px 16px', color: c.textSub, fontSize: 13 }}>
            Sin resultados para "{query}".
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: 16, alignItems: 'start' }}>
          {catalogs.length === 0 && !err
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} c={c} />)
            : filtered.map((cat) => (
            <div key={cat.slug}
              style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 16, overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 1px 3px rgba(0,0,0,.05)', transition: 'box-shadow .2s, transform .2s, border-color .2s' }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 14px 30px rgba(0,0,0,.12)'; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.borderColor = c.orange; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,.05)'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = c.border; }}
            >
              {/* imagen — click abre vista previa fullscreen */}
              <div onClick={() => setPreviewSlug(cat.slug)}
                title="Vista previa pantalla completa"
                style={{ height: 190, background: `linear-gradient(135deg, ${c.surface2} 0%, ${c.border} 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', cursor: 'pointer' }}>
                <CoverImage src={cat.coverUrl} title={cat.title} c={c} />
                {/* badge CATALOGO */}
                <span style={{ position: 'absolute', top: 10, left: 10, display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 9, fontWeight: 800, letterSpacing: 1, background: 'rgba(251,103,11,.12)', color: c.orange, padding: '4px 9px', borderRadius: 6, backdropFilter: 'blur(4px)' }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: c.orange, display: 'inline-block' }} />
                  CATALOGO
                </span>
                {/* badge productos */}
                <span style={{ position: 'absolute', top: 10, right: 10, fontSize: 10, fontWeight: 700, background: c.surface, color: c.textSub, padding: '3px 9px', borderRadius: 20, border: `1px solid ${c.border}`, boxShadow: '0 1px 2px rgba(0,0,0,.06)' }}>
                  {cat.products} prod.
                </span>
                {/* icono ojo hover */}
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity .18s' }}
                  onMouseEnter={e => { e.currentTarget.style.opacity = '1'; }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = '0'; }}>
                  <span style={{ color: '#fff', fontSize: 12, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 7, fontFamily: 'system-ui' }}>
                    <EyeIcon /> Vista previa
                  </span>
                </div>
              </div>

              {/* info + botones */}
              <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, letterSpacing: -0.2 }}>{cat.title}</h3>
                <p style={{ margin: 0, fontSize: 12, color: c.textSub }}>{cat.division}</p>

                <div style={{ display: 'flex', gap: 8, marginTop: 'auto', paddingTop: 14 }}>
                  {/* Editar — overlay fullscreen sobre el panel */}
                  <button
                    onClick={() => setEditSlug(cat.slug)}
                    style={{
                      flex: 1, background: c.orange, color: '#fff', padding: '10px 8px',
                      borderRadius: 10, fontWeight: 800, fontSize: 12,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      gap: 6, border: 'none', cursor: 'pointer', fontFamily: 'inherit', transition: 'filter .15s'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.filter = 'brightness(1.07)'; }}
                    onMouseLeave={e => { e.currentTarget.style.filter = 'none'; }}>
                    <PencilIcon /> Editar
                  </button>
                  {/* Traducciones */}
                  <button onClick={() => openTranslate(cat.slug)}
                    onMouseEnter={e => { e.currentTarget.style.background = c.border; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                    style={{
                      flex: 1, background: 'transparent', color: c.text, padding: '10px 8px',
                      borderRadius: 10, fontWeight: 700, fontSize: 12,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      gap: 6, cursor: 'pointer', border: `1px solid ${c.border}`,
                      fontFamily: 'inherit', transition: 'background .15s'
                    }}>
                    <TranslateIcon /> Traducciones
                  </button>
                </div>

                {/* Vista previa — botón secundario debajo */}
                <button onClick={() => setPreviewSlug(cat.slug)}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(251,103,11,.06)'; e.currentTarget.style.borderColor = c.orange; e.currentTarget.style.color = c.orange; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = c.border; e.currentTarget.style.color = c.textSub; }}
                  style={{
                    width: '100%', background: 'transparent', color: c.textSub,
                    padding: '8px', borderRadius: 9, fontWeight: 700, fontSize: 11,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    gap: 6, cursor: 'pointer', border: `1px solid ${c.border}`,
                    fontFamily: 'inherit', transition: 'background .15s, border-color .15s, color .15s', marginTop: 6
                  }}>
                  <EyeIcon size={11} /> Vista previa pantalla completa
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// Overlay fullscreen sin barras. Botón flotante arriba + flechas de navegación laterales.
function FullscreenOverlay({ src, title, onClose, onEdit, catalogs = [], currentSlug, onNavigate }) {
  const [topVisible, setTopVisible] = useState(false);
  const timerRef = React.useRef(null);

  const showTop = () => {
    setTopVisible(true);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setTopVisible(false), 2200);
  };

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const idx = catalogs.findIndex(c => c.slug === currentSlug);
  const prev = idx > 0 ? catalogs[idx - 1] : null;
  const next = idx >= 0 && idx < catalogs.length - 1 ? catalogs[idx + 1] : null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 2147483647, background: '#000' }}>

      {/* zona detección borde superior */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 60, zIndex: 4, pointerEvents: 'all' }}
        onMouseEnter={showTop} onMouseMove={showTop} />

      {/* botones volver/editar — aparecen al acercarse arriba */}
      <div style={{
        position: 'absolute', top: 14, right: 16, zIndex: 5,
        display: 'flex', gap: 8, alignItems: 'center',
        opacity: topVisible ? 1 : 0, transition: 'opacity .25s ease',
        pointerEvents: topVisible ? 'all' : 'none',
      }}>
        {onEdit && (
          <button onClick={onEdit} style={{
            background: 'rgba(251,103,11,.85)', border: 'none', color: '#fff',
            padding: '7px 14px', borderRadius: 20, cursor: 'pointer',
            fontWeight: 700, fontSize: 12, fontFamily: 'system-ui',
            display: 'flex', alignItems: 'center', gap: 6,
            backdropFilter: 'blur(8px)', boxShadow: '0 2px 12px rgba(0,0,0,.4)'
          }}>
            <PencilIcon /> Editar
          </button>
        )}
        <button onClick={onClose} style={{
          background: 'rgba(0,0,0,.65)', border: '1px solid rgba(255,255,255,.2)',
          color: '#fff', padding: '7px 14px', borderRadius: 20, cursor: 'pointer',
          fontWeight: 700, fontSize: 12, fontFamily: 'system-ui',
          display: 'flex', alignItems: 'center', gap: 6,
          backdropFilter: 'blur(8px)', boxShadow: '0 2px 12px rgba(0,0,0,.4)'
        }}>
          <CloseIcon /> Volver
        </button>
      </div>

      {/* flecha izquierda — catálogo anterior */}
      {prev && (
        <div style={{ position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)', zIndex: 4 }}>
          <CatalogNavBtn direction="left" catalog={prev} onClick={() => onNavigate(prev.slug)} />
        </div>
      )}

      {/* flecha derecha — catálogo siguiente */}
      {next && (
        <div style={{ position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)', zIndex: 4 }}>
          <CatalogNavBtn direction="right" catalog={next} onClick={() => onNavigate(next.slug)} />
        </div>
      )}

      <iframe src={src} title={title}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none', display: 'block' }} />
    </div>
  );
}

// Botón de navegación lateral — diseño pill con glow naranja
function CatalogNavBtn({ direction, catalog, onClick }) {
  const [hovered, setHovered] = useState(false);
  const isLeft = direction === 'left';

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center',
        flexDirection: isLeft ? 'row' : 'row-reverse',
        gap: 0, border: 'none', cursor: 'pointer', padding: 5,
        background: hovered ? 'rgba(235,235,235,0.97)' : 'transparent',
        borderRadius: 999,
        boxShadow: hovered
          ? '0 0 0 3px rgba(251,103,11,.55), 0 0 24px rgba(251,103,11,.35), 0 8px 28px rgba(0,0,0,.3)'
          : 'none',
        transition: 'box-shadow .22s ease, background .22s ease',
        fontFamily: 'system-ui',
      }}>

      {/* texto — aparece en hover */}
      <div style={{
        overflow: 'hidden',
        maxWidth: hovered ? 160 : 0,
        opacity: hovered ? 1 : 0,
        transition: 'max-width .28s ease, opacity .22s ease',
        paddingLeft: isLeft ? 0 : 14,
        paddingRight: isLeft ? 14 : 0,
        textAlign: isLeft ? 'right' : 'left',
        whiteSpace: 'nowrap',
      }}>
        <div style={{ fontSize: 9, fontWeight: 800, color: '#FB670B', letterSpacing: 1.8, textTransform: 'uppercase', lineHeight: 1.2 }}>
          {isLeft ? 'Anterior' : 'Siguiente'}
        </div>
        <div style={{ fontSize: 13, fontWeight: 900, color: '#111827', letterSpacing: -0.4, lineHeight: 1.3, textTransform: 'uppercase' }}>
          {catalog.title}
        </div>
      </div>

      {/* círculo naranja con flecha */}
      <div style={{
        width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
        background: 'linear-gradient(135deg, #FB670B 60%, #ff8c47 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 0 10px rgba(251,103,11,.5)',
        transition: 'box-shadow .2s',
      }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          {isLeft
            ? <polyline points="15 18 9 12 15 6" />
            : <polyline points="9 18 15 12 9 6" />}
        </svg>
      </div>
    </button>
  );
}

function CoverImage({ src, title, c }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    const inicial = (title || '?').trim().charAt(0).toUpperCase();
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, color: c.textSub }}>
        <div style={{ width: 56, height: 56, borderRadius: 14, background: 'rgba(251,103,11,.10)', color: c.orange, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 800 }}>{inicial}</div>
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: .4, textTransform: 'uppercase' }}>Sin imagen</span>
      </div>
    );
  }
  return (
    <img src={src} alt={title} loading="lazy" onError={() => setFailed(true)}
      style={{ maxWidth: '62%', maxHeight: '85%', objectFit: 'contain', filter: 'drop-shadow(0 12px 22px rgba(0,0,0,.16))' }} />
  );
}

function SkeletonCard({ c }) {
  return (
    <div style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 16, overflow: 'hidden' }}>
      <div style={{ height: 190, background: `linear-gradient(135deg, ${c.surface2} 0%, ${c.border} 100%)`, animation: 'pulse 1.6s ease-in-out infinite' }} />
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ height: 14, width: '55%', borderRadius: 5, background: c.border, animation: 'pulse 1.6s ease-in-out infinite' }} />
        <div style={{ height: 10, width: '40%', borderRadius: 5, background: c.surface2, animation: 'pulse 1.6s ease-in-out infinite' }} />
        <div style={{ height: 38, borderRadius: 10, background: c.surface2, marginTop: 10, animation: 'pulse 1.6s ease-in-out infinite' }} />
      </div>
    </div>
  );
}

function PencilIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );
}

function TranslateIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m5 8 6 6" /><path d="m4 14 6-6 2-3" /><path d="M2 5h12" /><path d="M7 2h1" />
      <path d="m22 22-5-10-5 10" /><path d="M14 18h6" />
    </svg>
  );
}

function EyeIcon({ size = 13 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
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
      {es !== undefined && <div style={{ fontSize: 11, color: c.textSub, lineHeight: 1.4 }}>{es}</div>}
      {area
        ? <textarea value={value} onChange={e => onChange(e.target.value)} rows={3} style={inputStyle} />
        : <input value={value} onChange={e => onChange(e.target.value)} style={inputStyle} />}
    </div>
  );
}
