// Template compositions. Each page reads its copy from docs.json; the section order follows the Confluence layout doc.
import { officeMap } from './officemap.js';
import { driftCanvas } from './drift.js';
import { html, raw, txt, icon } from './dom.js';
import { href } from './router.js';
import { engagementExplorer } from './engagement.js';
import { globePanel } from './globe.js';
import { flowArt } from './flow.js';
import { art } from './art.js';
import { serviceIllustration } from './illustrations.js';
import { photo, monogram, CLIENTS, JOBS, PERKS, PRINCIPLES, OFFICES, osm, TOPICS, WHITEPAPERS, NEWSLETTERS, EXTRA_TECH, TESTIMONIAL, sourceTag, techTile, splitTech } from './assets.js';
import {
  section, head, note, btn, buildTeamBtn, artPh, awaitPh, heroSplit, heroPanel, heroTitle, indexList, stickySplit,
  ruledGrid, techTabs, steps, faq, caseCard, rail, newsCard, ctaFinale, CATEGORY_ICON, CONTACT, slugCat, splitTitle, eyebrow, certWall, clientStrip, testimonialFeature,
} from './sections.js';

/* ---------- helpers ---------- */

function ctx(docs, key) {
  const rows = docs.pages[key]?.sections || [];
  let n = 0;
  return {
    get: (re) => rows.find((r) => re.test(r.section)) || { section: String(re), purpose: '', content: '', parsed: { items: [] } },
    pin: () => ++n,
    rows,
  };
}

/** Pull ordered named items out of a raw content cell: text between each known name and the next. */
export function pick(rawText, names) {
  const s = String(rawText || '');
  const pos = [];
  let from = 0;
  for (const name of names) {
    const i = s.indexOf(name, from);
    pos.push(i);
    if (i >= 0) from = i + name.length;
  }
  return names.map((name, k) => {
    if (pos[k] < 0) return { name, text: '' };
    const start = pos[k] + name.length;
    const next = pos.slice(k + 1).find((p) => p >= 0);
    let t = s.slice(start, next ?? s.length);
    t = t.replace(/(?:Additional behavior|Behavior)\s*:.*$/is, '').replace(/-?\s*(?:Section|Step)\s*\d+\s*:\s*$/i, '').replace(/^\s*[:\-–]\s*/, '').replace(/\s*-\s*$/, '');
    return { name, text: txt(t) };
  });
}

const sentenceSpace = (s) => String(s).replace(/([a-z])\.([A-Z][a-z])/g, '$1. $2');
const firstClause = (s) => { const i = s.indexOf(' - '); return i < 0 ? [s, ''] : [s.slice(0, i), s.slice(i + 3)]; };

const INDUSTRY_ICON = {
  'Finance & Business': 'bank', 'Healthcare & Life Sciences': 'heartbeat', 'Retail, Commerce & Consumer': 'storefront',
  'Travel, Transport & Logistics': 'airplane-tilt', 'Education & Knowledge': 'graduation-cap', 'Public Sector': 'buildings',
  'Telecommunications & Technology': 'broadcast', 'Professional Services': 'briefcase',
};

const techCats = (docs) => ctx(docs, 'home').get(/tech stack/i).parsed.items;

function servicesIndex(docs) {
  const home = ctx(docs, 'home').get(/services section/i);
  const descs = pick(home.content, docs.structure.services.map((g) => g.category));
  return indexList(docs.structure.services.map((g, i) => ({
    title: g.category, text: descs[i].text, icon: CATEGORY_ICON[g.category], meta: `${g.items.length} services`,
    to: href('services', { cat: slugCat(g.category) }),
  })));
}

function industriesAccordion(rows) {
  return html`<div class="faq faq--ind">${rows.map((it, i) => {
    const [tag, body] = firstClause(it.text);
    return html`<details${i === 0 ? raw(' open') : ''}><summary><span>${icon(INDUSTRY_ICON[it.name] || 'circle')} ${it.name}</span>${icon('plus')}</summary>
      <div class="faq-a"><p><strong>${txt(tag)}</strong></p><p>${txt(body)}</p></div></details>`;
  })}</div>`;
}

const MBA_CASE = {
  tag: 'Australia · Team extension', title: 'An integral part of Member Benefits Australia’s IT delivery',
  text: 'Wide-ranging skills that helped the client meet tight timelines, in the words of their CTO.', flag: 'From a public testimonial; full case awaiting',
};

/* ---------- Home ---------- */

/** Services as alternating feature rows (TestSprite "Why" pattern): copy + sub-service checklist beside an artwork cell. */
function serviceRows(docs) {
  const home = ctx(docs, 'home').get(/services section/i);
  const descs = pick(home.content, docs.structure.services.map((g) => g.category));
  return html`<div class="feature-rows">${docs.structure.services.map((g, i) => html`<article class="feature-row${i % 2 ? ' is-flip' : ''}">
    <div class="feature-copy">
      <span class="feature-ic">${icon(CATEGORY_ICON[g.category])}</span>
      <h3 class="h3">${g.category}</h3>
      <p>${txt(descs[i].text)}</p>
      <ul class="checks">${g.items.slice(0, 3).map((it) => html`<li>${icon('check')}${it.name}</li>`)}</ul>
      <a class="feature-link" href="${href('services', { cat: slugCat(g.category) })}">Explore ${g.items.length} services ${icon('arrow-right')}</a>
    </div>
    <div class="feature-media">${serviceIllustration(i, `${g.category} illustration`)}</div>
  </article>`)}</div>`;
}

/** Client stories as accent cards on a rail (TestSprite "Customer stories" pattern). */
function storyRail() {
  const t = TESTIMONIAL;
  const card = (q, name, role, logo, awaiting) => html`<figure class="story-card${awaiting ? ' is-await' : ''}">
    ${logo ? html`<img class="story-logo" src="${logo}" alt="" loading="lazy">` : html`<span class="story-logo story-logo--ph">Client logo</span>`}
    <blockquote>${q}</blockquote>
    <figcaption><span class="story-av" aria-hidden="true">${name[0]}</span><span><b>${name}</b>${role}</span></figcaption>
    ${awaiting ? html`<span class="story-flag">Awaiting testimonial</span>` : ''}
  </figure>`;
  return rail([
    card(t.quote, t.name, `${t.role}, ${t.company}`, CLIENTS[0].logo, false),
    ...[1, 2, 3].map(() => card('Client quote, up to three lines, from the testimonial list PTN provides.', 'Client name', 'Role, Company', null, true)),
  ], 'Client stories');
}

