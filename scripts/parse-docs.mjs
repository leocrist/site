// Parses the Confluence-exported layout docs in `All New Website/` into wireframe/data/docs.json.
// Pure helpers are exported for tests; `main()` runs when the file is executed directly.

import { readFile, writeFile, readdir, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const cells = (row) => row.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim());
const isSeparator = (row) => /^\|?\s*:?-{3,}/.test(row.trim());

/** Every markdown table in `md`, as arrays of cell arrays (header included). */
export function tables(md) {
  const out = [];
  let cur = null;
  for (const line of md.split('\n')) {
    if (line.trim().startsWith('|')) {
      if (!cur) out.push((cur = []));
      if (!isSeparator(line)) cur.push(cells(line));
    } else cur = null;
  }
  return out;
}

/** The first table whose header starts with "Section", as row objects. */
export function parseTable(md) {
  const t = tables(md).find((rows) => /^section$/i.test(rows[0]?.[0] || ''));
  if (!t) return [];
  const [head, ...rows] = t;
  const col = (re) => head.findIndex((h) => re.test(h));
  const iP = col(/purpose/i), iC = col(/content/i), iU = col(/^ui$/i);
  return rows.map((r) => ({
    section: r[0] || '',
    purpose: iP >= 0 ? r[iP] || '' : '',
    content: iC >= 0 ? r[iC] || '' : '',
    ui: iU >= 0 ? r[iU] || '' : '',
  }));
}

const STOP = String.raw`(?=\s*(?:Subtitle\s*:|Content\s*:|Content\s+-|\s-\s|CTA\s*:|Behavior\s*:|Additional behavior|Service and Description|Category\s*:|$))`;
const clean = (s) => (s || '').replace(/\s+/g, ' ').replace(/software outsourcing/gi, 'software development').replace(/IT outsourcing/g, 'IT engineering').trim(); // copy rule: never say "outsourcing"
const empty = (s) => !s || s === '#' || /^#+$/.test(s);

/** Split an item into {name, text} using Description:, a short colon lead, or a CamelCase joint. */
export function splitName(raw) {
  const s = clean(raw);
  let m = s.match(/^(.*?)\s*Description\s*:\s*(.*)$/i);
  if (m) return { name: clean(m[1]), text: clean(m[2]) };
  m = s.match(/^([^:]{2,60}?)\s*:\s*(.*)$/);
  if (m) return { name: clean(m[1]), text: clean(m[2]) };
  m = s.match(/^([A-Z][^.]{1,48}?)\s?(From [a-z].*)$/);
  if (m) return { name: clean(m[1]), text: clean(m[2]) };
  m = s.match(/^(.{2,70}?[a-z)])([A-Z][a-z].*)$/);
  if (m && !/\s[A-Z][a-z]+$/.test(m[1].slice(-1))) return { name: clean(m[1]), text: clean(m[2]) };
  // Title Case heading followed by a sentence: "Monitoring & Scaling AI models require…"
  const tok = s.split(' ');
  const head = (w) => /^([A-Z][\w\-/]*|&|and|of|to)$/.test(w);
  for (let i = 1; i < Math.min(tok.length - 1, 8); i++) {
    if (!head(tok[i - 1])) break;
    if (/^[A-Z]/.test(tok[i]) && /^[a-z]/.test(tok[i + 1] || '')) return { name: tok.slice(0, i).join(' '), text: tok.slice(i).join(' ') };
  }
  return s.length > 64 ? { name: '', text: s } : { name: s, text: '' };
}

/** Structured read of a "Content in the section" cell. */
export function parseContent(cell) {
  const raw = clean(cell);
  const grab = (label) => {
    const m = raw.match(new RegExp(label + String.raw`\s*:\s*(.*?)` + STOP, 'i'));
    return m && !empty(clean(m[1])) ? clean(m[1]) : undefined;
  };
  const title = grab('Title');
  const subtitle = grab('Subtitle');
  const cta = (raw.match(/CTA\s*:\s*(.*?)(?=\s*(?:Additional behavior|Behavior\s*:|$))/i) || [])[1];
  const behavior = (raw.match(/(?:Additional behavior|Behavior)\s*:\s*(.*)$/i) || [])[1];

  let body = raw;
  const cIdx = body.search(/Content\s*:|Content\s+-/i);
  if (cIdx >= 0) body = body.slice(cIdx).replace(/^Content\s*:?\s*/i, '');
  else if (subtitle) body = body.slice(body.indexOf(subtitle) + subtitle.length);
  else if (title) body = body.slice(body.indexOf(title) + title.length);
  body = body.replace(/(?:Additional behavior|Behavior)\s*:.*$/i, '').replace(/CTA\s*:.*$/i, '');

  let parts;
  if (/(?:Section|Step)\s*\d+\s*:/i.test(body)) {
    parts = body.split(/(?:^|\s-\s|\s)(?:Section|Step)\s*\d+\s*:\s*/i).slice(1);
  } else {
    parts = body.split(/(?:^|\s)-\s+/).slice(1);
  }
  const items = parts.map((p) => clean(p.replace(/\s-\s*$/, ''))).filter(Boolean).map(splitName);

  const out = { items, raw };
  if (title) out.title = title;
  if (subtitle) out.subtitle = subtitle;
  if (cta) out.cta = clean(cta);
  if (behavior) out.behavior = clean(behavior);
  return out;
}

