// PTN Global v3 static site generator.
// IA and copy: the "All New Website" wireframe (../../js, ../../data/docs.json) rendered and extracted to data/*.json,
// plus the earlier dev site (AI delivery model, case overviews). Run: node v3/src/build.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CERTS, JOBS, PERKS, PRINCIPLES, OFFICES, TOPICS, WHITEPAPERS, NEWSLETTERS, TESTIMONIAL } from './vendor/assets.mjs';
import { MODELS } from './vendor/engagement.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, '..');
const J = f => JSON.parse(readFileSync(join(HERE, f), 'utf8'));
const DOCS = J('../../data/docs.json');
const PAGES = J('data/pages.json');
const SVC = J('data/services.json');
const MAP = J('data/map.json');

/* ---------- utils ---------- */
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const slug = s => s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const tagOf = it => it.slice(0, it.indexOf(':'));
const txtOf = it => it.slice(it.indexOf(':') + 2);
const sec = (src, route, re) => { const s = src[route].find(x => x.items.some(i => /^h[12]: /.test(i) && re.test(txtOf(i)))); if (!s) throw new Error(`no section ${re} on ${route}`); return s.items; };
const pairs = (items, a = 'h3', b = 'p') => { const out = []; let cur = null; for (const it of items) { const t = tagOf(it); if (t === a) { cur = { t: txtOf(it), d: '' }; out.push(cur); } else if (t === b && cur && !cur.d) cur.d = txtOf(it); } return out; };
const groups = items => { const out = []; let cur = null; for (const it of items) { const t = tagOf(it); if (t === 'h3') { cur = { h: txtOf(it), li: [] }; out.push(cur); } else if (t === 'li' && cur) cur.li.push(txtOf(it)); } return out.filter(g => g.li.length); };
const faqs = items => { const out = []; let cur = null; for (const it of items) { const t = tagOf(it); if (t === 'summary' || (t === 'span' && /\?$/.test(txtOf(it)))) { cur = { q: txtOf(it).replace(/^\d+\.\s*/, ''), a: '' }; out.push(cur); } else if (t === 'p' && cur && !cur.a) cur.a = txtOf(it); } return out.filter(f => f.a); };
const firstP = (items, after) => { const i = items.findIndex(x => after.test(x)); return i < 0 ? '' : txtOf(items.slice(i + 1).find(x => tagOf(x) === 'p') || 'p: '); };
// Answers in the docs use " - " for inline bullets; turn them into lists.
const richText = s => { const parts = String(s).split(/\s-\s(?=[A-Z0-9])/); if (parts.length < 3) return `<p>${esc(s)}</p>`; return `<p>${esc(parts[0])}</p><ul class="checklist">${parts.slice(1).map(p => `<li>${ic('check')}<span>${esc(p)}</span></li>`).join('')}</ul>`; };
const fixCase = s => s.replace(/\bai & machine learning\b/i, 'AI & machine learning');

/* ---------- icons ---------- */
const P = {
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>', chev: '<path d="m6 9 6 6 6-6"/>', check: '<path d="m5 12 5 5 9-10"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>', close: '<path d="M6 6l12 12M18 6 6 18"/>', plus: '<path d="M12 5v14M5 12h14"/>',
  shield: '<path d="M12 3 4 6v6c0 4.5 3.4 8.3 8 9 4.6-.7 8-4.5 8-9V6l-8-3Z"/><path d="m9 12 2 2 4-4"/>', ext: '<path d="M7 17 17 7M9 7h8v8"/>',
  phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>', mail: '<rect x="3" y="5" width="18" height="14" rx="1"/><path d="m3 7 9 6 9-6"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>', download: '<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',
};
const ic = (n, cls = 'i') => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${P[n]}</svg>`;
const tbc = (v, note) => `<span class="tbc" title="${esc('To confirm: ' + note)}">${v}<span class="sr-only"> (to confirm: ${esc(note)})</span></span>`;

/* ---------- facts ---------- */
const CONTACT = { phone: '+61 414 734 277', tel: '+61414734277', email: 'enquiry@ptnglobalcorp.com' };
const CERT = CERTS[0];
const MEL = OFFICES[0], CT = OFFICES[1];
const SERVICE_CATS = DOCS.structure.services; // 5 categories, 22 services
const DETAIL = new Set(Object.keys(DOCS.services));
const svcHref = s => (DETAIL.has(s.slug) ? `service-${s.slug}.html` : `services.html?cat=${slug(catOf(s.slug))}#catalogue`);
const catOf = sl => SERVICE_CATS.find(c => c.items.some(i => i.slug === sl))?.category || '';
const HOME_CATS = pairs(sec(PAGES, '/home', /We Build Best Service Experience/)); // category blurbs
const catBlurb = name => HOME_CATS.find(c => c.t === name)?.d || '';
const CLIENT_NAMES = ['Member Benefits Australia', 'The Florey', 'CCIA', 'ReadyTech', 'oncall', 'interpreters', 'soundstack'];

/* AI-augmented delivery stages, from the earlier dev site */
const SDLC = [
  ['BA & analysis', 'Automated PRD compilation, edge-case discovery and stakeholder intent synthesis from raw conversations.'],
  ['Product & design', 'Design-token propagation, component hierarchy synthesis and rapid, accessible UI prototyping.'],
  ['Development', 'Multi-agent pair programming, scaffold synthesis, AST-level refactoring and context-aware migrations.'],
  ['QA & testing', 'Synthetic user journeys, self-healing regression suites and security fuzzing in CI.'],
  ['DevOps & release', 'Canary evaluations, gated dependency upgrades and infrastructure drift remediation.'],
  ['Ops & support', 'Root-cause triage, runbook execution with approval and early anomaly detection.'],
];

/* Case studies: one client testimonial plus sector overviews and the core banking story from the dev site */
const CASES = [
  { id: 'core-banking', cats: ['Emerging Technologies', 'Cloud & DevOps'], tag: 'Financial services · AI-augmented modernisation', title: 'Accelerating core banking modernisation by 55%',
    sum: 'An AI-augmented squad decomposed a 14-year-old monolithic ledger into cloud-native microservices.',
    facts: [['Client', 'Established financial institution (name withheld)'], ['Industry', 'Financial services'], ['Services', 'AI-augmented engineering, legacy modernisation'], ['Team', 'Melbourne and Can Tho']],
    challenge: 'An established financial institution needed to decompose a 14-year-old monolithic ledger without disrupting the processes that depend on it.',
    solution: 'PTN deployed an AI-augmented transformation squad that analysed legacy COBOL and Java routines and generated modern cloud-native microservices, with engineers reviewing every change.',
    results: ['Modernisation completed 55% faster than planned', 'Unit test coverage above 92%', 'Zero security exceptions, with APRA and ISO 27001 audits'],
    tech: ['COBOL', 'Java', 'Microservices', 'Cloud-native', 'Automated test generation'] },
  { id: 'healthcare-document-ai', cats: ['Emerging Technologies'], tag: 'Healthcare · Document AI', title: 'Making healthcare documents easier to process',
    sum: 'AI-assisted document processing that helps teams capture and review information from medical forms and records.',
    facts: [['Industry', 'Healthcare'], ['Services', 'Document AI, OCR, cloud integration'], ['Format', 'Sector overview']],
    challenge: 'Scanned forms and inconsistent document formats make information capture slow and hard to standardise.',
    solution: 'OCR and AI-assisted extraction, with human review and validation before information moves into downstream workflows.',
    results: ['Less repetitive document handling', 'More consistent information capture', 'Clearer review processes'],
    tech: ['OCR', 'AI-assisted extraction', 'Cloud integration'] },
  { id: 'financial-platform-modernisation', cats: ['Core Application Development', 'Cloud & DevOps'], tag: 'Financial services · Platform modernisation', title: 'Modernising connected financial platforms',
    sum: 'A modular, event-driven approach to evolving established financial applications and their critical integrations.',
    facts: [['Industry', 'Financial services'], ['Services', 'Event-driven systems, integration, cloud and DevOps'], ['Format', 'Sector overview']],
    challenge: 'Tightly coupled legacy services make it hard to introduce new capabilities without affecting existing processes.',
    solution: 'Map dependencies, define clearer service boundaries and introduce event-driven integrations through controlled changes.',
    results: ['A more adaptable architecture for future improvements', 'Clearer integrations', 'More manageable change'],
    tech: ['Event-driven architecture', 'APIs', 'Cloud', 'CI/CD'] },
  { id: 'connected-learning', cats: ['Core Application Development', 'Design, Support & Maintenance'], tag: 'Education · Digital learning', title: 'Building more connected learning experiences',
    sum: 'Digital learning, mobile access and personalisation brought together into one coherent student experience.',
    facts: [['Industry', 'Education'], ['Services', 'Learning platforms, mobile, analytics'], ['Format', 'Sector overview']],
    challenge: 'Fragmented learning and support tools make relevant content hard to find across devices.',
    solution: 'Connect learning services, support mobile access and use analytics to guide relevant, personalised interactions.',
    results: ['Easier access to resources', 'More relevant student interactions', 'Better foundations for ongoing improvement'],
    tech: ['Learning platforms', 'Mobile apps', 'Analytics'] },
];

