# PTN Global v3: clean build of the "All New Website" wireframe

v3 follows the wireframe's sitemap and section order (repo root: `index.html`, `js/`, `data/docs.json`). It takes copy and data from the wireframe (`docs.json`, `js/assets.js`, `js/engagement.js`) plus the earlier dev site, and rebuilds everything as clean static pages.

## Run

```bash
node v3/src/build.mjs
```

```bash
cd v3 && python3 -m http.server 5192
```

- `src/build.mjs`: generator (header, footer and navigation defined once)
- `src/vendor/*.mjs`: copies of the wireframe data modules (assets, engagement models)
- `src/data/pages.json`, `src/data/services.json`: copy extracted from the rendered wireframe templates
- `src/data/map.json`: dot-matrix map generated from Natural Earth
- `css/main.css`, `js/main.js`

## Sitemap (34 pages)

| Wireframe template | v3 page(s) |
|---|---|
| Home | `index.html` |
| Company | `company.html` |
| Services | `services.html` (catalogue of 22 services, 9 engagement models, roles, quality, tech, industries) |
| Service detail | `service-<slug>.html` × 10 |
| Industries | `industries.html` |
| Technologies | `technologies.html` |
| Case studies / detail | `case-studies.html`, `case-<id>.html` × 4 |
| Careers / detail | `careers.html`, `career-<slug>.html` × 8 (with application form) |
| Insights / blog / whitepaper | `insights.html`, `blog.html`, `whitepaper.html` |
| Contact | `contact.html` (multi-step enquiry) |
| (new) | `legal.html` placeholder |

## What "clean" means here

- The identity comes from `ptn-theme.css`: tinted paper, ink, PTN blue, a serif display face and a mono eyebrow with a blue square mark. All colours are OKLCH. Sentient and Satoshi are swapped for Newsreader and Be Vietnam Pro (Google Fonts, so they work in artifacts).
- Removed wireframe-only material: annotation pins, the viewer bar, grid backdrops, particle canvases, the globe, placeholder art and "awaiting" cards.
- Hairline ruled lists and indexes instead of card grids. Explorer tabs for service categories, engagement models and industries. At most one dark band per page.
- No fabricated content. Placeholder certificates (CMMI, GPTW), placeholder testimonials and empty case cards are dropped. Unconfirmed figures carry a dotted "to confirm" marker. Blog and whitepaper bodies are marked as drafts.

## To confirm before launch

- **Contact details:** the wireframe (ptnglobalcorp.com) gives +61 414 734 277, enquiry@ptnglobalcorp.com and Level 5, 335 Flinders Lane. The earlier dev site used hello@ and 101 Bourke Street. v3 uses the wireframe values.
- **Figures:** 150+ employees (itviec says 51–150), "90+ satisfaction" (no unit or source), "3+ offices" (the HCMC and NZ addresses are awaiting).
- **Certificates:** ISO 9001 is listed in the docs, but no certificate number has been supplied, so it is not shown. The "Why PTN" copy still mentions ISO 9001:2015 and ISO 27001:2013, while the register shows 27001:2022.
- **Client names:** only Member Benefits Australia is sourced in the wireframe. The other six names come from the dev site.
- **Engagement models:** team shares and 1–5 ratings are the wireframe's proposals and are labelled indicative on the page.
- **Process step 2 on Company:** the docs repeat the title, so v3 uses proposed copy.
- **Forms:** submission is simulated and says so. They need wiring to the CRM and the HR inbox.

## QA (2026-11-06, Chromium via Playwright)

| Check | Result |
|---|---|
| axe-core 4.10.2 WCAG A/AA, 34 pages at 1440 and 320 px | 0 violations |
| SC 1.4.10 reflow at 320 px | 0 of 34 pages overflow |
| Internal links and anchors | 41 targets, none broken, no `href="#"` |
| Mega menu keyboard (Enter, Tab, Esc returns focus) | PASS |
| Vertical tabs (arrow keys) and `?cat=` deep links | PASS |
| Catalogue, engagement, careers and insights filters | PASS |
| Multi-step enquiry: per-step validation, review, simulated submit | PASS |
| Job application validation | PASS |
| Mobile menu and targets of at least 24 px | PASS |
| Screen reader, 200% text resize, real-user testing | NOT TESTED |

A bug found and fixed during QA: validating on blur removed the error message, which shifted the layout under the pointer so the next click missed. Errors now appear when Continue or Submit is pressed and clear as you type.
