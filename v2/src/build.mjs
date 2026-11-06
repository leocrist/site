// Static site generator for PTN Global v2. Run: node v2/src/build.mjs
// Shared partials + page content -> v2/*.html (no runtime templating).
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const OUT = join(dirname(fileURLToPath(import.meta.url)), '..');

const esc = s => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const CERT_URL = 'https://enquiries.cpg.global/web/enquiry.nsf/enquiry.xsp?Open&id=ISMS/20/R84/1419';
const EMAIL = 'hello@ptnglobalcorp.com';

/* ---------- Icons (24px stroke) ---------- */
const P = {
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  chev: '<path d="m6 9 6 6 6-6"/>',
  check: '<path d="m5 12 5 5 9-10"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  shield: '<path d="M12 3 4 6v6c0 4.5 3.4 8.3 8 9 4.6-.7 8-4.5 8-9V6l-8-3Z"/><path d="m9 12 2 2 4-4"/>',
  spark: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/>',
  cpu: '<rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4"/>',
  code: '<path d="m8 8-5 4 5 4M16 8l5 4-5 4M14 4l-4 16"/>',
  layers: '<path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 13 9 5 9-5"/>',
  cloud: '<path d="M7 18a5 5 0 1 1 1.2-9.9A6 6 0 0 1 19.5 11 3.5 3.5 0 0 1 18 18H7Z"/>',
  users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14.5a6.5 6.5 0 0 1 3.5 5.5"/>',
  test: '<path d="M9 3h6M10 3v6L4.5 19a1.5 1.5 0 0 0 1.3 2h12.4a1.5 1.5 0 0 0 1.3-2L14 9V3"/><path d="M7 15h10"/>',
  eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
  wave: '<path d="M3 12h2l2-6 4 12 4-9 2 3h4"/>',
  db: '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>',
  plug: '<path d="M9 2v6M15 2v6M6 8h12v4a6 6 0 0 1-12 0V8ZM12 18v4"/>',
  chip: '<path d="M4 17 10 11 4 5M12 19h8"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
  home: '<path d="m3 11 9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9Z"/>',
  board: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16M15 4v16"/>',
  bot: '<rect x="4" y="8" width="16" height="12" rx="3"/><path d="M12 8V4M9 14h.01M15 14h.01"/>',
  flag: '<path d="M5 21V4h11l-2 4 2 4H5"/>',
  link2: '<path d="M7 17 17 7M9 7h8v8"/>',
  swap: '<path d="M4 8h14l-4-4M20 16H6l4 4"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  pin: '<path d="M12 21s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12Z"/><circle cx="12" cy="9" r="2.5"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  alert: '<path d="M12 9v4M12 17h.01"/><path d="M10.3 3.9 2.4 18a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/>',
};
const ic = (n, cls = 'i') => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${P[n]}</svg>`;
const tbc = (v, note) => `<span class="tbc" title="${esc('To confirm: ' + note)}">${v}<span class="sr-only"> (figure to confirm: ${esc(note)})</span></span>`;
const ENG = tbc('150+', 'the current site says 150+ engineers (Company), 120+ (Contact) and 200+ seats');

/* ---------- Navigation model (single source for header, mobile menu, footer) ---------- */
const SERVICES = [
  ['ai-transformation.html', 'spark', 'AI-Augmented Delivery', 'Bring AI into every stage of your SDLC, with governance'],
  ['ai-engineering.html', 'cpu', 'AI Engineering', 'GenAI, agents, computer vision and NLP in production'],
  ['services.html#software', 'code', 'Software Engineering', 'Modernise legacy stacks into resilient cloud platforms'],
  ['services.html#emerging', 'layers', 'Emerging Technologies', 'IoT, edge AI and digital twins, from PoC to scale'],
];
const COMPANY = [
  ['company.html', 'users', 'Who we are', 'Melbourne-led, delivered from Can Tho since 2019'],
  ['careers.html', 'flag', 'Careers', '8 open roles across AI, QA, design and DevOps'],
];

function header(active) {
  const cur = f => (f === active ? ' aria-current="page"' : '');
  const fly = (id, label, items, mega, foot) => `
      <li class="nav__item">
        <button class="nav__link${items[0][0].split('#')[0] === active || (id === 'fly-services' && items.some(i => i[0].split('#')[0] === active)) || (id === 'fly-services' && active === 'services.html') ? ' is-current' : ''}" type="button" aria-expanded="false" data-flyout="${id}">${label}${ic('chev', 'chev')}</button>
        <div class="flyout${mega ? ' flyout--mega' : ''}" id="${id}" hidden>
          ${items.map(([h, i, t, d]) => `<a href="${h}"${cur(h)}><span class="ico">${ic(i)}</span><span><b>${t}</b><small>${d}</small></span></a>`).join('')}
          ${foot || ''}
        </div>
      </li>`;
  return `
<a class="skip" href="#main">Skip to content</a>
<div class="announce"><a href="${CERT_URL}" target="_blank" rel="noopener"><strong>ISO/IEC 27001 certified<span class="hide-xs"> delivery</span></strong><span aria-hidden="true">·</span><span>Verify<span class="hide-xs"> our CPG certificate</span></span>${ic('link2', 'i')}<span class="sr-only">(opens in a new tab)</span></a></div>
<header class="site-header">
  <div class="wrap nav">
    <a class="nav__logo" href="index.html" aria-label="PTN Global home"><img src="assets/ptn-logo.svg" alt="PTN Global" width="108" height="34"></a>
    <nav aria-label="Main">
      <ul class="nav__menu">
        ${fly('fly-services', 'Services', SERVICES, true, `<div class="flyout__foot"><span>Not sure where to start?</span><a class="link" href="services.html" style="display:inline-flex;padding:0">All services ${ic('arrow')}</a></div>`)}
        <li class="nav__item"><a class="nav__link" href="industries.html"${cur('industries.html')}>Industries</a></li>
        <li class="nav__item"><a class="nav__link" href="case-studies.html"${cur('case-studies.html')}>Case Studies</a></li>
        ${fly('fly-company', 'Company', COMPANY, false)}
        <li class="nav__item"><a class="nav__link" href="careers.html"${cur('careers.html')}>Careers <span class="nav__hiring">HIRING</span></a></li>
      </ul>
    </nav>
    <div class="nav__end">
      <a class="nav__link hide-md" href="contact.html"${cur('contact.html')}>Contact</a>
      <a class="btn btn--sm" href="contact.html">Talk to our experts</a>
    </div>
    <button class="nav__toggle" type="button" aria-expanded="false" aria-controls="mobile-menu" aria-label="Open menu">${ic('menu', 'i-open')}<span class="i-close" style="display:none">${ic('close')}</span></button>
  </div>
</header>
<div class="mobile-menu" id="mobile-menu" hidden>
  <nav aria-label="Mobile">
    <div class="group"><span class="eyebrow">Services</span>
      <a href="services.html"${cur('services.html')}>All services ${ic('arrow')}</a>
      ${SERVICES.map(([h, , t]) => `<a href="${h}"${cur(h)}>${t}</a>`).join('')}
    </div>
    <div class="group"><span class="eyebrow">Explore</span>
      <a href="industries.html"${cur('industries.html')}>Industries</a>
      <a href="case-studies.html"${cur('case-studies.html')}>Case Studies</a>
      <a href="company.html"${cur('company.html')}>Who we are</a>
      <a href="careers.html"${cur('careers.html')}>Careers <span class="nav__hiring">HIRING</span></a>
      <a href="contact.html"${cur('contact.html')}>Contact</a>
    </div>
    <div class="actions"><a class="btn" href="contact.html">Talk to our experts</a><a class="btn btn--soft" href="mailto:${EMAIL}">${EMAIL}</a></div>
  </nav>
</div>`;
}

function footer() {
  const col = (title, links) => `<div><h2>${title}</h2><ul>${links.map(([h, t]) => `<li><a href="${h}">${t}</a></li>`).join('')}</ul></div>`;
  return `
<footer class="site-footer">
  <div class="wrap foot">
    <div class="foot__brand">
      <img src="assets/ptn-logo.svg" alt="PTN Global" width="114" height="36" loading="lazy">
      <p>Technology partner for the AI-driven enterprise. Cloud architecture, bespoke AI platforms and software modernisation, led from Melbourne and delivered from Can Tho.</p>
      <div class="badges"><a class="badge" href="${CERT_URL}" target="_blank" rel="noopener">${ic('shield')} ISO/IEC 27001 · CPG audited<span class="sr-only"> (opens in a new tab)</span></a></div>
    </div>
    ${col('Services', [['ai-transformation.html', 'AI-Augmented Delivery'], ['ai-engineering.html', 'AI Engineering'], ['services.html#software', 'Software Engineering'], ['services.html#emerging', 'Emerging Technologies'], ['services.html#engage', 'Engagement models']])}
    ${col('Company', [['company.html', 'Who we are'], ['industries.html', 'Industries'], ['case-studies.html', 'Case Studies'], ['careers.html', 'Careers'], ['contact.html', 'Contact']])}
    <div><h2>Offices</h2>
      <address><b>Melbourne · Headquarters</b>Level 11, 101 Bourke Street<br>Melbourne VIC 3000, Australia</address>
      <address><b>Can Tho · Delivery centre</b>R&amp;D Technology Park<br>Can Tho, Vietnam</address>
      <p style="margin-top:16px"><a href="mailto:${EMAIL}">${EMAIL}</a></p>
    </div>
  </div>
  <div class="wrap foot__bar">
    <span>© <span data-year>2026</span> PTN Global. All rights reserved.</span>
    <ul style="list-style:none"><li><a href="legal.html#privacy">Privacy Policy</a></li><li><a href="legal.html#terms">Terms of Service</a></li><li><a href="${CERT_URL}" target="_blank" rel="noopener">ISO 27001 certificate<span class="sr-only"> (opens in a new tab)</span></a></li></ul>
  </div>
