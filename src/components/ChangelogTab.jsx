// src/components/ChangelogTab.jsx
// Slide ejecutivo — tema oscuro igual al Resumen Ejecutivo

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import QRCode from 'qrcode';
import { Chart, registerables } from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';

Chart.register(...registerables);

// ─── Tema oscuro (igual que BotGO Resumen) ──────────────────────────────────
const D = {
  bg:       '#0F0E0C',
  surface:  '#181714',
  surface2: '#201F1C',
  surface3: '#2A2926',
  border:   'rgba(236,235,224,0.10)',
  border2:  'rgba(236,235,224,0.06)',
  text:     'rgba(236,235,224,0.97)',
  sub:      'rgba(236,235,224,0.70)',
  dim:      'rgba(236,235,224,0.42)',
  muted:    'rgba(236,235,224,0.22)',
  orange:   '#FB670B',
  orangeD:  '#D4530A',
  orangeL:  'rgba(251,103,11,0.13)',
  blue:     '#60A5FA',
  blueL:    'rgba(96,165,250,0.15)',
  green:    '#34D399',
  greenL:   'rgba(52,211,153,0.15)',
  purple:   '#A78BFA',
  purpleL:  'rgba(167,139,250,0.15)',
  amber:    '#FBBF24',
  amberL:   'rgba(251,191,36,0.15)',
  red:      '#F87171',
  redL:     'rgba(248,113,113,0.15)',
  cyan:     '#22D3EE',
};

const MEANINGFUL = ['feat','fix','perf','update','chore','docs'];
const TYPE_CFG = {
  feat:   { label:'Función nueva', color:D.green,  bg:D.greenL,  short:'FEAT' },
  fix:    { label:'Corrección',    color:D.blue,   bg:D.blueL,   short:'FIX'  },
  perf:   { label:'Rendimiento',   color:D.purple, bg:D.purpleL, short:'PERF' },
  update: { label:'Mejora',        color:D.orange, bg:D.orangeL, short:'UPD'  },
  chore:  { label:'Mant.',         color:D.dim,    bg:D.border2, short:'CHR'  },
  release:{ label:'Release',       color:D.amber,  bg:D.amberL,  short:'REL'  },
  docs:   { label:'Docs',          color:D.cyan,   bg:D.border,  short:'DOC'  },
  other:  { label:'General',       color:D.dim,    bg:D.border2, short:'UPD'  },
};
const AREA_COLORS = {
  Productos:D.green, Media:D.blue, 'i18n':D.amber,
  UI:D.purple, Performance:D.cyan, 'Admin/API':D.orange,
  Reclutamiento:'#F472B6', SEO:'#A3E635', General:D.dim,
};

function isoToday() { return new Date().toISOString().slice(0,10); }
function isoAgo(n)  { const d=new Date(); d.setDate(d.getDate()-n); return d.toISOString().slice(0,10); }

const PRESETS = [
  { id:'7d',  label:'7 días',  getRange:()=>({from:isoAgo(7),  to:isoToday()}) },
  { id:'30d', label:'30 días', getRange:()=>({from:isoAgo(30), to:isoToday()}) },
  { id:'60d', label:'2 meses', getRange:()=>({from:isoAgo(60), to:isoToday()}) },
  { id:'90d', label:'3 meses', getRange:()=>({from:isoAgo(90), to:isoToday()}) },
  { id:'all', label:'Todo',    getRange:()=>({from:'',         to:''}) },
];

function fmtDate(iso) {
  if (!iso) return '';
  try { return new Date(iso).toLocaleDateString('es-MX',{day:'2-digit',month:'short',year:'numeric'}); }
  catch { return iso; }
}

// ─── Slide de capturas: helpers ─────────────────────────────────────────────

// Paths relativos — el servidor añade el origin propio (localhost en dev, dominio en prod)
const AREA_PATHS = {
  'Productos':     '/es/productos/',
  'Media':         '/es/',
  'i18n':          '/es/',
  'General':       '/es/',
  'UI':            '/es/',
  'Reclutamiento': '/es/vacantes/',
  'Admin/API':     '/es/',
};

const KEYWORD_PATHS = [
  { kw:['bolsas','bolsa'],                   path:'/es/bolsas/',              label:'División Bolsas' },
  { kw:['cuerda','cuerdas'],                 path:'/es/cuerdas/',             label:'División Cuerdas' },
  { kw:['rafia','rafias'],                   path:'/es/rafias/',              label:'División Rafias' },
  { kw:['vacante','vacantes','candidat'],    path:'/es/vacantes/',            label:'Vacantes' },
  { kw:['nosotros','valores','trayectoria','about','historia'], path:'/es/about/', label:'Nosotros' },
  { kw:['catalogo','catálogo'],              path:'/es/catalogo/',            label:'Catálogo' },
  { kw:['acolchado','acolch'],               path:'/es/acolchado/',           label:'División Acolchado' },
  { kw:['arpilla','arpillas'],               path:'/es/arpillas/',            label:'División Arpillas' },
  { kw:['saco','sacos'],                     path:'/es/sacos/',               label:'División Sacos' },
  { kw:['esquinero','esquineros'],           path:'/es/esquineros/',          label:'Esquineros' },
  { kw:['stretch','film'],                   path:'/es/stretch-film/',        label:'Stretch Film' },
  { kw:['social','hogar','video'],           path:'/es/social/',              label:'Social' },
  { kw:['producto','carrusel','carousel'],   path:'/es/productos/',           label:'Productos' },
];

function buildTargetsFromCommits(commitList) {
  const seen = new Set();
  const targets = [];

  // Páginas SIEMPRE visibles: home (divisiones carousel) + acolchado si hay cambios visuales
  // El home muestra el carrusel de divisiones con todas las secciones nuevas
  seen.add('/es/'); targets.push({ path: '/es/', label: 'Carrusel Divisiones' });

  for (const c of commitList) {
    const msgLow = (c.message || '').toLowerCase();
    let added = false;
    for (const { kw, path, label } of KEYWORD_PATHS) {
      if (kw.some(k => msgLow.includes(k)) && !seen.has(path)) {
        seen.add(path); targets.push({ path, label }); added = true; break;
      }
    }
    if (!added) {
      const fb = AREA_PATHS[c.area] || '/es/';
      if (!seen.has(fb)) { seen.add(fb); targets.push({ path: fb, label: c.area || 'Home' }); }
    }
    if (targets.length >= 6) break;
  }

  // Si hay commits de acolchado/divisiones nuevas y aún no está en targets, agregar
  const hasAcolchado = commitList.some(c => /acolch/i.test(c.message));
  if (hasAcolchado && !seen.has('/es/acolchado/')) {
    seen.add('/es/acolchado/'); targets.push({ path: '/es/acolchado/', label: 'División Acolchado' });
  }

  return targets.slice(0, 6);
}

