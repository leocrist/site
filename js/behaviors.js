// Interaction layer, re-bound after every route render.
import { validateApply, validateContactStep, MSG } from './validators.js';
import { esc } from './dom.js';
import { bindEngagement } from './engagement.js';
import { bindGlobe } from './globe.js';
import { bindFlow } from './flow.js';
import { bindOfficeMap } from './officemap.js';
import { bindDrift } from './drift.js';

const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

function closeMenus(except) {
  $$('.nav-link[aria-expanded="true"]').forEach((b) => {
    if (b === except) return;
    b.setAttribute('aria-expanded', 'false');
    document.getElementById(b.getAttribute('aria-controls'))?.setAttribute('hidden', '');
  });
}

let globalBound = false;
function bindGlobal() {
  if (globalBound) return;
  globalBound = true;
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-item')) closeMenus();
    if (e.target.closest('.mega a, .drop a, .mnav a')) {
      closeMenus();
      const m = document.getElementById('mnav');
      if (m && !m.hidden) { m.hidden = true; document.querySelector('.nav-burger')?.setAttribute('aria-expanded', 'false'); }
    }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    const open = document.querySelector('.nav-link[aria-expanded="true"]');
    if (open) { closeMenus(); open.focus(); }
  });
}

function bindNav(root) {
  const nav = root.querySelector('[data-nav]');
  if (!nav) return;
  const setBottom = () => { const n = document.querySelector('[data-nav]'); if (n) document.documentElement.style.setProperty('--nav-bottom', `${Math.round(n.getBoundingClientRect().bottom)}px`); };
  setBottom();
  $$('.nav-link[aria-controls]', nav).forEach((b) => {
    const panel = document.getElementById(b.getAttribute('aria-controls'));
    if (!panel) return;
    const open = (v) => { b.setAttribute('aria-expanded', String(v)); panel.hidden = !v; if (v) setBottom(); };
    b.addEventListener('click', () => { const v = b.getAttribute('aria-expanded') !== 'true'; closeMenus(b); open(v); });
    const item = b.closest('.nav-item');
    let t;
    item.addEventListener('mouseenter', () => { if (matchMedia('(hover: hover)').matches) { clearTimeout(t); closeMenus(b); open(true); } });
    item.addEventListener('mouseleave', () => { if (matchMedia('(hover: hover)').matches) t = setTimeout(() => open(false), 160); });
  });
  const burger = nav.querySelector('.nav-burger');
  burger?.addEventListener('click', () => {
    const m = document.getElementById('mnav');
    const v = m.hidden;
    m.hidden = !v;
    burger.setAttribute('aria-expanded', String(v));
    burger.setAttribute('aria-label', v ? 'Close menu' : 'Open menu');
  });
}

function bindTabs(root) {
  $$('[data-tabs]', root).forEach((tabs) => {
    const list = $$('[role="tab"]', tabs);
    const select = (t, focus) => {
      list.forEach((x) => {
        const on = x === t;
        x.setAttribute('aria-selected', String(on));
        x.tabIndex = on ? 0 : -1;
        document.getElementById(x.getAttribute('aria-controls')).hidden = !on;
      });
      if (focus) t.focus();
    };
    list.forEach((t, i) => {
      t.addEventListener('click', () => select(t));
      t.addEventListener('keydown', (e) => {
        const k = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
        if (k) { e.preventDefault(); select(list[(i + k + list.length) % list.length], true); }
        if (e.key === 'Home') { e.preventDefault(); select(list[0], true); }
        if (e.key === 'End') { e.preventDefault(); select(list[list.length - 1], true); }
      });
    });
  });
}

function bindDialogs(root) {
  $$('[data-open]', root).forEach((b) => b.addEventListener('click', () => {
    const d = document.getElementById(b.dataset.open);
    if (!d) return;
    if (b.dataset.video) d.querySelector('[data-video-title]').textContent = b.dataset.video;
    d._opener = b;
    d.showModal();
  }));
  $$('dialog', document).forEach((d) => {
    if (d._bound) return;
    d._bound = true;
    d.addEventListener('close', () => d._opener?.focus());
    d.addEventListener('click', (e) => { if (e.target === d) d.close(); });
  });
  const form = document.querySelector('[data-team-form]');
  if (form && !form._bound) {
    form._bound = true;
    form.querySelector('[data-team-submit]').addEventListener('click', (e) => {
      const email = form.email;
      const err = email.parentElement.querySelector('.err');
      const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
      if (!ok) {
        e.preventDefault();
        err.hidden = false;
        err.textContent = email.value.trim() ? MSG.email : MSG.required;
        email.parentElement.classList.add('is-error');
        email.focus();
        return;
      }
      e.preventDefault();
      err.hidden = true;
      email.parentElement.classList.remove('is-error');
      form.querySelector('.dlg-done').hidden = false;
      setTimeout(() => form.closest('dialog').close(), 1600);
    });
  }
}