</footer>`;
}

function page({ file, title, desc, body }) {
  const full = title ? `${title} · PTN Global` : 'PTN Global · AI-Augmented Software Development';
  const html = `<!doctype html>
<html lang="en" class="no-js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${full}</title>
<meta name="description" content="${esc(desc)}">
<meta name="robots" content="noindex, nofollow">
<meta property="og:title" content="${esc(full)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:type" content="website">
<link rel="icon" href="assets/ptn-mark.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap">
<link rel="stylesheet" href="css/site.css">
</head>
<body>
${header(file)}
<main id="main">
${body}
</main>
${footer()}
<script>document.querySelectorAll('[data-year]').forEach(n=>n.textContent=new Date().getFullYear())</script>
<script src="js/site.js" defer></script>
</body>
</html>
`;
  writeFileSync(join(OUT, file), html);
  console.log('built', file);
}

/* ---------- Shared blocks ---------- */
const ledger = items => `<dl class="ledger">${items.map(([v, l]) => `<div><dt>${l}</dt><dd>${v}</dd></div>`).join('')}</dl>`;

// Offset (minutes ahead of UTC) for an IANA zone right now; Node ships full ICU.
const tzOffset = (tz, d = new Date()) => {
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-GB', { timeZone: tz, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).formatToParts(d).map(x => [x.type, x.value]));
  return Math.round((Date.UTC(+p.year, p.month - 1, +p.day, +p.hour, +p.minute) - d.getTime()) / 60000);
};
const hhmm = m => { m = ((m % 1440) + 1440) % 1440; return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`; };
const OPEN = 540, CLOSE = 1050; // 09:00 to 17:30 local, office hours to confirm
const tzBlock = (headingId = 'tz-h') => {
  const diff = tzOffset('Australia/Melbourne') - tzOffset('Asia/Ho_Chi_Minh');
  const pc = m => (m / 1440 * 100).toFixed(3) + '%';
  const shared = (CLOSE - OPEN - diff) / 60;
  const work = (cls, from, to, label, key) => `<span class="tz__work${cls}" data-work="${key}" style="left:${pc(from)};width:${pc(to - from)}">${label}</span>`;
  return `
<section class="section" aria-labelledby="${headingId}"><div class="wrap">
  <div class="sec-head"><p class="eyebrow">Dual-hub delivery</p><h2 class="h2" id="${headingId}">Led in Melbourne. Built in Can Tho.</h2>
    <p class="lead">Can Tho runs <span data-tz-diff>${diff / 60}</span> hours behind Melbourne (three in winter, four during Australian daylight saving). Every working day both teams share a block of live hours for stand-ups, reviews and decisions.</p></div>
  <div class="tz" data-tz data-open="${OPEN}" data-close="${CLOSE}">
    <div class="tz__scale" aria-hidden="true"><span></span><ol>${[0, 3, 6, 9, 12, 15, 18, 21, 24].map(h => `<li>${String(h).padStart(2, '0')}</li>`).join('')}</ol></div>
    <div class="tz__row"><div class="tz__who"><b>Melbourne</b><span>Headquarters · <span data-clock="Australia/Melbourne">${hhmm(new Date().getUTCHours() * 60 + new Date().getUTCMinutes() + tzOffset('Australia/Melbourne'))}</span> now</span></div>
      <div class="tz__track">${work('', OPEN, CLOSE, '09:00 to 17:30', 'mel')}<span class="tz__now" data-now></span></div></div>
    <div class="tz__row"><div class="tz__who"><b>Can Tho</b><span>Delivery centre · <span data-clock="Asia/Ho_Chi_Minh">${hhmm(new Date().getUTCHours() * 60 + new Date().getUTCMinutes() + tzOffset('Asia/Ho_Chi_Minh'))}</span> now</span></div>
      <div class="tz__track">${work('', OPEN + diff, Math.min(1440, CLOSE + diff), '09:00 to 17:30 Can Tho', 'vn')}<span class="tz__now" data-now></span></div></div>
    <div class="tz__row"><div class="tz__who"><b>Shared hours</b><span data-tz-summary>${shared} h a day, ${hhmm(OPEN + diff)} to ${hhmm(CLOSE)}</span></div>
      <div class="tz__track">${work(' tz__work--overlap', OPEN + diff, CLOSE, '', 'both')}<span class="tz__now" data-now></span></div></div>
    <p class="sr-only" data-tz-text>Shared hours: ${hhmm(OPEN + diff)} to ${hhmm(CLOSE)} Melbourne time, which is ${hhmm(OPEN)} to ${hhmm(CLOSE - diff)} in Can Tho, ${shared} hours a day.</p>
    <div class="tz__legend" aria-hidden="true"><span>Timeline in Melbourne time</span><span><i style="background:var(--blue-tint);border:1px solid var(--blue)"></i>Office hours</span><span><i style="background:var(--night)"></i>Both teams online</span><span><i style="background:var(--danger)"></i>Now</span></div>
  </div>
  <p class="tbc-key" style="margin-top:12px">Office hours shown as 09:00 to 17:30 local time (to confirm). Live times use your browser clock.</p>
  <div class="tz__addr">
    <address><b>Melbourne</b>Level 11, 101 Bourke Street, Melbourne VIC 3000<br><span class="muted">Client accountability, solution architecture, engagement management</span></address>
    <address><b>Can Tho</b>R&amp;D Technology Park, Can Tho, Vietnam<br><span class="muted">${ENG}&nbsp;engineers, AI labs and DevSecOps on ISO-certified infrastructure</span></address>
  </div>
</div></section>`;
};

const cta = (h, p, primary = ['contact.html', 'Book a discovery call'], secondary = ['case-studies.html', 'See case studies']) => `
<section class="section--tight" aria-labelledby="cta-h">
  <div class="night-wrap"><div class="wrap"><div class="cta night reveal">
    <div><p class="eyebrow">Get started</p><h2 class="h2" id="cta-h" style="margin-top:16px">${h}</h2><p class="lead">${p}</p></div>
    <div class="actions"><a class="btn btn--light" href="${primary[0]}">${primary[1]} ${ic('arrow')}</a>${secondary ? `<a class="btn btn--ghost-night" href="${secondary[0]}">${secondary[1]}</a>` : ''}</div>
  </div></div></div>
</section>`;

const pageHero = ({ crumb, eyebrow, h1, lead, actions = '' }) => `
<section class="page-hero"><div class="wrap">
  <p class="crumb"><a href="index.html">Home</a> / ${crumb}</p>
  <p class="eyebrow" style="margin-top:24px">${eyebrow}</p>
  <h1 class="h1">${h1}</h1>
  <p class="lead">${lead}</p>
  ${actions ? `<div class="actions">${actions}</div>` : ''}
</div></section>`;

const SDLC = [
  ['01', 'BA & Analysis', 'Semantic requirement maps', 'Automated PRD compilation, edge-case discovery and stakeholder intent synthesis from raw conversations.', 'User stories extracted from source docs|Edge cases flagged for BA review|Traceability from story to test'],
  ['02', 'Product & Design', 'Generative wireframing', 'Intent-driven design token propagation, component hierarchy synthesis and rapid, accessible UI prototyping.', 'Tokens propagated from the design system|Accessible prototypes in days|Designer approves every change'],
  ['03', 'Development', 'Agentic coding loops', 'Multi-agent pair programming, scaffold synthesis, AST-level refactoring and context-aware migrations.', 'Agents propose, engineers review|Refactors scoped to the AST|Context-aware migrations'],
  ['04', 'QA & Testing', 'Self-healing tests', 'Continuous synthetic user emulation, self-healing regression suites and dynamic security surface fuzzing.', 'Regression suites that repair selectors|Synthetic user journeys|Security fuzzing in CI'],
  ['05', 'DevOps & Release', 'Smart pipeline gates', 'Canary evaluations, dependency upgrade gating and drift remediation in multi-cloud infrastructure.', 'Canary evaluation before rollout|Dependency upgrades gated|Infrastructure drift remediated'],
  ['06', 'Ops & Support', 'Predictive observability', 'Incident root-cause triage, runbook execution and anomaly mitigation from operational telemetry.', 'Root-cause triage suggestions|Runbooks executed with approval|Anomalies surfaced early'],
];
const modelBlock = (headingId, eyebrow, h2, lead) => `
<section class="section--tight" aria-labelledby="${headingId}">
  <div class="night-wrap"><div class="night section" style="padding-inline:0">
    <div class="wrap">
      <div class="sec-head sec-head--center">
        <p class="eyebrow">${eyebrow}</p>
        <h2 class="h2 two-tone" id="${headingId}">${h2}</h2>
        <p class="lead">${lead}</p>
      </div>
      <div class="model" data-model>
        <div class="model__visual" aria-hidden="true"><div class="model__card">
          <p class="eyebrow">Stage 01 · ${SDLC[0][2]}</p><h3>${SDLC[0][1]}</h3><p>${SDLC[0][3]}</p>
          <ul>${SDLC[0][4].split('|').map(p => `<li>${ic('check')}${p}</li>`).join('')}</ul>
        </div></div>
        <ol class="steps">
          ${SDLC.map(([n, t, tag, d, pts], i) => `<li class="step"><button type="button" aria-expanded="${i === 0}" data-n="${n}" data-tag="${esc(tag)}" data-title="${esc(t)}" data-body="${esc(d)}" data-points="${esc(pts)}"><span class="n">${n}</span><span class="t">${t}</span><span class="d">${d}</span></button></li>`).join('')}
        </ol>
      </div>
      <p class="eyebrow" style="text-align:center;margin-top:48px">Governance · Quality assurance · Measurement &amp; ROI run across every stage</p>
    </div>
  </div></div>
</section>`;

