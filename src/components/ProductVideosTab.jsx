// src/components/ProductVideosTab.jsx
// Admin: reemplazar los videos de fondo del carrusel de productos (home/
// productos/naturizable). Fuente: Bunny Stream, con respaldo local ya
// existente en public/videos/carrusel — nunca se queda sin video.
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { uploadFileToBunny, BUNNY_PULLZONE } from '../lib/bunny-upload-client.js';

const DARK_P  = { bg:'#0F0E0C', surface:'#181714', surface2:'#201F1C', surface3:'#2A2926', border:'rgba(236,235,224,0.11)', border2:'rgba(236,235,224,0.06)', text:'rgba(236,235,224,0.97)', textSub:'rgba(236,235,224,0.58)', textDim:'rgba(236,235,224,0.30)', orange:'#FB670B', okDim:'rgba(251,103,11,0.13)', errDim:'rgba(239,68,68,0.12)', err:'#EF4444' };
const LIGHT_P = { bg:'#F8F9FB', surface:'#FFFFFF', surface2:'#F8F9FB', surface3:'#F3F4F6', border:'#E5E7EB', border2:'#F3F4F6', text:'#111827', textSub:'#6B7280', textDim:'#9CA3AF', orange:'#FB670B', okDim:'rgba(251,103,11,0.08)', errDim:'rgba(220,38,38,0.08)', err:'#DC2626' };

const SLOTS = [
  { key: 'hero',               label: 'Hero (Home)',         group: 'Home' },
  { key: 'global',             label: 'Global / Presencia (Home)', group: 'Home' },
  { key: 'home-4k',            label: 'Parallax 4K (Home)',  group: 'Home' },
  { key: 'stretch-film',       label: 'Stretch Film',        group: 'Carrusel de productos' },
  { key: 'arpillas',           label: 'Arpilla',             group: 'Carrusel de productos' },
  { key: 'cuerdas',            label: 'Cuerda',              group: 'Carrusel de productos' },
  { key: 'rafias',             label: 'Rafia',                group: 'Carrusel de productos' },
  { key: 'sacos',              label: 'Saco',                group: 'Carrusel de productos' },
  { key: 'esquineros',         label: 'Esquinero',           group: 'Carrusel de productos' },
  { key: 'empaques-flexibles', label: 'Flexible',            group: 'Carrusel de productos' },
  { key: 'naturizable',        label: 'Naturizable',         group: 'Carrusel de productos' },
  { key: 'bolsas',             label: 'Bolsas',              group: 'Carrusel de productos' },
  { key: 'acolchado',          label: 'Acolchado',           group: 'Carrusel de productos' },
  { key: 'about-nosotros',     label: 'Quienes Somos (timeline)', group: 'Otras paginas' },
  { key: 'vacantes-hero',      label: 'Vacantes (hero)',     group: 'Otras paginas' },
  { key: 'social-hero',        label: 'Impacto Social (hero)', group: 'Otras paginas' },
  { key: 'social-oceanos',     label: 'Impacto Social (oceanos)', group: 'Otras paginas' },
  { key: 'impacto-oceancleanup', label: 'Impacto — Ocean Cleanup', group: 'Otras paginas' },
  { key: 'impacto-tomford',    label: 'Impacto — Tom Ford',  group: 'Otras paginas' },
  { key: 'impacto-hogar',      label: 'Impacto — Hogar de Esperanza', group: 'Otras paginas' },
  { key: 'pg-stretch-film',       label: 'Pagina Stretch Film (fondo)', group: 'Paginas de producto' },
  { key: 'pg-sacos-slaminar',     label: 'Pagina Sacos — Slaminar',     group: 'Paginas de producto' },
  { key: 'pg-sacos-transp',       label: 'Pagina Sacos — Transparente', group: 'Paginas de producto' },
  { key: 'pg-sacos-eco',          label: 'Pagina Sacos — Eco',          group: 'Paginas de producto' },
  { key: 'pg-flexible-bobinaf',   label: 'Pagina Flexible — Bobina',    group: 'Paginas de producto' },
  { key: 'pg-flexible-standup',   label: 'Pagina Flexible — Standup',   group: 'Paginas de producto' },
  { key: 'pg-flexible-standup-origanics', label: 'Pagina Flexible — Standup Organics', group: 'Paginas de producto' },
  { key: 'pg-flexible-bolsa-alto-vacio',  label: 'Pagina Flexible — Alto Vacio',       group: 'Paginas de producto' },
  { key: 'pg-esquineros',         label: 'Pagina Esquineros',           group: 'Paginas de producto' },
  { key: 'pg-arpilla-circular',   label: 'Pagina Arpilla — Circular',   group: 'Paginas de producto' },
  { key: 'pg-arpilla-mono',       label: 'Pagina Arpilla — Mono',       group: 'Paginas de producto' },
  { key: 'pg-arpilla-costura',    label: 'Pagina Arpilla — Costura',    group: 'Paginas de producto' },
  { key: 'pg-arpilla-etiqueta',   label: 'Pagina Arpilla — Etiqueta',   group: 'Paginas de producto' },
  { key: 'pg-cuerda-1',           label: 'Pagina Cuerda — 1',           group: 'Paginas de producto' },
  { key: 'pg-cuerda-i',           label: 'Pagina Cuerda — I',           group: 'Paginas de producto' },
  { key: 'pg-cuerda-e',           label: 'Pagina Cuerda — E',           group: 'Paginas de producto' },
  { key: 'pg-rafia-n',            label: 'Pagina Rafia — N',            group: 'Paginas de producto' },
  { key: 'pg-rafia-e',            label: 'Pagina Rafia — E',            group: 'Paginas de producto' },
  { key: 'pg-rafia-r',            label: 'Pagina Rafia — R',            group: 'Paginas de producto' },
  { key: 'pg-bolsas',             label: 'Pagina Bolsas (fondo)',       group: 'Paginas de producto' },
  { key: 'pg-acolchado',          label: 'Pagina Acolchado (fondo)',    group: 'Paginas de producto' },
];

