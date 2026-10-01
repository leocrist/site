// Section kit. Every renderer returns an html`` fragment (Raw). Copy always arrives from docs.json.
import { html, raw, txt, icon } from './dom.js';
import { href } from './router.js';
import { wordmark } from './wordmark.js';
import { driftCanvas } from './drift.js';
import { serviceIllustration, servicesOverviewIllustration } from './illustrations.js';
import { LOGO, photo, stock, techTile, splitTech, TOPICS, CERTS, CLIENTS, TESTIMONIAL, JOBS } from './assets.js';

const CPG_VERIFY = 'https://enquiries.cpg.global/web/enquiry.nsf/enquiry.xsp?Open&id=ISMS/20/R84/1419';
export const CONTACT = { phone: '+61 414 734 277', phoneHref: 'tel:+61414734277', email: 'enquiry@ptnglobalcorp.com' };

export const CATEGORY_ICON = {
  'Core Application Development': 'code',
  'Emerging Technologies': 'brain',
  'Cloud & DevOps': 'cloud',
  'Testing & Quality Assurance': 'bug-beetle',
  'Design, Support & Maintenance': 'pen-nib',
};

/* ---------- headings ---------- */

/** Title with its accented clause. `accent` must be a substring of `title`. */
export function splitTitle(title, accent) {
  const t = txt(title);
  if (!accent || !t.includes(accent)) return html`${t}`;
  const i = t.lastIndexOf(accent);
  return html`${t.slice(0, i)}<span class="accent">${accent}</span>${t.slice(i + accent.length)}`;
}

export const eyebrow = (label) => (label ? html`<p class="eyebrow"><span class="eyebrow-mark" aria-hidden="true"></span>${label}</p>` : '');

export function head({ eyebrow: eb, title, accent, lead, actions, level = 2, align = 'start', id, wide = false }) {
  const H = level === 1 ? 'h1' : 'h2';
  // Left-aligned heads with a lead split in two: title on the left, lead (and actions) on the right, divided by a rule.
  if (align === 'start' && (lead || actions)) {
    return html`<header class="s-head s-head--split${wide ? ' s-head--wide' : ''}">
    <div class="s-head-main">${eyebrow(eb)}${raw(`<${H} class="display display--${level}"${id ? ` id="${id}"` : ''}>`)}${splitTitle(title, accent)}${raw(`</${H}>`)}</div>
    <div class="s-head-side">${lead ? html`<p class="lead">${txt(lead)}</p>` : ''}${actions ? html`<div class="s-actions">${actions}</div>` : ''}</div>
  </header>`;
  }
  return html`<header class="s-head s-head--${align}${wide ? ' s-head--wide' : ''}">
    ${eyebrow(eb)}
    ${raw(`<${H} class="display display--${level}"${id ? ` id="${id}"` : ''}>`)}${splitTitle(title, accent)}${raw(`</${H}>`)}
    ${lead ? html`<p class="lead">${txt(lead)}</p>` : ''}
    ${actions ? html`<div class="s-actions">${actions}</div>` : ''}
  </header>`;
}

/* ---------- section wrapper + annotations ---------- */

export function note(n, row, extra) {
  if (!row) return '';
  const behavior = row.parsed?.behavior || extra;
  return html`<aside class="note" aria-label="Annotation ${n}">
    <span class="note-pin">${n}</span>
    <div><strong>${row.section}</strong>${row.purpose ? html`<span> · ${txt(row.purpose)}</span>` : ''}
    ${behavior ? html`<em>Behavior: ${txt(behavior)}</em>` : ''}${row.ui ? html`<code>${row.ui}</code>` : ''}</div>
  </aside>`;
}

