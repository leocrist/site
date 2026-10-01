// Hand-built service illustrations, one per service category. Flat, sharp-cornered product scenes in the
// #008FC4 family: white cards with an offset "pop" shadow on a soft blue field. Gentle CSS motion lives in
// wireframe.css (.ill-*), and stops under prefers-reduced-motion.
import { html, raw } from './dom.js';

// Soft palette: hairline blue-grey strokes, accent used sparingly, no black fills.
const INK = '#2B4653', STROKE = '#C3DDE9', A = '#1A9BD0', A2 = '#8FD4EF', T = '#EAF6FB', W = '#FFFFFF', LINE = '#E3EEF3', MUTED = '#9DB2BC';
// Logo green, used as the secondary accent for "done / healthy / live" moments.
const G = '#A7BC4D', G2 = '#D5E1A0';

/** Card with a soft drop shadow (CSS .ill-card). */
const card = (x, y, w, h, { fill = W, stroke = STROKE, sw = 1, cls = '' } = {}) =>
  `<g class="ill-card ${cls}"><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/></g>`;
/** Window chrome: title bar with three squares. */
const chrome = (x, y, w, label = '') =>
  `<line x1="${x}" y1="${y + 26}" x2="${x + w}" y2="${y + 26}" stroke="${STROKE}" stroke-width="1"/>` +
  [0, 1, 2].map((i) => `<rect x="${x + 12 + i * 14}" y="${y + 9}" width="8" height="8" fill="${i ? T : A}" stroke="${STROKE}" stroke-width="1"/>`).join('') +
  (label ? `<text x="${x + w - 12}" y="${y + 17}" text-anchor="end" font-family="IBM Plex Mono, monospace" font-size="9" fill="${MUTED}" letter-spacing=".5">${label}</text>` : '');
const bar = (x, y, w, c = LINE, h = 6) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}"/>`;
const mono = (x, y, t, { size = 10, fill = INK, anchor = 'start', weight = 400 } = {}) =>
  `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="IBM Plex Mono, monospace" font-size="${size}" font-weight="${weight}" fill="${fill}">${t}</text>`;
const sans = (x, y, t, { size = 12, fill = INK, anchor = 'start', weight = 600 } = {}) =>
  `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="Satoshi, sans-serif" font-size="${size}" font-weight="${weight}" fill="${fill}">${t}</text>`;
const check = (x, y, c = G) => `<rect x="${x}" y="${y}" width="14" height="14" fill="${c}"/><path d="M${x + 3.5} ${y + 7.5}l2.6 2.6 4.6-5.4" fill="none" stroke="#fff" stroke-width="1.8"/>`;

const field = (id) => `<defs>
  <linearGradient id="${id}bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F8FCFE"/><stop offset="1" stop-color="#EAF5FA"/></linearGradient>
  <pattern id="${id}dot" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="1.5" r="1.2" fill="rgba(0,143,196,.12)"/></pattern></defs>
  <rect width="600" height="400" fill="url(#${id}bg)"/><rect width="600" height="400" fill="url(#${id}dot)"/>`;