function home(docs) {
  const c = ctx(docs, 'home');
  const hero = c.get(/hero/i), svc = c.get(/services section/i), why = c.get(/why you should/i), who = c.get(/who we are/i);
  const awards = c.get(/awards/i), tech = c.get(/tech stack/i), cases = c.get(/case studies/i), testi = c.get(/testimonial/i);
  const news = c.get(/latest news/i), cta = c.get(/^cta$/i);
  const whyItems = pick(why.content, ['Long-term partnership', 'Trusted by big corporations', 'Ensured quality & Fast delivery']);

  return html`
  ${heroSplit({
    pin: c.pin(), row: hero, eyebrow: 'Software development · Vietnam', title: hero.parsed.title, accent: 'with PTN', lead: hero.parsed.subtitle,
    actions: html`${buildTeamBtn('accent')}${btn('Contact Us', { to: href('contact'), kind: 'line', arrow: true })}`,
    media: globePanel(),
    backdrop: flowArt(),
  })}

  ${section({ cls: 's--clients', label: 'Clients' }, clientStrip())}

  ${section({ pin: c.pin(), row: why, grid: true }, html`
    ${head({ eyebrow: 'Why PTN', title: 'Why You Should Choose PTN', accent: 'Choose PTN', lead: 'Three reasons clients stay with us from the first sprint to the tenth release.' })}
    <div class="reasons">${whyItems.map((it, i) => html`<article class="reason">
      <span class="reason-ic">${icon(['handshake', 'buildings', 'rocket-launch'][i])}</span>
      <h3 class="h4">${txt(it.name)}</h3>
      <p>${txt(it.text)}</p>
    </article>`)}</div>
    <div class="s-actions">${btn('See more about us', { to: href('company'), kind: 'line', arrow: true })}</div>`)}

  ${section({ pin: c.pin(), row: who, dark: true, grid: true, id: 'who', extra: 'The closing paragraph links to the About us page.' }, html`
    ${driftCanvas()}
    ${head({ eyebrow: 'Who we are', title: 'A leading software company in Vietnam.', accent: 'in Vietnam.', wide: true })}
    <dl class="numbers">
      <div><dt>50+</dt><dd>Clients served across Australia, New Zealand and beyond</dd></div>
      <div><dt>3+</dt><dd>Offices across Australia, New Zealand and Vietnam</dd></div>
      <div><dt>27001</dt><dd>ISO/IEC 27001:2022 certified information security</dd></div>
    </dl>
    <blockquote class="statement">
      <p><b>We deliver quality technology services</b> in the most efficient way, at a price that will allow you to deliver more. <a href="${href('company')}">All of our integrated services aim to support the strategy of our customers</a> by developing the best, most sustainable and most innovative solutions.</p>
    </blockquote>`)}

  ${section({ pin: c.pin(), row: svc, id: 'services' }, html`
    ${head({ eyebrow: 'What we do', title: svc.parsed.title, accent: 'Service Experience', align: 'center' })}
    ${serviceRows(docs)}`)}

  ${section({ pin: c.pin(), row: tech, id: 'tech' }, html`
    ${head({ eyebrow: 'Technology', title: tech.parsed.title, accent: 'tech stack', lead: tech.parsed.subtitle })}
    ${techTabs([...tech.parsed.items, EXTRA_TECH].slice(0, 6), 'home-tech')}
    <div class="s-more">${btn('View all technologies', { to: href('technologies'), kind: 'line', arrow: true })}</div>`)}

  ${section({ pin: c.pin(), row: awards, id: 'awards' }, html`
    ${head({ eyebrow: 'Standards', title: 'Awards and Certificates', accent: 'Certificates', lead: 'Independently audited standards behind every PTN engagement, plus the recognition we have earned.' })}
    ${certWall()}`)}

  ${section({ pin: c.pin(), row: cases, dark: true, id: 'cases' }, html`
    ${head({ eyebrow: 'Case studies', title: 'Stories of long‑term partnership', accent: 'long‑term partnership', lead: cases.parsed.subtitle })}
    ${rail([0, 1, 2, 3, 4].map((i) => caseCard(i, { item: i === 0 ? MBA_CASE : null })), 'Latest case studies')}`)}

  ${section({ pin: c.pin(), row: testi, dark: true, id: 'stories' }, html`
    ${head({ eyebrow: 'Client stories', title: testi.parsed.title, accent: 'Proven by Results.', lead: testi.parsed.subtitle })}
    ${storyRail()}`)}

  ${section({ pin: c.pin(), row: news }, html`
    ${head({ eyebrow: 'Insights', title: news.parsed.title, accent: 'from PTN', actions: btn('All insights', { to: href('insights'), kind: 'line', arrow: true }) })}
    <div class="cards-3">${[0, 1, 2].map((i) => newsCard(i, ['Blog', 'News', 'Events'][i]))}</div>`)}

  ${ctaFinale({ pin: c.pin(), row: cta })}`;
}

function awardsWall() {
  return html`<div class="wall">
    <div class="cert"><span class="cert-seal">ISO<br>9001:2015</span><b>Quality Management System</b><span>Consistent, reliable delivery aligned with international standards.</span></div>
    <div class="cert"><span class="cert-seal">ISO<br>27001:2013</span><b>Information Security</b><span>Confidentiality, integrity and availability of client data.</span></div>
    ${awaitPh('Award 1', 'Request open: "Please provide the awards and certificates that the company holds."')}
    ${awaitPh('Award 2', 'Logo, issuer and year for each award.')}
  </div>`;
}

function testimonials() {
  return html`<div class="quotes">
    ${[0, 1, 2].map((i) => html`<figure class="quote${i === 1 ? ' quote--accent' : ''}">
      <span class="q-flag">Awaiting testimonial</span>
      <blockquote>Client quote, up to three lines, taken from the testimonial list PTN provides.</blockquote>
      <figcaption class="q-meta"><span class="q-av" aria-hidden="true"></span><div>Client name<span>Role, Company</span></div></figcaption>
    </figure>`)}
  </div>`;
}

/* ---------- Company ---------- */

function company(docs) {
  const c = ctx(docs, 'company');
  const hero = c.get(/hero/i), story = c.get(/story/i), vision = c.get(/objective/i), belief = c.get(/belief/i), core = c.get(/core value/i);
  const awards = c.get(/awards/i), meth = c.get(/methodolog/i), lead = c.get(/leadership/i), culture = c.get(/cultural/i);
  const people = c.get(/our people/i), process = c.get(/our process/i), cta = c.get(/cta/i);

  const storyText = sentenceSpace(story.parsed.items[0]?.text || '').replace(/^Our Story\s*/, '');
  const paras = storyText.replace(/^Global was founded/, 'PTN Global was founded').split(/(?<=\.)\s*(?=Tam has always|PTN Global’s Main Office)/);
  const facts = (story.parsed.items[1]?.text || story.parsed.items[1]?.name || '').split(/\s-\s/).map((f) => {
    const m = f.trim().match(/^([\d+%]+)\s*(.*)$/);
    return m ? { n: m[1], l: m[2] } : null;
  }).filter(Boolean);

  const beliefs = pick(belief.content, ['Affordable Price Expensive Quality', 'Business is Built on Trust', 'What You See is What You Get', 'Let Our Work Speak for Us', 'Empathy Drives Excellence', 'Honesty & Transparency Always Win']);
  const values = pick(core.content, ['Honesty', 'Transparency', 'Trust & Mutual Respect', 'Teamwork', 'Listen & Learn']);
  const methods = pick(meth.content, ['Agile: Flexibility for Rapid Innovation', 'Scrum: Structured, High-Quality Delivery', 'Kanban: Transparent, Efficient Workflows', 'DevOps: Continuous Integration & Deployment', 'Lean: Efficiency and Maximum Value', 'SAFe: Scaling Agile Across Teams', 'XP: Technical Excellence & Speed']);
  const leaders = lead.content.split(/Section\s*\d+\s*:/).slice(1).map((s) => s.replace(/\s-\s*$/, '').trim()).map((s) => { const [n, r] = firstClause(s); return { name: n.trim(), role: r.trim() }; });
  const cultures = pick(culture.content, ['Business Philosophy: Customer-Centric', 'People-Centric Culture', 'Why H.3T.L Defines PTN']);
  const procSteps = pick(process.content, ['Contact with Us', 'Explore Solutions and Team Setup', 'Kick Off and Monitor the Project']);
  if (procSteps[1].text.trim() === 'Explore Solutions and Team Setup' || !procSteps[1].text) procSteps[1].text = 'Step description awaiting (the doc repeats the step title).';

  return html`
  ${heroSplit({
    pin: c.pin(), row: hero, eyebrow: 'About PTN Global', title: hero.parsed.title, accent: 'in Vietnam', lead: 'Offshore engineering from Vietnam, led from Melbourne.',
    actions: html`${btn('Build Your Team', { to: href('contact'), kind: 'accent', arrow: true })}${btn('Talk to an engineer', { to: href('contact'), kind: 'line' })}`,
    badge: officeMap(),
  })}

  ${section({ pin: c.pin(), row: story, id: 'story', extra: 'Doc says 150+ employees; itviec lists 51-150. Please confirm.' }, html`<div class="story">
    <div class="story-head">
      ${eyebrow('Our story')}
      <h2 class="display display--2">${splitTitle('Founded in Melbourne, built in Vietnam.', 'built in Vietnam.')}</h2>
    </div>
    <div class="story-portrait">
      ${monogram('Tam Phan')}
      <p class="fine">Tam Phan, founder and CEO. Portrait to be supplied.</p>
    </div>
    <div class="story-body">
      ${paras.map((p) => html`<p>${txt(p)}</p>`)}
      <dl class="facts">${facts.map((f) => html`<div><dt>${f.n}</dt><dd>${f.l}</dd></div>`)}</dl>
    </div>
  </div>`)}

  ${section({ pin: c.pin(), row: vision, dark: true }, html`
    ${head({ title: vision.parsed.title, accent: 'Vision', lead: (vision.content.match(/Subtitle:\s*(.*?)\s*Content/) || [])[1] || vision.parsed.subtitle })}
    <div class="duo">
      <article><p class="eyebrow">Objective</p><p class="display display--2">To provide quality software development at a competitive price and value-added software solutions to clients globally.</p></article>
      <article><p class="eyebrow">Vision</p><p class="display display--2">To become the number-one preferred &amp; trusted IT service company <span class="accent">worldwide!</span></p></article>
    </div>`)}

  ${section({ pin: c.pin(), row: belief }, html`
    ${head({ title: belief.parsed.title, accent: 'When Working' })}
    ${ruledGrid(beliefs, { cols: 3, iconFor: (_, i) => ['coins', 'handshake', 'eye', 'megaphone-simple', 'heart', 'scales'][i] })}`)}

  ${section({ pin: c.pin(), row: core }, html`
    ${head({ eyebrow: 'H.3T.L', title: core.parsed.title, accent: 'unite us', lead: core.parsed.subtitle })}
    <ol class="values">${values.map((v) => html`<li class="value"><span class="value-letter" aria-hidden="true">${v.name[0]}</span><h3 class="h4">${v.name}</h3><p>${v.text}</p></li>`)}</ol>`)}

  ${section({ pin: c.pin(), row: awards, id: 'awards' }, html`
    ${head({ title: 'Awards and Certificates', accent: 'Certificates' })}
    ${certWall()}`)}

  ${section({ pin: c.pin(), row: meth, id: 'methodologies' }, html`<div class="faq-wrap">
    <div class="sticky-left">${head({ title: meth.parsed.title, accent: 'technical success', lead: txt(meth.parsed.subtitle).replace('PTN GLobal', 'PTN Global') })}</div>
    ${faq(methods.map((m) => ({ q: m.name, a: m.text })))}
  </div>`)}

  ${section({ pin: c.pin(), row: lead, id: 'leadership' }, html`
    ${head({ eyebrow: 'Leadership', title: lead.parsed.title, accent: 'Leadership Team', lead: lead.parsed.subtitle })}
    <div class="people">${leaders.slice(0, 6).map((p) => html`<article class="person">${monogram(p.name)}<div><h3 class="h4">${p.name}</h3><p>${p.role}</p></div></article>`)}</div>`)}

  ${section({ pin: c.pin(), row: culture, dark: true }, html`
    ${head({ title: culture.parsed.title, accent: 'Cultural Diversity', lead: culture.parsed.subtitle })}
    ${ruledGrid(cultures.map((x) => ({ name: x.name, text: x.text })), { cols: 3, iconFor: (_, i) => ['users-three', 'user-circle-plus', 'compass'][i] })}`)}

  ${section({ pin: c.pin(), row: people, id: 'people', extra: 'Show all PTN photos. The NZ address is still requested.' }, html`
    ${head({ title: people.parsed.title, accent: 'Dedicated Team', lead: 'In Australia, New Zealand, and Vietnam. Dedicated to doing their life’s work.' })}
    ${offices()}
    <div class="photo-strip" style="margin-top:40px" tabindex="0" role="region" aria-label="Team photos">
      ${['teamLunch', 'duoMedals', 'squad', 'duoWomen', 'duoShirts'].map((k) => html`<figure class="strip-photo">${photo(k, { w: 900, h: 675 })}</figure>`)}
    </div>`)}

  ${section({ pin: c.pin(), row: process }, html`
    ${head({ title: process.parsed.title, accent: 'into Platform', lead: process.parsed.subtitle })}
    ${steps(procSteps, { layout: 'col' })}`)}

  ${ctaFinale({ pin: c.pin(), row: cta })}`;
}

