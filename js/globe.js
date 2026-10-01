// Home globe: a still, glass dot-matrix earth centred on Asia-Pacific, standing on a perspective floor. Lines leave the
// offices (Can Tho, Melbourne) in sequence and fan out across the world: Australia and New Zealand first, then everywhere.
// Markets from ptnglobalcorp.com/job-board ("customers from Australia, New Zealand, and other English-speaking
// countries in North America and Europe"; stakeholders "from Australia, New Zealand, UK and US").
// Cities other than Can Tho, Ho Chi Minh City and Melbourne stand for those markets, not named client offices.
// Libraries load lazily from jsDelivr; if they fail, the static panel stays.
import { html } from './dom.js';

const HUB = { name: 'Can Tho', role: 'Vietnam · Delivery hub', at: [105.78, 10.04] };
const PLACES = [
  // primary: Australia and New Zealand
  { name: 'Melbourne', role: 'Australia · Head office', at: [144.96, -37.81], office: true, primary: true, side: -1 },
  { name: 'Sydney', role: 'Australia', at: [151.21, -33.87], primary: true, small: true },
  // secondary: shown, not emphasised
  { name: 'Ho Chi Minh City', role: 'Vietnam', at: [106.66, 10.76], small: true },
  { name: 'Perth', role: 'Australia', at: [115.86, -31.95], small: true },
  { name: 'Brisbane', role: 'Australia', at: [153.03, -27.47], small: true },
  { name: 'Wellington', role: 'New Zealand', at: [174.78, -41.29], small: true },
  { name: 'London', role: 'United Kingdom', at: [-0.13, 51.51] },
  { name: 'New York', role: 'United States', at: [-74.0, 40.71] },
];

export function globePanel() {
  return html`<div class="globe" data-globe>
    <canvas class="globe-canvas" aria-hidden="true"></canvas>
    <div class="globe-copy">
      <p class="eyebrow globe-eyebrow"><span class="eyebrow-mark" aria-hidden="true"></span>Global delivery</p>
      <h2 class="display display--2 globe-title">Engineered in Vietnam, <span class="accent">trusted across the globe.</span></h2>
      <p class="globe-lead">From our hub in Can Tho to product teams in Australia, New Zealand, Europe and North America.</p>
    </div>
    <p class="vh">Globe showing PTN Global's delivery hub in Can Tho, Vietnam, its head office in Melbourne, and client markets in Australia, New Zealand, Europe and North America.</p>
  </div>`;
}

let libs;
const load = () =>
  (libs ||= Promise.all([
    import('https://cdn.jsdelivr.net/npm/d3-geo@3/+esm'),
    import('https://cdn.jsdelivr.net/npm/topojson-client@3/+esm'),
    fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/land-110m.json').then((r) => r.json()),
  ]));

const VIEW = [-140, 16, 0];
// Ambient nodes: unlabelled, decorative only (a sense of a connected world, not client locations).
const AMBIENT = [[103.82, 1.35], [139.69, 35.68], [126.98, 37.57], [114.17, 22.32], [121.47, 31.23], [106.85, -6.2], [100.5, 13.75],
  [72.88, 19.08], [77.21, 28.61], [55.27, 25.2], [120.98, 14.6], [-157.86, 21.31], [178.44, -18.14], [-149.57, -17.53], [130.84, -12.46],
  [147.18, -9.44], [87.6, 43.8], [90.41, 23.81], [-0.13, 51.51], [-74.0, 40.71], [37.62, 55.75], [2.35, 48.86], [-122.42, 37.77]]; // fixed rotation: Vietnam upper left, Australia centre, New Zealand right

