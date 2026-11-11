"""Apply supplied MGST photography to VFinal, preserving the original source files."""
from pathlib import Path
from bs4 import BeautifulSoup
from PIL import Image, ImageOps
from html import escape
import json
import shutil
import subprocess

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / 'assets/photo_mgst'
OUT = ROOT / 'brochure-vfinal'
PHOTOS = OUT / 'assets/photos'
PHOTOS.mkdir(parents=True, exist_ok=True)
DOCS = OUT / 'assets/documents'
DOCS.mkdir(parents=True, exist_ok=True)
LEADERS = json.loads((ROOT / 'tools/leadership.json').read_text(encoding='utf-8'))
FRAMING = json.loads((ROOT / 'tools/photo-framing.json').read_text(encoding='utf-8'))

def select(group, prefix):
    found = [p for p in (SOURCE / group).iterdir() if p.is_file() and p.name.startswith(prefix)]
    assert len(found) == 1, (group, prefix, found)
    return found[0]

selection = {
    'digital-launch': ('CĐS', '1793936102797'),
    'digital-team': ('CĐS', '1793951269063'),
    'partner-meeting': ('CĐS', '1764683231263'),
    'field-consultation': ('NHÁNH DỰ ÁN', '1793936527961'),
    'social-security': ('NHÁNH AN SINH VÀ CHI TRẢ', '1791118688869'),
    'payment-support': ('NHÁNH AN SINH VÀ CHI TRẢ', '1793856899382'),
    'community-lighting': ('TÀI TRỢ', '1793955382782'),
    'community-support': ('TÀI TRỢ', '1793955723522'),
    'dinh-hoang-minh': ('BAN LÃNH ĐẠO', 'ĐINH HOÀNG MINH.'),
    'dinh-hoang-cong': ('BAN LÃNH ĐẠO', 'ĐINH HOÀNG CÔNG.'),
    'lu-hong-huynh': ('BAN LÃNH ĐẠO', 'LƯ HỒNG HUỲNH.'),
    'nguyen-thi-hong-hue': ('BAN LÃNH ĐẠO', 'NGUYỄN THỊ HỒNG HUỆ.'),
    'phan-huu-linh': ('BAN LÃNH ĐẠO', 'PHAN HỮU LINH.'),
    'duong-minh-truong': ('BAN LÃNH ĐẠO', 'DƯƠNG MINH TRƯỜNG.'),
    'tran-thi-lam-thy': ('BAN LÃNH ĐẠO', 'TRẦN THỊ LAM THY.'),
}

manifest = {'sourceDirectory': 'assets/photo_mgst', 'date': '2026-11-10', 'assets': [],
            'pendingRoles': [leader['name'] for leader in LEADERS if not leader['role']],
            'provisionalRoles': [leader['name'] for leader in LEADERS if leader.get('roleStatus') == 'provisional'],
            'projectPhotoScope': 'Field-consultation photos are used only for field capacity, not as evidence of vending machines, driving schools or overseas job placement.'}
paths = {}
sizes = {}
for name, (group, prefix) in selection.items():
    original = select(group, prefix)
    target = PHOTOS / (name + original.suffix.lower())
    # Copy full-resolution originals. All framing is CSS; no generative edits.
    shutil.copyfile(original, target)
    paths[name] = 'assets/photos/' + target.name
    with Image.open(original) as image:
        dimensions = list(ImageOps.exif_transpose(image).size)
    sizes[name] = dimensions
    manifest['assets'].append({'name': name, 'source': original.relative_to(SOURCE).as_posix(),
                               'output': target.relative_to(OUT).as_posix(), 'size': dimensions})

