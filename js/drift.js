// "Particle drift" background (after the Neuform/ThreeUI Particle Drift effect, rebuilt in plain canvas, no iframe):
// letters from P T N G L O B A L drift down slowly, near neighbours join with hairlines, thin light beams rise,
// and the pointer pulls nearby letters into the accent colour and reshuffles them. Paused off-screen, ~30fps,
// static under reduced motion.
import { html } from './dom.js';

const CHARS = 'PTNGLOBAL'.split('');

export const driftCanvas = () => html`<canvas class="drift" data-drift aria-hidden="true"></canvas>`;

export function bindDrift(root) {
  root.querySelectorAll('[data-drift]').forEach((canvas) => {
    if (canvas.dataset.bound) return;
    canvas.dataset.bound = '1';
    const ctx = canvas.getContext('2d');
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let W = 0, H = 0, dpr = 1, nodes = [], beams = [], on = true, raf = 0, last = 0;
    const mouse = { x: -1e4, y: -1e4 };
    const pick = () => CHARS[(Math.random() * CHARS.length) | 0];

    function size() {
      const r = canvas.getBoundingClientRect();
      if (!r.width) return;
      dpr = Math.min(1.5, devicePixelRatio || 1);
      W = r.width; H = r.height;
      canvas.width = W * dpr; canvas.height = H * dpr;
      const n = Math.round(Math.min(110, (W * H) / 9000));
      nodes = Array.from({ length: n }, () => ({ x: Math.random() * W, y: Math.random() * H, vy: Math.random() * 0.35 + 0.08, c: pick() }));
      beams = Array.from({ length: Math.round(n / 4) }, () => ({ x: Math.random() * W, y: Math.random() * H, len: Math.random() * 90 + 40, sp: Math.random() * 3 + 1.5, a: Math.random() * 0.35 + 0.15 }));
      draw(false);
    }

    function draw(move = true) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      // rising beams
      ctx.lineWidth = 1.2;
      for (const b of beams) {
        if (move) { b.y -= b.sp; if (b.y + b.len < 0) { b.y = H + 60; b.x = Math.random() * W; } }
        const g = ctx.createLinearGradient(b.x, b.y, b.x, b.y + b.len);
        g.addColorStop(0, `rgba(79,195,236,${b.a})`); g.addColorStop(1, 'rgba(79,195,236,0)');
        ctx.strokeStyle = g; ctx.beginPath(); ctx.moveTo(b.x, b.y); ctx.lineTo(b.x, b.y + b.len); ctx.stroke();
      }
      // proximity hairlines
      ctx.lineWidth = 0.5;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j], d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 120) { ctx.strokeStyle = `rgba(160,190,205,${(0.14 * (1 - d / 120)).toFixed(3)})`; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
        }
      }
      // letters
      ctx.font = '600 12px Satoshi, "IBM Plex Mono", monospace';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      for (const n of nodes) {
        if (move) { n.y += n.vy; if (n.y > H + 20) { n.y = -20; n.x = Math.random() * W; } }
        const d = Math.hypot(mouse.x - n.x, mouse.y - n.y), near = d < 170;
        if (move && (near || Math.random() > 0.985)) n.c = pick();
        if (near) { ctx.strokeStyle = `rgba(79,195,236,${(0.5 * (1 - d / 170)).toFixed(3)})`; ctx.beginPath(); ctx.moveTo(n.x, n.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke(); }
        ctx.fillStyle = near ? '#4FC3EC' : 'rgba(160,190,205,.38)';
        ctx.fillText(n.c, n.x, n.y);
      }
    }

    function frame(now) {
      raf = 0;
      if (now - last >= 33) { last = now; draw(true); }
      if (on) raf = requestAnimationFrame(frame);
    }

    let rz = 0;
    new ResizeObserver(() => { clearTimeout(rz); rz = setTimeout(size, 120); }).observe(canvas);
    size();
    if (reduce) return;
    const host = canvas.closest('section') || canvas.parentElement; // pointer anywhere in the section, even over the content
    host.addEventListener('pointermove', (e) => { const r = canvas.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; });
    host.addEventListener('pointerleave', () => { mouse.x = mouse.y = -1e4; });
    new IntersectionObserver(([e]) => { on = e.isIntersecting; if (on && !raf) raf = requestAnimationFrame(frame); }).observe(canvas);
  });
}