/* ---------- navigation ---------- */
const INSIGHT_CATS = ['Blog', 'News', 'Events', 'Videos', 'Whitepapers', 'Newsletters'];
function header(active) {
  const cur = f => (f === active ? ' aria-current="page"' : '');
  const is = list => (list.includes(active) ? ' is-current' : '');
  const drop = (id, label, list, inner, cls = '') => `<li><button class="menu__link${is(list)}" type="button" aria-expanded="false" data-drop="${id}">${label}${ic('chev', 'chev')}</button><div class="drop${cls}" id="${id}" hidden>${inner}</div></li>`;
  const svcFiles = ['services.html', ...[...DETAIL].map(s => `service-${s}.html`)];
  return `<a class="skip" href="#main">Skip to content</a>
<div class="topbar"><a href="${CERT.url}" target="_blank" rel="noopener"><b>ISO/IEC 27001:2022 certified<span class="hide-xs"> by CPG</span></b><span aria-hidden="true">·</span><span class="hide-xs">Quality-managed delivery from Can Tho, Vietnam</span><span class="show-xs">Verify</span>${ic('ext')}<span class="sr-only">(opens the certificate register in a new tab)</span></a></div>
<header class="hdr"><div class="w hdr__in">
  <a class="hdr__logo" href="index.html" aria-label="PTN Global home"><img src="assets/ptn-logo.svg" alt="PTN Global" width="115" height="36"></a>
  <nav aria-label="Main"><ul class="menu">
    ${drop('d-company', 'Company', ['company.html'], `<a href="company.html"${cur('company.html')}>About PTN Global<small>Story, values, leadership, offices</small></a><a href="careers.html">Careers<small>Open roles and internships</small></a><a href="contact.html">Contact<small>Offices and enquiries</small></a>`)}
    ${drop('d-services', 'Services', svcFiles, `${SERVICE_CATS.map(c => `<div class="drop__group"><b>${esc(c.category)}</b>${c.items.slice(0, 4).map(s => `<a href="${svcHref(s)}"${cur(svcHref(s))}>${esc(s.name)}</a>`).join('')}${c.items.length > 4 ? `<a href="services.html?cat=${slug(c.category)}#catalogue"><small>+ ${c.items.length - 4} more</small></a>` : ''}</div>`).join('')}<div class="drop__group"><b>How we engage</b><a href="services.html#engagement">Engagement models</a><a href="services.html#quality">Quality commitment</a><a href="index.html#ai-delivery">AI-augmented delivery</a></div><div class="drop__foot"><span class="muted small">${SERVICE_CATS.reduce((n, c) => n + c.items.length, 0)} services in ${SERVICE_CATS.length} categories</span><a class="link" href="services.html">All services ${ic('arrow')}</a></div>`, ' drop--mega')}
    ${drop('d-expertise', 'Expertise', ['industries.html', 'technologies.html', 'case-studies.html', ...CASES.map(c => `case-${c.id}.html`)], `<a href="industries.html"${cur('industries.html')}>Industries<small>Eight sectors we build for</small></a><a href="technologies.html"${cur('technologies.html')}>Technologies<small>The full engineering stack</small></a><a href="case-studies.html"${cur('case-studies.html')}>Case studies<small>Long-term partnerships</small></a>`)}
    ${drop('d-insights', 'Insights', ['insights.html', 'blog.html', 'whitepaper.html'], `<a href="insights.html"${cur('insights.html')}>All insights</a>${INSIGHT_CATS.map(c => `<a href="insights.html?cat=${c}">${c}</a>`).join('')}`)}
    <li><a class="menu__link${is(['careers.html', ...JOBS.map(j => `career-${slug(j.t)}.html`)])}" href="careers.html"${cur('careers.html')}>Careers <span class="hiring">HIRING</span></a></li>
  </ul></nav>
  <div class="hdr__end"><a class="btn btn--line btn--sm hide-md" href="contact.html"${cur('contact.html')}>Contact us</a><a class="btn btn--sm" href="contact.html?need=Extend%20my%20team">Build your team</a></div>
  <button class="burger" type="button" aria-expanded="false" aria-controls="mnav" aria-label="Open menu">${ic('menu', 'i-open')}<span class="i-close" style="display:none">${ic('close')}</span></button>
</div></header>
<nav class="mnav" id="mnav" aria-label="Mobile" hidden>
  <details><summary>Company${ic('chev')}</summary><a href="company.html">About PTN Global</a><a href="careers.html">Careers</a><a href="contact.html">Contact</a></details>
  <details><summary>Services${ic('chev')}</summary><a href="services.html">All services</a>${SERVICE_CATS.map(c => `<a href="services.html?cat=${slug(c.category)}#catalogue">${esc(c.category)}</a>`).join('')}<a href="services.html#engagement">Engagement models</a></details>
  <details><summary>Expertise${ic('chev')}</summary><a href="industries.html">Industries</a><a href="technologies.html">Technologies</a><a href="case-studies.html">Case studies</a></details>
  <details><summary>Insights${ic('chev')}</summary><a href="insights.html">All insights</a>${INSIGHT_CATS.map(c => `<a href="insights.html?cat=${c}">${c}</a>`).join('')}</details>
  <a href="careers.html">Careers</a>
  <div class="actions"><a class="btn" href="contact.html?need=Extend%20my%20team">Build your team</a><a class="btn btn--line" href="contact.html">Contact us</a></div>
</nav>`;
}