function offices() {
  return html`<div class="offices offices--4">${OFFICES.map((o) => html`<article class="office">
    ${o.map ? html`<iframe class="office-map" title="Map: ${o.city}" src="${osm(o.map)}" loading="lazy"></iframe>` : awaitPh(o.city, o.note, { ratio: '16/10' })}
    <h3 class="h4">${icon('map-pin')}${o.city}</h3><p>${o.addr}</p><p class="fine">${o.role}</p>
    ${o.map && o.note ? html`<p class="office-note">${icon('warning-circle')}${o.note}</p>` : ''}
  </article>`)}</div>`;
}

/* ---------- Services overview ---------- */

function services(docs, params) {
  const c = ctx(docs, 'services');
  const hero = c.get(/hero/i), list = c.get(/service list/i), eng = c.get(/engagement/i), banner = c.get(/banner/i), roles = c.get(/roles we offer/i);
  const collab = c.get(/collaborate/i), quality = c.get(/quality/i), tech = c.get(/tech stack/i), ind = c.get(/industry/i), cta = c.get(/^cta$/i);
  const S = docs.structure;
  const active = params.cat || 'all';
  const startSteps = pick(ctx(docs, 'company').get(/our process/i).content, ['Contact with Us', 'Explore Solutions and Team Setup', 'Kick Off and Monitor the Project']);
  if (!startSteps[1].text || startSteps[1].text === 'Explore Solutions and Team Setup') startSteps[1].text = 'We propose the model and the team; you meet the engineers.';
  const collabSteps = pick(collab.content, ['Discovery & Requirement Gathering', 'UX/UI Design', 'Architecture & Planning', 'Frontend & Backend Development', 'QA & Testing', 'Deployment & Monitoring']);
  const q = pick(quality.content, ['Quality Management System', 'Information security management systems']);
  const bullets = (t) => t.split(/\s-\s|(?<=:)(?=[A-Z])/).map((x) => x.trim()).filter(Boolean);
  const roleIcons = ['stack', 'browser', 'device-mobile', 'cpu', 'infinity', 'bug', 'pen-nib', 'chart-line', 'kanban', 'crown-simple', 'chart-bar', 'users'];

  return html`
  ${heroSplit({
    pin: c.pin(), row: hero, eyebrow: 'Services', title: hero.parsed.title, accent: 'services', lead: 'Cross-domain engineers who take you from the product idea, through market entrance, to full scale.',
    actions: html`${btn('Build Your Team', { to: href('contact'), kind: 'accent', arrow: true })}${btn('Explore engagement models', { to: '#/services?at=engagement', kind: 'line' })}`,
    badge: html`${icon('squares-four')}<div><small>Catalogue</small><b>22 services · 5 categories</b></div>`,
  })}

  ${section({ pin: c.pin(), row: list, id: 'list', extra: 'Filter by category. Each service opens its detail page.' }, html`
    ${head({ title: list.parsed.title, accent: 'Service Experience', lead: hero.parsed.subtitle })}
    <div class="toolbar"><div class="seg" role="group" aria-label="Filter services by category" data-filter="svc">
      <button type="button" data-value="all" aria-pressed="${String(active === 'all')}">All</button>
      ${S.services.map((g) => html`<button type="button" data-value="${slugCat(g.category)}" aria-pressed="${String(active === slugCat(g.category))}">${g.category}</button>`)}
    </div></div>
    <ul class="rgrid rgrid--4" data-filter-target="svc">
      ${S.services.flatMap((g) => g.items.map((s) => html`<li class="rcell" data-cat="${slugCat(g.category)}"${active !== 'all' && active !== slugCat(g.category) ? raw(' hidden') : ''}>
        <span class="ric">${icon(CATEGORY_ICON[g.category])}</span>
        <p class="case-tag">${g.category}</p>
        <h3 class="h4">${s.name}</h3>
        <p>${txt(s.desc)}</p>
        <a class="rlink" href="${href('service', { slug: s.slug })}">View service${icon('arrow-right')}</a>
      </li>`))}
    </ul>`)}

  ${section({ pin: c.pin(), row: eng, dark: true, id: 'engagement', extra: 'Team structure (who directs whom, where people sit), then how it runs. Compare side by side (up to 3) or on the map. Structures, facts, flows and ratings are proposed for delivery-team review. Start steps come from Company > Our Process (step 2 description proposed). Doc lists "Time & Material" twice; shown once.' }, html`
    ${head({ eyebrow: 'Engagement models', title: 'Engagement Models', accent: 'Models', lead: 'Nine ways to work with PTN. Pick one to see how the work flows, who owns each step, and how it compares.' })}
    ${engagementExplorer(S.engagement, startSteps)}`)}

  ${section({ pin: c.pin(), row: banner, grid: true }, html`<p class="banner-quote">At PTN, we believe in creating real value through innovation, trust, and unwavering commitment to our customers. Thank you for being a part of our journey.</p>`)}

  ${section({ pin: c.pin(), row: roles, id: 'roles', extra: 'Doc reuses the "Why You Should Choose PTN" title here; proposed title shown.' }, html`
    ${head({ title: 'Roles We Offer', accent: 'We Offer', lead: 'Every role you need to staff a complete product team.' })}
    ${ruledGrid(roles.content.replace(/^.*?Content:\s*-\s*/, '').split(/\s-\s/).map((r) => ({ name: r.trim() })), { cols: 4, iconFor: (_, i) => roleIcons[i] || 'user' })}`)}

  ${section({ pin: c.pin(), row: collab }, html`
    ${head({ title: collab.parsed.title, accent: 'into Reality', lead: collab.parsed.subtitle })}
    ${steps(collabSteps, { layout: 'row' })}`)}

  ${section({ pin: c.pin(), row: quality }, html`
    ${head({ title: quality.parsed.title, accent: 'Commitment', lead: quality.parsed.subtitle })}
    <div class="split-2 quality">${q.map((x, i) => html`<article class="q-card">
      <span class="cert-seal"><b>ISO</b>${i ? '27001:2022' : '9001:2015'}</span>
      <h3 class="h3">${x.name.replace('systems', 'system')}</h3>
      <ul class="ticks">${bullets(x.text).map((b) => html`<li>${icon('check')}<span>${txt(b)}</span></li>`)}</ul>
    </article>`)}</div>`)}

  ${section({ pin: c.pin(), row: tech }, html`
    ${head({ eyebrow: 'Technology', title: tech.parsed.title, accent: 'tech stack', lead: tech.parsed.subtitle })}
    ${techTabs([...tech.parsed.items, EXTRA_TECH].slice(0, 6), 'svc-tech')}
    <div class="s-more">${btn('View all technologies', { to: href('technologies'), kind: 'line', arrow: true })}</div>`)}

  ${section({ pin: c.pin(), row: ind }, html`<div class="faq-wrap">
    <div class="sticky-left">${head({ title: ind.parsed.title, accent: 'work on', lead: ind.parsed.subtitle, actions: btn('All industries', { to: href('industries'), kind: 'line', arrow: true }) })}</div>
    ${industriesAccordion(ind.parsed.items)}
  </div>`)}

  ${ctaFinale({ pin: c.pin(), row: cta })}`;
}

