import { useState } from 'react';
import LogoSVG from './LogoSVG';
import { useToast } from '../context/ToastContext';

const SOCIAL = [
  { title: 'Twitter/X', path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z' },
  { title: 'LinkedIn', path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' },
  { title: 'GitHub', path: 'M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12' },
];

export default function Footer() {
  const toast = useToast();
  const [email, setEmail] = useState('');

  const handleNewsletter = () => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) { toast('Please enter a valid email.', 'warning'); return; }
    toast('Subscribed! Welcome to CredAI updates. 🎉', 'success');
    setEmail('');
  };

  return (
    <footer style={{ padding: '60px 24px 32px', position: 'relative', zIndex: 10, background: 'rgba(0,0,0,0.2)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 40, marginBottom: 48, flexWrap: 'wrap' }}>

          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <LogoSVG size={32} id="footer" />
              <span style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.2rem', fontWeight: 800 }}>
                <span className="gradient-text">Cred</span><span style={{ color: '#fff' }}>AI</span>
              </span>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.85rem', lineHeight: 1.7, maxWidth: 240, marginBottom: 20 }}>
              Next-generation AI credit risk assessment platform. Empowering financial decisions with transparent intelligence.
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              {SOCIAL.map(s => (
                <a key={s.title} href="#" className="footer-social" title={s.title}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d={s.path} /></svg>
                </a>
              ))}
            </div>
          </div>

          {/* Product links */}
          <div>
            <h4 style={{ fontFamily: 'Syne, sans-serif', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.5)', marginBottom: 16, textTransform: 'uppercase' }}>Product</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {['Credit Assessment','How It Works','Features','Analytics Dashboard','API Access','Pricing'].map(l => (
                <a key={l} href="#" className="footer-link">{l}</a>
              ))}
            </div>
          </div>

          {/* Company links */}
          <div>
            <h4 style={{ fontFamily: 'Syne, sans-serif', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.5)', marginBottom: 16, textTransform: 'uppercase' }}>Company</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {['About Us','Blog','Careers','Press Kit','Contact'].map(l => (
                <a key={l} href="#" className="footer-link">{l}</a>
              ))}
            </div>
          </div>

          {/* Legal */}
          <div>
            <h4 style={{ fontFamily: 'Syne, sans-serif', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.5)', marginBottom: 16, textTransform: 'uppercase' }}>Legal & Support</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {['Privacy Policy','Terms of Service','Cookie Policy','Help Center','Status'].map(l => (
                <a key={l} href="#" className="footer-link">{l}</a>
              ))}
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 40, marginBottom: 40 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
            <div>
              <h4 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1rem', fontWeight: 700, marginBottom: 4 }}>Stay updated</h4>
              <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.85rem' }}>Get the latest fintech insights and platform updates.</p>
            </div>
            <div style={{ display: 'flex', maxWidth: 360, width: '100%' }}>
              <input
                type="email" className="newsletter-input"
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleNewsletter()}
              />
              <button className="newsletter-btn" onClick={handleNewsletter}>Subscribe</button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.8rem' }}>© {new Date().getFullYear()} CredAI. All rights reserved. Not financial advice.</span>
          <div style={{ display: 'flex', gap: 16 }}>
            {['Privacy','Terms','Cookies','Sitemap'].map(l => (
              <a key={l} href="#" className="footer-link" style={{ fontSize: '0.78rem' }}>{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