poppler = Path.home() / '.cache/codex-runtimes/codex-primary-runtime/dependencies/native/poppler/Library/bin/pdftoppm.exe'
for name, filename, caption in [
    ('thank-you-thanh-thoi-an', 'THƯ CẢM ƠN (4).pdf', 'UBND xã Thạnh Thới An · 10/12/2025'),
    ('thank-you-vinh-hoa', 'THƯ CẢM ƠN 1.pdf', 'UBND xã Vĩnh Hoà · 15/01/2026'),
]:
    original = SOURCE / 'THƯ CẢM ƠN' / filename
    pdf = DOCS / (name + '.pdf')
    shutil.copyfile(original, pdf)
    preview = DOCS / name
    subprocess.run([str(poppler), '-f', '1', '-singlefile', '-scale-to', '1600', '-png', str(original), str(preview)], check=True)
    manifest['assets'].append({'name': name, 'source': original.relative_to(SOURCE).as_posix(),
                               'output': pdf.relative_to(OUT).as_posix(), 'caption': caption,
                               'preview': preview.with_suffix('.png').relative_to(OUT).as_posix()})

def html(element, markup):
    assert element is not None
    element.clear()
    element.extend(BeautifulSoup(markup, 'html.parser').contents)

def text(element, value):
    assert element is not None
    element.clear()
    element.append(value)

def framed_photo(name, alt, frame_width, frame_height, framing_id, extra_class=''):
    """Project a reviewed source region into a viewport without stretching pixels."""
    source_width, source_height = sizes[name]
    x, y, width, height = FRAMING['frames'][framing_id]['region']
    center_x, center_y = (x + width / 2) * source_width, (y + height / 2) * source_height
    crop_width = width * source_width
    crop_height = crop_width * frame_height / frame_width
    if crop_height > source_height:
        crop_height = source_height
        crop_width = crop_height * frame_width / frame_height
    left = max(0, min(source_width - crop_width, center_x - crop_width / 2))
    top = max(0, min(source_height - crop_height, center_y - crop_height / 2))
    region = [round(v, 3) for v in (left, top, crop_width, crop_height)]
    manifest.setdefault('framing', []).append({'id': framing_id, 'photo': name,
        'frameMm': [frame_width, frame_height], 'sourceRegionPx': region,
        'protect': FRAMING['frames'][framing_id]['protect']})
    image_style = f'width:{source_width / crop_width * 100:.6f}%;left:{-left / crop_width * 100:.6f}%;top:{-top / crop_height * 100:.6f}%;'
    return f'<span class="mgst-crop {extra_class}" data-framing-id="{framing_id}" data-source-region="{",".join(map(str,region))}" style="aspect-ratio:{frame_width}/{frame_height}"><img class="mgst-framed-image" src="{paths[name]}" alt="{escape(alt)}" style="{image_style}"></span>'

def replace_photo(element, name, alt, frame_width, frame_height, framing_id, extra_class=''):
    assert element is not None
    target = element.parent if 'mgst-crop' in element.parent.get('class', []) else element
    target.replace_with(BeautifulSoup(framed_photo(name, alt, frame_width, frame_height, framing_id, extra_class), 'html.parser'))