/* ---------- Service detail ---------- */

function service(docs, params) {
  const all = docs.structure.services.flatMap((g) => g.items.map((s) => ({ ...s, category: g.category })));
  const meta = all.find((s) => s.slug === params.slug) || all[0];
  const doc = docs.services[meta.slug];
  const rows = doc?.sections || [];
  let n = 0;
  const get = (re) => rows.find((r) => re.test(r.section)) || { section: String(re).replace(/[/\\^$i]/g, ''), purpose: '', parsed: { items: [] } };
  const pin = () => ++n;
  const hero = get(/hero/i), offer = get(/offer/i), tech = get(/technology/i), ind = get(/industr/i), why = get(/why/i), proc = get(/process/i), cases = get(/case/i), faqRow = get(/faq/i);
  const title = hero.parsed.title || meta.name;
  const words = title.split(' ');
  const switcher = html`<label class="field svc-switch"><span>Switch service</span>
    <select data-nav-select>${docs.structure.services.map((g) => html`<optgroup label="${g.category}">${g.items.map((s) => html`<option value="${href('service', { slug: s.slug })}"${s.slug === meta.slug ? raw(' selected') : ''}>${s.name}${docs.services[s.slug] ? '' : ' (content awaiting)'}</option>`)}</optgroup>`)}</select></label>`;

  return html`
  ${heroSplit({
    pin: pin(), row: hero, eyebrow: meta.category, title, accent: words.slice(-1)[0], lead: hero.parsed.subtitle || meta.desc,
    actions: html`${btn('Build Your Team', { to: href('contact'), kind: 'accent', arrow: true })}${btn('Talk to an engineer', { to: href('contact'), kind: 'line' })}`,
    badge: switcher,
    media: artPh(`Hero image: ${meta.name} work at PTN, same painterly treatment as Home`, { ratio: '21/9', tone: 'deep' }),
  })}
  ${!doc ? section({ label: 'Content status' }, awaitPh(`Content document for ${meta.name}`, 'Only 10 of 22 services have a content doc. This page shows the shared template skeleton.')) : ''}

  ${section({ pin: pin(), row: offer }, html`
    ${head({ title: offer.parsed.title || 'What we offer', accent: 'offer' })}
    ${offer.parsed.items.length ? ruledGrid(offer.parsed.items, { cols: 4, numbered: true }) : awaitPh('Offer list')}`)}

  ${section({ pin: pin(), row: tech }, html`
    ${head({ title: tech.parsed.title || 'Our engineering tech stack', accent: 'tech stack', lead: `The stack we most often use for ${meta.name.toLowerCase()}.` })}
    ${tech.parsed.items.length ? html`<div class="tile-groups">${tech.parsed.items.map((t) => html`<section class="tile-group"><h3 class="h4">${t.name}</h3><ul class="tiles tiles--compact">${splitTech(t.text).map(techTile)}</ul></section>`)}</div>` : awaitPh('Tech stack')}`)}

  ${section({ pin: pin(), row: ind }, html`<div class="faq-wrap">
    <div class="sticky-left">${head({ title: ind.parsed.title || 'Industry that we work on', accent: 'work on', lead: ind.parsed.subtitle })}</div>
    ${ind.parsed.items.length ? industriesAccordion(ind.parsed.items) : awaitPh('Industries')}
  </div>`)}

  ${section({ pin: pin(), row: why }, stickySplit(
    html`<h2 class="display display--2">${splitTitle(why.parsed.title || 'Why You Should Choose PTN', 'Choose PTN')}</h2>${why.parsed.subtitle && !/we have$/.test(why.parsed.subtitle) ? html`<p class="lead">${txt(why.parsed.subtitle)}</p>` : ''}`,
    (why.parsed.items.length ? why.parsed.items : [{ name: 'Awaiting', text: '' }]).map((it, i) => ({ ...it, icon: ['target', 'trend-up', 'shield-check', 'lightning'][i % 4] })),
  ))}

  ${section({ pin: pin(), row: proc }, html`
    ${head({ eyebrow: 'Process', title: proc.parsed.title || 'How we follow to complete your project', accent: 'your project' })}
    ${proc.parsed.items.length ? steps(proc.parsed.items, { layout: 'row' }) : awaitPh('Process steps')}`)}

  ${section({ pin: pin(), row: cases }, html`
    ${head({ title: 'Our Case Studies', accent: 'Case Studies', actions: btn('All case studies', { to: href('case-studies'), kind: 'line', arrow: true }) })}
    <div class="cards-3">${[0, 1, 2].map((i) => caseCard(i))}</div>`)}

  ${section({ pin: pin(), row: faqRow }, html`<div class="faq-wrap">
    <div class="sticky-left">${head({ title: 'Frequently Asked Questions', accent: 'Questions', lead: `About ${meta.name.toLowerCase()} with PTN.`, actions: btn('Ask us directly', { to: href('contact'), kind: 'line', arrow: true }) })}</div>
    ${faqRow.parsed.faq?.length ? faq(faqRow.parsed.faq) : awaitPh('FAQ list')}
  </div>`)}

  ${ctaFinale({ pin: pin(), row: { section: 'CTA', purpose: 'Shared closing CTA (not in the service doc; kept for consistency).', parsed: {} } })}`;
}

/* ---------- Expertise ---------- */

function industries(docs) {
  const c = ctx(docs, 'industries');
  const hero = c.get(/hero/i), list = c.get(/industries list/i), ben = c.get(/benefit/i), svc = c.get(/service list/i), cta = c.get(/cta/i);
  const benefits = pick(ben.content, ['Optimize Your Product Delivery Terms', 'Approach a More Practical Technical Solution', 'Obtain More Value for Your Business', 'Build a Trusted Long-Term Partnership']);
  return html`
  ${heroTitle({ pin: c.pin(), row: hero, eyebrow: 'Expertise', title: hero.parsed.title, accent: 'Industries', lead: hero.parsed.subtitle, actions: html`${btn('Build Your Team', { to: href('contact'), kind: 'accent', arrow: true })}${btn('Talk to an engineer', { to: href('contact'), kind: 'line' })}` })}

  ${section({ pin: c.pin(), row: list, extra: 'Investment & Wealth Management carries desktop-app copy in the layout doc; the Website Structure description is used instead.' }, html`
    ${head({ title: list.parsed.title, accent: 'work on' })}
    <div class="ind-rows">${docs.structure.industries.map((g) => html`<section class="ind-row">
      <header class="ind-row-head"><span class="ric">${icon(INDUSTRY_ICON[g.category] || 'circle')}</span><h3 class="ind-row-name">${g.category}</h3></header>
      <ul class="ind-tiles">${g.items.map((it) => html`<li class="ind-tile"><b>${it.name}</b><span>${txt(it.desc)}</span></li>`)}</ul>
    </section>`)}</div>`)}

  ${section({ pin: c.pin(), row: ben, dark: true }, html`
    ${head({ title: 'Benefits of working with us', accent: 'with us', lead: ben.parsed.subtitle || 'At PTN, we combine industry expertise, agile teams, and practical solutions to help you scale faster and achieve measurable results.' })}
    ${ruledGrid(benefits, { cols: 2, numbered: true })}`)}

  ${section({ pin: c.pin(), row: svc }, html`
    ${head({ title: 'We Build Best Service Experience', accent: 'Service Experience' })}
    ${servicesIndex(docs)}`)}

  ${ctaFinale({ pin: c.pin(), row: cta })}`;
}

