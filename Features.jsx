import { Brain, ShieldCheck, Zap, BarChart3, CreditCard, Sparkles, ArrowRight } from 'lucide-react';
import { useReveal } from '../hooks/useReveal';

const FEATURES = [
  {
    icon: Brain,
    title: 'AI Explainability',
    desc: 'Full factor breakdown showing exactly how each input affects your credit score with transparent SHAP reasoning.',
    accent: 'linear-gradient(90deg,#00D4FF,#8B5CF6)',
    color: '#00D4FF',
    rgb: '0,212,255',
    cta: 'Full transparency',
  },
  {
    icon: ShieldCheck,
    title: 'ML Scoring Engine',
    desc: 'Weighted ensemble model with behavioral, financial, and alternative data signals for maximum accuracy.',
    accent: 'linear-gradient(90deg,#8B5CF6,#2DD4BF)',
    color: '#8B5CF6',
    rgb: '139,92,246',
    cta: '47 unique signals',
  },
  {
    icon: Zap,
    title: 'Real-Time Scoring',
    desc: 'Sub-100ms inference pipeline delivers scores instantly. Live preview updates as you type each field.',
    accent: 'linear-gradient(90deg,#f59e0b,#2DD4BF)',
    color: '#f59e0b',
    rgb: '245,158,11',
    cta: 'Live preview',
  },
  {
    icon: BarChart3,
    title: 'Score History',
    desc: 'Track your credit journey over time. Compare trends, see deltas, and export full history to CSV.',
    accent: 'linear-gradient(90deg,#8B5CF6,#2DD4BF)',
    color: '#8B5CF6',
    rgb: '139,92,246',
    cta: 'Full history',
  },
  {
    icon: CreditCard,
    title: 'Loan Eligibility',
    desc: 'Instant loan amount estimates with interest rate ranges based on your score tier and risk profile.',
    accent: 'linear-gradient(90deg,#2DD4BF,#00D4FF)',
    color: '#2DD4BF',
    rgb: '45,212,191',
    cta: 'Up to $500K',
  },
  {
    icon: Sparkles,
    title: 'Smart Suggestions',
    desc: 'Personalized action plans with estimated point gains for each recommendation to maximize your score.',
    accent: 'linear-gradient(90deg,#00D4FF,#2DD4BF)',
    color: '#00D4FF',
    rgb: '0,212,255',
    cta: '+150 pts potential',
  },
];

export default function Features() {
  const revealRef = useReveal();

  return (
    <section id="features" style={{ padding: '80px 24px', position: 'relative', zIndex: 10 }} ref={revealRef}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        <div style={{ textAlign: 'center', marginBottom: 60 }} className="reveal">
          <div style={{ display: 'inline-block', padding: '4px 14px', borderRadius: 99, border: '1px solid rgba(0,212,255,0.25)', background: 'rgba(0,212,255,0.06)', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.12em', color: '#00D4FF', marginBottom: 14, fontFamily: 'Syne, sans-serif' }}>
            PLATFORM CAPABILITIES
          </div>
          <h2 style={{ fontSize: 'clamp(1.8rem,4vw,3rem)', fontWeight: 800, letterSpacing: '-0.02em' }}>Intelligence at the Core</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 16 }}>
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className="feat-card reveal"
              style={{ '--card-accent': f.accent }}
            >
              <div style={{
                width: 48, height: 48, borderRadius: 14,
                background: `rgba(${f.rgb},0.08)`,
                border:     `1px solid rgba(${f.rgb},0.15)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 18,
              }}>
                <f.icon size={22} color={f.color} />
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 10, fontFamily: 'Syne, sans-serif' }}>{f.title}</h3>
              <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.65 }}>{f.desc}</p>
              <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 6, color: f.color, fontSize: '0.78rem', fontWeight: 600, fontFamily: 'Syne, sans-serif' }}>
                <ArrowRight size={14} /> {f.cta}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
