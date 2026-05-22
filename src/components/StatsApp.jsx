import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale,
  PointElement, LineElement,
  BarElement, ArcElement,
  Title, Tooltip, Legend, Filler,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale, LinearScale,
  PointElement, LineElement,
  BarElement, ArcElement,
  Title, Tooltip, Legend, Filler
);

// ── Paleta ────────────────────────────────────────────────────────────────────
const C = {
  bg:       '#0f0f0f',
  card:     '#181818',
  border:   '#2a2a2a',
  accent:   '#FB670B',
  text:     '#ECEBE0',
  muted:    '#666',
  blue:     '#4A9EFF',
  green:    '#4ADE80',
  red:      '#F87171',
  purple:   '#A78BFA',
  yellow:   '#FBBF24',
};

const STATUS_COLOR = {
  nuevo:       C.blue,
  visto:       C.purple,
  contactado:  C.accent,
  contratado:  C.green,
  descartado:  C.red,
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function getRange(r) {
  const to   = new Date();
  const from = new Date();
  if (r === 'today') { from.setHours(0,0,0,0); }
  else if (r === '7d')  { from.setDate(from.getDate() - 7); }
  else if (r === '30d') { from.setDate(from.getDate() - 30); }
  else                  { from.setDate(from.getDate() - 90); }
  return {
    from: from.toISOString().split('T')[0],
    to:   to.toISOString().split('T')[0],
  };
}

function buildDailyArrays(daily = {}, range) {
  const days = range === 'today' ? 1 : range === '7d' ? 7 : range === '30d' ? 30 : 90;
  const labels = [], msgs = [], sess = [], wa = [];
  for (let i = days - 1; i >= 0; i--) {
    const d   = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split('T')[0];
    const label = days <= 7
      ? d.toLocaleDateString('es-MX', { weekday: 'short' })
      : `${d.getDate()}/${d.getMonth() + 1}`;
    labels.push(label);
    msgs.push(daily[key]?.messages || 0);
    sess.push(daily[key]?.sessions || 0);
    wa.push(daily[key]?.wa || 0);
  }
  return { labels, msgs, sess, wa };
}

function topN(obj = {}, n = 8) {
  return Object.entries(obj)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n);
}

// ── Chart options factory ─────────────────────────────────────────────────────
function lineOpts(title) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: { labels: { color: C.muted, boxWidth: 10, font: { size: 11 } } },
      title:  { display: false },
      tooltip: {
        backgroundColor: '#1c1c1c',
        borderColor: C.border,
        borderWidth: 1,
        titleColor: C.text,
        bodyColor:  C.muted,
      },
    },
    scales: {
      x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: C.muted, font: { size: 10 } } },
      y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: C.muted, font: { size: 10 } }, beginAtZero: true },
    },
  };
}

function barOpts(horizontal = false) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: horizontal ? 'y' : 'x',
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1c1c1c',
        borderColor: C.border,
        borderWidth: 1,
        titleColor: C.text,
        bodyColor:  C.muted,
      },
    },
    scales: {
      x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: C.muted, font: { size: 10 } } },
      y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: C.muted, font: { size: 10 } } },
    },
  };
}

function doughnutOpts() {
  return {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: C.muted, boxWidth: 10, font: { size: 11 }, padding: 12 },
      },
      tooltip: {
        backgroundColor: '#1c1c1c',
        borderColor: C.border,
        borderWidth: 1,
        titleColor: C.text,
        bodyColor:  C.muted,
      },
    },
  };
}

