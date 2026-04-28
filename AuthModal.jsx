import { useState } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function AuthModal({ isOpen, initialTab = 'login', onClose }) {
  const { login, register } = useAuth();
  const toast = useToast();

  const [tab, setTab]         = useState(initialTab);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  // Login fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass,  setLoginPass]  = useState('');

  // Signup fields
  const [signupName,  setSignupName]  = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPass,  setSignupPass]  = useState('');

  const switchTab = (t) => { setTab(t); setError(''); };

  const handleLogin = async () => {
    if (!loginEmail || !loginPass) { setError('Please fill all fields.'); return; }
    setLoading(true); setError('');
    try {
      await login(loginEmail.trim().toLowerCase(), loginPass);
      toast(`Welcome back! 👋`, 'success');
      onClose();
    } catch (e) {
      setError(e.message || 'Invalid credentials.');
    } finally { setLoading(false); }
  };

  const handleSignup = async () => {
    if (!signupName || !signupEmail || !signupPass) { setError('Please fill all fields.'); return; }
    if (signupPass.length < 6) { setError('Password must be 6+ characters.'); return; }
    if (!/\S+@\S+\.\S+/.test(signupEmail)) { setError('Invalid email address.'); return; }
    setLoading(true); setError('');
    try {
      await register(signupName.trim(), signupEmail.trim().toLowerCase(), signupPass);
      toast(`Account created! Welcome, ${signupName.split(' ')[0]}! 🎉`, 'success');
      onClose();
    } catch (e) {
      setError(e.message || 'Registration failed.');
    } finally { setLoading(false); }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-box">
        {/* Close */}
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', display: 'flex' }}
        >
          <X size={18} />
        </button>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          <button className={`tab-pill${tab === 'login'  ? ' active' : ''}`} onClick={() => switchTab('login')}>Sign In</button>
          <button className={`tab-pill${tab === 'signup' ? ' active' : ''}`} onClick={() => switchTab('signup')}>Create Account</button>
        </div>

        {/* Login form */}
        {tab === 'login' && (
          <div>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.3rem', fontWeight: 700, marginBottom: 4 }}>Welcome back</h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', marginBottom: 20 }}>Access your credit history and profile</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label className="field-label">Email</label>
                <input
                  type="email" className="field-input" placeholder="you@example.com"
                  value={loginEmail} onChange={e => setLoginEmail(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}
                />
              </div>
              <div>
                <label className="field-label">Password</label>
                <input
                  type="password" className="field-input" placeholder="••••••••"
                  value={loginPass} onChange={e => setLoginPass(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}
                />
              </div>
              {error && <div className="auth-error">{error}</div>}
              <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={handleLogin} disabled={loading}>
                {loading ? <span className="loader" /> : 'Sign In'}
              </button>
            </div>
            <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.35)', fontSize: '0.82rem', marginTop: 14 }}>
              No account?{' '}
              <button onClick={() => switchTab('signup')} style={{ background: 'none', border: 'none', color: '#00D4FF', cursor: 'pointer', fontSize: '0.82rem' }}>
                Create one →
              </button>
            </p>
          </div>
        )}

        {/* Signup form */}
        {tab === 'signup' && (
          <div>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.3rem', fontWeight: 700, marginBottom: 4 }}>Create account</h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', marginBottom: 20 }}>Start tracking your credit journey</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label className="field-label">Full Name</label>
                <input
                  type="text" className="field-input" placeholder="Alex Johnson"
                  value={signupName} onChange={e => setSignupName(e.target.value)}
                />
              </div>
              <div>
                <label className="field-label">Email</label>
                <input
                  type="email" className="field-input" placeholder="you@example.com"
                  value={signupEmail} onChange={e => setSignupEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="field-label">Password</label>
                <input
                  type="password" className="field-input" placeholder="Min 6 characters"
                  value={signupPass} onChange={e => setSignupPass(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSignup()}
                />
              </div>
              {error && <div className="auth-error">{error}</div>}
              <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={handleSignup} disabled={loading}>
                {loading ? <span className="loader" /> : 'Create Account'}
              </button>
            </div>
            <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.35)', fontSize: '0.82rem', marginTop: 14 }}>
              Have an account?{' '}
              <button onClick={() => switchTab('login')} style={{ background: 'none', border: 'none', color: '#00D4FF', cursor: 'pointer', fontSize: '0.82rem' }}>
                Sign in →
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
