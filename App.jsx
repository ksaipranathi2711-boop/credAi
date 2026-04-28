import { useState, useRef } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { AuthProvider }  from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

import Navbar    from './components/Navbar';
import Footer    from './components/Footer';
import AuthModal from './components/AuthModal';

import Home          from './pages/Home';
import DashboardPage from './pages/DashboardPage';
import HistoryPage   from './pages/HistoryPage';
import NotFound      from './pages/NotFound';

import { useScrollProgress } from './hooks/useScrollProgress';
import { useParticles }      from './hooks/useParticles';
import { useCursorGlow }     from './hooks/useCursorGlow';

function AppLayout() {
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab,  setAuthTab]  = useState('login');

  const openAuth = (tab = 'login') => { setAuthTab(tab); setAuthOpen(true); };

  const progress  = useScrollProgress();
  const canvasRef = useRef(null);
  const glowRef   = useRef(null);
  const trailRef  = useRef(null);

  useParticles(canvasRef);
  useCursorGlow(glowRef, trailRef);

  return (
    <>
      {/* Scroll progress bar */}
      <div
        className="scroll-progress"
        style={{ width: `${progress}%` }}
        aria-hidden="true"
      />

      {/* Scan line */}
      <div className="scan-line" aria-hidden="true" />

      {/* Custom cursor */}
      <div className="cursor-glow"  ref={glowRef}  aria-hidden="true" />
      <div className="cursor-trail" ref={trailRef} aria-hidden="true" />

      {/* Particle canvas */}
      <canvas id="particles-canvas" ref={canvasRef} aria-hidden="true" />

      {/* Ambient blobs + grid */}
      <div className="blob blob-1" aria-hidden="true" />
      <div className="blob blob-2" aria-hidden="true" />
      <div className="blob blob-3" aria-hidden="true" />
      <div className="grid-overlay" aria-hidden="true" />

      {/* Navigation */}
      <Navbar onOpenAuth={openAuth} />

      {/* Page routes */}
      <main style={{ position: 'relative', zIndex: 10 }}>
        <Routes>
          <Route path="/"          element={<Home onOpenAuth={openAuth} />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/history"   element={<HistoryPage />} />
          <Route path="*"          element={<NotFound />} />
        </Routes>
      </main>

      {/* Footer */}
      <Footer />

      {/* Auth modal — portal-style, rendered at app root */}
      <AuthModal
        isOpen={authOpen}
        initialTab={authTab}
        onClose={() => setAuthOpen(false)}
      />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <AppLayout />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