function technologies(docs) {
  const c = ctx(docs, 'technologies');
  const hero = c.get(/hero/i), stack = c.get(/tech stack/i);
  const cats = [...techCats(docs), EXTRA_TECH];
  return html`
  ${heroTitle({ pin: c.pin(), row: hero, eyebrow: 'Expertise', title: hero.parsed.title, accent: 'Tech Stack', lead: hero.parsed.subtitle, aside: html`<dl class="facts"><div><dt>${cats.length}</dt><dd>Categories</dd></div><div><dt>${cats.reduce((a, t) => a + t.text.split(/\s*\/\s*/).length, 0)}</dt><dd>Tools and platforms</dd></div></dl>` })}
  ${section({ pin: c.pin(), row: stack, extra: 'Request open: please check the information in the tech stack list.' }, html`
    ${techTabs(cats, 'tech-page')}`)}`;
}

function caseStudies(docs) {
  const c = ctx(docs, 'case-studies');
  const hero = c.get(/hero/i), list = c.get(/our case/i);
  return html`
  ${heroTitle({ pin: c.pin(), row: hero, eyebrow: 'Expertise', title: hero.parsed.title, accent: 'Case Studies', lead: hero.parsed.subtitle })}
  ${section({ pin: c.pin(), row: list }, html`
    <div class="toolbar"><div class="seg" role="group" aria-label="Filter case studies">
      <button type="button" aria-pressed="true">All</button>${docs.structure.services.map((g) => html`<button type="button" aria-pressed="false">${g.category}</button>`)}
    </div></div>
    <div class="cards-3">${[0, 1, 2, 3, 4].map((i) => caseCard(i, { item: i === 0 ? MBA_CASE : null }))}${awaitPh('More case studies', 'Case study list requested from PTN.', { cls: 'case-more' })}</div>`)}
  ${ctaFinale({ pin: c.pin(), row: { section: 'CTA', purpose: 'Shared closing CTA.', parsed: {} } })}`;
}

function caseStudy() {
  let n = 0;
  const r = (section, purpose) => ({ section, purpose, parsed: {} });
  return html`
  ${heroTitle({ pin: ++n, row: r('Hero', 'Case study title and client context. Layout from "Case Studies details.jpg".'), eyebrow: 'Case study', title: 'Case study title awaiting', accent: 'awaiting', lead: 'One-sentence summary of the outcome for the client.', aside: html`<dl class="jd-meta">${[['Client', 'Awaiting'], ['Industry', 'Awaiting'], ['Services', 'Awaiting'], ['Duration', 'Awaiting']].map(([k, v]) => html`<div><dt>${k}</dt><dd>${v}</dd></div>`)}</dl>` })}
  ${section({ pin: ++n, row: r('Cover', 'Hero visual of the delivered product.') }, artPh('Case study cover: delivered product in context', { ratio: '21/9', tone: 'deep' }))}
  ${section({ pin: ++n, row: r('Challenge · Solution · Results', 'Narrative in three beats.') }, ruledGrid([
    { name: 'The challenge', text: 'What the client needed to solve, in their words.' },
    { name: 'Our solution', text: 'The team PTN assembled, the approach and the architecture.' },
    { name: 'The results', text: 'Measured outcomes supplied by the client. No invented metrics.' },
  ], { cols: 3, numbered: true }))}
  ${section({ pin: ++n, row: r('Tech used', 'Technologies for this project.') }, html`${head({ title: 'Technology used', accent: 'used' })}${awaitPh('Project tech list')}`)}
  ${section({ pin: ++n, row: r('Related', 'Three more case studies.') }, html`${head({ title: 'More case studies', accent: 'case studies' })}<div class="cards-3">${[1, 2, 3].map((i) => caseCard(i))}</div>`)}
  ${ctaFinale({ pin: ++n, row: r('CTA', 'Shared closing CTA.') })}`;
}

/* ---------- Careers ---------- */

const JOB_TYPES = ['Back End Developers', 'Front End Developers', 'DevOps', 'Tester', 'Business Analyst', 'UX UI Designer', 'Full Stack Developers', 'Data Analyst', 'Other'];
const LEVELS = ['Senior', 'Middle', 'Junior', 'Fresher', 'OJT', 'Intern'];

function careers(docs, params) {
  const c = ctx(docs, 'careers');
  const hero = c.get(/hero/i), vibes = c.get(/vibes/i), open = c.get(/choose your next career opportunity$/i), ben = c.get(/benefit/i);
  const proc = c.get(/our process/i), intern = c.get(/intern/i), life = c.get(/life/i), banner = c.get(/cta banner/i);
  const benefits = pick(ben.content, ['Career Growth & Development', 'Challenging & Meaningful Projects', 'Supportive Work Environment', 'Recognition & Advancement', 'Work-Life Balance', 'Competitive Compensation & Benefits']);
  const hiring = pick(proc.content, ['Application Review', 'Intro Call', 'Initial Interview', 'Assessment', 'Final Interview', 'Offer']);
  const level = params.level || '';

  return html`
  ${heroSplit({
    pin: c.pin(), row: hero, eyebrow: 'Careers', title: hero.parsed.title, accent: 'an industry.', lead: hero.parsed.subtitle,
    actions: html`${btn('Browse jobs', { to: '#/careers?at=openings', kind: 'accent', arrow: true })}${btn('Internships', { to: '#/careers?at=internships', kind: 'line' })}`,
    badge: html`${icon('briefcase')}<div><small>On the job board</small><b>${JOBS.length} open roles in Can Tho</b></div>`,
    media: photo('teamLunch', { w: 2100, h: 900, eager: true, pos: 'center 45%' }),
  })}

  ${section({ pin: c.pin(), row: vibes, id: 'vibes' }, html`<div class="split-2 vibes">
    <div>${head({ title: 'End-to-end good vibes', accent: 'good vibes', lead: vibes.parsed.items[0]?.text })}<h3 class="h4" style="margin-bottom:12px">Our operating principles</h3><ul class="ticks">${PRINCIPLES.map((p) => html`<li>${icon('check')}<span>${p}</span></li>`)}</ul></div>
    <div class="vibes-grid"><figure>${photo('duoMedals', { w: 700, h: 700 })}</figure><figure>${photo('duoWomen', { w: 700, h: 700 })}</figure><figure class="span-2">${photo('squad', { w: 1400, h: 700 })}</figure></div>
  </div>`)}

  ${section({ pin: c.pin(), row: open, id: 'openings', extra: 'Clicking a job opens Career detail.' }, html`
    ${head({ eyebrow: 'Open positions', title: open.parsed.title, accent: 'career opportunity' })}
    <form class="toolbar" data-jobs-filter role="search" onsubmit="return false">
      <div class="toolbar-fields">
        <label class="search"><span class="vh">Search positions</span>${icon('magnifying-glass')}<input type="search" name="q" placeholder="Search positions"></label>
        <label class="field"><span class="vh">Jobs</span><select name="job"><option value="">All jobs</option>${JOB_TYPES.map((j) => html`<option>${j}</option>`)}</select></label>
        <label class="field"><span class="vh">Level</span><select name="level"><option value="">All levels</option>${LEVELS.map((l) => html`<option${l === level ? raw(' selected') : ''}>${l}</option>`)}</select></label>
      </div>
    </form>
    <ul class="jobs jobs--cards" data-jobs>${JOBS.map((j) => html`<li><a class="job" href="${href('career', { slug: 'job' })}" data-job="${j.job}" data-level="${j.level}" data-title="${j.t.toLowerCase()}">
      <span class="job-top"><span class="job-tag">${j.job === 'Other' ? 'General' : j.job}</span>${(Date.now() - new Date(j.date)) / 864e5 <= 45 ? html`<span class="job-new">New</span>` : ''}</span>
      <span class="job-title">${j.t}</span>
      <span class="job-sum">${j.summary}</span>
      <span class="job-foot"><span class="job-meta">${icon('map-pin')}${j.loc}</span><span class="job-meta">${icon('stairs')}${j.level || 'All levels'}</span><span class="job-meta">${icon('calendar-blank')}${j.date}</span>${icon('arrow-right')}</span>
    </a></li>`)}</ul>
    <div class="empty" data-jobs-empty hidden>${icon('magnifying-glass')}<b>No positions match these filters.</b><span>Clear a filter, or send your CV to the talent team and we will reach out when a role opens.</span></div>`)}

  ${section({ pin: c.pin(), row: ben }, html`
    ${head({ title: ben.parsed.title, accent: 'working with us?' })}
    ${ruledGrid(benefits, { cols: 3, iconFor: (_, i) => ['trend-up', 'puzzle-piece', 'users-three', 'medal', 'sun-horizon', 'wallet'][i] })}
    <div class="perks"><h3 class="h4">The practical perks</h3><ul>${PERKS.map(([ic, t]) => html`<li>${icon(ic)}<span>${t}</span></li>`)}</ul></div>`)}

  ${section({ pin: c.pin(), row: proc, dark: true }, html`
    ${head({ title: proc.parsed.title, accent: 'hiring process' })}
    ${steps(hiring, { dark: true, layout: 'row' })}`)}

  ${section({ pin: c.pin(), row: intern, id: 'internships' }, html`<div class="split-2">
    <div>${head({ eyebrow: 'OJT & Internship', title: intern.parsed.title, accent: 'Talent Programs', lead: intern.parsed.subtitle, actions: btn('See the opportunity', { to: '#/careers?at=openings&level=Intern', kind: 'accent', arrow: true }) })}</div>
    <dl class="facts facts--stack"><div><dt>3</dt><dd>Month program</dd></div><div><dt>OJT</dt><dd>Hands-on training on real projects</dd></div><div><dt>Full-time</dt><dd>Offers for outstanding participants</dd></div></dl>
  </div>`)}

  ${section({ pin: c.pin(), row: life, id: 'life', extra: 'Scrolling down moves the photo strip horizontally.' }, html`
    ${head({ title: 'Why do we go to work?', accent: 'go to work?' })}
    <div class="hscroll" data-hscroll><div class="photo-strip" tabindex="0" role="region" aria-label="Life at PTN photos">
      ${['teamGroup', 'duoMedals', 'teamLunch', 'duoWomen', 'squad', 'duoShirts'].map((k) => html`<figure class="strip-photo strip-photo--tall">${photo(k, { w: 720, h: 900 })}</figure>`)}
    </div></div>`)}

  ${section({ pin: c.pin(), row: banner, dark: true, grid: true }, html`<div class="cta-banner">
    <h2 class="display display--2">${splitTitle(banner.parsed.title || 'Choose your next career opportunity', 'career opportunity')}</h2>
    ${btn('Browse jobs', { to: '#/careers?at=openings', kind: 'accent', arrow: true })}
  </div>`)}`;
}

