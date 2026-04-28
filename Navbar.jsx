import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import LogoSVG from './LogoSVG';

export default function Navbar({ onOpenAuth }) {
  const { user, logout } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const isHome    = location.pathname === '/';

  const scrollTo = (id) => {
    if (!isHome) { navigate('/'); setTimeout(() => scrollById(id), 100); }
    else scrollById(id);
  };
  const scrollById = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className="nav-bar">
      {/* Logo */}
      <div
        className="nav-logo"
        style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
        onClick={() => navigate('/')}
      >
        <LogoSVG size={36} id="nav" />
        <div>
          <span className="gradient-text" style={{ fontSize: '1.3rem', letterSpacing: '-0.02em' }}>Cred</span>
          <span style={{ color: 'rgba(255,255,255,0.95)', fontSize: '1.3rem' }}>AI</span>
        </div>
      </div>

      {/* Links */}
      <div className="nav-links">
        <span className="nav-link" onClick={() => scrollTo('assessment')}>Assessment</span>
        <span className="nav-link" onClick={() => scrollTo('how-it-works')}>How It Works</span>
        <span className="nav-link" onClick={() => scrollTo('features')}>Features</span>
        <Link to="/dashboard" className="nav-link">Analytics</Link>
        {user && <Link to="/history" className="nav-link">History</Link>}
      </div>

      {/* Auth area */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {!user ? (
          <button className="btn-primary btn-sm" onClick={() => onOpenAuth('login')}>
            Sign In
          </button>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Link to="/history" className="user-nav-badge" style={{ textDecoration: 'none' }}>
              <div style={{
                width: 26, height: 26, borderRadius: '50%',
                background: 'linear-gradient(135deg,#00D4FF,#8B5CF6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.7rem', fontWeight: 800, fontFamily: 'Syne, sans-serif',
              }}>
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, fontFamily: 'Syne, sans-serif' }}>
                {user.name.split(' ')[0]}
              </span>
            </Link>
            <button
              onClick={logout}
              style={{
                background: 'none', border: 'none', color: 'rgba(255,255,255,0.35)',
                cursor: 'pointer', padding: '6px 10px', borderRadius: 8, transition: 'color 0.2s',
                display: 'flex', alignItems: 'center',
              }}
              onMouseOver={e => e.currentTarget.style.color = '#ff2050'}
              onMouseOut={e  => e.currentTarget.style.color = 'rgba(255,255,255,0.35)'}
              title="Sign out"
            >
              <LogOut size={14} />
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