async function fetchAsBase64(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const blob = await res.blob();
    return new Promise(resolve => {
      const r = new FileReader();
      r.onloadend = () => resolve(r.result);
      r.onerror   = () => resolve(null);
      r.readAsDataURL(blob);
    });
  } catch { return null; }
}

function getISOWeek(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
}

function buildPresentationHTML({ screenshots, commits, weekLabel, fontBase64, logoBase64 }) {
  const OR = '#FB670B', BK = '#262626', CR = '#ECEBE0', GR = '#535353';

  const fontFace = fontBase64
    ? `@font-face{font-family:'MorganitePro';src:url('${fontBase64}') format('opentype');font-weight:800;font-style:normal;}`
    : '';

  const logoImg = logoBase64
    ? `<img src="${logoBase64}" style="height:40px;object-fit:contain;display:block;"/>`
    : `<span style="font-family:'MorganitePro',sans-serif;font-size:32px;font-weight:800;color:${OR};">GO</span>`;

  const totalImp = commits.filter(c => ['feat','fix','perf','update'].includes(c.type)).length;
  const uniqueAreas = [...new Set(commits.map(c => c.area))].length;
  const uniquePages = screenshots.length;

  // Deduplicar por URL para evitar repetición si hay varios commits de la misma página
  const half = Math.ceil(screenshots.length / 2);
  const leftShots  = screenshots.slice(0, half);
  const rightShots = screenshots.slice(half);

  function card(shot, idx) {
    const imgTag = shot.base64
      ? `<img src="data:image/jpeg;base64,${shot.base64}" style="width:100%;height:186px;object-fit:cover;object-position:top center;border-radius:6px;border:1px solid ${CR};display:block;flex-shrink:0;" loading="eager"/>`
      : `<div style="width:100%;height:186px;background:#f0efe6;border-radius:6px;border:1px solid ${CR};display:flex;align-items:center;justify-content:center;flex-shrink:0;"><span style="color:#aaa;font-size:10px;font-family:Helvetica,sans-serif;">Sin captura</span></div>`;
    return `
    <div style="display:flex;flex-direction:column;gap:7px;margin-bottom:14px;">
      <div style="display:flex;align-items:center;gap:8px;">
        <div style="width:22px;height:22px;border-radius:50%;background:${BK};display:flex;align-items:center;justify-content:center;flex-shrink:0;">
          <span style="color:white;font-size:11px;font-weight:800;font-family:'MorganitePro',Helvetica,sans-serif;line-height:1;">${idx+1}</span>
        </div>
        <span style="font-family:'MorganitePro',Helvetica,sans-serif;font-size:15px;font-weight:800;color:${OR};text-transform:uppercase;letter-spacing:0.07em;line-height:1;">${shot.label}</span>
      </div>
      ${imgTag}
    </div>`;
  }

  return `<!DOCTYPE html><html><head><meta charset="UTF-8"/>
<style>
${fontFace}
*{box-sizing:border-box;margin:0;padding:0;}
body{width:1440px;height:810px;background:white;overflow:hidden;font-family:Helvetica,Arial,sans-serif;}
@page{size:1440px 810px;margin:0;}
</style></head>
<body>
<div style="width:1440px;height:810px;background:white;display:flex;flex-direction:column;overflow:hidden;">

  <div style="display:flex;align-items:center;justify-content:space-between;padding:18px 36px 16px;border-bottom:2px solid ${CR};flex-shrink:0;">
    <div style="display:flex;align-items:center;gap:14px;">
      ${logoImg}
      <div style="width:1px;height:38px;background:${CR};"></div>
      <div>
        <div style="font-family:'MorganitePro',Helvetica,sans-serif;font-size:44px;font-weight:800;line-height:1;color:${BK};text-transform:uppercase;letter-spacing:0.01em;">REPORTE SEMANAL</div>
        <div style="font-family:'MorganitePro',Helvetica,sans-serif;font-size:22px;font-weight:800;color:${OR};text-transform:uppercase;letter-spacing:0.09em;line-height:1;margin-top:2px;">CAMBIOS WEB · GO</div>
      </div>
    </div>
    <div style="background:${BK};color:white;padding:9px 22px;border-radius:999px;font-family:'MorganitePro',Helvetica,sans-serif;font-size:20px;font-weight:800;letter-spacing:0.07em;text-transform:uppercase;">
      ${weekLabel}
    </div>
  </div>

  <div style="flex:1;display:flex;overflow:hidden;min-height:0;">

    <div style="flex:1;padding:18px 16px 14px 36px;overflow:hidden;border-right:1px solid ${CR};">
      ${leftShots.map((s,i) => card(s, i)).join('')}
    </div>

    ${rightShots.length ? `
    <div style="flex:1;padding:18px 16px 14px 20px;overflow:hidden;border-right:1px solid ${CR};">
      ${rightShots.map((s,i) => card(s, leftShots.length + i)).join('')}
    </div>` : ''}

    <div style="width:218px;flex-shrink:0;padding:22px 24px;display:flex;flex-direction:column;justify-content:center;align-items:center;gap:18px;background:${CR};">
      <div style="font-family:'MorganitePro',Helvetica,sans-serif;font-size:15px;font-weight:800;color:${BK};text-transform:uppercase;letter-spacing:0.11em;text-align:center;line-height:1.25;">RESUMEN<br/>DE LA SEMANA</div>
      <div style="width:100%;height:1px;background:rgba(38,38,38,0.18);"></div>
      <div style="text-align:center;">
        <div style="font-family:'MorganitePro',Helvetica,sans-serif;font-size:78px;font-weight:800;color:${OR};line-height:1;">${totalImp}</div>
        <div style="font-size:8.5px;font-weight:700;color:${GR};text-transform:uppercase;letter-spacing:0.13em;margin-top:3px;font-family:Helvetica,sans-serif;">CAMBIOS IMPORTANTES</div>
      </div>
      <div style="text-align:center;">
        <div style="font-family:'MorganitePro',Helvetica,sans-serif;font-size:78px;font-weight:800;color:${OR};line-height:1;">${uniquePages}</div>
        <div style="font-size:8.5px;font-weight:700;color:${GR};text-transform:uppercase;letter-spacing:0.13em;margin-top:3px;font-family:Helvetica,sans-serif;">SECCIONES REFINADAS</div>
      </div>
      <div style="text-align:center;">
        <div style="font-family:'MorganitePro',Helvetica,sans-serif;font-size:78px;font-weight:800;color:${BK};line-height:1;">${uniqueAreas}</div>
        <div style="font-size:8.5px;font-weight:700;color:${GR};text-transform:uppercase;letter-spacing:0.13em;margin-top:3px;font-family:Helvetica,sans-serif;">ÁREAS</div>
      </div>
    </div>

  </div>
</div>
</body></html>`;
}

