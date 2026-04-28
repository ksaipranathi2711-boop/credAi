import { useEffect, useRef } from 'react';
import { Lightbulb, XCircle } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import AnalyticsCharts from './AnalyticsCharts';

// ── Animated ring helper ──────────────────────────────────────────────────
function ScoreRing({ score, size = 130, cx, cy, r, dashTotal }) {
  const fillRef = useRef(null);

  useEffect(() => {
    if (!fillRef.current || !score) return;
    const pct    = (score - 300) / 550;
    const offset = dashTotal * (1 - pct);
    const color  = score >= 750 ? '#00D4FF' : score >= 650 ? '#a78bfa' : score >= 580 ? '#f59e0b' : '#ff2050';

    fillRef.current.setAttribute('stroke', color);
    fillRef.current.setAttribute('stroke-dasharray', dashTotal);
    requestAnimationFrame(() => {
      fillRef.current?.setAttribute('stroke-dashoffset', offset);
    });
  }, [score, dashTotal]);

  return (
    <div className="score-ring-wrap" style={{ width: size, height: size }}>
      <svg className="score-ring-svg" width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle className="score-ring-track" cx={cx} cy={cy} r={r} />
        <circle ref={fillRef} className="score-ring-fill" cx={cx} cy={cy} r={r} stroke="#00D4FF" strokeDasharray={dashTotal} strokeDashoffset={dashTotal} />
      </svg>
      <div className="score-ring-number">
        <AnimatedNumber value={score} style={{ fontFamily: 'Syne, sans-serif', fontSize: '2.2rem', fontWeight: 800, lineHeight: 1 }} />
        <span style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.1em', color: '#00D4FF', marginTop: 2 }}>
          {score >= 750 ? 'EXCELLENT' : score >= 700 ? 'LOW RISK' : score >= 650 ? 'MODERATE' : score >= 580 ? 'MEDIUM RISK' : 'HIGH RISK'}
        </span>
      </div>
    </div>
  );
}

function AnimatedNumber({ value, style }) {
  const elRef  = useRef(null);
  const prevRef = useRef(0);

  useEffect(() => {
    if (!elRef.current || !value) return;
    const from  = prevRef.current;
    const to    = value;
    const dur   = 900;
    const start = performance.now();

    const step = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const e = 1 - Math.pow(1 - p, 3);
      elRef.current.textContent = Math.round(from + (to - from) * e);
      if (p < 1) requestAnimationFrame(step);
      else prevRef.current = to;
    };
    requestAnimationFrame(step);
  }, [value]);

  return <span ref={elRef} style={style}>—</span>;
}

// ── Factor card ───────────────────────────────────────────────────────────
function FactorCard({ factor }) {
  const barRef = useRef(null);
  const IconComponent = LucideIcons[
    factor.icon
      .split('-')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join('')
  ] || LucideIcons.Activity;

  useEffect(() => {
    if (!barRef.current) return;
    const pct = Math.round((factor.contribution / factor.maxPossible) * 100);
    setTimeout(() => {
      if (barRef.current) barRef.current.style.width = pct + '%';
    }, 100);
  }, [factor]);

  return (
    <div className={`factor-card bg-${factor.color}-faint`}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <IconComponent size={15} className={`col-${factor.color}`} />
          <span style={{ fontSize: '0.78rem', fontWeight: 600, fontFamily: 'Syne, sans-serif' }}>{factor.name}</span>
        </div>
        <span className={`col-${factor.color}`} style={{ fontSize: '1rem', fontWeight: 800, fontFamily: 'Syne, sans-serif' }}>
          +{factor.contribution}
        </span>
      </div>
      <div className="factor-bar-bg" style={{ marginBottom: 8 }}>
        <div ref={barRef} className={`factor-bar bar-${factor.color}`} style={{ width: '0%' }} />
      </div>
      <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.4 }}>{factor.tip}</p>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
        <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.25)' }}>Contribution</span>
        <span className={`col-${factor.color}`} style={{ fontSize: '0.65rem', fontWeight: 700 }}>{factor.contribution} / {factor.maxPossible} pts</span>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────
