// src/components/ReportGenerator.jsx
// BotGO · v10 · Logo base64 embebido + gráficas centradas + análisis IA premium + sección Distribuidores

import React, { useState } from 'react';

const ORANGE = '#F24F13';
const BLACK  = '#2B2B2B';
const GRAY_D = '#4F4F4F';
const GRAY_M = '#9B9B9B';
const GRAY_L = '#C8C8C8';
const WHITE  = '#FFFFFF';
const GREEN  = '#22C55E';

function pctChange(curr, prev) {
  if (!prev) return curr > 0 ? '+100%' : '—';
  const p = ((curr - prev) / prev * 100).toFixed(1);
  return (parseFloat(p) > 0 ? '+' : '') + p + '%';
}

// ── Logo: fetch desde servidor y convertir a base64 ──────────────────────────
async function fetchLogoBase64() {
  try {
    const res = await fetch('/images/logo/logo3.png');
    if (!res.ok) return null;
    const blob = await res.blob();
    return await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror  = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

// ── Gráfica de líneas (actividad) ────────────────────────────────────────────
function buildLineSVG(daily14) {
  const W=780,H=200,PL=52,PR=20,PT=36,PB=36,CW=W-PL-PR,CH=H-PT-PB;
  if (daily14.length < 2)
    return `<text x="${W/2}" y="${H/2}" text-anchor="middle" font-family="'Barlow',Helvetica" font-size="11" fill="${GRAY_L}">Sin datos</text>`;
  const msgs    = daily14.map(([,v]) => v.messages || 0);
  const was     = daily14.map(([,v]) => v.wa       || 0);
  const sessions= daily14.map(([,v]) => v.sessions || 0);
  const maxV    = Math.max(...msgs, ...was, ...sessions, 1);
  const n = daily14.length;
  const px = i => PL + (i/(n-1))*CW;
  const py = v => PT + (1 - v/maxV)*CH;
  let out = `<defs>
    <linearGradient id="gA" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${ORANGE}" stop-opacity="0.18"/><stop offset="100%" stop-color="${ORANGE}" stop-opacity="0"/></linearGradient>
    <linearGradient id="gB" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#6366f1" stop-opacity="0.12"/><stop offset="100%" stop-color="#6366f1" stop-opacity="0"/></linearGradient>
    <linearGradient id="gC" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#22c55e" stop-opacity="0.10"/><stop offset="100%" stop-color="#22c55e" stop-opacity="0"/></linearGradient>
  </defs>`;
  [0, 0.25, 0.5, 0.75, 1].forEach(p => {
    const y = py(p*maxV), val = Math.round(p*maxV);
    out += `<line x1="${PL}" y1="${y.toFixed(1)}" x2="${W-PR}" y2="${y.toFixed(1)}" stroke="${p===0?'#e8e8e8':'#f4f4f4'}" stroke-width="${p===0?1.5:1}" stroke-dasharray="${p===0?'none':'4,4'}"/>
    <text x="${(PL-10).toFixed(1)}" y="${(y+3.5).toFixed(1)}" text-anchor="end" font-family="'Barlow',Helvetica" font-size="9" font-weight="600" fill="${GRAY_L}">${val>=1000?(val/1000).toFixed(1)+'k':val}</text>`;
  });
  daily14.forEach(([date],i) => {
    if (i%2===0 || i===n-1)
      out += `<text x="${px(i).toFixed(1)}" y="${H-8}" text-anchor="middle" font-family="'Barlow',Helvetica" font-size="8" font-weight="600" fill="${GRAY_L}">${date.slice(5).replace('-','/')}</text>`;
  });
  const mkArea = (data) => data.map((v,i) => `${i===0?'M':'L'}${px(i).toFixed(1)},${py(v).toFixed(1)}`).join(' ')
    + ` L${px(n-1).toFixed(1)},${(PT+CH).toFixed(1)} L${px(0).toFixed(1)},${(PT+CH).toFixed(1)} Z`;
  out += `<path d="${mkArea(msgs)}" fill="url(#gA)"/><path d="${mkArea(sessions)}" fill="url(#gB)"/><path d="${mkArea(was)}" fill="url(#gC)"/>`;
  [{data:msgs,color:ORANGE},{data:was,color:'#22c55e'},{data:sessions,color:'#6366f1'}].forEach(s => {
    out += `<path d="${s.data.map((v,i)=>`${i===0?'M':'L'}${px(i).toFixed(1)},${py(v).toFixed(1)}`).join(' ')}" fill="none" stroke="${s.color}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>`;
    s.data.forEach((v,i) => out += `<circle cx="${px(i).toFixed(1)}" cy="${py(v).toFixed(1)}" r="4" fill="#fff" stroke="${s.color}" stroke-width="2.5"/>`);
  });
  const series = [{color:ORANGE,label:'Mensajes'},{color:'#22c55e',label:'WhatsApp'},{color:'#6366f1',label:'Sesiones'}];
  const lx0 = (W - series.length*110)/2;
  series.forEach((s,i) => {
    const lx = lx0 + i*110;
    out += `<rect x="${(lx-2).toFixed(1)}" y="3" width="100" height="18" rx="9" fill="${s.color}" fill-opacity="0.08"/>
    <circle cx="${(lx+10).toFixed(1)}" cy="12" r="4" fill="${s.color}"/>
    <text x="${(lx+20).toFixed(1)}" y="16.5" font-family="'Barlow',Helvetica" font-size="9.5" font-weight="700" fill="${s.color}" fill-opacity="0.85">${s.label}</text>`;
  });
  return out;
}

// ── Gráfica de línea simple (leads distribuidores) ───────────────────────────
function buildLeadsLineSVG(byDay) {
  const entries = Object.entries(byDay).sort(([a],[b]) => a.localeCompare(b)).slice(-14);
  const W=680,H=130,PL=40,PR=16,PT=20,PB=28,CW=W-PL-PR,CH=H-PT-PB;
  if (entries.length < 2)
    return `<text x="${W/2}" y="${H/2}" text-anchor="middle" font-family="'Barlow',Helvetica" font-size="10" fill="${GRAY_L}">Sin datos suficientes</text>`;
  const vals = entries.map(([,v]) => v);
  const maxV = Math.max(...vals, 1);
  const minV = Math.min(...vals);
  const n = entries.length;
  const px = i => PL + (i/(n-1))*CW;
  const py = v => PT + (1 - (v - minV) / Math.max(maxV - minV, 1)) * CH;
  let out = `<defs>
    <linearGradient id="lgG" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${GREEN}" stop-opacity="0.20"/>
      <stop offset="100%" stop-color="${GREEN}" stop-opacity="0"/>
    </linearGradient>
  </defs>`;
  [0, 0.5, 1].forEach(p => {
    const y = py(minV + p*(maxV-minV)), val = Math.round(minV + p*(maxV-minV));
    out += `<line x1="${PL}" y1="${y.toFixed(1)}" x2="${W-PR}" y2="${y.toFixed(1)}" stroke="#f0f0f0" stroke-width="1" stroke-dasharray="${p===0?'none':'3,3'}"/>
    <text x="${(PL-6).toFixed(1)}" y="${(y+3).toFixed(1)}" text-anchor="end" font-family="'Barlow',Helvetica" font-size="8" font-weight="600" fill="${GRAY_L}">${val}</text>`;
  });
  const pathD = entries.map(([,v],i) => `${i===0?'M':'L'}${px(i).toFixed(1)},${py(v).toFixed(1)}`).join(' ');
  const areaD = `${pathD} L${px(n-1).toFixed(1)},${(PT+CH).toFixed(1)} L${px(0).toFixed(1)},${(PT+CH).toFixed(1)} Z`;
  out += `<path d="${areaD}" fill="url(#lgG)"/>`;
  out += `<path d="${pathD}" fill="none" stroke="${GREEN}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>`;
  entries.forEach(([date,v],i) => {
    out += `<circle cx="${px(i).toFixed(1)}" cy="${py(v).toFixed(1)}" r="4" fill="#fff" stroke="${GREEN}" stroke-width="2.5"/>`;
    if (i%2===0 || i===n-1)
      out += `<text x="${px(i).toFixed(1)}" y="${H-6}" text-anchor="middle" font-family="'Barlow',Helvetica" font-size="7.5" font-weight="600" fill="${GRAY_L}">${date.slice(5).replace('-','/')}</text>`;
  });
  return out;
}

// ── Gráfica de barras ────────────────────────────────────────────────────────
function buildBarSVG(pairs, color) {
  const W=320,H=180,PL=12,PR=12,PT=44,PB=32,GAP=8;
  if (!pairs || pairs.length < 1)
    return `<text x="${W/2}" y="${H/2}" text-anchor="middle" font-family="'Barlow',Helvetica" font-size="10" fill="${GRAY_L}">Sin datos</text>`;
  const maxV = Math.max(...pairs.map(([,v]) => v), 1), n = pairs.length;
  const barW = (W-PL-PR-GAP*(n-1))/n, CH = H-PT-PB;
  const hiIdx = pairs.reduce((m,[,v],i) => v > pairs[m][1] ? i : m, 0);
  let out = `<defs><linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${color}"/><stop offset="100%" stop-color="${color}" stop-opacity="0.7"/></linearGradient></defs>`;
  [0.5,1].forEach(p => { const y=PT+(1-p)*CH; out+=`<line x1="${PL}" y1="${y.toFixed(1)}" x2="${W-PR}" y2="${y.toFixed(1)}" stroke="#f0f0f0" stroke-width="1" stroke-dasharray="3,3"/>`; });
  pairs.forEach(([label,val],i) => {
    const bh=Math.max((val/maxV)*CH,4), bx=PL+i*(barW+GAP), by=PT+CH-bh, isHi=i===hiIdx, cx=bx+barW/2;
    if (isHi) out += `<rect x="${(bx-2).toFixed(1)}" y="${(by+4).toFixed(1)}" width="${(barW+4).toFixed(1)}" height="${bh.toFixed(1)}" fill="${color}" fill-opacity="0.12" rx="5"/>`;
    out += `<rect x="${bx.toFixed(1)}" y="${by.toFixed(1)}" width="${barW.toFixed(1)}" height="${bh.toFixed(1)}" fill="${isHi?'url(#barGrad)':'#eeeff1'}" rx="5"/>
    <text x="${cx.toFixed(1)}" y="${(by-8).toFixed(1)}" text-anchor="middle" font-family="'Barlow Condensed',sans-serif" font-size="14" font-weight="800" fill="${isHi?color:'#bbb'}">${val}</text>
    <text x="${cx.toFixed(1)}" y="${(H-10).toFixed(1)}" text-anchor="middle" font-family="'Barlow',Helvetica" font-size="8" font-weight="600" fill="${GRAY_L}">${label.length>7?label.slice(0,6)+'…':label}</text>`;
  });
  return out;
}

// ── Donut ────────────────────────────────────────────────────────────────────
function buildDonutSVG(pairs, colors) {
  const S=140, cx=S/2, cy=S/2, R=54, r=32;
  if (!pairs || pairs.length < 1)
    return `<text x="${cx}" y="${cy+4}" text-anchor="middle" font-family="'Barlow',Helvetica" font-size="10" fill="${GRAY_L}">—</text>`;
  const total = pairs.reduce((s,[,v]) => s+v, 0) || 1;
  let angle = -Math.PI/2;
  let out = `<circle cx="${cx}" cy="${cy}" r="${R+3}" fill="none" stroke="#f5f5f5" stroke-width="6"/>`;
  pairs.forEach(([,val],i) => {
    const sweep=(val/total)*Math.PI*2,
      x1=cx+R*Math.cos(angle), y1=cy+R*Math.sin(angle),
      x2=cx+R*Math.cos(angle+sweep), y2=cy+R*Math.sin(angle+sweep),
      large=sweep>Math.PI?1:0,
      xi1=cx+r*Math.cos(angle), yi1=cy+r*Math.sin(angle),
      xi2=cx+r*Math.cos(angle+sweep), yi2=cy+r*Math.sin(angle+sweep);
    out += `<path d="M${x1.toFixed(2)},${y1.toFixed(2)} A${R},${R} 0 ${large},1 ${x2.toFixed(2)},${y2.toFixed(2)} L${xi2.toFixed(2)},${yi2.toFixed(2)} A${r},${r} 0 ${large},0 ${xi1.toFixed(2)},${yi1.toFixed(2)} Z" fill="${colors[i%colors.length]}" stroke="#fff" stroke-width="2"/>`;
    angle += sweep;
  });
  const top = pairs.reduce((m,[,v],i) => v > pairs[m][1] ? i : m, 0);
  const topPct = Math.round(pairs[top][1]/total*100);
  out += `<text x="${cx}" y="${cy-5}" text-anchor="middle" font-family="'Barlow Condensed',sans-serif" font-size="22" font-weight="800" fill="${BLACK}">${topPct}%</text>
  <text x="${cx}" y="${cy+10}" text-anchor="middle" font-family="'Barlow',Helvetica" font-size="7.5" font-weight="600" fill="${GRAY_M}">${pairs[top][0].slice(0,8)}</text>`;
  return out;
}

// ── Bloque análisis IA ───────────────────────────────────────────────────────
function buildAnalysisBlock(analysis) {
  if (!analysis) return '';
  const lines   = analysis.split('\n').filter(l => l.trim());
  const bullets = lines.filter(l => /^[-•]\s+/.test(l.trim())).map(l => l.trim().replace(/^[-•]\s+/, ''));
  const others  = lines.filter(l => !/^[-•]\s+/.test(l.trim()) && !/^\*\*/.test(l.trim()) && !/^###/.test(l.trim()) && l.trim().length > 0);
  const icons = [
    `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="${ORANGE}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`,
    `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="${ORANGE}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/></svg>`,
    `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="${ORANGE}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>`,
    `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="${ORANGE}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
  ];
  const bulletCards = bullets.map((text, i) => `
    <div style="display:flex;gap:10px;align-items:flex-start;padding:10px 12px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.08);border-left:2px solid ${ORANGE};border-radius:8px;margin-bottom:7px;">
      <div style="width:22px;height:22px;border-radius:6px;background:rgba(242,79,19,0.15);display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px;">${icons[i % icons.length]}</div>
      <p style="font-family:'Barlow',sans-serif;font-size:11px;font-weight:500;color:rgba(255,255,255,0.80);line-height:1.6;margin:0;">${text}</p>
    </div>`).join('');
  const paragraphs = others.map(t => `<p style="font-family:'Barlow',sans-serif;font-size:11px;font-weight:500;color:rgba(255,255,255,0.65);line-height:1.6;margin-bottom:6px;">${t}</p>`).join('');
  return `
  <div style="margin-top:clamp(16px,2vw,24px);position:relative;z-index:1;">
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">
      <div style="display:flex;align-items:center;justify-content:center;width:26px;height:26px;border-radius:8px;background:rgba(242,79,19,0.20);border:1px solid rgba(242,79,19,0.35);">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="${ORANGE}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a10 10 0 1 0 10 10"/><path d="M12 6v6l4 2"/><circle cx="18" cy="6" r="3" fill="${ORANGE}" stroke="none"/></svg>
      </div>
      <div>
        <div style="font-family:'Barlow Condensed',sans-serif;font-size:12px;font-weight:800;letter-spacing:0.12em;text-transform:uppercase;color:#fff;line-height:1;">Análisis Ejecutivo</div>
        <div style="font-family:'Barlow',sans-serif;font-size:8px;font-weight:600;letter-spacing:0.22em;text-transform:uppercase;color:rgba(255,255,255,0.28);margin-top:2px;">Generado por IA · BotGO Analytics</div>
      </div>
      <div style="margin-left:auto;padding:3px 8px;background:rgba(242,79,19,0.12);border:1px solid rgba(242,79,19,0.25);border-radius:20px;font-family:'Barlow',sans-serif;font-size:7px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:${ORANGE};">AUTO</div>
    </div>
    <div style="height:1px;background:linear-gradient(90deg,rgba(242,79,19,0.4),rgba(255,255,255,0.05),transparent);margin-bottom:14px;"></div>
    ${bulletCards}${paragraphs}
  </div>`;
}

// ── SECCIÓN DISTRIBUIDORES (página 3 del reporte) ────────────────────────────
function buildDistribuidoresSection(leads) {
  if (!leads || leads.length === 0) return '';

  const now    = Date.now();
  const today  = new Date().toISOString().split('T')[0];
  const hoy    = leads.filter(l => (l.ts||'').startsWith(today)).length;
  const semana = leads.filter(l => (now - new Date(l.ts||0)) < 7*24*60*60*1000).length;
  const mes    = leads.filter(l => (now - new Date(l.ts||0)) < 30*24*60*60*1000).length;

  // Contar productos
  const prodCount = {};
  leads.forEach(l => {
    (l.productos||'').split(',').forEach(p => {
      const t = p.trim(); if (t) prodCount[t] = (prodCount[t]||0) + 1;
    });
  });
  const topProds  = Object.entries(prodCount).sort(([,a],[,b]) => b-a).slice(0, 6);
  const maxProd   = topProds[0]?.[1] || 1;

  // Leads por día para gráfica
  const byDay = {};
  leads.forEach(l => {
    const d = (l.ts||'').split('T')[0] || (l.ts||'').split(' ')[0];
    if (d) byDay[d] = (byDay[d]||0) + 1;
  });

  // Barras de productos
  const prodBars = topProds.length ? topProds.map(([label,val], i) => {
    const pct = Math.round(val/maxProd*100), isTop = i === 0;
    return `
    <div style="margin-bottom:10px;">
      <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:4px;">
        <span style="font-family:'Barlow',sans-serif;font-size:10px;font-weight:600;color:${isTop?BLACK:GRAY_D};max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${label}</span>
        <span style="font-family:'Barlow Condensed',sans-serif;font-size:18px;font-weight:800;color:${isTop?GREEN:GRAY_L};flex-shrink:0;margin-left:8px;">${val}</span>
      </div>
      <div style="height:6px;background:#f3f4f6;border-radius:4px;overflow:hidden;">
        <div style="width:${pct}%;height:100%;background:${isTop?`linear-gradient(90deg,${GREEN},#16a34a)`:'#d1fae5'};border-radius:4px;"></div>
      </div>
    </div>`;
  }).join('')
  : `<div style="color:${GRAY_L};font-size:11px;padding:20px 0;text-align:center;font-family:'Barlow',sans-serif;">Sin datos</div>`;

  // Tabla ultimos 10 leads
  const recientes = [...leads].slice(0, 10);
  const filas = recientes.map(l => {
    const fecha = l.ts
      ? new Date(l.ts).toLocaleString('es-MX',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'})
      : '—';
    const prods = (l.productos||'').split(',').filter(Boolean).map(p =>
      `<span style="display:inline-block;padding:1px 6px;background:rgba(34,197,94,0.08);border:1px solid rgba(34,197,94,0.20);border-radius:4px;font-size:7.5px;font-weight:700;color:${GREEN};margin:1px 2px;">${p.trim()}</span>`
    ).join('');
    return `
    <tr style="border-bottom:1px solid #f4f4f4;">
      <td style="padding:7px 10px;font-family:'Barlow',sans-serif;font-size:8.5px;font-weight:600;color:${GRAY_M};white-space:nowrap;">${fecha}</td>
      <td style="padding:7px 10px;font-family:'Barlow',sans-serif;font-size:10px;font-weight:700;color:${BLACK};">${l.nombre||'—'}</td>
      <td style="padding:7px 10px;font-family:'Barlow',sans-serif;font-size:9px;font-weight:600;color:${GRAY_D};">${l.empresa||'—'}</td>
      <td style="padding:7px 10px;font-family:'Barlow',sans-serif;font-size:9px;font-weight:600;color:${GREEN};">${l.whatsapp||'—'}</td>
      <td style="padding:7px 10px;font-family:'Barlow',sans-serif;font-size:8.5px;color:${GRAY_D};">${l.email||'—'}</td>
      <td style="padding:7px 10px;">${prods || `<span style="color:${GRAY_L};font-size:9px;">—</span>`}</td>
    </tr>`;
  }).join('');

  // KPI cards del header
  const kpiCards = [
    {val: leads.length, lbl: 'Total'},
    {val: mes,          lbl: '30 días'},
    {val: semana,       lbl: '7 días'},
    {val: hoy,          lbl: 'Hoy'},
  ].map(k => `
    <div style="background:rgba(255,255,255,0.10);border:1px solid rgba(255,255,255,0.18);border-radius:14px;padding:14px 20px;text-align:center;min-width:72px;">
      <div style="font-family:'Barlow Condensed',sans-serif;font-size:clamp(26px,3.5vw,36px);font-weight:800;color:#fff;line-height:1;">${k.val}</div>
      <div style="font-family:'Barlow',sans-serif;font-size:8px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;color:rgba(255,255,255,0.45);margin-top:3px;">${k.lbl}</div>
    </div>`).join('');

  return `
<!-- ══════════════════════════════════════════════════
     PÁGINA 3 · DISTRIBUIDORES
     ══════════════════════════════════════════════════ -->
<div class="page">
<div class="dashboard">

  <!-- Header verde -->
  <div style="background:#F24F13;padding:clamp(20px,3vw,30px) clamp(20px,3vw,36px);display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:16px;position:relative;overflow:hidden;">
    <!-- Círculos decorativos -->
    <div style="position:absolute;bottom:-60px;right:-60px;width:200px;height:200px;border-radius:50%;border:40px solid rgba(255,255,255,0.05);pointer-events:none;"></div>
    <div style="position:absolute;top:-40px;left:40%;width:140px;height:140px;border-radius:50%;border:28px solid rgba(255,255,255,0.04);pointer-events:none;"></div>
    <!-- Título -->
    <div style="position:relative;z-index:1;">
      <div style="font-family:'Barlow',sans-serif;font-size:8px;font-weight:700;letter-spacing:0.28em;text-transform:uppercase;color:rgba(255,255,255,0.50);margin-bottom:5px;">Módulo de Captación</div>
      <div style="font-family:'Barlow Condensed',sans-serif;font-size:clamp(30px,5vw,50px);font-weight:800;letter-spacing:-0.02em;color:#fff;text-transform:uppercase;line-height:0.9;">DISTRIBUIDORES</div>
      <div style="font-family:'Barlow',sans-serif;font-size:9px;font-weight:600;color:rgba(255,255,255,0.50);margin-top:5px;letter-spacing:0.08em;">Solicitudes recibidas vía formulario web · Grupo Ortiz</div>
    </div>
    <!-- KPIs rápidos -->
    <div style="display:flex;gap:10px;flex-wrap:wrap;position:relative;z-index:1;">${kpiCards}</div>
  </div>

  <!-- Gráfica tendencia + Productos interés -->
  <div style="display:grid;grid-template-columns:minmax(0,2fr) minmax(0,1fr);gap:10px;padding:12px 13px 10px;">

    <!-- Gráfica de tendencia -->
    <div style="background:${WHITE};border-radius:14px;border:1px solid #ebebeb;padding:18px 20px;box-shadow:0 1px 4px rgba(0,0,0,0.04);">
      <div style="font-family:'Barlow',sans-serif;font-size:8px;font-weight:700;letter-spacing:0.28em;text-transform:uppercase;color:${GRAY_L};margin-bottom:12px;display:flex;align-items:center;gap:6px;">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="${GREEN}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
        Tendencia de solicitudes — últimos 14 días
      </div>
      <svg viewBox="0 0 680 130" style="width:100%;height:auto;display:block;overflow:visible;">
        ${buildLeadsLineSVG(byDay)}
      </svg>
    </div>

    <!-- Productos de interés -->
    <div style="background:${WHITE};border-radius:14px;border:1px solid #ebebeb;padding:18px 20px;box-shadow:0 1px 4px rgba(0,0,0,0.04);">
      <div style="font-family:'Barlow',sans-serif;font-size:8px;font-weight:700;letter-spacing:0.28em;text-transform:uppercase;color:${GRAY_L};margin-bottom:14px;display:flex;align-items:center;gap:6px;">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="${GREEN}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/></svg>
        Productos de interés
      </div>
      ${prodBars}
    </div>
  </div>

  <!-- Tabla de solicitudes recientes -->
  <div style="padding:0 13px 13px;">
    <div style="background:${WHITE};border-radius:14px;border:1px solid #ebebeb;box-shadow:0 1px 4px rgba(0,0,0,0.04);overflow:hidden;">
      <!-- Tabla header -->
      <div style="padding:13px 20px 10px;border-bottom:1px solid #f4f4f4;display:flex;align-items:center;justify-content:space-between;">
        <div style="font-family:'Barlow',sans-serif;font-size:8px;font-weight:700;letter-spacing:0.28em;text-transform:uppercase;color:${GRAY_L};display:flex;align-items:center;gap:6px;">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="${GREEN}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          Solicitudes recientes — últimas ${recientes.length}
        </div>
        <div style="font-family:'Barlow Condensed',sans-serif;font-size:14px;font-weight:800;color:${GREEN};">${leads.length} total</div>
      </div>
      <div style="overflow-x:auto;">
        <table style="width:100%;border-collapse:collapse;">
          <thead>
            <tr style="background:#fafafa;">
              ${['Fecha','Nombre','Empresa','WhatsApp','Email','Productos'].map(h =>
                `<th style="padding:8px 10px;text-align:left;font-family:'Barlow',sans-serif;font-size:7.5px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:${GRAY_L};border-bottom:1px solid #ebebeb;white-space:nowrap;">${h}</th>`
              ).join('')}
            </tr>
          </thead>
          <tbody>${filas}</tbody>
        </table>
      </div>
      ${leads.length > 10 ? `
      <div style="padding:9px 20px;background:#fafafa;border-top:1px solid #f4f4f4;font-family:'Barlow',sans-serif;font-size:8.5px;font-weight:600;color:${GRAY_L};text-align:center;">
        + ${leads.length - 10} solicitudes adicionales registradas en el sistema
      </div>` : ''}
    </div>
  </div>

  <!-- Footer página -->
  <div style="padding:0 13px 10px;display:flex;align-items:center;justify-content:space-between;">
    <span style="font-family:'Barlow',sans-serif;font-size:8px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:${GRAY_L};">Grupo Ortiz · BotGO Analytics · Módulo Distribuidores</span>
    <span style="font-family:'Barlow',sans-serif;font-size:8px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:${GRAY_L};">${new Date().toLocaleDateString('es-MX',{day:'2-digit',month:'short',year:'2-digit'})}</span>
  </div>

</div>
</div>`;
}

// ── HTML principal ───────────────────────────────────────────────────────────
function buildReportHTML(data, periodMeta=null, analysis=null, logoBase64=null, leads=[]) {
  const now      = new Date();
  const today    = now.toISOString().split('T')[0];
  const todayFmt = now.toLocaleDateString('es-MX', {day:'2-digit',month:'short',year:'2-digit'});
  const yest     = new Date(now); yest.setDate(yest.getDate()-1);
  const yd = data?.daily?.[yest.toISOString().split('T')[0]] || {};
  const td = data?.daily?.[today] || {};

  const totalMsg  = data?.totalMessages  || 0;
  const totalSess = data?.totalSessions  || 0;
  const totalWA   = data?.totalWhatsApp  || 0;
  const totalPDF  = data?.totalPDFs      || 0;
  const convRate  = totalMsg ? ((totalWA/totalMsg)*100).toFixed(1) : '0.0';
  const mps       = totalSess ? (totalMsg/totalSess).toFixed(1) : '0.0';
  const intents   = data?.intents || {};
  const totalIntents = Math.max(Object.values(intents).reduce((a,b)=>a+b,0), 1);
  const topProds  = Object.entries(data?.products||{}).sort(([,a],[,b])=>b-a).slice(0,6);
  const daily14   = Object.entries(data?.daily||{}).sort(([a],[b])=>a.localeCompare(b)).slice(-14);
  const allDates  = Object.keys(data?.daily||{}).sort();
  const intentPairs = Object.entries(intents).filter(([,v])=>v>0);

  const logoImgCover = logoBase64
    ? `<img src="${logoBase64}" alt="Grupo Ortiz" style="width:clamp(140px,18vw,210px);height:auto;object-fit:contain;filter:brightness(0) invert(1);display:block;margin:0 auto;"/>`
    : `<span style="font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:28px;color:#fff;text-align:center;">GRUPO ORTIZ</span>`;

  const logoImgDash = logoBase64
    ? `<img src="${logoBase64}" alt="Grupo Ortiz" style="height:clamp(28px,3.5vw,40px);width:auto;object-fit:contain;display:block;"/>`
    : `<div style="width:38px;height:38px;border-radius:9px;background:linear-gradient(135deg,${ORANGE},#c73d00);display:flex;align-items:center;justify-content:center;"><span style="font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:19px;color:#fff;">GO</span></div>`;

  function buildPeriodoLabel(meta) {
    const fmt = ymd => { if(!ymd)return''; const d=new Date(ymd+'T00:00:00'); return d.toLocaleDateString('es-MX',{day:'2-digit',month:'short',year:'2-digit'}); };
    if (!meta) { if(allDates.length>=2) return allDates[0].slice(5).replace('-','/')+' — '+allDates[allDates.length-1].slice(5).replace('-','/'); return todayFmt; }
    if (meta.preset==='today')  return 'Hoy · '+fmt(meta.from);
    if (meta.preset==='7d')     return '7 días · '+fmt(meta.from)+' — '+fmt(meta.to);
    if (meta.preset==='30d')    return '30 días · '+fmt(meta.from)+' — '+fmt(meta.to);
    if (meta.preset==='month')  { const d=new Date(meta.from+'T00:00:00'); return 'Mes de '+d.toLocaleDateString('es-MX',{month:'long',year:'numeric'}); }
    if (meta.preset==='all' && allDates.length>=2) return 'Todo · '+allDates[0].slice(5).replace('-','/')+' — '+allDates[allDates.length-1].slice(5).replace('-','/');
    if (meta.from && meta.to) return fmt(meta.from)+' — '+fmt(meta.to);
    return todayFmt;
  }

  const periodo = buildPeriodoLabel(periodMeta);
  const iColors = [ORANGE,'#6366f1','#22c55e','#f59e0b','#0ea5e9','#8b5cf6'];
  const iLabels = {compra:'Compra',pdf:'PDF',info:'Info',reclutamiento:'Empleo',otro:'Otro'};

  const ico = {
    chat:   `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
    msg:    `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><line x1="9" y1="9" x2="15" y2="9"/><line x1="9" y1="13" x2="12" y2="13"/></svg>`,
    phone:  `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18" stroke-width="3"/></svg>`,
    pdf:    `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`,
    trend:  `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>`,
    clock:  `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
    chartS: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`,
    intentS:`<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
    prodS:  `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`,
    donutS: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 1 7.07 17.07"/></svg>`,
    barS:   `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="18" y="3" width="4" height="18"/><rect x="10" y="8" width="4" height="13"/><rect x="2" y="13" width="4" height="8"/></svg>`,
    kpiMsg: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
    kpiSes: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>`,
    kpiWA:  `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18" stroke-width="3"/></svg>`,
    kpiConv:`<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>`,
    kpiPDF: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`,
    kpiMPS: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  };

  const coverCards = [
    {icon:ico.chat,  val:totalSess.toLocaleString('es-MX'), label:'Sesiones'},
    {icon:ico.msg,   val:totalMsg.toLocaleString('es-MX'),  label:'Mensajes'},
    {icon:ico.phone, val:totalWA.toLocaleString('es-MX'),   label:'Leads WA'},
    {icon:ico.pdf,   val:totalPDF.toLocaleString('es-MX'),  label:'PDFs'},
    {icon:ico.trend, val:convRate+'%',                      label:'Conversión'},
    {icon:ico.clock, val:mps,                               label:'Msgs/Ses'},
  ].map(r => `
    <div class="cover-card">
      <div class="cover-icon">${r.icon}</div>
      <div class="cover-val">${r.val}</div>
      <div class="cover-lbl">${r.label}</div>
    </div>`).join('');

  const kpis = [
    {label:'Mensajes',   val:totalMsg.toLocaleString('es-MX'),  color:ORANGE,    delta:pctChange(td.messages||0, yd.messages||0), icon:ico.kpiMsg},
    {label:'Sesiones',   val:totalSess.toLocaleString('es-MX'), color:'#6366f1', delta:pctChange(td.sessions||0, yd.sessions||0), icon:ico.kpiSes},
    {label:'WhatsApp',   val:totalWA.toLocaleString('es-MX'),   color:'#22c55e', delta:pctChange(td.wa||0,       yd.wa||0),       icon:ico.kpiWA},
    {label:'Conversión', val:convRate+'%',                      color:'#f59e0b', delta:'—',                                       icon:ico.kpiConv},
    {label:'PDFs',       val:totalPDF.toLocaleString('es-MX'),  color:'#0ea5e9', delta:pctChange(td.pdf||0,      yd.pdf||0),      icon:ico.kpiPDF},
    {label:'Msgs/Ses',   val:mps,                               color:'#8b5cf6', delta:'—',                                       icon:ico.kpiMPS},
  ];

  const kpiCards = kpis.map(k => {
    const pos=k.delta.startsWith('+'), neg=k.delta.startsWith('-');
    const dc = pos ? '#22c55e' : neg ? '#ef4444' : GRAY_L;
    return `
    <div class="kpi-card" style="--kc:${k.color};">
      <div class="kpi-bar"></div>
      <div class="kpi-icon" style="color:${k.color};">${k.icon}</div>
      <div class="kpi-val">${k.val}</div>
      <div class="kpi-lbl">${k.label}</div>
      <div class="kpi-delta" style="color:${dc};">${k.delta}</div>
    </div>`;
  }).join('');

  const intentList = intentPairs.map(([key,val],i) => {
    const p=Math.round(val/totalIntents*100), clr=iColors[i%iColors.length];
    return `
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;">
      <span style="width:30px;text-align:right;flex-shrink:0;font-family:'Barlow Condensed',sans-serif;font-size:14px;font-weight:800;color:${GRAY_L};">${p}%</span>
      <div style="flex:1;height:7px;background:#f3f4f6;border-radius:4px;overflow:hidden;">
        <div style="width:${p}%;height:100%;background:${clr};border-radius:4px;"></div>
      </div>
      <div style="display:flex;align-items:center;gap:4px;min-width:58px;">
        <div style="width:7px;height:7px;border-radius:50%;background:${clr};flex-shrink:0;"></div>
        <span style="font-family:'Barlow',sans-serif;font-size:9px;font-weight:600;color:${GRAY_D};">${iLabels[key]||key}</span>
      </div>
      <span style="min-width:24px;text-align:right;font-family:'Barlow Condensed',sans-serif;font-size:18px;font-weight:800;color:${BLACK};">${val}</span>
    </div>`;
  }).join('') || `<div style="color:${GRAY_L};font-size:11px;font-family:'Barlow',sans-serif;text-align:center;padding:24px 0;">Sin datos</div>`;

  const maxProd = topProds[0]?.[1] || 1;
  const prodBars = topProds.map(([label,val],i) => {
    const pct=Math.round(val/maxProd*100), isTop=i===0;
    return `
    <div style="margin-bottom:10px;">
      <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:4px;">
        <span style="font-family:'Barlow',sans-serif;font-size:10px;font-weight:600;color:${isTop?BLACK:GRAY_D};white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:150px;">${label}</span>
        <span style="font-family:'Barlow Condensed',sans-serif;font-size:18px;font-weight:800;color:${isTop?ORANGE:GRAY_L};flex-shrink:0;margin-left:8px;">${val}</span>
      </div>
      <div style="height:6px;background:#f3f4f6;border-radius:4px;overflow:hidden;">
        <div style="width:${pct}%;height:100%;background:${isTop?`linear-gradient(90deg,${ORANGE},#e07030)`:'#e0e0e0'};border-radius:4px;"></div>
      </div>
    </div>`;
  }).join('') || `<div style="color:${GRAY_L};font-size:11px;font-family:'Barlow',sans-serif;padding:24px 0;text-align:center;">Sin datos</div>`;

  const card = (title, content, iconStr='') => `
    <div class="card">
      <div class="card-title">
        ${iconStr ? `<span style="color:${ORANGE};opacity:0.65;display:flex;align-items:center;">${iconStr}</span>` : ''}
        <span>${title}</span>
      </div>
      <div class="card-body">${content}</div>
    </div>`;

  const analysisBlock     = buildAnalysisBlock(analysis);
  const distribSection    = buildDistribuidoresSection(leads);

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>BotGO Analytics · Grupo Ortiz · ${today}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600;700;800&family=Barlow+Condensed:wght@400;600;700;800&display=swap" rel="stylesheet">
<style>
  :root{--orange:${ORANGE};--black:${BLACK};--gray-d:${GRAY_D};--gray-m:${GRAY_M};--gray-l:${GRAY_L};--white:${WHITE};}
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
  body{background:#f2f2f2;font-family:'Barlow',Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;-webkit-print-color-adjust:exact;print-color-adjust:exact;}
  .page{width:100%;max-width:1200px;margin:0 auto 20px;overflow:hidden;}

  .cover{display:flex;min-height:100svh;background:linear-gradient(135deg,${BLACK} 0%,${GRAY_D} 55%,${BLACK} 100%);}
  .cover-left{flex:1;padding:clamp(32px,5vw,64px) clamp(24px,4vw,56px);display:flex;flex-direction:column;justify-content:space-between;position:relative;z-index:1;min-width:0;}
  .cover-left::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,${ORANGE},transparent);}
  .cover-badge{display:flex;align-items:center;gap:10px;}
  .cover-badge span{font-family:'Barlow',sans-serif;font-size:clamp(7px,1.2vw,9px);font-weight:700;letter-spacing:0.35em;text-transform:uppercase;color:rgba(255,255,255,0.28);}
  .cover-hero{flex:1;display:flex;flex-direction:column;justify-content:center;padding:clamp(20px,3vw,32px) 0;}
  .cover-title{font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:clamp(52px,8vw,96px);line-height:0.86;letter-spacing:-0.03em;text-transform:uppercase;color:#fff;margin-bottom:2px;}
  .cover-title span{color:${ORANGE};}
  .cover-sub{font-family:'Barlow Condensed',sans-serif;font-weight:300;font-size:clamp(20px,3.5vw,36px);line-height:1;letter-spacing:0.18em;text-transform:uppercase;color:rgba(255,255,255,0.18);margin-bottom:clamp(20px,3vw,32px);}
  .cover-divider{width:52px;height:2px;background:${ORANGE};border-radius:2px;margin-bottom:16px;}
  .cover-period-lbl{font-family:'Barlow',sans-serif;font-size:clamp(8px,1.2vw,10px);font-weight:600;letter-spacing:0.12em;color:rgba(255,255,255,0.35);margin-bottom:6px;text-transform:uppercase;}
  .cover-period-val{font-family:'Barlow Condensed',sans-serif;font-size:clamp(16px,2.5vw,28px);font-weight:700;letter-spacing:0.01em;color:#fff;text-transform:uppercase;}
  .cover-footer{display:flex;align-items:flex-end;justify-content:space-between;flex-wrap:wrap;gap:12px;width:100%;}
  .cover-client-lbl{font-family:'Barlow',sans-serif;font-size:8px;font-weight:700;letter-spacing:0.28em;text-transform:uppercase;color:rgba(255,255,255,0.20);margin-bottom:5px;}
  .cover-client-name{font-family:'Barlow Condensed',sans-serif;font-size:clamp(16px,2.5vw,24px);font-weight:800;letter-spacing:0.02em;text-transform:uppercase;color:#fff;}
  .cover-client-sub{font-family:'Barlow',sans-serif;font-size:8px;font-weight:600;letter-spacing:0.14em;color:rgba(255,255,255,0.20);margin-top:3px;text-transform:uppercase;}
  .cover-date-lbl{font-family:'Barlow',sans-serif;font-size:8px;font-weight:700;letter-spacing:0.22em;text-transform:uppercase;color:rgba(255,255,255,0.18);margin-bottom:4px;text-align:right;}
  .cover-date-val{font-family:'Barlow Condensed',sans-serif;font-size:clamp(14px,2vw,22px);font-weight:700;color:rgba(255,255,255,0.42);}
  .cover-right{width:clamp(260px,36%,420px);background:linear-gradient(160deg,${ORANGE} 0%,#c73d00 100%);display:flex;flex-direction:column;padding:clamp(28px,4vw,44px) clamp(20px,3vw,32px);position:relative;overflow:hidden;flex-shrink:0;justify-content:center;gap:clamp(16px,2.5vw,24px);}
  .cover-right::before{content:'';position:absolute;bottom:-90px;right:-90px;width:280px;height:280px;border-radius:50%;border:55px solid rgba(255,255,255,0.05);}
  .cover-right::after{content:'';position:absolute;top:-70px;left:-70px;width:220px;height:220px;border-radius:50%;border:40px solid rgba(255,255,255,0.05);}
  .cover-logo{position:relative;z-index:1;display:flex;align-items:center;justify-content:center;width:100%;padding:clamp(16px,2.5vw,28px) 0;}
  .cover-metrics-lbl{font-family:'Barlow',sans-serif;font-size:11px;font-weight:700;letter-spacing:0.20em;text-transform:uppercase;color:rgba(255,255,255,0.70);position:relative;z-index:1;text-align:center;margin-bottom:4px;}
  .cover-grid{display:grid;grid-template-columns:1fr 1fr;gap:clamp(6px,1vw,10px);position:relative;z-index:1;}
  .cover-card{background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.12);border-radius:14px;padding:clamp(14px,2vw,20px) clamp(10px,1.5vw,14px);display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;gap:8px;}
  .cover-icon{width:clamp(34px,4vw,44px);height:clamp(34px,4vw,44px);border-radius:11px;background:rgba(255,255,255,0.12);border:1.5px solid rgba(255,255,255,0.20);display:flex;align-items:center;justify-content:center;}
  .cover-val{font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:clamp(28px,3.5vw,38px);letter-spacing:-0.02em;color:#fff;line-height:1;}
  .cover-lbl{font-family:'Barlow',sans-serif;font-size:clamp(7px,1vw,9px);font-weight:700;letter-spacing:0.16em;text-transform:uppercase;color:rgba(255,255,255,0.38);}

  .dashboard{background:#f2f2f2;}
  .dash-header{background:${WHITE};border-bottom:1px solid #ebebeb;box-shadow:0 2px 8px rgba(0,0,0,0.04);display:flex;align-items:stretch;min-height:clamp(80px,10vw,110px);flex-wrap:wrap;}
  .dash-brand{padding:0 clamp(14px,2vw,24px);display:flex;align-items:center;gap:12px;border-right:1px solid #f0f0f0;flex-shrink:0;}
  .brand-name{font-family:'Barlow Condensed',sans-serif;font-size:clamp(18px,2.5vw,26px);font-weight:800;letter-spacing:-0.01em;color:${BLACK};text-transform:uppercase;line-height:1;}
  .brand-sub{font-family:'Barlow',sans-serif;font-size:7.5px;font-weight:700;letter-spacing:0.20em;color:${GRAY_L};text-transform:uppercase;margin-top:2px;}
  .kpi-strip{display:flex;flex:1;align-items:stretch;overflow-x:auto;}
  .kpi-card{flex:1;min-width:80px;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:clamp(8px,1.5vw,14px) clamp(6px,1vw,14px);text-align:center;position:relative;gap:2px;border-right:1px solid #f4f4f4;}
  .kpi-card:last-child{border-right:none;}
  .kpi-bar{position:absolute;bottom:0;left:20%;right:20%;height:3px;background:var(--kc);border-radius:3px 3px 0 0;opacity:0.6;}
  .kpi-icon{opacity:0.5;line-height:1;margin-bottom:2px;}
  .kpi-val{font-family:'Barlow Condensed',sans-serif;font-size:clamp(24px,2.8vw,34px);font-weight:800;letter-spacing:-0.02em;color:${BLACK};line-height:1;}
  .kpi-lbl{font-family:'Barlow',sans-serif;font-size:clamp(6px,0.9vw,8px);font-weight:700;letter-spacing:0.16em;text-transform:uppercase;color:${GRAY_L};margin-top:1px;}
  .kpi-delta{font-family:'Barlow',sans-serif;font-size:clamp(8px,1vw,10px);font-weight:700;margin-top:1px;}
  .dash-period{padding:0 clamp(12px,2vw,22px);display:flex;flex-direction:column;align-items:flex-end;justify-content:center;border-left:1px solid #f0f0f0;flex-shrink:0;gap:4px;min-width:clamp(120px,16vw,180px);}
  .period-lbl{font-family:'Barlow',sans-serif;font-size:8px;font-weight:700;letter-spacing:0.20em;text-transform:uppercase;color:${GRAY_L};}
  .period-val{font-family:'Barlow Condensed',sans-serif;font-size:clamp(11px,1.6vw,17px);font-weight:800;letter-spacing:-0.01em;color:${GRAY_D};text-transform:uppercase;text-align:right;line-height:1.2;}
  .cards-grid{padding:clamp(8px,1.5vw,12px) clamp(8px,1.5vw,13px) clamp(6px,1vw,10px);display:grid;grid-template-columns:minmax(0,2.3fr) minmax(0,1fr);gap:clamp(8px,1.2vw,11px);}
  .cards-row{display:grid;grid-template-columns:1fr 1fr;gap:clamp(8px,1.2vw,11px);}
  .card{background:${WHITE};border-radius:16px;border:1px solid #ebebeb;padding:clamp(14px,2vw,18px) clamp(14px,2vw,20px);box-shadow:0 1px 4px rgba(0,0,0,0.04);display:flex;flex-direction:column;}
  .card-title{display:flex;align-items:center;gap:7px;margin-bottom:12px;font-family:'Barlow',sans-serif;font-size:8px;font-weight:700;letter-spacing:0.28em;text-transform:uppercase;color:${GRAY_L};flex-shrink:0;}
  .card-body{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:0;}
  .card-body > div{width:100%;}
  .dash-footer{padding:0 clamp(8px,1.5vw,13px) 8px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;}
  .footer-txt{font-family:'Barlow',sans-serif;font-size:8px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:${GRAY_L};}
  .footer-legend{display:flex;align-items:center;gap:12px;flex-wrap:wrap;}
  .legend-item{display:flex;align-items:center;gap:4px;}
  .legend-dot{width:6px;height:6px;border-radius:2px;}
  .legend-lbl{font-family:'Barlow',sans-serif;font-size:7.5px;font-weight:700;letter-spacing:0.10em;text-transform:uppercase;color:${GRAY_L};}

  @media(max-width:900px){
    .cover{flex-direction:column;min-height:auto;}
    .cover-right{width:100%;}
    .cover-grid{grid-template-columns:repeat(3,1fr);}
    .cards-grid{grid-template-columns:1fr;}
    .cards-row{grid-template-columns:1fr 1fr;}
    .dash-period{display:none;}
  }
  @media(max-width:540px){
    .cover-grid{grid-template-columns:repeat(2,1fr);}
    .kpi-strip{display:grid;grid-template-columns:repeat(3,1fr);}
    .cards-grid{grid-template-columns:1fr;padding:8px;}
    .cards-row{grid-template-columns:1fr;}
  }
  @page{size:A4 landscape;margin:10mm;}
  @media print{
    body{background:#fff!important;}
    .page{max-width:100%;margin:0;page-break-after:always;}
    .cover{min-height:170mm;flex-direction:row!important;}
    .cover-right{width:35%;}
    .cover-grid{grid-template-columns:repeat(2,1fr)!important;}
    .dashboard{min-height:170mm;}
    .cards-grid{grid-template-columns:2.3fr 1fr!important;}
    .cards-row{grid-template-columns:1fr 1fr!important;}
    .kpi-strip{display:flex!important;}
    .dash-period{display:flex!important;}
  }
</style>
</head>
<body>

<!-- ══════════════════════════════════════════
     PÁGINA 1 · PORTADA
     ══════════════════════════════════════════ -->
<div class="page">
<div class="cover">
  <div class="cover-left">
    <div class="cover-badge">
      <div style="width:24px;height:3px;background:${ORANGE};border-radius:2px;flex-shrink:0;"></div>
      <span>Informe Ejecutivo · BotGO Analytics</span>
    </div>
    <div class="cover-hero">
      <div class="cover-title">BOT<span>GO</span></div>
      <div class="cover-sub">ANALYTICS</div>
      <div class="cover-divider"></div>
      <div class="cover-period-lbl">Período analizado</div>
      <div class="cover-period-val">${periodo}</div>
      ${analysisBlock}
    </div>
    <div class="cover-footer">
      <div>
        <div class="cover-client-lbl">Generado para</div>
        <div class="cover-client-name">Grupo Ortiz</div>
        <div class="cover-client-sub">Est. 1959 · 65 años de confianza</div>
      </div>
      <div>
        <div class="cover-date-lbl">Fecha</div>
        <div class="cover-date-val">${todayFmt}</div>
      </div>
    </div>
  </div>
  <div class="cover-right">
    <div class="cover-logo">${logoImgCover}</div>
    <div class="cover-metrics-lbl">Métricas del período</div>
    <div class="cover-grid">${coverCards}</div>
  </div>
</div>
</div>

<!-- ══════════════════════════════════════════
     PÁGINA 2 · DASHBOARD
     ══════════════════════════════════════════ -->
<div class="page">
<div class="dashboard">
  <div class="dash-header">
    <div class="dash-brand">
      ${logoImgDash}
      <div>
        <div class="brand-name">BotGO</div>
        <div class="brand-sub">Analytics Dashboard</div>
      </div>
    </div>
    <div class="kpi-strip">${kpiCards}</div>
    <div class="dash-period">
      <div class="period-lbl">Período</div>
      <div class="period-val">${periodo}</div>
    </div>
  </div>

  <div class="cards-grid">
    ${card('Actividad 14 días — Mensajes · WhatsApp · Sesiones',
      `<div style="overflow-x:auto;width:100%;">
        <svg viewBox="0 0 780 200" style="min-width:320px;width:100%;height:auto;display:block;overflow:visible;">
          ${buildLineSVG(daily14)}
        </svg>
      </div>`, ico.chartS)}

    ${card('Intenciones de usuario',
      `<div style="width:100%;">${intentList}</div>`,
      ico.intentS)}

    <div class="cards-row">
      ${card('Top productos consultados',
        `<div style="width:100%;">${prodBars}</div>`,
        ico.prodS)}

      ${card('Distribución intenciones',
        `<div style="display:flex;align-items:center;justify-content:center;gap:12px;flex-wrap:wrap;width:100%;">
          <svg viewBox="0 0 140 140" width="120" height="120" style="flex-shrink:0;">
            ${buildDonutSVG(intentPairs, iColors)}
          </svg>
          <div style="flex:1;min-width:80px;">
            ${intentPairs.map(([key,val],i) => {
              const p=Math.round(val/totalIntents*100);
              return `<div style="display:flex;align-items:center;gap:6px;margin-bottom:8px;">
                <div style="width:8px;height:8px;border-radius:2px;background:${iColors[i%iColors.length]};flex-shrink:0;"></div>
                <span style="font-family:'Barlow',sans-serif;font-size:9px;font-weight:600;color:${GRAY_D};flex:1;">${iLabels[key]||key}</span>
                <span style="font-family:'Barlow Condensed',sans-serif;font-size:16px;font-weight:800;color:${BLACK};">${p}%</span>
              </div>`;
            }).join('')}
          </div>
        </div>`, ico.donutS)}
    </div>

    ${card('Volumen de productos',
      `<div style="overflow-x:auto;width:100%;">
        <svg viewBox="0 0 320 180" style="min-width:200px;width:100%;height:auto;display:block;overflow:visible;">
          ${buildBarSVG(topProds.slice(0,6), ORANGE)}
        </svg>
      </div>`, ico.barS)}
  </div>

  <div class="dash-footer">
    <span class="footer-txt">Grupo Ortiz · BotGO Analytics · ${todayFmt}</span>
    <div class="footer-legend">
      ${[{c:ORANGE,l:'Mensajes'},{c:'#22c55e',l:'WhatsApp'},{c:'#6366f1',l:'Sesiones'},{c:'#0ea5e9',l:'PDFs'},{c:GREEN,l:'Distribuid.'}]
        .map(s=>`<div class="legend-item"><div class="legend-dot" style="background:${s.c};"></div><span class="legend-lbl">${s.l}</span></div>`).join('')}
    </div>
    <span class="footer-txt">reporte-botgo-${today}.html</span>
  </div>
</div>
</div>

${distribSection}

</body>
</html>`;
}

// ── Llamada a /api/chat para análisis IA ─────────────────────────────────────
async function generateAnalysis(data, periodo) {
  try {
    const tp   = Object.entries(data?.products||{}).sort(([,a],[,b])=>b-a).slice(0,5).map(([k,v])=>`${k}:${v}`).join(', ');
    const tk   = Object.entries(data?.keywords||{}).sort(([,a],[,b])=>b-a).slice(0,8).map(([k,v])=>`${k}:${v}`).join(', ');
    const msgs = (data?.lastMessages||[]).slice(-20).map(m=>m.user).join(' | ');
    const prompt = `Eres analista ejecutivo de ventas de Grupo Ortiz (empaques industriales, México).
Analiza los datos del chatbot BotGO del período "${periodo}" y genera un resumen ejecutivo en español (máximo 180 palabras).

DATOS:
Sesiones:${data.totalSessions||0}|Mensajes:${data.totalMessages||0}|WhatsApp:${data.totalWhatsApp||0}|PDFs:${data.totalPDFs||0}
Productos top: ${tp||'sin datos'}
Keywords top: ${tk||'sin datos'}
Intenciones: Compra=${data.intents?.compra||0}, Info=${data.intents?.info||0}, PDF=${data.intents?.pdf||0}, Empleo=${data.intents?.reclutamiento||0}
Consultas recientes: ${msgs.substring(0,400)||'sin datos'}

INSTRUCCIONES:
- Escribe exactamente 4 bullets con los hallazgos más importantes
- Cada bullet empieza con "- " (guión espacio)
- Incluye: comportamiento general, producto estrella, oportunidades, recomendación comercial
- Usa números concretos de los datos
- NO uses asteriscos, negritas ni markdown
- Empieza DIRECTAMENTE con el primer bullet, sin título ni introducción`;

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages:[{role:'user',content:prompt}], language:'es', isVoice:false }),
    });
    if (!res.ok) { console.error('❌ /api/chat status:', res.status); return null; }
    const json = await res.json();
    const analysis = (json.reply||'').trim();
    if (!analysis) { console.error('❌ reply vacío'); return null; }
    console.log('✅ Análisis OK:', analysis.slice(0,80)+'…');
    return analysis;
  } catch (err) {
    console.error('❌ generateAnalysis error:', err.message);
    return null;
  }
}