CSS = r'''
:root{--mgst-photo-bg:#f5f5f5;--mgst-caption:#5c5c5c;--mgst-photo-gap:3mm}
.page-section-title{font-family:Inter,sans-serif!important;font-size:7pt!important;line-height:1.35!important;font-weight:600!important;letter-spacing:.1em!important;text-transform:uppercase;color:#a93d1b!important;margin-left:auto;text-align:right}
.mgst-crop{position:relative;display:block;overflow:hidden;background:var(--mgst-photo-bg);isolation:isolate;min-width:0;min-height:0}
.mgst-crop>.mgst-framed-image{position:absolute!important;display:block!important;height:auto!important;max-width:none!important;max-height:none!important;object-fit:fill!important;margin:0!important;transform:none!important;inset:auto;}
.mgst-photo-panel{background:#fff!important}
.mgst-photo-panel:after{display:none!important}
.mgst-photo-panel>.mgst-crop{position:absolute;left:0;top:0;width:100%;height:44mm}
.mgst-photo-panel>.in{position:absolute!important;top:46mm!important;left:5mm!important;right:5mm!important;bottom:auto!important;z-index:2}
.mgst-photo-panel .h2{font-size:11.3pt!important;line-height:1.25!important;margin-top:1.5mm!important;width:auto!important}
.mgst-photo-panel .pill{font-size:6.5pt!important;line-height:1.3}
.mgst-photo-panel>.cap{display:none!important}
.mgst-photo-overview>.mgst-crop{height:42mm}
.mgst-photo-overview>.in{top:45mm!important}
.mgst-photo-overview .h3{font-size:10pt!important;line-height:1.4!important;width:auto!important;margin-top:2mm!important}
.mgst-photo-overview .lbl{font-size:6.5pt}
.real-field-strip{display:grid;grid-template-columns:1fr 1fr;gap:1mm;background:#fff}
.real-field-strip>.mgst-crop{width:100%;height:100%}
.real-field-strip .source{position:absolute;right:3mm;bottom:1mm;background:#fff;padding:.8mm 1.5mm;font:400 6pt Inter;color:var(--mgst-caption)}
.hero.mgst-clean-cover{background:#201e1d}
.hero.mgst-clean-cover:after{display:none}
.hero.mgst-clean-cover>.mgst-crop{position:absolute;left:0;top:0;width:100%;height:93mm}
.hero.mgst-clean-cover .hin{left:19mm!important;right:19mm!important;bottom:0!important;height:42mm;display:flex;align-items:center}
.hero.mgst-clean-cover h1.h1{font-size:34pt!important;line-height:1.06!important;margin:0!important;letter-spacing:-.035em!important;color:#fff!important}
.hero.mgst-clean-cover .cap{top:auto;bottom:1.2mm;right:3mm;font-size:5.5pt;background:transparent;color:#c8c4c1;padding:0}
#leaders.leaders-seven{grid-template-columns:repeat(4,minmax(0,1fr))!important;grid-template-rows:repeat(4,32mm)!important;gap:3mm!important;background:transparent!important}
#leaders.leaders-seven>.final-leader{grid-column:span 2;gap:3.5mm!important;padding:2.5mm!important;min-width:0;background:#fff;border:.25mm solid #dedede;border-top:.7mm solid #ca4d25}
#leaders.leaders-seven>.final-leader:last-child{grid-column:2 / span 2;grid-row:4}
#leaders.leaders-seven .leader-photo{width:20mm;height:26mm;flex:none;background:var(--mgst-photo-bg)}
#leaders.leaders-seven .leader-copy{min-width:0}
#leaders.leaders-seven .leader-copy .h3{font-size:10pt!important;line-height:1.35!important}
#leaders.leaders-seven .leader-copy .sm{font-size:8pt!important;line-height:1.4!important;margin-top:1.4mm}
.real-achievements figure{background:#fff!important;display:flex;flex-direction:column;align-items:stretch}
.real-achievements figure>.mgst-crop{width:100%;flex:none}
.real-achievements header+div figure>.mgst-crop{height:32mm}
.real-achievements figcaption{position:static!important;inset:auto!important;background:#fff!important;padding:1.2mm 0 0!important;font:400 6.7pt/1.35 Inter!important;color:var(--mgst-caption)!important;text-align:left;flex:none}
.real-achievements header+div figcaption{height:8mm}
.real-achievements .achievement-main>.mgst-crop{height:73mm}
.real-achievements .achievement-main>figcaption{height:6mm}
.real-achievements aside figure>.mgst-crop{height:52mm}
.real-achievements aside figcaption{height:8.5mm}
.real-achievements .letter{border:.2mm solid #dedede!important;padding:1mm!important;box-shadow:.4mm .8mm 1.4mm #00000014!important}
.real-achievements .letter img{object-fit:contain!important}
.mgst-org{font-family:Inter,sans-serif;background:transparent!important;border:0!important;padding:0!important}
.mgst-org__root{width:54mm;height:8mm;margin:0 auto;background:#ca4d25;color:#fff;display:flex;align-items:center;justify-content:center;font-size:8.5pt;font-weight:600;letter-spacing:.025em}
.mgst-org__links{width:180mm;height:6mm;display:block;overflow:visible}
.mgst-org__branches{display:grid;grid-template-columns:repeat(4,42mm);gap:4mm;list-style:none;margin:0;padding:0}
.mgst-org__branch{min-width:0;list-style:none;margin:0;padding:0}
.mgst-org__heading{height:10mm;box-sizing:border-box;margin:0;padding:1mm 2mm;border:.25mm solid #dedede;border-top:.7mm solid #ca4d25;background:#fdf1eb;color:#a93d1b;font-size:8pt;line-height:1.2;font-weight:600;display:flex;align-items:center;justify-content:center;text-align:center}
.mgst-org__units{position:relative;list-style:none;margin:0;padding:1mm 0 0 4mm}
.mgst-org__units:before{content:"";position:absolute;left:2mm;top:1mm;bottom:2.75mm;width:.2mm;background:#b8b4b0}
.mgst-org__units li{position:relative;list-style:none;min-height:5.5mm;display:flex;align-items:center;margin:0;padding:0 0 0 1mm;font-size:7.5pt;line-height:1.2;color:#201e1d}
.mgst-org__units li:before{content:"";position:absolute;left:-2mm;top:50%;width:2mm;height:.2mm;background:#b8b4b0}
'''

