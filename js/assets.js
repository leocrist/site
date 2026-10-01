// Real content and imagery gathered for the final UI, with sources.
//   ptnglobalcorp.com (home, about, services, careers, job board, footer certificate line), scanned 2026-09-28
//   itviec.com/companies/ptn-global (benefits, company size, offices)
// Anything not found publicly stays an "Awaiting" placeholder. Stock covers are labelled as stock.
import { html, raw, icon } from './dom.js';
import { art } from './art.js';

const WIX = 'https://static.wixstatic.com/media/';

/** PTN's own photos (ptnglobalcorp.com/careers and /about). */
export const PHOTOS = {
  teamGroup: { id: '7d0992_476fa513b22b4def8d1f35b37bc50951~mv2.jpg', alt: 'The PTN Global team at a company team-building day', w: 3000, h: 1941 },
  teamLunch: { id: '7d0992_079dbb934bb24f0d87c1cbb82478adfe~mv2.jpg', alt: 'PTN engineers sharing lunch at a team-building day', w: 6000, h: 4000 },
  duoMedals: { id: '7d0992_86feb1f9acd84680870b0574a92d4ec8~mv2.jpg', alt: 'Two PTN teammates with their team-building medals', w: 6000, h: 4000 },
  duoWomen: { id: '7d0992_18a514e00a1f4912b09ce8d6060146de~mv2.jpg', alt: 'Two PTN teammates at the team-building lunch', w: 6000, h: 4000 },
  duoShirts: { id: '7d0992_fddc09328a8448bca047f6fe459ee211~mv2.jpg', alt: 'PTN teammates in company shirts', w: 6000, h: 4000 },
  squad: { id: '7d0992_ec426d8b40084fa59065afa867dde274~mv2.jpg', alt: 'A PTN squad celebrating together', w: 6000, h: 4000 },
};
/** Official PTN GLOBAL logo (SVG supplied by PTN) and its globe mark on its own. */
export const LOGO = 'assets/ptn-logo.svg';
export const LOGO_MARK = 'assets/ptn-mark.svg';

const PHOTO_ART = {
  teamGroup: { variant: 'mesh', tone: 'night', tag: 'Team photo, whole company' },
  teamLunch: { variant: 'wave', tone: 'deep', tag: 'Team photo, candid' },
  duoMedals: { variant: 'orbit', tone: 'paper', tag: 'Team photo, people' },
  duoWomen: { variant: 'dots', tone: 'deep', tag: 'Team photo, people' },
  duoShirts: { variant: 'circuit', tone: 'night', tag: 'Team photo, office' },
  squad: { variant: 'horizon', tone: 'night', tag: 'Team photo, event' },
};

/** Photo slot. Renders generated placeholder art; PHOTOS keeps the real PTN sources for the build. */
export function photo(key, { w = 1200, h = 800, cls = '' } = {}) {
  const a = PHOTO_ART[key];
  return art(`${key}-${w}x${h}`, { ...a, w, h, cls: `photo ${cls}` });
}

/** Cover slot for posts and cases: generated art, tagged with what belongs there. */
export function stock(seed, alt, { ratio = '16/10', label = 'Cover image' } = {}) {
  const [w, h] = ratio.split('/').map(Number);
  return html`<figure class="stock">${art(seed, { w: w * 100, h: h * 100, tag: label })}</figure>`;
}

/** Initials tile for people without a supplied portrait. */
export const monogram = (name, { ratio = '4/5' } = {}) => {
  const ini = name.split(/\s+/).map((w) => w[0]).slice(0, 2).join('');
  return html`<figure class="mono" style="aspect-ratio:${ratio}"><span aria-hidden="true">${ini}</span><figcaption>Portrait awaiting</figcaption></figure>`;
};

/* ---------- proof ---------- */

export const CLIENTS = [
  { name: 'Member Benefits Australia', logo: `${WIX}7d0992_40774f2fd46249ec9ca51f5b6af820f4~mv2.png`, source: 'ptnglobalcorp.com' },
];

export const TESTIMONIAL = {
  quote: 'PTN has become an integral part of our IT delivery team. They have been able to provide wide ranging skills and have enabled us to meet tight timelines.',
  name: 'Kyle Mathers', role: 'Chief Technology Officer', company: 'Member Benefits Australia', country: 'Australia', source: 'ptnglobalcorp.com/about',
};

