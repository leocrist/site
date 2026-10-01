// Engagement Models explorer.
// Model names and descriptions come from Website Structure.md. Team structures, flows, facts and ratings
// are PROPOSED wireframe content for the PTN delivery team to confirm (flagged in the UI and annotation).
// Pattern reference: org-structure diagrams + side-by-side comparison (reviewed on groovetechnology.com).
import { html, raw, txt, icon } from './dom.js';

const WHO = { you: 'You', ptn: 'PTN', shared: 'Shared', ai: 'PTN + AI' };

/* Stage is 100 × 60 units (aspect 5:3). zones: [kind, label, x, y, w, h]; nodes: [id, role, icon, side, x, y];
   links: [from, to, kind, label?]. kind: manage (solid, arrow) · collab (moving dashes) · supply (moving dashes, arrow)
   · support (static dashes) · contract (accent, label). */
export const MODELS = {
  'AI-Augmented': {
    icon: 'sparkle', loop: 1, loopLabel: 'Every sprint',
    steps: [['Plan the sprint', 'shared', 50], ['AI-assisted build', 'ai', 85], ['Automated testing', 'ai', 90], ['Engineer review', 'ptn', 75], ['Release', 'shared', 50]],
    facts: { lead: 'PTN', you: 'Sprint goals and fast feedback', ptn: 'Engineers working with AI coding, testing and CI/CD tools', bill: 'Per sprint or monthly', best: 'More output from a smaller team' },
    rate: { speed: 5, scale: 4, budget: 3, flex: 4, control: 3, focus: 4, admin: 4, partner: 3 }, pos: [4.2, 3.05],
    topo: {
      zones: [['you', 'Your company', 2, 14, 28, 32], ['ptn', 'PTN engineers + AI tooling', 40, 4, 58, 52]],
      nodes: [['po', 'Product owner', 'crown-simple', 'you', 16, 30], ['e1', 'Engineer', 'code', 'ptn', 56, 18], ['e2', 'Reviewer', 'user-gear', 'ptn', 56, 42],
        ['a1', 'Coding assistant', 'robot', 'ai', 84, 12], ['a2', 'Test generator', 'robot', 'ai', 84, 30], ['a3', 'CI/CD bot', 'robot', 'ai', 84, 48]],
      links: [['po', 'e1', 'collab', 'Sprint goals'], ['e1', 'a1', 'supply'], ['e1', 'a2', 'supply'], ['e2', 'a3', 'supply'], ['e2', 'e1', 'support', 'Human review']],
    },
  },
  'Innovation Partnership': {
    icon: 'handshake', loop: 2, loopLabel: 'Learn and iterate',
    steps: [['Shared vision', 'shared', 50], ['Co-invest resources', 'shared', 50], ['Prototype', 'ptn', 70], ['Validate with market', 'shared', 50], ['Scale together', 'shared', 50]],
    facts: { lead: 'Shared', you: 'Market access, domain expertise and co-investment', ptn: 'Engineering capacity and co-investment', bill: 'Shared investment, shared upside', best: 'New products where both sides share the risk' },
    rate: { speed: 3, scale: 3, budget: 2, flex: 5, control: 4, focus: 4, admin: 2, partner: 5 }, pos: [5, 4],
    topo: {
      zones: [['you', 'Your company', 2, 4, 58, 52], ['ptn', 'PTN Global', 40, 4, 58, 52], ['joint', 'Shared venture', 40, 12, 20, 36]],
      nodes: [['f', 'Your founder', 'crown-simple', 'you', 14, 30], ['pl', 'PTN innovation lead', 'briefcase', 'ptn', 86, 30],
        ['j1', 'Product squad', 'users-three', 'joint', 50, 21], ['j2', 'Shared budget', 'coins', 'joint', 50, 40]],
      links: [['f', 'j1', 'collab'], ['f', 'j2', 'contract', 'Co-invest'], ['pl', 'j1', 'collab'], ['pl', 'j2', 'contract', 'Co-invest']],
    },
  },
  'Fixed Price': {
    icon: 'lock-simple', loop: null,
    steps: [['Define scope', 'you', 20], ['Estimate and quote', 'ptn', 90], ['Build', 'ptn', 95], ['Acceptance testing', 'you', 30], ['Handover', 'ptn', 90]],
    facts: { lead: 'PTN', you: 'A signed-off scope and acceptance criteria', ptn: 'The whole delivery team and a fixed quote', bill: 'Fixed price, paid by milestone', best: 'Well-defined projects and MVPs with a clear finish line' },
    rate: { speed: 2, scale: 1, budget: 5, flex: 1, control: 2, focus: 3, admin: 5, partner: 2 }, pos: [1, 1.6],
    topo: {
      zones: [['you', 'Your company', 2, 14, 28, 32], ['ptn', 'PTN Global · delivery team', 42, 4, 56, 52]],
      nodes: [['st', 'Stakeholder', 'user', 'you', 16, 30], ['pm', 'Project manager', 'user-gear', 'ptn', 55, 30], ['ba', 'Business analyst', 'chart-line', 'ptn', 72, 15],
        ['dev', 'Developers', 'code', 'ptn', 72, 45], ['qa', 'QA engineer', 'bug', 'ptn', 89, 30]],
      links: [['st', 'pm', 'contract', 'Fixed scope, price, timeline'], ['pm', 'ba', 'manage'], ['pm', 'dev', 'manage'], ['pm', 'qa', 'manage']],
    },
  },
  'Time & Material': {
    icon: 'timer', loop: 1, loopLabel: 'Repeat each sprint',
    steps: [['Prioritise backlog', 'you', 20], ['Sprint planning', 'shared', 50], ['Build sprint', 'ptn', 90], ['Demo and feedback', 'shared', 50], ['Pay for time used', 'you', 10]],
    facts: { lead: 'Shared', you: 'A prioritised backlog and a product owner', ptn: 'A delivery team sized to the work', bill: 'Hours actually worked, invoiced monthly', best: 'Products whose scope will change as you learn' },
    rate: { speed: 4, scale: 4, budget: 2, flex: 5, control: 4, focus: 3, admin: 3, partner: 3 }, pos: [4.6, 3.6],
    topo: {
      zones: [['you', 'Your company', 2, 14, 28, 32], ['ptn', 'PTN Global · delivery team', 42, 4, 56, 52]],
      nodes: [['po', 'Product owner', 'crown-simple', 'you', 16, 30], ['pm', 'Project manager', 'user-gear', 'ptn', 55, 30], ['d1', 'Developer', 'code', 'ptn', 72, 15],
        ['d2', 'Developer', 'code', 'ptn', 72, 45], ['qa', 'QA engineer', 'bug', 'ptn', 89, 30]],
      links: [['po', 'pm', 'collab', 'Backlog and sprint reviews'], ['pm', 'd1', 'manage'], ['pm', 'd2', 'manage'], ['pm', 'qa', 'manage']],
    },
  },
  'Dedicated Team': {
    icon: 'users-three', loop: 3, loopLabel: 'Ongoing',
    steps: [['Define roles', 'you', 30], ['Assemble the team', 'ptn', 90], ['Onboard to your process', 'shared', 60], ['Continuous delivery', 'shared', 65], ['Scale up or down', 'shared', 50]],
    facts: { lead: 'You', you: 'Direction, priorities and your PM', ptn: 'A full-time team, plus hiring, HR, payroll and retention', bill: 'Monthly, per team member', best: 'Long-running products that need a stable team' },
    rate: { speed: 3, scale: 4, budget: 4, flex: 4, control: 4, focus: 5, admin: 4, partner: 5 }, pos: [3.6, 3.4],
    topo: {
      zones: [['you', 'Your company', 2, 14, 28, 32], ['ptn', 'PTN Global · your dedicated team', 40, 4, 58, 52]],
      nodes: [['ypm', 'Your PM', 'user-gear', 'you', 16, 30], ['d1', 'Developer', 'code', 'ptn', 55, 15], ['d2', 'Developer', 'code', 'ptn', 55, 45],
        ['qa', 'QA engineer', 'bug', 'ptn', 72, 15], ['ba', 'Business analyst', 'chart-line', 'ptn', 72, 45], ['dm', 'Delivery manager', 'briefcase', 'ptn', 89, 30]],
      links: [['ypm', 'd1', 'manage'], ['ypm', 'd2', 'manage'], ['ypm', 'qa', 'manage'], ['ypm', 'ba', 'manage'], ['dm', 'qa', 'support', 'HR, payroll, retention'], ['dm', 'ba', 'support']],
    },
  },
  'Staff Augmentation': {
    icon: 'user-plus', loop: null,
    steps: [['Spot the skill gap', 'you', 10], ['Match engineers', 'ptn', 90], ['Join your team', 'you', 25], ['Work in your process', 'you', 15], ['Extend or release', 'you', 30]],
    facts: { lead: 'You', you: 'Your process, tools and team lead', ptn: 'Vetted engineers who join your team', bill: 'Monthly, per engineer', best: 'Filling skill gaps or workload peaks without hiring' },
    rate: { speed: 5, scale: 5, budget: 4, flex: 4, control: 5, focus: 3, admin: 3, partner: 3 }, pos: [3.2, 4.8],
    topo: {
      zones: [['you', 'Your team', 2, 4, 58, 52], ['ptn', 'PTN talent pool', 70, 16, 28, 28]],
      nodes: [['ypm', 'Your PM', 'user-gear', 'you', 12, 30], ['y1', 'Your developer', 'code', 'you', 28, 15], ['y2', 'Your developer', 'code', 'you', 28, 45],
        ['p1', 'PTN engineer', 'code', 'ptn', 46, 15], ['p2', 'PTN engineer', 'code', 'ptn', 46, 45], ['pool', 'Vetted engineers', 'users', 'ptn', 84, 30]],
      links: [['ypm', 'y1', 'manage'], ['ypm', 'y2', 'manage'], ['ypm', 'p1', 'manage'], ['ypm', 'p2', 'manage'], ['pool', 'p1', 'supply', 'Matched and placed'], ['pool', 'p2', 'supply']],
    },
  },
  'Build-Operate-Transfer': {
    icon: 'arrows-left-right', loop: null,
    steps: [['Build the centre', 'ptn', 95], ['Operate', 'ptn', 85], ['Stabilise', 'shared', 60], ['Transfer ownership', 'shared', 30], ['You own it', 'you', 0]],
    facts: { lead: 'PTN first, then you', you: 'A long-term commitment and future leaders', ptn: 'Set-up, hiring and operations until handover', bill: 'Build and operate fees, then a transfer fee', best: 'Owning a Vietnam centre without the start-up risk' },
    rate: { speed: 2, scale: 3, budget: 4, flex: 3, control: 3, focus: 5, admin: 3, partner: 5 }, pos: [2.4, 2.4],
    topo: {
      zones: [['you', 'Your company', 2, 4, 40, 52], ['ptn', 'PTN Global', 52, 4, 46, 52]],
      nodes: [['ex', 'Your executive', 'user', 'you', 12, 30], ['ld', 'Centre lead', 'briefcase', 'ptn', 64, 30], ['t1', 'Engineer', 'code', 'ptn', 84, 14],
        ['t2', 'Engineer', 'code', 'ptn', 84, 30], ['t3', 'QA engineer', 'bug', 'ptn', 84, 46]],
      links: [['ex', 'ld', 'contract', 'BOT agreement'], ['ld', 't1', 'manage'], ['ld', 't2', 'manage'], ['ld', 't3', 'manage']],
      phases: [
        { label: 'Build', note: 'PTN sets up the centre and hires the team.' },
        { label: 'Operate', note: 'PTN runs delivery while your leaders shadow.', move: { ex: [26, 30] } },
        { label: 'Transfer', note: 'The centre and its people become yours.', move: { ex: [10, 30], ld: [22, 30], t1: [36, 14], t2: [36, 30], t3: [36, 46] }, side: { ld: 'you', t1: 'you', t2: 'you', t3: 'you' } },
      ],
    },
  },
  'Offshore Development Center': {
    icon: 'globe-hemisphere-east', loop: 3, loopLabel: 'Runs as your extension',
    steps: [['Set up the centre', 'ptn', 90], ['Hire the team', 'ptn', 90], ['Integrate with your HQ', 'shared', 60], ['Run as an extension', 'shared', 60], ['Grow capacity', 'shared', 60]],
    facts: { lead: 'You (PTN runs the centre)', you: 'The roadmap and technical leadership', ptn: 'Office, hiring, HR and IT for your centre', bill: 'Monthly centre fee, per seat', best: 'Companies ready for a permanent offshore arm' },
    rate: { speed: 2, scale: 4, budget: 4, flex: 4, control: 4, focus: 5, admin: 4, partner: 5 }, pos: [3.1, 2.55],
    topo: {
      zones: [['you', 'Your HQ', 2, 14, 28, 32], ['ptn', 'Your offshore centre, run by PTN', 40, 4, 58, 52]],
      nodes: [['cto', 'Your CTO', 'user-gear', 'you', 16, 30], ['tl', 'Team lead', 'user-gear', 'ptn', 55, 30], ['e1', 'Engineers', 'code', 'ptn', 72, 15],
        ['e2', 'QA engineers', 'bug', 'ptn', 72, 45], ['ops', 'PTN operations', 'buildings', 'ptn', 89, 30]],
      links: [['cto', 'tl', 'manage', 'Roadmap and priorities'], ['tl', 'e1', 'manage'], ['tl', 'e2', 'manage'], ['ops', 'e1', 'support'], ['ops', 'e2', 'support', 'Office, HR, IT']],
    },
  },
  'Onsite-Offshore': {
    icon: 'airplane-tilt', loop: 1, loopLabel: 'Each release',
    steps: [['Onsite discovery', 'shared', 50], ['Offshore build', 'ptn', 90], ['Onsite liaison', 'shared', 50], ['Integrated QA', 'ptn', 85], ['Onsite rollout', 'shared', 50]],
    facts: { lead: 'Shared', you: 'Access to your site and stakeholders', ptn: 'An onsite lead plus an offshore team', bill: 'Onsite and offshore rates, monthly', best: 'Projects that need face-to-face discovery or rollout' },
    rate: { speed: 3, scale: 3, budget: 3, flex: 3, control: 4, focus: 4, admin: 3, partner: 4 }, pos: [2.8, 3.9],
    topo: {
      zones: [['you', 'Your site', 2, 4, 44, 52], ['ptn', 'PTN offshore · Vietnam', 56, 4, 42, 52]],
      nodes: [['y1', 'Your team', 'users', 'you', 13, 17], ['y2', 'Stakeholders', 'user', 'you', 13, 43], ['on', 'PTN onsite lead', 'user-gear', 'ptn', 34, 30],
        ['o1', 'Developers', 'code', 'ptn', 70, 15], ['o2', 'QA engineer', 'bug', 'ptn', 70, 45], ['o3', 'Designer', 'pen-nib', 'ptn', 89, 30]],
      links: [['y1', 'on', 'collab'], ['y2', 'on', 'collab'], ['on', 'o1', 'collab', 'Daily bridge'], ['on', 'o2', 'collab'], ['on', 'o3', 'collab']],
    },
  },
};

