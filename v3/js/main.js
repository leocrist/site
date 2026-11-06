// PTN Global v3. Progressive enhancement: every page reads fine without JS.
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

/* Header dropdowns (disclosure) */
const drops = $$('[data-drop]');
const closeDrops = except => drops.forEach(b => { if (b !== except) { b.setAttribute('aria-expanded', 'false'); $('#' + b.dataset.drop).hidden = true; } });
drops.forEach(btn => {
  const panel = $('#' + btn.dataset.drop), li = btn.parentElement;
  btn.addEventListener('click', () => { const open = btn.getAttribute('aria-expanded') !== 'true'; closeDrops(btn); btn.setAttribute('aria-expanded', String(open)); panel.hidden = !open; });
  li.addEventListener('keydown', e => { if (e.key === 'Escape' && !panel.hidden) { closeDrops(); btn.focus(); } });
  li.addEventListener('focusout', e => { if (!li.contains(e.relatedTarget)) { btn.setAttribute('aria-expanded', 'false'); panel.hidden = true; } });
});
document.addEventListener('click', e => { if (!e.target.closest('.menu > li')) closeDrops(); });

/* Mobile navigation */
const burger = $('.burger'), mnav = $('#mnav');
if (burger && mnav) {
  const set = open => {
    burger.setAttribute('aria-expanded', String(open)); mnav.hidden = !open; document.body.classList.toggle('menu-open', open);
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    $('.i-open', burger).style.display = open ? 'none' : ''; $('.i-close', burger).style.display = open ? '' : 'none';
  };
  burger.addEventListener('click', () => set(burger.getAttribute('aria-expanded') !== 'true'));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !mnav.hidden) { set(false); burger.focus(); } });
  matchMedia('(min-width: 1081px)').addEventListener('change', e => e.matches && set(false));
}

/* Tabs (APG pattern, horizontal or vertical) */
const tabsets = $$('[role="tablist"]').map(list => {
  const tabs = $$('[role="tab"]', list);
  const select = (tab, focus) => {
    tabs.forEach(t => { const on = t === tab; t.setAttribute('aria-selected', String(on)); t.tabIndex = on ? 0 : -1; $('#' + t.getAttribute('aria-controls')).hidden = !on; });
    if (focus) tab.focus();
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => select(t));
    t.addEventListener('keydown', e => {
      const k = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
      if (k) { e.preventDefault(); select(tabs[(i + k + tabs.length) % tabs.length], true); }
      if (e.key === 'Home') { e.preventDefault(); select(tabs[0], true); }
      if (e.key === 'End') { e.preventDefault(); select(tabs[tabs.length - 1], true); }
    });
  });
  return { tabs, select };
});
// Deep link: #panel-id opens the matching tab
const openFromHash = () => {
  const id = location.hash.slice(1); if (!id) return;
  for (const ts of tabsets) { const t = ts.tabs.find(x => x.getAttribute('aria-controls') === id || x.dataset.hash === id); if (t) { ts.select(t); t.scrollIntoView({ block: 'center' }); } }
};
openFromHash(); addEventListener('hashchange', openFromHash);

/* Toggle-button filters: [data-filter] buttons filter [data-cats] items inside [data-filter-scope] */
$$('[data-filter]').forEach(bar => {
  const scope = $(bar.dataset.filter), btns = $$('button', bar), items = $$('[data-cats]', scope), status = $(bar.dataset.status || 'x-none');
  const apply = v => {
    btns.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.value === v)));
    let n = 0; items.forEach(it => { const ok = v === 'all' || it.dataset.cats.split('|').includes(v); it.hidden = !ok; if (ok) n++; });
    if (status) status.textContent = `Showing ${n} of ${items.length}`;
  };
  btns.forEach(b => b.addEventListener('click', () => apply(b.dataset.value)));
  const start = new URLSearchParams(location.search).get(bar.dataset.param || 'cat');
  if (start && btns.some(b => b.dataset.value === start)) apply(start);
});

/* Searchable lists: [data-search] input + optional selects [data-key] filter [data-item] in a list */
$$('[data-search-scope]').forEach(scope => {
  const list = $(scope.dataset.searchScope), items = $$('[data-item]', list), q = $('[data-search]', scope), sels = $$('select[data-key]', scope);
  const count = $(scope.dataset.count || 'x-none'), empty = $(scope.dataset.empty || 'x-none'), catBtns = $$('[data-cat]', scope);
  let cat = 'all';
  const run = () => {
    const term = (q?.value || '').trim().toLowerCase(); let n = 0;
    items.forEach(it => {
      const ok = (!term || it.textContent.toLowerCase().includes(term)) && sels.every(s => !s.value || (it.dataset[s.dataset.key] || '').split('|').includes(s.value)) && (cat === 'all' || it.dataset.type === cat);
      it.hidden = !ok; if (ok) n++;
    });
    if (count) count.textContent = `${n} ${count.dataset.noun || 'result'}${n === 1 ? '' : 's'}`;
    if (empty) empty.hidden = n > 0;
  };
  q?.addEventListener('input', run); sels.forEach(s => s.addEventListener('change', run));
  catBtns.forEach(b => b.addEventListener('click', () => { cat = b.dataset.cat; catBtns.forEach(x => x.setAttribute('aria-pressed', String(x === b))); run(); }));
  $$('[data-reset]', scope.parentElement).forEach(b => b.addEventListener('click', () => { if (q) q.value = ''; sels.forEach(s => (s.value = '')); cat = 'all'; catBtns.forEach((x, i) => x.setAttribute('aria-pressed', String(i === 0))); run(); q?.focus(); }));
  const p = new URLSearchParams(location.search);
  sels.forEach(s => { const v = p.get(s.dataset.key); if (v) s.value = v; });
  const pc = p.get('cat'); if (pc) { const b = catBtns.find(x => x.dataset.cat === pc); if (b) { cat = pc; catBtns.forEach(x => x.setAttribute('aria-pressed', String(x === b))); } }
  run();
});

