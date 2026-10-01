// Generated placeholder art: deterministic SVG compositions (waves, networks, halftone, circuits, orbits, horizon grids)
// in the #008FC4 family. They stand in for photography until PTN supplies its own; every piece carries a tag saying what goes there.
import { html, raw } from './dom.js';

const hash = (s) => { let h = 2166136261; for (const c of String(s)) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return h >>> 0; };
const rng = (seed) => { let a = hash(seed); return () => ((a = Math.imul(a ^ (a >>> 15), a | 1) ^ (a + Math.imul(a ^ (a >>> 7), a | 61)), ((a ^ (a >>> 14)) >>> 0) / 4294967296)); };
const f = (n) => Math.round(n * 10) / 10;

const TONES = {
  night: { bg: ['#0C1418', '#0F2630'], ink: '#4FC3EC', hi: '#FFFFFF', dim: 'rgba(79,195,236,.16)' },
  deep: { bg: ['#004E6B', '#008FC4'], ink: '#BFEAFA', hi: '#FFFFFF', dim: 'rgba(255,255,255,.14)' },
  paper: { bg: ['#E6F4FA', '#C9E9F6'], ink: '#008FC4', hi: '#003A50', dim: 'rgba(0,143,196,.16)' },
};

const V = {
  wave(r, W, H, t) {
    const n = 22, out = [];
    const ph = r() * 6, amp = H * (0.08 + r() * 0.06), freq = 1.4 + r() * 1.2;
    for (let i = 0; i < n; i++) {
      const y0 = H * 0.2 + (H * 0.65 * i) / n, pts = [];
      for (let x = 0; x <= W; x += W / 60) {
        const k = x / W;
        pts.push(`${f(x)},${f(y0 + Math.sin(k * Math.PI * freq + ph + i * 0.18) * amp * (0.4 + k) + Math.sin(k * 9 + i) * 4)}`);
      }
      out.push(`<polyline points="${pts.join(' ')}" fill="none" stroke="${i % 7 === 3 ? t.hi : t.ink}" stroke-width="${i % 7 === 3 ? 1.6 : 1}" opacity="${f(0.25 + (i / n) * 0.6)}"/>`);
    }
    for (let i = 0; i < 5; i++) out.push(`<circle cx="${f(W * (0.2 + r() * 0.7))}" cy="${f(H * (0.3 + r() * 0.5))}" r="3" fill="${t.hi}"/>`);
    return out.join('');
  },
  mesh(r, W, H, t) {
    const pts = Array.from({ length: 34 }, () => [W * r(), H * r()]), out = [];
    const d = Math.min(W, H) * 0.34;
    pts.forEach((a, i) => pts.slice(i + 1).forEach((b) => {
      const l = Math.hypot(a[0] - b[0], a[1] - b[1]);
      if (l < d) out.push(`<line x1="${f(a[0])}" y1="${f(a[1])}" x2="${f(b[0])}" y2="${f(b[1])}" stroke="${t.ink}" stroke-width="1" opacity="${f(0.7 * (1 - l / d))}"/>`);
    }));
    pts.forEach((p, i) => out.push(i % 6 ? `<circle cx="${f(p[0])}" cy="${f(p[1])}" r="2.5" fill="${t.ink}"/>` : `<circle cx="${f(p[0])}" cy="${f(p[1])}" r="9" fill="none" stroke="${t.hi}" opacity=".7"/><circle cx="${f(p[0])}" cy="${f(p[1])}" r="3.5" fill="${t.hi}"/>`));
    return out.join('');
  },
  dots(r, W, H, t) {
    const s = 18, cx = W * (0.3 + r() * 0.4), cy = H * (0.3 + r() * 0.4), R = Math.hypot(W, H) * 0.55, out = [];
    for (let y = s / 2; y < H; y += s) for (let x = s / 2; x < W; x += s) {
      const k = 1 - Math.hypot(x - cx, y - cy) / R;
      if (k > 0.05) out.push(`<circle cx="${f(x)}" cy="${f(y)}" r="${f(Math.max(0.6, k * k * 7))}"/>`);
    }
    return `<g fill="${t.ink}">${out.join('')}</g><circle cx="${f(cx)}" cy="${f(cy)}" r="${f(R * 0.16)}" fill="none" stroke="${t.hi}" stroke-width="1.2"/>`;
  },
  circuit(r, W, H, t) {
    const g = 32, out = [];
    for (let i = 0; i < 26; i++) {
      let x = Math.round((r() * W) / g) * g, y = Math.round((r() * H) / g) * g;
      const pts = [[x, y]];
      for (let s = 0; s < 3 + (r() * 4 | 0); s++) {
        if (s % 2) y += (r() > 0.5 ? 1 : -1) * g * (1 + (r() * 3 | 0)); else x += g * (1 + (r() * 4 | 0));
        pts.push([x, y]);
      }
      const hi = i % 8 === 0;
      out.push(`<polyline points="${pts.map((p) => p.join(',')).join(' ')}" fill="none" stroke="${hi ? t.hi : t.ink}" stroke-width="${hi ? 1.8 : 1.2}" opacity="${hi ? 0.95 : 0.55}"/>`);
      out.push(`<rect x="${pts[0][0] - 4}" y="${pts[0][1] - 4}" width="8" height="8" fill="none" stroke="${t.ink}"/><circle cx="${x}" cy="${y}" r="3.5" fill="${hi ? t.hi : t.ink}"/>`);
    }
    const cw = W * 0.2, ch = cw * 0.7, cx = W * (0.35 + r() * 0.3), cy = H * (0.35 + r() * 0.3);
    out.push(`<rect x="${f(cx - cw / 2)}" y="${f(cy - ch / 2)}" width="${f(cw)}" height="${f(ch)}" fill="${t.bg[0]}" stroke="${t.hi}" stroke-width="1.5"/>`);
    for (let k = 1; k < 8; k++) out.push(`<line x1="${f(cx - cw / 2 + (cw * k) / 8)}" y1="${f(cy - ch / 2 - 10)}" x2="${f(cx - cw / 2 + (cw * k) / 8)}" y2="${f(cy - ch / 2)}" stroke="${t.hi}"/><line x1="${f(cx - cw / 2 + (cw * k) / 8)}" y1="${f(cy + ch / 2)}" x2="${f(cx - cw / 2 + (cw * k) / 8)}" y2="${f(cy + ch / 2 + 10)}" stroke="${t.hi}"/>`);
    return out.join('');
  },
  orbit(r, W, H, t) {
    const cx = W * (0.55 + r() * 0.25), cy = H * (0.45 + r() * 0.2), out = [];
    for (let i = 1; i <= 9; i++) {
      const R = Math.min(W, H) * 0.08 * i * 1.15, a0 = r() * Math.PI * 2, a1 = a0 + 0.6 + r() * 1.6;
      out.push(`<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(R)}" fill="none" stroke="${t.ink}" opacity=".28"/>`);
      out.push(`<path d="M${f(cx + R * Math.cos(a0))},${f(cy + R * Math.sin(a0))} A${f(R)},${f(R)} 0 0 1 ${f(cx + R * Math.cos(a1))},${f(cy + R * Math.sin(a1))}" fill="none" stroke="${i % 3 ? t.ink : t.hi}" stroke-width="2"/>`);
      out.push(`<circle cx="${f(cx + R * Math.cos(a1))}" cy="${f(cy + R * Math.sin(a1))}" r="3.5" fill="${t.hi}"/>`);
    }
    return out.join('') + `<circle cx="${f(cx)}" cy="${f(cy)}" r="7" fill="${t.hi}"/>`;
  },
  horizon(r, W, H, t) {
    const hz = H * (0.42 + r() * 0.1), vx = W * (0.4 + r() * 0.2), out = [];
    for (let i = -14; i <= 14; i++) out.push(`<line x1="${f(vx)}" y1="${f(hz)}" x2="${f(vx + i * W * 0.12)}" y2="${f(H)}" stroke="${t.ink}" opacity=".45"/>`);
    for (let k = 1; k < 12; k++) { const y = hz + (H - hz) * Math.pow(k / 11, 2.2); out.push(`<line x1="0" y1="${f(y)}" x2="${W}" y2="${f(y)}" stroke="${t.ink}" opacity="${f(0.15 + k * 0.05)}"/>`); }
    out.push(`<line x1="0" y1="${f(hz)}" x2="${W}" y2="${f(hz)}" stroke="${t.hi}" stroke-width="1.4"/>`);
    const sr = H * 0.22;
    out.push(`<circle cx="${f(vx)}" cy="${f(hz)}" r="${f(sr)}" fill="url(#${t.id}s)"/>`);
    for (let i = 0; i < 40; i++) out.push(`<circle cx="${f(r() * W)}" cy="${f(r() * hz * 0.9)}" r="${f(0.6 + r() * 1.2)}" fill="${t.hi}" opacity="${f(0.3 + r() * 0.6)}"/>`);
    return out.join('');
  },
};
export const VARIANTS = Object.keys(V);