function career(docs) {
  const c = ctx(docs, 'career-detail');
  const hero = c.get(/hero/i), jd = c.get(/description/i), apply = c.get(/ready/i);
  const form = docs.pages['career-detail'].form || [];
  const ack = form.find((f) => /Radio/i.test(f.type))?.label || '';
  const sections = ['About Us', 'What You’ll Do', 'What We’re Looking For', 'Nice to Have', 'Why Join Us'];
  return html`
  ${heroTitle({ pin: c.pin(), row: hero, eyebrow: 'Careers · Full Stack Developers', title: 'Mid level / Senior Fullstack Software Engineer', accent: 'Software Engineer', lead: JOBS[6].summary, back: html`<a class="rlink" href="${href('careers')}">${icon('arrow-left')} All positions</a>` })}

  ${section({ pin: c.pin(), row: jd }, html`<div class="jd">
    <aside class="jd-rail" aria-label="Job summary">
      <dl>${[['Employment type', 'Full-time'], ['Location', 'Can Tho, Vietnam'], ['Created date', '2 Mar 2025'], ['End date', 'Open until filled']].map(([k, v]) => html`<div><dt>${k}</dt><dd>${v}</dd></div>`)}</dl>
      ${btn('Apply now', { to: '#apply', kind: 'accent', arrow: true, attrs: 'data-scroll="apply"' })}
    </aside>
    <article class="prose">
      <h2>About Us</h2>
      <p>PTN Global was founded by Tam Phan, based in Melbourne, Australia. The Development Center is located in Vietnam, combining offshore expertise with face-to-face interactions.</p>
      ${sections.slice(1, 4).map((s) => html`<h2>${s}</h2><p class="sample-flag">Per-job content from the job post</p><ul><li>Role-specific point from the job post</li><li>Role-specific point from the job post</li></ul>`)}
      <h2>Why Join Us</h2>
      <ul>${PERKS.map(([, t]) => html`<li>${t}</li>`)}</ul>
      <p></p>
      <h2>How to Apply</h2>
      <p>If you're excited about building back-end systems that scale and love working in a high-impact role, we’d love to hear from you. Apply now or send your CV to <span class="sample-flag">careers email awaiting</span>.</p>
    </article>
  </div>`)}

  ${section({ pin: c.pin(), row: apply, id: 'apply', extra: 'Submit sends the CV to the HR email. Validation per the spec table.' }, html`
    <form class="apply form-grid" data-apply novalidate>
      ${head({ title: 'Ready to apply?', accent: 'apply?', lead: 'Fields marked * are required.' })}
      <div class="form-summary" data-summary hidden role="alert" tabindex="-1"></div>
      <div class="field-row">
        ${field('firstName', 'First Name', { required: true, auto: 'given-name' })}
        ${field('lastName', 'Last name', { required: true, auto: 'family-name' })}
      </div>
      <div class="field-row">
        ${field('email', 'Email', { required: true, type: 'email', auto: 'email' })}
        ${field('preferredName', 'Preferred Name', { auto: 'nickname' })}
      </div>
      <div class="field-row">
        ${field('linkedin', 'LinkedIn URL', { type: 'url', hint: 'e.g. https://www.linkedin.com/in/your-name' })}
        ${field('location', 'Location', { required: true, auto: 'address-level2' })}
      </div>
      <div class="field" data-field="resume">
        <span>Resume<b class="req">*</b></span>
        <label class="file">${icon('file-pdf')}<span><b data-file-name>Upload your CV</b><span>PDF only</span></span><input type="file" name="resume" accept="application/pdf,.pdf" aria-describedby="resume-err"></label>
        <small class="err" id="resume-err" hidden></small>
      </div>
      <fieldset class="field" data-field="aiAck">
        <legend>Interview integrity<b class="req">*</b></legend>
        <p class="ack">${txt(ack.replace(/\s*\*\s*$/, ''))}</p>
        <div class="radios"><label class="radio"><input type="radio" name="aiAck" value="yes" aria-describedby="aiAck-err"> Yes, I acknowledge</label><label class="radio"><input type="radio" name="aiAck" value="no"> No</label></div>
        <small class="err" id="aiAck-err" hidden></small>
      </fieldset>
      <label class="field" data-field="gender"><span>Gender<b class="req">*</b></span>
        <select name="gender" aria-describedby="gender-err"><option selected>Male</option><option>Female</option><option>Others</option></select>
        <small class="err" id="gender-err" hidden></small></label>
      <p class="fine">By applying you agree to PTN Global <a href="#">terms</a> and <a href="#">privacy policy</a>. Save your info to apply to other roles faster &amp; help employers reach you.</p>
      <div><button class="btn btn--accent" type="submit"><span>Submit</span>${icon('arrow-right')}</button></div>
      <div class="form-ok" data-ok hidden role="status">${icon('check-circle')} Application received. In the live site your CV is emailed to the HR team.</div>
    </form>`)}`;
}

function field(name, label, { required = false, type = 'text', auto = '', hint = '' } = {}) {
  return html`<label class="field" data-field="${name}"><span>${label}${required ? html`<b class="req">*</b>` : ''}</span>
    <input name="${name}" type="${type}"${auto ? raw(` autocomplete="${auto}"`) : ''} aria-describedby="${name}-err${hint ? ` ${name}-hint` : ''}">
    ${hint ? html`<small id="${name}-hint">${hint}</small>` : ''}<small class="err" id="${name}-err" hidden></small></label>`;
}

/* ---------- Insights ---------- */

function pager() {
  return html`<nav class="pager" aria-label="Pagination"><button type="button" disabled aria-label="Previous page">${icon('caret-left')}</button>
    <button type="button" aria-current="page">1</button><button type="button">2</button><button type="button">3</button><span>…</span><button type="button">8</button>
    <button type="button" aria-label="Next page">${icon('caret-right')}</button></nav>`;
}