export function section({ id, cls = '', dark = false, grid = false, pin, row, extra, label }, inner) {
  const classes = ['s', dark && 's--dark', grid && 's--grid', cls].filter(Boolean).join(' ');
  return html`<section class="${classes}"${id ? raw(` id="${id}"`) : ''}${label ? raw(` aria-label="${label}"`) : ''} data-reveal>
    <div class="w">${pin ? note(pin, row, extra) : ''}${inner}</div>
  </section>`;
}

/* ---------- buttons ---------- */

export const btn = (label, { to = '#', kind = 'ink', arrow = false, attrs = '', size = '' } = {}) =>
  html`<a class="btn btn--${kind}${size ? ' btn--' + size : ''}" href="${to}"${raw(attrs ? ' ' + attrs : '')}><span>${label}</span>${arrow ? icon('arrow-right') : ''}</a>`;

export const buildTeamBtn = (kind = 'accent', size = '') =>
  html`<button type="button" class="btn btn--${kind}${size ? ' btn--' + size : ''}" data-open="dlg-team"><span>Build Your Team</span>${icon('arrow-right')}</button>`;

/* ---------- placeholders ---------- */

export const artPh = (label, { ratio = '16/9', tone = 'light', cls = '' } = {}) =>
  html`<figure class="ph ph--art ph--${tone} ${cls}" style="aspect-ratio:${ratio}">
    <figcaption>${icon('image')}<span><b>Art direction</b>${label}</span></figcaption>
  </figure>`;

export const awaitPh = (label, detail, { cls = '', ratio } = {}) =>
  html`<div class="ph ph--await ${cls}"${ratio ? raw(` style="aspect-ratio:${ratio}"`) : ''}>
    <p>${icon('hourglass-medium')}<span><b>Awaiting content</b>${label}</span></p>
    ${detail ? html`<small>${detail}</small>` : ''}
  </div>`;

/* ---------- chrome ---------- */

const MENUS = (structure) => [
  {
    label: 'Company', to: href('company'),
    links: [['About Us', '#/company'], ['Leadership', '#/company?at=leadership'], ['Our People', '#/company?at=people'], ['Methodologies', '#/company?at=methodologies'], ['Certifications', '#/company?at=awards']],
  },
  { label: 'Services', to: href('services'), mega: structure.services },
  {
    label: 'Expertise', to: href('industries'),
    links: [['Industries', href('industries')], ['Technologies', href('technologies')], ['Case Studies', href('case-studies')]],
  },
  { label: 'Insights', to: href('insights'), links: [['All insights', href('insights')], ['Blog', href('insights', { cat: 'Blog' })], ['News', href('insights', { cat: 'News' })], ['Events', href('insights', { cat: 'Events' })], ['Videos', href('insights', { cat: 'Video' })], ['Whitepapers', href('insights', { cat: 'Whitepaper' })], ['Newsletters', href('insights', { cat: 'Newsletter' })]] },
  { label: 'Careers', to: href('careers'), badge: jobsBadge() },
];

/** Careers flag: "New" while any role was posted in the last 45 days, "Hiring" while roles are open, nothing otherwise. */
function jobsBadge(now = new Date()) {
  if (!JOBS.length) return null;
  const fresh = JOBS.some((j) => (now - new Date(j.date)) / 864e5 <= 45);
  return fresh ? { text: 'New', title: 'New roles posted' } : { text: 'Hiring', title: `${JOBS.length} open roles` };
}
const navBadge = (b) => (b ? html`<span class="nav-badge" title="${b.title}">${b.text}</span>` : '');

export const logo = () =>
  html`<a class="logo" href="#/home" aria-label="PTN Global home"><img src="${LOGO}" alt="PTN GLOBAL" width="479" height="151"></a>`;