// ── Botón de descarga ────────────────────────────────────────────────────────
export function DownloadReportButton({ data, periodMeta = null, style = {} }) {
  const [busy,   setBusy]   = useState(false);
  const [status, setStatus] = useState('idle');

  const download = async () => {
    if (!data) return;
    setBusy(true);
    try {
      const allDates = Object.keys(data?.daily||{}).sort();
      const now = new Date();
      const todayFmt = now.toLocaleDateString('es-MX',{day:'2-digit',month:'short',year:'2-digit'});
      const fmt = ymd => { if(!ymd)return''; const d=new Date(ymd+'T00:00:00'); return d.toLocaleDateString('es-MX',{day:'2-digit',month:'short',year:'2-digit'}); };
      let periodo = todayFmt;
      if (periodMeta) {
        if      (periodMeta.preset==='today')  periodo = 'Hoy · '+fmt(periodMeta.from);
        else if (periodMeta.preset==='7d')     periodo = '7 días · '+fmt(periodMeta.from)+' — '+fmt(periodMeta.to);
        else if (periodMeta.preset==='30d')    periodo = '30 días · '+fmt(periodMeta.from)+' — '+fmt(periodMeta.to);
        else if (periodMeta.preset==='month')  { const d=new Date(periodMeta.from+'T00:00:00'); periodo='Mes de '+d.toLocaleDateString('es-MX',{month:'long',year:'numeric'}); }
        else if (periodMeta.preset==='all' && allDates.length>=2) periodo='Todo · '+allDates[0].slice(5).replace('-','/')+' — '+allDates[allDates.length-1].slice(5).replace('-','/');
        else if (periodMeta.from && periodMeta.to) periodo=fmt(periodMeta.from)+' — '+fmt(periodMeta.to);
      } else if (allDates.length>=2) {
        periodo = allDates[0].slice(5).replace('-','/')+' — '+allDates[allDates.length-1].slice(5).replace('-','/');
      }

      // Análisis IA + logo base64 + leads en paralelo
      setStatus('analyzing');
      const [analysis, logoBase64, leadsRes] = await Promise.all([
        generateAnalysis(data, periodo),
        fetchLogoBase64(),
        fetch('/api/analytics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'getLeads' }),
        }).then(r => r.json()).catch(() => ({ ok: false, leads: [] })),
      ]);

      const leads = leadsRes?.ok ? (leadsRes.leads || []) : [];

      setStatus('building');
      const html = buildReportHTML(data, periodMeta, analysis, logoBase64, leads);

      const slug =
        periodMeta?.preset==='today'  ? 'hoy'      :
        periodMeta?.preset==='7d'     ? '7dias'     :
        periodMeta?.preset==='30d'    ? '30dias'    :
        periodMeta?.preset==='month'  ? 'mes'       :
        periodMeta?.preset==='all'    ? 'completo'  :
        periodMeta?.from && periodMeta?.to ? `${periodMeta.from}_${periodMeta.to}` :
        new Date().toISOString().split('T')[0];

      const blob = new Blob([html], {type:'text/html;charset=utf-8'});
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href = url; a.download = `reporte-botgo-${slug}.html`;
      document.body.appendChild(a); a.click();
      document.body.removeChild(a); URL.revokeObjectURL(url);
      setStatus('done');
    } catch(e) { console.error(e); }
    setBusy(false);
    setTimeout(() => setStatus('idle'), 2000);
  };

  const labels = {idle:'↓ Reporte', analyzing:'Analizando…', building:'Generando…', done:'✓ Listo'};

  return (
    <button
      onClick={download}
      disabled={!data || busy}
      style={{
        padding:'8px 16px', borderRadius:9, fontSize:11, fontWeight:700,
        cursor: !data||busy ? 'not-allowed' : 'pointer',
        fontFamily:"'Barlow',system-ui,sans-serif",
        letterSpacing:'0.08em', textTransform:'uppercase',
        display:'flex', alignItems:'center', gap:7,
        border:'1px solid rgba(0,229,160,0.3)',
        background: busy ? 'rgba(0,0,0,0.2)' : 'rgba(0,229,160,0.08)',
        color: busy ? '#4c627d' : '#00e5a0',
        transition:'all 0.2s ease', backdropFilter:'blur(4px)',
        ...style,
      }}
    >
      {busy
        ? <><div style={{width:11,height:11,borderRadius:'50%',border:'2px solid rgba(0,229,160,0.2)',borderTop:'2px solid #00e5a0',animation:'spin 0.75s linear infinite'}}/>{labels[status]}</>
        : labels[status]
      }
    </button>
  );
}

export { buildReportHTML };
export default DownloadReportButton;