const ENGAGE = [
  ['Dedicated Engineering Pods', 'Team extension', 'Cross-functional squads (frontend, backend, DevOps, QA lead) integrated into your sprint rituals.', ['Onboarding in weeks, not months', 'Direct daily communication in English', 'Australian tech lead oversight']],
  ['Turnkey Modernisation', 'Most adopted', 'Outcome-based delivery for platform overhauls, GenAI workflow integration and cloud migrations, with agreed SLAs.', ['Fixed milestones and deliverables', 'Full architecture discovery phase', 'Complete IP and codebase transfer']],
  ['AI Strategy & PoC Lab', '6-week sprint', 'Time-boxed discovery to assess AI readiness, build a working proof of concept and design an ROI-driven roadmap.', ['Executive AI feasibility analysis', 'Security and compliance sandbox testing', 'Working prototype demonstration']],
];
const engageRows = () => `<div class="rows">${ENGAGE.map(([t, tag, d, li], i) => `
  <article class="row reveal">
    <div><span class="chip tag">${tag}</span><h3>${t}</h3></div>
    <div><p>${d}</p></div>
    <ul>${li.map(x => `<li>${ic('check')}${x}</li>`).join('')}</ul>
  </article>`).join('')}</div>`;

const testimonial = () => `<figure class="quote">
  <blockquote>“PTN has become an integral part of our IT delivery team. They have been able to provide wide ranging skills and have enabled us to meet tight timelines.”</blockquote>
  <figcaption><span class="avatar" aria-hidden="true">KM</span><span><b>Kyle Mathers</b><span>Chief Technology Officer · Member Benefits Australia</span></span></figcaption>
</figure>`;

/* =====================================================================
   HOME
   ===================================================================== */
page({
  file: 'index.html', title: '', desc: 'PTN Global helps organisations build, modernise and transform enterprise software with AI-augmented engineering. Melbourne-led, delivered from Can Tho, ISO/IEC 27001 certified.',
  body: `
<section class="hero"><div class="wrap">
  <div class="hero__inner">
    <a class="pill-tag" href="ai-transformation.html"><b>NEW</b> The AI-Augmented Engineering Model ${ic('arrow', 'i')}</a>
    <h1 class="h-display">Build, modernise and transform with <span class="nowrap">AI-augmented</span> engineering</h1>
    <p class="lead">PTN Global is the engineering partner that helps enterprises ship faster with AI, without trading away security or stability. Strategy and architecture from Melbourne, delivery pods in Can Tho.</p>
    <div class="actions"><a class="btn" href="contact.html">Talk to our experts</a><a class="btn btn--soft" href="#capabilities">Explore capabilities</a></div>
    <p class="hero__note">ISO/IEC 27001 certified · Australian contracts and governance</p>
  </div>

  <figure class="ws reveal" aria-label="Illustration: a PTN delivery pod workspace where AI agents and engineers share one sprint board">
    <div class="ws__bar" aria-hidden="true">
      <span class="ws__org"><img src="assets/ptn-mark.svg" alt="">Your pod</span>
      <span class="ws__search">${ic('search')} Search stories, PRs, test runs</span>
      <span class="ws__label">Illustrative</span>
    </div>
    <div class="ws__body" aria-hidden="true">
      <div class="ws__rail"><span class="on">${ic('home')}Pod</span><span>${ic('board')}Board</span><span>${ic('bot')}Agents</span><span>${ic('shield')}Gates</span></div>
      <div class="ws__panel">
        <div class="ws__head"><span class="sq"></span>Ledger modernisation · Sprint 14</div>
        <div class="ws__tabs"><span class="on">List</span><span>Board</span><span>Timeline</span></div>
        <table class="ws__table">
          <thead><tr><th>Story</th><th class="hide-sm">Stage</th><th>Owner</th><th class="hide-xs">Status</th></tr></thead>
          <tbody>
            <tr class="ws__group"><td colspan="4"><span class="status status--review">In review</span></td></tr>
            <tr><td>Extract payment rules from legacy routines</td><td class="hide-sm"><span class="stage">01 BA</span></td><td><span class="who who--ai">AI</span></td><td class=\"hide-xs\">Engineer review</td></tr>
            <tr><td>Accessible approval flow prototype</td><td class="hide-sm"><span class="stage">02 Design</span></td><td><span class="who">LT</span></td><td class=\"hide-xs\">Client sign-off</td></tr>
            <tr class="ws__group"><td colspan="4"><span class="status status--prog">In progress</span></td></tr>
            <tr><td>Split settlement service from monolith</td><td class="hide-sm"><span class="stage">03 Dev</span></td><td><span class="who">MN</span></td><td class=\"hide-xs\">Pairing with agent</td></tr>
            <tr><td>Regression suite for settlement API</td><td class="hide-sm"><span class="stage">04 QA</span></td><td><span class="who who--ai">AI</span></td><td class=\"hide-xs\">Generating</td></tr>
            <tr class="ws__group"><td colspan="4"><span class="status status--done">Done</span></td></tr>
            <tr><td>Canary release gate for ledger v2</td><td class="hide-sm"><span class="stage">05 DevOps</span></td><td><span class="who">HP</span></td><td class=\"hide-xs\">Merged</td></tr>
          </tbody>
        </table>
      </div>
      <div class="ws__panel ws__thread">
        <div class="ws__head"># ledger-squad</div>
        <div class="msg"><span class="who">TL</span><div><b>Tech lead, Melbourne</b><time>9:02</time><br>Can we ship the settlement split this sprint?</div></div>
        <div class="msg"><span class="who who--ai">AI</span><div><b>Delivery agent</b><time>9:03</time><br>Two items left before the release gate:
          <div class="card"><div class="check">${ic('check')}Policy guardrail passed</div><div class="check">${ic('check')}No secrets in diff</div><div class="check">${ic('clock')}Regression suite generating</div></div></div></div>
        <div class="ws__compose">Message #ledger-squad</div>
      </div>
    </div>
  </figure>
  <p class="ws__caption">Illustrative view of how engineers and AI agents share one delivery workflow.</p>
</div></section>

<section aria-labelledby="trust-h"><div class="wrap trust">
  <h2 class="eyebrow" id="trust-h">Trusted by teams at</h2>
  <ul><li>The Florey</li><li>CCIA</li><li>oncall</li><li>interpreters</li><li>ReadyTech</li><li>soundstack</li></ul>
</div></section>

<section class="section--loose statement" aria-labelledby="challenge-h"><div class="wrap">
  <p class="eyebrow">The challenge</p>
  <h2 class="h1 two-tone" id="challenge-h" style="margin-top:16px">AI velocity is easy to promise. <span class="dim">Stability is hard to keep.</span></h2>
  <p class="lead">Delivery roadmaps can't keep pace with customer expectations, and AI adopted without guardrails puts your IP and security at risk and leaves you with architectural sprawl. We re-engineer your software lifecycle with both in mind.</p>
  <div class="split-points">
    <div class="reveal"><b>Australian governance</b><p>Contracts, architecture and accountability sit with our Melbourne leadership.</p></div>
    <div class="reveal"><b>Data sovereignty by default</b><p>ISO/IEC 27001 controls, VPC-confined model work and certified engineers.</p></div>
    <div class="reveal"><b>Deep engineering talent</b><p>${ENG} engineers in Can Tho, organised into senior-led delivery pods.</p></div>
  </div>
</div></section>

<section class="section section--alt" id="capabilities" aria-labelledby="cap-h"><div class="wrap">
  <div class="sec-head sec-head--row">
    <div><p class="eyebrow">Capabilities</p><h2 class="h2" id="cap-h" style="margin-top:16px">One partner from architecture to AI in production</h2></div>
    <a class="link" href="services.html">All services ${ic('arrow')}</a>
  </div>
  <div class="cap-features">
    <a class="tile tile--feature" href="ai-transformation.html"><span class="glow"></span><div><p class="eyebrow">Flagship</p><h3 style="margin-top:12px">AI-Augmented Delivery</h3><p style="margin-top:12px">Copilots, synthetic test generation and automated refactoring built into your GitHub or GitLab pipeline, with a human approval at every gate.</p></div><span class="more">Explore the model ${ic('arrow')}</span></a>
    <a class="tile tile--feature g2" href="ai-engineering.html"><span class="glow"></span><div><p class="eyebrow">Enterprise AI</p><h3 style="margin-top:12px">AI Engineering &amp; LLMs</h3><p style="margin-top:12px">Retrieval-augmented generation, workflow agents, document intelligence and predictive models, built on your own data.</p></div><span class="more">Explore AI platforms ${ic('arrow')}</span></a>
  </div>
  <div class="cap-index">
    ${[
      ['AI engineering', [['ai-engineering.html', 'AI agents', 'Multi-step reasoning with human-in-the-loop'], ['ai-engineering.html', 'Enterprise RAG', 'Hybrid search over your repositories'], ['ai-engineering.html', 'Computer vision', 'Document OCR, defect detection'], ['ai-engineering.html', 'NLP &amp; speech', 'Multilingual ASR, TTS, intent']]],
      ['Software engineering', [['services.html#software', 'Cloud-native platforms', 'AWS and Azure, zero downtime'], ['services.html#software', 'Legacy modernisation', 'Monolith to event-driven services'], ['services.html#software', 'DevSecOps delivery', 'Security gates on every branch'], ['services.html#engage', 'Dedicated pods', 'Senior squads in your sprints']]],
      ['Emerging technologies', [['services.html#emerging', 'Industrial IoT', 'Sensor networks, edge telemetry'], ['services.html#emerging', 'Edge AI inference', 'Models running on site'], ['services.html#emerging', 'Digital twins', 'Model operations before changing them'], ['services.html#emerging', 'Data mesh', 'Domain-owned data products']]],
    ].map(([h, items]) => `<div><h3>${h}</h3><ul>${items.map(([href, t, d]) => `<li><a href="${href}"><span><span>${t}</span><small>${d}</small></span>${ic('arrow')}</a></li>`).join('')}</ul></div>`).join('')}
  </div>
</div></section>

${modelBlock('model-h', 'How we work', 'One model across the lifecycle. <span class="dim">Six stages, one team.</span>', 'Human expertise, AI agents and engineering process combined: how software is analysed, designed, built, tested and operated.')}

<section class="section" id="engage" aria-labelledby="engage-h"><div class="wrap">
  <div class="sec-head"><p class="eyebrow">Engagement models</p><h2 class="h2" id="engage-h">Match the engagement to where you are</h2><p class="lead">From a six-week AI proof of concept to a long-running dedicated pod, the governance stays the same.</p></div>
  ${engageRows()}
</div></section>

<section class="section section--alt" aria-labelledby="proof-h"><div class="wrap">
  <h2 class="sr-only" id="proof-h">What clients say</h2>
  <div style="max-width:880px">${testimonial()}</div>
  <div style="margin-top:48px">${ledger([['Since 2019', 'Founded in Melbourne'], ['98.4%', 'Client retention'], ['4.9 / 5', 'Executive partner NPS'], ['ISO/IEC 27001', 'Audited by CPG']])}</div>
</div></section>

${tzBlock()}

${cta("Let's build what's next, together", 'Book a technical assessment with our Melbourne architecture leads. We review your cloud maturity and model integration path, then propose a sprint roadmap.')}
`});