export function nav(structure, active) {
  const menus = MENUS(structure);
  const item = (m, i) => {
    const id = `menu-${i}`;
    const on = m.label === active ? ' is-active' : '';
    if (m.mega) {
      return html`<li class="nav-item${on}">
        <button class="nav-link" type="button" aria-expanded="false" aria-controls="${id}">${m.label}${icon('caret-down')}</button>
        <div class="mega" id="${id}" hidden>
          <div class="mega-in">
            <div class="mega-col mega-side">
              <a class="mega-cat" href="${href('services')}">${icon('squares-four')}All services</a>
              <ul><li><a href="#/services?at=engagement">Engagement Models</a></li><li><a href="#/services?at=roles">Offer Roles</a></li></ul>
              <a class="mega-ill" href="${href('services')}" tabindex="-1" aria-hidden="true">${servicesOverviewIllustration()}</a>
            </div>
            ${m.mega.map((g, gi) => html`<div class="mega-col">
              <a class="mega-cat" href="${href('services', { cat: g.items[0] && slugCat(g.category) })}">${icon(CATEGORY_ICON[g.category] || 'circle')}${g.category}</a>
              <ul>${g.items.map((s) => html`<li><a href="${href('service', { slug: s.slug })}">${s.name}</a></li>`)}</ul>
              <a class="mega-ill" href="${href('services', { cat: g.items[0] && slugCat(g.category) })}" tabindex="-1" aria-hidden="true">${serviceIllustration(gi, g.category)}</a>
            </div>`)}
          </div>
        </div>
      </li>`;
    }
    if (!m.links) return html`<li class="nav-item${on}"><a class="nav-link" href="${m.to}"${m.label === active ? raw(' aria-current="page"') : ''}>${m.label}${navBadge(m.badge)}</a></li>`;
    return html`<li class="nav-item${on}">
      <button class="nav-link" type="button" aria-expanded="false" aria-controls="${id}">${m.label}${icon('caret-down')}</button>
      <ul class="drop" id="${id}" hidden>${m.links.map(([l, to]) => html`<li><a href="${to}">${l}</a></li>`)}</ul>
    </li>`;
  };
  return html`<div class="announce"><p>ISO/IEC 27001:2022 certified by CPG. Quality-managed delivery from Can Tho, Vietnam. <a href="#/company?at=awards">See our certifications ${icon('arrow-right')}</a></p></div>
  <header class="nav" data-nav>
    <div class="nav-in">
      ${logo()}
      <nav aria-label="Main"><ul class="nav-list">${menus.map(item)}</ul></nav>
      <div class="nav-cta">
        ${btn('Contact Us', { to: href('contact'), kind: 'line', size: 'sm' })}
        ${buildTeamBtn('ink', 'sm')}
        <button class="nav-burger" type="button" aria-expanded="false" aria-controls="mnav" aria-label="Open menu">${icon('list')}</button>
      </div>
    </div>
    <div class="mnav" id="mnav" hidden>
      ${menus.map((m) => (!m.links && !m.mega) ? html`<a class="mnav-link" href="${m.to}">${m.label}${navBadge(m.badge)}</a>` : html`<details><summary>${m.label}${icon('caret-down')}</summary><ul>
        ${m.mega ? m.mega.map((g) => html`<li class="mnav-cat">${g.category}</li>${g.items.map((s) => html`<li><a href="${href('service', { slug: s.slug })}">${s.name}</a></li>`)}`) : m.links.map(([l, to]) => html`<li><a href="${to}">${l}</a></li>`)}
      </ul></details>`)}
      <div class="mnav-cta">${btn('Contact Us', { to: href('contact'), kind: 'line' })}${buildTeamBtn('ink')}</div>
    </div>
  </header>`;
}

