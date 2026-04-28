import { useReveal } from '../hooks/useReveal';

const TESTIMONIALS = [
  {
    name: 'Aisha K.',
    role: 'Freelancer, Lagos',
    quote: 'CredAI gave me a credit score for the first time. No bank account history, just my digital footprint. I qualified for a $15K loan within a week.',
    score: 742,
    color: '#00D4FF',
  },
  {
    name: 'Marcus T.',
    role: 'Software Engineer, Berlin',
    quote: 'The SHAP breakdown showed exactly which factors hurt my score. Automated my payments, utilization dropped, score jumped 85 pts in 60 days.',
    score: 798,
    color: '#2DD4BF',
  },
  {
    name: 'Priya S.',
    role: 'Small Business Owner, Mumbai',
    quote: 'I loved how transparent it was. No mystery — every factor explained clearly. Got approved for business credit after being rejected twice elsewhere.',
    score: 765,
    color: '#8B5CF6',
  },
];

export default function Testimonials() {
  const revealRef = useReveal();

  return (
    <section id="testimonials" style={{ padding: '80px 24px', position: 'relative', zIndex: 10 }} ref={revealRef}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        <div style={{ textAlign: 'center', marginBottom: 52 }} className="reveal">
          <div style={{ display: 'inline-block', padding: '4px 14px', borderRadius: 99, border: '1px solid rgba(0,212,255,0.3)', background: 'rgba(0,212,255,0.07)', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.12em', color: '#00D4FF', marginBottom: 14, fontFamily: 'Syne, sans-serif' }}>
            TESTIMONIALS
          </div>
          <h2 style={{ fontSize: 'clamp(1.8rem,4vw,3rem)', fontWeight: 800, letterSpacing: '-0.02em' }}>Trusted by Thousands</h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: 12, maxWidth: 440, margin: '12px auto 0', lineHeight: 1.65, fontSize: '0.95rem' }}>
            Real people. Real scores. Real financial transformation.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 20 }}>
          {TESTIMONIALS.map(t => (
            <div key={t.name} className="testimonial-card reveal">
              <div className="quote-mark">"</div>

              {/* Score badge */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16, position: 'relative', zIndex: 1 }}>
                <div style={{ padding: '4px 12px', borderRadius: 99, background: `${t.color}14`, border: `1px solid ${t.color}33`, fontFamily: 'Syne, sans-serif', fontSize: '0.75rem', fontWeight: 700, color: t.color }}>
                  Score: {t.score}
                </div>
              </div>

              <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.75, marginBottom: 20, position: 'relative', zIndex: 1 }}>
                "{t.quote}"
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 38, height: 38, borderRadius: '50%', background: `linear-gradient(135deg,${t.color},#8B5CF6)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '0.95rem', flexShrink: 0 }}>
                  {t.name.charAt(0)}
                </div>
                <div>
                  <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '0.9rem' }}>{t.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)' }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