/* =====================================================================
   SERVICES
   ===================================================================== */
const DISC = [
  ['ai', 'AI-Augmented Software Development', 'Core flagship', 'Change how software is analysed, designed, built, tested and delivered. We embed copilots, synthetic test generation and automated architecture verification directly into your pipeline.', ['Copilot engineering', 'Autonomous QA', 'Automated refactoring', 'SDLC telemetry'], 'ai-transformation.html', 'Explore AI-augmented delivery'],
  ['llm', 'AI Engineering & LLM Systems', 'Enterprise AI', 'Enterprise-grade AI applications powered by GenAI, multi-agent networks, RAG pipelines, computer vision and NLP, tailored to how your organisation works.', ['Enterprise RAG', 'Autonomous agents', 'Model fine-tuning', 'Vector databases'], 'ai-engineering.html', 'Explore AI engineering'],
  ['software', 'Enterprise Software & Cloud Modernisation', 'High concurrency', 'Build and modernise mission-critical products with resilient cloud architecture, microservices and modern DevOps, designed for zero downtime and strict governance.', ['Microservices', 'Cloud native AWS / Azure', 'Legacy modernisation', 'API ecosystems'], 'contact.html?focus=Software%20modernisation', 'Schedule an architecture review'],
  ['emerging', 'Emerging Technologies & IoT', 'Next-gen R&D', 'Explore, validate and industrialise next-horizon technology, from edge computing and smart sensor networks to distributed ledger protocols.', ['Industrial IoT', 'Edge AI inference', 'Digital twins', 'Data mesh networks'], 'contact.html?focus=Emerging%20technologies', 'Discuss a pilot'],
];
page({
  file: 'services.html', title: 'Services', desc: 'AI-augmented software development, AI engineering, cloud modernisation and emerging technologies, with flexible engagement models.',
  body: `
${pageHero({ crumb: 'Services', eyebrow: 'What we do', h1: 'From technology challenges to real outcomes', lead: 'We work across the full technology lifecycle: strategy, engineering, AI transformation and continuous innovation.', actions: `<a class="btn" href="contact.html">Schedule an architecture review</a><a class="btn btn--soft" href="#disciplines">See disciplines</a>` })}

<section class="section--tight" id="disciplines" aria-labelledby="disc-h"><div class="wrap">
  <div class="sec-head"><p class="eyebrow">Full lifecycle practice</p><h2 class="h2" id="disc-h">Four core disciplines</h2></div>
  <div class="rows">${DISC.map(([id, t, tag, d, chips, href, lt], i) => `
    <article class="row reveal" id="${id}">
      <div><span class="chip tag">${tag}</span><h3>${t}</h3></div>
      <div><p>${d}</p><div class="chips">${chips.map(c => `<span class="chip">${c}</span>`).join('')}</div></div>
      <a class="link" href="${href}">${lt} ${ic('arrow')}</a>
    </article>`).join('')}</div>
</div></section>

<section class="section section--alt" aria-labelledby="impact-h"><div class="wrap">
  <div class="sec-head"><p class="eyebrow">Measurable business impact</p><h2 class="h2" id="impact-h">Benchmarked against hard commercial indicators</h2><p class="lead">Every engagement is tracked with project telemetry and governance audits.</p></div>
  <div class="table-wrap" tabindex="0" role="region" aria-label="Reported business impact (scrolls sideways on small screens)"><table class="impact">
    <caption class="sr-only">Reported business impact</caption>
    <thead><tr><th scope="col">Indicator</th><th scope="col">Reported outcome</th><th scope="col">Where it comes from</th></tr></thead>
    <tbody>
      <tr><th scope="row">Productivity</th><td class="val">+42%</td><td>AI-assisted sprint velocity, measured against the pre-engagement baseline</td></tr>
      <tr><th scope="row">Time to market</th><td class="val">2.8x</td><td>Concept architecture to compliant production</td></tr>
      <tr><th scope="row">Cost</th><td class="val">−35%</td><td>Blended Melbourne and Can Tho delivery with senior oversight</td></tr>
      <tr><th scope="row">QA cycle time</th><td class="val">−35 to 50%</td><td>Synthetic test generation and self-healing regression suites</td></tr>
    </tbody></table></div>
  <p class="tbc-key" style="margin-top:12px">Figures as reported by PTN. Add the source engagement and timeframe for each before launch.</p>
</div></section>

<section class="section" aria-labelledby="gov-h"><div class="wrap">
  <div class="grid-2" style="align-items:center">
    <div><p class="eyebrow">Delivery governance</p><h2 class="h2" id="gov-h" style="margin-top:16px">Every commit checked before it ships</h2>
      <ul class="checklist">
        <li>${ic('check')}<span><b>ISO/IEC 27001 integrated controls.</b> Data residency, IP confidentiality and continuous compliance auditing.</span></li>
        <li>${ic('check')}<span><b>Continuous quality gates.</b> Static analysis and security scanning before any branch is approved.</span></li>
        <li>${ic('check')}<span><b>Melbourne and Can Tho, one rhythm.</b> Australian strategic advisory paired with a dedicated engineering campus.</span></li>
      </ul>
    </div>
    <div class="panel panel--blue"><p class="eyebrow">Connect your repo</p><h3>GitHub Enterprise, GitLab or AWS CodePipeline</h3><p>We integrate with your existing toolchain. Ask for a sandbox to see the quality gates on your own codebase.</p><p style="margin-top:24px"><a class="btn" href="contact.html?focus=Sandbox%20request">Request a sandbox</a></p></div>
  </div>
</div></section>

<section class="section section--alt" id="engage" aria-labelledby="engage-h"><div class="wrap">
  <div class="sec-head"><p class="eyebrow">Delivery alignment</p><h2 class="h2" id="engage-h">Flexible engagement models</h2><p class="lead">A dedicated pod of senior engineers, or end-to-end ownership of the outcome.</p></div>
  ${engageRows()}
</div></section>

${cta('Ready to accelerate your software roadmap?', 'Meet our chief architects in Melbourne or Can Tho for a non-binding technical discovery session.')}
`});

/* =====================================================================
   AI TRANSFORMATION
   ===================================================================== */