export const slugCat = (c) => c.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export function footer(structure) {
  const col = (t, links) => html`<div class="f-col"><h3>${t}</h3><ul>${links.map(([l, to]) => html`<li><a href="${to}">${l}</a></li>`)}</ul></div>`;
  return html`<footer class="footer">
    <div class="w footer-in">
      <div class="f-brand">
        ${logo()}
        <p>Software development from Vietnam, led from Melbourne.</p>
      </div>
      ${col('Services', structure.services.map((g) => [g.category, href('services', { cat: slugCat(g.category) })]))}
      ${col('Expertise', [['Industries', href('industries')], ['Technologies', href('technologies')], ['Case Studies', href('case-studies')]])}
      ${col('Company', [['About Us', href('company')], ['Insights', href('insights')], ['Careers', href('careers')], ['Contact', href('contact')]])}
      <div class="f-col f-side">
        <ul class="f-offices" aria-label="Offices">
          ${[['au', 'Australia', 'Head office', 'Level 5, 335 Flinders Lane, Melbourne VIC 3000'], ['vn', 'Vietnam', 'Development center', '13 Tran Binh Trong Street, Ninh Kieu District, Can Tho City']].map(([cc, c, r, a]) => html`<li>
            <p class="f-country"><img src="https://flagcdn.com/w40/${cc}.png" alt="" width="20" height="14" loading="lazy"><b>${c}</b><span>${r}</span></p>
            <p class="f-addr">${icon('map-pin')}${a}</p></li>`)}
        </ul>
        <div class="f-badges">
          <a class="f-badge" href="${CPG_VERIFY}" target="_blank" rel="noopener" aria-label="ISO/IEC 27001:2022 certified, verify certificate">
            <span class="iso-mark"><b>ISO</b><span>27001</span></span>
          </a>
          <a class="f-badge" href="${CPG_VERIFY}" target="_blank" rel="noopener" aria-label="Certified by CPG, Certification Partner Global">
            <img src="https://static.wixstatic.com/media/67e39e_4dc4d451a5fb49e49002dd4be6fce7f7~mv2.jpg/v1/fill/w_212,h_124,al_c,q_85,enc_auto/cpg.jpg" alt="" width="106" height="62" loading="lazy">
          </a>
          <p class="f-badge-note">ISO/IEC 27001:2022 · Certificate ISMS/20/R84/1419 · <a href="${CPG_VERIFY}" target="_blank" rel="noopener">Verify</a></p>
        </div>
        <div class="f-contact">
          <a href="${CONTACT.phoneHref}">${icon('phone')}${CONTACT.phone}</a>
          <a href="mailto:${CONTACT.email}">${icon('envelope-simple')}${CONTACT.email}</a>
        </div>
      </div>
    </div>
    <div class="w footer-base">
      <p>© 2021 PTN GLOBAL, All Rights Reserved.</p>
      <ul class="f-social" aria-label="Social media">
        ${[['linkedin-logo', 'LinkedIn', 'https://www.linkedin.com/company/ptn-global/'], ['facebook-logo', 'Facebook', 'https://www.facebook.com/ptnglobal']].map(([i, l, u]) => html`<li><a href="${u}" target="_blank" rel="noopener" aria-label="PTN GLOBAL on ${l}">${icon(i)}</a></li>`)}
      </ul>
      <p><a href="https://www.ptnglobalcorp.com/privacy" target="_blank" rel="noopener">Privacy Policy</a></p>
    </div>
    <div class="f-giant" aria-hidden="true">${wordmark()}</div>
  </footer>`;
}

/* ---------- heroes ---------- */

export function heroSplit({ pin, row, eyebrow: eb, title, accent, lead, actions, badge, media, backdrop }) {
  return section({ cls: 's--hero', grid: true, pin, row, label: 'Introduction' }, html`
    <div class="hero">
      <div class="hero-top${backdrop ? ' hero-top--flow' : ''}">
        ${backdrop || ''}
        <div>${eyebrow(eb)}<h1 class="display display--1">${splitTitle(title, accent)}</h1></div>
        ${badge ? html`<div class="hero-badge">${badge}</div>` : ''}
      </div>
      <div class="hero-row">
        ${lead ? html`<p class="hero-lead">${txt(lead)}</p>` : html`<span></span>`}
        <div class="hero-ctas">${actions}</div>
      </div>
      ${media ? html`<div class="hero-media">${media}</div>` : ''}
    </div>`);
}

