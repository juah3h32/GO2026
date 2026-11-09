// src/components/InicioRHTab.jsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale,
  PointElement, LineElement, BarElement,
  Title, Tooltip, Legend, Filler,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { DARK_C, LIGHT_C, T } from './RecruitmentTab';

ChartJS.register(
  CategoryScale, LinearScale,
  PointElement, LineElement, BarElement,
  Title, Tooltip, Legend, Filler
);

const MESES = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];

function monthKey(d) { return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`; }
function dateKey(c) { return (c.created_at || c.ts || '').replace(' ', 'T').slice(0, 7); }

export default function InicioRHTab({ theme = 'dark', role = null }) {
  const C = theme === 'dark' ? DARK_C : LIGHT_C;
  const isAdmin = !!role?.isAdminRole;

  const [candidates, setCandidates] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [goal,       setGoal]       = useState(0);
  const [goalInput,  setGoalInput]  = useState('');
  const [savingGoal, setSavingGoal] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [rc, rg] = await Promise.all([
        fetch('/api/recruitment', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'list' }) }),
        fetch('/api/recruitment', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'getGoal' }) }),
      ]);
      const jc = await rc.json().catch(() => ({ ok: false }));
      if (jc.ok) setCandidates(jc.candidates || []);
      const jg = await rg.json().catch(() => ({ ok: false }));
      if (jg.ok) { setGoal(Number(jg.goal) || 0); setGoalInput(jg.goal ? String(jg.goal) : ''); }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const saveGoal = async () => {
    const n = Number(goalInput);
    if (!Number.isFinite(n) || n < 0) return;
    setSavingGoal(true);
    try {
      const r = await fetch('/api/recruitment', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'setGoal', goal: n }) });
      const j = await r.json().catch(() => ({ ok: false }));
      if (j.ok) setGoal(n);
    } catch (e) { console.error(e); }
    setSavingGoal(false);
  };

  const now    = new Date();
  const curKey = monthKey(now);

  const registradosMes  = useMemo(() => candidates.filter(c => dateKey(c) === curKey).length, [candidates, curKey]);
  const contratadosMes  = useMemo(() => candidates.filter(c => c.status === 'contratado' && dateKey(c) === curKey).length, [candidates, curKey]);
  const contratadosTotal = useMemo(() => candidates.filter(c => c.status === 'contratado').length, [candidates]);

  const monthlySeries = useMemo(() => {
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({ key: monthKey(d), label: MESES[d.getMonth()] });
    }
    const counts = months.map(m => candidates.filter(c => dateKey(c) === m.key).length);
    return { labels: months.map(m => m.label), counts };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [candidates]);

  const topVacantes = useMemo(() => {
    const byPuesto = candidates.reduce((acc, c) => {
      const p = (c.puesto || 'Sin puesto').trim() || 'Sin puesto';
      acc[p] = (acc[p] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(byPuesto).sort((a, b) => b[1] - a[1]).slice(0, 6);
  }, [candidates]);

  const progreso = goal > 0 ? Math.min(100, Math.round((registradosMes / goal) * 100)) : 0;

  const lineData = {
    labels: monthlySeries.labels,
    datasets: [{
      label: 'Candidatos registrados',
      data: monthlySeries.counts,
      borderColor: C.orange,
      backgroundColor: 'rgba(232,82,26,0.14)',
      fill: true, tension: 0.35, pointRadius: 3, borderWidth: 2,
    }],
  };

  const barData = {
    labels: topVacantes.map(([k]) => k.length > 18 ? k.slice(0, 17) + '…' : k),
    datasets: [{
      data: topVacantes.map(([, v]) => v),
      backgroundColor: C.orange,
      borderRadius: 6,
      maxBarThickness: 28,
    }],
  };

  const chartOpts = (horizontal = false) => ({
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: horizontal ? 'y' : 'x',
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { color: C.border2 }, ticks: { color: C.textSub, font: { size: 11 } }, beginAtZero: true },
      y: { grid: { color: C.border2 }, ticks: { color: C.textSub, font: { size: 11 }, precision: 0 }, beginAtZero: true },
    },
  });

  const CARD = { background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: '20px 22px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '80px 0' }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{ width: 22, height: 22, borderRadius: '50%', border: `1.5px solid ${C.border}`, borderTop: `1.5px solid ${C.orange}`, animation: 'spin 0.7s linear infinite' }} />
    </div>
  );

  return (
    <div style={{ fontFamily: T.sans }}>
      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(170px,1fr))', gap: 12, marginBottom: 14 }}>
        <div style={CARD}>
          <div style={{ fontSize: 11, color: C.textSub, marginBottom: 6 }}>Registrados este mes</div>
          <div style={{ fontSize: 26, fontWeight: 700, color: C.text }}>{registradosMes}</div>
        </div>
        <div style={CARD}>
          <div style={{ fontSize: 11, color: C.textSub, marginBottom: 6 }}>Contratados este mes</div>
          <div style={{ fontSize: 26, fontWeight: 700, color: C.green }}>{contratadosMes}</div>
        </div>
        <div style={CARD}>
          <div style={{ fontSize: 11, color: C.textSub, marginBottom: 6 }}>Contratados historico</div>
          <div style={{ fontSize: 26, fontWeight: 700, color: C.text }}>{contratadosTotal}</div>
        </div>
        <div style={CARD}>
          <div style={{ fontSize: 11, color: C.textSub, marginBottom: 6 }}>Total candidatos</div>
          <div style={{ fontSize: 26, fontWeight: 700, color: C.text }}>{candidates.length}</div>
        </div>
      </div>

      {/* Meta del mes */}
      <div style={{ ...CARD, marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
          <div style={{ fontSize: 12, color: C.textSub, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Meta del mes</div>
          {isAdmin && (
            <div style={{ display: 'flex', gap: 6 }}>
              <input type="number" min="0" value={goalInput} onChange={e => setGoalInput(e.target.value)}
                placeholder="meta"
                style={{ width: 80, padding: '5px 8px', borderRadius: 6, border: `1px solid ${C.border}`, background: C.surface2, color: C.text, fontSize: 12, fontFamily: T.sans }} />
              <button onClick={saveGoal} disabled={savingGoal}
                style={{ padding: '5px 14px', borderRadius: 6, border: 'none', background: C.orange, color: '#fff', fontSize: 12, fontWeight: 600, cursor: savingGoal ? 'default' : 'pointer', opacity: savingGoal ? 0.7 : 1 }}>
                {savingGoal ? '...' : 'Guardar'}
              </button>
            </div>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
          <span style={{ fontSize: 22, fontWeight: 700, color: C.text }}>{registradosMes}</span>
          <span style={{ fontSize: 13, color: C.textSub }}>/ {goal || '—'} candidatos</span>
          {goal > 0 && <span style={{ fontSize: 12, color: C.textSub, marginLeft: 'auto' }}>{progreso}%</span>}
        </div>
        <div style={{ height: 8, borderRadius: 4, background: C.surface3, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${progreso}%`, background: C.orange, borderRadius: 4, transition: 'width 0.3s ease' }} />
        </div>
      </div>

      {/* Graficas */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 12 }}>
        <div style={{ ...CARD, height: 290 }}>
          <div style={{ fontSize: 12, color: C.textSub, fontWeight: 600, marginBottom: 12 }}>Registros por mes (ultimos 6 meses)</div>
          <div style={{ height: 220 }}><Line data={lineData} options={chartOpts(false)} /></div>
        </div>
        <div style={{ ...CARD, height: 290 }}>
          <div style={{ fontSize: 12, color: C.textSub, fontWeight: 600, marginBottom: 12 }}>Vacante mas postulada</div>
          <div style={{ height: 220 }}>
            {topVacantes.length > 0
              ? <Bar data={barData} options={chartOpts(true)} />
              : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: C.textDim, fontSize: 12 }}>Sin datos aun</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
