import { createContext, useContext, useState, useCallback, useRef } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts]   = useState([]);
  const idRef                 = useRef(0);

  const toast = useCallback((msg, type = 'info') => {
    const id = ++idRef.current;
    setToasts(prev => [...prev, { id, msg, type, visible: false }]);
    // Trigger show on next frame
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setToasts(prev => prev.map(t => t.id === id ? { ...t, visible: true } : t));
      });
    });
    // Auto-dismiss
    setTimeout(() => {
      setToasts(prev => prev.map(t => t.id === id ? { ...t, visible: false } : t));
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 500);
    }, 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <ToastContainer toasts={toasts} />
    </ToastContext.Provider>
  );
}

function ToastContainer({ toasts }) {
  const COLORS = { success: '#2DD4BF', error: '#ff2050', warning: '#f59e0b', info: '#00D4FF' };
  return (
    <div className="toast-wrap">
      {toasts.map(t => (
        <div key={t.id} className={`toast-item${t.visible ? ' show' : ''}`}>
          <span
            className="toast-dot"
            style={{ background: COLORS[t.type] || COLORS.info, boxShadow: `0 0 8px ${COLORS[t.type] || COLORS.info}` }}
          />
          <span>{t.msg}</span>
        </div>
      ))}
    </div>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside ToastProvider');
  return ctx.toast;
}