const CRITERIA = [['speed', 'Speed to start'], ['scale', 'Scale up or down'], ['budget', 'Budget predictability'], ['flex', 'Scope flexibility'],
  ['control', 'Your day-to-day control'], ['focus', 'Full focus on your product'], ['admin', 'Low admin for you'], ['partner', 'Long-term partnership']];
const FACTS = [['lead', 'Who leads day to day'], ['you', 'You bring'], ['ptn', 'PTN brings'], ['bill', 'Billing'], ['best', 'Best for']];
const DEFAULT_COMPARE = ['Staff Augmentation', 'Dedicated Team', 'Fixed Price'];

const slug = (s) => s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const meter = (v) => html`<span class="em-meter" role="img" aria-label="${v} of 5">${[1, 2, 3, 4, 5].map((i) => html`<i class="${i <= v ? 'on' : ''}"></i>`)}</span>`;

/* ---------- team structure diagram ---------- */

function topology(t, key) {
  const nodeAt = Object.fromEntries(t.nodes.map((n) => [n[0], n]));
  const lines = t.links.map(([a, b, kind, label], i) => {
    const A = nodeAt[a], B = nodeAt[b];
    return { a, b, kind, label, i, x1: A[4], y1: A[5], x2: B[4], y2: B[5] };
  });
  // Shorten each segment so it stops at the node edge (node ≈ 4.4 units wide).
  const trim = (l, d = 3.4) => {
    const dx = l.x2 - l.x1, dy = l.y2 - l.y1, len = Math.hypot(dx, dy) || 1;
    return { x1: l.x1 + (dx / len) * d, y1: l.y1 + (dy / len) * d, x2: l.x2 - (dx / len) * d, y2: l.y2 - (dy / len) * d };
  };
  const pct = (x, y) => `left:${x}%;top:${(y / 60) * 100}%`;
  return html`<div class="em-topo-stage" data-topo="${key}">
    ${t.zones.map(([kind, label, x, y, w, h]) => html`<div class="em-zone em-zone--${kind}" style="left:${x}%;top:${(y / 60) * 100}%;width:${w}%;height:${(h / 60) * 100}%"><span>${label}</span></div>`)}
    <svg class="em-links" viewBox="0 0 100 60" aria-hidden="true">
      <defs><marker id="arr-${key}" viewBox="0 0 6 6" refX="5" refY="3" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0,0 L6,3 L0,6 z" fill="currentColor"/></marker></defs>
      ${lines.map((l) => {
        const s = trim(l);
        const arrow = l.kind === 'manage' || l.kind === 'supply';
        return html`<line class="em-link em-link--${l.kind}" data-a="${l.a}" data-b="${l.b}" style="--k:${l.i}" x1="${s.x1.toFixed(2)}" y1="${s.y1.toFixed(2)}" x2="${s.x2.toFixed(2)}" y2="${s.y2.toFixed(2)}"${arrow ? raw(` marker-end="url(#arr-${key})"`) : ''}/>`;
      })}
    </svg>
    ${lines.filter((l) => l.label).map((l) => html`<span class="em-link-label em-link-label--${l.kind}" data-a="${l.a}" data-b="${l.b}" style="${pct((l.x1 + l.x2) / 2, (l.y1 + l.y2) / 2)}">${l.label}</span>`)}
    ${t.nodes.map(([id, role, ic, side, x, y], k) => html`<div class="em-person em-person--${side}" data-node="${id}" data-side="${side}" style="${pct(x, y)};--k:${k}">
      <span class="em-person-ic">${icon(ic)}</span><span class="em-person-role">${role}</span>
    </div>`)}
  </div>`;
}