function footer() {
  const col = (t, links) => `<div><h2>${t}</h2><ul>${links.map(([h, l]) => `<li><a href="${h}">${l}</a></li>`).join('')}</ul></div>`;
  return `<footer class="ftr"><div class="w ftr__grid">
  <div class="ftr__brand"><img src="assets/ptn-logo.svg" alt="PTN Global" width="122" height="38" loading="lazy"><p>Software development from Vietnam, led from Melbourne.</p>
    <a class="badge" href="${CERT.url}" target="_blank" rel="noopener">${ic('shield')} ISO/IEC 27001:2022 · CPG<span class="sr-only"> (opens in a new tab)</span></a></div>
  ${col('Services', SERVICE_CATS.map(c => [`services.html?cat=${slug(c.category)}#catalogue`, esc(c.category)]))}
  ${col('Expertise', [['industries.html', 'Industries'], ['technologies.html', 'Technologies'], ['case-studies.html', 'Case studies'], ['services.html#engagement', 'Engagement models']])}
  ${col('Company', [['company.html', 'About us'], ['insights.html', 'Insights'], ['careers.html', 'Careers'], ['contact.html', 'Contact']])}
  <div><h2>Offices</h2>
    <address><b>Melbourne · Main office</b>${esc(MEL.addr)}</address>
    <address><b>Can Tho · Development center</b>${esc(CT.addr)}</address>
    <p style="margin-top:16px"><a href="tel:${CONTACT.tel}">${CONTACT.phone}</a><br><a href="mailto:${CONTACT.email}">${CONTACT.email}</a></p></div>
</div><div class="w ftr__bar"><span>© <span data-year>2026</span> PTN Global. All rights reserved.</span>
  <ul style="list-style:none"><li><a href="legal.html#privacy">Privacy policy</a></li><li><a href="legal.html#terms">Terms of service</a></li></ul></div></footer>`;
}

function page({ file, title, desc, body }) {
  const full = title ? `${title} · PTN Global` : 'PTN Global · Software development from Vietnam, led from Melbourne';
  writeFileSync(join(OUT, file), `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(full)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="robots" content="noindex, nofollow">
<meta property="og:title" content="${esc(full)}">
<meta property="og:description" content="${esc(desc)}">
<link rel="icon" href="assets/ptn-mark.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,300..500;1,6..72,300..500&family=Be+Vietnam+Pro:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap">
<link rel="stylesheet" href="css/main.css">
</head>
<body>
${header(file)}
<main id="main">
${body}
</main>
${footer()}
<script>document.querySelectorAll('[data-year]').forEach(n=>n.textContent=new Date().getFullYear())</script>
<script src="js/main.js" defer></script>
</body>
</html>
`);
  console.log('built', file);
}

/* ---------- shared blocks ---------- */
const head = ({ eb, h, lead, level = 2, id, cls = '', aside = '' }) => `<div class="head ${cls}">${eb ? `<p class="eyebrow">${eb}</p>` : ''}<h${level} class="${level === 1 ? 'h1' : 'h2'}"${id ? ` id="${id}"` : ''}>${h}</h${level}>${lead ? `<p class="lead">${lead}</p>` : ''}${aside ? `<div class="head__aside">${aside}</div>` : ''}</div>`;
const crumb = items => `<nav aria-label="Breadcrumb"><ol class="crumb"><li><a href="index.html">Home</a></li>${items.map(([h, l]) => `<li>${h ? `<a href="${h}">${l}</a>` : `<span aria-current="page">${l}</span>`}</li>`).join('')}</ol></nav>`;
const pageHero = ({ crumbs, eb, h, lead, actions = '', side = '' }) => `<section class="hero"><div class="w">
  ${crumb(crumbs)}
  <div class="hero__grid" style="margin-top:32px"><div><p class="eyebrow">${eb}</p><h1 class="h1">${h}</h1></div>
  <div class="hero__side"><p class="lead">${lead}</p>${actions ? `<div class="actions">${actions}</div>` : ''}${side}</div></div>
</div></section>`;
const btnBuild = (label = 'Build your team') => `<a class="btn btn--accent" href="contact.html?need=Extend%20my%20team">${label} ${ic('arrow')}</a>`;
const finale = (h = 'Big projects always start through <span class="accent">a simple conversation.</span>', p = 'Tell us what you are building. A delivery lead replies within one business day.') => `<section class="s night" aria-labelledby="finale-h"><div class="w finale">
  <div><p class="eyebrow">Contact</p><h2 id="finale-h" style="margin-top:16px">${h}</h2><p class="lead" style="margin-top:20px">${p}</p><div class="actions" style="margin-top:32px"><a class="btn btn--light" href="contact.html">Contact us ${ic('arrow')}</a><a class="btn btn--ghost" href="contact.html?need=Extend%20my%20team">Build your team</a></div></div>
  <dl><div><dt>Phone</dt><dd><a href="tel:${CONTACT.tel}">${CONTACT.phone}</a></dd></div><div><dt>Email</dt><dd><a href="mailto:${CONTACT.email}">${CONTACT.email}</a></dd></div><div><dt>Main office</dt><dd style="font-size:1.1rem">${esc(MEL.addr)}</dd></div></dl>
</div></section>`;
const certCard = () => `<div class="cert"><div class="seal" aria-hidden="true">ISO<br>27001<small>2022 · CPG</small></div>
  <div><p class="tag">Verified certificate</p><h3>${esc(CERT.title)}</h3><p>${esc(CERT.std)}, certificate <span class="mono">${esc(CERT.no)}</span>, issued by ${esc(CERT.issuer)}. ${esc(CERT.valid)}.</p>
  <div class="chips">${CERT.scope.map(s => `<span class="chip">${s}</span>`).join('')}</div>
  <p style="margin-top:16px"><a class="link" href="${CERT.url}" target="_blank" rel="noopener">Verify on the CPG register<span class="sr-only"> (opens in a new tab)</span> ${ic('ext')}</a></p></div></div>`;
const fixTech = t => t.replace(/^LangChai$/, 'LangChain');
const techRows = gs => `<div class="tech">${gs.map(g => `<div><h3>${esc(g.h)}</h3><div class="chips">${g.li.map(t => `<span class="chip">${esc(fixTech(t))}</span>`).join('')}</div></div>`).join('')}</div>`;
const steps = (list, n = 3) => `<ol class="steps" style="--n:${n}">${list.map((s, i) => `<li><span class="n">${i + 1}</span><h3>${esc(s.t)}</h3><p>${esc(s.d)}</p></li>`).join('')}</ol>`;
const caseCard = (c, feature = false) => `<a class="case${feature ? ' case--feature' : ''}" href="case-${c.id}.html" data-cats="${esc(c.cats.join('|'))}"><p class="tag">${esc(c.tag)}</p><h3>${esc(c.title)}</h3><p>${esc(c.sum)}</p><span class="link">Read the case study ${ic('arrow')}</span></a>`;
const testimonialCase = (cls = '') => `<figure class="case quote ${cls}" data-cats="Core Application Development"><p class="tag">Australia · Team extension</p><blockquote style="font-size:1.35rem">“${esc(TESTIMONIAL.quote)}”</blockquote><figcaption><span class="mono-av" aria-hidden="true">KM</span><span><b>${esc(TESTIMONIAL.name)}</b>${esc(TESTIMONIAL.role)}, ${esc(TESTIMONIAL.company)}</span></figcaption></figure>`;
const faqBlock = (items, intro = '') => `<div class="split split--wide"><div class="sticky">${head({ eb: 'FAQ', h: 'Frequently asked questions', cls: 'head--stack', lead: intro })}<a class="btn btn--line" href="contact.html">Ask us directly ${ic('arrow')}</a></div>
  <div class="acc">${items.map((f, i) => `<details${i === 0 ? ' open' : ''}><summary>${esc(f.q)}${ic('plus')}</summary><div class="acc__body">${richText(f.a)}</div></details>`).join('')}</div></div>`;

const now = tz => new Intl.DateTimeFormat('en-GB', { timeZone: tz, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(new Date());
const tzName = (tz, l) => new Intl.DateTimeFormat(l, { timeZone: tz, timeZoneName: 'short' }).formatToParts(new Date()).find(p => p.type === 'timeZoneName').value;
const officeMap = () => {
  const [mx, my] = MAP.mel, [cx, cy] = MAP.ct; const pct = (v, t) => (v / t * 100).toFixed(2) + '%';
  const ctrl = [cx + 420, cy + 80], mid = [0.25 * cx + 0.5 * ctrl[0] + 0.25 * mx, 0.25 * cy + 0.5 * ctrl[1] + 0.25 * my];
  const vn = tzName('Asia/Ho_Chi_Minh', 'en-US'), au = tzName('Australia/Melbourne', 'en-AU');
  return `<div class="frame"><figure class="map" aria-labelledby="map-cap">
  <svg viewBox="0 0 ${MAP.W} ${MAP.H}" role="img" aria-label="Map of Southeast Asia and Australia with PTN Global offices in Melbourne and Can Tho">
    <path class="map__dots" d="${MAP.dots}"/><path class="map__arc" d="M${cx} ${cy} Q${ctrl[0]} ${ctrl[1]} ${mx} ${my}"/>
    <g class="map__pt"><circle class="ring" cx="${cx}" cy="${cy}" r="18"/><circle cx="${cx}" cy="${cy}" r="7"/></g>
    <g class="map__pt"><circle class="ring" cx="${mx}" cy="${my}" r="18"/><circle cx="${mx}" cy="${my}" r="7"/></g></svg>
  <div class="map__pin map__pin--ct" style="left:${pct(cx, MAP.W)};top:${pct(cy, MAP.H)}"><p class="eyebrow">${esc(CT.role)}</p><b>Can Tho, Vietnam</b><span>Delivery teams and engineering</span><span class="mono"><span data-clock="Asia/Ho_Chi_Minh">${now('Asia/Ho_Chi_Minh')}</span> ${vn === 'GMT+7' ? 'ICT' : vn}</span></div>
  <div class="map__pin map__pin--mel" style="left:${pct(mx, MAP.W)};top:${pct(my, MAP.H)}"><p class="eyebrow">${esc(MEL.role)}</p><b>Melbourne, Australia</b><span>Leadership and client partnership</span><span class="mono"><span data-clock="Australia/Melbourne">${now('Australia/Melbourne')}</span> ${au}</span></div>
  <span class="map__dist" style="left:${pct(mid[0], MAP.W)};top:${pct(mid[1], MAP.H)}">≈ ${MAP.km.toLocaleString('en-AU')} km apart</span>
  <figcaption id="map-cap" class="sr-only">PTN Global's main office is in Melbourne, Australia, and its development center is in Can Tho, Vietnam, about ${MAP.km.toLocaleString('en-AU')} kilometres apart.</figcaption>
</figure><p class="map__credit">Land outlines: Natural Earth. Local times use your browser clock.</p></div>`;
};

/* =====================================================================
   HOME
   ===================================================================== */
{
  const why = pairs(sec(PAGES, '/home', /Why You Should Choose PTN/));
  const whoQuote = txtOf(sec(PAGES, '/home', /A leading software company/).find(i => tagOf(i) === 'blockquote'));
  const tech = groups(sec(PAGES, '/home', /engineering tech stack/));
  page({ file: 'index.html', title: '', desc: 'PTN Global builds and extends software teams in Can Tho, Vietnam, led from Melbourne. ISO/IEC 27001:2022 certified delivery for Australian and New Zealand companies.', body: `
<section class="hero"><div class="w">
  <div class="hero__grid">
    <div><p class="eyebrow">Software development · Vietnam</p><h1 class="display">Offshoring made easy <span class="accent">with PTN</span></h1></div>
    <div class="hero__side"><p class="lead">Customised solutions built to align with your business goals and operations: engineering teams in Can Tho, Vietnam, led from Melbourne.</p>
      <div class="actions">${btnBuild()}<a class="btn btn--line" href="contact.html">Contact us</a></div>
      <ul class="checks"><li>${ic('check')}ISO/IEC 27001:2022 certified</li><li>${ic('check')}Melbourne-led</li><li>${ic('check')}Teams in Can Tho</li></ul></div>
  </div>
  ${officeMap()}
</div></section>

<section aria-labelledby="clients-h"><div class="w"><div class="clients"><p class="eyebrow" id="clients-h">Trusted by teams in Australia, New Zealand and beyond</p><ul>${CLIENT_NAMES.map(n => `<li>${n}</li>`).join('')}</ul></div></div></section>

<section class="s" aria-labelledby="why-h"><div class="w">
  ${head({ eb: 'Why PTN', h: 'Why you should choose PTN', id: 'why-h', lead: 'Three reasons clients stay with us from the first sprint to the tenth release.' })}
  <div class="ruled ruled--3">${why.map(w => `<article><h3>${esc(w.t)}</h3><p>${esc(w.d)}</p></article>`).join('')}</div>
  <p style="margin-top:32px"><a class="link" href="company.html">See more about us ${ic('arrow')}</a></p>
</div></section>

<section class="s night" aria-labelledby="who-h"><div class="w split">
  <div><p class="eyebrow">Who we are</p><h2 class="h2" id="who-h" style="margin-top:16px">A leading software company <span class="accent">in Vietnam.</span></h2>
    <p class="lead" style="margin-top:24px">${esc(whoQuote)}</p>
    <p style="margin-top:32px"><a class="link" href="company.html">About PTN Global ${ic('arrow')}</a></p></div>
  <dl class="ledger" style="align-self:end"><div><dt>Clients served across Australia, New Zealand and beyond</dt><dd>50+</dd></div><div><dt>Offices across Australia, New Zealand and Vietnam</dt><dd>${tbc('3+', 'the wireframe lists Melbourne and Can Tho with addresses; Ho Chi Minh City and New Zealand are awaiting')}</dd></div><div><dt>ISO/IEC 27001:2022 certified information security</dt><dd>27001</dd></div></dl>
</div></section>

<section class="s" id="services" aria-labelledby="svc-h"><div class="w">
  ${head({ eb: 'What we do', h: 'We build the best service experience', id: 'svc-h', lead: `${SERVICE_CATS.reduce((n, c) => n + c.items.length, 0)} services in ${SERVICE_CATS.length} categories, delivered by cross-domain engineers from Can Tho and led from Melbourne.` })}
  <div class="explorer">
    <div class="explorer__tabs" role="tablist" aria-label="Service categories" aria-orientation="vertical">
      ${SERVICE_CATS.map((c, i) => `<button type="button" role="tab" id="t-${slug(c.category)}" aria-controls="p-${slug(c.category)}" aria-selected="${i === 0}" tabindex="${i ? -1 : 0}">${esc(c.category)}<small>${c.items.length}</small></button>`).join('')}
    </div>
    ${SERVICE_CATS.map((c, i) => `<div class="explorer__panel tabpanel" role="tabpanel" id="p-${slug(c.category)}" aria-labelledby="t-${slug(c.category)}" tabindex="0"${i ? ' hidden' : ''}>
      <div class="split"><div><h3 class="h3" style="font-size:1.9rem">${esc(c.category)}</h3><p style="margin-top:16px;color:var(--ink-2)">${esc(catBlurb(c.category))}</p>
        <p style="margin-top:24px"><a class="btn btn--line btn--sm" href="services.html?cat=${slug(c.category)}#catalogue">Explore ${c.items.length} services ${ic('arrow')}</a></p></div>
      <ul class="index" style="border-top-color:var(--line)">${c.items.map(s => `<li><a href="${svcHref(s)}" style="grid-template-columns:minmax(0,1fr) auto;padding:14px 0"><b style="font-size:1.1rem">${esc(s.name)}</b>${ic('arrow')}</a></li>`).join('')}</ul></div>
    </div>`).join('')}
  </div>
</div></section>

<section class="s s--sunk" id="ai-delivery" aria-labelledby="ai-h"><div class="w">
  ${head({ eb: 'AI-augmented delivery', h: 'AI in every stage, a human at every gate', id: 'ai-h', lead: 'Our engineers work with AI coding, testing and CI/CD tools across the lifecycle. Every change is reviewed by an engineer before it ships.' })}
  ${steps(SDLC.map(([t, d]) => ({ t, d })), 3)}
  <p style="margin-top:32px"><a class="link" href="services.html#engagement">See the AI-augmented engagement model ${ic('arrow')}</a></p>
</div></section>

<section class="s" aria-labelledby="tech-h"><div class="w">
  ${head({ eb: 'Technology', h: 'Our engineering tech stack', id: 'tech-h', lead: 'The languages, frameworks and platforms our teams use most. The full list covers 13 categories.' })}
  ${techRows(tech)}
  <p style="margin-top:32px"><a class="link" href="technologies.html">View all technologies ${ic('arrow')}</a></p>
</div></section>

<section class="s s--line" aria-labelledby="std-h"><div class="w split">
  <div>${head({ eb: 'Standards', h: 'Independently audited, not self-assessed', id: 'std-h', cls: 'head--stack', lead: 'Our information security management system is certified by CPG and checked on the public register. It covers software development, testing, enhancement and maintenance at our Can Tho development center.' })}</div>
  ${certCard()}
</div></section>

<section class="s night" aria-labelledby="cases-h"><div class="w">
  ${head({ eb: 'Case studies', h: 'Stories of long-term partnership', id: 'cases-h', lead: 'How we solve complex challenges with scalable, secure and tailored solutions, and the partnerships we are proud to build.' })}
  <div class="cases">${testimonialCase()}${caseCard(CASES[0], true)}${CASES.slice(1).map(c => caseCard(c)).join('')}</div>
  <p style="margin-top:32px"><a class="link" href="case-studies.html">All case studies ${ic('arrow')}</a></p>
</div></section>

<section class="s" aria-labelledby="news-h"><div class="w">
  ${head({ eb: 'Insights', h: 'The latest from PTN', id: 'news-h', aside: `<a class="link" href="insights.html">All insights ${ic('arrow')}</a>` })}
  <ul class="news">${TOPICS.slice(0, 3).map(([c, t], i) => `<li><a href="${i === 0 ? 'blog.html' : 'insights.html?cat=' + c}"><small>${c}</small><b>${esc(t)}</b><small>Coming soon</small></a></li>`).join('')}</ul>
</div></section>

${finale()}
`});
}

/* =====================================================================
   COMPANY
   ===================================================================== */
{
  const story = sec(PAGES, '/company', /Founded in Melbourne/).filter(i => tagOf(i) === 'p' && txtOf(i).length > 120).map(txtOf);
  const objIt = sec(PAGES, '/company', /Objective & Vision/);
  const intro = txtOf(objIt.find(i => tagOf(i) === 'p'));
  const objective = firstP(objIt, /^p: OBJECTIVE$/i), vision = firstP(objIt, /^p: VISION$/i);
  const beliefs = pairs(sec(PAGES, '/company', /Things PTN Believe/));
  const values = pairs(sec(PAGES, '/company', /core values drive/));
  const methods = faqs(sec(PAGES, '/company', /Methodologies/).map(i => i.replace(/^summary: (.*)$/, 'summary: $1')));
  const leaders = pairs(sec(PAGES, '/company', /Executive Leadership/));
  const culture = pairs(sec(PAGES, '/company', /Cultural Diversity/));
  const proc = pairs(sec(PAGES, '/company', /Turn your Business into Platform/));
  proc[1].d = 'We propose the solution, the engagement model and the team shape, then assemble the team with you.';
  const initials = n => n.split(' ').map(x => x[0]).join('').slice(0, 2);
  page({ file: 'company.html', title: 'About us', desc: 'Founded in Melbourne by Tam Phan, PTN Global combines offshore engineering in Can Tho, Vietnam with face-to-face partnership in Australia.', body: `
${pageHero({ crumbs: [[null, 'Company']], eb: 'About PTN Global', h: 'Top software development company <span class="accent">in Vietnam</span>', lead: 'Offshore engineering from Vietnam, led from Melbourne.', actions: `${btnBuild()}<a class="btn btn--line" href="contact.html?need=Build%20a%20new%20product">Talk to an engineer</a>` })}

<section class="s s--line" aria-labelledby="story-h"><div class="w split split--wide">
  <div class="sticky"><p class="eyebrow">Our story</p><h2 class="h2" id="story-h" style="margin-top:16px">Founded in Melbourne, built in Vietnam.</h2>
    <figure class="quote" style="margin-top:32px"><figcaption style="margin-top:0"><span class="mono-av" aria-hidden="true">TP</span><span><b>Tam Phan</b>Founder and CEO, Melbourne</span></figcaption></figure></div>
  <div><div class="prose">${story.map(p => `<p>${esc(p)}</p>`).join('')}</div>
    <dl class="ledger" style="margin-top:40px"><div><dt>Projects delivered</dt><dd>50+</dd></div><div><dt>Employees</dt><dd>${tbc('150+', 'the docs say 150+; itviec lists 51 to 150')}</dd></div><div><dt>Satisfaction</dt><dd>${tbc('90+', 'the docs say 90+ satisfaction without a unit or source')}</dd></div><div><dt>Years of experience</dt><dd>5+</dd></div></dl></div>
</div></section>

<section class="s night" aria-labelledby="obj-h"><div class="w">
  ${head({ eb: 'Objective & vision', h: 'Why PTN exists', id: 'obj-h', lead: esc(intro) })}
  <div class="ruled ruled--2"><article><span class="n">OBJECTIVE</span><h3 style="font-size:clamp(1.5rem,1.2rem+1vw,2.1rem)">${esc(objective)}</h3></article><article><span class="n">VISION</span><h3 style="font-size:clamp(1.5rem,1.2rem+1vw,2.1rem)">${esc(vision)}</h3></article></div>
</div></section>

<section class="s" aria-labelledby="believe-h"><div class="w">
  ${head({ eb: 'How we work', h: 'Things PTN believes when working', id: 'believe-h' })}
  <div class="ruled ruled--3">${beliefs.map(b => `<article><h3>${esc(b.t)}</h3><p>${esc(b.d)}</p></article>`).join('')}</div>
</div></section>

<section class="s s--sunk" aria-labelledby="values-h"><div class="w">
  ${head({ eb: 'Core values', h: 'Our core values drive and unite us', id: 'values-h', lead: 'They define how we work, innovate, celebrate and grow, with every client and every colleague.' })}
  <div class="ruled ruled--5">${values.map(v => `<article><h3>${esc(v.t)}</h3><p>${esc(v.d)}</p></article>`).join('')}</div>
</div></section>

<section class="s" aria-labelledby="method-h"><div class="w split split--wide">
  <div class="sticky">${head({ eb: 'Methodologies', h: 'Methodologies that drive technical success', id: 'method-h', cls: 'head--stack', lead: 'Tailored development approaches for each project: Agile, Scrum, Kanban, DevOps, Lean, SAFe and XP.' })}</div>
  <div class="acc">${methods.map((m, i) => `<details${i === 0 ? ' open' : ''}><summary>${esc(m.q)}${ic('plus')}</summary><div class="acc__body"><p>${esc(m.a)}</p></div></details>`).join('')}</div>
</div></section>

<section class="s s--line" aria-labelledby="std-h"><div class="w split">
  <div>${head({ eb: 'Standards', h: 'Certified information security', id: 'std-h', cls: 'head--stack', lead: 'Our ISMS protects people, processes and technology through confidentiality, integrity and availability.' })}</div>
  ${certCard()}
</div></section>

<section class="s s--sunk" aria-labelledby="lead-h"><div class="w">
  ${head({ eb: 'Leadership', h: 'Meet our executive leadership team', id: 'lead-h', lead: 'We lead with care, creating a space where everyone feels valued and empowered to take ownership of their growth.' })}
  <ul class="people">${leaders.map(l => `<li><span class="mono-av" aria-hidden="true">${initials(l.t)}</span><span><b>${esc(l.t)}</b><span>${esc(l.d)}</span></span></li>`).join('')}</ul>
</div></section>

<section class="s" aria-labelledby="culture-h"><div class="w">
  ${head({ eb: 'Culture', h: 'Embracing cultural diversity at PTN Global', id: 'culture-h', lead: 'Empowering our team, enriching our culture.' })}
  <div class="ruled ruled--3">${culture.map(c => `<article><h3>${esc(c.t)}</h3><p>${esc(c.d.split('Honesty,')[0])}</p></article>`).join('')}</div>
</div></section>

<section class="s s--line" aria-labelledby="off-h"><div class="w">
  ${head({ eb: 'Offices', h: 'Meet our dedicated team', id: 'off-h', lead: 'In Australia and Vietnam, dedicated to doing their life’s work.' })}
  <div class="offices">${[MEL, CT].map(o => `<article><p class="tag">${esc(o.role)}</p><h3 style="margin-top:8px">${esc(o.city)}</h3><address>${esc(o.addr)}</address></article>`).join('')}</div>
</div></section>

<section class="s s--sunk" aria-labelledby="proc-h"><div class="w">
  ${head({ eb: 'Process', h: 'How we turn your business into a platform', id: 'proc-h', lead: 'Clear steps, the right team and continuous support throughout the journey.' })}
  ${steps(proc, 3)}
</div></section>

${finale()}
`});
}

/* =====================================================================
   SERVICES
   ===================================================================== */
const ENG_GROUPS = DOCS.structure.engagement.map(g => ({ ...g, items: g.items.filter((it, i, a) => a.findIndex(x => x.name === it.name) === i) }));
const CRIT = [['speed', 'Speed to start'], ['scale', 'Scale up or down'], ['budget', 'Budget predictability'], ['flex', 'Scope flexibility'], ['control', 'Your control'], ['focus', 'Team focus'], ['admin', 'Less admin for you'], ['partner', 'Partnership depth']];
const WHO = { you: 'You', ptn: 'PTN', shared: 'Shared', ai: 'PTN + AI' };
const meter = v => `<span class="meter" role="img" aria-label="${v} of 5">${[1, 2, 3, 4, 5].map(i => `<i class="${i <= v ? 'on' : ''}"></i>`).join('')}</span>`;
{
  const roles = sec(PAGES, '/services', /Roles We Offer/).filter(i => tagOf(i) === 'h3').map(txtOf);
  const collab = pairs(sec(PAGES, '/services', /How Our Roles Collaborate/));
  const quality = groups(sec(PAGES, '/services', /Quality Commitment/));
  const tech = groups(sec(PAGES, '/services', /engineering tech stack/));
  const inds = faqs(sec(PAGES, '/services', /Industry that we work on/));
  const total = SERVICE_CATS.reduce((n, c) => n + c.items.length, 0);
  page({ file: 'services.html', title: 'Services', desc: `${total} software development services in ${SERVICE_CATS.length} categories, nine engagement models and the roles to staff a complete product team.`, body: `
${pageHero({ crumbs: [[null, 'Services']], eb: 'Services', h: 'Software development <span class="accent">services</span>', lead: 'Cross-domain engineers who take you from the product idea, through market entrance, to full scale.', actions: `${btnBuild()}<a class="btn btn--line" href="#engagement">Explore engagement models</a>`, side: `<p class="small muted">${total} services · ${SERVICE_CATS.length} categories · 9 engagement models</p>` })}

<section class="s s--line" id="catalogue" aria-labelledby="cat-h"><div class="w">
  ${head({ eb: 'Catalogue', h: 'Every service, by category', id: 'cat-h', lead: 'Filter by category. Services with a dedicated page link to the full detail.' })}
  <div class="seg" data-filter="#catalogue-list" data-status="#cat-status" role="group" aria-label="Filter services by category"><button type="button" aria-pressed="true" data-value="all">All</button>${SERVICE_CATS.map(c => `<button type="button" aria-pressed="false" data-value="${slug(c.category)}">${esc(c.category)}</button>`).join('')}</div>
  <p class="filter-status" id="cat-status" role="status">Showing ${total} of ${total}</p>
  <ul class="catalogue" id="catalogue-list" style="margin-top:24px">${SERVICE_CATS.flatMap(c => c.items.map(s => `<li data-cats="${slug(c.category)}">${DETAIL.has(s.slug) ? `<a href="service-${s.slug}.html"><span class="tag">${esc(c.category)}</span><b>${esc(s.name)}</b><span>${esc(s.desc)}</span><span class="more">View service ${ic('arrow')}</span></a>` : `<div class="nolink catalogue-item" style="display:grid;gap:6px;padding:24px 24px 24px 0"><span class="tag">${esc(c.category)}</span><b>${esc(s.name)}</b><span>${esc(s.desc)}</span></div>`}</li>`)).join('')}</ul>
</div></section>

<section class="s night" id="engagement" aria-labelledby="eng-h"><div class="w">
  ${head({ eb: 'Engagement models', h: 'Nine ways to work with PTN', id: 'eng-h', lead: 'Pick a model to see who leads, what each side brings, how the work runs and how it compares. Shares and ratings are indicative.' })}
  <div class="explorer">
    <div class="explorer__tabs" role="tablist" aria-label="Engagement models" aria-orientation="vertical">
      ${ENG_GROUPS.map(g => `<p class="explorer__group" aria-hidden="true">${esc(g.category)}</p>${g.items.map(m => `<button type="button" role="tab" id="t-m-${slug(m.name)}" aria-controls="m-${slug(m.name)}" aria-selected="${m.name === 'AI-Augmented'}" tabindex="${m.name === 'AI-Augmented' ? 0 : -1}">${esc(m.name)}</button>`).join('')}`).join('')}
    </div>
    ${ENG_GROUPS.flatMap(g => g.items.map(m => { const M = MODELS[m.name]; return `<div class="explorer__panel tabpanel" role="tabpanel" id="m-${slug(m.name)}" aria-labelledby="t-m-${slug(m.name)}" tabindex="0"${m.name === 'AI-Augmented' ? '' : ' hidden'}>
      <p class="tag">${esc(g.category)}</p><h3 class="h3" style="font-size:2rem;margin-top:8px">${esc(m.name)}</h3><p style="margin-top:12px;color:var(--ink-2);max-width:62ch">${esc(m.desc)}</p>
      <dl class="model__facts">${[['lead', 'Who leads day to day'], ['you', 'You bring'], ['ptn', 'PTN brings'], ['bill', 'Billing'], ['best', 'Best for']].map(([k, l]) => `<div><dt>${l}</dt><dd>${esc(M.facts[k])}</dd></div>`).join('')}</dl>
      <div class="split" style="margin-top:32px;gap:40px"><div><h4>How it runs${M.loopLabel ? ` <span class="muted small">(${esc(M.loopLabel.toLowerCase())})</span>` : ''}</h4>
        <ol class="flow">${M.steps.map(([t, w, p], i) => `<li><span class="n">0${i + 1}</span><span>${esc(t)}<span class="who">${WHO[w]}</span></span><span class="share" role="img" aria-label="PTN ${p}%, you ${100 - p}%"><i style="width:${p}%"></i></span></li>`).join('')}</ol>
        <p class="share-legend"><span><i style="background:var(--blue-ink)"></i>PTN share</span><span><i style="background:var(--blue-soft)"></i>Your share</span></p></div>
      <div><h4>How it compares</h4><table class="rates"><caption class="sr-only">${esc(m.name)} ratings out of 5</caption><tbody>${CRIT.map(([k, l]) => `<tr><th scope="row">${l}</th><td>${meter(M.rate[k])}</td></tr>`).join('')}</tbody></table></div></div>
      <p style="margin-top:24px"><a class="btn btn--sm" href="contact.html?model=${encodeURIComponent(m.name)}">Discuss ${esc(m.name)} ${ic('arrow')}</a></p>
    </div>`; })).join('')}
  </div>
</div></section>

<section class="s" aria-labelledby="roles-h"><div class="w">
  ${head({ eb: 'Roles', h: 'Roles we offer', id: 'roles-h', lead: 'Every role you need to staff a complete product team.' })}
  <ul class="ruled ruled--4">${roles.map(r => `<li style="padding-block:20px"><h3 style="font-size:1.2rem">${esc(r)}</h3></li>`).join('')}</ul>
</div></section>

<section class="s s--sunk" aria-labelledby="collab-h"><div class="w">
  ${head({ eb: 'Collaboration', h: 'How our roles collaborate to turn your vision into reality', id: 'collab-h', lead: 'More than a process: your path to seamless team expansion.' })}
  ${steps(collab, 3)}
</div></section>

<section class="s" id="quality" aria-labelledby="q-h"><div class="w">
  ${head({ eb: 'Quality', h: 'Quality commitment', id: 'q-h', lead: 'Tailored software for diverse industries, delivered under a quality management approach and a certified information security management system.' })}
  <div class="split"><div class="ruled ruled--2" style="--cols:2">${quality.map(q => `<article><h3>${esc(q.h.replace(/^Information security management system$/, 'Information security management'))}</h3><ul class="checklist" style="margin-top:16px">${q.li.map(l => `<li>${ic('check')}<span>${esc(l)}</span></li>`).join('')}</ul></article>`).join('')}</div>${certCard()}</div>
</div></section>

<section class="s s--line" aria-labelledby="tech-h"><div class="w">
  ${head({ eb: 'Technology', h: 'Our engineering tech stack', id: 'tech-h' })}
  ${techRows(tech)}
  <p style="margin-top:32px"><a class="link" href="technologies.html">View all technologies ${ic('arrow')}</a></p>
</div></section>

<section class="s s--sunk" aria-labelledby="ind-h"><div class="w split split--wide">
  <div class="sticky">${head({ eb: 'Industries', h: 'Industries we work in', id: 'ind-h', cls: 'head--stack', lead: 'Trusted experience in building scalable solutions for multiple industries.' })}<a class="link" href="industries.html">All industries ${ic('arrow')}</a></div>
  <div class="acc">${inds.map((d, i) => `<details${i === 0 ? ' open' : ''}><summary>${esc(d.q)}${ic('plus')}</summary><div class="acc__body"><p>${esc(d.a)}</p></div></details>`).join('')}</div>
</div></section>

${finale()}
`});
}

/* =====================================================================
   SERVICE DETAIL (10)
   ===================================================================== */
for (const sl of DETAIL) {
  const route = `/services/${sl}`, S = SVC[route];
  const heroIt = S[0].items, name = txtOf(heroIt.find(i => tagOf(i) === 'h1'));
  const h1i = heroIt.findIndex(i => tagOf(i) === 'h1');
  const sub = txtOf(heroIt.slice(h1i + 1).find(i => tagOf(i) === 'p'));
  const cat = catOf(sl);
  const offer = pairs(sec(SVC, route, /What we offer/i));
  const tech = groups(sec(SVC, route, /tech stack/i));
  const why = pairs(sec(SVC, route, /Why You Should Choose/i)).map(w => ({ t: w.t.replace(/AIOur$/, 'AI'), d: w.d.replace(/\s-\s?n to evolving.*$/, '') }));
  const proc = pairs(sec(SVC, route, /How we follow/i));
  const fq = faqs(sec(SVC, route, /Frequently Asked/i));
  const siblings = SERVICE_CATS.find(c => c.category === cat).items.filter(s => s.slug !== sl);
  page({ file: `service-${sl}.html`, title: name, desc: sub, body: `
${pageHero({ crumbs: [['services.html', 'Services'], [`services.html?cat=${slug(cat)}#catalogue`, esc(cat)], [null, esc(name)]], eb: esc(cat), h: esc(name), lead: esc(sub), actions: `${btnBuild()}<a class="btn btn--line" href="contact.html?need=Build%20a%20new%20product&area=${encodeURIComponent(cat)}">Talk to an engineer</a>` })}

<section class="s s--line" aria-labelledby="offer-h"><div class="w">
  ${head({ eb: 'What we offer', h: `What we offer in ${esc(fixCase(name.toLowerCase()))}`, id: 'offer-h' })}
  <div class="ruled ruled--4">${offer.map(o => `<article><h3>${esc(o.t)}</h3><p>${esc(o.d)}</p></article>`).join('')}</div>
</div></section>

<section class="s s--sunk" aria-labelledby="tech-h"><div class="w">
  ${head({ eb: 'Technology', h: 'The stack we use most often', id: 'tech-h', lead: `For ${esc(fixCase(name.toLowerCase()))}. The full stack covers 13 categories.` })}
  ${techRows(tech)}
</div></section>

<section class="s" aria-labelledby="why-h"><div class="w">
  ${head({ eb: 'Why PTN', h: 'Why you should choose PTN', id: 'why-h' })}
  <div class="ruled ruled--3">${why.map(w => `<article><h3>${esc(w.t)}</h3><p>${esc(w.d)}</p></article>`).join('')}</div>
</div></section>

<section class="s night" aria-labelledby="proc-h"><div class="w">
  ${head({ eb: 'Process', h: 'How we complete your project', id: 'proc-h', lead: `${proc.length} steps from first conversation to ongoing support.` })}
  ${steps(proc, proc.length % 3 === 0 ? 3 : 4)}
</div></section>

<section class="s" aria-labelledby="cs-h"><div class="w">
  ${head({ eb: 'Case studies', h: 'Related work', id: 'cs-h', aside: `<a class="link" href="case-studies.html">All case studies ${ic('arrow')}</a>` })}
  <div class="cases">${testimonialCase()}${caseCard(CASES[0])}</div>
</div></section>

${fq.length ? `<section class="s s--sunk" aria-label="Frequently asked questions"><div class="w">${faqBlock(fq, `About ${esc(fixCase(name.toLowerCase()))} with PTN.`)}</div></section>` : ''}

<section class="s s--tight s--line" aria-labelledby="more-h"><div class="w">
  <h2 class="eyebrow" id="more-h" style="margin-bottom:16px">More in ${esc(cat)}</h2>
  <ul class="index">${siblings.map(s => `<li><a href="${svcHref(s)}"><b>${esc(s.name)}</b><span>${esc(s.desc)}</span>${ic('arrow')}</a></li>`).join('')}</ul>
</div></section>

${finale()}
`});
}

/* =====================================================================
   INDUSTRIES
   ===================================================================== */
{
  const IND = DOCS.structure.industries;
  const long = Object.fromEntries(faqs(sec(PAGES, '/services', /Industry that we work on/)).map(f => [f.q, f.a]));
  const tagline = Object.fromEntries((() => { const it = sec(PAGES, '/services', /Industry that we work on/); const o = []; let q = null; for (const x of it) { if (tagOf(x) === 'summary') q = txtOf(x); else if (tagOf(x) === 'p' && q) { o.push([q, txtOf(x)]); q = null; } } return o; })());
  const benefits = pairs(sec(PAGES, '/expertise/industries', /Benefits of working/));
  page({ file: 'industries.html', title: 'Industries', desc: 'Domain expertise across finance, healthcare, retail, logistics, education, the public sector, telecommunications and professional services.', body: `
${pageHero({ crumbs: [[null, 'Expertise'], [null, 'Industries']], eb: 'Expertise', h: 'Expertise and <span class="accent">industries</span>', lead: 'Domain expertise and market knowledge to help your business evolve and scale with the right technology.', actions: `${btnBuild()}<a class="btn btn--line" href="contact.html">Talk to an engineer</a>` })}

<section class="s s--line" aria-labelledby="ind-h"><div class="w">
  ${head({ eb: 'Industries', h: 'The industries we work in', id: 'ind-h', lead: `${IND.length} sectors and ${IND.reduce((n, c) => n + c.items.length, 0)} specialisms. Pick a sector to see what we build for it.` })}
  <div class="explorer">
    <div class="explorer__tabs" role="tablist" aria-label="Industries" aria-orientation="vertical">${IND.map((c, i) => `<button type="button" role="tab" id="t-${slug(c.category)}" aria-controls="${slug(c.category)}" aria-selected="${i === 0}" tabindex="${i ? -1 : 0}">${esc(c.category)}<small>${c.items.length}</small></button>`).join('')}</div>
    ${IND.map((c, i) => `<div class="explorer__panel tabpanel" role="tabpanel" id="${slug(c.category)}" aria-labelledby="t-${slug(c.category)}" tabindex="0"${i ? ' hidden' : ''}>
      <h3 class="h3" style="font-size:1.9rem">${esc(c.category)}</h3>${long[c.category] ? `<p class="lead" style="margin-top:12px;color:var(--ink)">${esc(tagline[c.category] || '')}</p><p style="margin-top:12px;color:var(--ink-2);max-width:68ch">${esc(long[c.category])}</p>` : ''}
      <ul class="index" style="margin-top:24px">${c.items.map(x => `<li><div style="grid-template-columns:minmax(0,.8fr) minmax(0,1.4fr)"><b style="font-size:1.15rem">${esc(x.name)}</b><span>${esc(x.desc)}</span></div></li>`).join('')}</ul>
      <p style="margin-top:24px"><a class="btn btn--sm" href="contact.html?need=Build%20a%20new%20product">Discuss a ${esc(c.category.split(/[ ,&]/)[0].toLowerCase())} project ${ic('arrow')}</a></p>
    </div>`).join('')}
  </div>
</div></section>

<section class="s s--sunk" aria-labelledby="ben-h"><div class="w">
  ${head({ eb: 'Benefits', h: 'Benefits of working with us', id: 'ben-h', lead: 'Industry expertise, agile teams and practical solutions to help you scale faster and achieve measurable results.' })}
  <div class="ruled ruled--2">${benefits.map(b => `<article><h3>${esc(b.t)}</h3><p>${esc(b.d)}</p></article>`).join('')}</div>
</div></section>

<section class="s" aria-labelledby="svc-h"><div class="w">
  ${head({ eb: 'Services', h: 'Services across every sector', id: 'svc-h' })}
  <ul class="index">${SERVICE_CATS.map(c => `<li><a href="services.html?cat=${slug(c.category)}#catalogue"><b>${esc(c.category)}</b><span>${esc(catBlurb(c.category))}</span>${ic('arrow')}</a></li>`).join('')}</ul>
</div></section>

${finale()}
`});
}

/* =====================================================================
   TECHNOLOGIES
   ===================================================================== */
{
  const all = groups(PAGES['/expertise/technologies'].flatMap(s => s.items));
  const ai = DOCS.structure.technologies[0];
  page({ file: 'technologies.html', title: 'Technologies', desc: `The languages, frameworks, databases and platforms PTN engineers use, across ${all.length} categories.`, body: `
${pageHero({ crumbs: [[null, 'Expertise'], [null, 'Technologies']], eb: 'Expertise', h: 'Our engineering <span class="accent">tech stack</span>', lead: 'Choosing the right stack is crucial. These are the languages, frameworks, databases and platforms our teams use to deliver robust solutions.', side: `<p class="small muted">${all.length} categories · ${all.reduce((n, g) => n + g.li.length, 0)} tools and platforms</p>` })}
<section class="s s--line" aria-labelledby="all-h"><div class="w">
  <h2 class="sr-only" id="all-h">All technologies</h2>
  ${techRows(all)}
</div></section>
<section class="s s--sunk" aria-labelledby="ai-h"><div class="w">
  ${head({ eb: 'Focus', h: esc(ai.category), id: 'ai-h', lead: 'Intelligent solutions for automation and decision-making, from predictive analytics to autonomous agents.' })}
  <ul class="ruled ruled--5">${ai.items.map(t => `<li><h3 style="font-size:1.15rem">${esc(t.name)}</h3>${t.examples ? `<p>${esc(t.examples)}</p>` : ''}</li>`).join('')}</ul>
</div></section>
${finale()}
`});
}

/* =====================================================================
   CASE STUDIES + DETAILS
   ===================================================================== */
page({ file: 'case-studies.html', title: 'Case studies', desc: 'How PTN Global solves complex challenges with scalable, secure and tailored solutions.', body: `
${pageHero({ crumbs: [[null, 'Expertise'], [null, 'Case studies']], eb: 'Expertise', h: 'Our case <span class="accent">studies</span>', lead: 'We collaborate with businesses to solve complex challenges through scalable, secure and tailored solutions. These stories show the impact of our work and the long-term partnerships we are proud to build.' })}
<section class="s s--line" aria-labelledby="list-h"><div class="w">
  <h2 class="sr-only" id="list-h">Case studies</h2>
  <div class="seg" data-filter="#case-list" data-status="#case-status" role="group" aria-label="Filter case studies by service"><button type="button" aria-pressed="true" data-value="all">All</button>${SERVICE_CATS.map(c => `<button type="button" aria-pressed="false" data-value="${esc(c.category)}">${esc(c.category)}</button>`).join('')}</div>
  <p class="filter-status" id="case-status" role="status">Showing ${CASES.length + 1} of ${CASES.length + 1}</p>
  <div class="cases" id="case-list" style="margin-top:24px">${testimonialCase()}${caseCard(CASES[0], true)}${CASES.slice(1).map(c => caseCard(c)).join('')}</div>
  <p class="small muted" style="margin-top:24px">Sector overviews: client-identifying details and measured results are shared with client approval.</p>
</div></section>
${finale()}
`});
for (const c of CASES) {
  page({ file: `case-${c.id}.html`, title: c.title, desc: c.sum, body: `
${pageHero({ crumbs: [[null, 'Expertise'], ['case-studies.html', 'Case studies'], [null, esc(c.title)]], eb: esc(c.tag), h: esc(c.title), lead: esc(c.sum) })}
<section class="s s--tight"><div class="w"><dl class="facts">${c.facts.map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl></div></section>
<section class="s s--line" aria-label="Case study"><div class="w"><div class="ruled ruled--3">
  <article><span class="n">THE CHALLENGE</span><p style="font-size:1.0625rem;color:var(--ink)">${esc(c.challenge)}</p></article>
  <article><span class="n">OUR SOLUTION</span><p style="font-size:1.0625rem;color:var(--ink)">${esc(c.solution)}</p></article>
  <article><span class="n">THE RESULTS</span><ul class="checklist" style="margin-top:12px">${c.results.map(r => `<li>${ic('check')}<span>${esc(r)}</span></li>`).join('')}</ul></article>
</div></div></section>
<section class="s s--sunk" aria-labelledby="t-h"><div class="w split"><h2 class="h2" id="t-h">Technology used</h2><div class="chips">${c.tech.map(t => `<span class="chip">${esc(t)}</span>`).join('')}</div></div></section>
<section class="s" aria-labelledby="more-h"><div class="w">${head({ eb: 'More', h: 'More case studies', id: 'more-h', aside: `<a class="link" href="case-studies.html">All case studies ${ic('arrow')}</a>` })}<div class="cases">${CASES.filter(x => x !== c).slice(0, 3).map(x => caseCard(x)).join('')}</div></div></section>
${finale()}
`});
}

/* =====================================================================
   CAREERS + DETAILS
   ===================================================================== */
const jobFile = j => `career-${slug(j.t)}.html`;
const jobType = j => (j.job === 'Other' ? 'General' : j.job);
{
  const vibes = txtOf(sec(PAGES, '/careers', /End-to-end good vibes/).find(i => tagOf(i) === 'p'));
  const benefits = pairs(sec(PAGES, '/careers', /What will you get/));
  const hiring = pairs(sec(PAGES, '/careers', /hiring process/));
  const intern = txtOf(sec(PAGES, '/careers', /Internships & Talent/).find(i => tagOf(i) === 'p' && txtOf(i).length > 80));
  const types = [...new Set(JOBS.map(jobType))];
  page({ file: 'careers.html', title: 'Careers', desc: `Open roles at PTN Global's development center in Can Tho, Vietnam, plus a 3-month On-the-Job Training program.`, body: `
${pageHero({ crumbs: [[null, 'Careers']], eb: 'Careers', h: 'Help us shape <span class="accent">an industry.</span>', lead: 'Be part of a team that drives innovation, challenges limits and creates solutions that transform businesses worldwide.', actions: `<a class="btn" href="#openings">Browse ${JOBS.length} jobs</a><a class="btn btn--line" href="#internships">Internships</a>` })}

<section class="s s--line" aria-labelledby="vibes-h"><div class="w split">
  <div><p class="eyebrow">Culture</p><h2 class="h2" id="vibes-h" style="margin-top:16px">End-to-end good vibes</h2><p class="lead" style="margin-top:20px">${esc(vibes)}</p></div>
  <div><h3 class="h3">Our operating principles</h3><ul class="checklist" style="margin-top:20px">${PRINCIPLES.map(p => `<li>${ic('check')}<span>${esc(p)}</span></li>`).join('')}</ul></div>
</div></section>

<section class="s s--sunk" id="openings" aria-labelledby="open-h"><div class="w">
  ${head({ eb: 'Open positions', h: 'Choose your next career opportunity', id: 'open-h' })}
  <div data-search-scope="#jobs" data-count="#job-count" data-empty="#jobs-empty">
    <form class="tools" role="search" onsubmit="return false">
      <div class="field"><label for="j-q">Search positions</label><input class="input" id="j-q" type="search" data-search placeholder="Title or keyword" autocomplete="off"></div>
      <div class="field"><label for="j-type">Job type</label><select class="select" id="j-type" data-key="type"><option value="">All jobs</option>${types.map(t => `<option>${esc(t)}</option>`).join('')}</select></div>
      <div class="field"><label for="j-level">Level</label><select class="select" id="j-level" data-key="level"><option value="">All levels</option><option>Senior</option><option>Junior</option><option>OJT</option></select></div>
    </form>
    <p class="filter-status" id="job-count" data-noun="open position" role="status">${JOBS.length} open positions</p>
  </div>
  <ul class="jobs" id="jobs" style="margin-top:16px">${JOBS.map(j => `<li data-item data-type="${esc(jobType(j))}" data-level="${esc(j.level)}"><a href="${jobFile(j)}"><span><span class="tag">${esc(jobType(j))}</span><b>${esc(j.t)}</b></span><span class="meta">${esc(j.loc)} · ${esc(j.level || 'All levels')} · ${esc(j.date)}</span>${ic('arrow')}</a></li>`).join('')}</ul>
  <div class="empty" id="jobs-empty" hidden><p><b>No positions match these filters.</b></p><p style="margin-top:8px">Clear a filter, or send your CV and we will reach out when a role opens.</p><p class="actions" style="justify-content:center;margin-top:16px"><button class="btn btn--line btn--sm" type="button" data-reset>Clear filters</button></p></div>
</div></section>

<section class="s" aria-labelledby="ben-h"><div class="w">
  ${head({ eb: 'Benefits', h: 'What you get when working with us', id: 'ben-h' })}
  <div class="ruled ruled--3">${benefits.map(b => `<article><h3>${esc(b.t)}</h3><p>${esc(b.d)}</p></article>`).join('')}</div>
  <div class="split" style="margin-top:56px"><h3 class="h3">The practical perks</h3><ul class="checklist" style="grid-template-columns:repeat(auto-fit,minmax(240px,1fr))">${PERKS.map(([, p]) => `<li>${ic('check')}<span>${esc(p)}</span></li>`).join('')}</ul></div>
</div></section>

<section class="s night" aria-labelledby="hire-h"><div class="w">
  ${head({ eb: 'Hiring process', h: 'Here’s our hiring process', id: 'hire-h', lead: 'Six steps, and we keep you informed at each one.' })}
  ${steps(hiring, 3)}
</div></section>

<section class="s" id="internships" aria-labelledby="int-h"><div class="w split">
  <div><p class="eyebrow">OJT & internship</p><h2 class="h2" id="int-h" style="margin-top:16px">Internships & talent programs</h2><p class="lead" style="margin-top:20px">${esc(intern)}</p><p style="margin-top:28px"><a class="btn" href="${jobFile(JOBS.find(j => j.level === 'OJT'))}">See the OJT program ${ic('arrow')}</a></p></div>
  <dl class="facts" style="align-self:end"><div><dt>Program length</dt><dd>3 months</dd></div><div><dt>Format</dt><dd>Hands-on training on real projects</dd></div><div><dt>After the program</dt><dd>Full-time offers for outstanding participants</dd></div></dl>
</div></section>

${finale('Choose your next <span class="accent">career opportunity.</span>', 'Do not see the right role? Send your CV and the talent team will reach out when one opens.')}
`});
  for (const j of JOBS) {
    page({ file: jobFile(j), title: j.t, desc: j.summary, body: `
${pageHero({ crumbs: [['careers.html', 'Careers'], [null, esc(j.t)]], eb: `Careers · ${esc(jobType(j))}`, h: esc(j.t), lead: esc(j.summary), actions: `<a class="btn btn--accent" href="#apply">Apply now ${ic('arrow')}</a><a class="btn btn--line" href="careers.html#openings">All positions</a>` })}
<section class="s s--tight"><div class="w"><dl class="facts"><div><dt>Employment type</dt><dd>${j.level === 'OJT' ? '3-month program' : 'Full-time'}</dd></div><div><dt>Location</dt><dd>${esc(j.loc)}, Vietnam</dd></div><div><dt>Level</dt><dd>${esc(j.level || 'All levels')}</dd></div><div><dt>Posted</dt><dd>${esc(j.date)}</dd></div><div><dt>Closes</dt><dd>Open until filled</dd></div></dl></div></section>
<section class="s s--line"><div class="w split split--wide">
  <div class="sticky"><h2 class="h3">Why join us</h2><ul class="checklist" style="margin-top:16px">${PERKS.map(([, p]) => `<li>${ic('check')}<span>${esc(p)}</span></li>`).join('')}</ul></div>
  <div class="prose"><h2 class="h3" style="color:var(--ink)">About us</h2><p style="margin-top:12px">PTN Global was founded by Tam Phan, based in Melbourne, Australia. Our development center is in Vietnam, combining offshore expertise with face-to-face interaction for clients in Australia, New Zealand and other English-speaking countries.</p>
    <h2 class="h3" style="color:var(--ink);margin-top:32px">About the role</h2><p style="margin-top:12px">${esc(j.summary)}</p>
    <p class="draft" style="margin-top:20px">Responsibilities, requirements and nice-to-haves come from the job post on the PTN job board.</p></div>
</div></section>
<section class="s s--sunk" id="apply" aria-labelledby="apply-h"><div class="w split split--wide">
  <div>${head({ eb: 'Apply', h: 'Ready to apply?', id: 'apply-h', cls: 'head--stack', lead: 'Fields marked * are required. We reply to every application.' })}</div>
  <form class="formcard" data-validate novalidate>
    <div class="grid-form">
      <div class="field"><label for="a-first">First name <span class="req" aria-hidden="true">*</span></label><input class="input" id="a-first" autocomplete="given-name" required><p class="err" aria-live="polite"></p></div>
      <div class="field"><label for="a-last">Last name <span class="req" aria-hidden="true">*</span></label><input class="input" id="a-last" autocomplete="family-name" required><p class="err" aria-live="polite"></p></div>
      <div class="field"><label for="a-email">Email <span class="req" aria-hidden="true">*</span></label><input class="input" id="a-email" type="email" autocomplete="email" required><p class="err" aria-live="polite"></p></div>
      <div class="field"><label for="a-pref">Preferred name</label><input class="input" id="a-pref" autocomplete="nickname"></div>
      <div class="field"><label for="a-li">LinkedIn URL</label><input class="input" id="a-li" type="url" placeholder="https://www.linkedin.com/in/your-name"><p class="err" aria-live="polite"></p></div>
      <div class="field"><label for="a-loc">Location <span class="req" aria-hidden="true">*</span></label><input class="input" id="a-loc" autocomplete="address-level2" required><p class="err" aria-live="polite"></p></div>
      <div class="field full"><label for="a-cv">Upload your CV <span class="req" aria-hidden="true">*</span></label><p class="hint" id="a-cv-h">PDF only.</p><input class="input" id="a-cv" type="file" accept="application/pdf" required aria-describedby="a-cv-h"><p class="err" aria-live="polite"></p></div>
      <fieldset class="field full"><legend>Independent work acknowledgement <span class="req" aria-hidden="true">*</span></legend><p class="hint">Technical interviews are completed independently, without AI tools, help from others or copied solutions.</p>
        <div class="opts"><label class="opt"><input type="radio" name="ack-${slug(j.t)}" value="yes" required><span>Yes, I acknowledge</span></label><label class="opt"><input type="radio" name="ack-${slug(j.t)}" value="no"><span>No</span></label></div><p class="err" aria-live="polite"></p></fieldset>
      <label class="check full"><input type="checkbox"> <span>Save my details to apply to other roles faster.</span></label>
      <div class="full"><p class="status" data-status role="status" tabindex="-1" hidden></p></div>
      <div class="full actions"><button class="btn btn--accent" type="submit">Submit application</button><span class="small muted">By applying you agree to our <a href="legal.html#terms">terms</a> and <a href="legal.html#privacy">privacy policy</a>.</span></div>
    </div>
  </form>
</div></section>
`});
  }
}

/* =====================================================================
   INSIGHTS + TEMPLATES
   ===================================================================== */
{
  const items = [
    ...TOPICS.map(([c, t]) => ({ c: c === 'Events' ? 'Events' : c, t })),
    ...WHITEPAPERS.map(t => ({ c: 'Whitepapers', t })),
    ...NEWSLETTERS.map(t => ({ c: 'Newsletters', t })),
    ...['Company introduction', 'Inside the Can Tho development center', 'Team-building day'].map(t => ({ c: 'Videos', t })),
  ];
  const href = it => (it.t === TOPICS[0][1] ? 'blog.html' : it.t === WHITEPAPERS[0] ? 'whitepaper.html' : null);
  page({ file: 'insights.html', title: 'Insights', desc: 'Engineering notes, company news, events, videos, whitepapers and newsletters from the PTN team.', body: `
${pageHero({ crumbs: [[null, 'Insights']], eb: 'Insights', h: 'PTN Global’s <span class="accent">insight</span>', lead: 'Engineering notes, company news, events, videos, whitepapers and newsletters from the PTN team.' })}
<section class="s s--line" aria-labelledby="posts-h"><div class="w">
  <h2 class="sr-only" id="posts-h">Posts</h2>
  <div data-search-scope="#posts" data-count="#post-count" data-empty="#posts-empty">
    <div class="tools" style="grid-template-columns:minmax(0,2fr) minmax(0,1fr)"><div class="seg" role="group" aria-label="Filter by category"><button type="button" data-cat="all" aria-pressed="true">All</button>${INSIGHT_CATS.map(c => `<button type="button" data-cat="${c}" aria-pressed="false">${c}</button>`).join('')}</div>
      <div class="field"><label for="p-q" class="sr-only">Search posts</label><input class="input" id="p-q" type="search" data-search placeholder="Search posts" autocomplete="off"></div></div>
    <p class="filter-status" id="post-count" data-noun="post" role="status">${items.length} posts</p>
  </div>
  <ul class="news" id="posts" style="margin-top:16px">${items.map(it => `<li data-item data-type="${it.c}">${href(it) ? `<a href="${href(it)}"><small>${it.c}</small><b>${esc(it.t)}</b><small>Read ${it.c === 'Whitepapers' ? 'whitepaper' : 'article'}</small></a>` : `<div class="row"><small>${it.c}</small><b>${esc(it.t)}</b><small>Coming soon</small></div>`}</li>`).join('')}</ul>
  <div class="empty" id="posts-empty" hidden><p><b>No posts match.</b> Try another keyword or category.</p><p class="actions" style="justify-content:center;margin-top:16px"><button class="btn btn--line btn--sm" type="button" data-reset>Clear filters</button></p></div>
</div></section>
${finale()}
`});
  const article = ({ file, kind, title, lead, mins, toc, related }) => page({ file, title, desc: lead, body: `
<section class="hero"><div class="w">${crumb([['insights.html', 'Insights'], [`insights.html?cat=${kind}`, kind], [null, esc(title)]])}
  <div class="article" style="margin-top:40px"><p class="eyebrow">${kind}</p><h1 class="h1" style="margin-top:16px">${esc(title)}</h1><p class="lead" style="margin-top:20px">${esc(lead)}</p><p class="small muted" style="margin-top:16px">PTN Global · ${mins} minute read</p>
  ${kind === 'Whitepapers' ? `<p style="margin-top:24px"><span class="btn btn--line" aria-disabled="true">${ic('download')} PDF coming soon</span></p>` : ''}</div></div></section>
<section class="s s--line"><div class="w"><div class="article">
  <p class="draft">Draft outline. The article body comes from the CMS.</p>
  ${toc ? `<nav aria-label="Contents" style="margin-top:32px"><p class="eyebrow" style="margin-bottom:12px">Contents</p><ol class="toc">${toc.map((t, i) => `<li><a href="#a${i}">${esc(t)}</a></li>`).join('')}</ol></nav>` : ''}
  ${(toc || []).map((t, i) => `<h2 id="a${i}">${esc(t)}</h2><p class="muted">Section to be written.</p>`).join('')}
</div></div></section>
<section class="s s--sunk" aria-labelledby="rel-h"><div class="w">${head({ eb: kind, h: `More ${kind.toLowerCase()}`, id: 'rel-h' })}<ul class="news">${related.map(t => `<li><div class="row"><small>${kind}</small><b>${esc(t)}</b><small>Coming soon</small></div></li>`).join('')}</ul></div></section>
${finale()}
`});
  article({ file: 'blog.html', kind: 'Blog', title: TOPICS[0][1], lead: 'What a smaller city gives an offshore team: lower attrition, a university pipeline and a calmer pace of work.', mins: 6, toc: ['Why look beyond Ho Chi Minh City', 'A university pipeline on our doorstep', 'Retention and a calmer pace', 'How we run it from Melbourne'], related: TOPICS.filter(t => t[0] === 'Blog').slice(1, 4).map(t => t[1]) });
  article({ file: 'whitepaper.html', kind: 'Whitepapers', title: WHITEPAPERS[0], lead: 'A practical guide for Australian companies setting up, running and measuring an offshore delivery team.', mins: 14, toc: ['Choosing the engagement model', 'Security and compliance', 'Onboarding and ways of working', 'Measuring performance'], related: WHITEPAPERS.slice(1, 4) });
}

/* =====================================================================
   CONTACT
   ===================================================================== */
{
  const needs = ['Build a new product', 'Extend my team', 'Modernise a legacy system', 'Request for proposal (RFP)', 'Partner with PTN'];
  const techs = ['.NET', 'Node.js', 'Python', 'React', 'Angular', 'Vue.js', 'Flutter', 'React Native', 'iOS', 'Android', 'AWS', 'Azure', 'OpenAI / LLM', 'Other'];
  const models = ENG_GROUPS.flatMap(g => g.items.map(m => m.name));
  const opt = (name, v, type = 'radio', req = false) => `<label class="opt"><input type="${type}" name="${name}" value="${esc(v)}"${req ? ' required' : ''}><span>${esc(v)}</span></label>`;
  page({ file: 'contact.html', title: 'Contact', desc: 'Tell PTN Global what you are building. A delivery lead replies within one business day.', body: `
${pageHero({ crumbs: [[null, 'Contact']], eb: 'Contact', h: 'Big projects always start through <span class="accent">a simple conversation.</span>', lead: 'Tell us what you are building. A delivery lead replies within one business day.', side: `<ul class="checklist"><li>${ic('phone')}<a href="tel:${CONTACT.tel}">${CONTACT.phone}</a></li><li>${ic('mail')}<a href="mailto:${CONTACT.email}">${CONTACT.email}</a></li></ul>` })}

<section class="s s--line" aria-labelledby="form-h"><div class="w split split--wide">
  <div class="sticky">${head({ eb: 'Enquiry', h: 'Tell us about your project', id: 'form-h', cls: 'head--stack', lead: 'Three short steps. You can review everything before sending.' })}</div>
  <form class="formcard" id="lead" data-validate novalidate>
    <ol class="stepper"><li aria-current="step"><b>1</b>Your need</li><li><b>2</b>Tech & team</li><li><b>3</b>Your details</li><li><b>4</b>Review</li></ol>
    <div data-step><div class="grid-form">
      <fieldset class="field full"><legend>What do you need? <span class="req" aria-hidden="true">*</span></legend><div class="opts">${needs.map((n, i) => opt('need', n, 'radio', i === 0)).join('')}</div><p class="err" aria-live="polite"></p></fieldset>
      <div class="field full"><label for="l-area">Service area</label><select class="select" id="l-area" name="area"><option value="">Not sure yet</option>${SERVICE_CATS.map(c => `<option>${esc(c.category)}</option>`).join('')}</select></div>
    </div></div>
    <div data-step hidden><div class="grid-form">
      <fieldset class="field full"><legend>Technology (optional)</legend><div class="opts">${techs.map(t => opt('tech', t, 'checkbox')).join('')}</div></fieldset>
      <div class="field"><label for="l-size">Team size <span class="req" aria-hidden="true">*</span></label><select class="select" id="l-size" name="size" required><option value="">Select</option><option>1-2</option><option>3-5</option><option>6-10</option><option>10+</option></select><p class="err" aria-live="polite"></p></div>
      <div class="field"><label for="l-model">Engagement model</label><select class="select" id="l-model" name="model"><option value="">Not sure yet</option>${models.map(m => `<option>${esc(m)}</option>`).join('')}</select></div>
      <p class="hint full">Not sure which model fits? <a class="link" href="services.html#engagement">Compare the nine models</a>.</p>
    </div></div>
    <div data-step hidden><div class="grid-form">
      <div class="field"><label for="l-name">Full name <span class="req" aria-hidden="true">*</span></label><input class="input" id="l-name" name="name" autocomplete="name" required><p class="err" aria-live="polite"></p></div>
      <div class="field"><label for="l-email">Work email <span class="req" aria-hidden="true">*</span></label><input class="input" id="l-email" name="email" type="email" autocomplete="email" required><p class="err" aria-live="polite"></p></div>
      <div class="field"><label for="l-company">Company <span class="req" aria-hidden="true">*</span></label><input class="input" id="l-company" name="company" autocomplete="organization" required><p class="err" aria-live="polite"></p></div>
      <div class="field"><label for="l-country">Country</label><input class="input" id="l-country" name="country" autocomplete="country-name"></div>
      <div class="field full"><label for="l-details">Project details</label><textarea class="textarea" id="l-details" name="details"></textarea></div>
      <label class="check full"><input type="checkbox" name="nda" value="Yes"> <span>Send me an NDA before we talk.</span></label>
    </div></div>
    <div data-step hidden><h2 class="h3" tabindex="-1">Check your request</h2><dl class="summary" id="lead-summary" style="margin-top:16px"></dl></div>
    <p class="status" id="lead-status" role="status" tabindex="-1" hidden style="margin-top:20px"></p>
    <div class="actions" style="margin-top:28px"><button class="btn btn--line" type="button" id="lead-back" hidden>Back</button><button class="btn btn--accent" type="button" id="lead-next">Continue</button></div>
  </form>
</div></section>

<section class="s s--sunk" aria-labelledby="off-h"><div class="w">
  ${head({ eb: 'Offices', h: 'Our offices', id: 'off-h' })}
  <div class="offices">${[MEL, CT].map(o => `<article><p class="tag">${esc(o.role)}</p><h3 style="margin-top:8px">${esc(o.city)}</h3><address>${esc(o.addr)}</address><a class="link" style="margin-top:12px" href="https://www.openstreetmap.org/?mlat=${o.map[1]}&mlon=${o.map[0]}#map=17/${o.map[1]}/${o.map[0]}" target="_blank" rel="noopener">Open in OpenStreetMap<span class="sr-only"> (opens in a new tab)</span> ${ic('ext')}</a></article>`).join('')}</div>
</div></section>

<section class="s" aria-labelledby="partner-h"><div class="w split">
  <div><p class="eyebrow">Partnerships</p><h2 class="h2" id="partner-h" style="margin-top:16px">Partner with us</h2></div>
  <div><p class="lead">Strategic alliances for agencies, consultancies and product companies that need a reliable engineering partner in Vietnam.</p><p style="margin-top:24px"><a class="btn btn--line" href="contact.html?need=Partner%20with%20PTN#form-h">Start a partnership conversation ${ic('arrow')}</a></p></div>
</div></section>
`});
}

/* =====================================================================
   LEGAL
   ===================================================================== */
page({ file: 'legal.html', title: 'Privacy & terms', desc: 'PTN Global privacy policy and terms of service.', body: `
${pageHero({ crumbs: [[null, 'Privacy & terms']], eb: 'Legal', h: 'Privacy policy and terms of service', lead: 'How PTN Global handles personal information, and the terms for using this website.' })}
<section class="s s--line"><div class="w"><div class="article">
  <h2 id="privacy">Privacy policy</h2><p class="draft">Content required from legal, aligned with the Australian Privacy Principles.</p>
  <h2 id="terms">Terms of service</h2><p class="draft">Content required from legal.</p>
  <p style="margin-top:32px">Questions about privacy? Email <a class="link" href="mailto:${CONTACT.email}">${CONTACT.email}</a>.</p>
</div></div></section>
`});
