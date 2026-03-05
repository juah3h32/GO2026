// src/components/PeriodSelector.jsx
// Selector de período para el dashboard de analytics BotGO
// Uso: <PeriodSelector onPeriodChange={(from, to) => fetchData(from, to)} />

import React, { useState, useCallback } from 'react';

// ── Helpers ───────────────────────────────────────────────────────────────────
function toYMD(date) {
  return date.toISOString().split('T')[0];
}

function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

const today      = new Date();
const todayYMD   = toYMD(today);

const PRESETS = [
  {
    id: 'today',
    label: 'Hoy',
    get: () => ({ from: todayYMD, to: todayYMD }),
  },
  {
    id: '7d',
    label: 'Últimos 7 días',
    get: () => ({ from: toYMD(addDays(today, -6)), to: todayYMD }),
  },
  {
    id: '30d',
    label: 'Últimos 30 días',
    get: () => ({ from: toYMD(addDays(today, -29)), to: todayYMD }),
  },
  {
    id: 'month',
    label: 'Este mes',
    get: () => {
      const first = new Date(today.getFullYear(), today.getMonth(), 1);
      return { from: toYMD(first), to: todayYMD };
    },
  },
  {
    id: 'custom',
    label: 'Personalizado',
    get: () => null, // Se maneja con inputs
  },
];

// ── Estilos inline ────────────────────────────────────────────────────────────
const S = {
  wrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexWrap: 'wrap',
    fontFamily: "'NeueMontreal','Barlow',Helvetica,Arial,sans-serif",
  },
  label: {
    fontSize: '9px',
    fontWeight: 700,
    letterSpacing: '0.20em',
    textTransform: 'uppercase',
    color: '#bbb',
    marginRight: '4px',
    flexShrink: 0,
  },
  presetBtn: (active) => ({
    padding: '5px 13px',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: active ? 700 : 500,
    cursor: 'pointer',
    border: active ? '1.5px solid #F24F13' : '1.5px solid #e8e8e8',
    background: active ? '#F24F13' : '#fff',
    color: active ? '#fff' : '#555',
    transition: 'all 0.15s ease',
    letterSpacing: '0.02em',
    flexShrink: 0,
  }),
  divider: {
    width: '1px',
    height: '20px',
    background: '#e8e8e8',
    flexShrink: 0,
  },
  dateInput: {
    padding: '5px 10px',
    borderRadius: '8px',
    fontSize: '11px',
    fontWeight: 500,
    border: '1.5px solid #e8e8e8',
    color: '#333',
    background: '#fff',
    cursor: 'pointer',
    outline: 'none',
    fontFamily: "'NeueMontreal','Barlow',Helvetica,Arial,sans-serif",
    transition: 'border-color 0.15s',
  },
  applyBtn: (canApply) => ({
    padding: '5px 14px',
    borderRadius: '8px',
    fontSize: '11px',
    fontWeight: 700,
    cursor: canApply ? 'pointer' : 'not-allowed',
    border: 'none',
    background: canApply ? '#F24F13' : '#f0f0f0',
    color: canApply ? '#fff' : '#ccc',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    transition: 'all 0.15s ease',
    flexShrink: 0,
  }),
  separator: {
    fontSize: '11px',
    color: '#bbb',
    flexShrink: 0,
  },
};

// ── Componente ────────────────────────────────────────────────────────────────
export default function PeriodSelector({ onPeriodChange, initialPreset = '30d' }) {
  const [activePreset, setActivePreset] = useState(initialPreset);
  const [customFrom,   setCustomFrom]   = useState('');
  const [customTo,     setCustomTo]     = useState('');

  // Aplicar preset al montar
  React.useEffect(() => {
    const preset = PRESETS.find(p => p.id === initialPreset);
    if (preset && preset.get()) {
      const { from, to } = preset.get();
      onPeriodChange?.(from, to);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePreset = useCallback((preset) => {
    setActivePreset(preset.id);
    if (preset.id !== 'custom') {
      const range = preset.get();
      setCustomFrom('');
      setCustomTo('');
      onPeriodChange?.(range.from, range.to);
    }
  }, [onPeriodChange]);

  const handleApplyCustom = useCallback(() => {
    if (!customFrom || !customTo) return;
    if (customFrom > customTo) {
      alert('La fecha de inicio debe ser anterior a la fecha fin.');
      return;
    }
    onPeriodChange?.(customFrom, customTo);
  }, [customFrom, customTo, onPeriodChange]);

  const canApply = activePreset === 'custom' && customFrom && customTo;

  return (
    <div style={S.wrap}>
      <span style={S.label}>Período</span>

      {/* Presets */}
      {PRESETS.filter(p => p.id !== 'custom').map(preset => (
        <button
          key={preset.id}
          onClick={() => handlePreset(preset)}
          style={S.presetBtn(activePreset === preset.id)}
        >
          {preset.label}
        </button>
      ))}

      <div style={S.divider} />

      {/* Personalizado */}
      <button
        onClick={() => handlePreset(PRESETS.find(p => p.id === 'custom'))}
        style={S.presetBtn(activePreset === 'custom')}
      >
        Personalizado
      </button>

      {activePreset === 'custom' && (
        <>
          <input
            type="date"
            value={customFrom}
            max={customTo || todayYMD}
            onChange={e => setCustomFrom(e.target.value)}
            style={S.dateInput}
          />
          <span style={S.separator}>→</span>
          <input
            type="date"
            value={customTo}
            min={customFrom}
            max={todayYMD}
            onChange={e => setCustomTo(e.target.value)}
            style={S.dateInput}
          />
          <button
            onClick={handleApplyCustom}
            disabled={!canApply}
            style={S.applyBtn(canApply)}
          >
            Aplicar
          </button>
        </>
      )}
    </div>
  );
}