const AIT = [
  ['AI Readiness Assessment', 'Audit codebases, developer workflows, data privacy barriers and team capability to build a tailored AI engineering roadmap.', 'Readiness assessment'],
  ['AI-Augmented Engineering', 'Embed bespoke copilots, automated test harness generators and specialised agent clusters into your existing sprint rituals.', 'AI-augmented engineering'],
  ['AI Adoption Support', 'Upskill squads through pair-programming workshops, prompt engineering for codebases and tool onboarding.', 'Adoption support'],
  ['AI Governance & Quality', 'Deterministic gates against IP leakage, hallucination verification pipelines and ISO/IEC 27001-aligned LLM security architecture.', 'AI governance'],
];
page({
  file: 'ai-transformation.html', title: 'AI Transformation', desc: 'Adopt AI across the entire software development lifecycle with the PTN AI-Augmented Engineering Model: people, process and enterprise-grade governance.',
  body: `
${pageHero({ crumb: '<a href="services.html">Services</a> / AI Transformation', eyebrow: 'AI transformation', h1: 'Transform your software engineering with AI', lead: 'Our AI-Augmented Engineering Model helps organisations adopt AI across the entire lifecycle, with people, process and enterprise-grade technology.', actions: `<a class="btn" href="contact.html?focus=SDLC%20audit">Start an SDLC audit</a><a class="btn btn--soft" href="#offerings">See offerings</a>` })}

${modelBlock('model-h', 'Lifecycle methodology', 'The PTN AI-Augmented Engineering Model', 'Six stages where AI agents work alongside engineers, each with a human approval point.')}

<section class="section" id="offerings" aria-labelledby="off-h"><div class="wrap">
  <div class="sec-head"><p class="eyebrow">Consultancy offerings</p><h2 class="h2" id="off-h">Four ways to start</h2><p class="lead">Structured for engineering leaders who want repeatable velocity without compromising IP or code integrity.</p></div>
  <div class="rows">${AIT.map(([t, d, f], i) => `
    <article class="row reveal"><div><h3>${t}</h3></div><div><p>${d}</p></div><a class="link" href="contact.html?focus=${encodeURIComponent(f)}">Discuss ${f.toLowerCase()} ${ic('arrow')}</a></article>`).join('')}</div>
</div></section>

<section class="section section--alt" aria-labelledby="case-h"><div class="wrap">
  <div class="grid-2" style="align-items:center;gap:clamp(24px,5vw,72px)">
    <div><p class="eyebrow">Engagement story · Financial services</p><h2 class="h2" id="case-h" style="margin-top:16px">Accelerating core banking modernisation by 55%</h2>
      <p class="lead" style="margin-top:20px">An established financial institution needed to decompose a 14-year-old monolithic ledger. An AI-augmented squad analysed legacy COBOL and Java routines and generated cloud-native microservices with unit test coverage above 92%.</p>
      <div class="chips" style="margin-top:24px"><span class="chip">Zero security exceptions</span><span class="chip">APRA &amp; ISO 27001 audited</span><span class="chip">Melbourne &amp; Can Tho</span></div>
    </div>
    <dl class="spec">
      <div><dt>Starting point</dt><dd>14-year-old monolithic ledger, COBOL and Java</dd></div>
      <div><dt>Delivered</dt><dd>Cloud-native microservices, generated and reviewed</dd></div>
      <div><dt>Unit test coverage</dt><dd>Above 92%</dd></div>
      <div><dt>Modernisation speed</dt><dd>55% faster than plan</dd></div>
      <div><dt>Security exceptions</dt><dd>None, APRA and ISO 27001 audited</dd></div>
    </dl>
  </div>
</div></section>

${cta('Start your AI transformation', 'Talk to our principal AI architects about a pilot, a readiness assessment or deterministic development guardrails.', ['contact.html?focus=AI%20transformation', 'Talk to an AI architect'])}
`});

/* =====================================================================
   AI ENGINEERING
   ===================================================================== */
const CAPS = [
  ['spark', 'Generative AI', 'LLM / RAG', 'LLMs, advanced retrieval-augmented generation and model fine-tuning on your own enterprise repositories.', ['Hybrid search', 'Vector indexing', 'Fine-tuning']],
  ['bot', 'AI Agents', 'Autonomous', 'Agents capable of multi-step reasoning, tool execution, stateful memory and cross-system orchestration.', ['ReAct patterns', 'Tool call chains', 'Human-in-the-loop']],
  ['eye', 'Computer Vision', 'Real-time', 'Image and video understanding, defect classification, object tracking and edge-deployed OCR pipelines.', ['Edge inference', 'Document OCR', 'Object detection']],
  ['wave', 'NLP & Speech AI', 'Multilingual', 'Semantic parsing, real-time transcription, voice bots, multilingual synthesis and intent classification.', ['ASR / TTS', 'Semantic extraction', 'Topic modelling']],
  ['db', 'Data & ML', 'MLOps', 'Data pipelines, feature stores, drift analytics and predictive models deployed through CI/CD.', ['Feature stores', 'Drift monitoring', 'Delta Lake']],
  ['plug', 'AI Integration', 'Enterprise core', 'Integrate models into existing architecture: ERPs, CRMs, legacy databases and employee workflow apps.', ['API gateways', 'Event-driven Kafka', 'Zero downtime']],
];
const STAGES = [
  ['POC & Feasibility', '2–4 weeks', 'Verify architecture and data viability before committing capital', 'Instead of months of speculative R&D, our teams stand up isolated sandbox environments within 10 business days and stress-test your priority use cases against ground-truth benchmarks.', [['Eval benchmark harness', 'Scoring on precision, recall, hallucination rate and execution speed.'], ['ROI & token economics', 'Projected model operating cost against human capacity saved.']], ['Functional clickable sandbox prototype', 'Accuracy and hallucination stress report', 'Cloud Architecture Design Document (ADD)', 'Production rollout roadmap and TCO analysis'], 'Book a feasibility assessment'],
  ['Production Hardening', '6–12 weeks', 'Enterprise reliability, guardrails and continuous MLOps', 'Turn verified prototypes into mission-critical software: automated guardrail wrappers, zero-downtime model deployment and real-time inference latency optimisation.', [['ISO 27001 & PII scrubbing', 'Prompt filtering that prevents regulatory breaches and sensitive data exfiltration.'], ['Observability & tracing', 'End-to-end token tracing with Datadog, Langfuse or OpenTelemetry.']], ['Orchestrated Kubernetes inference runtime', 'Vector database clustering with automatic sync', 'Real-time safety guardrails and moderation', '24/7 telemetry monitoring and drift alerting'], 'Plan production rollout'],
  ['Autonomous Enterprise', 'Continuous partnership', 'Self-improving agent collectives across departments', 'Connect specialised agents across departmental boundaries: procurement, customer resolution, compliance monitoring and continuous code refactoring.', [['Agent collective protocols', 'Consensus across asynchronous tool calls and human approvals.'], ['Continuous reinforcement', 'Feedback loops that adapt models to how your users work.']], ['Cross-organisational AI orchestration platform', 'Fine-tuned foundation models you own', 'Executive AI governance and risk committee', 'Dedicated Melbourne–Can Tho engineering pods'], 'Scale enterprise agents'],
];
page({
  file: 'ai-engineering.html', title: 'AI Engineering', desc: 'Enterprise-grade AI applications: generative AI, agents, computer vision, NLP and MLOps, delivered through a three-stage maturity roadmap.',
  body: `
${pageHero({ crumb: '<a href="services.html">Services</a> / AI Engineering', eyebrow: 'AI engineering consultancy', h1: 'Build AI-powered solutions for real impact', lead: 'We architect and deploy enterprise-grade AI: generative AI, agentic workflows, computer vision and production MLOps, from Melbourne and Can Tho.', actions: `<a class="btn" href="contact.html?focus=AI%20engineering">Consult our engineers</a><a class="btn btn--soft" href="case-studies.html">View case studies</a>` })}

<section class="section--tight" aria-labelledby="caps-h"><div class="wrap">
  <div class="sec-head"><p class="eyebrow">Capabilities</p><h2 class="h2" id="caps-h">Six AI engineering capabilities</h2></div>
  <div class="rows">${CAPS.map(([, t, tag, d, chips]) => `
    <article class="row reveal"><div><span class="chip tag">${tag}</span><h3>${t}</h3></div><div><p>${d}</p></div><div class="chips">${chips.map(c => `<span class="chip">${c}</span>`).join('')}</div></article>`).join('')}</div>
</div></section>

<section class="section section--alt" aria-labelledby="mat-h"><div class="wrap">
  <div class="sec-head sec-head--row"><div><p class="eyebrow">Strategic framework</p><h2 class="h2" id="mat-h" style="margin-top:16px">AI engineering maturity matrix</h2><p class="lead" style="margin-top:16px">A de-risked roadmap from raw model capability to audited enterprise ROI.</p></div></div>
  <div class="seg" role="tablist" aria-label="Maturity stages">
    ${STAGES.map(([t], i) => `<button type="button" role="tab" id="st-tab-${i}" aria-controls="st-${i}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">0${i + 1} ${t}</button>`).join('')}
  </div>
  ${STAGES.map(([t, dur, h, p, feats, del, btn], i) => `
  <div class="tabpanel stage-panel" role="tabpanel" id="st-${i}" aria-labelledby="st-tab-${i}" tabindex="0"${i ? ' hidden' : ''}>
    <div><p class="eyebrow">Stage ${i + 1} · ${t}</p><h3>${h}</h3><p>${p}</p>
      <div class="feat2">${feats.map(([b, d]) => `<div><b>${b}</b><p>${d}</p></div>`).join('')}</div></div>
    <div class="deliver"><header><b>Stage ${i + 1} deliverables</b><span class="chip">${dur}</span></header>
      <ul>${del.map(x => `<li>${ic('check')}${x}</li>`).join('')}</ul>
      <a class="btn" href="contact.html?focus=${encodeURIComponent('AI stage ' + (i + 1) + ': ' + t)}">${btn}</a></div>
  </div>`).join('')}
</div></section>

${cta("Let's build what's next in AI", 'Work directly with our principal AI architects in Australia and Vietnam to validate cost-to-value and deploy production-hardened models.', ['contact.html?focus=AI%20engineering', 'Talk to our team'])}
`});

/* =====================================================================
   INDUSTRIES
   ===================================================================== */