export const CERTS = [
  {
    std: 'ISO/IEC 27001:2022', title: 'Information Security Management', issuer: 'Certification Partner Global (CPG)', no: 'ISMS/20/R84/1419',
    logo: `${WIX}67e39e_4dc4d451a5fb49e49002dd4be6fce7f7~mv2.jpg`, status: 'verified',
    url: 'https://enquiries.cpg.global/web/enquiry.nsf/enquiry.xsp?Open&id=ISMS/20/R84/1419',
    // CPG register, checked 2026-09-29: Registered/Certified, JASANZ accredited, certified 10 Oct 2024, expires 10 Oct 2027.
    valid: 'Valid to Oct 2027',
    note: 'CPG register: Registered/Certified, JASANZ accredited, 10 Oct 2024 to 10 Oct 2027. The Confluence docs say ISO 27001:2013; the register shows the 2022 revision.',
    scope: ['Confidentiality', 'Integrity', 'Availability'],
  },
  {
    std: 'ISO 9001:2015', title: 'Quality Management System', issuer: 'Certifier awaiting', no: 'Certificate number awaiting', status: 'docs',
    note: 'Listed in the Confluence docs; not yet shown on the live site. Please confirm certifier and number.',
    scope: ['Consistent delivery', 'Early risk detection', 'Structured procedures'],
  },
  // Demo cards: layout samples only, not PTN claims. Replace with real certificates or awards, or remove.
  {
    seal: ['CMMI', 'Level 3'], std: 'CMMI-DEV · Maturity Level 3', title: 'Capability Maturity Model Integration', issuer: 'CMMI Institute (sample)', no: 'Appraisal ID (sample)', status: 'demo',
    note: 'Demo content to show the layout. Not a PTN certification.',
    scope: ['Defined processes', 'Measured delivery', 'Continuous improvement'],
  },
  {
    seal: ['GPTW', '2026'], std: 'Workplace certification · Vietnam', title: 'Great Place To Work Certified', issuer: 'Great Place To Work (sample)', no: 'Certification year (sample)', status: 'demo',
    note: 'Demo content to show the layout. Not a PTN award.',
    scope: ['Trust Index survey', 'Culture audit', 'Employee experience'],
  },
];

/* ---------- careers ---------- */

/** ptnglobalcorp.com/job-board, scanned 2026-09-28. Level only where the title states it. */
export const JOBS = [
  { t: 'UI UX Designer', job: 'UX UI Designer', level: '', loc: 'Can Tho', date: '11 Aug 2026', summary: 'An experienced UI/UX designer who brings creativity and enthusiasm to the design team, creating intuitive and engaging experiences for web and mobile applications.' },
  { t: 'Marketing Officer', job: 'Other', level: '', loc: 'Can Tho', date: '9 Jul 2026', summary: 'Strengthen the brand and support growth: marketing content, digital channels, events, employer branding and business development.' },
  { t: 'Junior AI Engineer', job: 'Other', level: 'Junior', loc: 'Can Tho', date: '9 Mar 2026', summary: 'Explore cutting-edge AI technologies and build real-world solutions with a builder-minded AI team that values creativity, curiosity and collaboration.' },
  { t: 'Technical Business Analyst', job: 'Business Analyst', level: '', loc: 'Can Tho', date: '20 May 2025', summary: 'The bridge between the technical delivery team and English-speaking stakeholders in Australia, New Zealand, the UK and the US.' },
  { t: 'Mid level / Senior QA Engineer, Manual', job: 'Tester', level: 'Senior', loc: 'Can Tho', date: '25 Mar 2025', summary: 'An experienced QA engineer for an English-speaking, collaborative and creative environment.' },
  { t: 'QA Engineer', job: 'Tester', level: '', loc: 'Can Tho', date: '2 Mar 2025', summary: 'An experienced QA engineer for an English-speaking, collaborative and creative environment.' },
  { t: 'Mid level / Senior Fullstack Software Engineer', job: 'Full Stack Developers', level: 'Senior', loc: 'Can Tho', date: '2 Mar 2025', summary: 'Innovative, talented engineers who create well-performing software solutions in a collaborative and dynamic team.' },
  { t: 'On the Job Training Program', job: 'Other', level: 'OJT', loc: 'Can Tho', date: 'Rolling intake', summary: 'Hands-on training on real projects for customers in Australia, New Zealand and other English-speaking countries.' },
];

/** itviec.com/companies/ptn-global */
export const PERKS = [
  ['coins', '13th-month payment'], ['calendar-check', '12 annual leave days a year'], ['clock', '40 hours a week, Monday to Friday, no overtime'],
  ['certificate', 'English and technical certification programs'], ['airplane-tilt', 'Onsite assignments in Australia and New Zealand'],
  ['desktop', 'Laptop or PC with a 27-inch monitor'], ['heart', 'Full benefits under Vietnamese law'], ['confetti', 'Team building and bonding activities'],
];

/** ptnglobalcorp.com/careers */
export const PRINCIPLES = ['Results driven', 'Reward based on merit', 'Be a problem solver, not a finger pointer', 'Treat mistakes as building blocks toward our future success', 'Work and life balance'];

/* ---------- offices ---------- */