/* Live clocks on the office map */
const clocks = $$('[data-clock]');
if (clocks.length) {
  const fmt = tz => new Intl.DateTimeFormat('en-GB', { timeZone: tz, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(new Date());
  const tick = () => clocks.forEach(c => { c.textContent = fmt(c.dataset.clock); });
  tick(); setInterval(tick, 30000);
}

/* Form helpers */
const validators = {
  required: v => v.trim() ? '' : 'This field is required.',
  email: v => !v.trim() ? 'Enter your email address.' : /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'Enter an email in the format name@company.com.',
  url: v => !v.trim() || /^https?:\/\/\S+\.\S+/.test(v.trim()) ? '' : 'Enter a full URL starting with https://',
};
const checkField = el => {
  const f = el.closest('.field'); if (!f) return true;
  let msg = '';
  if (el.type === 'radio') { const any = $$(`input[name="${el.name}"]`).some(r => r.checked); msg = any || !el.required ? '' : 'Choose one option.'; }
  else if (el.type === 'file') { msg = el.required && !el.files.length ? 'Attach your CV as a PDF.' : el.files.length && !/\.pdf$/i.test(el.files[0].name) ? 'Upload a PDF file.' : ''; }
  else if (el.type === 'email') msg = el.required || el.value ? validators.email(el.value) : '';
  else if (el.type === 'url') msg = validators.url(el.value);
  else if (el.required) msg = el.tagName === 'SELECT' && !el.value ? 'Choose an option.' : validators.required(el.value);
  f.classList.toggle('has-error', !!msg); el.setAttribute('aria-invalid', String(!!msg));
  const e = $('.err', f); if (e) e.textContent = msg;
  return !msg;
};
const fieldsIn = root => $$('input, select, textarea', root).filter(el => el.closest('.field') && el.type !== 'checkbox' && (el.type !== 'radio' || el === $(`input[name="${el.name}"]`, root)));
const validate = root => { const bad = fieldsIn(root).filter(el => !checkField(el)); if (bad.length) bad[0].focus(); return bad.length === 0; };
// Errors appear on Continue/Submit and clear while the user types. No blur validation: removing an
// error message on blur shifts the layout under the pointer and makes the next click miss.
$$('form[data-validate] input, form[data-validate] select, form[data-validate] textarea').forEach(el => {
  const recheck = () => { if (el.closest('.field')?.classList.contains('has-error')) checkField(el); };
  el.addEventListener('input', recheck); el.addEventListener('change', recheck);
});

/* Multi-step contact form */
const steps = $('#lead');
if (steps) {
  const panes = $$('[data-step]', steps), marks = $$('.stepper li', steps), status = $('#lead-status');
  let i = 0;
  const show = n => {
    i = n; panes.forEach((p, k) => (p.hidden = k !== n));
    marks.forEach((m, k) => { m.toggleAttribute('aria-current', k === n); if (k === n) m.setAttribute('aria-current', 'step'); m.classList.toggle('done', k < n); });
    $('#lead-back').hidden = n === 0; $('#lead-next').textContent = n === panes.length - 1 ? 'Send request' : 'Continue';
    if (n === panes.length - 1) {
      const data = new FormData(steps); const rows = [];
      const label = { need: 'Your need', area: 'Service area', tech: 'Technology', size: 'Team size', model: 'Engagement model', name: 'Name', email: 'Work email', company: 'Company', country: 'Country', details: 'Project details' };
      Object.keys(label).forEach(k => { const v = data.getAll(k).filter(Boolean).join(', '); if (v) rows.push(`<div><dt>${label[k]}</dt><dd>${v.replace(/[<>&]/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]))}</dd></div>`); });
      $('#lead-summary').innerHTML = rows.join('');
    }
    panes[n].querySelector('input, select, textarea, h2')?.focus({ preventScroll: true });
  };
  $('#lead-next').addEventListener('click', () => {
    if (i < panes.length - 1) { if (validate(panes[i])) show(i + 1); return; }
    status.hidden = false; status.className = 'status status--ok';
    status.textContent = 'Prototype: your request was validated but not sent. Connect this form to the CRM before launch.'; status.focus();
  });
  $('#lead-back').addEventListener('click', () => show(Math.max(0, i - 1)));
  const p = new URLSearchParams(location.search);
  if (p.get('need')) { const r = $(`input[name="need"][value="${CSS.escape(p.get('need'))}"]`, steps); if (r) r.checked = true; }
  if (p.get('model')) { const s = $('#l-model'); if (s) s.value = p.get('model'); }
  if (p.get('area')) { const s = $('#l-area'); if (s) s.value = p.get('area'); }
  show(0);
}

/* Single-step validated forms (job application) */
$$('form[data-validate]:not(#lead)').forEach(form => form.addEventListener('submit', e => {
  e.preventDefault();
  const status = $('[data-status]', form);
  if (!validate(form)) { status.hidden = false; status.className = 'status status--err'; status.textContent = 'Please fix the highlighted fields.'; return; }
  status.hidden = false; status.className = 'status status--ok'; status.textContent = 'Prototype: your application was validated but not sent. Connect this form to the HR inbox before launch.'; status.focus();
}));
