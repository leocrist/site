// Boot: load docs.json, render the route, attach behaviours, run the viewer bar.
import { parseRoute, ROUTES, href } from './router.js';
import { PAGES, ACTIVE_MENU } from './pages.js';
import { nav, footer, dialogs } from './sections.js';
import { html, icon } from './dom.js';
import { bind } from './behaviors.js';

const app = document.getElementById('app');
document.documentElement.classList.add('js');
let docs;
let annot = false;
try { annot = localStorage.getItem('ptn-annot') === '1'; } catch { /* storage blocked */ }

function viewer(current) {
  return html`<div class="viewer" role="region" aria-label="Wireframe viewer">
    <label for="route-pick">Template</label>
    <select id="route-pick" data-route-pick>${ROUTES.map((r) => html`<option value="${href(r.name, r.name === 'service' ? { slug: 'custom-software-development' } : {})}"${r.name === current ? ' selected' : ''}>${r.group === r.label ? r.label : `${r.group} · ${r.label}`}</option>`)}</select>
    <button type="button" data-annot-toggle aria-pressed="${annot}">${icon('push-pin')}<span>Notes</span></button>
    <a href="#/" aria-label="Site map">${icon('tree-structure')}</a>
  </div>`;
}

function setAnnot(v) {
  annot = v;
  document.body.classList.toggle('annot', v);
  document.querySelectorAll('[data-annot-toggle]').forEach((b) => {
    b.setAttribute('aria-pressed', String(v));
    const s = b.querySelector('span');
    if (s && b.closest('.viewer') == null) s.textContent = v ? 'Hide annotations' : 'Show annotations';
  });
  try { localStorage.setItem('ptn-annot', v ? '1' : '0'); } catch { /* storage blocked */ }
}

function render() {
  const { name, params } = parseRoute(location.hash);
  const page = PAGES[name] || PAGES.index;
  let body;
  try {
    body = page(docs, params);
  } catch (err) {
    console.error(err);
    body = html`<section class="s"><div class="w"><h1 class="display display--2">This template failed to render.</h1><p class="lead">${String(err.message)}</p></div></section>`;
  }
  app.innerHTML = `${nav(docs.structure, ACTIVE_MENU[name])}<main id="main" tabindex="-1">${body}</main>${footer(docs.structure)}${dialogs()}${viewer(name)}`;
  const label = ROUTES.find((r) => r.name === name)?.label || 'Site map';
  document.title = `${label} · PTN Global wireframe`;
  bind(app);
  app.querySelectorAll('[data-annot-toggle]').forEach((b) => b.addEventListener('click', () => setAnnot(!annot)));
  app.querySelector('[data-route-pick]').addEventListener('change', (e) => (location.hash = e.target.value));
  setAnnot(annot);

  const target = params.at && document.getElementById(params.at);
  if (target) requestAnimationFrame(() => target.scrollIntoView({ block: 'start' }));
  else window.scrollTo(0, 0);
  if (render.count++) app.querySelector('h1')?.setAttribute('tabindex', '-1'), app.querySelector('h1')?.focus({ preventScroll: true });
}
render.count = 0;

async function boot() {
  try {
    docs = await (await fetch('data/docs.json')).json();
  } catch {
    app.innerHTML = '<p class="boot">Could not load data/docs.json. Serve the project over HTTP (python3 -m http.server) and run node wireframe/scripts/parse-docs.mjs.</p>';
    return;
  }
  window.addEventListener('hashchange', render);
  render();
}

boot();