const LEGEND = html`<ul class="em-topo-legend">
  <li><i class="lg-node lg-node--you"></i>Your people</li><li><i class="lg-node lg-node--ptn"></i>PTN people</li><li><i class="lg-node lg-node--ai"></i>AI tooling</li>
  <li><i class="lg-line lg-line--manage"></i>Directs the work</li><li><i class="lg-line lg-line--collab"></i>Works together</li><li><i class="lg-line lg-line--support"></i>Supports</li><li><i class="lg-line lg-line--contract"></i>Agreement</li>
</ul>`;

/* ---------- explore panel ---------- */

function panel(m, category, i) {
  const f = MODELS[m.name];
  if (!f) return '';
  const id = `em-${slug(m.name)}`;
  const t = f.topo;
  return html`<div class="em-panel" role="tabpanel" id="${id}-p" aria-labelledby="${id}-t" tabindex="0"${i ? raw(' hidden') : ''} data-loop="${f.loop ?? ''}" style="--n:${f.steps.length}">
    <header class="em-panel-head">
      <div>
        <p class="em-cat">${category}</p>
        <h3 class="em-title">${icon(f.icon)}${m.name}</h3>
        <p class="em-desc">${txt(m.desc)}</p>
      </div>
      <span class="em-flag">Proposed · confirm with delivery</span>
    </header>

    <div class="em-body">
      <figure class="em-topo">
        <figcaption class="em-topo-head">
          <span class="em-kicker">Team structure</span>
          ${t.phases ? html`<span class="em-phases" role="group" aria-label="Phase">${t.phases.map((p, k) => html`<button type="button" data-phase="${k}" aria-pressed="${k === 0}">${p.label}</button>`)}</span>` : ''}
        </figcaption>
        <p class="em-swipe">${icon('hand-swipe-right')}Swipe the diagram to see both sides</p>
        <div class="em-topo-scroll" tabindex="0" role="region" aria-label="${m.name} team structure">${topology(t, slug(m.name))}</div>
        ${t.phases ? html`<p class="em-phase-note" data-phase-note aria-live="polite">${t.phases[0].note}</p>` : ''}
        ${LEGEND}
      </figure>
      <dl class="em-facts">${FACTS.map(([k, l]) => html`<div><dt>${l}</dt><dd>${f.facts[k]}</dd></div>`)}</dl>
    </div>

    <div class="em-flow${f.loop != null ? ' em-flow--loop' : ''}">
      <p class="em-kicker">How it runs</p>
      <div class="em-flow-in">
        <div class="em-track" aria-hidden="true"><span class="em-packet"></span></div>
        <ol class="em-steps">
          ${f.steps.map(([label, who, ptn], k) => html`<li class="em-step" style="--k:${k}">
            <span class="em-node">${String(k + 1).padStart(2, '0')}</span>
            <b>${label}</b>
            <span class="em-who em-who--${who}">${WHO[who]}</span>
            <span class="em-split" role="img" aria-label="PTN ${ptn} percent, you ${100 - ptn} percent"><span style="width:${ptn}%"></span></span>
            <small>PTN ${ptn}% · You ${100 - ptn}%</small>
          </li>`)}
        </ol>
        ${f.loop != null ? html`<div class="em-loop" style="--from:${f.loop};--to:${f.steps.length - 1}">
          <span class="em-loop-line"></span><span class="em-loop-label">${icon('arrow-counter-clockwise')}${f.loopLabel}: back to step ${String(f.loop + 1).padStart(2, '0')}</span>
        </div>` : html`<p class="em-once">${icon('flag-checkered')}Runs once, start to finish</p>`}
      </div>
    </div>
  </div>`;
}