/* 01 Core Application Development: code editor + phone app + component chip */
const core = () => `${field('ill1')}
  ${card(52, 64, 330, 236)}${chrome(52, 64, 330, 'app.tsx')}
  <g transform="translate(72 108)">
    ${mono(0, 8, '01', { size: 9, fill: MUTED })}${bar(26, 2, 44, A)}${bar(76, 2, 70)}${bar(152, 2, 38, G2)}
    ${mono(0, 30, '02', { size: 9, fill: MUTED })}${bar(42, 24, 60)}${bar(108, 24, 96, A2)}
    ${mono(0, 52, '03', { size: 9, fill: MUTED })}${bar(42, 46, 30, A)}${bar(78, 46, 120)}
    ${mono(0, 74, '04', { size: 9, fill: MUTED })}${bar(58, 68, 84)}${bar(148, 68, 40, G)}
    ${mono(0, 96, '05', { size: 9, fill: MUTED })}${bar(58, 90, 50, A2)}${bar(114, 90, 62)}
    ${mono(0, 118, '06', { size: 9, fill: MUTED })}${bar(42, 112, 110)}
    ${mono(0, 140, '07', { size: 9, fill: MUTED })}${bar(26, 134, 40, A)}<rect class="ill-caret" x="72" y="131" width="2" height="12" fill="${A}"/>
  </g>
  ${card(356, 104, 150, 256, { cls: 'ill-float' })}
  <g class="ill-float">
    <rect x="410" y="114" width="42" height="6" fill="${A}"/>
    <rect x="370" y="134" width="122" height="70" fill="${A}"/>
    <circle cx="398" cy="162" r="12" fill="${G2}"/><path d="M430 186l18-22 22 22z" fill="${W}" opacity=".7"/>
    ${sans(370, 224, 'Dashboard', { size: 11 })}${bar(370, 232, 90, LINE, 5)}${bar(370, 242, 64, LINE, 5)}
    <rect x="370" y="258" width="58" height="42" fill="${T}" stroke="${STROKE}" stroke-width="1"/><rect x="434" y="258" width="58" height="42" fill="${W}" stroke="${STROKE}" stroke-width="1"/>
    <rect x="376" y="286" width="20" height="8" fill="${A}"/><rect x="440" y="280" width="30" height="14" fill="${G}"/>
    <rect x="370" y="316" width="122" height="28" fill="${A}"/>${sans(431, 334, 'Continue', { size: 10, fill: W, anchor: 'middle' })}
  </g>
  ${card(420, 50, 118, 40, { fill: G, stroke: G, shadow: 6, cls: 'ill-bob' })}
  <g class="ill-bob">${mono(438, 75, '&lt;/&gt;', { size: 13, fill: '#34410B', weight: 500 })}${mono(474, 74, 'Component', { size: 9, fill: '#34410B' })}</g>`;