function insights(docs, params = {}) {
  const c = ctx(docs, 'insights');
  const blog = c.get(/blog list/i);
  // One blog: every post type lives in the same list, split by category tabs (Whitepapers included).
  const TABS = [['all', 'All'], ['Blog', 'Blog'], ['News', 'News'], ['Events', 'Events'], ['Video', 'Videos'], ['Whitepaper', 'Whitepapers'], ['Newsletter', 'Newsletters']];
  const cat = TABS.some(([v]) => v === params.cat) ? params.cat : 'all';
  const posts = [
    ...TOPICS.slice(1).map(([k, t]) => ({ k, t, to: href('blog') })),
    ...WHITEPAPERS.map((t) => ({ k: 'Whitepaper', t, to: href('whitepaper') })),
    ...NEWSLETTERS.map((t) => ({ k: 'Newsletter', t, to: href('blog') })),
  ];
  // Videos (moved from Home): each opens the shared player dialog.
  const VIDEOS = [['Company introduction', 'teamGroup'], ['Inside the Can Tho development center', 'teamLunch'], ['Team-building day', 'squad']];
  return html`
  ${heroTitle({ pin: c.pin(), row: { section: 'Navbar title', purpose: 'Page title: PTN Global’s Insight.', parsed: {} }, eyebrow: 'Insights', title: 'PTN Global’s Insight', accent: 'Insight', lead: 'Engineering notes, company news, events, videos, whitepapers and newsletters from the PTN team.' })}

  ${section({ pin: c.pin(), row: blog, id: 'posts', extra: 'One blog list. Category tabs: All, Blog, News, Events, Videos, Whitepapers, Newsletters. Videos open the player dialog; search; 12 per page. Request open: whitepaper filter expectations.' }, html`
    <div class="toolbar blog-bar">
      <div class="tabs-line" role="group" aria-label="Post categories" data-filter="post">
        ${TABS.map(([v, l]) => html`<button type="button" data-value="${v}" aria-pressed="${String(v === cat)}">${l}</button>`)}
      </div>
      <label class="search"><span class="vh">Search posts</span>${icon('magnifying-glass')}<input type="search" placeholder="Search posts" data-search="post"></label>
    </div>
    <article class="feature-post" data-feature="post" data-cat="Blog"${cat !== 'all' && cat !== 'Blog' ? raw(' hidden') : ''}>
      <figure class="feature-photo">${photo('squad', { w: 1200, h: 675 })}</figure>
      <div><p class="news-meta"><span>Blog</span><em>Featured</em></p><h3 class="display display--2"><a href="${href('blog')}">${TOPICS[0][1]}</a></h3><p class="lead">What a smaller city gives an offshore team: lower attrition, a university pipeline and a calmer pace of work.</p>${btn('Read article', { to: href('blog'), kind: 'accent', arrow: true })}</div>
    </article>
    <div class="cards-3" data-filter-target="post">${posts.map((p, i) => html`<div data-cat="${p.k}"${cat !== 'all' && p.k !== cat ? raw(' hidden') : ''}>${newsCard(i, p.k, p.to, p.t)}</div>`)}${VIDEOS.map(([t, ph]) => html`<div data-cat="Video"${cat !== 'all' && cat !== 'Video' ? raw(' hidden') : ''}><article class="news news--video">
      <button type="button" class="vid" data-open="dlg-video" data-video="${t}" aria-label="Play video: ${t}"><span class="vid-poster">${photo(ph, { w: 800, h: 500 })}</span><span class="vid-btn">${icon('play')}</span></button>
      <p class="news-meta"><span>Video</span><em>Awaiting file</em></p>
      <h3 class="h4"><button type="button" class="link-btn" data-open="dlg-video" data-video="${t}">${t}</button></h3>
    </article></div>`)}</div>
    <div class="empty" data-empty="post" hidden>${icon('magnifying-glass')}<b>No posts match.</b><span>Try another keyword or another category.</span></div>
    ${pager()}`)}`;
}

function articleBody(sample = true) {
  return html`${sample ? html`<p class="sample-flag">Sample body, shows typographic styles only</p>` : ''}
    <h2 id="a1">Section heading</h2>
    <p>Article paragraphs render from the CMS at a comfortable 65 to 75 character measure, with generous leading for long reads.</p>
    <p>Links look <a href="#">like this</a>. Lists, quotes and figures share the same rhythm.</p>
    <h2 id="a2">Second section</h2>
    <ul><li>List item one</li><li>List item two</li><li>List item three</li></ul>
    <blockquote>A pull quote from the article sits in the display face.</blockquote>
    ${artPh('In-article figure', { ratio: '16/9' })}
    <h2 id="a3">Closing section</h2>
    <p>Closing paragraph and a call to read the next article.</p>`;
}

function blog(docs) {
  const c = ctx(docs, 'blog-detail');
  const hero = c.get(/hero/i), content = c.get(/content/i), sug = c.get(/suggested/i);
  return html`
  ${section({ pin: c.pin(), row: hero, cls: 's--hero', grid: true, label: 'Article' }, html`<header class="article-head">
    <nav class="crumbs" aria-label="Breadcrumb"><a href="${href('insights')}">Insights</a><span>/</span><a href="${href('insights')}">Blog</a></nav>
    <h1 class="display display--1">${TOPICS[0][1]}</h1><p class="sample-flag">Suggested topic</p>
    <p class="meta-row"><span>${icon('calendar-blank')}Created dd/mm/yyyy</span><span>${icon('clock')}6 minute read</span></p>
  </header>`)}
  ${section({ pin: c.pin(), row: content }, html`<figure class="wide-photo">${photo('teamGroup', { w: 2000, h: 860 })}</figure><div class="article" style="margin-top:56px"><div></div><article class="prose">${articleBody()}</article></div>`)}
  ${section({ pin: c.pin(), row: sug }, html`${head({ title: 'Suggested Blogs', accent: 'Blogs', lead: 'The 3 latest posts in the same category.' })}<div class="cards-3">${[0, 1, 2].map((i) => newsCard(i))}</div>`)}`;
}

function whitepaper(docs) {
  const c = ctx(docs, 'whitepaper-detail');
  const hero = c.get(/hero/i), content = c.get(/content/i), sug = c.get(/suggested/i);
  return html`
  ${section({ pin: c.pin(), row: hero, cls: 's--hero', grid: true, label: 'Whitepaper' }, html`<header class="article-head">
    <nav class="crumbs" aria-label="Breadcrumb"><a href="${href('insights')}">Insights</a><span>/</span><a href="${href('insights', { cat: 'Whitepaper' })}">Whitepapers</a></nav>
    <h1 class="display display--1">${WHITEPAPERS[0]}</h1><p class="sample-flag">Suggested topic</p>
    <p class="meta-row"><span>${icon('calendar-blank')}Created dd/mm/yyyy</span><span>${icon('clock')}14 minute read</span></p>
    <div class="s-actions s-actions--center">${btn('Download PDF', { to: '#', kind: 'accent', arrow: true })}</div>
  </header>`)}
  ${section({ pin: c.pin(), row: content }, html`<div class="article">
    <nav class="toc" aria-label="Table of contents"><p>List of content</p><a href="#a1" aria-current="true">Section heading</a><a href="#a2">Second section</a><a href="#a3">Closing section</a></nav>
    <article class="prose">${articleBody()}</article>
    <aside class="byline"><div><p>Written by</p><b>Author name</b></div><div><p>Categories</p><ul class="chips chips--sm"><li>Category</li><li>Category</li></ul></div></aside>
  </div>`)}
  ${section({ pin: c.pin(), row: sug }, html`${head({ title: 'Suggested Whitepapers', accent: 'Whitepapers' })}<div class="cards-3">${[0, 1, 2].map((i) => newsCard(i, 'Whitepaper', href('whitepaper')))}</div>`)}`;
}

/* ---------- Contact ---------- */

