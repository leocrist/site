// Hero flow graphic (after the TestSprite "how it works" pattern, restyled for PTN):
// scattered requests on the left funnel through fine threads into the PTN node, then leave as a dashed stream
// that opens into a perspective fan of delivered work. Canvas, paused off-screen, static under reduced motion.
import { html } from './dom.js';
import { LOGO_MARK } from './assets.js';

export function flowArt() {
  return html`<div class="flow" data-flow aria-hidden="true">
    <canvas class="flow-canvas"></canvas>
    <span class="flow-node"><img src="${LOGO_MARK}" alt=""></span>
    <span class="flow-tag flow-tag--in">Your <b class="flow-word" data-flow-word>ideas</b></span>
    <span class="flow-tag flow-tag--out"><span class="flow-long">Built, tested, </span>shipped</span>
  </div>`;
}

const NODE = { x: 0.62, y: 0.5 };

export function bindFlow(root) {
  const el = root.querySelector('[data-flow]');
  if (!el) return;
  const canvas = el.querySelector('canvas'), ctx = canvas.getContext('2d');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const css = getComputedStyle(document.documentElement);
  const ACC = css.getPropertyValue('--ptn-accent').trim() || '#008FC4';
  let narrow = false, W = 0, H = 0, dpr = 1, threads = [], sparks = [], raf = 0, on = true, t0 = 0;

  // deterministic scatter
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

  function build() {
    seed = 7;
    const nx = W * NODE.x, ny = H * NODE.y;
    threads = Array.from({ length: 46 }, (_, i) => {
      const sx = narrow ? W * (0.02 + rnd() * 0.26) : W * (0.3 + rnd() * 0.22), sy = Math.max(6, Math.min(H - 6, ny + (rnd() - 0.5) * H * 0.95));
      return { sx, sy, c1x: lerp(sx, nx, 0.55), c1y: sy, c2x: lerp(sx, nx, 0.8), c2y: lerp(sy, ny, 0.92), nx, ny, speed: 0.12 + rnd() * 0.16, off: rnd(), live: i % 12 === 0 };
    });
    // packets ride the fan rays outward (ray index matches paintStatic)
    sparks = [2, 5, 8, 13, 16, 19, 4, 17].map((ray, i) => ({ ray, speed: 0.1 + rnd() * 0.08, off: rnd() + i * 0.13 }));
  }
  const lerp = (a, b, k) => a + (b - a) * k;
  const bez = (th, k) => {
    const u = 1 - k;
    return [u * u * u * th.sx + 3 * u * u * k * th.c1x + 3 * u * k * k * th.c2x + k * k * k * th.nx, u * u * u * th.sy + 3 * u * u * k * th.c1y + 3 * u * k * k * th.c2y + k * k * k * th.ny];
  };

  // Static layer (threads, fan rays) is painted once per resize into an offscreen canvas;
  // each frame only blits it and draws a few dozen small rects. Capped at 30fps.
  const bg = document.createElement('canvas'), bctx = bg.getContext('2d');

  function size() {
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) return;
    dpr = Math.min(1.5, devicePixelRatio || 1);
    W = r.width; H = r.height;
    // Sit the node on the headline's centre line so the graphic reads as a continuation of it.
    // Narrow screens: the graphic becomes a band above the headline, node centred.
    narrow = W < 900;
    NODE.x = narrow ? 0.5 : 0.62;
    const h1 = el.parentElement.querySelector('h1');
    if (narrow) NODE.y = 0.5;
    else if (h1) { const hr = h1.getBoundingClientRect(); NODE.y = Math.min(0.85, Math.max(0.15, (hr.top + hr.height / 2 - r.top) / H)); }
    canvas.width = bg.width = W * dpr; canvas.height = bg.height = H * dpr;
    el.style.setProperty('--nx', `${NODE.x * 100}%`); el.style.setProperty('--ny', `${NODE.y * 100}%`);
    build();
    paintStatic();
    draw(3);
  }

  function paintStatic() {
    const c = bctx, nx = W * NODE.x, ny = H * NODE.y;
    c.setTransform(dpr, 0, 0, dpr, 0, 0);
    c.clearRect(0, 0, W, H);
    const tg = c.createLinearGradient(W * 0.3, 0, nx, 0);
    tg.addColorStop(0, 'rgba(3,20,28,0)'); tg.addColorStop(1, 'rgba(3,20,28,.16)');
    c.strokeStyle = tg; c.lineWidth = 0.7; c.beginPath();
    threads.forEach((th) => { c.moveTo(th.sx, th.sy); c.bezierCurveTo(th.c1x, th.c1y, th.c2x, th.c2y, th.nx, th.ny); });
    c.stroke();
    const rg = c.createLinearGradient(nx, 0, W, 0);
    rg.addColorStop(0, 'rgba(0,143,196,0)'); rg.addColorStop(0.35, 'rgba(0,143,196,.16)'); rg.addColorStop(1, 'rgba(0,143,196,.05)');
    c.save(); c.setLineDash([6, 7]); c.strokeStyle = rg; c.lineWidth = 0.8; c.beginPath();
    const rays = 22, spread = H * 1.5;
    for (let i = 0; i < rays; i++) { c.moveTo(nx + 30, ny); c.lineTo(W + 20, ny + (i / (rays - 1) - 0.5) * spread); }
    c.stroke(); c.restore();
  }

  function draw(t) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bg, 0, 0);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const nx = W * NODE.x, ny = H * NODE.y;

    if (!reduce) {
      ctx.fillStyle = ACC;
      threads.forEach((th) => {
        if (!th.live) return;
        const k = (t * th.speed + th.off) % 1, [x, y] = bez(th, k);
        ctx.globalAlpha = Math.min(1, k * 2.2); ctx.fillRect(x - 1.5, y - 1.5, 3, 3);
      });
      ctx.globalAlpha = 1;
    }

    const len = W - nx - 34, step = 14, shift = reduce ? 0 : (t * 26) % step;
    for (let d = shift; d < len; d += step) {
      const k = d / len, h = 1.5 + k * k * 30, w = 3 + k * 5;
      ctx.fillStyle = `rgba(0,143,196,${(0.75 * Math.min(1, k * 4) * (1 - k * 0.55)).toFixed(3)})`;
      ctx.fillRect(nx + 34 + d, ny - h / 2, w, h);
    }

    ctx.fillStyle = ACC;
    const rays = 22, spread = H * 1.5, x0 = nx + 30;
    sparks.forEach((s) => {
      const k = reduce ? 0.6 : (t * s.speed + s.off) % 1, e = k * k; // accelerate away, like perspective
      const ex = W + 20, ey = ny + (s.ray / (rays - 1) - 0.5) * spread;
      const x = x0 + (ex - x0) * e, y = ny + (ey - ny) * e, sz = 2.5 + e * 6;
      ctx.globalAlpha = Math.min(1, k * 5) * (1 - e * 0.6);
      ctx.fillRect(x - sz / 2, y - sz / 2, sz, sz);
    });
    ctx.globalAlpha = 1;
  }

  let last = 0;
  function frame(now) {
    raf = 0;
    if (!t0) t0 = now;
    if (now - last >= 33) { last = now; draw((now - t0) / 1000); }
    if (on) raf = requestAnimationFrame(frame);
  }

  let rz = 0;
  const onResize = () => { clearTimeout(rz); rz = setTimeout(size, 120); };
  size();
  new ResizeObserver(onResize).observe(el);
  if (reduce) return;
  // "Your ideas / roadmap / product …" cycling under the funnel.
  const word = el.querySelector('[data-flow-word]'), WORDS = ['ideas', 'roadmap', 'backlog', 'product', 'vision'];
  let wi = 0;
  setInterval(() => {
    if (!on || !word.isConnected) return;
    word.classList.add('is-out');
    setTimeout(() => { wi = (wi + 1) % WORDS.length; word.textContent = WORDS[wi]; word.classList.remove('is-out'); }, 280);
  }, 2400);
  new IntersectionObserver(([e]) => { on = e.isIntersecting; if (on && !raf) raf = requestAnimationFrame(frame); }).observe(el);
  raf = requestAnimationFrame(frame);
}