/* ---------- compare table ---------- */

function compareTable(groups) {
  const all = groups.flatMap((g) => g.items).filter((m) => MODELS[m.name]);
  const on = (name) => DEFAULT_COMPARE.includes(name);
  const cell = (m, inner) => html`<td data-col="${slug(m.name)}"${on(m.name) ? '' : raw(' hidden')}>${inner}</td>`;
  return html`<div class="em-cmp" data-em-cmp>
    <div class="em-cmp-pick">
      <p class="em-kicker">Pick up to 3 models</p>
      <div class="pills pills--dark">${all.map((m) => html`<button type="button" class="em-chip" data-cmp="${slug(m.name)}" aria-pressed="${on(m.name)}">${icon(MODELS[m.name].icon)}${m.name}</button>`)}</div>
    </div>
    <div class="em-table-wrap"><table class="em-table">
      <thead><tr><th scope="col"><span class="vh">Criteria</span></th>${all.map((m) => html`<th scope="col" data-col="${slug(m.name)}"${on(m.name) ? '' : raw(' hidden')}>${icon(MODELS[m.name].icon)}<span>${m.name}</span></th>`)}</tr></thead>
      <tbody>
        ${CRITERIA.map(([k, l]) => html`<tr><th scope="row">${l}</th>${all.map((m) => cell(m, meter(MODELS[m.name].rate[k])))}</tr>`)}
        ${[['lead', 'Who leads day to day'], ['bill', 'Billing'], ['best', 'Best for']].map(([k, l]) => html`<tr class="em-row-text"><th scope="row">${l}</th>${all.map((m) => cell(m, MODELS[m.name].facts[k]))}</tr>`)}
        <tr class="em-row-go"><th scope="row"><span class="vh">Details</span></th>${all.map((m) => cell(m, html`<button type="button" class="rlink" data-em-go="em-${slug(m.name)}-t">See the team structure${icon('arrow-right')}</button>`))}</tr>
      </tbody>
    </table></div>
  </div>`;
}