/** Numbered FAQ list ("1. Question? Answer. 2. ...") from a content cell. */
export function parseFaq(cell) {
  const raw = clean(cell).replace(/^.*?Content\s*:\s*/i, '');
  return raw
    .split(/(?:^|\s)\d{1,2}\.\s+(?=[A-Z])/)
    .map(clean)
    .filter((c) => c.includes('?'))
    .map((c) => {
      const i = c.indexOf('?');
      return { q: c.slice(0, i + 1), a: clean(c.slice(i + 1)) };
    });
}

export const slugify = (s) => s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/** Hierarchy tables from Website Structure.md: rows with a missing category inherit the previous one. */
export function parseHierarchy(rows) {
  const [head, ...body] = rows;
  const width = head.length;
  const groups = [];
  let current = null;
  for (const r of body) {
    let cat, name, desc, examples;
    if (r.length >= width) [, cat, name, desc, examples] = r;
    else [, name, desc, examples] = r;
    if (cat) groups.push((current = { category: cat, items: [] }));
    if (!current) groups.push((current = { category: '', items: [] }));
    if (name) current.items.push({ name, desc: desc || '', ...(examples ? { examples } : {}) });
  }
  return groups;
}

/** Top-level "Request" rows (open content questions) from a doc. */
export function parseRequests(md) {
  const t = tables(md).find((rows) => /request/i.test(rows[0]?.[0] || ''));
  return t ? t.slice(1).map((r) => r[0]).filter(Boolean) : [];
}

const PAGE_FILES = {
  home: 'Home Page Layout.md',
  company: 'Company Layout.md',
  services: 'Service Overall Layout.md',
  'service-details': 'Service Details.md',
  industries: 'Industries Layout.md',
  technologies: 'Technologies Layout.md',
  'case-studies': 'Case Studies Layout.md',
  careers: 'Career Layout.md',
  'career-detail': 'Career Detail Layout.md',
  insights: 'Insight Layout.md',
  'blog-detail': 'Blogs Details.md',
  'whitepaper-detail': 'Whitepaper Details.md',
};

const withContent = (rows) =>
  rows.map((r) => {
    const parsed = parseContent(r.content);
    if (/faq/i.test(r.section)) parsed.faq = parseFaq(r.content);
    return { ...r, parsed };
  });

export async function build(root) {
  const docsDir = path.join(root, 'All New Website');
  const pages = {};
  for (const [slug, file] of Object.entries(PAGE_FILES)) {
    const md = await readFile(path.join(docsDir, file), 'utf8');
    pages[slug] = { file, sections: withContent(parseTable(md)), requests: parseRequests(md) };
  }

  // Career apply form table
  const careerMd = await readFile(path.join(docsDir, PAGE_FILES['career-detail']), 'utf8');
  const formT = tables(careerMd).find((rows) => rows[0][0] === 'No');
  pages['career-detail'].form = formT
    ? formT.slice(1).map((r) => ({ no: r[0], label: r[1], type: r[2], required: r[3], validation: r[4], error: r[5], note: r[6] }))
    : [];

  const services = {};
  const svcDir = path.join(docsDir, 'Service Details');
  for (const f of (await readdir(svcDir)).filter((n) => n.endsWith('.md')).sort()) {
    const md = await readFile(path.join(svcDir, f), 'utf8');
    const name = f.replace(/ Content\.md$/, '');
    services[slugify(name)] = { name, sections: withContent(parseTable(md)) };
  }

  const structMd = await readFile(path.join(docsDir, 'Website Structure.md'), 'utf8');
  const hier = tables(structMd).filter((t) => t[0][0] === '#' && t[0][1] === 'Category');
  const [svcT, engT, indT, techT] = hier;
  const structure = {
    services: svcT ? parseHierarchy(svcT) : [],
    engagement: engT ? parseHierarchy(engT) : [],
    industries: indT ? parseHierarchy(indT) : [],
    technologies: techT ? parseHierarchy(techT) : [],
    contactNotes: (structMd.match(/\| 7 \| Contact \|[^|]*\|([^|]*)\|/) || [])[1]?.trim() || '',
  };
  for (const g of structure.services) for (const it of g.items) it.slug = slugify(it.name);

  return { generated: new Date().toISOString(), pages, services, structure };
}

async function main() {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
  const data = await build(root);
  const out = path.join(root, 'wireframe/data/docs.json');
  await mkdir(path.dirname(out), { recursive: true });
  await writeFile(out, JSON.stringify(data, null, 2));
  console.log(`docs.json: ${Object.keys(data.pages).length} pages, ${Object.keys(data.services).length} services`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main();
