// Company hero map: Vietnam and Australia only, a pin on each office (Can Tho, Melbourne) and a dashed arc that
// flows from the head office to the development center. Real country shapes from world-atlas (50m), drawn as SVG.
// Libraries load lazily from jsDelivr; until they arrive (or if they fail) the two office labels still show.
import { html } from './dom.js';

const OFFICES = [
  { id: 'cantho', name: 'Can Tho office', sub: 'Vietnam · Development center', at: [105.78, 10.04], side: 1 },
  { id: 'melb', name: 'Main office', sub: 'Melbourne, Australia', at: [144.96, -37.81], side: 1 },
];

export function officeMap() {
  return html`<figure class="omap" data-omap aria-label="PTN Global offices: main office in Melbourne, Australia and development center in Can Tho, Vietnam">
    <svg class="omap-svg" viewBox="0 0 470 540" role="img" aria-hidden="true"></svg>
    <figcaption class="omap-fallback">${OFFICES.map((o) => html`<span><b>${o.name}</b>${o.sub}</span>`)}</figcaption>
  </figure>`;
}

let libs;
const load = () =>
  (libs ||= Promise.all([
    import('https://cdn.jsdelivr.net/npm/d3-geo@3/+esm'),
    import('https://cdn.jsdelivr.net/npm/topojson-client@3/+esm'),
    fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json').then((r) => r.json()),
  ]));

const PIN = 'M0-30c-8.3 0-15 6.6-15 14.8C-15-4.6 0 0 0 0S15-4.6 15-15.2C15-23.4 8.3-30 0-30z';

export async function bindOfficeMap(root) {
  const el = root.querySelector('[data-omap]');
  if (!el) return;
  let d3, topo, world;
  try { [d3, topo, world] = await load(); } catch { return; }
  const all = topo.feature(world, world.objects.countries).features;
  const shapes = all.filter((f) => f.id === '704' || f.id === '036');
  const W = 470, H = 540;
  // frame on Vietnam + mainland Australia and Tasmania (Australia's far southern islands would stretch the canvas)
  const FRAME = { type: 'MultiPoint', coordinates: [[102.1, 23.4], [153.7, -43.7]] };
  const proj = d3.geoMercator().fitExtent([[6, 8], [W - 170, H - 8]], FRAME);
  const path = d3.geoPath(proj);
  const [a, b] = [proj(OFFICES[1].at), proj(OFFICES[0].at)]; // Melbourne -> Can Tho
  // bow the arc west, like a flight path
  const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, dx = b[0] - a[0], dy = b[1] - a[1];
  const c = [mx - dy * 0.28, my + dx * 0.28];
  const arc = `M${a[0]},${a[1]} Q${c[0]},${c[1]} ${b[0]},${b[1] + 6}`;
  const svg = el.querySelector('svg');
  // crop the canvas to the drawing so no empty band is left under Australia
  const [[, y0], [, y1]] = path.bounds(FRAME);
  svg.setAttribute('viewBox', `0 ${Math.floor(y0 - 36)} ${W} ${Math.ceil(y1 - y0 + 48)}`);
  el.style.aspectRatio = `${W} / ${Math.ceil(y1 - y0 + 48)}`;
  svg.innerHTML = `
    <defs><marker id="omap-arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M1 1L8 5L1 9" fill="none" stroke="currentColor" stroke-width="1.6"/></marker></defs>
    <g class="omap-land">${shapes.map((f) => `<path d="${path(f)}"/>`).join('')}</g>
    <path class="omap-arc-bg" d="${arc}"/>
    <path class="omap-arc" d="${arc}" marker-end="url(#omap-arrow)"/>
    ${OFFICES.map((o, i) => {
      const [x, y] = proj(o.at);
      return `<g class="omap-pin" transform="translate(${x.toFixed(1)} ${y.toFixed(1)})" style="--i:${i}">
        <circle class="omap-pulse" r="6"/>
        <path d="${PIN}"/><circle cy="-16" r="5.5" fill="#fff"/>
        <text x="20" y="-20" class="omap-name">${o.name.toUpperCase()}</text>
        <text x="20" y="-2" class="omap-sub">${o.sub}</text>
      </g>`;
    }).join('')}`;
  el.classList.add('is-ready');
}