/* ---------- positioning map ---------- */

function compareMap(groups) {
  const all = groups.flatMap((g) => g.items.map((m) => ({ ...m, category: g.category })));
  return html`<div class="em-map">
    <div class="em-plot" role="group" aria-label="Engagement models positioned by scope flexibility and your involvement">
      <span class="em-axis em-axis--x">Scope flexibility ${icon('arrow-right')}</span>
      <span class="em-axis em-axis--y">${icon('arrow-up')} Your day-to-day involvement</span>
      <span class="em-q em-q--tl">Hands-on, fixed</span><span class="em-q em-q--tr">Hands-on, evolving</span>
      <span class="em-q em-q--bl">Hands-off, fixed</span><span class="em-q em-q--br">Hands-off, evolving</span>
      ${all.map((m) => {
        const f = MODELS[m.name];
        if (!f) return '';
        const [x, y] = f.pos;
        return html`<button type="button" class="em-dot em-dot--${slug(m.category)}${x >= 4.1 ? ' em-dot--flip' : ''}" style="left:${((x - 0.5) / 5) * 100}%;bottom:${((y - 0.5) / 5) * 100}%" data-em-go="em-${slug(m.name)}-t"><i></i><span>${m.name}</span></button>`;
      })}
    </div>
    <ul class="em-legend">${groups.map((g) => html`<li><i class="em-dot--${slug(g.category)}"></i>${g.category}</li>`)}</ul>
  </div>`;
}

