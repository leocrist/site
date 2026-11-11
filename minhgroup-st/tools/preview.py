"""Build the standalone website, including the imported V8 brochure.

Usage: python minhgroup-st/tools/preview.py <output-directory>
Then: python -m http.server 5180 --bind 127.0.0.1 --directory <output-directory>
"""
from pathlib import Path
import hashlib
import re
import shutil
import subprocess
import sys

source = Path(__file__).resolve().parent.parent
output = Path(sys.argv[1]).resolve()
if output == source or source.is_relative_to(output):
    raise SystemExit("Choose a separate preview output directory.")
subprocess.run(
    [sys.executable, str(source / "tools/site_gen.py"), str(output), "--preview", "assets"],
    check=True,
)
for name in ("assets", "brochure-v8", "brochure-vfinal"):
    shutil.copytree(source / name, output / name, dirs_exist_ok=True)
for version in ("brochure-v3", "brochure-v5"):
    shutil.copytree(source / version / "fonts", output / version / "fonts", dirs_exist_ok=True)
for page in output.glob("*.html"):
    page.write_text(page.read_text(encoding="utf-8").replace(".dc.html", ".html"), encoding="utf-8")
shutil.copyfile(output / "Main.html", output / "index.html")
# Every embedded page and PDF gets a version derived from its contents. A fresh
# viewer must not reuse an older cached iframe after brochure edits.
viewer = output / "brochure-vfinal/brochure-vfinal.html"
markup = viewer.read_text(encoding="utf-8")
def versioned(match):
    name = match.group(2)
    digest = hashlib.sha256((viewer.parent / name).read_bytes()).hexdigest()[:12]
    return f'{match.group(1)}{name}?v={digest}{match.group(3)}'
markup = re.sub(r'(src=")(page-\d{2}\.html)(?:\?[^\"]*)?(")', versioned, markup)
markup = re.sub(r'(href=")(MinhGroupST-VFinal\.pdf)(?:\?[^\"]*)?(")', versioned, markup)
viewer.write_text(markup, encoding="utf-8")
print(f"Preview ready: {output}")
