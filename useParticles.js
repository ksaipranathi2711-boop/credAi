import { useEffect, useRef } from 'react';

export function useParticles(canvasRef) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let W = (canvas.width  = window.innerWidth);
    let H = (canvas.height = window.innerHeight);
    let animId;

    const onResize = () => {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);

    const N   = 60;
    const pts = Array.from({ length: N }, () => ({
      x:  Math.random() * window.innerWidth,
      y:  Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r:  Math.random() * 1.5 + 0.5,
      c:  Math.random() > 0.5 ? [0, 212, 255] : [139, 92, 246],
    }));

    function draw() {
      ctx.clearRect(0, 0, W, H);

      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.c[0]},${p.c[1]},${p.c[2]},0.6)`;
        ctx.fill();
      });

      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const dx   = pts[i].x - pts[j].x;
          const dy   = pts[i].y - pts[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(0,212,255,${(1 - dist / 120) * 0.12})`;
            ctx.lineWidth   = 0.5;
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    }
    draw();

    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animId);
    };
  }, [canvasRef]);
}
