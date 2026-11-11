# Turns rendered brochure pages (saved DOM) into Design-canvas artboards.
# usage: python3 brochure_to_canvas.py <dump dir> <out project dir> [--preview <repo root>]
# The dump dir holds <version>-<nn>.html files: each page's DOM after its scripts ran.
import re, sys, os, html
DUMP, OUT = sys.argv[1], sys.argv[2]
PREVIEW = sys.argv[4] if len(sys.argv) > 4 else None
W, H = 816, 1145   # 216 x 303 mm at 96dpi: the page with its 3 mm bleed
BLOB = {  # source path fragment -> (canvas blob, repo file)
 'assets/logo/mgst-mark.svg': ('e9ba8f3f1f95b15f2a5b9f2194af290b', 'assets/logo/mgst-mark.svg'),
 'assets/logo/mgst-logo.svg': ('1179bcaff638808cf9799ca4e008639b', 'assets/logo/mgst-logo.svg'),
 'assets/photos/mg-a.jpg': ('45860b7d149a390970149582f9b89451', 'assets/photos/mg-a.jpg'),
 'assets/photos/mg-f.jpg': ('35c914cb179315c1ed8aadf2038fe9d7', 'assets/photos/mg-f.jpg'),
 'assets/photos/mg-g.jpg': ('79c011ce9bdbe1ced6739433e7fdd9c6', 'assets/photos/mg-g.jpg'),
 'assets/photos/mg-h.jpg': ('c4dc9283c7a0db1adf5c77c4978be8b0', 'assets/photos/mg-h.jpg'),
 'assets/photos/mg-k.jpg': ('7b27c5ec9692f7cb740afbd91ad776cc', 'assets/photos/mg-k.jpg'),
 'assets/logos/pvi-w.png': ('5e81120a5d760314400d7c3cd78d07cc', 'assets/logos/pvi-w.png'),
 'assets/logos/pti-w.png': ('dbb91b3eb0d7adccc589804a4e0466e3', 'assets/logos/pti-w.png'),
}
for name, bid in {
 'awards-illustration': 'b71f9b4a2391feab61f6721b22638331', 'donation-illustration': 'ab9e3d654bbd38703d6dd3b155a9f8eb',
 'office-illustration': '9ad22e47541984f1240ab6bf2ea06b80', 'tree-illustration': '7b3dc432ef24ed1df511d36ce95c16d1',
 'website-qr': '5f7ae45b6f4aeb4a2c186577f848391c',
 'photos/community-lighting': '7a246a7250861e41c34c63aadca8e8b4', 'photos/community-support': '6b0e3b92f0acb16d09916496d8390021',
 'photos/digital-launch': '802aa6a93dc939fe375d983842a80f4d', 'photos/digital-team': '68f92c1514815b59ad047c02e71015d2',
 'photos/dinh-hoang-cong': '87e90bd29615fee9e8ed6fa025e29186', 'photos/dinh-hoang-minh': '69101fd81ec6b47b721f158d0b5b0e60',
 'photos/duong-minh-truong': '879f46d0a35368eb77f9ea05cd279427', 'photos/field-consultation': '563d895edec49aacfbe5cdecc4193d28',
 'photos/lu-hong-huynh': '217c31457fcc9643807e085950badde7', 'photos/nguyen-thi-hong-hue': '49b28651779d9ef77abb7c48267377fc',
 'photos/partner-meeting': 'e76541b87ff52e57955f9dcdc891f84a', 'photos/payment-support': '26a36c7696e6a180356dfe1a5a6cad46',
 'photos/phan-huu-linh': 'ce027cdced9e8889417e02405b265ef6', 'photos/social-security': '14c799433cfe9226eba83748d6fa61f7',
 'photos/tran-thi-lam-thy': 'e9bbda8f701a041f00b39b343a8d9664',
 'documents/thank-you-thanh-thoi-an': 'abe80459792a183f33b432737f6cd567', 'documents/thank-you-vinh-hoa': '665a34e27d49aa6fc4b75bc4a8df8137'}.items():
    base = name.split('/')[-1]
    ext = 'png' if base == 'website-qr' else 'jpg'
    BLOB['assets/' + name + '.'] = (bid, f'assets/canvas/bro-{base}.{ext}')
TITLES = {'v8': ('ProfileV8', 'Brochure V8'), 'vfinal': ('ProfileVFinal', 'Brochure VFinal')}
FONTS = ('<link rel="preconnect" href="https://fonts.googleapis.com">\n<link rel="stylesheet" href="https://fonts.googleapis.com/css2?'
         'family=Inter:wght@300;400;500;600;700&amp;family=Be+Vietnam+Pro:wght@300;400;500;600;700&amp;family=Plus+Jakarta+Sans:wght@500;600;700;800&amp;display=swap">')
missing = set()

def asset(m):
    attr, url = m.group(1), m.group(2)
    if url.startswith(('http', 'tel:', 'mailto:', '#', '/_blob/')):
        return m.group(0)
    for frag, (bid, rel) in BLOB.items():
        if frag in url:
            return f'{attr}="{PREVIEW + "/" + rel if PREVIEW else "/_blob/" + bid}"'
    missing.add(url)
    return m.group(0)

def fonts(t):
    t = re.sub(r"(?<![\w'\- ])BVP(?![\w'])", "'Be Vietnam Pro'", t)
    return re.sub(r"(?<![\w'\- ])Jakarta(?![\w'])", "'Plus Jakarta Sans'", t)