// ─── Componentes de UI ───────────────────────────────────────────────────────
const KpiChip = ({ value, label, color }) => (
  <div style={{display:'flex',flexDirection:'column',alignItems:'center',padding:'0 11px'}}>
    <span style={{color,fontSize:16,fontFamily:"'DM Mono',monospace,sans-serif",fontWeight:800,letterSpacing:'-0.04em',lineHeight:1}}>{value}</span>
    <span style={{color:D.dim,fontSize:7,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.09em',marginTop:2}}>{label}</span>
  </div>
);
const VDiv = () => <div style={{width:1,height:26,background:D.border}}/>;

const SecLabel = ({ label, color=D.orange, right }) => (
  <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:6}}>
    <div style={{display:'flex',alignItems:'center',gap:6}}>
      <span style={{color,fontSize:8,fontWeight:700,lineHeight:1}}>|</span>
      <span style={{color:D.sub,fontSize:7.5,fontWeight:700,lineHeight:1,textTransform:'uppercase',letterSpacing:'0.12em'}}>{label}</span>
    </div>
    {right && <span style={{color:D.muted,fontSize:7.5,lineHeight:1}}>{right}</span>}
  </div>
);

// ─── Componente principal ────────────────────────────────────────────────────
export default function ChangelogTab({ P, theme }) {
  const [allData, setAllData]           = useState(null);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [preset, setPreset]             = useState('30d');
  const [range, setRange]               = useState(PRESETS.find(p=>p.id==='30d').getRange());
  const [customFrom, setCustomFrom]     = useState('');
  const [customTo, setCustomTo]         = useState('');
  const [typeFilter, setTypeFilter]     = useState('all');
  const [downloading, setDownloading]   = useState(null); // null | 'pdf' | 'img' | 'slide'
  const [gitChanges, setGitChanges]     = useState([]);   // cambios sin commit
  const [whiteLogoUrl, setWhiteLogoUrl] = useState('');  // logo invertido para exports
  const [qrDataUrl, setQrDataUrl]       = useState('');
  const slideRef = useRef(null);

  // Genera QR hacia grupo-ortiz.com/es/
  useEffect(() => {
    QRCode.toDataURL('https://grupo-ortiz.com/es/', {
      width: 120, margin: 1,
      color: { dark: '#ECEBE0', light: '#0F0E0C' },
    }).then(url => setQrDataUrl(url)).catch(()=>{});
  }, []);

  // Pre-renderiza el logo negro como blanco (html2canvas no aplica CSS filter)
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      const c = document.createElement('canvas');
      c.width = img.naturalWidth || 300; c.height = img.naturalHeight || 100;
      const ctx = c.getContext('2d');
      ctx.drawImage(img, 0, 0);
      ctx.globalCompositeOperation = 'source-in';
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, c.width, c.height);
      setWhiteLogoUrl(c.toDataURL('image/png'));
    };
    img.src = '/images/logo/logoN.png';
  }, []);

  useEffect(() => {
    fetch('/changelog.json', { cache:'no-store' })
      .then(r => { if (!r.ok) throw new Error('404'); return r.json(); })
      .then(d => { setAllData(d); setLoading(false); })
      .catch(e => { setError(e.message); setLoading(false); });
  }, []);

  // Cargar cambios sin commit desde git status (solo disponible en dev/local)
  useEffect(() => {
    fetch('/api/reports/git-status', { credentials: 'include' })
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d?.ok && d.changes?.length) setGitChanges(d.changes); })
      .catch(() => {}); // silencioso si no está disponible (producción)
  }, []);

  // ── Commits filtrados ────────────────────────────────────────────────────
  const commits = useMemo(() => {
    if (!allData?.commits) return [];
    return allData.commits.filter(c => {
      if (range?.from && c.date < range.from) return false;
      if (range?.to   && c.date > range.to)   return false;
      return true;
    });
  }, [allData, range]);

  // ── Stats recalculados ───────────────────────────────────────────────────
  const stats = useMemo(() => {
    const s = { total:0, byType:{}, byArea:{}, byMonth:{}, byAreaType:{} };
    commits.forEach(c => {
      s.total++;
      s.byType[c.type]  = (s.byType[c.type]||0)+1;
      s.byArea[c.area]  = (s.byArea[c.area]||0)+1;
      const month = c.date.slice(0,7);
      s.byMonth[month]  = (s.byMonth[month]||0)+1;
      if (!s.byAreaType[c.area]) s.byAreaType[c.area] = {};
      s.byAreaType[c.area][c.type] = (s.byAreaType[c.area][c.type]||0)+1;
    });
    return s;
  }, [commits]);

  // ── Datos diarios para línea ─────────────────────────────────────────────
  const daily = useMemo(() => {
    if (!commits.length) return { labels:[], data:[] };
    const map = {};
    commits.forEach(c => { map[c.date]=(map[c.date]||0)+1; });
    const start = new Date(range?.from || commits[commits.length-1]?.date || isoAgo(30));
    const end   = new Date(range?.to   || commits[0]?.date               || isoToday());
    const dates = [];
    for (let cur=new Date(start); cur<=end; cur.setDate(cur.getDate()+1))
      dates.push(cur.toISOString().slice(0,10));
    return {
      labels: dates.map(d=>{ const [,m,day]=d.split('-'); return `${m}/${day}`; }),
      data:   dates.map(d=>map[d]||0),
      peak:   Math.max(...dates.map(d=>map[d]||0),0),
    };
  }, [commits, range]);

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handlePreset = useCallback(p => {
    setPreset(p.id);
    setRange(p.getRange());
  }, []);

  const handleApplyCustom = useCallback(() => {
    if (customFrom && customTo) { setRange({from:customFrom, to:customTo}); setPreset('custom'); }
  }, [customFrom, customTo]);

  // ── Captura el slide completo sin recortes ────────────────────────────────────
  // Estrategia: clonar el slideRef en document.body (fuera del panel con overflow:hidden),
  // capturar el clon, y eliminarlo. Evita todos los problemas de overflow del contenedor.
  const capture = useCallback(async () => {
    const { toPng } = await import('html-to-image');
    const el = slideRef.current;
    const PIXEL_RATIO = 2;

    const cssW = el.offsetWidth;
    const cssH = el.offsetHeight;

    // html-to-image captura el elemento exactamente como se ve en el browser,
    // sin problemas de overflow ni posición de scroll de ancestors
    const dataUrl = await toPng(el, {
      pixelRatio:      PIXEL_RATIO,
      backgroundColor: '#0F0E0C',
      width:           cssW,
      height:          cssH,
      style: {
        overflow: 'hidden',
      },
    });

    // Convertir dataURL a canvas para mantener la misma interfaz
    const canvas = await new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const c = document.createElement('canvas');
        c.width  = cssW * PIXEL_RATIO;
        c.height = cssH * PIXEL_RATIO;
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        resolve(c);
      };
      img.onerror = reject;
      img.src = dataUrl;
    });

    return { canvas, cssW, cssH };
  }, []);

  const handleDownload = useCallback(async () => {
    if (!slideRef.current || downloading) return;
    setDownloading('pdf');
    try {
      const { canvas, cssW, cssH } = await capture();
      const wMm = cssW * 0.264583;
      const hMm = cssH * 0.264583;
      const { jsPDF } = await import('jspdf').catch(() => ({ jsPDF: null }));
      if (jsPDF) {
        const pdf = new jsPDF({ unit:'mm', format:[wMm, hMm] });
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, wMm, hMm, '', 'NONE');
        pdf.save(`historial-mejoras-${isoToday()}.pdf`);
      } else {
        const { default: html2pdf } = await import('html2pdf.js');
        await html2pdf().set({
          margin:      [0,0,0,0],
          filename:    `historial-mejoras-${isoToday()}.pdf`,
          image:       { type:'png' },
          html2canvas: { scale:2, useCORS:true, allowTaint:true, logging:false,
                         backgroundColor:'#0F0E0C', width:cssW, height:cssH },
          jsPDF:       { unit:'mm', format:[wMm, hMm] },
          pagebreak:   { mode:'avoid-all' },
        }).from(slideRef.current).save();
      }
    } catch(e) { console.error('[ChangelogTab pdf]', e); }
    setDownloading(null);
  }, [downloading, capture]);

  const handleExportImage = useCallback(async () => {
    if (!slideRef.current || downloading) return;
    setDownloading('img');
    try {
      const { canvas } = await capture();
      const link = document.createElement('a');
      link.download = `historial-mejoras-${isoToday()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch(e) { console.error('[ChangelogTab img]', e); }
    setDownloading(null);
  }, [downloading, capture]);

  const handlePresentationPDF = useCallback(async () => {
    if (downloading || commits.length === 0) return;
    setDownloading('slide');
    try {
      // Combinar targets de commits + cambios sin commit (git status)
      const targets = buildTargetsFromCommits(commits);
      // Agregar páginas con cambios sin commit que no estén ya en targets
      const seenPaths = new Set(targets.map(t => t.path));
      for (const gc of gitChanges) {
        if (!seenPaths.has(gc.path) && targets.length < 6) {
          seenPaths.add(gc.path);
          targets.push({ path: gc.path, label: gc.label + ' ★' });
        }
      }
      if (!targets.length) { alert('Sin páginas detectadas.'); setDownloading(null); return; }

      const now = new Date();
      const weekLabel = `SEMANA ${getISOWeek(now)} · ${now.getFullYear()}`;

      // Endpoint unificado: hace screenshots + renderiza el slide + devuelve PNG
      // Todo ocurre en el mismo proceso Puppeteer → sin problemas de data-URL
      const res = await fetch('/api/reports/capture-slide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paths:     targets.map(t => t.path),
          labels:    targets.map(t => t.label),
          weekLabel,
          commits,
        }),
        credentials: 'include',
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Error generando slide');
      }

      const pngBlob = await res.blob();
      const pngUrl  = URL.createObjectURL(pngBlob);

      // Convertir PNG → PDF landscape con jsPDF
      const { jsPDF } = await import('jspdf').catch(() => ({ jsPDF: null }));
      if (jsPDF) {
        const W = 1440, H = 810;
        const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [W, H] });
        await new Promise(resolve => {
          const img = new Image();
          img.onload = () => { pdf.addImage(img, 'PNG', 0, 0, W, H, '', 'FAST'); resolve(); };
          img.onerror = () => resolve();
          img.src = pngUrl;
        });
        pdf.save(`slide-cambios-${isoToday()}.pdf`);
      } else {
        const a = document.createElement('a');
        a.href = pngUrl; a.download = `slide-cambios-${isoToday()}.png`; a.click();
      }
      URL.revokeObjectURL(pngUrl);
    } catch(e) {
      console.error('[ChangelogTab slide]', e);
      alert('Error: ' + (e.message || e));
    }
    setDownloading(null);
  }, [downloading, commits]);

  // ── Datos gráficas ────────────────────────────────────────────────────────
  const donutEntries    = MEANINGFUL.filter(t=>(stats.byType[t]||0)>0);
  const meaningfulTotal = donutEntries.reduce((s,t)=>s+(stats.byType[t]||0),0);

  const donutData = {
    labels:   donutEntries.map(t=>TYPE_CFG[t].label),
    datasets:[{
      data:            donutEntries.map(t=>stats.byType[t]||0),
      backgroundColor: donutEntries.map(t=>TYPE_CFG[t].color),
      borderWidth:2, borderColor:D.surface, hoverOffset:4,
    }],
  };
  const donutOpts = {
    responsive:true, maintainAspectRatio:false, animation:{duration:0},
    devicePixelRatio: 3,
    cutout:'64%',
    plugins:{ legend:{ display:false }, tooltip:{ enabled:true } },
  };

  const lineData = {
    labels: daily.labels,
    datasets:[{
      label:'Commits',
      data:             daily.data,
      borderColor:      D.orange,
      backgroundColor:  'rgba(251,103,11,0.18)',
      fill:             true,
      tension:          0.35,
      pointRadius:      daily.labels.length > 30 ? 0 : 3,
      pointHoverRadius: 5,
      pointBackgroundColor: D.orange,
      pointBorderColor:     D.surface,
      pointBorderWidth:     1.5,
      borderWidth:      2,
    }],
  };
  const lineOpts = {
    responsive:true, maintainAspectRatio:false, animation:{duration:0},
    devicePixelRatio: 3,
    plugins:{ legend:{ display:false } },
    scales:{
      x:{
        grid:{ color:'rgba(255,255,255,0.05)', borderDash:[3,3] },
        ticks:{ color:D.dim, font:{size:7.5}, maxTicksLimit:14, maxRotation:0 },
        border:{ color:D.border },
      },
      y:{
        beginAtZero:true,
        grid:{ color:'rgba(255,255,255,0.05)', borderDash:[3,3] },
        ticks:{ color:D.dim, font:{size:7.5}, padding:4, stepSize:1 },
        border:{ display:false },
      },
    },
  };

  // ── Cuellos de botella ────────────────────────────────────────────────────
  const bottlenecks = Object.entries(stats.byAreaType||{})
    .filter(([k])=>k!=='General')
    .map(([area,types])=>{
      const fixes=types.fix||0, feats=types.feat||0;
      const total=Object.values(types).reduce((s,v)=>s+v,0);
      return { area, fixes, feats, total, fixRatio:fixes/Math.max(total,1) };
    })
    .sort((a,b)=>b.fixRatio-a.fixRatio);

  const techDebtPct = Math.round((stats.byType.fix||0)/Math.max(meaningfulTotal,1)*100);

  const areaEntries = Object.entries(stats.byArea)
    .filter(([k])=>k!=='General').sort(([,a],[,b])=>b-a)
    .concat(Object.entries(stats.byArea).filter(([k])=>k==='General'));
  const areaMax = areaEntries[0]?.[1]||1;

  const meaningful = commits.filter(c=>MEANINGFUL.includes(c.type));
  const filtered   = typeFilter==='all' ? meaningful : meaningful.filter(c=>c.type===typeFilter);
  const timeline   = filtered.slice(0,6);

  // Datos para secciones ejecutivas
  const featList  = commits.filter(c=>c.type==='feat');
  const fixList   = commits.filter(c=>c.type==='fix');
  const perfList  = commits.filter(c=>c.type==='perf');
  const updList   = commits.filter(c=>c.type==='update'||c.type==='chore');
  // Cambios más importantes: feat primero, luego perf, luego fix
  const topChanges = [
    ...featList,
    ...perfList,
    ...fixList,
  ].slice(0, 6);

  const rangeLabel = range?.from
    ? `${fmtDate(range.from)} — ${fmtDate(range.to||isoToday())}`
    : 'Todo el historial';
  const genDate = allData?.generatedAt ? fmtDate(allData.generatedAt) : fmtDate(isoToday());

  // ── Render de estado ─────────────────────────────────────────────────────
  if (loading) return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',padding:60}}>
      <div style={{width:22,height:22,border:`2.5px solid ${P.border}`,borderTopColor:P.orange,
        borderRadius:'50%',animation:'spin 0.8s linear infinite'}}/>
    </div>
  );

  if (error) return (
    <div style={{textAlign:'center',padding:50}}>
      <div style={{color:P.text,fontSize:11,marginBottom:10}}>No se encontró el historial de cambios</div>
      <div style={{color:P.textDim,fontSize:9,marginBottom:10}}>Genera el archivo ejecutando:</div>
      <code style={{background:P.surface2,padding:'5px 12px',borderRadius:6,color:P.orange,fontSize:10}}>
        node scripts/gen-changelog.mjs
      </code>
    </div>
  );

  // ── UI ───────────────────────────────────────────────────────────────────
  return (
    <div>
      {/* ── CONTROLES ── */}
      <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:12,
        padding:'10px 14px',background:P.surface,border:`1px solid ${P.border}`,borderRadius:10,flexWrap:'wrap'}}>
        <span style={{color:P.textDim,fontSize:9,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.08em',flexShrink:0}}>Período:</span>
        <div style={{display:'flex',gap:3}}>
          {PRESETS.map(p=>{
            const active=preset===p.id;
            return (
              <button key={p.id} onClick={()=>handlePreset(p)}
                style={{padding:'5px 11px',borderRadius:7,fontSize:10,fontWeight:600,cursor:'pointer',border:'none',
                  background:active?P.orange:P.surface2,color:active?'#fff':P.textSub,
                  boxShadow:active?`0 2px 8px ${P.orange}40`:'none',transition:'all 0.12s'}}>
                {p.label}
              </button>
            );
          })}
        </div>
        <div style={{width:1,height:20,background:P.border,flexShrink:0}}/>
        <div style={{display:'flex',alignItems:'center',gap:6}}>
          <span style={{color:P.textDim,fontSize:9}}>Desde</span>
          <input type="date" value={customFrom} onChange={e=>setCustomFrom(e.target.value)} max={customTo||isoToday()}
            style={{padding:'4px 8px',borderRadius:6,border:`1px solid ${P.border}`,
              background:P.bg,color:P.text,fontSize:10,cursor:'pointer',outline:'none'}}/>
          <span style={{color:P.textDim,fontSize:9}}>hasta</span>
          <input type="date" value={customTo} onChange={e=>setCustomTo(e.target.value)} min={customFrom} max={isoToday()}
            style={{padding:'4px 8px',borderRadius:6,border:`1px solid ${P.border}`,
              background:P.bg,color:P.text,fontSize:10,cursor:'pointer',outline:'none'}}/>
          <button onClick={handleApplyCustom} disabled={!customFrom||!customTo}
            style={{padding:'5px 11px',borderRadius:7,fontSize:10,fontWeight:700,cursor:'pointer',
              border:`1px solid ${P.orange}50`,background:P.okDim,color:P.orange,
              opacity:(!customFrom||!customTo)?0.4:1,transition:'all 0.12s'}}>
            Aplicar
          </button>
        </div>
        <div style={{width:1,height:20,background:P.border,flexShrink:0}}/>
        <span style={{color:P.textDim,fontSize:9,flex:1}}>
          <strong style={{color:P.orange,fontFamily:"'DM Mono',monospace"}}>{commits.length}</strong> cambios en el período
        </span>
        <div style={{display:'flex',gap:6,flexShrink:0}}>
          <button onClick={handleDownload} disabled={!!downloading||commits.length===0}
            style={{display:'flex',alignItems:'center',gap:5,padding:'7px 13px',borderRadius:8,
              border:`1.5px solid ${P.orange}60`,background:'transparent',color:P.orange,
              fontSize:10,fontWeight:700,lineHeight:1,cursor:downloading?'wait':'pointer',
              opacity:commits.length===0?0.4:1,transition:'all 0.12s'}}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{display:'block',flexShrink:0}}>
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            {downloading==='pdf'?'Generando…':'PDF'}
          </button>
          <button onClick={handleExportImage} disabled={!!downloading||commits.length===0}
            style={{display:'flex',alignItems:'center',gap:5,padding:'7px 13px',borderRadius:8,
              border:`1.5px solid ${P.blue||'#60A5FA'}60`,background:'transparent',color:P.blue||'#60A5FA',
              fontSize:10,fontWeight:700,lineHeight:1,cursor:downloading?'wait':'pointer',
              opacity:commits.length===0?0.4:1,transition:'all 0.12s'}}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{display:'block',flexShrink:0}}>
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
            {downloading==='img'?'Exportando…':'PNG HD'}
          </button>
          <button onClick={handlePresentationPDF} disabled={!!downloading||commits.length===0}
            title="Genera un slide con capturas reales de las páginas que cambiaron"
            style={{display:'flex',alignItems:'center',gap:5,padding:'7px 13px',borderRadius:8,
              border:`1.5px solid #FB670B`,background:downloading==='slide'?'rgba(251,103,11,0.12)':'transparent',
              color:'#FB670B',fontSize:10,fontWeight:700,lineHeight:1,
              cursor:downloading?'wait':'pointer',opacity:commits.length===0?0.4:1,transition:'all 0.12s'}}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{display:'block',flexShrink:0}}>
              <rect x="2" y="3" width="20" height="14" rx="2"/>
              <polyline points="8 21 12 17 16 21"/>
              <line x1="12" y1="17" x2="12" y2="3"/>
            </svg>
            {downloading==='slide'?'Capturando…':'Slide Capturas'}
          </button>
        </div>
      </div>

      {commits.length===0 && (
        <div style={{textAlign:'center',padding:'30px',background:P.surface,
          border:`1px solid ${P.border}`,borderRadius:10,color:P.textDim,fontSize:11}}>
          Sin cambios en el período · Elige un rango más amplio
        </div>
      )}

      {/* ══ SLIDE PDF ═══════════════════════════════════════════════════════ */}
      {commits.length>0 && (
      <div ref={slideRef} style={{
        background:D.bg, color:D.text,
        fontFamily:"'Inter','Helvetica Neue',Arial,sans-serif",
        overflow:'hidden',
      }}>

        {/* HEADER */}
        <div style={{padding:'9px 18px',borderBottom:`1px solid ${D.border}`,
          display:'flex',alignItems:'center',justifyContent:'space-between',
          background:D.surface}}>
          <div style={{display:'flex',alignItems:'center',gap:12}}>
            <img src={whiteLogoUrl||'/images/logo/logoN.png'} alt="GO"
              style={{height:28,objectFit:'contain',opacity:0.9,
                filter:whiteLogoUrl?'none':'brightness(0) invert(1)'}}/>
            <div style={{width:1,height:24,background:D.border}}/>
            <div>
              <div style={{color:D.orange,fontSize:7.5,fontWeight:800,textTransform:'uppercase',letterSpacing:'0.16em'}}>
                Dashboard de Avances · BotGO
              </div>
              <div style={{color:D.text,fontSize:12,fontWeight:700,letterSpacing:'-0.025em',lineHeight:1.1,marginTop:1}}>
                Historial de Mejoras Web · Grupo Ortiz
              </div>
            </div>
          </div>

          <div style={{display:'flex',alignItems:'center',gap:0}}>
            <KpiChip value={stats.total}           label="Cambios"  color={D.orange}/>
            <VDiv/>
            <KpiChip value={stats.byType.feat||0}  label="Funciones"     color={D.green}/>
            <VDiv/>
            <KpiChip value={stats.byType.fix||0}   label="Correcciones"  color={D.blue}/>
            <VDiv/>
            <KpiChip value={stats.byType.perf||0}  label="Rendimiento"   color={D.purple}/>
            <VDiv/>
            <KpiChip value={(stats.byType.update||0)+(stats.byType.chore||0)} label="Mejoras" color={D.amber}/>
            <VDiv/>
            <KpiChip value={5} label="Idiomas" color={D.cyan}/>
          </div>

          <div style={{textAlign:'right',borderLeft:`1px solid ${D.border}`,paddingLeft:14}}>
            <div style={{color:D.muted,fontSize:7,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.12em'}}>Período</div>
            <div style={{color:D.text,fontSize:9.5,fontWeight:700,letterSpacing:'-0.01em',marginTop:2}}>{rangeLabel}</div>
            <div style={{color:D.muted,fontSize:7,marginTop:2}}>Actualizado {genDate}</div>
          </div>
        </div>

        {/* ACCENT LINE */}
        <div style={{height:2,background:`linear-gradient(90deg,${D.orange},${D.amber},transparent)`}}/>

        {/* BODY 2×2 */}
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gridTemplateRows:'220px 180px'}}>

          {/* Celda 1: Gráfica línea diaria */}
          <div style={{padding:'10px 16px',borderRight:`1px solid ${D.border}`,borderBottom:`1px solid ${D.border}`,
            display:'flex',flexDirection:'column'}}>
            <SecLabel label="Actividad · Commits por día" right={`${stats.total} commits en el período`}/>
            <div style={{display:'flex',gap:14,marginBottom:5,alignItems:'center',flexShrink:0}}>
              <div style={{display:'flex',alignItems:'center',gap:5}}>
                <svg width="20" height="4"><line x1="0" y1="2" x2="20" y2="2" stroke={D.orange} strokeWidth="2"/><circle cx="10" cy="2" r="2.5" fill={D.orange}/></svg>
                <span style={{color:D.dim,fontSize:8}}>Commits</span>
              </div>
              {daily.peak>0 && (
                <span style={{color:D.dim,fontSize:8}}>
                  Pico: <strong style={{color:D.orange,fontFamily:"'DM Mono',monospace"}}>{daily.peak}</strong>
                </span>
              )}
            </div>
            <div style={{flex:1,minHeight:0}}>
              <Line data={lineData} options={lineOpts}/>
            </div>
          </div>

          {/* Celda 2: Por área */}
          <div style={{padding:'10px 16px',borderBottom:`1px solid ${D.border}`,
            display:'flex',flexDirection:'column'}}>
            <SecLabel label="Actividad · Por área"
              right={`${Object.keys(stats.byArea).filter(k=>k!=='General').length} áreas activas`}/>
            <div style={{flex:1,display:'flex',flexDirection:'column',justifyContent:'space-evenly'}}>
              {areaEntries.map(([area,count])=>(
                <div key={area}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:3}}>
                    <span style={{color:D.sub,fontSize:9,lineHeight:1}}>{area}</span>
                    <div style={{display:'flex',alignItems:'center',gap:10}}>
                      <span style={{color:D.dim,fontSize:8,lineHeight:1}}>{stats.total>0?Math.round(count/stats.total*100):0}%</span>
                      <span style={{color:AREA_COLORS[area]||D.orange,fontSize:9.5,fontWeight:700,lineHeight:1,
                        fontFamily:"'DM Mono',monospace",minWidth:20,textAlign:'right'}}>{count}</span>
                    </div>
                  </div>
                  <div style={{height:3,borderRadius:3,background:D.border2}}>
                    <div style={{height:'100%',width:`${(count/areaMax)*100}%`,borderRadius:3,
                      background:AREA_COLORS[area]||D.orange}}/>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Celda 3: Donut distribución por tipo */}
          <div style={{padding:'10px 16px',borderRight:`1px solid ${D.border}`,
            display:'flex',flexDirection:'column'}}>
            <SecLabel label="Distribución de cambios · Por tipo" color={D.orange}/>
            <div style={{flex:1,display:'flex',alignItems:'center',gap:16,minHeight:0}}>
              {/* Donut */}
              <div style={{width:130,height:130,flexShrink:0,position:'relative'}}>
                <Doughnut data={donutData} options={donutOpts}/>
                <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',
                  alignItems:'center',justifyContent:'center',pointerEvents:'none'}}>
                  <span style={{color:D.orange,fontSize:22,fontFamily:"'DM Mono',monospace",fontWeight:800,lineHeight:1}}>{meaningfulTotal}</span>
                  <span style={{color:D.dim,fontSize:7.5,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.08em',marginTop:2}}>cambios</span>
                </div>
              </div>
              {/* Leyenda */}
              <div style={{flex:1,display:'flex',flexDirection:'column',gap:7}}>
                {[
                  { key:'feat',   label:'Funciones nuevas',   color:D.green,  n:featList.length  },
                  { key:'fix',    label:'Correcciones',        color:D.blue,   n:fixList.length   },
                  { key:'perf',   label:'Rendimiento',         color:D.purple, n:perfList.length  },
                  { key:'update', label:'Mejoras y ajustes',   color:D.amber,  n:updList.length+(stats.byType.chore||0) },
                ].map(({key,label,color,n})=>{
                  const pct = meaningfulTotal>0 ? Math.round(n/meaningfulTotal*100) : 0;
                  return (
                    <div key={key}>
                      <div style={{display:'flex',justifyContent:'space-between',marginBottom:3,alignItems:'center'}}>
                        <div style={{display:'flex',alignItems:'center',gap:5}}>
                          <div style={{width:7,height:7,borderRadius:2,background:color,flexShrink:0}}/>
                          <span style={{color:D.sub,fontSize:8.5,lineHeight:1}}>{label}</span>
                        </div>
                        <div style={{display:'flex',alignItems:'center',gap:6}}>
                          <span style={{color:D.dim,fontSize:7.5}}>{pct}%</span>
                          <span style={{color,fontSize:10,fontWeight:800,fontFamily:"'DM Mono',monospace",lineHeight:1,minWidth:18,textAlign:'right'}}>{n}</span>
                        </div>
                      </div>
                      <div style={{height:3,borderRadius:3,background:D.border2}}>
                        <div style={{height:'100%',width:`${pct}%`,borderRadius:3,background:color,transition:'width 0.3s'}}/>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Celda 4: ¿Qué hay de nuevo? */}
          <div style={{padding:'10px 16px',display:'flex',flexDirection:'column'}}>
            <SecLabel label="¿Qué hay de nuevo? · Funciones lanzadas" color={D.green}/>
            <div style={{flex:1,display:'flex',flexDirection:'column',justifyContent:'space-evenly',minHeight:0}}>
              {featList.length===0
                ? <span style={{color:D.muted,fontSize:9}}>Sin funciones nuevas en el período</span>
                : featList.slice(0,6).map(c=>(
                  <div key={c.hash} style={{display:'flex',alignItems:'center',gap:7}}>
                    <div style={{width:5,height:5,borderRadius:'50%',background:D.green,flexShrink:0}}/>
                    <span style={{color:D.sub,fontSize:8.5,flex:1,lineHeight:1.2,
                      overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{c.message}</span>
                    <span style={{color:D.green,fontSize:7,background:D.greenL,padding:'1px 5px',
                      borderRadius:3,flexShrink:0,fontWeight:600}}>{c.area}</span>
                  </div>
                ))
              }
              {featList.length>6 && (
                <span style={{color:D.dim,fontSize:7.5,paddingLeft:12}}>
                  + {featList.length-6} funciones más en el período
                </span>
              )}
            </div>
          </div>
        </div>

        {/* SECCIÓN INFERIOR: 1fr | QR central | 1fr */}
        <div style={{display:'grid',gridTemplateColumns:'1fr auto 1fr',borderTop:`1px solid ${D.border}`}}>

          {/* Izquierda: Cambios más importantes */}
          <div style={{padding:'10px 16px',borderRight:`1px solid ${D.border}`,display:'flex',flexDirection:'column',minWidth:0}}>
            <SecLabel label={`Cambios más importantes · ${meaningful.length} en total`}/>
            <div style={{display:'flex',flexDirection:'column',gap:3}}>
              {topChanges.map(c=>{
                const cfg=TYPE_CFG[c.type]||TYPE_CFG.other;
                const badge = c.type==='feat'?'NUEVO':c.type==='fix'?'CORREGIDO':c.type==='perf'?'VELOCIDAD':'MEJORA';
                return (
                  <div key={c.hash} style={{display:'flex',alignItems:'center',gap:6,height:23,
                    padding:'0 8px',borderRadius:5,background:D.surface2,border:`1px solid ${D.border}`}}>
                    <span style={{fontSize:6.5,color:cfg.color,fontWeight:800,background:cfg.bg,lineHeight:1,
                      padding:'2px 4px',borderRadius:3,flexShrink:0,fontFamily:"'DM Mono',monospace",letterSpacing:'0.03em'}}>
                      {badge}
                    </span>
                    <span style={{color:D.sub,fontSize:8.5,flex:1,lineHeight:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
                      {c.message||c.rawMessage}
                    </span>
                    <span style={{color:cfg.color,fontSize:7,background:cfg.bg,padding:'1px 4px',lineHeight:1,
                      borderRadius:3,flexShrink:0,minWidth:36,textAlign:'center',fontWeight:600}}>
                      {c.area}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Centro: QR */}
          <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',
            padding:'10px 14px',borderRight:`1px solid ${D.border}`,gap:5}}>
            {qrDataUrl
              ? <img src={qrDataUrl} alt="QR grupo-ortiz.com" style={{width:80,height:80,imageRendering:'pixelated',borderRadius:6}}/>
              : <div style={{width:80,height:80,background:D.surface2,borderRadius:6}}/>
            }
            <span style={{color:D.muted,fontSize:6.5,fontWeight:700,textTransform:'uppercase',
              letterSpacing:'0.08em',textAlign:'center',lineHeight:1.3}}>
              grupo-ortiz.com
            </span>
          </div>

          {/* Derecha: Cuellos de botella */}
          <div style={{padding:'10px 16px',display:'flex',flexDirection:'column'}}>
            <SecLabel label="Cuellos de botella · Áreas con más correcciones" color={D.red}/>
            <div style={{flex:1,display:'flex',flexDirection:'column',gap:5,justifyContent:'space-evenly'}}>
              {bottlenecks.length===0
                ? <span style={{color:D.muted,fontSize:9}}>Sin datos suficientes en el período</span>
                : bottlenecks.slice(0,4).map(b=>{
                  const pct = Math.round(b.fixRatio*100);
                  const severity = pct>=60?D.red:pct>=35?D.amber:D.dim;
                  return (
                    <div key={b.area} style={{display:'flex',alignItems:'center',gap:8,
                      padding:'5px 10px',borderRadius:6,background:D.surface2,border:`1px solid ${D.border}`}}>
                      <div style={{width:34,height:34,borderRadius:6,flexShrink:0,
                        background:`rgba(248,113,113,${0.06+b.fixRatio*0.18})`,
                        display:'flex',alignItems:'center',justifyContent:'center'}}>
                        <span style={{color:severity,fontSize:12,fontWeight:800,fontFamily:"'DM Mono',monospace",lineHeight:1}}>
                          {pct}%
                        </span>
                      </div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:3}}>
                          <span style={{color:D.sub,fontSize:8.5,fontWeight:600}}>{b.area}</span>
                          <span style={{color:D.dim,fontSize:7.5,fontFamily:"'DM Mono',monospace"}}>
                            {b.fixes} fix · {b.total} total
                          </span>
                        </div>
                        <div style={{height:3,borderRadius:3,background:D.border2}}>
                          <div style={{height:'100%',width:`${pct}%`,borderRadius:3,background:severity,opacity:0.75}}/>
                        </div>
                      </div>
                    </div>
                  );
                })
              }
            </div>
          </div>

        </div>

        {/* CAMBIOS SIN COMMIT (git working directory) */}
        {gitChanges.length > 0 && (
          <div style={{padding:'6px 18px',borderTop:`1px solid ${D.border}`,
            background:'rgba(251,103,11,0.07)',display:'flex',alignItems:'center',gap:8,flexWrap:'wrap'}}>
            <span style={{color:D.orange,fontSize:7,fontWeight:800,textTransform:'uppercase',
              letterSpacing:'0.12em',flexShrink:0}}>● Sin commit</span>
            {gitChanges.map((gc,i)=>(
              <span key={i} style={{fontSize:7,color:D.sub,background:D.surface3,
                padding:'2px 7px',borderRadius:4,border:`1px solid ${D.border}`}}>
                {gc.label}
              </span>
            ))}
            <span style={{color:D.dim,fontSize:7,marginLeft:'auto',flexShrink:0}}>
              {gitChanges.length} sección{gitChanges.length!==1?'es':''} con cambios locales
            </span>
          </div>
        )}

        {/* FOOTER */}
        <div style={{padding:'5px 18px',display:'flex',alignItems:'center',justifyContent:'space-between',
          background:D.surface,borderTop:`1px solid ${D.border}`}}>
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <img src={whiteLogoUrl||'/images/logo/logoN.png'} alt="GO"
              style={{height:14,opacity:0.25,objectFit:'contain',
                filter:whiteLogoUrl?'none':'brightness(0) invert(1)'}}/>
            <span style={{color:D.muted,fontSize:7}}>Grupo Ortiz · BotGO Analytics · CONFIDENCIAL</span>
          </div>
          <span style={{color:D.muted,fontSize:7,letterSpacing:'0.04em'}}>─── HISTORIAL DE AVANCES ───</span>
          <span style={{color:D.muted,fontSize:7}}>
            Elaborado por <strong style={{color:D.sub}}>Juan Pablo Corona</strong> · {genDate}
          </span>
        </div>

      </div>
      )}
    </div>
  );
}