function bindRails(root) {
  $$('[data-rail]', root).forEach((r) => {
    const track = r.querySelector('.rail-track');
    const step = () => (track.firstElementChild?.getBoundingClientRect().width || 300) + 24;
    r.querySelector('[data-rail-prev]').addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
    r.querySelector('[data-rail-next]').addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));
  });
}

function bindFilters(root) {
  $$('[data-filter]', root).forEach((group) => {
    const key = group.dataset.filter;
    const target = root.querySelector(`[data-filter-target="${key}"]`);
    const search = root.querySelector(`[data-search="${key}"]`);
    const empty = root.querySelector(`[data-empty="${key}"]`);
    const apply = () => {
      const v = group.querySelector('[aria-pressed="true"]')?.dataset.value || 'all';
      const q = (search?.value || '').trim().toLowerCase();
      let shown = 0;
      [...target.children].forEach((el) => {
        const on = (v === 'all' || el.dataset.cat === v) && (!q || el.textContent.toLowerCase().includes(q));
        el.hidden = !on;
        if (on) shown++;
      });
      if (empty) empty.hidden = shown > 0;
      // a featured item above the list follows the tab (hidden while searching or on another category)
      const feat = root.querySelector(`[data-feature="${key}"]`);
      if (feat) feat.hidden = !!q || !(v === 'all' || feat.dataset.cat === v);
    };
    $$('button', group).forEach((b) => b.addEventListener('click', () => {
      $$('button', group).forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      apply();
    }));
    search?.addEventListener('input', apply);
  });
  // Decorative segmented rows without a target still toggle pressed state.
  $$('.seg:not([data-filter])', root).forEach((g) => $$('button', g).forEach((b) => b.addEventListener('click', () => $$('button', g).forEach((x) => x.setAttribute('aria-pressed', String(x === b))))));
  $$('.pager', root).forEach((p) => $$('button:not([aria-label])', p).forEach((b) => b.addEventListener('click', () => {
    $$('button', p).forEach((x) => x.removeAttribute('aria-current'));
    b.setAttribute('aria-current', 'page');
  })));
}

function bindJobs(root) {
  const f = root.querySelector('[data-jobs-filter]');
  if (!f) return;
  const rows = $$('[data-jobs] .job', root);
  const empty = root.querySelector('[data-jobs-empty]');
  const apply = () => {
    const q = f.q.value.trim().toLowerCase();
    let shown = 0;
    rows.forEach((r) => {
      const on = (!q || r.dataset.title.includes(q)) && (!f.job.value || r.dataset.job === f.job.value) && (!f.level.value || r.dataset.level === f.level.value);
      r.parentElement.hidden = !on;
      if (on) shown++;
    });
    empty.hidden = shown > 0;
  };
  f.addEventListener('input', apply);
  f.addEventListener('change', apply);
  apply();
}

/* ---------- forms ---------- */

function showErrors(form, errors) {
  $$('[data-field]', form).forEach((wrap) => {
    const name = wrap.dataset.field;
    const err = wrap.querySelector('.err');
    const msg = errors[name];
    wrap.classList.toggle('is-error', !!msg);
    if (err) { err.hidden = !msg; err.innerHTML = msg ? `<i class="ph-light ph-warning-circle" aria-hidden="true"></i>${esc(msg)}` : ''; }
    wrap.querySelectorAll('input, select, textarea').forEach((el) => el.setAttribute('aria-invalid', String(!!msg)));
  });
  const summary = form.querySelector('[data-summary]');
  const count = Object.keys(errors).length;
  if (summary) {
    summary.hidden = count === 0;
    summary.innerHTML = count ? `<i class="ph-light ph-warning-circle" aria-hidden="true"></i><span>${count} field${count > 1 ? 's need' : ' needs'} attention before you can continue.</span>` : '';
  }
  return count;
}

function bindApply(root) {
  const form = root.querySelector('[data-apply]');
  if (!form) return;
  const values = () => ({
    firstName: form.firstName.value, lastName: form.lastName.value, email: form.email.value, linkedin: form.linkedin.value,
    location: form.location.value, preferredName: form.preferredName.value, resume: form.resume.files[0] || null,
    aiAck: form.querySelector('[name="aiAck"]:checked')?.value || '', gender: form.gender.value,
  });
  let submitted = false;
  form.resume.addEventListener('change', () => {
    form.querySelector('[data-file-name]').textContent = form.resume.files[0]?.name || 'Upload your CV';
    if (submitted) showErrors(form, validateApply(values()));
  });
  form.addEventListener('focusout', (e) => {
    if (!submitted) {
      const name = e.target.name;
      const err = validateApply(values())[name];
      const wrap = e.target.closest('[data-field]');
      if (wrap && err && e.target.value && name === 'linkedin') showErrors(form, { linkedin: err });
      return;
    }
    showErrors(form, validateApply(values()));
  });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    submitted = true;
    const errors = validateApply(values());
    if (showErrors(form, errors)) {
      const summary = form.querySelector('[data-summary]');
      summary.focus();
      return;
    }
    form.querySelector('[data-ok]').hidden = false;
    form.querySelector('[type="submit"]').disabled = true;
  });
}