/* 02 Emerging Technologies: neural network around an AI core, model card, IoT + chain chips */
const emerging = () => {
  const L = [[120, 110], [120, 200], [120, 290]], M = [[230, 80], [230, 160], [230, 240], [230, 320]], R = [[340, 140], [340, 260]];
  const edges = [...L.flatMap((a) => M.map((b) => [a, b])), ...M.flatMap((a) => R.map((b) => [a, b]))];
  return `${field('ill2')}
  <g stroke="${A}" stroke-width="1" opacity=".45">${edges.map(([a, b]) => `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}"/>`).join('')}</g>
  <g class="ill-flow" stroke="${A}" stroke-width="2" fill="none">${[[L[0], M[1]], [M[1], R[0]], [L[2], M[2]], [M[2], R[1]]].map(([a, b]) => `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}"/>`).join('')}</g>
  ${[...L, ...M, ...R].map(([x, y], i) => `<g class="ill-node" style="animation-delay:${(i * 0.23).toFixed(2)}s"><circle cx="${x}" cy="${y}" r="11" fill="${W}" stroke="${STROKE}" stroke-width="1"/><circle cx="${x}" cy="${y}" r="4.5" fill="${i % 4 === 2 ? G : i % 3 ? A2 : A}"/></g>`).join('')}
  <path d="M340 140L430 200M340 260L430 200" stroke="${A}" stroke-width="1"/>
  ${card(400, 160, 84, 84, { fill: A, stroke: A })}
  <g><rect x="416" y="176" width="52" height="52" fill="none" stroke="${A2}" stroke-width="1"/>
    ${[0, 1, 2, 3].map((k) => `<line x1="${424 + k * 12}" y1="170" x2="${424 + k * 12}" y2="176" stroke="${A2}"/><line x1="${424 + k * 12}" y1="228" x2="${424 + k * 12}" y2="234" stroke="${A2}"/>`).join('')}
    ${sans(442, 208, 'AI', { size: 18, fill: W, anchor: 'middle', weight: 700 })}</g>
  <path class="ill-spark" d="M500 128l5 13 13 5-13 5-5 13-5-13-13-5 13-5z" fill="${A}"/>
  <path class="ill-spark" style="animation-delay:.8s" d="M372 92l3 8 8 3-8 3-3 8-3-8-8-3 8-3z" fill="${G}"/>
  ${card(420, 272, 150, 86, { cls: 'ill-float' })}
  <g class="ill-float">${mono(434, 292, 'MODEL · v2.4', { size: 9, fill: MUTED })}${sans(434, 312, 'Accuracy 96.8%', { size: 12 })}
    <rect x="434" y="324" width="122" height="8" fill="${T}"/><rect class="ill-grow" x="434" y="324" width="118" height="8" fill="${G}"/>${mono(434, 348, 'training complete', { size: 9, fill: '#7F9433' })}</g>
  ${card(40, 332, 112, 40, { shadow: 6 })}${mono(54, 357, 'IoT', { size: 11, fill: A, weight: 500 })}<circle cx="96" cy="352" r="4" fill="${G}"/><circle cx="110" cy="352" r="4" fill="${A}"/><circle cx="124" cy="352" r="4" fill="${T}" stroke="${STROKE}"/>
  ${card(40, 36, 136, 40, { shadow: 6 })}<g fill="none" stroke="${STROKE}" stroke-width="1"><rect x="54" y="48" width="16" height="16"/><rect x="82" y="48" width="16" height="16" fill="${G2}"/><rect x="110" y="48" width="16" height="16"/></g><path d="M70 56h12M98 56h12" stroke="${A}" stroke-width="2"/>${mono(134, 60, 'chain', { size: 9, fill: MUTED })}`;
};

/* 03 Cloud & DevOps: cloud over a server rack, CI/CD loop, deploy status */
const cloud = () => `${field('ill3')}
  <path d="M130 170c-30 0-50-22-50-48 0-27 22-48 50-48 6-32 36-54 70-54 32 0 58 20 67 48 6-2 12-3 18-3 30 0 54 24 54 54s-24 51-54 51z" transform="translate(40 20)" fill="${T}"/>
  <path d="M130 170c-30 0-50-22-50-48 0-27 22-48 50-48 6-32 36-54 70-54 32 0 58 20 67 48 6-2 12-3 18-3 30 0 54 24 54 54s-24 51-54 51z" transform="translate(32 12)" fill="${W}" stroke="${STROKE}" stroke-width="1"/>
  <g transform="translate(150 84)">${[0, 1, 2].map((i) => `<rect x="${i * 46}" y="0" width="38" height="46" fill="${i === 1 ? A : W}" stroke="${STROKE}" stroke-width="1"/>${bar(i * 46 + 7, 10, 24, i === 1 ? 'rgba(255,255,255,.7)' : LINE, 4)}${bar(i * 46 + 7, 20, 16, i === 1 ? 'rgba(255,255,255,.7)' : LINE, 4)}`).join('')}${mono(0, 64, 'k8s · 3 nodes', { size: 9, fill: MUTED })}</g>
  <g stroke="${STROKE}" stroke-width="1" stroke-dasharray="4 4" class="ill-dash"><line x1="218" y1="186" x2="218" y2="236"/></g>
  ${card(120, 236, 196, 128)}
  ${[0, 1, 2].map((i) => `<g transform="translate(136 ${252 + i * 36})"><rect width="164" height="26" fill="${i ? W : T}" stroke="${STROKE}" stroke-width="1"/><circle class="ill-led" style="animation-delay:${i * 0.4}s" cx="14" cy="13" r="4" fill="${i === 2 ? A2 : G}"/>${bar(28, 10, 60, LINE, 5)}${bar(120, 8, 32, LINE, 3)}${bar(120, 15, 32, LINE, 3)}</g>`).join('')}
  <g transform="translate(470 150)">
    <path d="M-60 0c0-26 20-40 40-40s30 20 40 40 20 40 40 40 40-14 40-40-20-40-40-40-30 20-40 40-20 40-40 40-40-14-40-40z" fill="none" stroke="${T}" stroke-width="16"/>
    <path class="ill-loop" d="M-60 0c0-26 20-40 40-40s30 20 40 40 20 40 40 40 40-14 40-40-20-40-40-40-30 20-40 40-20 40-40 40-40-14-40-40z" fill="none" stroke="${A}" stroke-width="3" stroke-dasharray="40 240"/>
    ${mono(-20, 4, 'CI', { size: 12, fill: INK, anchor: 'middle', weight: 500 })}${mono(60, 4, 'CD', { size: 12, fill: INK, anchor: 'middle', weight: 500 })}
    ${['build', 'test', 'release', 'deploy'].map((t, i) => mono([-58, 18, 62, -22][i], [-54, -54, 62, 62][i], t, { size: 9, fill: MUTED, anchor: 'middle' })).join('')}
  </g>
  ${card(372, 272, 190, 64, { cls: 'ill-float' })}
  <g class="ill-float">${check(388, 292)}${sans(412, 304, 'Deployed to production', { size: 12 })}${mono(412, 322, 'main · 2m 14s · #482', { size: 9, fill: MUTED })}</g>`;

/* 04 Testing & QA: test run report, magnifier on a bug, pass-rate bars */
const testing = () => `${field('ill4')}
  ${card(56, 56, 300, 288)}${chrome(56, 56, 300, 'test-run')}
  <g transform="translate(76 104)">
    ${['Login flow', 'Checkout', 'Search', 'Payments API', 'Profile update'].map((t, i) => `<g transform="translate(0 ${i * 36})" class="ill-row" style="animation-delay:${(i * 0.35).toFixed(2)}s">${i === 3 ? `<rect width="14" height="14" fill="${W}" stroke="${A}" stroke-width="1"/><path d="M4 4l6 6M10 4l-6 6" stroke="${A}" stroke-width="1.6"/>` : check(0, 0)}${sans(24, 11, t, { size: 12, weight: 500 })}${mono(260, 11, i === 3 ? 'retry' : `${(0.8 + i * 0.37).toFixed(1)}s`, { size: 9, fill: i === 3 ? A : MUTED, anchor: 'end' })}<line x1="0" y1="24" x2="260" y2="24" stroke="${LINE}"/></g>`).join('')}
  </g>
  <rect x="76" y="300" width="260" height="10" fill="${T}"/><rect class="ill-grow" x="76" y="300" width="208" height="10" fill="${G}"/>${mono(76, 328, '142 passed · 1 flaky · 0 failed', { size: 9, fill: INK })}
  <g class="ill-float">
    ${card(372, 70, 170, 150)}
    ${mono(388, 92, 'PASS RATE', { size: 9, fill: MUTED })}${sans(388, 116, '99.3%', { size: 22, weight: 700 })}
    ${[42, 58, 50, 72, 66, 80, 88].map((h, i) => `<rect x="${390 + i * 20}" y="${204 - h}" width="12" height="${h}" fill="${i === 6 ? G : i === 5 ? G2 : T}" stroke="${STROKE}" stroke-width="1"/>`).join('')}
  </g>
  <g class="ill-scan" transform="translate(430 290)">
    <circle r="54" fill="${W}" stroke="${STROKE}" stroke-width="2"/><circle r="46" fill="${T}" opacity=".6"/>
    <g transform="translate(0 2)"><ellipse rx="14" ry="18" fill="${A}"/><circle cy="-22" r="8" fill="${A}"/>
      <path d="M-14 -6h-12M14 -6h12M-14 6h-12M14 6h12M-12 16l-9 8M12 16l9 8" stroke="${STROKE}" stroke-width="2"/><line x1="0" y1="-18" x2="0" y2="18" stroke="${W}" stroke-width="1"/></g>
    <line x1="38" y1="38" x2="78" y2="78" stroke="${STROKE}" stroke-width="10"/><line x1="38" y1="38" x2="78" y2="78" stroke="${A}" stroke-width="4"/>
  </g>`;

/* 05 Design, Support & Maintenance: design canvas with swatches and pen, uptime card, gear */
const design = () => `${field('ill5')}
  ${card(48, 48, 330, 240)}${chrome(48, 48, 330, 'ui-kit.fig')}
  <g transform="translate(64 90)">
    <rect width="56" height="182" fill="${T}"/>${[0, 1, 2, 3, 4].map((i) => bar(8, 12 + i * 22, 40, i === 1 ? A : 'rgba(12,20,24,.18)', 5)).join('')}
    <g transform="translate(70 0)">
      <rect width="220" height="70" fill="${W}" stroke="${A}" stroke-width="1" stroke-dasharray="4 3"/>
      ${bar(14, 16, 110, '#B7DAE9', 9)}${bar(14, 34, 150, LINE, 5)}${bar(14, 46, 120, LINE, 5)}<rect x="160" y="16" width="46" height="40" fill="${A2}"/>
      ${[0, 1, 2].map((i) => `<rect x="${i * 76}" y="84" width="68" height="54" fill="${W}" stroke="${STROKE}" stroke-width="1"/><rect x="${i * 76 + 8}" y="92" width="18" height="18" fill="${[T, A, G][i]}"/>${bar(i * 76 + 8, 118, 46, LINE, 4)}`).join('')}
      <rect x="0" y="150" width="96" height="28" fill="${A}"/>${bar(18, 162, 60, 'rgba(255,255,255,.75)', 4)}
      ${[-4, 224, -4, 224].map((x, i) => `<rect x="${x}" y="${i < 2 ? -4 : 66}" width="8" height="8" fill="${W}" stroke="${A}" stroke-width="1"/>`).join('')}
    </g>
  </g>
  <g transform="translate(330 250)"><g class="ill-bob"><path d="M0 0l40-40 14 14-40 40-18 4z" fill="${W}" stroke="${STROKE}" stroke-width="1"/><path d="M40-40l14 14 8-8-14-14z" fill="${A}" stroke="${STROKE}" stroke-width="1"/><circle cx="4" cy="14" r="2.5" fill="${A}"/></g></g>
  <g transform="translate(64 312)">${[A, A2, G, G2, W].map((c, i) => `<rect x="${i * 34}" y="0" width="26" height="26" fill="${c}" stroke="${STROKE}" stroke-width="1"/>`).join('')}${mono(176, 18, '#008FC4', { size: 10, fill: MUTED })}</g>
  ${card(402, 110, 160, 118, { cls: 'ill-float' })}
  <g class="ill-float">${mono(418, 132, 'UPTIME · 90 DAYS', { size: 9, fill: MUTED })}${sans(418, 158, '99.98%', { size: 22, weight: 700 })}
    <polyline points="418,206 440,198 460,202 480,188 500,192 520,178 546,172" fill="none" stroke="${A}" stroke-width="2"/>
    ${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => `<rect x="${418 + i * 10}" y="212" width="7" height="8" fill="${i === 8 ? A2 : G}" opacity="${i === 8 ? 1 : 0.8}"/>`).join('')}</g>
  <g transform="translate(490 318)"><g class="ill-spin">${[0, 45, 90, 135, 180, 225, 270, 315].map((d) => `<rect x="-6" y="-38" width="12" height="14" fill="${A2}" transform="rotate(${d})"/>`).join('')}<circle r="29" fill="${A2}"/><circle r="22" fill="${W}"/><circle r="9" fill="${G}"/></g></g>
  ${card(402, 250, 50, 32, { shadow: 4 })}${mono(427, 271, 'v3.2', { size: 10, fill: A, anchor: 'middle', weight: 500 })}`;

/* 00 All services: the five practices as a tile board, one tile per category, plus the catalogue count */
const overview = () => {
  const tiles = [
    [60, 60, (x, y) => `${bar(x + 18, y + 56, 60, A)}${bar(x + 18, y + 70, 90)}${bar(x + 30, y + 84, 70, G2)}${mono(x + 18, y + 34, '&lt;/&gt;', { size: 14, fill: A, weight: 500 })}`],
    [230, 60, (x, y) => `${[[30, 50], [30, 90], [80, 40], [80, 70], [80, 100], [128, 70]].map(([dx, dy], i) => `<circle cx="${x + dx}" cy="${y + dy}" r="6" fill="${i === 5 ? G : i % 2 ? A2 : A}"/>`).join('')}<g stroke="${A}" stroke-width="1" opacity=".5"><path d="M${x + 30} ${y + 50}L${x + 80} ${y + 40}M${x + 30} ${y + 50}L${x + 80} ${y + 70}M${x + 30} ${y + 90}L${x + 80} ${y + 100}M${x + 30} ${y + 90}L${x + 80} ${y + 70}M${x + 80} ${y + 40}L${x + 128} ${y + 70}M${x + 80} ${y + 100}L${x + 128} ${y + 70}"/></g>`],
    [400, 60, (x, y) => `<path d="M${x + 50} ${y + 96}c-16 0-26-12-26-25s11-25 26-25c3-17 19-28 36-28 17 0 30 10 35 25 3-1 6-2 9-2 16 0 28 13 28 28s-12 27-28 27z" fill="${T}" stroke="${STROKE}"/><rect x="${x + 66}" y="${y + 58}" width="16" height="22" fill="${A}"/><rect x="${x + 88}" y="${y + 58}" width="16" height="22" fill="${W}" stroke="${STROKE}"/><circle cx="${x + 74}" cy="${y + 74}" r="2" fill="${G}"/>`],
    [60, 210, (x, y) => `${[0, 1, 2].map((i) => `${check(x + 18, y + 34 + i * 26, i === 2 ? A : G)}${bar(x + 42, y + 38 + i * 26, 80 - i * 14)}`).join('')}`],
    [230, 210, (x, y) => `${[A, A2, G, G2].map((c, i) => `<rect x="${x + 18 + i * 30}" y="${y + 84}" width="22" height="22" fill="${c}"/>`).join('')}<path d="M${x + 60} ${y + 70}l40-40 12 12-40 40-16 4z" fill="${W}" stroke="${STROKE}"/><path d="M${x + 100} ${y + 30}l12 12 7-7-12-12z" fill="${A}"/>`],
  ];
  return `${field('ill0')}
  ${tiles.map(([x, y, draw], i) => `${card(x, y, 150, 130, { cls: i % 2 ? 'ill-float' : '' })}<g class="${i % 2 ? 'ill-float' : ''}">${draw(x, y)}</g>`).join('')}
  ${card(400, 210, 150, 130, { fill: G, stroke: G, cls: 'ill-bob' })}
  <g class="ill-bob">${sans(418, 262, '22', { size: 30, fill: '#34410B', weight: 700 })}${mono(418, 284, 'SERVICES', { size: 10, fill: '#34410B', weight: 500 })}${mono(418, 300, '5 PRACTICES', { size: 9, fill: '#4F5F1B' })}
    <path d="M512 318h18M524 312l6 6-6 6" fill="none" stroke="#34410B" stroke-width="1.6"/></g>`;
};

const SCENES = [core, emerging, cloud, testing, design];

/** Illustration for service category index `i` (0-based, Website Structure order). */
let uid = 0;
export function serviceIllustration(i, label) {
  // SVG ids are document-global: suffix each instance so a copy inside a hidden menu never owns the gradient.
  const n = ++uid, scene = SCENES[i % SCENES.length]().replace(/\b(ill\d)(bg|dot)\b/g, `$1$2-${n}`);
  return html`<div class="ill" role="img" aria-label="${label || 'Service illustration'}">${raw(`<svg viewBox="0 0 600 400" preserveAspectRatio="xMidYMid meet" aria-hidden="true">${scene}</svg>`)}</div>`;
}

/** Overview illustration for the "All services" entry points. */
export function servicesOverviewIllustration(label = 'All services') {
  const n = ++uid, scene = overview().replace(/\b(ill\d)(bg|dot)\b/g, `$1$2-${n}`);
  return html`<div class="ill" role="img" aria-label="${label}">${raw(`<svg viewBox="0 0 600 400" preserveAspectRatio="xMidYMid meet" aria-hidden="true">${scene}</svg>`)}</div>`;
}