export function heroPanel({ pin, row, title, accent, lead, actions, art, media }) {
  return section({ cls: 's--hero s--panel', pin, row, label: 'Introduction' }, html`
    <div class="panel-stage">
      ${media ? html`<div class="panel-bg panel-bg--photo">${media}</div>` : artPh(art, { ratio: 'auto', tone: 'deep', cls: 'panel-bg' })}
      <div class="panel">
        <h1 class="display display--1">${splitTitle(title, accent)}</h1>
        ${lead ? html`<p class="lead">${txt(lead)}</p>` : ''}
        ${actions ? html`<div class="s-actions s-actions--center">${actions}</div>` : ''}
      </div>
    </div>`);
}

export function heroTitle({ pin, row, eyebrow: eb, title, accent, lead, aside, actions, back }) {
  // With call-to-action buttons, the lead and the stacked CTAs share the ruled row used by heroSplit.
  if (actions) {
    return section({ cls: 's--hero s--title', grid: true, pin, row, label: 'Introduction' }, html`
      <div class="hero">
        <div class="hero-top">
          <div>${eyebrow(eb)}<h1 class="display display--1">${splitTitle(title, accent)}</h1></div>
          ${aside ? html`<div class="title-aside">${aside}</div>` : ''}
        </div>
        <div class="hero-row">
          ${lead ? html`<p class="hero-lead">${txt(lead)}</p>` : html`<span></span>`}
          <div class="hero-ctas">${actions}</div>
        </div>
      </div>`);
  }
  return section({ cls: 's--hero s--title', grid: true, pin, row, label: 'Introduction' }, html`
    <div class="title-hero">
      <div>${eyebrow(eb)}<h1 class="display display--1">${splitTitle(title, accent)}</h1>
      ${lead ? html`<p class="lead">${txt(lead)}</p>` : ''}
      ${back ? html`<div class="s-actions">${back}</div>` : ''}</div>
      ${aside ? html`<div class="title-aside">${aside}</div>` : ''}
    </div>`);
}

/* ---------- content blocks ---------- */

/** Ruled index list: big serif name, description, meta, arrow. */
export const indexList = (rows) =>
  html`<ol class="index">${rows.map((r) => html`<li><a class="index-row" href="${r.to}">
    <span class="index-ic">${icon(r.icon || 'arrow-up-right')}</span>
    <span class="index-name">${r.title}</span>
    <span class="index-text">${txt(r.text)}</span>
    <span class="index-meta">${r.meta || ''}${icon('arrow-right')}</span>
  </a></li>`)}</ol>`;

/** Sticky heading on the left, stacked blocks on the right. */
export const stickySplit = (left, blocks) =>
  html`<div class="sticky-split"><div class="sticky-left">${left}</div>
    <div class="stack">${blocks.map((b) => html`<article class="stack-item">
      ${b.icon ? html`<span class="stack-ic">${icon(b.icon)}</span>` : ''}
      <h3 class="h3">${txt(b.name)}</h3><p>${txt(b.text)}</p>${b.extra || ''}
    </article>`)}</div></div>`;

/** Ruled grid of items. */
export const ruledGrid = (items, { cols = 3, iconFor, numbered = false, cls = '' } = {}) =>
  html`<ul class="rgrid rgrid--${cols} ${cls}">${items.map((it, i) => html`<li class="rcell">
    ${numbered ? html`<span class="rnum">${String(i + 1).padStart(2, '0')}</span>` : iconFor ? html`<span class="ric">${icon(iconFor(it, i))}</span>` : ''}
    ${it.name ? html`<h3 class="h4">${txt(it.name)}</h3>` : ''}
    ${it.text ? html`<p>${txt(it.text)}</p>` : ''}
    ${it.to ? html`<a class="rlink" href="${it.to}">${it.linkLabel || 'Explore'}${icon('arrow-right')}</a>` : ''}
  </li>`)}</ul>`;