const SECTORS = [
  ['Healthcare', 'regulated', 'Compliant telemedicine infrastructure, automated patient triage and HIPAA / HL7-compliant diagnostic data fabrics for healthcare institutions and biotech.', ['HIPAA / HL7 FHIR', 'Telehealth core', 'Diagnostic AI'], 'healthcare'],
  ['Financial Services', 'regulated enterprise', 'Resilient banking backbones, anti-fraud inference models and low-latency transaction layers for banking groups and licensed neo-financial entities.', ['Real-time fraud AI', 'PCI-DSS core', 'RegTech ops'], 'financial'],
  ['Education', 'growth', 'Next-generation LMS ecosystems, engagement assessment engines and GenAI tutoring copilots for universities and education groups.', ['Adaptive curricula', 'Scalable LMS', 'Student analytics'], 'education'],
  ['Enterprise', 'enterprise', 'De-risked legacy migrations, unified ERP pipelines and multi-tenant cloud-native SaaS platforms built for scale and fault tolerance.', ['Legacy modernisation', 'Multi-tenant cloud', 'Zero-downtime CI/CD'], ''],
  ['Manufacturing', 'growth enterprise', 'Edge telemetry, predictive maintenance AI, optical quality inspection and responsive SCADA / MES interfaces.', ['Predictive maintenance', 'Edge telemetry', 'Visual QC AI'], ''],
  ['Government', 'regulated', 'Public-sector modernisation with sovereign compliance, air-gapped machine intelligence, accessible citizen portals and zero-trust security.', ['Sovereign data', 'Zero-trust security', 'Accessible portals'], ''],
];
const MATCH = {
  health: { tag: 'Healthcare spec', title: 'Telehealth & Clinical Data Fabric', body: 'Architecture pattern optimised for HL7/FHIR integration, low-latency video consultations and HIPAA-compliant data lakes.', squad: '1 solution architect, 2 senior Python/FastAPI engineers, 1 MedTech compliance lead, 1 DevOps engineer' },
  fin: { tag: 'Fintech spec', title: 'High-Throughput Payment Orchestrator', body: 'PCI-DSS microservices cluster with real-time fraud scoring over low-latency Kafka event streams.', squad: '1 principal architect, 2 Go/Java core engineers, 1 ML fraud specialist, 1 DevSecOps engineer' },
  edu: { tag: 'EdTech spec', title: 'Adaptive Learning & LLM Tutor Engine', body: 'Scalable multi-tenant LMS with vector-embedded knowledge bases and real-time student performance analytics.', squad: '1 tech lead, 2 full-stack React/Node engineers, 1 GenAI engineer, 1 QA automation engineer' },
  ent: { tag: 'Enterprise spec', title: 'Zero-Downtime Cloud Migration Core', body: 'Monolith-to-microservices modernisation framework with automated database synchronisation and Terraform IaC.', squad: '1 enterprise cloud architect, 3 senior backend engineers, 1 site reliability engineer' },
  mfg: { tag: 'Industry 4.0 spec', title: 'Edge IoT & Optical Inspection Fabric', body: 'Sub-second computer vision quality control at factory edge nodes, with centralised cloud telemetry.', squad: '1 embedded systems architect, 2 computer vision/C++ engineers, 1 cloud IoT engineer' },
  gov: { tag: 'GovTech spec', title: 'Sovereign Zero-Trust Public Portal', body: 'Air-gapped identity verification meeting public-sector accessibility and data sovereignty requirements.', squad: '1 security architect, 2 full-stack engineers, 1 accessibility specialist, 1 SecOps engineer' },
};
page({
  file: 'industries.html', title: 'Industries', desc: 'Experience across healthcare, financial services, education, enterprise, manufacturing and government, with architecture blueprints for each.',
  body: `
${pageHero({ crumb: 'Industries', eyebrow: 'Industries', h1: 'Real experience across key industries', lead: 'We help forward-looking organisations modernise legacy workflows, put bespoke AI into operation and secure mission-critical platforms.' })}

<section class="section--tight" aria-labelledby="sec-h"><div class="wrap">
  <h2 class="sr-only" id="sec-h">Sectors</h2>
  <div class="seg" data-filter role="group" aria-label="Filter sectors">
    <button type="button" aria-pressed="true" data-value="all">All sectors</button>
    <button type="button" aria-pressed="false" data-value="regulated">Regulated &amp; government</button>
    <button type="button" aria-pressed="false" data-value="growth">High-growth tech</button>
    <button type="button" aria-pressed="false" data-value="enterprise">Enterprise scale</button>
  </div>
  <p class="filter-status" id="sector-status" role="status">Showing 6 of 6 sectors</p>
  <div class="sector-list" style="margin-top:16px">${SECTORS.map(([t, g, d, chips, cs], i) => `
    <article class="sector" data-group="${g}"><h3>${t}</h3>
      <div><p>${d}</p><div class="chips">${chips.map(c => `<span class="chip">${c}</span>`).join('')}</div></div>
      ${cs ? `<a class="link" href="case-studies.html#${cs}">Read the case study ${ic('arrow')}</a>` : `<a class="link" href="contact.html?focus=${encodeURIComponent(t)}">Discuss a ${t.toLowerCase()} project ${ic('arrow')}</a>`}
    </article>`).join('')}</div>
</div></section>

<section class="section section--alt" aria-labelledby="match-h"><div class="wrap">
  <div class="matcher">
    <div><p class="eyebrow">Architecture matcher</p><h2 class="h2" id="match-h" style="margin-top:16px">Have a domain-specific challenge?</h2>
      <p class="lead" style="margin-top:16px">Pick your sector to see a matching architecture blueprint and the squad we would typically assemble.</p>
      <div class="field" style="margin-top:32px;max-width:420px"><label for="matcher-select">Your sector</label>
        <select class="select" id="matcher-select" aria-controls="matcher-out">
          <option value="health">Healthcare &amp; life sciences</option><option value="fin">Financial services &amp; RegTech</option><option value="edu">Education &amp; EdTech</option><option value="ent">Enterprise cloud &amp; SaaS</option><option value="mfg">Manufacturing &amp; Industry 4.0</option><option value="gov">Public sector &amp; sovereign data</option>
        </select></div>
    </div>
    <div class="matcher__out" id="matcher-out" aria-live="polite">
      <p class="eyebrow">${MATCH.health.tag}</p><h3>${MATCH.health.title}</h3><p>${MATCH.health.body}</p>
      <dl><div><dt>Recommended squad</dt><dd>${MATCH.health.squad}</dd></div><div><dt>Typical deployment cycle</dt><dd>6–12 weeks</dd></div></dl>
      <p style="margin-top:24px"><a class="btn btn--light btn--sm" href="contact.html?focus=Healthcare%20spec">Discuss this blueprint</a></p>
    </div>
  </div>
  <script type="application/json" id="matcher-data">${JSON.stringify(MATCH)}</script>
</div></section>

<section class="section" aria-labelledby="track-h"><div class="wrap">
  <div class="sec-head"><p class="eyebrow">Proven outcomes</p><h2 class="h2" id="track-h">Cross-domain delivery track record</h2><p class="lead">One delivery methodology, certified by CPG and governed by ISO-mandated confidentiality.</p></div>
  ${ledger([['98%', 'On-time sprints'], [tbc('120+', 'the Services page shows both 120+ and 115 enterprise deployments'), 'Enterprise deployments'], ['ISO/IEC 27001', 'Independently audited'], ['Since 2019', 'Sustained partnerships']])}
  <div class="panel" style="margin-top:32px;display:flex;flex-wrap:wrap;gap:24px;align-items:center;justify-content:space-between">
    <div style="max-width:60ch"><b style="font-size:1.125rem">Confidentiality and IP protection</b><p>Every engagement runs on isolated development environments, under strict NDAs and contracts governed by Australian law.</p></div>
    <a class="btn btn--line" href="${CERT_URL}" target="_blank" rel="noopener">View the audit certificate<span class="sr-only"> (opens in a new tab)</span> ${ic('link2')}</a>
  </div>
</div></section>

${cta('Speak with an industry specialist', 'Book an obligation-free 30-minute call with our technical leads in Melbourne or Can Tho to assess your roadmap and architecture.', ['contact.html?focus=Industry%20specialist', 'Book a 30-minute call'])}
`});

/* =====================================================================
   CASE STUDIES
   ===================================================================== */
const CASES = [
  ['healthcare', 'Healthcare', 'Document AI & workflow automation', 'Making healthcare documents easier to process', 'AI-assisted document processing that helps teams capture and review information from medical forms and records.', ['Document AI', 'OCR', 'Cloud integration'], 'Scanned forms and inconsistent formats make information capture slow and hard to standardise.', 'OCR and AI-assisted extraction, with human review and validation before information moves downstream.', 'Less repetitive handling, more consistent capture and clearer review processes.'],
  ['financial', 'Financial', 'Platform modernisation', 'Modernising connected financial platforms', 'A modular, event-driven approach to evolving established financial applications and their critical integrations.', ['Event-driven systems', 'Integration', 'Cloud & DevOps'], 'Tightly coupled legacy services make it hard to add capability without affecting existing processes.', 'Map dependencies, define clearer service boundaries and introduce event-driven integrations through controlled change.', 'A more adaptable architecture, clearer integrations and more manageable change.'],
  ['education', 'Education', 'Digital learning experiences', 'Building more connected learning experiences', 'Digital learning, mobile access and personalisation brought together into one coherent student experience.', ['Learning platforms', 'Mobile', 'Analytics'], 'Fragmented learning and support tools make relevant content hard to find across devices.', 'Connect learning services, support mobile access and use analytics to guide personalised interactions.', 'Easier access to resources, more relevant interactions and a foundation for ongoing improvement.'],
];
page({
  file: 'case-studies.html', title: 'Case Studies', desc: 'How PTN Global applies engineering, cloud and AI to challenges in healthcare, financial services and education.',
  body: `
${pageHero({ crumb: 'Case Studies', eyebrow: 'Case studies', h1: 'Software challenges. Practical solutions.', lead: 'How engineering, cloud and AI address real challenges in healthcare, financial services and education.' })}

<section class="section--tight" aria-labelledby="cs-h"><div class="wrap">
  <h2 class="h2" id="cs-h">Three industries, three engineering stories</h2>
  <div class="seg" role="tablist" aria-label="Industry" style="margin-top:24px">
    ${CASES.map(([id, t], i) => `<button type="button" role="tab" id="cs-tab-${id}" aria-controls="${id}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">${t}</button>`).join('')}
  </div>
  ${CASES.map(([id, , eb, h, p, chips, ch, ap, val], i) => `
  <div class="tabpanel case" role="tabpanel" id="${id}" aria-labelledby="cs-tab-${id}" tabindex="0"${i ? ' hidden' : ''}>
    <div><p class="eyebrow">${eb}</p><h3>${h}</h3><p>${p}</p><div class="chips">${chips.map(c => `<span class="chip">${c}</span>`).join('')}</div>
      <p style="margin-top:32px"><a class="btn btn--sm" href="contact.html?focus=${encodeURIComponent(h)}">Discuss a similar project</a></p></div>
    <div><dl class="cdl"><div><dt>The challenge</dt><dd>${ch}</dd></div><div><dt>Our approach</dt><dd>${ap}</dd></div><div><dt>Business value</dt><dd>${val}</dd></div></dl>
      <p class="fine">Sector overview. Client-identifying details and measured results are subject to client approval.</p></div>
  </div>`).join('')}
  <p class="muted" style="margin-top:24px;font-size:.9375rem">Working in enterprise, manufacturing or government? <a class="link" href="contact.html?focus=Case%20study%20request">Ask us for a relevant reference ${ic('arrow')}</a></p>
</div></section>

<section class="section section--alt" aria-labelledby="t-h"><div class="wrap">
  <p class="eyebrow" id="t-h">What our partners say</p>
  <div style="margin-top:24px;max-width:900px">${testimonial()}</div>
</div></section>

${cta('Have a software challenge of your own?', 'Tell us what you need to build or improve, and we will help you find the next practical step.', ['contact.html', 'Discuss your project'], null)}
`});

