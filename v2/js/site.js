// PTN Global v2 — progressive enhancement. Every page is readable without JS.
document.documentElement.classList.remove('no-js');
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

/* Header shadow on scroll */
const header = $('.site-header');
const onScroll = () => header && header.classList.toggle('is-scrolled', window.scrollY > 8);
onScroll(); addEventListener('scroll', onScroll, { passive: true });

/* Desktop flyouts (disclosure pattern) */
const flyBtns = $$('[data-flyout]');
const closeAll = (except) => flyBtns.forEach(b => { if (b !== except) { b.setAttribute('aria-expanded', 'false'); $('#' + b.dataset.flyout).hidden = true; } });
flyBtns.forEach(btn => {
  const panel = $('#' + btn.dataset.flyout);
  btn.addEventListener('click', () => {
    const open = btn.getAttribute('aria-expanded') !== 'true';
    closeAll(btn); btn.setAttribute('aria-expanded', String(open)); panel.hidden = !open;
  });
  btn.parentElement.addEventListener('keydown', e => { if (e.key === 'Escape' && !panel.hidden) { closeAll(); btn.focus(); } });
  btn.parentElement.addEventListener('focusout', e => { if (!btn.parentElement.contains(e.relatedTarget)) { btn.setAttribute('aria-expanded', 'false'); panel.hidden = true; } });
});
document.addEventListener('click', e => { if (!e.target.closest('.nav__item')) closeAll(); });

/* Mobile menu */
const toggle = $('.nav__toggle'), menu = $('#mobile-menu');
if (toggle && menu) {
  const set = open => {
    toggle.setAttribute('aria-expanded', String(open)); menu.hidden = !open;
    document.body.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    $('.i-open', toggle).style.display = open ? 'none' : '';
    $('.i-close', toggle).style.display = open ? '' : 'none';
  };
  toggle.addEventListener('click', () => set(toggle.getAttribute('aria-expanded') !== 'true'));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !menu.hidden) { set(false); toggle.focus(); } });
  matchMedia('(min-width: 1024px)').addEventListener('change', e => e.matches && set(false));
}

/* Tabs (ARIA tabs with arrow keys) */
$$('[role="tablist"]').forEach(list => {
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
});

/* SDLC model: accordion steps drive the visual card */
$$('[data-model]').forEach(model => {
  const steps = $$('.step button', model);
  const card = $('.model__card', model);
  const paint = btn => {
    const d = btn.dataset;
    card.innerHTML = `<p class="eyebrow">Stage ${d.n} · ${d.tag}</p><h3>${d.title}</h3><p>${d.body}</p><ul>${d.points.split('|').map(p => `<li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><path d="m5 12 5 5 9-10"/></svg>${p}</li>`).join('')}</ul>`;
  };
  steps.forEach(btn => btn.addEventListener('click', () => {
    steps.forEach(b => b.setAttribute('aria-expanded', String(b === btn)));
    paint(btn);
  }));
});

/* Industries filter (toggle buttons) */
const filterBar = $('[data-filter]');
if (filterBar) {
  const btns = $$('button', filterBar), items = $$('.sector'), status = $('#sector-status');
  btns.forEach(b => b.addEventListener('click', () => {
    btns.forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    const f = b.dataset.value; let n = 0;
    items.forEach(it => { const show = f === 'all' || it.dataset.group.split(' ').includes(f); it.hidden = !show; if (show) n++; });
    status.textContent = `Showing ${n} of ${items.length} sectors`;
  }));
}

/* Architecture matcher */
const matcher = $('#matcher-select');
if (matcher) {
  const data = JSON.parse($('#matcher-data').textContent);
  const out = $('#matcher-out');
  const render = () => {
    const d = data[matcher.value];
    out.innerHTML = `<p class="eyebrow">${d.tag}</p><h3>${d.title}</h3><p>${d.body}</p><dl><div><dt>Recommended squad</dt><dd>${d.squad}</dd></div><div><dt>Typical deployment cycle</dt><dd>6–12 weeks</dd></div></dl><p style="margin-top:24px"><a class="btn btn--light btn--sm" href="contact.html?focus=${encodeURIComponent(d.tag)}">Discuss this blueprint</a></p>`;
  };
  matcher.addEventListener('change', render);
}

/* Careers board */
const jobsRoot = $('#jobs');
if (jobsRoot) {
  const q = $('#job-q'), dept = $('#job-dept'), lvl = $('#job-level'), loc = $('#job-loc');
  const jobs = $$('.job', jobsRoot), count = $('#job-count'), empty = $('#jobs-empty');
  const run = () => {
    const term = q.value.trim().toLowerCase(); let n = 0;
    jobs.forEach(j => {
      const ok = (!term || j.textContent.toLowerCase().includes(term)) && (!dept.value || j.dataset.dept === dept.value) && (!lvl.value || j.dataset.level === lvl.value) && (!loc.value || j.dataset.loc.includes(loc.value));
      j.hidden = !ok; if (ok) n++;
    });
    count.textContent = `${n} open position${n === 1 ? '' : 's'}`;
    empty.hidden = n > 0;
  };
  [q, dept, lvl, loc].forEach(el => el.addEventListener('input', run));
  $('#jobs-reset')?.addEventListener('click', () => { q.value = ''; dept.value = ''; lvl.value = ''; loc.value = ''; run(); q.focus(); });
}

/* Contact form: client-side validation. Submission is simulated (no backend in this prototype). */
const form = $('#contact-form');
if (form) {
  const params = new URLSearchParams(location.search);
  if (params.get('focus')) { const msg = $('#f-msg'); if (!msg.value) msg.value = `I'd like to discuss: ${params.get('focus')}.\n\n`; }
  const rules = {
    'f-first': v => v.trim() ? '' : 'Enter your first name.',
    'f-last': v => v.trim() ? '' : 'Enter your last name.',
    'f-company': v => v.trim() ? '' : 'Enter your company name.',
    'f-email': v => !v.trim() ? 'Enter your work email.' : /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'Enter an email in the format name@company.com.',
    'f-msg': v => v.trim().length >= 20 ? '' : `Tell us a little more: at least 20 characters (${v.trim().length}/20).`,
  };
  const check = id => {
    const el = $('#' + id), msg = rules[id](el.value), f = el.closest('.field');
    f.classList.toggle('has-error', !!msg); el.setAttribute('aria-invalid', String(!!msg));
    $('.err span', f).textContent = msg; return !msg;
  };
  Object.keys(rules).forEach(id => {
    const el = $('#' + id);
    el.addEventListener('blur', () => { if (el.value) check(id); });
    el.addEventListener('input', () => { if (el.closest('.field').classList.contains('has-error')) check(id); });
  });
  const counter = $('#f-msg-count');
  $('#f-msg').addEventListener('input', e => { counter.textContent = `${e.target.value.trim().length} / 20 minimum`; });
  form.addEventListener('submit', e => {
    e.preventDefault();
    const bad = Object.keys(rules).filter(id => !check(id));
    const status = $('#form-status');
    if (bad.length) {
      status.className = 'form-status form-status--err'; status.hidden = false;
      status.textContent = `Please fix ${bad.length} field${bad.length > 1 ? 's' : ''} before sending.`;
      $('#' + bad[0]).focus(); return;
    }
    status.className = 'form-status form-status--ok'; status.hidden = false;
    status.textContent = 'Prototype: your message was validated but not sent. Connect this form to the CRM before launch.';
    status.focus();
  });
}

/* Reveal on scroll */
const reveals = $$('.reveal');
if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
  reveals.forEach(r => io.observe(r));
} else reveals.forEach(r => r.classList.add('in'));