/** Tech stack: numbered category list + logo tiles (Simple Icons, monogram fallback). */
export function techTabs(cats) {
  // Swimlanes: every category visible at once, category on the left, its stack as logo chips on the right.
  const list = cats.filter((c) => c.name);
  return html`<ol class="lanes">${list.map((c, i) => {
    const items = splitTech(c.text);
    return html`<li class="lane${c.suggested ? ' is-suggested' : ''}">
      <div class="lane-head">
        <h3 class="lane-name">${c.name}</h3>
        ${c.suggested ? html`<span class="sample-flag">Suggested addition</span>` : ""}
      </div>
      <ul class="lane-tiles">${items.map(techTile)}</ul>
    </li>`;
  })}</ol>`;
}

/** Certificates wall: verified credentials first, then awards still owed. */
/** Certificates as a picture of the certificate plus its name. Up to four sit in a row; more than four scroll like the client marquee. */
export function certWall() {
  const doc = (c) => html`<span class="cert-doc${c.status === 'verified' ? '' : ' is-dashed'}" aria-hidden="true">
    ${c.logo ? html`<img src="${c.logo}" alt="" loading="lazy">` : html`<span class="cert-doc-mark">${c.seal ? c.seal[0] : 'ISO'}</span>`}
    <span class="cert-doc-kind">Certificate of Registration</span>
    <span class="cert-doc-std">${c.seal ? c.seal.join(' ') : c.std.replace(/:\s*/, ':')}</span>
    <span class="cert-doc-to">PTN GLOBAL</span>
    <span class="cert-doc-lines"><i></i><i></i><i></i></span>
    <svg class="cert-doc-stamp" viewBox="0 0 100 100" aria-hidden="true">
      <defs><path id="stamp-ring-${c.no.replace(/\W/g, '')}" d="M50,50 m-34,0 a34,34 0 1,1 68,0 a34,34 0 1,1 -68,0"/></defs>
      <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" stroke-width="2.5"/>
      <circle cx="50" cy="50" r="41" fill="none" stroke="currentColor" stroke-width="1"/>
      <circle cx="50" cy="50" r="25" fill="none" stroke="currentColor" stroke-width="1"/>
      <text font-size="10" font-family="IBM Plex Mono, monospace" letter-spacing="2.2" fill="currentColor"><textPath href="#stamp-ring-${c.no.replace(/\W/g, '')}">${c.status === 'verified' ? 'CERTIFIED' : 'SAMPLE'} · PTN GLOBAL · ${c.seal ? c.seal[0] : 'ISO'} ·</textPath></text>
      <path d="M50 33l4.9 10 11 1.6-8 7.8 1.9 11L50 58.2l-9.8 5.2 1.9-11-8-7.8 11-1.6z" fill="currentColor"/>
    </svg>
  </span>`;
  const tile = (c) => {
    const inner = html`${doc(c)}<span class="cert-name">${c.title}${c.status === 'demo' ? html` <small>(demo)</small>` : ''}</span>`;
    return html`<li class="cert-tile" title="${c.note}">${c.url ? html`<a href="${c.url}" target="_blank" rel="noopener">${inner}</a>` : inner}</li>`;
  };
  if (CERTS.length <= 4) return html`<ul class="cert-row">${CERTS.map(tile)}</ul>`;
  return html`<div class="marquee marquee--certs" data-marquee>
    <ul class="marquee-track cert-row">${CERTS.map(tile)}</ul>
    <ul class="marquee-track cert-row" aria-hidden="true">${CERTS.map(tile)}</ul>
  </div>`;
}

/** Logo marquee (TestSprite pattern): a row of ruled cells scrolling forever, faded at both edges.
    The set is rendered twice so the loop is seamless; the copy is hidden from assistive tech. */