export const OFFICES = [
  { city: 'Melbourne, Australia', role: 'Main office', addr: 'Level 5, 335 Flinders Lane, Melbourne VIC 3000', map: [144.9633, -37.8172], source: 'ptnglobalcorp.com' },
  { city: 'Can Tho, Vietnam', role: 'Development center', addr: '13 Tran Binh Trong Street, Thoi Binh Ward, Ninh Kieu District, Can Tho City 90000', map: [105.7826, 10.0371], note: 'Matches the certified site on the CPG register (No 13 Tran Binh Trong, Ninh Kieu, Can Tho). itviec lists 3rd floor, 81 Nguyen Hien, KDC 91B An Khanh; please confirm which is current.' },
  { city: 'Ho Chi Minh City, Vietnam', role: 'Office', addr: 'Street address awaiting', map: null, note: 'Listed on itviec and the careers page; not in the Confluence docs.' },
  { city: 'New Zealand', role: 'Office', addr: 'Address awaiting confirmation', map: null, note: 'Request open in the Company doc.' },
];

export const osm = ([lon, lat], zoom = 0.006) =>
  `https://www.openstreetmap.org/export/embed.html?bbox=${lon - zoom},${lat - zoom / 1.6},${lon + zoom},${lat + zoom / 1.6}&layer=mapnik&marker=${lat},${lon}`;

/* ---------- editorial ---------- */

/** Suggested topics for launch content. Clearly labelled; replace with real CMS entries. */
export const TOPICS = [
  ['Blog', 'Why Can Tho: building an offshore team beyond Ho Chi Minh City'],
  ['News', 'PTN Global certified to ISO/IEC 27001:2022'],
  ['Events', 'Inside our team-building day'],
  ['Blog', 'Dedicated team or staff augmentation? A practical guide'],
  ['Blog', 'Onboarding an offshore team in two weeks'],
  ['News', 'Opening our On the Job Training intake'],
  ['Blog', 'How we run QA for Australian clients across time zones'],
  ['Events', 'Meet PTN at a Melbourne tech meetup'],
  ['Blog', 'AI-augmented delivery: where it helps and where it does not'],
  ['Blog', 'Security by default: what ISO 27001 changes for your project'],
  ['News', 'New roles open in our Can Tho development center'],
  ['Blog', 'From legacy to cloud: a migration checklist'],
];
export const WHITEPAPERS = [
  'The offshore delivery playbook for Australian companies', 'Choosing an engagement model: cost, control and risk',
  'Security and compliance for distributed teams', 'Building AI features with a small team', 'Legacy modernisation without the big bang', 'Measuring a dedicated team’s performance',
];

/** Suggested newsletter issues (sample titles until the first real issues exist). */
export const NEWSLETTERS = [
  'PTN Monthly, September 2026: new roles, ISO audit and a QA deep dive', 'PTN Monthly, August 2026: our OJT intake and AI tooling notes',
  'PTN Monthly, July 2026: team-building day and client wins', 'PTN Quarterly: what we shipped for Australian and NZ clients in Q2',
];

/* ---------- tech logos ---------- */