function contact(docs) {
  const notes = docs.structure.contactNotes;
  let n = 0;
  const r = (section, purpose) => ({ section, purpose, parsed: {} });
  const techs = ['.NET', 'Node.js', 'Python', 'React', 'Angular', 'Vue.js', 'Flutter', 'React Native', 'iOS', 'Android', 'AWS', 'Azure', 'OpenAI / LLM', 'Other'];
  return html`
  ${section({ pin: ++n, row: r('Inquiry / RFP form', txt(notes) || 'Multi-step lead form.'), cls: 's--hero', grid: true, label: 'Contact' }, html`<div class="contact">
    <div>
      ${eyebrow('Contact')}
      <h1 class="display display--1">${splitTitle('Big projects always start through a simple conversation.', 'a simple conversation.')}</h1>
      <p class="lead" style="margin-top:20px">Tell us what you are building. A delivery lead replies within one business day.</p>
      <div class="contact-lines">
        <a href="${CONTACT.phoneHref}">${icon('phone')}${CONTACT.phone}</a>
        <a href="mailto:${CONTACT.email}">${icon('envelope-simple')}${CONTACT.email}</a>
        <p>${icon('map-pin')}Level 5, 335 Flinders Lane, Melbourne VIC 3000</p>
      </div>
    </div>
    <form class="stepper" data-stepper novalidate>
      <ol class="stepper-nav">
        <li aria-current="step"><b>1</b><span>Your need</span></li><li><b>2</b><span>Tech &amp; team</span></li><li><b>3</b><span>Your details</span></li>
      </ol>
      <div class="stepper-body" data-step="1">
        <div class="form-summary" data-summary hidden role="alert" tabindex="-1"></div>
        <fieldset class="field" data-field="need"><legend>What do you need?<b class="req">*</b></legend>
          <div class="pills">${['Build a new product', 'Extend my team', 'Modernise a legacy system', 'Request for proposal (RFP)', 'Partner with PTN'].map((x) => html`<label class="pill"><input type="radio" name="need" value="${x}"><span>${x}</span></label>`)}</div>
          <small class="err" hidden></small></fieldset>
        <label class="field"><span>Service area</span><select name="area"><option value="">Not sure yet</option>${docs.structure.services.map((g) => html`<option>${g.category}</option>`)}</select></label>
      </div>
      <div class="stepper-body" data-step="2" hidden>
        <fieldset class="field" data-field="tech"><legend>Technologies<b class="req">*</b></legend>
          <div class="pills">${techs.map((t) => html`<label class="pill"><input type="checkbox" name="tech" value="${t}"><span>${t}</span></label>`)}</div>
          <small class="err" hidden></small></fieldset>
        <div class="field-row">
          <label class="field" data-field="teamSize"><span>Team size<b class="req">*</b></span><select name="teamSize"><option value="">Select</option><option>1-2</option><option>3-5</option><option>6-10</option><option>10+</option></select><small class="err" hidden></small></label>
          <label class="field"><span>Engagement model</span><select name="model">${docs.structure.engagement.flatMap((g) => g.items).filter((m, i, a) => a.findIndex((x) => x.name === m.name) === i).map((m) => html`<option>${m.name}</option>`)}</select></label>
        </div>
        ${awaitPh('Indicative quote from tech and team size', 'Doc TODO: "Include the get quote base on the tech & team size". Pricing rules needed.')}
      </div>
      <div class="stepper-body" data-step="3" hidden>
        <div class="field-row">${field('name', 'Full name', { required: true, auto: 'name' })}${field('email', 'Work email', { required: true, type: 'email', auto: 'email' })}</div>
        <div class="field-row">${field('company', 'Company', { required: true, auto: 'organization' })}${field('country', 'Country', { auto: 'country-name' })}</div>
        <label class="field"><span>Project details</span><textarea name="message" placeholder="Goals, timeline, links to specs"></textarea></label>
        <label class="check"><input type="checkbox" name="nda"> Send me an NDA before we talk</label>
      </div>
      <div class="stepper-body" data-step="4" hidden>
        <h2 class="h3">Check your request</h2>
        <dl class="summary" data-review></dl>
      </div>
      <div class="stepper-body" data-step="done" hidden>
        <div class="form-ok" role="status">${icon('check-circle')} Thanks. Your request is in. In the live site it goes to ${CONTACT.email}.</div>
      </div>
      <div class="stepper-foot">
        <button class="btn btn--line" type="button" data-back hidden><span>Back</span></button>
        <button class="btn btn--accent" type="button" data-next><span>Continue</span>${icon('arrow-right')}</button>
      </div>
    </form>
  </div>`)}

  ${section({ pin: ++n, row: r('Office Locations & Maps', 'Offices with maps.') }, html`${head({ title: 'Our offices', accent: 'offices' })}${offices()}`)}

  ${section({ pin: ++n, row: r('Partner with Us', 'Strategic alliances.'), dark: true }, html`<div class="cta-banner">
    <div>${head({ title: 'Partner with us', accent: 'with us', lead: 'Strategic alliances for agencies, consultancies and product companies. Partnership copy awaiting.' })}</div>
    ${btn('Start a partnership', { to: `mailto:${CONTACT.email}?subject=Partnership`, kind: 'accent', arrow: true })}
  </div>`)}

  ${section({ pin: ++n, row: r('Social Media Links', 'Social profiles.') }, html`<div class="socials">
    ${[['linkedin-logo', 'LinkedIn'], ['facebook-logo', 'Facebook'], ['youtube-logo', 'YouTube'], ['x-logo', 'X']].map(([i, l]) => html`<a class="social" href="#">${icon(i)}<span>${l}</span><small>Link awaiting</small></a>`)}
  </div>`)}`;
}

/* ---------- Site map ---------- */

const MAP = [
  ['home', 'home', 'Home', '/'], ['company', 'company', 'Company', '/company/'], ['services', 'services', 'Services', '/services/'],
  ['service', 'service-details', 'Service detail', '/services/…'], ['industries', 'industries', 'Industries', '/expertise/industries/'],
  ['technologies', 'technologies', 'Technologies', '/expertise/technologies/'], ['case-studies', 'case-studies', 'Case studies', '/expertise/case-studies/'],
  ['case-study', null, 'Case study detail', '/expertise/case-studies/…'], ['careers', 'careers', 'Careers', '/careers/'],
  ['career', 'career-detail', 'Career detail', '/careers/…'], ['insights', 'insights', 'Insights', '/insights/'],
  ['blog', 'blog-detail', 'Blog detail', '/insights/blogs/…'], ['whitepaper', 'whitepaper-detail', 'Whitepaper detail', '/insights/whitepapers/…'],
  ['contact', null, 'Contact', '/contact'],
];

function index(docs) {
  const openCount = MAP.reduce((a, [, k]) => a + (k ? docs.pages[k].requests.length : 0), 0);
  return html`
  ${heroTitle({
    title: 'PTN Global website wireframe', accent: 'wireframe', eyebrow: 'Site map',
    lead: 'Every template from the "All New Website" Confluence tree, styled in the TestSprite-inspired skin on Zero DS tokens. Copy is taken from the layout docs; dashed blocks mark content still owed.',
    actions: html`${btn('Open Home', { to: href('home'), kind: 'accent', arrow: true })}<button type="button" class="btn btn--line" data-annot-toggle><span>Show annotations</span>${icon('push-pin')}</button>`,
    aside: html`<dl class="facts facts--stack"><div><dt>14</dt><dd>Templates</dd></div><div><dt>22</dt><dd>Service routes (10 with content docs)</dd></div><div><dt>${openCount}</dt><dd>Open content requests</dd></div></dl>`,
  })}
  ${section({ label: 'Templates' }, html`
    <div class="legend" style="margin-bottom:32px">${artPh('Imagery to commission', { ratio: 'auto' })}${awaitPh('Content still owed by PTN')}</div>
    <div class="map">${MAP.map(([route, key, label, path]) => {
      const p = key ? docs.pages[key] : null;
      const secs = p ? p.sections.map((s) => s.section).filter((s) => !/navbar|footer/i.test(s)) : route === 'contact' ? ['Inquiry / RFP form', 'Office Locations & Maps', 'Partner with Us', 'Social Media Links'] : ['Hero', 'Cover', 'Challenge · Solution · Results', 'Tech used', 'Related'];
      const reqs = p ? p.requests : route === 'contact' ? ['No layout doc yet: built from the Website Structure notes.'] : ['Layout comes from an image only (Case Studies details.jpg).'];
      return html`<article class="map-card">
        <header><h2 class="h3"><a href="${href(route, route === 'service' ? { slug: 'custom-software-development' } : {})}">${label}</a></h2><code>${path}</code></header>
        <ol>${secs.map((s) => html`<li>${s}</li>`)}</ol>
        ${reqs.length ? html`<ul class="map-req">${reqs.map((q) => html`<li>${icon('hourglass-medium')}<span>${q}</span></li>`)}</ul>` : ''}
        <a class="rlink" href="${href(route, route === 'service' ? { slug: 'custom-software-development' } : {})}">Open template${icon('arrow-right')}</a>
      </article>`;
    })}</div>`)}`;
}

export const PAGES = {
  index, home, company, services, service, industries, technologies,
  'case-studies': caseStudies, 'case-study': caseStudy, careers, career, insights, blog, whitepaper, contact,
};

export const ACTIVE_MENU = {
  company: 'Company', services: 'Services', service: 'Services', industries: 'Expertise', technologies: 'Expertise',
  'case-studies': 'Expertise', 'case-study': 'Expertise', insights: 'Insights', blog: 'Insights', whitepaper: 'Insights',
  careers: 'Careers', career: 'Careers',
};