function Spinner() {
  return <div style={{ width:14, height:14, borderRadius:'50%', border:'2px solid rgba(255,255,255,0.3)', borderTop:'2px solid #fff', animation:'spin 0.7s linear infinite' }}/>;
}

export default function ProductVideosTab({ theme = 'dark' }) {
  const P = theme === 'light' ? LIGHT_P : DARK_P;

  const [videos, setVideos] = useState({});
  const [loading, setLoading] = useState(true);
  const [uploadingSlot, setUploadingSlot] = useState(null);
  const [pct, setPct] = useState(0);
  const [errorBySlot, setErrorBySlot] = useState({});
  const fileInputRef = useRef(null);
  const pendingSlot = useRef(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch('/api/admin/product-videos', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'list' }) });
      const j = await r.json();
      if (j.ok) setVideos(j.videos || {});
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const pickFile = (slotKey) => {
    pendingSlot.current = slotKey;
    fileInputRef.current?.click();
  };

  const onFileChosen = async (e) => {
    const file = e.target.files?.[0] || null;
    e.target.value = '';
    const slotKey = pendingSlot.current;
    if (!file || !slotKey) return;
    if (!file.type.startsWith('video/')) {
      setErrorBySlot(s => ({ ...s, [slotKey]: 'El archivo debe ser un video.' }));
      return;
    }

    setUploadingSlot(slotKey);
    setPct(0);
    setErrorBySlot(s => ({ ...s, [slotKey]: null }));
    try {
      const up = await uploadFileToBunny(file, slotKey, setPct, '/api/admin/product-videos-bunny-sign');
      const r = await fetch('/api/admin/product-videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update', slotKey, bunnyVideoId: up.bunnyVideoId }),
      });
      const j = await r.json();
      if (!j.ok) throw new Error(j.error || 'Error al guardar.');
      setVideos(v => ({ ...v, [slotKey]: up.bunnyVideoId }));
    } catch (err) {
      setErrorBySlot(s => ({ ...s, [slotKey]: err.message || 'Error inesperado.' }));
    }
    setUploadingSlot(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <div style={{ fontSize: 15, fontWeight: 700, color: P.text }}>Videos del sitio</div>
        <div style={{ fontSize: 12, color: P.textSub, marginTop: 2 }}>
          Fondos de Home, Productos y Naturizable. Si Bunny falla, se usa el video local de respaldo — nunca se queda sin video.
        </div>
      </div>

      <input ref={fileInputRef} type="file" accept="video/*" onChange={onFileChosen} style={{ display: 'none' }} />

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', border: `2px solid ${P.border}`, borderTop: `2px solid ${P.orange}`, animation: 'spin 0.7s linear infinite' }}/>
        </div>
      ) : (
        Object.entries(
          SLOTS.reduce((acc, s) => { (acc[s.group] = acc[s.group] || []).push(s); return acc; }, {})
        ).map(([group, slots]) => (
          <div key={group} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: P.textSub, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{group}</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
              {slots.map(slot => {
                const bunnyId = videos[slot.key];
                const poster = bunnyId ? `https://${BUNNY_PULLZONE}/${bunnyId}/thumbnail.jpg` : '';
                const isUploading = uploadingSlot === slot.key;
                return (
                  <div key={slot.key} style={{ border: `1px solid ${P.border}`, borderRadius: 12, overflow: 'hidden', background: P.surface2 }}>
                    <div style={{ position: 'relative', aspectRatio: '16/9', background: '#000' }}>
                      {poster && <img src={poster} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />}
                      {isUploading && (
                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, color: '#fff', fontSize: 11 }}>
                          <Spinner /> {pct}%
                        </div>
                      )}
                    </div>
                    <div style={{ padding: '12px 14px' }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: P.text }}>{slot.label}</div>
                      <button onClick={() => pickFile(slot.key)} disabled={isUploading}
                        style={{ marginTop: 10, width: '100%', padding: '8px 0', borderRadius: 7, border: 'none',
                          background: isUploading ? P.surface3 : P.orange, color: isUploading ? P.textDim : '#fff',
                          fontSize: 11.5, fontWeight: 600, cursor: isUploading ? 'not-allowed' : 'pointer' }}>
                        {isUploading ? 'Subiendo...' : 'Reemplazar video'}
                      </button>
                      {errorBySlot[slot.key] && (
                        <div style={{ marginTop: 8, fontSize: 10.5, color: P.err }}>{errorBySlot[slot.key]}</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