function bindStepper(root) {
  const form = root.querySelector('[data-stepper]');
  if (!form) return;
  let step = 1;
  const navItems = $$('.stepper-nav li', form);
  const back = form.querySelector('[data-back]');
  const next = form.querySelector('[data-next]');
  const values = () => ({
    need: form.querySelector('[name="need"]:checked')?.value || '', area: form.area.value,
    tech: $$('[name="tech"]:checked', form).map((x) => x.value), teamSize: form.teamSize.value, model: form.model.value,
    name: form.name.value, email: form.email.value, company: form.company.value, country: form.country.value, message: form.message.value,
  });
  const show = (s) => {
    step = s;
    $$('[data-step]', form).forEach((p) => (p.hidden = p.dataset.step !== String(s)));
    navItems.forEach((li, i) => {
      const idx = i + 1;
      const cur = s === idx || (s === 4 && idx === 3);
      li.toggleAttribute('aria-current', false);
      if (cur) li.setAttribute('aria-current', 'step');
      li.classList.toggle('is-done', typeof s === 'number' ? idx < s && !(s === 4 && idx === 3) : true);
    });
    back.hidden = s === 1 || s === 'done';
    next.hidden = s === 'done';
    next.querySelector('span').textContent = s === 4 ? 'Send request' : s === 3 ? 'Review' : 'Continue';
    if (s === 4) {
      const v = values();
      form.querySelector('[data-review]').innerHTML = [
        ['Need', v.need], ['Service area', v.area || 'Not sure yet'], ['Technologies', v.tech.join(', ')], ['Team size', v.teamSize],
        ['Engagement model', v.model], ['Name', v.name], ['Email', v.email], ['Company', v.company], ['Country', v.country || '-'],
      ].map(([k, val]) => `<div><dt>${esc(k)}</dt><dd>${esc(val)}</dd></div>`).join('');
    }
    const panel = form.querySelector(`[data-step="${s}"]`);
    panel?.querySelector('input, select, textarea, h2, .form-ok')?.focus?.({ preventScroll: true });
  };
  next.addEventListener('click', () => {
    if (step === 4) { show('done'); return; }
    const errors = validateContactStep(step, values());
    const panel = form.querySelector(`[data-step="${step}"]`);
    const count = showErrors(panel, errors);
    const summary = form.querySelector('[data-summary]');
    // Summary lives in step 1's panel; mirror a short count on other steps via the field errors only.
    if (count) { panel.querySelector('.is-error input, .is-error select')?.focus(); return; }
    if (summary) summary.hidden = true;
    show(step + 1);
  });
  back.addEventListener('click', () => show(step === 4 ? 3 : step - 1));
}

function bindMisc(root) {
  $$('[data-nav-select]', root).forEach((s) => s.addEventListener('change', () => (location.hash = s.value)));
  $$('[data-scroll]', root).forEach((a) => a.addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById(a.dataset.scroll)?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  }));
  $$('a[href^="#a"]', root).forEach((a) => a.addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById(a.getAttribute('href').slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    $$('.toc a', root).forEach((x) => x.removeAttribute('aria-current'));
    a.setAttribute('aria-current', 'true');
  }));
}

function bindReveal(root) {
  const els = $$('[data-reveal]', root);
  if (!('IntersectionObserver' in window)) { els.forEach((e) => e.classList.add('in')); return; }
  const io = new IntersectionObserver((entries) => entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }), { rootMargin: '0px 0px -10% 0px' });
  els.forEach((e) => io.observe(e));
}

// Footer wordmark letters rise into place once the footer edge is on screen.
function bindWordmark() {
  const el = document.querySelector('.f-giant');
  if (!el || el.dataset.bound) return;
  el.dataset.bound = '1';
  if (!('IntersectionObserver' in window)) { el.classList.add('is-in'); return; }
  const io = new IntersectionObserver(([en]) => { if (en.isIntersecting) { el.classList.add('is-in'); io.disconnect(); } }, { threshold: 0.35 });
  io.observe(el);
}

export function bind(root) {
  bindGlobal();
  bindNav(root);
  bindTabs(root);
  bindDialogs(root);
  bindRails(root);
  bindFilters(root);
  bindJobs(root);
  bindApply(root);
  bindStepper(root);
  bindMisc(root);
  bindEngagement(root);
  bindGlobe(root);
  bindFlow(root);
  bindOfficeMap(root);
  bindDrift(root);
  bindReveal(root);
  bindWordmark();
}