export function clientStrip() {
  const cells = () => html`${CLIENTS.map((c) => html`<li class="client"><img src="${c.logo}" alt="${c.name}" loading="lazy"></li>`)}${[2, 3, 4, 5, 6, 7, 8].map((i) => html`<li class="client client--await"><span>Client logo ${i}</span></li>`)}`;
  return html`<div class="clients">
    <p class="clients-label eyebrow"><span class="eyebrow-mark" aria-hidden="true"></span>Trusted by teams in Australia, New Zealand and beyond</p>
    <div class="marquee" data-marquee>
      <ul class="marquee-track">${cells()}</ul>
      <ul class="marquee-track" aria-hidden="true">${cells()}</ul>
    </div>
  </div>`;
}

export function testimonialFeature() {
  const t = TESTIMONIAL;
  return html`<div class="quotes quotes--feature">
    <figure class="quote quote--accent quote--lead">
      <span class="q-mark" aria-hidden="true">“</span>
      <blockquote>${t.quote}</blockquote>
      <figcaption class="q-meta"><img class="q-logo" src="${CLIENTS[0].logo}" alt="" loading="lazy"><div>${t.name}<span>${t.role}, ${t.company} (${t.country})</span></div></figcaption>
    </figure>
    ${[1, 2].map(() => html`<figure class="quote">
      <span class="q-flag">Awaiting testimonial</span>
      <blockquote>Client quote, up to three lines, from the testimonial list PTN provides.</blockquote>
      <figcaption class="q-meta"><span class="q-av" aria-hidden="true"></span><div>Client name<span>Role, Company</span></div></figcaption>
    </figure>`)}
  </div>`;
}

/** Numbered process. Sequence carries meaning, so numbers stay. */
export const steps = (items, { dark = false, layout = 'row' } = {}) =>
  html`<ol class="steps steps--${layout}${dark ? ' steps--dark' : ''}">${items.map((s, i) => html`<li>
    <span class="step-n">${String(i + 1).padStart(2, '0')}</span>
    <h3 class="h4">${txt(s.name)}</h3>
    ${s.text ? html`<p>${txt(s.text)}</p>` : ''}
  </li>`)}</ol>`;

export const faq = (items) =>
  html`<div class="faq">${items.map((f, i) => html`<details${i === 0 ? raw(' open') : ''}>
    <summary><span>${txt(f.q)}</span>${icon('plus')}</summary><div class="faq-a"><p>${txt(f.a)}</p></div>
  </details>`)}</div>`;

export const caseCard = (i, { to = href('case-study', { slug: 'sample' }), item } = {}) =>
  html`<article class="case">
    ${item?.photo ? html`<figure class="case-photo">${photo(item.photo, { w: 900, h: 675 })}</figure>` : stock(`case-${i}`, 'Stock image standing in for a case study cover', { ratio: '4/3', label: 'Case study cover' })}
    <div class="case-body">
      <p class="case-tag">${item?.tag || 'Industry · Service'}</p>
      <h3 class="h4">${item?.title || 'Case study title awaiting'}</h3>
      <p>${item?.text || 'Client story, challenge and measurable result will come from the case study list.'}</p>
      ${item?.flag ? html`<span class="sample-flag">${item.flag}</span>` : ''}
      <a class="rlink" href="${to}">Explore more${icon('arrow-right')}</a>
    </div>
  </article>`;

export const rail = (cards, label = 'Carousel') =>
  html`<div class="rail" data-rail>
    <div class="rail-track" tabindex="0" role="region" aria-label="${label}">${cards}</div>
    <div class="rail-ctl"><button type="button" data-rail-prev aria-label="Previous">${icon('arrow-left')}</button><button type="button" data-rail-next aria-label="Next">${icon('arrow-right')}</button></div>
  </div>`;

