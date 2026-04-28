import { useRef, useEffect } from 'react';
import { FileText, Cpu, BarChart2, Sparkles, TrendingUp } from 'lucide-react';
import { useReveal } from '../hooks/useReveal';
import { useCountUp } from '../hooks/useCountUp';

const STEPS = [
  {
    num: '01',
    icon: FileText,
    color: '#00D4FF',
    bg: 'rgba(0,212,255,0.08)',
    border: 'rgba(0,212,255,0.2)',
    title: 'Enter Your Data',
    desc: 'Input your income, expenses, payment history, and behavioral signals. No credit bureau access needed.',
    tags: ['Income', 'Expenses', 'Behavior'],
    tagColor: '#00D4FF',
    extra: null,
  },
  {
    num: '02',
    icon: Cpu,
    color: '#8B5CF6',
    bg: 'rgba(139,92,246,0.08)',
    border: 'rgba(139,92,246,0.2)',
    title: 'AI Processing',
    desc: 'Our ensemble ML model weighs 5 key financial factors using behavioral scoring algorithms and pattern recognition.',
    tags: [],
    tagColor: '#8B5CF6',
    extra: 'processing',
  },
  {
    num: '03',
    icon: BarChart2,
    color: '#2DD4BF',
    bg: 'rgba(45,212,191,0.08)',
    border: 'rgba(45,212,191,0.2)',
    title: 'Get Your Score',
    desc: 'Receive a 300–850 credit score with detailed factor breakdown, default probability, and percentile ranking.',
    tags: [],
    tagColor: '#2DD4BF',
    extra: 'score-bar',
  },
  {
    num: '04',
    icon: Sparkles,
    color: '#00D4FF',
    bg: 'rgba(0,212,255,0.08)',
    border: 'rgba(0,212,255,0.2)',
    title: 'Actionable Insights',
    desc: 'Get personalized recommendations, loan eligibility estimates, and a step-by-step plan to improve your score.',
    tags: [],
    tagColor: '#00D4FF',
    extra: 'improvement',
  },
];

const STATS = [
  { target: 12,  suffix: 'ms',  label: 'RESPONSE TIME' },
  { target: 47,  suffix: '+',   label: 'SIGNALS ANALYZED' },
  { target: 97,  suffix: '%',   label: 'ACCURACY RATE' },
  { target: 128, suffix: 'K+',  label: 'ASSESSMENTS DONE' },
];