/* ---------- public ---------- */

export function engagementExplorer(groups, startSteps = []) {
  let first = true;
  return html`<div class="em" data-em>
    <div class="em-bar">
      <div class="seg seg--dark" role="group" aria-label="View">
        <button type="button" aria-pressed="true" data-em-view="explore">${icon('tree-structure')} Team structure</button>
        <button type="button" aria-pressed="false" data-em-view="compare">${icon('table')} Compare side by side</button>
        <button type="button" aria-pressed="false" data-em-view="map">${icon('chart-scatter')} Map</button>
      </div>
    </div>

    <div class="em-explore" data-em-pane="explore">
      <div class="em-list" role="tablist" aria-label="Engagement models" aria-orientation="vertical">
        ${groups.map((g) => html`<p class="em-group">${g.category}</p>
          ${g.items.map((m) => {
            const sel = first;
            first = false;
            const id = `em-${slug(m.name)}`;
            return html`<button role="tab" id="${id}-t" aria-controls="${id}-p" aria-selected="${sel}" tabindex="${sel ? 0 : -1}">${icon(MODELS[m.name]?.icon || 'circle')}<span>${m.name}</span>${icon('caret-right')}</button>`;
          })}`)}
      </div>
      <div class="em-stage">${groups.flatMap((g) => g.items.map((m) => ({ m, g }))).map(({ m, g }, i) => panel(m, g.category, i))}</div>
    </div>

    <div data-em-pane="compare" hidden>${compareTable(groups)}</div>
    <div data-em-pane="map" hidden>${compareMap(groups)}</div>

    ${startSteps.length ? html`<div class="em-start">
      <p class="em-kicker">How every engagement starts</p>
      <ol>${startSteps.map((s, k) => html`<li><span class="step-n">${String(k + 1).padStart(2, '0')}</span><b>${txt(s.name)}</b><span>${txt(s.text)}</span></li>`)}</ol>
      <button type="button" class="btn btn--accent" data-open="dlg-team"><span>Build Your Team</span>${icon('arrow-right')}</button>
    </div>` : ''}
  </div>`;
}