export const newsCard = (i, kind = 'Blog', to = href('blog'), title) => {
  const topic = title || TOPICS.filter((t) => t[0] === kind)[i % Math.max(1, TOPICS.filter((t) => t[0] === kind).length)]?.[1] || TOPICS[i % TOPICS.length][1];
  return html`<article class="news">
    ${stock(`${kind}-${i}`, `Stock image for ${kind.toLowerCase()} post`, { ratio: '16/10', label: `${kind} cover` })}
    <p class="news-meta"><span>${kind}</span><em>Suggested topic</em></p>
    <h3 class="h4"><a href="${to}">${topic}</a></h3>
  </article>`;
};

export function ctaFinale({ pin, row }) {
  const c = row?.parsed || {};
  return section({ cls: 's--finale', pin, row, id: 'contact-cta', label: 'Contact' }, html`
    <div class="finale">
      <div class="finale-bg finale-bg--drift">${driftCanvas()}</div>
      <div class="finale-panel">
        <h2 class="display display--2">${splitTitle(c.title || 'Big projects always start through a simple conversation.', 'a simple conversation.')}</h2>
        ${c.subtitle ? html`<p class="lead">${txt(c.subtitle)}</p>` : ''}
        <dl class="finale-contact">
          <div><dt>Phone</dt><dd><a href="${CONTACT.phoneHref}">${CONTACT.phone}</a></dd></div>
          <div><dt>Email</dt><dd><a href="mailto:${CONTACT.email}">${CONTACT.email}</a></dd></div>
        </dl>
        <div class="s-actions s-actions--center">${btn('Contact Us', { to: href('contact'), kind: 'accent', arrow: true })}</div>
      </div>
    </div>`);
}

/* ---------- dialogs ---------- */

export const dialogs = () => html`
<dialog class="dlg" id="dlg-team" aria-labelledby="dlg-team-t">
  <form method="dialog" class="dlg-in" data-team-form novalidate>
    <header class="dlg-head"><h2 class="h3" id="dlg-team-t">Build your team</h2><button class="icon-btn" value="cancel" aria-label="Close">${icon('x')}</button></header>
    <p class="dlg-lead">Tell us the roles you need. We reply with a team proposal and indicative pricing.</p>
    <fieldset class="field"><legend>Roles</legend>
      <div class="pills">${['Full Stack Developer', 'Mobile App Developer', 'DevOps Engineer', 'Software Tester', 'UI/UX Designer', 'Business Analyst', 'Project Manager', 'Data Analyst'].map((r) => html`<label class="pill"><input type="checkbox" name="roles" value="${r}"><span>${r}</span></label>`)}</div>
    </fieldset>
    <div class="field-row">
      <label class="field"><span>Team size</span><select name="size"><option>1-2</option><option selected>3-5</option><option>6-10</option><option>10+</option></select></label>
      <label class="field"><span>Engagement model</span><select name="model"><option>Dedicated Team</option><option>Staff Augmentation</option><option>Time &amp; Material</option><option>Fixed Price</option><option>Offshore Development Center</option></select></label>
    </div>
    <label class="field"><span>Work email</span><input name="email" type="email" autocomplete="email" required><small class="err" hidden></small></label>
    <footer class="dlg-foot"><button class="btn btn--line" value="cancel">Cancel</button><button class="btn btn--accent" value="send" data-team-submit><span>Send request</span>${icon('arrow-right')}</button></footer>
    <p class="dlg-done" hidden role="status">${icon('check-circle')} Request captured. In the live site this goes to ${CONTACT.email}.</p>
  </form>
</dialog>
<dialog class="dlg dlg--video" id="dlg-video" aria-label="Video player">
  <div class="dlg-in">
    <header class="dlg-head"><h2 class="h3" data-video-title>PTN Global video</h2><form method="dialog"><button class="icon-btn" aria-label="Close">${icon('x')}</button></form></header>
    ${awaitPh('Company video file', 'Request open: "Please provide us with the videos you would like to show to users."', { ratio: '16/9' })}
  </div>
</dialog>`;