// ── Card tilt effect ──────────────────────────────────────────────────────
function TiltCard({ children, className, style }) {
  const ref = useRef(null);

  useEffect(() => {
    const card = ref.current;
    if (!card) return;

    const onMove = (e) => {
      const rect = card.getBoundingClientRect();
      const x    = e.clientX - rect.left;
      const y    = e.clientY - rect.top;
      const cx   = rect.width / 2;
      const cy   = rect.height / 2;
      const rx   = ((y - cy) / cy) * 4;
      const ry   = -((x - cx) / cx) * 4;
      card.style.transform = `translateY(-8px) scale(1.01) perspective(600px) rotateX(${rx}deg) rotateY(${ry}deg)`;
      card.style.setProperty('--mx', (x / rect.width * 100) + '%');
      card.style.setProperty('--my', (y / rect.height * 100) + '%');
    };
    const onLeave = () => { card.style.transform = ''; };

    card.addEventListener('mousemove', onMove);
    card.addEventListener('mouseleave', onLeave);
    return () => {
      card.removeEventListener('mousemove', onMove);
      card.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
}

// ── Stat box ──────────────────────────────────────────────────────────────
function StatBox({ target, suffix, label }) {
  const [ref, val] = useCountUp(target);
  return (
    <div ref={ref} style={{
      textAlign: 'center', padding: '24px 20px',
      borderRadius: 18, background: 'rgba(255,255,255,0.025)',
      border: '1px solid rgba(255,255,255,0.06)',
    }}>
      <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '2.2rem', fontWeight: 800, color: '#00D4FF', lineHeight: 1 }}>
        {val}<span style={{ fontSize: '1rem', opacity: 0.7 }}>{suffix}</span>
      </div>
      <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.72rem', marginTop: 8, fontFamily: 'Syne, sans-serif', letterSpacing: '0.05em' }}>{label}</p>
    </div>
  );
}

export default function HowItWorks() {
  const revealRef = useReveal();

  return (
    <section id="how-it-works" style={{ padding: '80px 24px', position: 'relative', zIndex: 10 }} ref={revealRef}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 60 }} className="reveal">
          <div style={{ display: 'inline-block', padding: '4px 16px', borderRadius: 99, border: '1px solid rgba(45,212,191,0.3)', background: 'rgba(45,212,191,0.07)', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.12em', color: '#2DD4BF', marginBottom: 14, fontFamily: 'Syne, sans-serif' }}>
            SIMPLE PROCESS
          </div>
          <h2 style={{ fontSize: 'clamp(1.8rem,4vw,3rem)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 12 }}>How It Works</h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', maxWidth: 480, margin: '0 auto', lineHeight: 1.65, fontSize: '0.95rem' }}>
            From input to insight in seconds. Our AI engine transforms your financial data into actionable intelligence.
          </p>
        </div>

        {/* Steps */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(230px,1fr))', gap: 20, position: 'relative' }}>
          {STEPS.map((step, i) => (
            <TiltCard
              key={step.num}
              className="how-step reveal"
              style={{ position: 'relative' }}
            >
              {/* Connector line */}
              {i < STEPS.length - 1 && <div className="hiw-line" />}

              {/* Step number */}
              <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '0.65rem', fontWeight: 800, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.1em', marginBottom: 16 }}>
                STEP {step.num}
              </div>

              {/* Icon */}
              <div style={{ width: 52, height: 52, borderRadius: 16, background: step.bg, border: `1px solid ${step.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
                <step.icon size={26} color={step.color} />
              </div>

              <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.05rem', fontWeight: 700, marginBottom: 10 }}>{step.title}</h3>
              <p style={{ fontSize: '0.83rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.65, marginBottom: 16 }}>{step.desc}</p>

              {/* Tags */}
              {step.tags.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {step.tags.map(t => (
                    <span key={t} style={{ padding: '3px 10px', borderRadius: 99, fontSize: '0.65rem', fontWeight: 600, background: `${step.tagColor}14`, color: `${step.tagColor}cc`, border: `1px solid ${step.tagColor}26`, fontFamily: 'Syne, sans-serif' }}>{t}</span>
                  ))}
                </div>
              )}

              {/* Extra: processing indicator */}
              {step.extra === 'processing' && (
                <div style={{ padding: '12px 14px', borderRadius: 12, background: 'rgba(139,92,246,0.05)', border: '1px solid rgba(139,92,246,0.1)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className="pulse-dot" style={{ width: 6, height: 6, borderRadius: '50%', background: '#8B5CF6' }} />
                    <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', fontFamily: 'Syne, sans-serif' }}>Processing 47 signals…</span>
                  </div>
                </div>
              )}

              {/* Extra: score bar */}
              {step.extra === 'score-bar' && (
                <div>
                  <div style={{ height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 99, overflow: 'hidden', position: 'relative' }}>
                    <div style={{ width: '85%', height: '100%', background: 'linear-gradient(90deg,#ff2050,#f59e0b,#2DD4BF,#00D4FF)', borderRadius: 99 }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                    <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.25)' }}>300</span>
                    <span style={{ fontSize: '0.65rem', color: '#2DD4BF', fontWeight: 700 }}>785</span>
                    <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.25)' }}>850</span>
                  </div>
                </div>
              )}

              {/* Extra: improvement */}
              {step.extra === 'improvement' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(45,212,191,0.1)', border: '1px solid rgba(45,212,191,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <TrendingUp size={14} color="#2DD4BF" />
                  </div>
                  <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)' }}>
                    Up to <span style={{ color: '#2DD4BF', fontWeight: 700 }}>+150 pts</span> improvement path
                  </span>
                </div>
              )}
            </TiltCard>
          ))}
        </div>

        {/* Animated stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 16, marginTop: 52 }}>
          {STATS.map(s => <StatBox key={s.label} {...s} />)}
        </div>
      </div>
    </section>
  );
}