export async function bindGlobe(root) {
  const el = root.querySelector('[data-globe]');
  if (!el) return;
  let d3, topo, world;
  try {
    [d3, topo, world] = await load();
  } catch {
    el.classList.add('is-static');
    return;
  }
  const land = topo.feature(world, world.objects.land);
  const canvas = el.querySelector('canvas');
  const ctx = canvas.getContext('2d');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const proj = d3.geoOrthographic().clipAngle(90);
  const path = d3.geoPath(proj, ctx);
  const grat = d3.geoGraticule().step([20, 20])();
  const ACC = '#4FC3EC';

  // Land as a fine dot matrix, computed once.
  const dots = [];
  for (let lat = -56; lat <= 76; lat += 2) {
    const step = 2 / Math.max(0.3, Math.cos((lat * Math.PI) / 180));
    for (let lon = -180; lon < 180; lon += step) if (d3.geoContains(land, [lon, lat])) dots.push([lon, lat]);
  }
  const pins = PLACES.map((p, i) => ({ ...p, phase: i * 0.37, line: { type: 'LineString', coordinates: Array.from({ length: 49 }, (_, k) => d3.geoInterpolate(HUB.at, p.at)(k / 48)) } }));

  let W = 0, H = 0, R = 0, dpr = 1, narrow = false;
  const base = document.createElement('canvas'), bctx = base.getContext('2d');
  const bpath = d3.geoPath(proj, bctx);
  proj.rotate(VIEW);
  const center = [-VIEW[0], -VIEW[1]];
  const depth = (ll) => Math.cos(d3.geoDistance(ll, center)); // 1 = facing, 0 = horizon

  function size() {
    const r = el.getBoundingClientRect();
    if (!r.width) return;
    dpr = Math.min(1.5, window.devicePixelRatio || 1);
    W = r.width; H = r.height;
    canvas.width = base.width = W * dpr; canvas.height = base.height = H * dpr;
    narrow = W < 900;
    R = narrow ? Math.min(W * 0.62, H * 0.4) : Math.min(H * 0.66, W * 0.36);
    // a touch larger than the panel is tall: the sphere's bottom edge slips just out of frame
    proj.scale(R).translate(narrow ? [W / 2, H - R * 0.9] : [W * 0.69, H / 2 + R * 0.22]);
    paintBase();
  }

  // Perspective floor under the globe (same language as the "horizon" placeholder art):
  // a starfield above the horizon line, a receding grid below it, vanishing point under the sphere.
  function horizon(c, cx, cy) {
    const hy = cy - R * (narrow ? 0.02 : 0.12);
    let sd = 11; const rnd = () => ((sd = (sd * 16807) % 2147483647) / 2147483647);
    for (let i = 0; i < 70; i++) {
      const x = rnd() * W, y = rnd() * hy * 0.94, r = 0.4 + rnd() * 0.9;
      c.globalAlpha = 0.25 + rnd() * 0.55; c.fillStyle = '#fff'; c.fillRect(x - r / 2, y - r / 2, r, r);
    }
    c.globalAlpha = 1;
    const sun = c.createRadialGradient(cx, hy, 0, cx, hy, R * 0.9);
    sun.addColorStop(0, 'rgba(160,220,245,.18)'); sun.addColorStop(1, 'rgba(160,220,245,0)');
    c.fillStyle = sun; c.fillRect(0, 0, W, H);
    const fade = c.createLinearGradient(0, hy, 0, H);
    fade.addColorStop(0, 'rgba(95,170,205,.38)'); fade.addColorStop(1, 'rgba(95,170,205,.14)');
    c.strokeStyle = fade; c.lineWidth = 0.7; c.beginPath();
    const span = Math.max(W, H) * 0.14;
    for (let i = -18; i <= 18; i++) { c.moveTo(cx, hy); c.lineTo(cx + i * span, H); }
    for (let k = 1; k <= 12; k++) { const y = hy + (H - hy) * Math.pow(k / 12, 2.1); c.moveTo(0, y); c.lineTo(W, y); }
    c.stroke();
    c.strokeStyle = 'rgba(210,240,252,.42)'; c.lineWidth = 1; c.beginPath(); c.moveTo(0, hy); c.lineTo(W, hy); c.stroke();
  }

  // Everything that does not move, painted once per resize.
  function paintBase() {
    const c = bctx;
    c.setTransform(dpr, 0, 0, dpr, 0, 0);
    c.clearRect(0, 0, W, H);
    const [cx, cy] = proj.translate();
    horizon(c, cx, cy);
    const glow = c.createRadialGradient(cx, cy, R * 0.6, cx, cy, R * 1.25);
    glow.addColorStop(0, 'rgba(0,143,196,.10)'); glow.addColorStop(1, 'rgba(0,143,196,0)');
    c.fillStyle = glow; c.fillRect(0, 0, W, H);
    // Glass: a tinted, see-through body (the floor shows through, dimmed), a fresnel rim that brightens toward the edge,
    // a light-catching stroke on the upper left, and a soft specular sheen painted after the land.
    c.beginPath(); bpath({ type: 'Sphere' });
    const body = c.createRadialGradient(cx - R * 0.3, cy - R * 0.35, R * 0.1, cx, cy, R);
    body.addColorStop(0, 'rgba(24,62,80,.62)'); body.addColorStop(0.7, 'rgba(10,26,34,.72)'); body.addColorStop(1, 'rgba(8,20,27,.6)');
    c.fillStyle = body; c.fill();
    const rim = c.createRadialGradient(cx, cy, R * 0.72, cx, cy, R);
    rim.addColorStop(0, 'rgba(79,195,236,0)'); rim.addColorStop(0.82, 'rgba(79,195,236,.07)'); rim.addColorStop(1, 'rgba(120,210,245,.32)');
    c.fillStyle = rim; c.fill();
    const edge = c.createLinearGradient(cx - R, cy - R, cx + R, cy + R);
    edge.addColorStop(0, 'rgba(200,238,252,.85)'); edge.addColorStop(0.5, 'rgba(79,195,236,.35)'); edge.addColorStop(1, 'rgba(79,195,236,.12)');
    c.strokeStyle = edge; c.lineWidth = 1.2; c.stroke();
    c.beginPath(); bpath(grat); c.strokeStyle = 'rgba(255,255,255,.045)'; c.lineWidth = 0.5; c.stroke();
    for (const d of dots) {
      const z = depth(d);
      if (z <= 0.02) continue;
      const [x, y] = proj(d);
      c.fillStyle = `rgba(150,212,236,${(0.2 + z * 0.6).toFixed(2)})`;
      c.fillRect(x - 0.7, y - 0.7, 1.4, 1.4);
    }
    const sheen = c.createRadialGradient(cx - R * 0.42, cy - R * 0.5, 0, cx - R * 0.42, cy - R * 0.5, R * 0.75);
    sheen.addColorStop(0, 'rgba(255,255,255,.10)'); sheen.addColorStop(1, 'rgba(255,255,255,0)');
    c.save(); c.beginPath(); bpath({ type: 'Sphere' }); c.clip(); c.fillStyle = sheen; c.fillRect(0, 0, W, H); c.restore();
    placed = [];
    const drawLabel = (p) => { const z = depth(p.at); if (z > 0.2) { const [x, y] = proj(p.at); label(c, x, y, p.name, p.role, 1, p.side, narrow && p.below); } };
    drawLabel(HUB);
    pins.filter((p) => p.office).forEach(drawLabel); // only the two offices are labelled
  }

  // Routes leave the two offices (Can Tho hub, Melbourne head office) one after another and sweep around the world:
  // a new line every STEP seconds, each drawing out slowly, carrying a pulse, lighting its destination, then fading.
  // Many are in flight at once, so the globe reads as permanently connected. Decorative, not a client map.
  const STEP = 1.7, GROW = 4.2, LIFE = 15, FADE = 2.4;
  const ease = (x) => { x = Math.min(1, Math.max(0, x)); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
  const MEL = PLACES.find((p) => p.office);
  const mkLine = (a, b) => ({ type: 'LineString', coordinates: Array.from({ length: 49 }, (_, k) => d3.geoInterpolate(a, b)(k / 48)) });
  const routes = (() => {
    const lead = PLACES.filter((p) => p.primary).map((p) => ({ from: HUB.at, to: p.at, strong: true, office: !!p.office }));
    const far = [...PLACES.filter((p) => !p.primary).map((p) => p.at), ...AMBIENT]
      .filter((ll, k, a) => a.findIndex((m) => m[0] === ll[0] && m[1] === ll[1]) === k);
    // sweep by bearing from the hub so consecutive lines fan around the globe rather than jump about
    const bearing = (o, d) => Math.atan2(d[0] - o[0], d[1] - o[1]);
    far.sort((a, b) => bearing(HUB.at, a) - bearing(HUB.at, b));
    const out = [...lead];
    far.forEach((to, k) => out.push({ from: k % 3 === 2 ? MEL.at : HUB.at, to }));
    return out.map((r) => ({ ...r, line: mkLine(r.from, r.to) }));
  })();
  const LOOP = routes.length * STEP;

  function drawLinks(t) {
    routes.forEach((r, i) => {
      const u = reduce ? GROW + 1 : ((t - i * STEP) % LOOP + LOOP) % LOOP;
      if (!reduce && u > LIFE) return;
      const grow = ease(u / GROW);
      const fade = reduce ? (i < 12 ? 0.7 : 0) : u > LIFE - FADE ? Math.max(0, (LIFE - u) / FADE) : 1;
      if (grow <= 0 || fade <= 0) return;
      const n = Math.max(2, Math.round(48 * grow));
      ctx.save();
      ctx.globalAlpha = fade * (r.strong ? 1 : 0.8);
      ctx.beginPath(); path({ type: 'LineString', coordinates: r.line.coordinates.slice(0, n + 1) });
      ctx.strokeStyle = r.office ? 'rgba(255,255,255,.85)' : r.strong ? 'rgba(79,195,236,.9)' : 'rgba(110,200,236,.5)';
      ctx.lineWidth = r.strong ? 1.2 : 0.8;
      ctx.stroke();
      if (!reduce) {
        // head while drawing; afterwards a slow pulse rides the line
        const k = grow < 1 ? grow : ((u - GROW) / 5) % 1;
        const at = r.line.coordinates[Math.min(48, Math.round(48 * k))];
        if (depth(at) > 0.02) {
          const [x, y] = proj(at);
          ctx.beginPath(); ctx.arc(x, y, r.strong ? 2.4 : 1.7, 0, Math.PI * 2);
          ctx.fillStyle = '#fff'; ctx.shadowColor = 'rgba(79,195,236,.9)'; ctx.shadowBlur = 8; ctx.fill();
          ctx.shadowBlur = 0;
        }
        // arrival: the destination rings once as the line lands
        const since = u - GROW;
        if (since > 0 && since < 1.8 && depth(r.to) > 0.05) {
          const [x, y] = proj(r.to), q = since / 1.8;
          ctx.beginPath(); ctx.arc(x, y, 3 + q * 16, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(160,225,248,${(0.8 * (1 - q)).toFixed(2)})`; ctx.lineWidth = 1; ctx.stroke();
          ctx.beginPath(); ctx.arc(x, y, 2.2, 0, Math.PI * 2); ctx.fillStyle = '#E6F7FD'; ctx.fill();
        }
      }
      ctx.restore();
    });
  }

  function draw(t) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(base, 0, 0);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    // ambient nodes twinkle on their own slow rhythms
    AMBIENT.forEach((ll, i) => {
      const z = depth(ll);
      if (z <= 0.05) return;
      const [x, y] = proj(ll);
      const w = reduce ? 0.6 : 0.5 + 0.5 * Math.sin(t * (0.6 + (i % 5) * 0.12) + i * 1.7);
      ctx.globalAlpha = Math.min(1, z * 1.5) * (0.25 + 0.75 * w);
      ctx.beginPath(); ctx.arc(x, y, 1.6 + w * 0.8, 0, Math.PI * 2); ctx.fillStyle = '#9FDCF3'; ctx.fill();
      if (w > 0.85) { ctx.beginPath(); ctx.arc(x, y, 4 + (w - 0.85) * 40, 0, Math.PI * 2); ctx.strokeStyle = `rgba(79,195,236,${((1 - w) * 3).toFixed(2)})`; ctx.lineWidth = 0.8; ctx.stroke(); }
      ctx.globalAlpha = 1;
    });
    drawLinks(t);
    [...pins, { ...HUB, hub: true, phase: 0 }].forEach((p) => {
      const z = depth(p.at);
      if (z <= 0.05) return;
      const [x, y] = proj(p.at);
      const beat = reduce ? 0.4 : ((t * 0.35 + p.phase) % 1);
      const strong = p.hub || p.primary;
      ctx.beginPath(); ctx.arc(x, y, 3 + beat * (p.hub ? 24 : strong ? 16 : 10), 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(79,195,236,${((strong ? 0.8 : 0.45) * (1 - beat)).toFixed(2)})`; ctx.lineWidth = 1; ctx.stroke();
      ctx.beginPath(); ctx.arc(x, y, p.hub ? 3.8 : strong ? 3 : 2, 0, Math.PI * 2);
      ctx.fillStyle = p.office ? '#fff' : ACC; ctx.fill();
    });
  }

  // Hairline tick + two lines of text; flips side near the right edge, fades in as the pin turns toward us.
  let placed = [];
  const hit = (a) => placed.some((b) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y);
  function label(ctx, x, y, name, role, alpha, prefer = 1, below = false) {
    ctx.font = '500 12.5px Satoshi, sans-serif';
    const nw = ctx.measureText(name).width;
    ctx.font = '400 9.5px "IBM Plex Mono", monospace';
    const w = Math.max(nw, ctx.measureText(role.toUpperCase()).width);
    ctx.font = '500 12.5px Satoshi, sans-serif';
    // try right, left, then drop below; skip if nothing fits
    const tries = (below ? [[-prefer, 22], [prefer, 22], [prefer, -12], [-prefer, -12]] : [[prefer, -12], [-prefer, -12], [prefer, 22], [-prefer, 22]]).filter(([d]) => (d > 0 ? x + 38 + w < W - 8 : x - 38 - w > 8));
    let pick = null;
    for (const [d, oy] of tries) {
      const box = { x: d > 0 ? x + 28 : x - 32 - w, y: y + oy - 12, w: w + 8, h: 32 };
      if (!hit(box)) { pick = [d, oy]; placed.push(box); break; }
    }
    if (!pick) return;
    const [dx, oy] = pick, x1 = x + dx * 12, y1 = y + oy;
    const left = dx < 0;
    ctx.globalAlpha = alpha;
    ctx.beginPath(); ctx.moveTo(x + dx * 4, y + Math.sign(oy) * 4); ctx.lineTo(x1, y1); ctx.lineTo(x1 + dx * 14, y1);
    ctx.strokeStyle = 'rgba(255,255,255,.4)'; ctx.lineWidth = 0.75; ctx.stroke();
    ctx.textAlign = left ? 'right' : 'left';
    const tx = x1 + dx * 20;
    ctx.fillStyle = '#fff'; ctx.fillText(name, tx, y1 + 4);
    ctx.fillStyle = 'rgba(159,179,188,.95)'; ctx.font = '400 9.5px "IBM Plex Mono", monospace'; ctx.fillText(role.toUpperCase(), tx, y1 + 17);
    ctx.textAlign = 'left'; ctx.globalAlpha = 1;
  }

  let raf = 0, on = true, t0 = 0, last = 0;
  function frame(now) {
    raf = 0;
    if (!t0) t0 = now;
    if (now - last >= 40) { last = now; draw((now - t0) / 1000); } // only the pins pulse; 25fps is plenty
    if (on) raf = requestAnimationFrame(frame);
  }

  size(); draw(0);
  new ResizeObserver(() => { size(); draw(0); }).observe(el);
  document.fonts?.ready.then(() => { paintBase(); draw(0); });
  el.classList.add('is-live');
  if (reduce) return;
  new IntersectionObserver(([e]) => { on = e.isIntersecting; if (on && !raf) raf = requestAnimationFrame(frame); }, { threshold: 0.05 }).observe(el);
  raf = requestAnimationFrame(frame);
}
