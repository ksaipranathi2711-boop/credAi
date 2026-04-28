import { useEffect, useRef } from 'react';

/**
 * useReveal — attaches an IntersectionObserver to a container ref
 * and adds the `visible` class to all `.reveal` children when they enter view.
 */
export function useReveal() {
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    const container = containerRef.current;
    if (!container) return;

    const elements = container.querySelectorAll('.reveal');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return containerRef;
}

/**
 * useSingleReveal — attach to a single element ref
 */
export function useSingleReveal() {
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) entry.target.classList.add('visible'); },
      { threshold: 0.1 }
    );
    const el = ref.current;
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return ref;
}
