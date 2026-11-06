# PTN Global website v2: "Workspace clarity"

A high-fidelity, responsive rebuild of the PTN Global site. It is based on the current site map and content of `dev.ptnglobalcorp.com/html-demo`, and its visual principles are adapted from clickup.com.

## Run

```bash
node v2/src/build.mjs
```

```bash
cd v2 && python3 -m http.server 5190
```

Edit content and partials in `src/build.mjs` (one place for the header, footer and nav). Styles are in `css/site.css` and behaviours in `js/site.js`. The generated `*.html` files are committed so the folder can be hosted as-is.

## Site map (10 pages)

| Page | File | Change from the current site |
|---|---|---|
| Home | `index.html` | Product-style workspace hero, hairline capability grid, interactive 6-stage model |
| Services | `services.html` | Anchors `#ai #llm #software #emerging #engage` back the nav deep links |
| AI Transformation | `ai-transformation.html` | The 4 offering CTAs now go to Contact with the topic pre-filled (no more `#` links) |
| AI Engineering | `ai-engineering.html` | Maturity matrix uses accessible tabs |
| Industries | `industries.html` | Now in the main nav. Filter + architecture matcher. Final CTA goes to Contact |
| Case Studies | `case-studies.html` | Deep-linkable tabs. Honest "ask for a reference" link for sectors without a story |
| Company | `company.html` | Who we are, pillars, values, ISO governance |
| Careers | `careers.html` | Working search and filters, inline expandable job details (no modal) |
| Contact | `contact.html` | Real labels (no fake-data placeholders), validation, `?focus=` prefill |
| Legal | `legal.html` | **Placeholder**: Privacy and Terms content to be supplied by legal |

Navigation: Services (mega menu) · Industries · Case Studies · Company (menu) · Careers · Contact + primary CTA. On mobile, a full-screen menu lists every page (the old tab bar left out 4 pages).

## Design direction

ClickUp principles adapted, not copied: a light canvas, tight-tracked display type, ink-black pill CTAs, a product-UI frame as the hero visual, a mono-caps "trusted by" strip, a two-tone statement headline, a hairline tile grid, and one rounded dark chapter with a tabbed feature list. PTN's own logo and blue/green replace ClickUp's purple and pink gradients.

| Token | Value | Role |
|---|---|---|
| `--ink` | `#0b1418` | Headings, primary buttons |
| `--ink-2` | `#44535a` | Body (7.8:1) |
| `--ink-3` | `#5f6e75` | Meta (5.2:1) |
| `--paper` / `--paper-2` | `#fcfdfd` / `#f3f6f7` | Surfaces |
| `--blue` | `#008fc4` | Brand, decorative only |
| `--blue-ink` | `#00709b` | Links on light (5.4:1) |
| `--green` | `#a7bc4d` | Decorative only |
| `--night` | `#081014` | Dark chapter / CTA |
| Type | Plus Jakarta Sans 400–800 (Vietnamese glyphs), JetBrains Mono for eyebrows | |
| Radius | 8 / 14 / 22 / 36 / pill | |

## Content to confirm before launch

Values shown with a **dotted orange underline** (`.tbc`) conflict on the current site:

- Engineers: 150+ (Company) vs 120+ (Contact) vs 200+ seats
- Enterprise deployments: 120+ vs 115
- Onboarding time: < 3 / 2–4 / 2–3 weeks (v2 says "weeks, not months")
- SLA 99.98% vs 99.8% (removed from v2)

Also needed: client logo files (the trust strip uses text wordmarks), the testimonial permission, legal copy, a CRM endpoint for the contact form (submission is simulated and says so), and the source and timeframe for the impact numbers on Services.

## QA ledger (2026-11-06, Chromium via Playwright)

| ID | Requirement | Result | Status |
|---|---|---|---|
| AXE (20 runs) | axe-core 4.10.2, WCAG 2.x A/AA rule set, 10 pages × 1440 px and 320 px | 20/20 with 0 violations | PASS |
| REFLOW | SC 1.4.10: no horizontal scroll at 320 CSS px | 10/10 pages, 0 px overflow | PASS |
| CONTRAST | SC 1.4.3 / 1.4.11, computed from tokens | Text 4.87–9.84:1; large dim 3.84:1; field borders 3.2–3.4:1 | PASS |
| LINKS | All internal hrefs return 200 and anchors exist; no `href="#"` | 50 unique hrefs, 0 broken | PASS |
| KB-FLYOUT | Enter opens, Tab enters, Esc closes and returns focus | as expected | PASS |
| KB-SKIP / FOCUS | Skip link first; 2px solid focus ring | as expected | PASS |
| KB-TABS | Arrow keys move between tabs, panel follows (APG) | as expected | PASS |
| UI-MODEL / CASE / FILTER / MATCHER | Interactive sections update content and `aria-*` state | as expected | PASS |
| UI-JOBS / KB-JOB | Search, filters, empty state, reset; details open with Enter | as expected | PASS |
| FORM | Empty → 5 specific errors + focus first; invalid → suggestions; valid → status (simulated) | as expected | PASS |
| UI-MOBILE-MENU | Opens, lists 12 links, Esc closes and returns focus | as expected | PASS |
| TARGET-24 | SC 2.5.8 targets ≥ 24×24 px at 390 px | none smaller | PASS |
| TEXT-SPACING | SC 1.4.12 overrides on 3 pages | no clipping | PASS |
| Screen reader | NVDA / VoiceOver | — | NOT TESTED |
| 200% text resize | SC 1.4.4, separate from reflow | — | NOT TESTED |
| Real users / performance | Task success, satisfaction, Core Web Vitals | — | NOT TESTED |

These are selected WCAG 2.2 AA checks, not a full conformance claim.