// ── Sub-components ────────────────────────────────────────────────────────────
function KPICard({ label, value, icon, color = C.accent, sub }) {
  return (
    <div style={{
      background: C.card,
      border: `1px solid ${C.border}`,
      borderRadius: 12,
      padding: '14px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
        <span style={{ fontSize: 16 }}>{icon}</span>
        <span style={{ fontSize: 11, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
      </div>
      <span style={{ fontSize: 28, fontWeight: 700, color: C.text, lineHeight: 1 }}>
        {value ?? '–'}
      </span>
      {sub && <span style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{sub}</span>}
    </div>
  );
}

function ChartCard({ title, height = 220, children }) {
  return (
    <div style={{
      background: C.card,
      border: `1px solid ${C.border}`,
      borderRadius: 12,
      padding: '16px',
    }}>
      <p style={{ fontSize: 12, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
        {title}
      </p>
      <div style={{ height }}>
        {children}
      </div>
    </div>
  );
}

function RangeBtn({ label, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      background: active ? C.accent : 'transparent',
      border: `1px solid ${active ? C.accent : C.border}`,
      color: active ? '#fff' : C.muted,
      borderRadius: 6,
      padding: '4px 10px',
      fontSize: 12,
      cursor: 'pointer',
      fontWeight: active ? 600 : 400,
      transition: 'all 0.15s',
    }}>
      {label}
    </button>
  );
}

// ── Estilos compartidos del login ─────────────────────────────────────────────
const inputStyle = (hasError) => ({
  background: C.card,
  border: `1px solid ${hasError ? C.red : C.border}`,
  borderRadius: 10,
  padding: '12px 14px',
  color: C.text,
  fontSize: 16,
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
});

const btnPrimary = (disabled) => ({
  background: disabled ? '#333' : C.accent,
  border: 'none',
  borderRadius: 10,
  padding: '13px',
  color: disabled ? C.muted : '#fff',
  fontSize: 16,
  fontWeight: 700,
  cursor: disabled ? 'default' : 'pointer',
  letterSpacing: 1,
  transition: 'background 0.15s',
  width: '100%',
});

const btnGhost = {
  background: 'transparent',
  border: 'none',
  color: C.muted,
  fontSize: 13,
  cursor: 'pointer',
  textDecoration: 'underline',
  padding: '4px 0',
};

function GoLogo({ subtitle }) {
  return (
    <div style={{ textAlign: 'center', marginBottom: 32 }}>
      <div style={{
        width: 56, height: 56, background: C.accent, borderRadius: 16,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12,
      }}>
        <span style={{ color: '#fff', fontWeight: 900, fontSize: 22, letterSpacing: -1 }}>GO</span>
      </div>
      <h1 style={{ color: C.text, fontSize: 22, fontWeight: 700, margin: 0, letterSpacing: -0.5 }}>Stats</h1>
      <p style={{ color: C.muted, fontSize: 13, marginTop: 4 }}>{subtitle}</p>
    </div>
  );
}

// ── Login Screen ──────────────────────────────────────────────────────────────
// step: 'login' | 'recover-request' | 'recover-otp' | 'recover-done'
function LoginScreen() {
  const [step, setStep]           = useState('login');

  // Login state
  const [pw, setPw]               = useState('');
  const [loginErr, setLoginErr]   = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [shake, setShake]         = useState(false);
  const inputRef                  = useRef(null);

  // Recovery state
  const [recUsername, setRecUsername] = useState('');
  const [recToken, setRecToken]       = useState('');
  const [recOtp, setRecOtp]           = useState('');
  const [recNewPw, setRecNewPw]       = useState('');
  const [recErr, setRecErr]           = useState('');
  const [recLoading, setRecLoading]   = useState(false);

  useEffect(() => { inputRef.current?.focus(); }, [step]);

  // ── Login ──────────────────────────────────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!pw.trim() || loginLoading) return;
    setLoginLoading(true);
    setLoginErr('');
    try {
      const res  = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pw }),
        credentials: 'include',
      });
      const data = await res.json();
      if (data.ok) {
        window.location.reload();
      } else {
        setLoginErr(data.error || 'Contraseña incorrecta');
        setShake(true);
        setPw('');
        setTimeout(() => setShake(false), 600);
      }
    } catch {
      setLoginErr('Error de conexión');
    } finally {
      setLoginLoading(false);
    }
  };

  // ── Paso 1 recovery: pedir OTP ─────────────────────────────────────────────
  const handleRecoverRequest = async (e) => {
    e.preventDefault();
    if (!recUsername || recLoading) return;
    setRecLoading(true);
    setRecErr('');
    try {
      const res  = await fetch('/api/recover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'request', username: recUsername }),
      });
      const data = await res.json();
      if (data.ok) {
        setRecToken(data.token);
        setStep('recover-otp');
      } else {
        setRecErr(data.error || 'Error al enviar el código');
      }
    } catch {
      setRecErr('Error de conexión');
    } finally {
      setRecLoading(false);
    }
  };

  // ── Paso 2 recovery: verificar OTP y nueva contraseña ─────────────────────
  const handleRecoverReset = async (e) => {
    e.preventDefault();
    if (!recOtp.trim() || !recNewPw.trim() || recLoading) return;
    setRecLoading(true);
    setRecErr('');
    try {
      const res  = await fetch('/api/recover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reset', token: recToken, otp: recOtp.trim(), newPassword: recNewPw }),
      });
      const data = await res.json();
      if (data.ok) {
        setStep('recover-done');
      } else {
        setRecErr(data.error || 'Error al cambiar contraseña');
      }
    } catch {
      setRecErr('Error de conexión');
    } finally {
      setRecLoading(false);
    }
  };

  const wrapper = {
    minHeight: '100dvh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: C.bg,
    padding: 24,
  };

  // ── Render: login ──────────────────────────────────────────────────────────
  if (step === 'login') return (
    <div style={wrapper}>
      <div style={{ width: '100%', maxWidth: 340, animation: shake ? 'shake 0.5s ease' : undefined }}>
        <GoLogo subtitle="Ingresa con tu contraseña" />
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input
            ref={inputRef}
            type="password"
            value={pw}
            onChange={e => setPw(e.target.value)}
            placeholder="Contraseña"
            autoComplete="current-password"
            style={inputStyle(!!loginErr)}
          />
          {loginErr && <p style={{ color: C.red, fontSize: 12, margin: 0, textAlign: 'center' }}>{loginErr}</p>}
          <button type="submit" disabled={loginLoading} style={btnPrimary(loginLoading)}>
            {loginLoading ? '…' : 'GO →'}
          </button>
        </form>
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <button style={btnGhost} onClick={() => { setRecErr(''); setStep('recover-request'); }}>
            ¿Olvidaste tu contraseña?
          </button>
        </div>
      </div>
      <style>{`@keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-8px)}40%{transform:translateX(8px)}60%{transform:translateX(-6px)}80%{transform:translateX(6px)}}`}</style>
    </div>
  );

  // ── Render: recover-request ────────────────────────────────────────────────
  if (step === 'recover-request') return (
    <div style={wrapper}>
      <div style={{ width: '100%', maxWidth: 340 }}>
        <GoLogo subtitle="Recuperar contraseña" />
        <p style={{ color: C.muted, fontSize: 13, textAlign: 'center', marginBottom: 20, lineHeight: 1.6 }}>
          El código se enviará al <strong style={{ color: C.text }}>administrador</strong>,<br />
          quien te lo compartirá por WhatsApp.
        </p>
        <form onSubmit={handleRecoverRequest} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <select
            ref={inputRef}
            value={recUsername}
            onChange={e => setRecUsername(e.target.value)}
            style={{ ...inputStyle(false), appearance: 'none' }}
          >
            <option value="">Selecciona tu usuario…</option>
            <option value="Admin">Admin</option>
            <option value="RH">RH</option>
            <option value="Marketing">Marketing</option>
            <option value="Distribuidor">Distribuidor</option>
          </select>
          {recErr && <p style={{ color: C.red, fontSize: 12, margin: 0, textAlign: 'center' }}>{recErr}</p>}
          <button type="submit" disabled={recLoading || !recUsername} style={btnPrimary(recLoading || !recUsername)}>
            {recLoading ? 'Enviando…' : 'Enviar código al admin →'}
          </button>
        </form>
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <button style={btnGhost} onClick={() => setStep('login')}>← Volver al login</button>
        </div>
      </div>
    </div>
  );

  // ── Render: recover-otp ────────────────────────────────────────────────────
  if (step === 'recover-otp') return (
    <div style={wrapper}>
      <div style={{ width: '100%', maxWidth: 340 }}>
        <GoLogo subtitle="Ingresa el código" />
        <p style={{ color: C.muted, fontSize: 13, textAlign: 'center', marginBottom: 20, lineHeight: 1.5 }}>
          Código enviado a tu WhatsApp.<br />
          <span style={{ color: C.text, fontWeight: 600 }}>Vence en 10 minutos.</span>
        </p>
        <form onSubmit={handleRecoverReset} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input
            ref={inputRef}
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={recOtp}
            onChange={e => setRecOtp(e.target.value.replace(/\D/g,''))}
            placeholder="Código de 6 dígitos"
            style={{ ...inputStyle(false), textAlign: 'center', fontSize: 24, letterSpacing: 6, fontWeight: 700 }}
          />
          <input
            type="password"
            value={recNewPw}
            onChange={e => setRecNewPw(e.target.value)}
            placeholder="Nueva contraseña (mín. 6 caracteres)"
            autoComplete="new-password"
            style={inputStyle(false)}
          />
          {recErr && <p style={{ color: C.red, fontSize: 12, margin: 0, textAlign: 'center' }}>{recErr}</p>}
          <button type="submit" disabled={recLoading || recOtp.length < 6 || recNewPw.length < 6} style={btnPrimary(recLoading || recOtp.length < 6 || recNewPw.length < 6)}>
            {recLoading ? 'Verificando…' : 'Cambiar contraseña →'}
          </button>
        </form>
        <div style={{ textAlign: 'center', marginTop: 16, display: 'flex', gap: 16, justifyContent: 'center' }}>
          <button style={btnGhost} onClick={() => { setRecErr(''); setStep('recover-request'); }}>
            Reenviar código
          </button>
          <button style={btnGhost} onClick={() => setStep('login')}>← Cancelar</button>
        </div>
      </div>
    </div>
  );

  // ── Render: recover-done ───────────────────────────────────────────────────
  if (step === 'recover-done') return (
    <div style={wrapper}>
      <div style={{ width: '100%', maxWidth: 340, textAlign: 'center' }}>
        <div style={{ fontSize: 52, marginBottom: 16 }}>✅</div>
        <h2 style={{ color: C.text, fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Contraseña actualizada</h2>
        <p style={{ color: C.muted, fontSize: 14, marginBottom: 28, lineHeight: 1.5 }}>
          Tu contraseña fue cambiada exitosamente.<br />Ya puedes iniciar sesión.
        </p>
        <button style={btnPrimary(false)} onClick={() => setStep('login')}>
          Ir al login →
        </button>
      </div>
    </div>
  );

  return null;
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
function Dashboard({ roleName }) {
  const [range, setRange]   = useState('7d');
  const [analytics, setAnalytics] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [vacantes, setVacantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [installPrompt, setInstallPrompt] = useState(null);

  // Capture PWA install prompt
  useEffect(() => {
    const handler = (e) => { e.preventDefault(); setInstallPrompt(e); };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const { from, to } = getRange(range);
      const [aRes, cRes, vRes] = await Promise.all([
        fetch('/api/analytics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'get', from, to }),
          credentials: 'include',
        }),
        fetch('/api/recruitment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'list' }),
          credentials: 'include',
        }),
        fetch('/api/vacantes', { credentials: 'include' }),
      ]);

      const [aData, cData, vData] = await Promise.all([
        aRes.json(), cRes.json(), vRes.json(),
      ]);

      if (aData.ok) setAnalytics(aData.data);
      if (cData.ok) setCandidates(cData.leads || cData.candidates || []);
      if (vData.ok) setVacantes(vData.vacantes || []);
      setLastUpdate(new Date());
    } catch (err) {
      console.error('Stats fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [range]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const logout = async () => {
    await fetch('/api/logout', { method: 'POST', credentials: 'include' });
    window.location.reload();
  };

  const installApp = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') setInstallPrompt(null);
  };

  // ── Computed ──────────────────────────────────────────────────────────────
  const a = analytics || {};
  const daily = buildDailyArrays(a.daily, range);

  const byStatus = candidates.reduce((acc, c) => {
    const s = c.status || 'nuevo';
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {});

  const topProducts = topN(a.products || a.intents || {}, 8);
  const vacantesActivas = vacantes.filter(v => v.active).length;

  // ── Chart data ─────────────────────────────────────────────────────────────
  const lineData = {
    labels: daily.labels,
    datasets: [
      {
        label: 'Mensajes',
        data: daily.msgs,
        borderColor: C.accent,
        backgroundColor: 'rgba(251,103,11,0.12)',
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        borderWidth: 2,
      },
      {
        label: 'Sesiones',
        data: daily.sess,
        borderColor: C.blue,
        backgroundColor: 'rgba(74,158,255,0.08)',
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        borderWidth: 2,
      },
    ],
  };

  const barData = {
    labels: topProducts.map(([k]) => k.length > 16 ? k.slice(0,15)+'…' : k),
    datasets: [{
      data: topProducts.map(([, v]) => v),
      backgroundColor: topProducts.map((_, i) =>
        [C.accent, C.blue, C.purple, C.green, C.yellow, C.red, '#60A5FA', '#34D399'][i % 8]
      ),
      borderRadius: 6,
    }],
  };

  const statusLabels = Object.keys(byStatus);
  const doughnutData = {
    labels: statusLabels.map(s => s.charAt(0).toUpperCase() + s.slice(1)),
    datasets: [{
      data: statusLabels.map(s => byStatus[s]),
      backgroundColor: statusLabels.map(s => STATUS_COLOR[s] || C.muted),
      borderColor: C.card,
      borderWidth: 3,
    }],
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100dvh', background: C.bg, color: C.text, fontFamily: 'system-ui,-apple-system,sans-serif' }}>
      {/* Header */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 10,
        background: 'rgba(15,15,15,0.92)',
        backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${C.border}`,
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
      }}>
        {/* Logo pill */}
        <div style={{
          background: C.accent,
          borderRadius: 8,
          padding: '3px 10px',
          fontWeight: 900,
          fontSize: 13,
          letterSpacing: -0.5,
          color: '#fff',
          flexShrink: 0,
        }}>GO</div>
        <span style={{ fontWeight: 600, fontSize: 15, color: C.text, flexShrink: 0 }}>Stats</span>
        <span style={{ fontSize: 11, color: C.muted, flexShrink: 0 }}>{roleName}</span>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Range selector */}
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {[['Hoy','today'],['7d','7d'],['30d','30d'],['90d','90d']].map(([l,v]) => (
            <RangeBtn key={v} label={l} active={range === v} onClick={() => setRange(v)} />
          ))}
        </div>

        {/* Actions */}
        <button onClick={fetchAll} title="Actualizar" style={{
          background: 'transparent', border: `1px solid ${C.border}`, borderRadius: 6,
          color: C.muted, cursor: 'pointer', padding: '4px 8px', fontSize: 14, flexShrink: 0,
        }}>↻</button>
        <button onClick={logout} title="Salir" style={{
          background: 'transparent', border: `1px solid ${C.border}`, borderRadius: 6,
          color: C.muted, cursor: 'pointer', padding: '4px 8px', fontSize: 13, flexShrink: 0,
        }}>→|</button>
      </div>

      {/* Body */}
      <div style={{ padding: '16px', maxWidth: 1200, margin: '0 auto' }}>
        {loading && (
          <div style={{ textAlign: 'center', padding: '40px 0', color: C.muted, fontSize: 13 }}>
            Cargando estadísticas…
          </div>
        )}

        {!loading && (
          <>
            {/* KPI Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
              gap: 10,
              marginBottom: 16,
            }}>
              <KPICard icon="💬" label="Mensajes" value={a.totalMessages ?? 0} />
              <KPICard icon="👥" label="Sesiones"  value={a.totalSessions  ?? 0} />
              <KPICard icon="📲" label="WhatsApp"  value={a.totalWhatsApp  ?? 0} />
              <KPICard icon="📄" label="PDFs"      value={a.totalPDFs      ?? 0} />
              <KPICard icon="📋" label="Candidatos" value={candidates.length}
                sub={`${byStatus.nuevo || 0} nuevos`} />
              <KPICard icon="💼" label="Vacantes" value={vacantesActivas}
                sub="activas" />
            </div>

            {/* Line chart — full width */}
            <div style={{ marginBottom: 16 }}>
              <ChartCard title="Mensajes y Sesiones por día" height={220}>
                <Line data={lineData} options={lineOpts()} />
              </ChartCard>
            </div>

            {/* Bar + Doughnut — side by side on ≥640px */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 12,
              marginBottom: 16,
            }}>
              <ChartCard title="Top consultas" height={Math.max(180, topProducts.length * 28 + 40)}>
                {topProducts.length > 0
                  ? <Bar data={barData} options={barOpts(true)} />
                  : <p style={{ color: C.muted, fontSize: 12, textAlign: 'center', paddingTop: 60 }}>Sin datos</p>
                }
              </ChartCard>

              <ChartCard title="Candidatos por estado" height={240}>
                {statusLabels.length > 0
                  ? <Doughnut data={doughnutData} options={doughnutOpts()} />
                  : <p style={{ color: C.muted, fontSize: 12, textAlign: 'center', paddingTop: 60 }}>Sin candidatos</p>
                }
              </ChartCard>
            </div>

            {/* WhatsApp activity mini line */}
            {daily.wa.some(v => v > 0) && (
              <div style={{ marginBottom: 16 }}>
                <ChartCard title="Actividad WhatsApp" height={140}>
                  <Line
                    data={{
                      labels: daily.labels,
                      datasets: [{
                        label: 'Acciones WA',
                        data: daily.wa,
                        borderColor: C.green,
                        backgroundColor: 'rgba(74,222,128,0.1)',
                        fill: true,
                        tension: 0.4,
                        pointRadius: 2,
                        borderWidth: 2,
                      }],
                    }}
                    options={lineOpts()}
                  />
                </ChartCard>
              </div>
            )}

            {/* Footer */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              flexWrap: 'wrap', gap: 8, paddingTop: 8, paddingBottom: 16,
            }}>
              {lastUpdate && (
                <p style={{ fontSize: 11, color: C.muted }}>
                  Actualizado: {lastUpdate.toLocaleTimeString('es-MX')}
                </p>
              )}
              {installPrompt && (
                <button onClick={installApp} style={{
                  background: C.card,
                  border: `1px solid ${C.accent}`,
                  borderRadius: 8,
                  color: C.accent,
                  padding: '7px 14px',
                  fontSize: 12,
                  cursor: 'pointer',
                  fontWeight: 600,
                }}>
                  + Instalar app
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── Root export ───────────────────────────────────────────────────────────────
export default function StatsApp({ isAuth, roleName = '' }) {
  if (!isAuth) return <LoginScreen />;
  return <Dashboard roleName={roleName} />;
}