/* =====================================================================
   COMPANY
   ===================================================================== */
const VALUES = [['Honesty', 'Radical candour on technical feasibility, estimates, code status and architectural trade-offs.'], ['Transparency', 'Open repositories, live sprint burndowns, clear cost breakdowns and no hidden overheads.'], ['Trust & mutual respect', 'Psychological safety, peer accountability and cross-cultural empathy across borders.'], ['Teamwork', 'Collective code ownership: product success belongs to the whole squad.'], ['Listen & learn', 'Continuous retrospectives, active client listening and fast adoption of new AI practice.']];
page({
  file: 'company.html', title: 'Who We Are', desc: 'Founded in Melbourne in 2019 by Tam Phan, PTN Global pairs Australian accountability with engineering talent in Can Tho, Vietnam.',
  body: `
${pageHero({ crumb: 'Company', eyebrow: 'Who we are', h1: 'Offshore engineering, led from Melbourne', lead: 'Founded in Melbourne by Tam Phan, PTN Global partners with forward-thinking enterprises to build, modernise and scale software through custom AI, cloud architecture and disciplined delivery from Vietnam.', actions: `<a class="btn" href="contact.html">Talk to a Melbourne lead</a>` })}

<section aria-label="Company at a glance"><div class="wrap">${ledger([['2019', 'Founded in Melbourne'], [ENG, 'Engineers in Can Tho'], ['98.4%', 'Client retention'], ['ISO/IEC 27001', 'Audited by CPG']])}<p class="tbc-key" style="margin-top:12px"><span class="tbc">Dotted</span> = figure to confirm before launch (conflicting values on the current site).</p></div></section>

<section class="section" aria-labelledby="pil-h"><div class="wrap">
  <div class="sec-head"><p class="eyebrow">Operating architecture</p><h2 class="h2" id="pil-h">Three pillars of global capability</h2><p class="lead">Executive leadership rooted in Australian enterprise accountability, amplified by Vietnam's software engineering ecosystem.</p></div>
  <div class="rows">
    <article class="row reveal"><div><span class="chip tag">Governance &amp; strategy</span><h3>Australia headquarters</h3></div><p>Level 11, 101 Bourke Street, Melbourne. Client accountability, technology leadership, solution architecture and engagement management.</p><div class="chips"><span class="chip">AEST / AEDT</span></div></article>
    <article class="row reveal"><div><span class="chip tag">Delivery core</span><h3>Vietnam engineering centre</h3></div><p>Can Tho R&amp;D Technology Park. Full-stack squads, AI research labs, DevSecOps pipelines and ISO-certified infrastructure.</p><div class="chips"><span class="chip">${tbc('200+ seats', 'capacity figure appears as 200+ seats here and 120+/150+ engineers elsewhere')}</span></div></article>
    <article class="row reveal"><div><span class="chip tag">Squad orchestration</span><h3>Global delivery model</h3></div><p>One operational rhythm across borders: two-week sprints, minimal hand-off friction, English-proficient leads and cultural alignment across Asia-Pacific.</p><div class="chips"><span class="chip">Two-week sprints</span></div></article>
  </div>
</div></section>

<section class="section section--alt" aria-labelledby="mv-h"><div class="wrap">
  <h2 class="sr-only" id="mv-h">Mission and vision</h2>
  <div class="grid-2">
    <div class="panel panel--blue"><p class="eyebrow">Our mission</p><h3 class="h2" style="font-size:clamp(1.5rem,1.2rem+1vw,2rem)">Lasting commercial value through people, integrity and AI</h3><p>To be a trusted technology partner helping organisations create lasting commercial value through world-class people, high-integrity technology and transformative AI innovation.</p></div>
    <div class="panel panel--green"><p class="eyebrow">Our vision</p><h3 class="h2" style="font-size:clamp(1.5rem,1.2rem+1vw,2rem)">Every enterprise able to use AI and global talent well</h3><p>A future where every forward-thinking enterprise can unlock AI, modern cloud platforms and global engineering talent to outpace change.</p></div>
  </div>
</div></section>

<section class="section" aria-labelledby="val-h"><div class="wrap">
  <div class="sec-head"><p class="eyebrow">Core values</p><h2 class="h2" id="val-h">Standards we hold in every review, sprint and meeting</h2></div>
  <div class="values">${VALUES.map(([t, d], i) => `<div><b>${t}</b><p>${d}</p></div>`).join('')}</div>
</div></section>

<section class="section section--alt" aria-labelledby="sec-gov-h"><div class="wrap">
  <div class="grid-2" style="gap:clamp(24px,5vw,72px);align-items:center">
    <div><p class="eyebrow">Security &amp; quality governance</p><h2 class="h2" id="sec-gov-h" style="margin-top:16px">Offshore delivery without weaker security</h2>
      <p class="lead" style="margin-top:16px">Our centres run an audited information security management system, so your IP, customer data and production systems stay protected end to end.</p>
      <ul class="checklist">
        <li>${ic('check')}<span><b>ISO/IEC 27001 certified.</b> Independent CPG audit of our ISMS, not a self-assessment.</span></li>
        <li>${ic('check')}<span><b>Privacy aligned.</b> Practices mapped to the Australian Privacy Principles and client data-handling requirements.</span></li>
        <li>${ic('check')}<span><b>Cross-border coverage.</b> The same controls across Melbourne leadership and Can Tho engineering.</span></li>
      </ul></div>
    <div class="panel cert"><div class="cert__seal">ISO<br>27001<small>CPG AUDITED</small></div>
      <div><b>Certified information security</b><p>Certificate file number <span class="mono">ISMS/20/R84/1419</span> (CPG). Scope: software development, testing, enhancement and maintenance from our Can Tho delivery centre.</p>
      <p style="margin-top:12px"><a class="link" href="${CERT_URL}" target="_blank" rel="noopener">Verify on CPG<span class="sr-only"> (opens in a new tab)</span> ${ic('link2')}</a></p></div></div>
  </div>
</div></section>

${tzBlock('tz-company-h')}

${cta('Ready to scale with senior offshore teams?', 'Book a discovery conversation with our Melbourne practice leaders. We map your stack, team structure and roadmap in days, not months.')}
`});

/* =====================================================================
   CAREERS
   ===================================================================== */
