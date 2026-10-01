// Hash router: "#/services/custom-software-development?x=1" → { name, params }.

export const ROUTES = [
  { pattern: '/', name: 'index', label: 'Site map', group: 'Wireframe' },
  { pattern: '/home', name: 'home', label: 'Home', group: 'Home' },
  { pattern: '/company', name: 'company', label: 'Company', group: 'Company' },
  { pattern: '/services', name: 'services', label: 'Services', group: 'Services' },
  { pattern: '/services/:slug', name: 'service', label: 'Service detail', group: 'Services' },
  { pattern: '/expertise/industries', name: 'industries', label: 'Industries', group: 'Expertise' },
  { pattern: '/expertise/technologies', name: 'technologies', label: 'Technologies', group: 'Expertise' },
  { pattern: '/expertise/case-studies', name: 'case-studies', label: 'Case studies', group: 'Expertise' },
  { pattern: '/expertise/case-studies/:slug', name: 'case-study', label: 'Case study detail', group: 'Expertise' },
  { pattern: '/careers', name: 'careers', label: 'Careers', group: 'Careers' },
  { pattern: '/careers/:slug', name: 'career', label: 'Career detail', group: 'Careers' },
  { pattern: '/insights', name: 'insights', label: 'Insights', group: 'Insights' },
  { pattern: '/insights/blog', name: 'blog', label: 'Blog detail', group: 'Insights' },
  { pattern: '/insights/whitepaper', name: 'whitepaper', label: 'Whitepaper detail', group: 'Insights' },
  { pattern: '/contact', name: 'contact', label: 'Contact', group: 'Contact' },
];

const compiled = ROUTES.map((r) => {
  const keys = [];
  const src = r.pattern.replace(/:([a-z]+)/g, (_, k) => (keys.push(k), '([^/]+)'));
  return { ...r, re: new RegExp('^' + src + '/?$'), keys };
});

export function parseRoute(hash) {
  const raw = (hash || '').replace(/^#/, '') || '/';
  const [path, query = ''] = raw.split('?');
  const params = Object.fromEntries(new URLSearchParams(query));
  // Static patterns first so "/insights/blog" wins over any ":slug" sibling.
  const ordered = [...compiled].sort((a, b) => a.keys.length - b.keys.length);
  for (const r of ordered) {
    const m = path.match(r.re);
    if (m) {
      r.keys.forEach((k, i) => (params[k] = decodeURIComponent(m[i + 1])));
      return { name: r.name, params };
    }
  }
  return { name: 'index', params: {} };
}

export function href(name, params = {}) {
  const r = ROUTES.find((x) => x.name === name);
  if (!r) return '#/';
  const rest = { ...params };
  const path = r.pattern.replace(/:([a-z]+)/g, (_, k) => {
    const v = rest[k];
    delete rest[k];
    return encodeURIComponent(v ?? 'sample');
  });
  const q = new URLSearchParams(rest).toString();
  return '#' + path + (q ? '?' + q : '');
}