// Simple Icons slugs; anything that fails to load falls back to a monogram tile.
const SLUG = {
  'Microsoft .NET': 'dotnet', '.NET': 'dotnet', 'Node.js': 'nodedotjs', 'CSS3': 'css', 'HTML5': 'html5', 'JavaScript': 'javascript', 'Ember': 'emberdotjs',
  'Vue.js': 'vuedotjs', 'React': 'react', 'React Native': 'react', 'OpenAI': 'openai', 'Claude': 'claude', 'Gemini': 'googlegemini', 'Grok': 'x',
  'DeepSeek': 'deepseek', 'LangChain': 'langchain', 'TensorFlow': 'tensorflow', 'n8n': 'n8n', 'Power Automate': 'powerautomate', 'iOS': 'ios', 'PWA': 'pwa',
  'AWS': 'amazonwebservices', 'Azure': 'microsoftazure', 'DigitalOcean': 'digitalocean', 'Google Developer Tools': 'google', 'Rackspace': 'rackspace',
  'Amazon DocumentDB': 'amazondocumentdb', 'Amazon DynamoDB': 'amazondynamodb', 'Cassandra': 'apachecassandra', 'Amazon Redshift': 'amazonredshift',
  'Apache Hive': 'apachehive', 'Apache Kafka': 'apachekafka', 'Apache Spark': 'apachespark', 'Hadoop': 'apachehadoop', 'MongoDB': 'mongodb',
  'Azure Cosmos DB': 'azurecosmosdb', 'Google Cloud Datastore': 'googlecloud', 'OpenShift': 'redhatopenshift', 'SaltStack': 'saltproject', 'Mesos': 'apache',
  'Azure DevOps': 'azuredevops', 'Travis CI': 'travisci', 'GitHub': 'github', 'Elasticsearch': 'elasticsearch', 'Apache JMeter': 'apachejmeter',
  'Burp Suite': 'burpsuite', 'Cloudflare': 'cloudflare', 'Metasploit': 'metasploit', 'Kotlin': 'kotlin', 'Swift': 'swift', 'Java': 'openjdk',
  'Kafka': 'apachekafka', 'Spark': 'apachespark', 'Airflow': 'apacheairflow', 'Flink': 'apacheflink', 'GraphQL APIs': 'graphql', 'GraphQL': 'graphql',
  'Hugging Face Transformers': 'huggingface', 'JWT': 'jsonwebtokens', 'BigQuery': 'googlebigquery', 'Google Vertex AI': 'googlecloud', 'Superset': 'apachesuperset',
  'TypeScript Backend': 'typescript', 'LangChai': 'langchain', 'JavaScript (ES6+)': 'javascript', 'Script (ES6+)': 'javascript', 'Objective-C': 'apple', 'gRPC': 'grpc',
  'MS SQL Server': 'microsoftsqlserver', 'Azure DevOps': 'azuredevops', 'Power BI': 'powerbi', 'dbt': 'dbt', 'Azure OpenAI': 'openai',
  'MySQL': 'mysql', 'PostgreSQL': 'postgresql', 'Google Cloud': 'googlecloud', 'Microsoft SQL Server': 'microsoftsqlserver', 'Oracle': 'oracle', 'SQLite': 'sqlite', 'MariaDB': 'mariadb',
};
/** Checked against cdn.simpleicons.org on 2026-09-28: no icon (often trademark removals such as AWS, Azure, OpenAI, Oracle). Rendered as monograms; supply official logos from each brand kit. */
const NO_LOGO = new Set(["API Gateways", "AWS", "AWS (EMR, Glue)", "AWS Bedrock", "AWS Developer Tools", "AWS SageMaker", "Acunetix", "Amazon DocumentDB", "Amazon DynamoDB", "Amazon ElastiCache", "Amazon Redshift", "Apache ZooKeeper", "Azure", "Azure AI Studio", "Azure Blob Storage", "Azure Cosmos DB", "Azure Data Lake", "Azure DevOps", "Azure ML", "Azure OpenAI", "Azure Synapse", "CUIT", "Cohere", "Data Encryption", "Dell Boomi", "FAISS", "FMBT", "HP Quick Test Professional", "Identity & Access Management", "LlamaIndex", "MS SQL Server", "Masscan", "Microsoft SQL Server", "MuleSoft", "Nagios", "Nessus", "Nmap", "OAuth 2.0", "OpenAI", "Oracle", "Pinecone", "Power Automate", "Power BI", "REST", "Rackspace", "Ranorex", "Redshift", "Role-Based Access Control", "SOAP", "SQL", "SSL", "Siege", "Stability AI", "TLS", "Tableau", "TestComplete", "TestStack White", "Unified Functional Testing", "Weaviate", "XCTest", "Xamarin", "Zabbix", "dbt", "gRPC"]);

/** Split a doc tech list on '/' or ',' but never inside parentheses: "AWS (EMR, Glue)" stays whole. */
export function splitTech(text) {
  const out = []; let depth = 0, cur = '';
  for (const ch of String(text)) {
    if (ch === '(') depth++;
    if (ch === ')') depth = Math.max(0, depth - 1);
    if ((ch === '/' || ch === ',') && depth === 0) { out.push(cur); cur = ''; } else cur += ch;
  }
  out.push(cur);
  return out.map((x) => x.replace(/^[\\\s]+|\s+$/g, '')).filter(Boolean);
}

const guess = (n) => n.toLowerCase().replace(/\+/g, 'plus').replace(/\./g, 'dot').replace(/[^a-z0-9]/g, '');

export function techTile(name) {
  const slug = SLUG[name] || guess(name);
  const ini = name.replace(/^(Microsoft|Apache|Amazon|Azure|Google)\s+/, '').replace(/[^A-Za-z0-9 ]/g, '').split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase();
  if (NO_LOGO.has(name)) return html`<li class="tile"><span class="tile-logo is-mono" data-ini="${ini}"></span><span class="tile-name">${name}</span></li>`;
  return html`<li class="tile"><span class="tile-logo" data-ini="${ini}"><img src="https://cdn.simpleicons.org/${slug}/1F2A30" alt="" loading="lazy" onerror="this.parentElement.classList.add('is-mono');this.remove()"></span><span class="tile-name">${name}</span></li>`;
}

/** Groove-style category list includes Relational Databases; the PTN doc does not. Offered as a flagged suggestion. */
export const EXTRA_TECH = { name: 'Relational Databases', text: 'Microsoft SQL Server / PostgreSQL / MySQL / Oracle / MariaDB / SQLite', suggested: true };

export const sourceTag = (label) => html`<span class="src-tag">${icon('link-simple')}${label}</span>`;
