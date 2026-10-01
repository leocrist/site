# site

Navigable wireframe of the new **PTN Global** website, built on the Zero DS tokens.

## Run locally

It is a static site (plain ES modules, no build step). Serve the folder and open it:

```bash
python3 -m http.server 5180
```

Then visit <http://localhost:5180/>. The site opens straight on Home; use the **Template** picker (bottom right) to jump between pages and **Notes** to show the content annotations.

## Structure

- `index.html` – entry point
- `js/` – router, page templates (`pages.js`), section kit (`sections.js`), behaviours, globe / flow / drift canvases, office map, illustrations
- `wireframe.css`, `ptn-theme.css` – wireframe styles and PTN theme on top of the Zero DS tokens
- `zero-ds/` – Zero DS base styles and tokens
- `data/docs.json` – page copy parsed from the "All New Website" layout docs (`scripts/parse-docs.mjs`)
- `assets/` – PTN logo and mark
- `site.zip` – the original layout documents