export default function ScoreResult({ result, income = 0, expenses = 0 }) {
  if (!result) return null;

  const { score, band, detail, color, defaultProbability, percentile, delta, factors, suggestions, loan } = result;

  const defaultColor = parseFloat(defaultProbability) <= 5 ? '#2DD4BF' : parseFloat(defaultProbability) <= 12 ? '#f59e0b' : '#ff2050';

  return (
    <div style={{ marginTop: 28 }}>

      {/* Score summary card */}
      <div className="glass-strong" style={{ borderRadius: 24, padding: 32, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 32, flexWrap: 'wrap' }}>
        <div style={{ textAlign: 'center', flexShrink: 0 }}>
          <ScoreRing score={score} size={130} cx={65} cy={65} r={52} dashTotal={327} />
        </div>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8, flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.5rem', fontWeight: 800, color }}>{band}</span>
            {delta !== null && (
              <span className={delta > 0 ? 'delta-up' : delta < 0 ? 'delta-down' : 'delta-same'}>
                {delta > 0 ? `↑ +${delta} pts` : delta < 0 ? `↓ ${delta} pts` : '→ No change'}
              </span>
            )}
            {delta === null && <span className="delta-same">First check</span>}
          </div>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', marginBottom: 16, lineHeight: 1.6 }}>{detail}</p>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            <div>
              <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', display: 'block', letterSpacing: '0.08em', fontFamily: 'Syne, sans-serif' }}>DEFAULT RISK</span>
              <span style={{ fontWeight: 700, fontSize: '1rem', color: defaultColor }}>{defaultProbability}%</span>
            </div>
            <div>
              <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', display: 'block', letterSpacing: '0.08em', fontFamily: 'Syne, sans-serif' }}>PERCENTILE</span>
              <span style={{ fontWeight: 700, fontSize: '1rem' }}>{percentile}</span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Explainability Panel */}
      <div className="glass-strong" style={{ borderRadius: 24, padding: 28, marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Lightbulb size={16} color="#00D4FF" />
          </div>
          <div>
            <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1rem', fontWeight: 700, lineHeight: 1 }}>Why This Score?</h3>
            <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>AI factor breakdown with improvement tips</p>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 12 }}>
          {factors.map(f => <FactorCard key={f.name} factor={f} />)}
        </div>
      </div>

      {/* Loan + Suggestions grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

        {/* Loan Eligibility */}
        <div className="glass-strong" style={{ borderRadius: 24, padding: 28 }}>
          <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1rem', fontWeight: 700, marginBottom: 16 }}>Loan Eligibility</h3>
          {loan.eligible ? (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <span className={`loan-badge tier-${loan.tier}`} style={{ fontSize: '0.75rem', padding: '5px 14px' }}>{loan.tier.toUpperCase()}</span>
                <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)' }}>Eligible</span>
              </div>
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em', fontFamily: 'Syne, sans-serif', marginBottom: 4 }}>ESTIMATED MAX LOAN</div>
                <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '2rem', fontWeight: 800 }}>${loan.maxAmount.toLocaleString()}</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: '12px 14px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)', marginBottom: 4 }}>INTEREST RATE RANGE</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, fontFamily: 'Syne, sans-serif', color: '#2DD4BF' }}>{loan.rateMin}% – {loan.rateMax}%</div>
                <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>APR · Subject to lender approval</div>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: 20 }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(255,32,80,0.1)', border: '1px solid rgba(255,32,80,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                <XCircle size={22} color="#ff2050" />
              </div>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', marginBottom: 8 }}>Not eligible at this time</p>
              <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)' }}>Improve your score above 500 to qualify.</p>
            </div>
          )}
        </div>

        {/* Smart Suggestions */}
        <div className="glass-strong" style={{ borderRadius: 24, padding: 28 }}>
          <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1rem', fontWeight: 700, marginBottom: 16 }}>Smart Suggestions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {suggestions.length > 0
              ? suggestions.map((s, i) => (
                  <div key={i} className="suggestion-item">{s}</div>
                ))
              : <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem' }}>Your profile looks great! Keep it up.</p>
            }
          </div>
        </div>
      </div>

      {/* Analytics Charts */}
      {(income > 0 || expenses > 0) && (
        <AnalyticsCharts income={income} expenses={expenses} />
      )}
    </div>
  );
}