for n in range(1, 11):
    file = OUT / f'page-{n:02}.html'
    soup = BeautifulSoup(file.read_text(encoding='utf-8'), 'html.parser')
    page = soup.select_one('.page,.sheet')
    old = soup.select_one('#mgst-real-photo-style')
    if old:
        old.decompose()
    style = soup.new_tag('style', id='mgst-real-photo-style')
    style.string = CSS
    soup.head.append(style)
    if n == 1:
        hero = page.select_one('.hero')
        hero['class'] = list(dict.fromkeys(hero.get('class', []) + ['mgst-clean-cover']))
        replace_photo(hero.select_one('img'), 'digital-launch', 'Đội ngũ tham gia lễ ra quân chuyển đổi số tại địa phương', 216, 93, 'cover')
        text(hero.select_one('.cap'), 'Lễ ra quân chuyển đổi số · Tư liệu Minh Group ST')
    elif n == 2:
        introduction = page.select_one('p.body').parent
        # Match the title's 5 mm inset + 3 mm heading margin, without the
        # previous additional 6 mm offset on the right-hand column.
        introduction['style'] = introduction.get('style', '').replace('padding-top:14mm', 'padding-top:8mm')
        for card, name, alt, framing_id in zip(page.select('.fcard'), ['partner-meeting', 'digital-team'],
            ['Hoạt động làm việc, phối hợp tại địa phương', 'Đội ngũ tham gia hoạt động chuyển đổi số tại địa phương'], ['overview-meeting', 'overview-team']):
            card['class'] = list(dict.fromkeys(card.get('class', []) + ['mgst-photo-panel', 'mgst-photo-overview']))
            replace_photo(card.select_one('img'), name, alt, 90, 42, framing_id)
    elif n == 3:
        strip = page.select_one('#s3')
        strip['class'] = list(dict.fromkeys(strip.get('class', []) + ['real-field-strip']))
        html(strip, framed_photo('field-consultation', 'Đội ngũ tư vấn, hỗ trợ người dân tại địa bàn', 107.5, 60, 'field-team')
             + framed_photo('payment-support', 'Nhân sự hỗ trợ người dân tại điểm phục vụ an sinh', 107.5, 60, 'field-payment')
             + '<span class="source">Hoạt động thực tế tại cơ sở · Tư liệu Minh Group ST</span>')
        # Consolidate the previous leadership box and plain table into one
        # aligned three-level chart. The source names remain unchanged.
        for element in list(page.select('.g')):
            compact_style = element.get('style', '').replace(' ', '')
            if element.get_text(' ', strip=True).casefold() == 'ban lãnh đạo':
                element.decompose()
            elif 'ht' in element.get('class', []) and '--r:14;' in compact_style:
                element.decompose()
        groups = json.loads((ROOT / 'tools/organization.json').read_text(encoding='utf-8'))
        chart = page.select_one('#pkd')
        chart['class'] = ['g', 'mgst-org']
        chart['style'] = '--c:1;--r:14;--w:12;--h:3'
        chart['role'] = 'group'
        chart['aria-label'] = 'Sơ đồ tổ chức: Ban lãnh đạo điều hành bốn khối, mỗi khối gồm ba đơn vị'
        connectors = '<svg class="mgst-org__links" viewBox="0 0 180 6" aria-hidden="true"><path d="M90 0V3M21 3H159M21 3V6M67 3V6M113 3V6M159 3V6" fill="none" stroke="#a39d98" stroke-width=".25"/><g fill="#ca4d25">' + ''.join(f'<circle cx="{x}" cy="6" r=".45"/>' for x in [21,67,113,159]) + '</g></svg>'
        branches = ''.join('<li class="mgst-org__branch"><h3 class="mgst-org__heading">' + escape(group['name']) + '</h3><ul class="mgst-org__units">' + ''.join('<li>' + escape(unit) + '</li>' for unit in group['units']) + '</ul></li>' for group in groups)
        html(chart, '<div class="mgst-org__root">Ban lãnh đạo</div>' + connectors + '<ul class="mgst-org__branches">' + branches + '</ul>')
    elif n in (4, 5):
        names = ['digital-launch', 'partner-meeting'] if n == 4 else ['social-security', 'payment-support']
        alts = ['Lễ ra quân chuyển đổi số tại địa phương', 'Hoạt động làm việc, phối hợp tại địa phương'] if n == 4 else ['Tư vấn an sinh tại điểm phục vụ người dân', 'Nhân sự hỗ trợ người dân tại điểm chi trả, an sinh']
        framing_ids = ['digital-launch', 'finance-meeting'] if n == 4 else ['insurance-service', 'social-payment']
        for card, name, alt, framing_id in zip(page.select('.fcard'), names, alts, framing_ids):
            card['class'] = list(dict.fromkeys(card.get('class', []) + ['mgst-photo-panel']))
            replace_photo(card.select_one('img'), name, alt, 90, 44, framing_id)
    elif n == 8:
        leaders = LEADERS
        board = page.select_one('#leaders')
        board['class'] = list(dict.fromkeys(board.get('class', []) + ['leaders-seven']))
        cards = []
        for leader in leaders:
            # Names and roles are explicit source data. User-proposed titles
            # retain their provisional status in leadership.json and the manifest.
            role = f'<div class="sm or" style="font-weight:600">{escape(leader["role"])}</div>' if leader['role'] else ''
            portrait = framed_photo(leader['photo'], f'Chân dung {leader["name"]}', 20, 26, 'portrait-' + leader['photo'], 'leader-photo')
            cards.append(f'<div class="final-leader">{portrait}<div class="leader-copy"><div class="h3">{escape(leader["name"])}</div>{role}</div></div>')
        html(board, ''.join(cards))
    elif n == 9:
        # V8 is the visual authority: retain its exact 3 + (main / sidebar)
        # composition and tilted document slots; only replace the source media.
        soup = BeautifulSoup((ROOT / 'brochure-v8/page-09.html').read_text(encoding='utf-8'), 'html.parser')
        for script in soup.find_all('script'):
            script.decompose()
        text(soup.title, 'Minh Group ST · VFinal · Thành tựu')
        if not soup.select_one('meta[name="viewport"]'):
            soup.head.append(soup.new_tag('meta', attrs={'name': 'viewport', 'content': 'width=device-width,initial-scale=1'}))
        page = soup.select_one('.sheet')
        page['class'] = ['sheet', 'editorial', 'real-achievements']
        page.select_one('h1')['style'] = 'font-size:29pt;margin:3mm 0 3mm'
        for element in page.find_all('div'):
            if element.get('style') == 'height:85mm':
                element['style'] = 'height:79mm'
        figures = page.select('figure')
        assert len(figures) == 7
        media = [
            ('community-support', 'Đồng hành cùng Quỹ “Vì người nghèo”'),
            ('field-consultation', 'Tư vấn, hỗ trợ người dân tại cơ sở'),
            ('digital-team', 'Đội ngũ tham gia chuyển đổi số'),
            ('community-lighting', 'Công trình “Thắp sáng đường quê”'),
            ('payment-support', 'Hỗ trợ người dân tại điểm phục vụ'),
            ('partner-meeting', 'Phối hợp làm việc tại địa phương'),
            ('social-security', 'Tư vấn an sinh tại cơ sở'),
        ]
        framing_ids = ['achievement-support', 'achievement-field', 'achievement-team', 'achievement-lighting',
                       'achievement-payment-detail', 'achievement-meeting-detail', 'achievement-insurance-detail']
        for index, (figure, (name, caption), framing_id) in enumerate(zip(figures, media, framing_ids)):
            frame_width, frame_height = ((176 / 3, 32) if index < 3 else (132, 73) if index == 3 else (44, 52))
            replace_photo(figure.select_one('img'), name, caption, frame_width, frame_height, framing_id)
            if index == 3:
                figure['class'] = ['achievement-main']
            text(figure.select_one('figcaption'), caption)
            figure.select_one('figcaption')['style'] = 'position:absolute;bottom:0;left:0;right:0;background:#ffffff;padding:1.8mm 2mm;font-size:6.7pt;color:#3d3a38'
        for letter, name, label in zip(page.select('.letter'),
                ['thank-you-thanh-thoi-an', 'thank-you-vinh-hoa'],
                ['Thư cảm ơn của UBND xã Thạnh Thới An', 'Thư cảm ơn của UBND xã Vĩnh Hoà']):
            letter['style'] = 'height:62mm;padding:1.5mm'
            html(letter, f'<a href="assets/documents/{name}.pdf" target="_blank" rel="noopener" aria-label="{label}" style="display:block;width:100%;height:100%"><img src="assets/documents/{name}.png" alt="{label}" style="display:block;width:100%;height:100%;object-fit:contain"></a>')
        text(page.select_one('p.meta'), 'Hình ảnh và thư cảm ơn do Minh Group ST cung cấp. Bấm mở thư để xem bản gốc.')
    elif n == 10:
        credit = next(e for e in page.select('.gx.xs') if 'Hồ sơ năng lực 2026' in e.get_text())
        text(credit, 'Hồ sơ năng lực 2026 · Hình ảnh hoạt động, chân dung và thư cảm ơn do Minh Group ST cung cấp. Tên và chức danh lãnh đạo đối chiếu nội dung website. Thư cảm ơn được giữ nguyên nội dung gốc.')
    for caption in page.select('.mgst-photo-panel .cap'):
        caption.decompose()
    if n > 1:
        labels = {2: 'Tổng quan', 3: 'Năng lực & Tổ chức', 4: 'Chuyển đổi số & Tài chính',
                  5: 'Bảo hiểm & An sinh', 6: 'Hệ sinh thái', 7: 'Dự án trọng điểm',
                  8: 'Lộ trình & Lãnh đạo', 9: 'Thành tựu', 10: 'Hợp tác & Liên hệ'}
        # Remove the numbered section badge, retaining service labels in photos.
        for badge in list(page.select('.pill')):
            if badge.select_one('.nb'):
                badge.decompose()
        if n in (2, 3):
            header = next(element for element in page.select('.g.fill.foot') if '--r:0;' in element.get('style', '').replace(' ', ''))
        elif n in (4, 5):
            header = next(element for element in page.select('.g.dark-band') if '--r:0;' in element.get('style', '').replace(' ', ''))
        else:
            header = page.select_one('.rh,header.top')
        logo = header.select_one('img')
        label = soup.new_tag('span', attrs={'class': 'page-section-title'})
        label.string = labels[n]
        logo.extract()
        header.clear()
        header.append(logo)
        header.append(label)
    if not soup.select_one('#mgst-real-photo-style'):
        style = soup.new_tag('style', id='mgst-real-photo-style')
        style.string = CSS
        soup.head.append(style)
    file.write_text(str(soup), encoding='utf-8')

manifest['framingVersion'] = FRAMING['version']
(OUT / 'photo-manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(f'Applied {len(selection)} supplied photographs and 2 original thank-you letters to VFinal.')
