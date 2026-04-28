import { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, Tooltip, Legend, Filler,
} from 'chart.js';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import { useAuth } from '../context/AuthContext';
import { useReveal } from '../hooks/useReveal';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend, Filler);

const CHART_DEFAULTS = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: 'rgba(4,6,15,0.95)',
      titleColor: '#00D4FF',
      bodyColor:  '#fff',
      borderColor: 'rgba(255,255,255,0.1)',
      borderWidth: 1,
    },
  },
  scales: {
    x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: 'rgba(255,255,255,0.35)', font: { size: 11 } } },
    y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: 'rgba(255,255,255,0.35)', font: { size: 11 } } },
  },
};

export default function Dashboard() {
  const { history } = useAuth();
  const revealRef   = useReveal();

  // Build trend data from history (newest last)
  const trendData = [...history].reverse().slice(-10);
  const hasData   = trendData.length > 0;

  const labels = hasData
    ? trendData.map(h => new Date(h.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }))
    : ['Jan','Feb','Mar','Apr','May','Jun'];

  const scores = hasData
    ? trendData.map(h => h.score)
    : [620, 650, 640, 680, 710, 740];

  const avgScore   = hasData ? Math.round(scores.reduce((a,b) => a+b,0) / scores.length) : null;
  const bestScore  = hasData ? Math.max(...scores) : null;
  const totalChecks = history.length;
  const approvalRate = bestScore ? Math.round(((bestScore - 300) / 550) * 85 + 10) : 84;

  const lineData = {
    labels,
    datasets: [{
      data:        scores,
      borderColor: '#00D4FF',
      backgroundColor: 'rgba(0,212,255,0.06)',
      borderWidth: 2,
      pointBackgroundColor: '#00D4FF',
      pointRadius:       4,
      pointHoverRadius:  6,
      fill: true,
      tension: 0.4,
    }],
  };

  return (
    <section id="dashboard-section" style={{ padding: '80px 24px', position: 'relative', zIndex: 10, background: 'rgba(0,0,0,0.15)' }} ref={revealRef}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 60 }} className="reveal">
          <div style={{ display: 'inline-block', padding: '4px 14px', borderRadius: 99, border: '1px solid rgba(139,92,246,0.3)', background: 'rgba(139,92,246,0.07)', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.12em', color: '#8B5CF6', marginBottom: 14, fontFamily: 'Syne, sans-serif' }}>
            ANALYTICS DASHBOARD
          </div>
          <h2 style={{ fontSize: 'clamp(1.8rem,4vw,3rem)', fontWeight: 800, letterSpacing: '-0.02em' }}>Portfolio Intelligence</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20, alignItems: 'start' }}>

          {/* Trend chart */}
          <div className="glass-strong reveal" style={{ borderRadius: 24, padding: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <div>
                <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1rem', fontWeight: 700, marginBottom: 2 }}>Score Trend</h3>
                <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)' }}>Historical performance over time</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 99, background: 'rgba(45,212,191,0.08)', border: '1px solid rgba(45,212,191,0.2)' }}>
                <span className="pulse-dot" style={{ width: 6, height: 6, borderRadius: '50%', background: '#2DD4BF' }} />
                <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#2DD4BF', fontFamily: 'Syne, sans-serif' }}>LIVE</span>
              </div>
            </div>
            <div style={{ height: 220 }}>
              <Line data={lineData} options={{ ...CHART_DEFAULTS, plugins: { ...CHART_DEFAULTS.plugins, legend: { display: false } } }} />
            </div>
          </div>

          {/* Right stats column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            <div className="glass-strong reveal" style={{ borderRadius: 24, padding: 24 }}>
              <p style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.35)', marginBottom: 8, fontFamily: 'Syne, sans-serif' }}>APPROVAL RATE</p>
              <div className="stat-value" style={{ color: '#2DD4BF', marginBottom: 10 }}>{approvalRate}%</div>
              <div style={{ height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 99, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${approvalRate}%`, background: 'linear-gradient(90deg,#2DD4BF,#06b6d4)', borderRadius: 99, transition: 'width 0.8s' }} />
              </div>
            </div>

            <div className="glass-strong reveal" style={{ borderRadius: 24, padding: 24 }}>
              <p style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.35)', marginBottom: 8, fontFamily: 'Syne, sans-serif' }}>AVG DEFAULT RISK</p>
              <div className="stat-value" style={{ color: '#f59e0b' }}>2.4%</div>
              <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>Portfolio-wide risk exposure</p>
            </div>

            <div className="glass-strong reveal" style={{ borderRadius: 24, padding: 24 }}>
              <p style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.35)', marginBottom: 8, fontFamily: 'Syne, sans-serif' }}>TOTAL ASSESSMENTS</p>
              <div className="stat-value">{totalChecks > 0 ? totalChecks : '—'}</div>
              <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>Checks performed</p>
            </div>
          </div>
        </div>

        {/* Best score */}
        {bestScore && (
          <div style={{ marginTop: 20, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 16 }}>
            {[
              { label: 'BEST SCORE',    value: bestScore,  color: '#2DD4BF' },
              { label: 'AVERAGE SCORE', value: avgScore,   color: '#00D4FF' },
              { label: 'TOTAL CHECKS',  value: totalChecks, color: '#8B5CF6' },
            ].map(s => (
              <div key={s.label} className="glass-strong reveal" style={{ borderRadius: 24, padding: 24 }}>
                <p style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.35)', marginBottom: 8, fontFamily: 'Syne, sans-serif' }}>{s.label}</p>
                <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