/** Inline SVG artwork. `tag` names the real image that belongs here. */
export function art(seed, { variant, tone, w = 1200, h = 800, tag = '', cls = '' } = {}) {
  const r = rng(seed);
  const vName = variant || VARIANTS[hash(seed) % VARIANTS.length];
  const tName = tone || ['night', 'deep', 'paper'][hash(`${seed}t`) % 3];
  const t = { ...TONES[tName], id: `a${hash(seed).toString(36)}` };
  const W = 800, H = f((800 * h) / w), id = `a${hash(seed).toString(36)}`;
  const svg = `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs>
    <linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${t.bg[0]}"/><stop offset="1" stop-color="${t.bg[1]}"/></linearGradient>
    <radialGradient id="${id}s"><stop offset="0" stop-color="${tName === 'paper' ? t.ink : t.hi}" stop-opacity=".55"/><stop offset="1" stop-color="${t.ink}" stop-opacity="0"/></radialGradient>
    <pattern id="${id}g" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="${t.dim}"/></pattern></defs>
    <rect width="${W}" height="${H}" fill="url(#${id})"/><rect width="${W}" height="${H}" fill="url(#${id}g)"/>${V[vName](r, W, H, t)}</svg>`;
  return html`<div class="art art--${tName} ${cls}" style="aspect-ratio:${w}/${h}" role="img" aria-label="${tag ? `Placeholder artwork for: ${tag}` : 'Placeholder artwork'}">${raw(svg)}${tag ? html`<span class="art-tag">${tag}</span>` : ''}</div>`;
}
