import { Link } from 'react-router-dom';
import { ArrowLeft, Download, Trash2, Inbox } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler } from 'chart.js';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { clearLocalHistory, exportHistoryToCSV } from '../utils/storage';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler);

function ScoreBadge({ score }) {
  const color = score >= 750 ? '#00D4FF' : score >= 700 ? '#06b6d4' : score >= 650 ? '#a78bfa' : score >= 580 ? '#f59e0b' : '#ff2050';
  return (
    <span style={{
      padding: '3px 10px', borderRadius: 99,
      background: `${color}18`, border: `1px solid ${color}40`,
      color, fontSize: '0.72rem', fontWeight: 700, fontFamily: 'Syne, sans-serif',
    }}>
      {score}
    </span>
  );
}

export default function HistoryPage() {
  const { user, history, refreshHistory } = useAuth();
  const toast = useToast();

  if (!user) {
    return (
      <div style={{ paddingTop: 120, textAlign: 'center', padding: '120px 24px 40px' }}>
        <h2 style={{ fontFamily: 'Syne, sans-serif', marginBottom: 12 }}>Sign in to view history</h2>
        <p style={{ color: 'rgba(255,255,255,0.4)' }}>Your assessment history is only available when logged in.</p>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 20, color: '#00D4FF', textDecoration: 'none' }}>
          <ArrowLeft size={14} /> Back to Home
        </Link>
      </div>
    );
  }

  const handleClear = () => {
    if (!window.confirm('Clear all history? This cannot be undone.')) return;
    clearLocalHistory(user.email);
    refreshHistory(user.email);
    toast('History cleared.', 'info');
  };

  const handleExport = () => {
    if (!history.length) { toast('No history to export.', 'warning'); return; }
    exportHistoryToCSV(history);
    toast('CSV exported!', 'success');
  };

  const scores   = [...history].reverse().map(h => h.score);
  const labels   = [...history].reverse().map(h => new Date(h.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
  const bestScore = history.length ? Math.max(...history.map(h => h.score)) : null;
  const avgScore  = history.length ? Math.round(history.reduce((a,h) => a + h.score, 0) / history.length) : null;

  const lineData = {
    labels,
    datasets: [{
      data: scores, borderColor: '#00D4FF',
      backgroundColor: 'rgba(0,212,255,0.06)',
      borderWidth: 2, fill: true, tension: 0.4,
      pointBackgroundColor: '#00D4FF', pointRadius: 4,
    }],
  };

  return (
    <div style={{ paddingTop: 100, padding: '100px 24px 60px', maxWidth: 900, margin: '0 auto' }}>

      {/* Back link */}
      <Link
        to="/"
        style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,0.4)', textDecoration: 'none', fontSize: '0.85rem', marginBottom: 32, transition: 'color 0.2s' }}
        onMouseOver={e => e.currentTarget.style.color = '#00D4FF'}
        onMouseOut={e  => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
      >
        <ArrowLeft size={14} /> Back to Home
      </Link>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 40, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '2rem', fontWeight: 800, marginBottom: 4 }}>Score History</h2>
          <p style={{ color: 'rgba(255,255,255,0.35)' }}>Your complete credit assessment record</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn-ghost btn-sm" onClick={handleExport}><Download size={14} /> Export</button>
          <button
            className="btn-ghost btn-sm"
            style={{ color: 'rgba(255,80,80,0.7)', borderColor: 'rgba(255,80,80,0.2)' }}
            onClick={handleClear}
          >
            <Trash2 size={14} /> Clear
          </button>
        </div>
      </div>

      {/* Profile card */}
      <div className="glass-strong" style={{ borderRadius: 24, padding: 28, marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
          <div className="profile-avatar-ring">{user.name.charAt(0).toUpperCase()}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.4rem', fontWeight: 800, marginBottom: 2 }}>{user.name}</div>
            <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)' }}>{user.email}</div>
          </div>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            {[
              { label: 'TOTAL CHECKS', value: history.length, color: '#00D4FF' },
              { label: 'BEST SCORE',   value: bestScore || '—', color: '#2DD4BF' },
              { label: 'AVG SCORE',    value: avgScore  || '—', color: '#fff' },
              { label: 'LATEST',       value: history[0]?.score || '—', color: '#8B5CF6' },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.5rem', fontWeight: 800, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.08em', fontFamily: 'Syne, sans-serif' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trend chart */}
      {history.length > 1 && (
        <div className="glass-strong" style={{ borderRadius: 24, padding: 28, marginBottom: 20 }}>
          <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '0.85rem', fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', marginBottom: 16 }}>SCORE TREND</h3>
          <div style={{ height: 180 }}>
            <Line data={lineData} options={{
              responsive: true, maintainAspectRatio: false,
              plugins: {
                legend: { display: false },
                tooltip: { backgroundColor: 'rgba(4,6,15,0.95)', titleColor: '#00D4FF', bodyColor: '#fff', borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1 },
              },
              scales: {
                x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: 'rgba(255,255,255,0.35)', font: { size: 10 } } },
                y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: 'rgba(255,255,255,0.35)', font: { size: 10 } } },
              },
            }} />
          </div>
        </div>
      )}

      {/* History list */}
      <div className="glass-strong" style={{ borderRadius: 24, overflow: 'hidden' }}>
        {history.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 24px', color: 'rgba(255,255,255,0.3)' }}>
            <Inbox size={40} style={{ margin: '0 auto 12px', display: 'block', opacity: 0.3 }} />
            <p style={{ fontSize: '0.9rem' }}>No assessments yet. Calculate your first score!</p>
            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 16, color: '#00D4FF', textDecoration: 'none', fontSize: '0.85rem' }}>
              <ArrowLeft size={12} /> Go to Assessment
            </Link>
          </div>
        ) : (
          history.map((h, i) => {
            const prev   = history[i + 1];
            const delta  = prev ? h.score - prev.score : null;
            return (
              <div key={i} className="hist-row">
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <ScoreBadge score={h.score} />
                  <div>
                    <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '0.9rem' }}>{h.band}</div>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)' }}>
                      Income ${h.income?.toLocaleString()} · Expenses ${h.expenses?.toLocaleString()}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  {delta !== null && (
                    <span className={delta > 0 ? 'delta-up' : delta < 0 ? 'delta-down' : 'delta-same'}>
                      {delta > 0 ? `↑ +${delta}` : delta < 0 ? `↓ ${delta}` : '→ 0'}
                    </span>
                  )}
                  <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.3)' }}>
                    {new Date(h.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
