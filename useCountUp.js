import { useEffect, useRef, useState } from 'react';

/**
 * useCountUp — animates a number from 0 to `target` when the ref enters viewport.
 * Returns [ref, displayValue].
 */
export function useCountUp(target, duration = 1500) {
  const ref        = useRef(null);
  const [val, setVal] = useState(0);
  const animated   = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated.current) {
          animated.current = true;
          const startTime = performance.now();
          const step = (now) => {
            const elapsed  = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased    = 1 - Math.pow(1 - progress, 3);
            setVal(Math.round(eased * target));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.3 }
    );

    const el = ref.current;
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return [ref, val];
}
