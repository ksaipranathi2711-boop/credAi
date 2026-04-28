import { useRef } from 'react';
import { ArrowRight, BarChart2, CreditCard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Hero({ onOpenAuth }) {
  const { user } = useAuth();

  const scrollToAssessment = () => {
    document.getElementById('assessment')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hero"
      style={{
        position: 'relative', minHeight: '100vh',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '120px 24px 80px', zIndex: 10, overflow: 'hidden',
      }}
    >
      {/* Hero text */}
      <div style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto 60px' }}>
        <div className="anim-fade-down" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '6px 16px', borderRadius: 99,
          border: '1px solid rgba(0,212,255,0.25)', marginBottom: 24,
        }}>
          <span className="pulse-dot" style={{ width: 6, height: 6, borderRadius: '50%', background: '#00D4FF' }} />
          <span style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.15em', color: '#00D4FF', fontFamily: 'Syne, sans-serif' }}>
            NEXT-GEN FINTECH · AI-POWERED
          </span>
        </div>

        <h1 className="anim-fade-up-1" style={{
          fontSize: 'clamp(2.8rem,6vw,5rem)', fontWeight: 800,
          lineHeight: 1.05, marginBottom: 20, letterSpacing: '-0.03em',
        }}>
          Credit Risk<br />
          <span className="gradient-animate">Reimagined</span>
        </h1>

        <p className="anim-fade-up-2" style={{
          fontSize: '1.1rem', color: 'rgba(255,255,255,0.45)',
          maxWidth: 520, margin: '0 auto', lineHeight: 1.7, fontWeight: 300,
        }}>
          AI-powered credit assessment using alternative behavioral data. Real-time scoring with full explainability.
        </p>

        <div className="anim-fade-up-3" style={{
          display: 'flex', gap: 14, justifyContent: 'center',
          marginTop: 36, flexWrap: 'wrap',
        }}>
          <button
            className="btn-primary"
            style={{ boxShadow: '0 0 30px rgba(0,212,255,0.15)' }}
            onClick={scrollToAssessment}
          >
            <span>Check Your Score</span>
            <ArrowRight size={16} />
          </button>
          {!user && (
            <button className="btn-ghost" onClick={() => onOpenAuth('signup')}>
              Create Free Account
            </button>
          )}
        </div>
      </div>

      {/* Hero floating cards */}
      <div style={{
        position: 'relative', width: '100%', maxWidth: 1000,
        height: 460, display: 'flex', alignItems: 'center', justifyContent: 'center',
      }} className="hero-floats">

        {/* Central score card */}
        <div className="glass-frost fa" style={{
          borderRadius: 28, padding: '36px 40px', zIndex: 30,
          width: 300, display: 'flex', flexDirection: 'column', alignItems: 'center',
          boxShadow: '0 40px 100px rgba(0,0,0,0.6), 0 0 60px rgba(0,212,255,0.08)',
        }}>
          <p style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.35)', marginBottom: 20, fontFamily: 'Syne, sans-serif' }}>
            AI CREDIT SCORE
          </p>
          <div className="score-ring-wrap" style={{ width: 160, height: 160, marginBottom: 16 }}>
            <svg className="score-ring-svg" width="160" height="160" viewBox="0 0 160 160">
              <circle className="score-ring-track" cx="80" cy="80" r="65" />
              <circle
                className="score-ring-fill"
                cx="80" cy="80" r="65"
                stroke="#00D4FF"
                strokeDasharray="408"
                strokeDashoffset="100"
              />
            </svg>
            <div className="score-ring-number">
              <span style={{ fontFamily: 'Syne, sans-serif', fontSize: '2.6rem', fontWeight: 800, lineHeight: 1 }}>785</span>
              <span style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.1em', color: '#00D4FF', marginTop: 2 }}>EXCELLENT</span>
            </div>
          </div>
          <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)' }}>Last check</span>
        </div>

        {/* Left factor card */}
        <div className="glass fb" style={{
          position: 'absolute', left: '5%', top: '15%',
          borderRadius: 20, padding: '18px 20px', width: 200, opacity: 0.85, filter: 'blur(0.5px)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, paddingBottom: 10, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <BarChart2 size={14} color="#00D4FF" />
            <span style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.5)', fontFamily: 'Syne, sans-serif' }}>SCORE FACTORS</span>
          </div>
          {[
            { label: 'Income',      val: '+130', pct: '78%', color: '#2DD4BF' },
            { label: 'Payments',    val: '+120', pct: '72%', color: '#2DD4BF' },
            { label: 'Utilization', val: '+42',  pct: '45%', color: '#f59e0b' },
          ].map(f => (
            <div key={f.label} style={{ marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', marginBottom: 3 }}>
                <span style={{ color: 'rgba(255,255,255,0.5)' }}>{f.label}</span>
                <span style={{ color: f.color }}>{f.val}</span>
              </div>
              <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 99 }}>
                <div style={{ width: f.pct, height: '100%', background: f.color, borderRadius: 99 }} />
              </div>
            </div>
          ))}
        </div>

        {/* Right loan card */}
        <div className="glass fc" style={{
          position: 'absolute', right: '5%', bottom: '20%',
          borderRadius: 20, padding: '18px 20px', width: 210, opacity: 0.9, filter: 'blur(0.3px)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <CreditCard size={16} color="#00D4FF" />
            <span className="loan-badge tier-prime">ELIGIBLE</span>
          </div>
          <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.08em', fontFamily: 'Syne, sans-serif', marginBottom: 4 }}>MAX LOAN</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'Syne, sans-serif', marginBottom: 8 }}>$225,000</div>
          <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>Rate: <span style={{ color: '#2DD4BF', fontWeight: 600 }}>4.5% – 7.5%</span></div>
        </div>

        {/* API ping badge */}
        <div className="glass" style={{
          position: 'absolute', right: '3%', top: '10%',
          borderRadius: 14, padding: '10px 14px', opacity: 0.75,
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <span className="pulse-dot" style={{ width: 7, height: 7, borderRadius: '50%', background: '#2DD4BF', boxShadow: '0 0 8px #2DD4BF' }} />
          <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', fontFamily: 'Syne, sans-serif' }}>API LIVE · 12ms</span>
        </div>
      </div>
    </section>
  );
}