const JOBS = [
  ['Senior AI / Fullstack Engineer', 'AI LABS', 'ai', 'Senior', 'Can Tho', 'Full-time', 'Architect and deploy generative AI pipelines, RAG frameworks and high-throughput Python / TypeScript services for enterprise clients.'],
  ['UI/UX Product Designer', 'PRODUCT DESIGN', 'design', 'Mid-Senior', 'Can Tho', 'Full-time', 'Lead user journeys, design enterprise design systems and turn complex AI interaction patterns into clear desktop and web interfaces.'],
  ['Junior AI Research Engineer', 'AI RESEARCH', 'ai', 'Junior', 'Can Tho', 'Full-time', 'Explore embedding techniques, prompt engineering benchmarks and synthetic test data under senior mentorship.'],
  ['Technical Business Analyst', 'CONSULTING', 'consulting', 'All levels', 'Can Tho', 'Full-time', 'Be the bilingual bridge between Australian client stakeholders and Vietnam delivery pods.'],
  ['Senior Automation QA Engineer', 'QUALITY ENG', 'qa', 'Senior', 'Can Tho', 'Full-time', 'Build test automation harnesses, Playwright / Cypress end-to-end suites and API load telemetry for banking platforms.'],
  ['Cloud & DevOps Architect', 'DEVSECOPS', 'devops', 'Lead', 'Can Tho, Melbourne', 'Full-time', 'Lead AWS and Azure infrastructure as code (Terraform), Kubernetes governance and ISO 27001-compliant CI/CD security controls.'],
  ['LLM & NLP Solutions Specialist', 'AI SOLUTIONS', 'ai', 'Mid-Senior', 'Can Tho', 'Full-time', 'Fine-tune open-source models (Llama, Mistral), work with vector databases (Pinecone, Qdrant) and orchestrate agentic tasks.'],
  ['On-the-Job Training Program (OJT)', 'OJT ACADEMY', 'training', 'OJT', 'Can Tho', '3 months, paid', 'Hands-on training on live products for Australian clients, with senior mentoring and a path to a full-time role. Rolling intake 2026.'],
];
const apply = t => `mailto:${EMAIL}?subject=${encodeURIComponent('Job application: ' + t)}&body=${encodeURIComponent(`Hello PTN Global team,\n\nI would like to apply for ${t}.\nMy CV is attached.\n\nName:\nPhone:\nPortfolio / LinkedIn (optional):\n\nKind regards,\n`)}`;
page({
  file: 'careers.html', title: 'Careers', desc: 'Open positions at PTN Global in Can Tho and Melbourne: AI engineering, product design, QA, DevOps, consulting and paid on-the-job training.',
  body: `
${pageHero({ crumb: 'Careers', eyebrow: 'Careers at PTN Global', h1: 'Do the best work of your career on real AI products', lead: 'Work on meaningful software and AI projects for Australian enterprise clients, with senior mentorship and a clear path to grow.', actions: `<a class="btn" href="#board">See open roles</a>` })}

<section class="section--tight" id="board" aria-labelledby="board-h"><div class="wrap">
  <h2 class="h2" id="board-h" style="margin-bottom:24px">Open positions</h2>
  <form class="job-tools" role="search" onsubmit="return false">
    <div class="field"><label for="job-q">Search roles</label><input class="input" id="job-q" type="search" placeholder="Title, skill or keyword" autocomplete="off"></div>
    <div class="field"><label for="job-dept">Team</label><select class="select" id="job-dept"><option value="">All teams</option><option value="ai">AI &amp; data engineering</option><option value="design">Product design</option><option value="consulting">Business &amp; consulting</option><option value="qa">Quality assurance</option><option value="devops">Cloud &amp; DevOps</option><option value="training">Training &amp; internships</option></select></div>
    <div class="field"><label for="job-level">Level</label><select class="select" id="job-level"><option value="">All levels</option><option>Junior</option><option>Mid-Senior</option><option>Senior</option><option>Lead</option><option>All levels</option><option>OJT</option></select></div>
    <div class="field"><label for="job-loc">Location</label><select class="select" id="job-loc"><option value="">All locations</option><option>Can Tho</option><option>Melbourne</option></select></div>
  </form>
  <p class="job-count" id="job-count" role="status">${JOBS.length} open positions</p>
  <ul class="jobs" id="jobs">${JOBS.map(([t, team, dept, lvl, loc, type, d]) => `
    <li class="job" data-dept="${dept}" data-level="${lvl}" data-loc="${loc}"><details>
      <summary><div><h3>${t}</h3><div class="meta"><span class="chip">${team}</span><span>${loc}</span><span class="dot"></span><span>${lvl}</span><span class="dot"></span><span>${type}</span></div></div>
        <span class="plus" aria-hidden="true">${ic('plus')}</span></summary>
      <div class="job__body">
        <div><h4>Role overview</h4><p>${d}</p><h4 style="margin-top:20px">Growth &amp; mentorship</h4><p>1-on-1 technical mentorship, continuous code reviews, structured promotion tracks and funded certification pathways.</p></div>
        <div><h4>Benefits</h4><ul><li>13th-month salary, performance incentives, health and social insurance</li><li>40-hour week, Monday to Friday, flexible hybrid schedule</li><li>Support for technical and English certifications</li></ul>
          <div class="actions"><a class="btn" href="${apply(t)}">Apply by email</a></div><p class="fine">Opens an email draft to ${EMAIL}. Attach your CV before sending.</p></div>
      </div></details></li>`).join('')}</ul>
  <div class="empty" id="jobs-empty" hidden><p><b>No roles match these filters.</b></p><p style="margin-top:8px">Try a broader search, or send us your CV for future openings.</p><p style="margin-top:16px" class="actions" ><button class="btn btn--soft btn--sm" type="button" id="jobs-reset">Clear filters</button><a class="btn btn--sm" href="${apply('General application')}">Send a general application</a></p></div>
</div></section>

${cta("Don't see your role?", 'We are always glad to meet engineers, designers and analysts who care about craft. Send us your CV.', [apply('General application'), 'Send a general application'], ['company.html', 'About PTN Global'])}
`});

/* =====================================================================
   CONTACT
   ===================================================================== */
page({
  file: 'contact.html', title: 'Contact', desc: 'Talk to PTN Global about your technology challenge. Melbourne headquarters, Can Tho delivery centre, response within one business day.',
  body: `
${pageHero({ crumb: 'Contact', eyebrow: 'Contact us', h1: "Let's start a conversation", lead: 'Tell us about your technology challenge. A senior architect reads every message and replies within one business day.' })}

<section class="section--tight" aria-label="Contact form and offices"><div class="wrap contact-layout">
  <form class="panel" id="contact-form" novalidate aria-describedby="form-req">
    <p id="form-req" class="muted" style="font-size:.875rem;margin-bottom:24px">Fields marked <span class="req" aria-hidden="true">*</span><span class="sr-only">with an asterisk</span> are required.</p>
    <div class="form-grid">
      ${[['f-first', 'First name', 'text', 'given-name'], ['f-last', 'Last name', 'text', 'family-name'], ['f-company', 'Company', 'text', 'organization'], ['f-email', 'Work email', 'email', 'email']].map(([id, l, type, ac]) => `
      <div class="field"><label for="${id}">${l} <span class="req" aria-hidden="true">*</span></label><input class="input" id="${id}" name="${id}" type="${type}" autocomplete="${ac}" required aria-describedby="${id}-err"><p class="err" id="${id}-err">${ic('alert')}<span></span></p></div>`).join('')}
      <div class="field full"><label for="f-focus">What do you need help with?</label><select class="select" id="f-focus" name="focus"><option>AI engineering &amp; LLM platforms</option><option>Software modernisation &amp; cloud</option><option>Dedicated engineering pods</option><option>AI-augmented SDLC transformation</option><option>Enterprise architecture advisory</option><option>Not sure yet</option></select></div>
      <div class="field full"><label for="f-time">Timeline &amp; budget</label><select class="select" id="f-time" name="timeline"><option>Discovery / scoping</option><option>Start within 1–3 weeks · $50k–$100k</option><option>Next quarter · $100k–$250k</option><option>Enterprise scale · $250k+</option></select></div>
      <div class="field full"><label for="f-msg">How can we help? <span class="req" aria-hidden="true">*</span></label><p class="hint" id="f-msg-hint">Briefly describe your systems, goals or timeline.</p><textarea class="textarea" id="f-msg" name="message" required aria-describedby="f-msg-hint f-msg-count f-msg-err"></textarea><p class="hint" id="f-msg-count">0 / 20 minimum</p><p class="err" id="f-msg-err">${ic('alert')}<span></span></p></div>
      <label class="check-row full"><input type="checkbox" name="nda"> <span>Apply a mutual NDA to everything we share during discovery.</span></label>
      <div class="full"><div id="form-status" class="form-status" role="status" tabindex="-1" hidden></div></div>
      <div class="full actions"><button class="btn" type="submit">Send message</button><span class="muted" style="font-size:.875rem">We reply within one business day.</span></div>
    </div>
  </form>
  <div class="side-stack">
    <div class="panel"><p class="eyebrow">Email us directly</p><p style="margin-top:12px"><a class="link" style="font-size:1.25rem" href="mailto:${EMAIL}">${EMAIL}</a></p><p class="muted" style="font-size:.9375rem">Tech leads are available for NDA-secured architecture calls.</p></div>
    <div class="panel"><p class="eyebrow">Melbourne · Headquarters</p><address style="font-style:normal;margin-top:12px">Level 11, 101 Bourke Street<br>Melbourne VIC 3000, Australia</address><div class="chips" style="margin-top:12px"><span class="chip">AEST / AEDT</span><span class="chip">Executive governance</span></div></div>
    <div class="panel"><p class="eyebrow">Can Tho · Delivery centre</p><address style="font-style:normal;margin-top:12px">R&amp;D Technology Park<br>Can Tho, Vietnam</address><div class="chips" style="margin-top:12px"><span class="chip">${ENG}&nbsp;engineers</span><span class="chip">ISO 27001 facility</span></div></div>
    <div class="panel panel--blue"><p class="eyebrow">Prefer to read first?</p><p style="margin-top:12px">See how we approach legacy refactoring and GenAI integration.</p><p style="margin-top:16px" class="actions"><a class="btn btn--sm" href="case-studies.html">Read case studies</a><a class="btn btn--sm btn--line" href="ai-transformation.html">Our AI model</a></p></div>
  </div>
</div></section>
`});

/* =====================================================================
   LEGAL (placeholder until legal copy is supplied)
   ===================================================================== */
page({
  file: 'legal.html', title: 'Privacy & Terms', desc: 'PTN Global privacy policy and terms of service.',
  body: `
${pageHero({ crumb: 'Privacy &amp; Terms', eyebrow: 'Legal', h1: 'Privacy policy and terms of service', lead: 'How PTN Global handles personal information and the terms for using this website.' })}
<section class="section--tight"><div class="wrap prose">
  <h2 class="h2" id="privacy" style="margin-bottom:16px">Privacy policy</h2>
  <div class="placeholder" role="note"><b>Content required.</b> Legal to supply the privacy policy (aligned with the Australian Privacy Principles). The current site links "Privacy Policy" to the contact page.</div>
  <h2 class="h2" id="terms" style="margin:48px 0 16px">Terms of service</h2>
  <div class="placeholder" role="note"><b>Content required.</b> Legal to supply the website terms of service.</div>
  <p style="margin-top:32px">Questions about privacy? Email <a class="link" href="mailto:${EMAIL}">${EMAIL}</a>.</p>
</div></section>
`});
