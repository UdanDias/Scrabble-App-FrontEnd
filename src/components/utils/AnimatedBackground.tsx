import { useEffect, useRef } from 'react';

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrame: number;
    let W = window.innerWidth;
    let H = window.innerHeight;

    canvas.width = W;
    canvas.height = H;

    let mouse = { x: W / 2, y: H / 2 };

    // 🔥 increased density
    const NODE_COUNT = 82;
    const CONNECTION_DIST = 190;

    interface Node {
      x: number;
      y: number;
      r: number;
      opacity: number;
      targetOpacity: number;
      pulsePhase: number;
      pulseSpeed: number;
      vx: number;
      vy: number;
      shape: 'dot' | 'diamond' | 'hex' | 'square';
      depth: number;
      isSpecial: boolean;
    }

    const randomShape = (): Node['shape'] => {
      const r = Math.random();
      if (r < 0.5) return 'dot';
      if (r < 0.72) return 'diamond';
      if (r < 0.88) return 'hex';
      return 'square';
    };

    const spawnNode = (): Node => {
      const isSpecial = Math.random() < 0.12; // 🔥 more golden nodes

      return {
        x: Math.random() * W,
        y: Math.random() * H,
        r: isSpecial ? Math.random() * 7 + 4 : Math.random() * 4 + 2,
        opacity: Math.random() * 0.6 + 0.25,
        targetOpacity: Math.random() * 0.7 + 0.25,
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: isSpecial ? 0.025 : Math.random() * 0.012 + 0.005,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        shape: randomShape(),
        depth: Math.random(),
        isSpecial,
      };
    };

    let nodes: Node[] = Array.from({ length: NODE_COUNT }, spawnNode);

    interface Star {
      x: number;
      y: number;
      len: number;
      speed: number;
      angle: number;
      opacity: number;
      life: number;
      maxLife: number;
    }

    let stars: Star[] = [];
    let nextStar = Date.now() + 800; // 🔥 more frequent stars

    const spawnStar = (): Star => ({
      x: Math.random() * W,
      y: Math.random() * H * 0.6,
      len: Math.random() * 110 + 80,
      speed: Math.random() * 7 + 6,
      angle: (Math.random() * 0.4 + 0.15) * Math.PI,
      opacity: 0,
      life: 0,
      maxLife: Math.random() * 40 + 30,
    });

    interface Ripple {
      x: number;
      y: number;
      r: number;
      opacity: number;
    }

    let ripples: Ripple[] = [];
    let nextRipple = Date.now() + 900; // 🔥 more ripples

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    const drawDiamond = (x: number, y: number, r: number) => {
      ctx.beginPath();
      ctx.moveTo(x, y - r * 1.5);
      ctx.lineTo(x + r, y);
      ctx.lineTo(x, y + r * 1.5);
      ctx.lineTo(x - r, y);
      ctx.closePath();
    };

    const drawHex = (x: number, y: number, r: number) => {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (Math.PI / 3) * i - Math.PI / 6;
        const px = x + r * 1.2 * Math.cos(a);
        const py = y + r * 1.2 * Math.sin(a);
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.closePath();
    };

    const drawSquare = (x: number, y: number, r: number) => {
      ctx.beginPath();
      ctx.rect(x - r, y - r, r * 2, r * 2);
      ctx.closePath();
    };

    const drawNode = (n: Node) => {
      const pulse = Math.sin(n.pulsePhase) * 0.35 + 0.85;
      const r = n.r * pulse * (0.65 + n.depth);
      const a = n.opacity * pulse;

      const colorShift = Math.sin(n.pulsePhase) * 0.5 + 0.5;

      const rCol = 235 + Math.floor(20 * colorShift);
      const gCol = 220 + Math.floor(35 * colorShift);
      const bCol = 30 + Math.floor(70 * colorShift);

      ctx.globalAlpha = a;
      ctx.fillStyle = `rgb(${rCol}, ${gCol}, ${bCol})`;
      ctx.strokeStyle = `rgba(${rCol}, ${gCol}, ${bCol}, 0.8)`;
      ctx.lineWidth = 1;

      ctx.shadowColor = `rgba(${rCol}, ${gCol}, ${bCol}, 0.95)`;
      ctx.shadowBlur = n.isSpecial ? r * 7 : r * 4; // 🔥 stronger glow

      if (n.shape === 'dot') {
        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fill();
      } else if (n.shape === 'diamond') {
        drawDiamond(n.x, n.y, r);
        ctx.fill();
        ctx.stroke();
      } else if (n.shape === 'hex') {
        drawHex(n.x, n.y, r);
        ctx.fill();
        ctx.stroke();
      } else {
        drawSquare(n.x, n.y, r);
        ctx.fill();
        ctx.stroke();
      }

      ctx.shadowBlur = 0;
    };

    const drawConnections = () => {
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];

          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist > CONNECTION_DIST) continue;

          const strength = 1 - dist / CONNECTION_DIST;

          const centerDist = Math.hypot(
            (a.x + b.x) / 2 - W / 2,
            (a.y + b.y) / 2 - H / 2
          );

          const centerBoost =
            1 - centerDist / (Math.max(W, H) * 0.7);

          const alpha =
            strength * 0.35 * centerBoost *
            Math.min(a.opacity, b.opacity);

          const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
          grad.addColorStop(0, `rgba(224,211,24,0)`);
          grad.addColorStop(0.5, `rgba(255,245,160,${alpha * 2.2})`); // 🔥 brighter gold
          grad.addColorStop(1, `rgba(224,211,24,0)`);

          ctx.globalAlpha = 1;
          ctx.strokeStyle = grad;
          ctx.lineWidth = strength * 2.2;
          ctx.shadowColor = 'rgba(255,230,120,0.5)';
          ctx.shadowBlur = 10;

          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();

          ctx.shadowBlur = 0;
        }
      }
    };

    const drawStars = () => {
      stars = stars.filter(s => s.life < s.maxLife);

      stars.forEach(s => {
        s.life++;
        s.x += Math.cos(s.angle) * s.speed;
        s.y += Math.sin(s.angle) * s.speed;

        const p = s.life / s.maxLife;
        s.opacity =
          p < 0.2 ? p / 0.2 : p > 0.7 ? 1 - (p - 0.7) / 0.3 : 1;

        const tail = {
          x: s.x - Math.cos(s.angle) * s.len,
          y: s.y - Math.sin(s.angle) * s.len,
        };

        const grad = ctx.createLinearGradient(tail.x, tail.y, s.x, s.y);

        grad.addColorStop(0, 'rgba(224,211,24,0)');
        grad.addColorStop(1, `rgba(255,245,170,${s.opacity})`); // 🔥 brighter

        ctx.globalAlpha = 1;
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.8;
        ctx.shadowBlur = 10;

        ctx.beginPath();
        ctx.moveTo(tail.x, tail.y);
        ctx.lineTo(s.x, s.y);
        ctx.stroke();

        ctx.shadowBlur = 0;

        ctx.globalAlpha = s.opacity;
        ctx.fillStyle = '#fff8c0';
        ctx.beginPath();
        ctx.arc(s.x, s.y, 2.2, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    const drawRipples = () => {
      ripples = ripples.filter(r => r.opacity > 0.01);

      ripples.forEach(r => {
        r.r += 1.6;
        r.opacity *= 0.97;

        ctx.globalAlpha = r.opacity;
        ctx.strokeStyle = 'rgba(255,235,140,0.65)';
        ctx.lineWidth = 1.4;
        ctx.shadowBlur = 6;

        ctx.beginPath();
        ctx.arc(r.x, r.y, r.r, 0, Math.PI * 2);
        ctx.stroke();

        ctx.shadowBlur = 0;
      });
    };

    const animate = () => {
      const now = Date.now();

      ctx.clearRect(0, 0, W, H);

      if (now >= nextStar && stars.length < 5) { // 🔥 more stars allowed
        stars.push(spawnStar());
        nextStar = now + Math.random() * 2500 + 1200;
      }

      if (now >= nextRipple) {
        const n = nodes[Math.floor(Math.random() * nodes.length)];
        ripples.push({
          x: n.x,
          y: n.y,
          r: n.r,
          opacity: 0.55,
        });
        nextRipple = now + Math.random() * 1800 + 800;
      }

      nodes.forEach(n => {
        const dx = mouse.x - n.x;
        const dy = mouse.y - n.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 150) {
          n.x -= dx * 0.0022;
          n.y -= dy * 0.0022;
        }

        n.x += n.vx * (0.35 + n.depth);
        n.y += n.vy * (0.35 + n.depth);

        n.pulsePhase += n.pulseSpeed;

        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;

        n.x = Math.max(0, Math.min(W, n.x));
        n.y = Math.max(0, Math.min(H, n.y));

        if (Math.random() < 0.004) {
          n.targetOpacity = Math.random() * 0.7 + 0.25;
        }

        n.opacity += (n.targetOpacity - n.opacity) * 0.025;
      });

      drawConnections();
      nodes.forEach(drawNode);
      drawRipples();
      drawStars();

      ctx.globalAlpha = 1;

      animFrame = requestAnimationFrame(animate);
    };

    const resize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W;
      canvas.height = H;
    };

    window.addEventListener('resize', resize);

    animate();

    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: '#060413', // Lowest dark base layer
          zIndex: -3,
          pointerEvents: 'none',
        }}
      />

      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: -2,
        }}
      />

      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: `
            radial-gradient(circle at 50% 50%,
              rgba(10,6,30,0.92) 0%,
              rgba(6,4,19,0.75) 45%,
              rgba(0,0,0,0.95) 100%)
          `,
          pointerEvents: 'none',
          zIndex: -1,
        }}
      />
    </>
  );
}