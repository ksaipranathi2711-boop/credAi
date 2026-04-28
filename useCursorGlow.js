import { useEffect, useRef } from 'react';

export function useCursorGlow(glowRef, trailRef) {
  useEffect(() => {
    let mx = -100, my = -100;
    let tx = -100, ty = -100;
    let animId;

    const onMove = (e) => {
      mx = e.clientX; my = e.clientY;
      if (glowRef.current) {
        glowRef.current.style.left = mx + 'px';
        glowRef.current.style.top  = my + 'px';
      }
    };

    const animTrail = () => {
      tx += (mx - tx) * 0.15;
      ty += (my - ty) * 0.15;
      if (trailRef.current) {
        trailRef.current.style.left = tx + 'px';
        trailRef.current.style.top  = ty + 'px';
      }
      animId = requestAnimationFrame(animTrail);
    };
    animTrail();

    document.addEventListener('mousemove', onMove);
    return () => {
      document.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(animId);
    };
  }, [glowRef, trailRef]);
}
