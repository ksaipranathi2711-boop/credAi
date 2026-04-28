import { useEffect, useState } from 'react';

export function useScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handler = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      const pct = (scrollTop / (scrollHeight - clientHeight)) * 100;
      setProgress(pct);
    };
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return progress;
}
