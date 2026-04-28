import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '24px', position: 'relative', zIndex: 10, textAlign: 'center',
    }}>
      {/* Glowing 404 */}
      <div style={{
        fontFamily: 'Syne, sans-serif', fontSize: 'clamp(6rem,18vw,14rem)',
        fontWeight: 800, lineHeight: 1,
        background: 'linear-gradient(135deg, rgba(0,212,255,0.15), rgba(139,92,246,0.15))',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        filter: 'drop-shadow(0 0 40px rgba(0,212,255,0.2))',
        marginBottom: 8, letterSpacing: '-0.04em',
      }}>
        404
      </div>

      <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.5rem', fontWeight: 700, marginBottom: 12 }}>
        Page Not Found
      </h2>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.95rem', maxWidth: 380, lineHeight: 1.7, marginBottom: 36 }}>
        This page doesn't exist or was moved. Head back home and keep building your credit score.
      </p>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link to="/" className="btn-primary" style={{ textDecoration: 'none' }}>
          <Home size={16} /> Back to Home
        </Link>
        <button className="btn-ghost" onClick={() => window.history.back()}>
          <ArrowLeft size={16} /> Go Back
        </button>
      </div>
    </div>
  );
}