export function bindEngagement(root) {
  const em = root.querySelector('[data-em]');
  if (!em) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const tabs = [...em.querySelectorAll('[role="tab"]')];
  let timer;

  const setPhase = (p, k) => {
    const key = p.querySelector('[data-topo]')?.dataset.topo;
    const name = Object.keys(MODELS).find((n) => slug(n) === key);
    const t = MODELS[name]?.topo;
    if (!t?.phases) return;
    const ph = t.phases[k];
    const base = Object.fromEntries(t.nodes.map((n) => [n[0], n]));
    const pos = (id) => (ph.move?.[id] || t.phases.slice(0, k).reverse().find((x) => x.move?.[id])?.move[id] || [base[id][4], base[id][5]]);
    t.nodes.forEach(([id]) => {
      const el = p.querySelector(`[data-node="${id}"]`);
      const [x, y] = pos(id);
      el.style.left = `${x}%`;
      el.style.top = `${(y / 60) * 100}%`;
      const side = ph.side?.[id] || base[id][3];
      el.className = el.className.replace(/em-person--\w+/, `em-person--${side}`);
    });
    // Re-draw links between the moved nodes.
    p.querySelectorAll('.em-link').forEach((ln) => {
      const [x1, y1] = pos(ln.dataset.a), [x2, y2] = pos(ln.dataset.b);
      const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy) || 1, d = 3.4;
      ln.setAttribute('x1', (x1 + (dx / len) * d).toFixed(2)); ln.setAttribute('y1', (y1 + (dy / len) * d).toFixed(2));
      ln.setAttribute('x2', (x2 - (dx / len) * d).toFixed(2)); ln.setAttribute('y2', (y2 - (dy / len) * d).toFixed(2));
    });
    p.querySelectorAll('.em-link-label').forEach((lb) => {
      const [x1, y1] = pos(lb.dataset.a), [x2, y2] = pos(lb.dataset.b);
      lb.style.left = `${(x1 + x2) / 2}%`;
      lb.style.top = `${(((y1 + y2) / 2) / 60) * 100}%`;
    });
    p.querySelectorAll('[data-phase]').forEach((b) => b.setAttribute('aria-pressed', String(+b.dataset.phase === k)));
    const note = p.querySelector('[data-phase-note]');
    if (note) note.textContent = ph.note;
    p.dataset.phaseIndex = k;
  };

  const run = (p) => {
    clearInterval(timer);
    p.classList.remove('is-run');
    void p.offsetWidth; // restart the CSS sequence
    p.classList.add('is-run');
    if (p.querySelector('[data-phase]')) {
      setPhase(p, 0);
      if (!reduce) timer = setInterval(() => setPhase(p, ((+p.dataset.phaseIndex || 0) + 1) % 3), 2800);
    }
  };

  const select = (t, focus) => {
    tabs.forEach((x) => {
      const on = x === t;
      x.setAttribute('aria-selected', String(on));
      x.tabIndex = on ? 0 : -1;
      const p = document.getElementById(x.getAttribute('aria-controls'));
      p.hidden = !on;
      if (on) run(p);
    });
    if (focus) t.focus();
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => select(t));
    t.addEventListener('keydown', (e) => {
      const k = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
      if (k) { e.preventDefault(); select(tabs[(i + k + tabs.length) % tabs.length], true); }
    });
  });
  em.querySelectorAll('[data-phase]').forEach((b) => b.addEventListener('click', () => {
    clearInterval(timer);
    setPhase(b.closest('.em-panel'), +b.dataset.phase);
  }));

  const views = [...em.querySelectorAll('[data-em-view]')];
  const setView = (v) => {
    views.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.emView === v)));
    em.querySelectorAll('[data-em-pane]').forEach((p) => (p.hidden = p.dataset.emPane !== v));
    if (v !== 'explore') clearInterval(timer);
  };
  views.forEach((b) => b.addEventListener('click', () => setView(b.dataset.emView)));
  em.querySelectorAll('[data-em-go]').forEach((d) => d.addEventListener('click', () => {
    setView('explore');
    select(document.getElementById(d.dataset.emGo), true);
  }));

  // Compare: keep at most three columns; the oldest pick drops out.
  const order = [...DEFAULT_COMPARE.map(slug)];
  const chips = [...em.querySelectorAll('[data-cmp]')];
  const syncCols = () => {
    chips.forEach((c) => c.setAttribute('aria-pressed', String(order.includes(c.dataset.cmp))));
    em.querySelectorAll('.em-table [data-col]').forEach((c) => (c.hidden = !order.includes(c.dataset.col)));
  };
  chips.forEach((c) => c.addEventListener('click', () => {
    const k = c.dataset.cmp;
    const at = order.indexOf(k);
    if (at >= 0) { if (order.length > 1) order.splice(at, 1); }
    else { order.push(k); if (order.length > 3) order.shift(); }
    syncCols();
  }));

  const firstPanel = em.querySelector('.em-panel:not([hidden])');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(([en]) => { if (en.isIntersecting) { run(firstPanel); io.disconnect(); } }, { threshold: 0.3 });
    io.observe(em);
  } else run(firstPanel);
}
