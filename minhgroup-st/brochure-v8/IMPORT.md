# Brochure V8

Imported from `leocrist/site`, branch `new_site_brochure`, commit
`150457a44da257ffe0c0dbb78dedd161ac099cdb`.

The ten pages and their assets use the original source design. Fonts are
provided by the existing `../brochure-v3/fonts` and `../brochure-v5/fonts`.

The viewer includes a return link to the website. The original PDF download
pointed to a file absent from the source branch; use `print.html` and the
browser's Print / Save as PDF action instead.

To build the website and brochure together, run from the repository root:

```powershell
python minhgroup-st/tools/preview.py "$env:TEMP/codex-mtgroup-website-preview"
python -m http.server 5180 --bind 127.0.0.1 --directory "$env:TEMP/codex-mtgroup-website-preview"
```