def convert(path):
    s = open(path, encoding='utf8').read()
    title = html.unescape(re.search(r'<title>(.*?)</title>', s, re.S).group(1)).split(' · ')[-1].strip()
    css = '\n'.join(re.findall(r'<style[^>]*>(.*?)</style>', s, re.S))
    body = re.search(r'<body[^>]*>(.*)</body>', s, re.S).group(1)
    body = re.sub(r'<script\b.*?</script>|<style\b.*?</style>|<link\b[^>]*>', '', body, flags=re.S)
    css = re.sub(r'@font-face\s*\{[^}]*\}|@page\s*\{[^}]*\}', '', css)
    css = fonts(css) + '\nhtml,body{margin:0;background:transparent}.page,.sheet{margin:0;box-shadow:none}\n'
    # The canvas drops inline !important declarations. Move each one into a generated
    # class at the end of the stylesheet so it still beats the page's own !important rules.
    extra, count = [], [0]
    def tag(m):
        t = m.group(0)
        st = re.search(r'\bstyle="([^"]*)"', t)
        if not st:
            return t
        keep, imp = [], []
        for d in st.group(1).split(';'):
            d = d.strip()
            if not d:
                continue
            (imp if '!important' in d else keep).append(fonts(d.replace('"', "'")))
        t = t.replace(st.group(0), 'style="' + '; '.join(keep) + '"' if keep else '', 1) if imp or keep else t
        if imp:
            count[0] += 1
            c = f'imp{count[0]}'
            extra.append('.' + '.'.join([c] * 12) + '{' + ';'.join(imp) + '}')
            cl = re.search(r'\bclass="([^"]*)"', t)
            t = t.replace(cl.group(0), f'class="{cl.group(1)} {c}"', 1) if cl else re.sub(r'^<([\w-]+)', rf'<\1 class="{c}"', t, count=1)
        return t
    body = re.sub(r'<[a-zA-Z][^<>]*\bstyle="[^"]*"[^<>]*>', tag, body)
    body = re.sub(r'font-family="([^"]*)"', lambda m: 'font-family="' + fonts(m.group(1)) + '"', body)
    css += '\n'.join(extra) + '\n'
    body = re.sub(r'\b(src|href)="([^"]*)"', asset, body)
    body = re.sub(r'href="[^"]*\.pdf"', 'href="#"', body)
    return title, css, body.strip()

boards = []
for f in sorted(os.listdir(DUMP)):
    m = re.match(r'(v8|vfinal)-(\d\d)\.html$', f)
    if not m:
        continue
    ver, n = m.groups()
    stem, label = TITLES[ver]
    title, css, body = convert(os.path.join(DUMP, f))
    name = f'{stem}-{n}'
    if PREVIEW:
        face = ''.join(f"@font-face{{font-family:'{fam}';font-weight:{w};src:url({PREVIEW}/{p})}}" for fam, w, p in [
            ('Inter', 300, 'brochure-v5/fonts/Inter-Light.ttf'), ('Inter', 400, 'brochure-v5/fonts/Inter-Regular.ttf'), ('Inter', 500, 'brochure-v5/fonts/Inter-Medium.ttf'),
            ('Inter', 600, 'brochure-v5/fonts/Inter-SemiBold.ttf'), ('Inter', 700, 'brochure-v5/fonts/Inter-Bold.ttf'),
            ('Be Vietnam Pro', 300, 'brochure-v3/fonts/BeVietnamPro-Light.ttf'), ('Be Vietnam Pro', 400, 'brochure-v3/fonts/BeVietnamPro-Regular.ttf'),
            ('Be Vietnam Pro', 500, 'brochure-v3/fonts/BeVietnamPro-Medium.ttf'), ('Be Vietnam Pro', 600, 'brochure-v3/fonts/BeVietnamPro-SemiBold.ttf'),
            ('Be Vietnam Pro', 700, 'brochure-v3/fonts/BeVietnamPro-Bold.ttf'), ('Plus Jakarta Sans', 500, 'brochure-v3/fonts/PlusJakartaSans-Medium.ttf'),
            ('Plus Jakarta Sans', 600, 'brochure-v3/fonts/PlusJakartaSans-SemiBold.ttf'), ('Plus Jakarta Sans', 700, 'brochure-v3/fonts/PlusJakartaSans-Bold.ttf'),
            ('Plus Jakarta Sans', 800, 'brochure-v3/fonts/PlusJakartaSans-ExtraBold.ttf')])
        doc = f'<!doctype html>\n<html lang="vi">\n<head>\n<meta charset="utf-8">\n<title>{name}</title>\n<style>{face}\n{css}</style>\n</head>\n<body>\n{body}\n</body>\n</html>\n'
        open(os.path.join(OUT, f'{ver}-{n}.html'), 'w', encoding='utf8').write(doc)
        continue
    doc = f'''<!doctype html>
<html lang="vi">
<head>
<meta charset="utf-8">
<title>{label} · {n} · {html.escape(title)}</title>
<script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
{FONTS}
<style>
body{{margin:0}}
{css}</style>
</helmet>
{body}
</x-dc>
<script type="text/x-dc" data-dc-script data-props='{{"$preview":{{"width":{W},"height":{H}}}}}'>
class Component extends DCLogic {{
renderVals() {{
return {{}};
}}
}}
</script>
</body>
</html>
'''
    open(os.path.join(OUT, name + '.dc.html'), 'w', encoding='utf8').write(doc)
    boards.append((name + '.dc.html', f'{label} · {n} · {title}'))
import json
print(json.dumps(boards, ensure_ascii=False))
if missing:
    print('UNMAPPED', sorted(missing), file=sys.stderr)
