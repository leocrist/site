# Bilingual brochure (VI main, EN second voice) built from the VFinal content.
# usage: python3 build.py            -> brochure-vbi.html (10 pages, 3 mm bleed)
#        python3 build.py --canvas D -> D/ProfileVBi-NN.dc.html artboards
import os, sys, re
HERE = os.path.dirname(os.path.abspath(__file__))
CANVAS = sys.argv[2] if len(sys.argv) > 2 and sys.argv[1] == '--canvas' else None
BLOB = {
 'logo': '1179bcaff638808cf9799ca4e008639b', 'mark': 'e9ba8f3f1f95b15f2a5b9f2194af290b', 'qr': '5f7ae45b6f4aeb4a2c186577f848391c',
 'community-lighting': '7a246a7250861e41c34c63aadca8e8b4', 'community-support': '6b0e3b92f0acb16d09916496d8390021',
 'digital-launch': '802aa6a93dc939fe375d983842a80f4d', 'digital-team': '68f92c1514815b59ad047c02e71015d2',
 'dinh-hoang-cong': '87e90bd29615fee9e8ed6fa025e29186', 'dinh-hoang-minh': '69101fd81ec6b47b721f158d0b5b0e60',
 'duong-minh-truong': '879f46d0a35368eb77f9ea05cd279427', 'field-consultation': '563d895edec49aacfbe5cdecc4193d28',
 'lu-hong-huynh': '217c31457fcc9643807e085950badde7', 'nguyen-thi-hong-hue': '49b28651779d9ef77abb7c48267377fc',
 'partner-meeting': 'e76541b87ff52e57955f9dcdc891f84a', 'payment-support': '26a36c7696e6a180356dfe1a5a6cad46',
 'phan-huu-linh': 'ce027cdced9e8889417e02405b265ef6', 'social-security': '14c799433cfe9226eba83748d6fa61f7',
 'tran-thi-lam-thy': 'e9bbda8f701a041f00b39b343a8d9664',
 'thank-you-thanh-thoi-an': 'abe80459792a183f33b432737f6cd567', 'thank-you-vinh-hoa': '665a34e27d49aa6fc4b75bc4a8df8137',
}
def src(k):
    if CANVAS:
        return '/_blob/' + BLOB[k]
    if k == 'logo': return '../assets/logo/mgst-logo.svg'
    if k == 'mark': return '../assets/logo/mgst-mark.svg'
    if k == 'qr': return '../brochure-vfinal/assets/website-qr.png'
    if k.startswith('thank-you'): return f'../brochure-vfinal/assets/documents/{k}.png'
    return f'../brochure-vfinal/assets/photos/{k}.' + ('png' if k == 'nguyen-thi-hong-hue' else 'jpg')

FACES = '''@font-face{font-family:'Inter';font-weight:400;src:url(../brochure-v5/fonts/Inter-Regular.ttf)}
@font-face{font-family:'Inter';font-weight:500;src:url(../brochure-v5/fonts/Inter-Medium.ttf)}
@font-face{font-family:'Inter';font-weight:600;src:url(../brochure-v5/fonts/Inter-SemiBold.ttf)}
@font-face{font-family:'Inter';font-weight:700;src:url(../brochure-v5/fonts/Inter-Bold.ttf)}
@font-face{font-family:'Inter';font-weight:800;src:url(../brochure-v5/fonts/Inter-Bold.ttf)}
@font-face{font-family:'Lora';font-style:italic;font-weight:400;src:url(fonts/Lora-Italic.ttf)}
@font-face{font-family:'Lora';font-style:italic;font-weight:700;src:url(fonts/Lora-BoldItalic.ttf)}
@page{size:216mm 303mm;margin:0}
html,body{background:#d9d9d9}
@media screen{.page{margin:10mm auto;box-shadow:0 2mm 10mm rgba(32,30,29,.2)}}
'''
CSS = '''*{box-sizing:border-box;margin:0;padding:0}
:root{--or:#ca4d25;--or2:#a63c1b;--ink:#201e1d;--tx:#3d3a38;--mut:#5c5c5c;--en:#5f5650;--ln:#dedede;--tint:#f5f5f5;--head:'Inter',sans-serif;--body:'Inter',sans-serif;--enf:'Lora',serif}
body{font-family:var(--body);color:var(--ink);-webkit-print-color-adjust:exact;print-color-adjust:exact}
.page{width:216mm;height:303mm;position:relative;overflow:hidden;background:#fff;break-after:page;font-family:var(--body);color:var(--ink)}
.in{position:absolute;left:18mm;right:18mm;top:15mm;bottom:13mm;display:flex;flex-direction:column}
img{display:block}
/* running head + foot */
.rh{display:flex;justify-content:space-between;align-items:center;padding-bottom:4mm;border-bottom:.25mm solid var(--ln)}
.rh img{height:7mm}
.sec{font:700 6.4pt var(--head);letter-spacing:.16em;text-transform:uppercase;color:var(--or)}
.sec i,.lbl i{font:italic 400 8.4pt var(--enf);letter-spacing:0;text-transform:none;color:var(--or2);margin-left:1.8mm;font-size:9.4pt}
.ft{margin-top:auto;display:flex;justify-content:space-between;align-items:center;padding-top:3.4mm;border-top:.25mm solid var(--ln);font-size:6.4pt;color:var(--mut)}
.pn{font:700 7pt var(--head);letter-spacing:.12em;color:var(--ink)}
/* slogan block */
.slo{position:relative;overflow:hidden;background:var(--ink);color:#fff;border-left:3mm solid var(--or)}
.slo-g{position:absolute;right:0;top:0;bottom:0;width:70mm;background-image:linear-gradient(to right,rgba(255,255,255,.1) .25mm,transparent .25mm),linear-gradient(to bottom,rgba(255,255,255,.1) .25mm,transparent .25mm);background-size:10mm 10mm;-webkit-mask-image:linear-gradient(to right,transparent,#000 55%);mask-image:linear-gradient(to right,transparent,#000 55%)}
.slo-g i{position:absolute;width:10mm;height:10mm}
.slo-t{position:relative}
.slo-k{display:flex;align-items:center;gap:2mm;font:700 6.2pt var(--head);letter-spacing:.18em;text-transform:uppercase;color:#ef7a52}
.slo-k em{font:italic 400 8.6pt var(--enf);letter-spacing:0;text-transform:none;color:#d6d1cc}
.slo h1{color:#fff;margin-top:3mm}
.slo h1 span{color:#ef7a52;font-weight:700}
.slo .eh{color:#f6c4ae}
/* organisation chart */
.obus{position:relative;display:grid;grid-template-columns:repeat(4,1fr);gap:3mm;height:8mm}
.obus::before{content:"";position:absolute;left:50%;top:0;width:.5mm;height:4mm;margin-left:-.25mm;background:var(--or)}
.obus span{position:relative;background:radial-gradient(circle at 50% calc(100% - 1.1mm),var(--or) 1.05mm,transparent 1.15mm)}
.obus span::before{content:"";position:absolute;left:50%;top:3.75mm;bottom:1.1mm;width:.5mm;margin-left:-.25mm;background:var(--or)}
.obus span::after{content:"";position:absolute;top:3.75mm;height:.5mm;left:-1.5mm;right:-1.5mm;background:var(--or)}
.obus span:first-child::after{left:calc(50% - .25mm)}
.obus span:last-child::after{right:calc(50% - .25mm)}
.ocard{border:.25mm solid var(--ln);border-radius:2mm;overflow:hidden;background:#fff}
.ocard header{position:relative;display:block;background:var(--tint);padding:3mm 3mm 2.6mm;min-height:20.5mm;border-bottom:.25mm solid var(--ln)}
.ocard header b{display:inline-flex;align-items:center;justify-content:center;width:6mm;height:6mm;border-radius:1.2mm;background:var(--or);color:#fff;font:700 7pt var(--head);margin-bottom:1.8mm}
.ocard .t{font-size:8.2pt}.ocard .te{font-size:8.2pt}
.ocard li{display:flex;gap:2.2mm;align-items:flex-start;padding:1.7mm 3mm;border-top:.25mm solid var(--ln);font:500 7.2pt/1.3 var(--body);list-style:none}
.ocard li:first-child{border-top:0}
.ocard li i{width:1.6mm;height:1.6mm;background:var(--or);flex-shrink:0;margin-top:1mm}
.ocard li em{display:block;font:italic 400 7.3pt/1.3 var(--enf);color:var(--en)}
/* process steps */
.steps{display:grid;grid-template-columns:repeat(5,1fr);gap:2.5mm}
.steps>div{position:relative;background:var(--tint);border-top:.7mm solid var(--or);padding:3mm 3mm 3.4mm}
.steps b{display:block;font:700 13pt/1 var(--head);color:var(--or);margin-bottom:2.2mm}
.steps .t{font-size:8.4pt}.steps .te{font-size:8.6pt}
.big b{display:block;font:700 36pt/1 var(--head);letter-spacing:-.03em;color:var(--or)}
/* the two voices */
h1{font:600 25pt/1.14 var(--head);letter-spacing:-.02em}
h1 span{color:var(--or)}
.eh{margin-top:2.6mm;font:italic 400 17pt/1.2 var(--enf);color:var(--or)}
p{font:400 8.7pt/1.55 var(--body);color:var(--tx)}
p.e,.e{font:italic 400 9.3pt/1.45 var(--enf);color:var(--en)}
.lbl{font:700 6.2pt var(--head);letter-spacing:.16em;text-transform:uppercase;color:var(--mut)}
.t{font:600 10.2pt/1.28 var(--head);letter-spacing:-.005em}
.te{font:italic 400 10pt/1.25 var(--enf);color:var(--or);margin-top:.7mm}
.s{font:400 7.9pt/1.45 var(--body);color:var(--tx);margin-top:1.2mm}
.se{font:italic 400 8.3pt/1.4 var(--enf);color:var(--en);margin-top:.6mm}
.sq{width:3.2mm;height:3.2mm;background:var(--or);flex-shrink:0}
.num{font:700 9pt var(--head);color:#fff;background:var(--or);width:8mm;height:8mm;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.stat b{display:block;font:700 28pt/1 var(--head);letter-spacing:-.02em;color:var(--or)}
.stat .t{font-size:8.8pt;margin-top:2mm}.stat .te{font-size:9.4pt}
.row{display:flex;gap:4mm}
.col{display:flex;flex-direction:column}
.g2{display:grid;grid-template-columns:1fr 1fr;gap:4mm}
.g3{display:grid;grid-template-columns:repeat(3,1fr);gap:4mm}
.g4{display:grid;grid-template-columns:repeat(4,1fr);gap:3mm}
.card{background:var(--tint);padding:4mm}
.line{border-top:.25mm solid var(--ln)}
.ph{position:relative;overflow:hidden;background:#e7e2de}
.ph img{width:100%;height:100%;object-fit:cover}
.cap{font:400 6.2pt/1.4 var(--body);color:var(--mut);margin-top:1.4mm}
.cap i{font:italic 6.8pt var(--enf);color:var(--en)}
.pair{display:grid;grid-template-columns:1fr 1fr;gap:6mm}
.band{background:var(--or);color:#fff;padding:4.5mm 6mm}
.band .t{color:#fff}.band .te{color:#ffe1d3}
.dk{background:var(--ink);color:#fff}
.li{display:flex;gap:3.2mm;align-items:flex-start;padding:2.6mm 0;border-top:.25mm solid var(--ln)}
.li{padding:3.2mm 0}.li .t{font-size:10pt}.li .te{font-size:10pt}
.ck{width:4.2mm;height:4.2mm;border:.35mm solid var(--or);flex-shrink:0;position:relative;margin-top:.4mm}
.ck::after{content:"";position:absolute;left:1.1mm;top:.35mm;width:1.2mm;height:2.2mm;border:solid var(--or);border-width:0 .4mm .4mm 0;transform:rotate(45deg)}
'''
GF = ('<link rel="preconnect" href="https://fonts.googleapis.com">\n<link rel="stylesheet" href="https://fonts.googleapis.com/css2?'
      'family=Inter:wght@400;500;600;700&amp;family=Lora:ital,wght@1,400;1,700&amp;display=swap">')

def head(n, vi, en):
    return f'<div class="rh"><img src="{src("logo")}" alt="Minh Group ST"><span class="sec">{n:02d} · {vi}<i>{en}</i></span></div>'
def foot(n):
    return (f'<div class="ft"><span>Minh Group ST · Hồ sơ năng lực 2026 <i class="e" style="font-size:7pt">/ Corporate Profile 2026</i></span><span class="pn">{n:02d}</span></div>')
def h1(vi, en, mt='7mm', size=None):
    st = f' style="font-size:{size}"' if size else ''
    v = re.sub(r'\*(.+?)\*', r'<span>\1</span>', vi)
    return f'<div style="margin-top:{mt}"><h1{st}>{v}</h1><div class="eh">{en}</div></div>'
def te(vi, en, s='', se=''):
    o = f'<div class="t">{vi}</div><div class="te">{en}</div>'
    if s: o += f'<div class="s">{s}</div><div class="se">{se}</div>'
    return o
def lbl(vi, en, mt='0'):
    return f'<div class="lbl" style="margin-top:{mt}">{vi}<i>{en}</i></div>'
def ph(k, h, cap=None, flex='1', pos='center'):
    c = f'<div class="cap">{cap[0]} <i>/ {cap[1]}</i></div>' if cap else ''
    return f'<div style="flex:{flex};min-width:0"><div class="ph" style="height:{h}"><img src="{src(k)}" alt="" style="object-position:{pos}"></div>{c}</div>'
def stat(n, vi, en):
    return f'<div class="stat"><b>{n}</b><div class="t">{vi}</div><div class="te">{en}</div></div>'
def page(n, body, cls=''):
    return f'<section class="page {cls}" data-n="{n:02d}">{body}</section>'
def std(n, sec_vi, sec_en, body):
    return page(n, f'<div class="in">{head(n, sec_vi, sec_en)}{body}{foot(n)}</div>')

P = []
# 01 cover (VFinal layout, second voice added) ----------------------
SPK = '<svg viewBox="0 0 24 24" width="4.2mm" height="4.2mm" fill="#fff" aria-hidden="true"><path d="M12 1.5c.7 5.6 4.9 9.8 10.5 10.5-5.6.7-9.8 4.9-10.5 10.5-.7-5.6-4.9-9.8-10.5-10.5C7.1 11.3 11.3 7.1 12 1.5z"></path></svg>'
def slogan(style, pad, size, en, extra=''):
    cells = [(6, 0, .95), (5, 0, .3), (4, 1, .7), (6, 2, .45), (3, 0, .16), (5, 2, .22), (3, 2, .8), (4, 3, .4), (2, 1, .26), (6, 4, .3), (2, 3, .55), (5, 4, .75), (4, 5, .2), (6, 5, .5)]
    g = ''.join(f'<i style="left:{x * 10}mm;top:{y * 10}mm;background:rgba(239,122,82,{a})"></i>' for x, y, a in cells)
    return (f'<div class="slo" style="{style}"><div class="slo-g">{g}</div><div class="slo-t" style="padding:{pad}">'
            f'<div class="slo-k">Thông điệp thương hiệu<em>Brand message</em></div>'
            f'<h1 style="font-size:{size}">Tiên phong số hóa –<br><span>Hiệu quả bứt phá</span></h1>'
            f'<div class="eh" style="font-size:{en}">Digital first. Breakthrough results.</div></div>{extra}</div>')
def cstat(n, vi, en):
    return f'<div style="padding:6mm 6mm 0;border-left:.25mm solid var(--ln)"><div style="font:700 40pt/1 var(--head);letter-spacing:-.03em;color:var(--or)">{n}</div><div class="t" style="margin-top:4mm;font-size:9.6pt">{vi}</div><div class="te" style="font-size:10.4pt">{en}</div></div>'
def cval(vi, en):
    return f'<div style="text-align:center"><div style="font:600 14.5pt/1.2 var(--head);color:#fff">{vi}</div><div class="te" style="font-size:10.4pt;color:#ffe1d3;margin-top:1mm">{en}</div></div>'
P.append(page(1, f'''
<div style="position:absolute;left:21mm;right:21mm;top:23mm;height:15mm;display:flex;justify-content:space-between;align-items:center">
 <img src="{src('logo')}" alt="Minh Group ST" style="height:14.5mm">
 <div style="text-align:right"><div class="sec" style="font-size:6pt">Corporate Profile 2026</div><div style="font:600 13pt/1.25 var(--head);letter-spacing:-.01em;margin-top:1mm">Hồ sơ năng lực 2026</div></div>
</div>
<div class="sq" style="position:absolute;left:8mm;top:29mm;width:5mm;height:5mm"></div><div class="sq" style="position:absolute;right:8mm;top:29mm;width:5mm;height:5mm"></div>
<div class="ph" style="position:absolute;left:0;right:0;top:46.5mm;height:93mm"><img src="{src('digital-launch')}" alt="" style="object-position:center 62%"></div>
{slogan('position:absolute;left:0;right:0;top:139.5mm;height:57mm', '7mm 16mm 0', '29pt', '16pt', '<div class="cap" style="position:absolute;left:19mm;bottom:2mm;color:#a39d98;margin:0">Lễ ra quân chuyển đổi số <i style="color:#a39d98">/ Digital transformation launch</i> · Tư liệu Minh Group ST</div>')}
<div style="position:absolute;left:18mm;right:18mm;top:196.5mm;height:49mm;border-top:.7mm solid var(--or);border-right:.25mm solid var(--ln);display:grid;grid-template-columns:1.15fr 1fr 1fr">
 {cstat('~300', 'Nhân sự chuyên trách', 'Dedicated field staff')}{cstat('10+', 'Phòng kinh doanh', 'Sales offices')}{cstat('4', 'Khối hoạt động', 'Operating divisions')}
</div>
<div class="sq" style="position:absolute;left:8mm;top:202mm;width:5mm;height:5mm"></div><div class="sq" style="position:absolute;right:8mm;top:230mm;width:5mm;height:5mm"></div>
<div style="position:absolute;left:0;right:0;top:245.5mm;height:25mm;background:var(--or);padding:0 26mm;display:flex;align-items:center;justify-content:space-between">
 {cval('Gần dân', 'Close to the people')}{SPK}{cval('Minh bạch', 'Transparent')}{SPK}{cval('Trách nhiệm', 'Responsible')}
</div>
<div style="position:absolute;left:21mm;right:21mm;top:278mm;display:flex;justify-content:space-between;align-items:flex-start">
 <div><div style="font:700 7.4pt var(--head);letter-spacing:.08em">CÔNG TY TNHH MINH GROUP ST</div><div class="e" style="font-size:8.4pt;margin-top:.8mm">Minh Group ST Co., Ltd.</div></div>
 <div style="text-align:right;font-size:6.6pt;color:var(--mut)">Tài chính số · Bảo hiểm &amp; An sinh · Dự án &amp; Nhân lực<div class="e" style="font-size:7.6pt;margin-top:.8mm">Digital finance · Insurance &amp; social security · Projects &amp; workforce</div></div>
</div>'''))

# 02 overview ---------------------------------------------------------
P.append(std(2, 'Tổng quan', 'Overview', f'''
{h1('Sức mạnh tại chỗ.<br>*Thấu hiểu địa bàn.*', 'Local strength. Local insight.')}
<div class="pair" style="margin-top:7mm">
 <p>Thành lập tháng 03/2025 tại Cần Thơ, Công ty TNHH Minh Group ST đưa dịch vụ tài chính số, bảo hiểm và an sinh đến người dân Đồng bằng sông Cửu Long bằng lực lượng tại chỗ và quy trình quản trị khép kín.</p>
 <p class="e" style="font-size:9.4pt">Founded in Cần Thơ in March 2025, Minh Group ST brings digital finance, insurance and social security to people across the Mekong Delta, through its own field force and an end-to-end operating process.</p>
</div>
<div class="row" style="margin-top:7mm">
 <div style="flex:1">{ph('partner-meeting', '61mm')}<div class="card">{lbl('Mô hình hoạt động', 'Operating model')}<p style="margin-top:2mm">Bảy lĩnh vực kết nối trong bốn khối hoạt động, cùng phục vụ nhu cầu của người dân và hộ kinh doanh.</p><p class="e" style="margin-top:1mm">Seven connected lines of business in four divisions, serving households and small traders.</p></div></div>
 <div style="flex:1">{ph('digital-team', '61mm')}<div class="card">{lbl('Giá trị cho đối tác', 'Value for partners')}<p style="margin-top:2mm">Mở rộng độ phủ, triển khai linh hoạt, theo sát chất lượng dịch vụ và báo cáo minh bạch.</p><p class="e" style="margin-top:1mm">Wider reach, flexible roll-out, close quality follow-up and transparent reporting.</p></div></div>
</div>
{lbl('Triết lý hành động', 'How we work', '8mm')}
<div class="g3" style="margin-top:3mm">
 <div class="card"><div class="num">01</div><div style="margin-top:4mm">{te('Gần dân', 'Close to the people', 'Nhân sự bám sát địa bàn, hỗ trợ người dân tại cơ sở.', 'Staff stay in the field and help people where they live.')}</div></div>
 <div class="card"><div class="num">02</div><div style="margin-top:4mm">{te('Minh bạch', 'Transparent', 'Dữ liệu chuẩn xác, đối soát rõ ràng với đối tác.', 'Accurate data and clear reconciliation with partners.')}</div></div>
 <div class="card"><div class="num">03</div><div style="margin-top:4mm">{te('Trách nhiệm', 'Responsible', 'Gắn hiệu quả kinh doanh với lợi ích cộng đồng.', 'Business results tied to community benefit.')}</div></div>
</div>
<div style="margin-top:7mm;display:flex;align-items:center;gap:5mm"><div class="sq"></div><div><div class="t" style="font-size:14pt">Tiên phong số hóa – <span style="color:var(--or)">Hiệu quả bứt phá</span></div><div class="te" style="font-size:11pt">Digital first. Breakthrough results.</div></div></div>
'''))

# 03 capability + organisation ---------------------------------------
ORG = [('Chuyển đổi số &amp; Tài chính', 'Digital &amp; finance', [('PKD Lưu động', 'Mobile sales'), ('PKD kênh Y tế', 'Healthcare channel'), ('PKD Tổng hợp', 'General sales')]),
       ('Bảo hiểm &amp; An sinh', 'Insurance &amp; social security', [('Phòng An sinh', 'Social security'), ('Phòng Chi trả', 'Benefit payments'), ('Bảo hiểm học sinh', 'Student insurance')]),
       ('Quản lý vận hành &amp; Nội bộ', 'Operations', [('Nhân sự', 'Human resources'), ('Kế toán', 'Accounting'), ('Hậu cần &amp; Kỹ thuật', 'Logistics &amp; technical')]),
       ('Dự án &amp; Cung ứng nhân lực', 'Projects &amp; workforce', [('Đào tạo lái xe', 'Driver training'), ('Máy bán hàng tự động', 'Vending machines'), ('Cung ứng nhân lực', 'Workforce supply')])]
org = ''.join(f'<div><div style="border-top:.7mm solid var(--or);background:var(--tint);padding:2.6mm 3mm;min-height:17mm"><div class="t" style="font-size:8pt">{a}</div><div class="te" style="font-size:8pt">{b}</div></div>'
              + ''.join(f'<div style="padding:1.7mm 3mm;border-bottom:.25mm solid var(--ln)"><div style="font:500 7.2pt var(--body)">{u}</div><div class="se" style="margin:0;font-size:7.2pt">{e}</div></div>' for u, e in us) + '</div>' for a, b, us in ORG)
USERS = '<svg width="4.6mm" height="4.6mm" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="8" r="3"></circle><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"></path><circle cx="17" cy="9" r="2.3"></circle><path d="M16.5 14c2.6.2 4.5 2.3 4.5 5"></path></svg>'
orgchart = ('<div style="display:flex;justify-content:center;margin-top:3mm"><div style="display:flex;align-items:center;gap:3mm;background:var(--ink);color:#fff;padding:2mm 7mm 2mm 2mm;border-radius:2mm">'
            f'<span style="width:8.5mm;height:8.5mm;background:var(--or);border-radius:1.4mm;display:flex;align-items:center;justify-content:center">{USERS}</span>'
            '<div><div class="t" style="color:#fff;font-size:9.4pt">Ban lãnh đạo</div><div class="te" style="color:#f6c4ae;font-size:8.8pt;margin:0">Board of management</div></div></div></div>'
            '<div class="obus"><span></span><span></span><span></span><span></span></div><div class="g4">'
            + ''.join(f'<div class="ocard"><header><b>0{i}</b><div class="t">{a}</div><div class="te">{b}</div></header><ul>'
                      + ''.join(f'<li><i></i><span>{u}<em>{e}</em></span></li>' for u, e in us) + '</ul></div>' for i, (a, b, us) in enumerate(ORG, 1)) + '</div>')
P.append(std(3, 'Năng lực &amp; Tổ chức', 'Capability &amp; organisation', f'''
<div class="row" style="align-items:flex-end;gap:8mm">
 <div style="flex:1.25">{h1('Bám sát cơ sở.<br>*Triển khai đến tận nơi.*', 'On the ground. Delivered to the door.')}</div>
 <div style="flex:1"><p>Lực lượng tại chỗ kết nối dịch vụ của đối tác với nhu cầu thực tế tại bệnh viện, cơ quan hành chính và hộ gia đình.</p><p class="e" style="margin-top:1.2mm">A local force linking partners' services to real needs in hospitals, public offices and homes.</p></div>
</div>
<div class="g3 line" style="margin-top:6mm;padding-top:5mm">{stat('~300', 'nhân sự chuyên trách tại địa bàn', 'dedicated field staff')}{stat('10+', 'phòng kinh doanh tại ĐBSCL', 'sales offices in the Mekong Delta')}{stat('4', 'khối hoạt động bổ trợ nhau', 'mutually reinforcing divisions')}</div>
<div class="row" style="margin-top:6mm">{ph('field-consultation', '39mm', flex='1.25')}{ph('payment-support', '39mm')}</div>
<div class="cap">Hoạt động thực tế tại cơ sở <i>/ Field activities</i> · Tư liệu Minh Group ST</div>
<div class="g4" style="margin-top:4mm">
 <div class="card" style="padding:3mm">{te('Bệnh viện', 'Hospitals', 'Viện phí không tiền mặt', 'Cashless hospital bills')}</div>
 <div class="card" style="padding:3mm">{te('Hành chính công', 'Public offices', 'Phối hợp triển khai tại cơ sở', 'Joint roll-out on site')}</div>
 <div class="card" style="padding:3mm">{te('Ấp, khu vực', 'Hamlets', 'Tư vấn BHXH, BHYT', 'Social &amp; health insurance advice')}</div>
 <div class="card" style="padding:3mm">{te('Hộ gia đình', 'Households', 'Hỗ trợ người cao tuổi', 'Support for the elderly')}</div>
</div>
<div style="display:flex;justify-content:space-between;align-items:baseline;margin-top:6mm">{lbl('Cơ cấu tổ chức', 'Organisation')}<span class="cap" style="margin:0">1 ban lãnh đạo · 4 khối · 12 đơn vị <i>/ 1 board · 4 divisions · 12 units</i></span></div>
{orgchart}
'''))

# 04 digital + finance ------------------------------------------------
def rows(items):
    return ''.join(f'<div class="li"><div class="ck" style="margin-top:.8mm"></div><div>{te(a, b)}</div></div>' for a, b in items)
def colhead(lv, le, v1, v2, en):
    return f'{lbl(lv, le)}<div class="t" style="font-size:14.5pt;line-height:1.2;margin-top:2.4mm">{v1} <span style="color:var(--or)">{v2}</span></div><div class="te" style="font-size:11.4pt;margin-top:1mm">{en}</div>'
def big(n, vi, en):
    return f'<div class="big" style="display:flex;align-items:center;gap:6mm"><b>{n}</b><div><div class="t" style="font-size:9.4pt;font-weight:500">{vi}</div><div class="te" style="font-size:9.8pt">{en}</div></div></div>'
STEPS = [('Tiếp nhận chính sách', 'Policy intake'), ('Đào tạo', 'Training'), ('Điều phối địa bàn', 'Field coordination'), ('Kiểm soát chất lượng', 'Quality control'), ('Đối soát', 'Reconciliation')]
P.append(std(4, 'Chuyển đổi số &amp; Tài chính', 'Digital transformation &amp; finance', f'''
{h1('Công nghệ *&amp;* Tài chính', 'Technology &amp; finance', size='28pt')}
<div class="row" style="margin-top:7mm">{ph('digital-launch', '44mm', flex='1.35')}{ph('partner-meeting', '44mm')}</div>
<div class="g2" style="margin-top:8mm;gap:10mm">
 <div>{colhead('Chuyển đổi số &amp; Y tế số', 'Digital &amp; e-health', 'Đưa công nghệ', 'đến gần dân.', 'Bringing technology closer to people.')}
  <div style="margin-top:4mm">{rows([('Mở tài khoản &amp; thẻ', 'Accounts &amp; cards'), ('Hướng dẫn sử dụng', 'Hands-on guidance'), ('Thanh toán bằng mã QR', 'QR payment')])}</div></div>
 <div>{colhead('Tài chính – Ngân hàng', 'Banking &amp; finance', 'Cầu nối ngân hàng', 'với miền Tây.', 'The bridge between banks and the Delta.')}
  <div style="margin-top:4mm">{rows([('Mở rộng độ phủ', 'Wider reach'), ('Quản trị chất lượng', 'Quality management'), ('Đối soát minh bạch', 'Transparent reconciliation')])}</div></div>
</div>
<div class="g2 line" style="margin-top:3mm;padding-top:7mm;gap:10mm">{big('10+', 'phòng kinh doanh triển khai tại địa bàn', 'sales offices delivering in the field')}{big('40.000', 'tài khoản/tháng, sản lượng cao nhất', 'accounts a month at peak output')}</div>
{lbl('Quy trình triển khai khép kín', 'Closed-loop delivery', '8mm')}
<div class="steps" style="margin-top:3mm">''' + ''.join(f'<div><b>0{i}</b><div class="t">{a}</div><div class="te">{b}</div></div>' for i, (a, b) in enumerate(STEPS, 1)) + f'''</div>
<div class="row" style="margin-top:6mm;align-items:flex-start;gap:4mm"><div class="sq" style="margin-top:.6mm"></div><div>{lbl('Kênh y tế số · PKD Y', 'E-health channel')}<div class="s">Nhân sự thường trực tại bệnh viện · Mở tài khoản · Viện phí không tiền mặt</div><div class="se">Standing staff in hospitals · Account opening · Cashless hospital bills</div></div></div>
'''))

# 05 insurance + social security -------------------------------------
P.append(std(5, 'Bảo hiểm &amp; An sinh', 'Insurance &amp; social security', f'''
{h1('Bảo hiểm *&amp;* An sinh', 'Insurance &amp; social security', size='28pt')}
<div class="row" style="margin-top:7mm">{ph('social-security', '62mm', flex='1.35')}{ph('payment-support', '62mm')}</div>
<div class="g2" style="margin-top:8mm;gap:10mm">
 <div>{colhead('Bảo hiểm &amp; An sinh xã hội', 'Insurance &amp; social security', 'Bảo vệ tài chính', 'từng gia đình.', "Protecting every family's finances.")}
  <div style="margin-top:4mm">{rows([('Bảo hiểm phi nhân thọ · PVI', 'Non-life insurance · PVI corporate agent'), ('BHXH tự nguyện', 'Voluntary social insurance'), ('BHYT hộ gia đình', 'Family health insurance')])}</div></div>
 <div>{colhead('Chi trả bảo trợ xã hội', 'Social welfare payments', 'Trao giá trị,', 'gửi trọn trách nhiệm.', 'Delivering value with full responsibility.')}
  <div style="margin-top:4mm">''' + ''.join(f'<div class="li"><div class="num" style="width:6.5mm;height:6.5mm;font-size:7.4pt">{n}</div><div>{te(a, b)}</div></div>' for n, a, b in [
      ('01', 'Chính xác: đúng người, đúng tiền, đúng hẹn', 'Accurate: right person, amount and time'), ('02', 'Trách nhiệm trong kiểm soát tài chính', 'Accountable financial control'),
      ('03', 'Tận tâm với người có công, người cao tuổi', 'Devoted to veterans and the elderly')]) + f'''</div></div>
</div>
<div class="g2 line" style="margin-top:3mm;padding-top:7mm;gap:10mm">{big('25+', 'xã, phường trong mạng lưới an sinh', 'communes and wards in the network')}{big('6', 'xã, phường chi trả, tỷ lệ 100%', 'communes and wards, 100% payout rate')}</div>
<div class="g3" style="margin-top:8mm;gap:3mm"><div class="card">{te('Tài sản', 'Property')}</div><div class="card">{te('Cơ giới', 'Motor')}</div><div class="card">{te('Tai nạn', 'Accident')}</div></div>
<div class="row" style="margin-top:6mm;align-items:flex-start;gap:4mm"><div class="sq" style="margin-top:.6mm"></div><div>{lbl('Đối tượng phục vụ', 'Who we serve')}<div class="s">Người hưởng lương hưu · Người nhận trợ cấp bảo trợ xã hội · Người có công với cách mạng</div><div class="se">Pensioners · Social welfare recipients · People with meritorious service to the nation</div></div></div>
'''))

# 06 ecosystem --------------------------------------------------------
ECO = [('01', 'Chuyển đổi số &amp; Tài chính', 'Digital &amp; finance', 'Ngân hàng · Dịch vụ số', 'Banking · Digital services'), ('02', 'Bảo hiểm &amp; An sinh', 'Insurance &amp; social security', 'BHXH · BHYT · Chi trả', 'Social insurance · Health insurance · Payments'),
       ('04', 'Dự án &amp; Nhân lực', 'Projects &amp; workforce', 'Lái xe · Máy bán hàng · Việc làm', 'Driver training · Vending · Jobs'), ('03', 'Quản lý vận hành', 'Operations', 'Nhân sự · Kế toán · Hậu cần', 'HR · Accounting · Logistics')]
def eco_svg():
    # the VFinal ecosystem diagram, with each node labelled in both voices
    pos = {'01': (53, 28, 'top'), '02': (127, 28, 'top'), '03': (127, 102, 'bot'), '04': (53, 102, 'bot')}
    lab = ''
    for n, a, b, c, d in ECO:
        x, y, side = pos[n]
        y0 = -1 if side == 'top' else 117
        lab += (f'<circle cx="{x}" cy="{y}" r="6.5" fill="#ca4d25"/><text x="{x}" y="{y + 1.3}" text-anchor="middle" fill="#fff" font-family="Inter,sans-serif" font-size="3.7" font-weight="700">{n}</text>'
                f'<text x="{x}" y="{y0}" text-anchor="middle" fill="#201e1d" font-family="Inter,sans-serif" font-size="3.5" font-weight="700">{a}</text>'
                f'<text x="{x}" y="{y0 + 4.3}" text-anchor="middle" fill="#ca4d25" font-family="Lora,serif" font-style="italic" font-size="3.4">{b}</text>'
                f'<text x="{x}" y="{y0 + 8.9}" text-anchor="middle" fill="#3d3a38" font-family="Inter,sans-serif" font-size="2.6">{c}</text>'
                f'<text x="{x}" y="{y0 + 12.4}" text-anchor="middle" fill="#5f5650" font-family="Lora,serif" font-style="italic" font-size="2.6">{d}</text>')
    return (f'<svg viewBox="0 -6 180 138" role="img" aria-label="Bốn khối hoạt động / Four divisions" style="display:block;width:100%;height:auto">'
            '<circle cx="90" cy="65" r="48" fill="#f5f5f5"/>'
            '<g fill="none" stroke="#ca4d25" stroke-width=".5"><path d="M53 28L127 28L127 102L53 102Z"/><path d="M53 28L90 17L127 28L138 65L127 102L90 113L53 102L42 65Z" stroke-opacity=".35"/><path d="M53 28L127 102M127 28L53 102" stroke-opacity=".4"/></g>'
            '<g fill="none" stroke="#bbbbbb" stroke-width=".25"><path d="M90 17L42 65L90 113L138 65Z"/><path d="M53 28L138 65L53 102M127 28L42 65L127 102"/></g>'
            '<circle cx="90" cy="65" r="21" fill="#fff" stroke="#ca4d25" stroke-width=".45"/>' + lab + '</svg>')
P.append(std(6, 'Hệ sinh thái', 'Ecosystem', f'''
{h1('Bốn khối hoạt động.<br>*Bảy lĩnh vực kết nối.*', 'Four divisions. Seven connected lines of business.')}
<div style="position:relative;width:146mm;margin:4mm auto 0">{eco_svg()}<img src="{src('mark')}" alt="Minh Group ST" style="position:absolute;left:50%;top:51.45%;width:13%;transform:translate(-50%,-50%)"></div>
{lbl('Lợi thế cạnh tranh cốt lõi', 'Core competitive advantages', '4mm')}
<div style="margin-top:3mm;display:flex;flex-direction:column;gap:2.5mm">''' + ''.join(
    f'<div class="card" style="padding:0;display:grid;grid-template-columns:16mm 1fr 34mm;align-items:stretch"><div style="background:var(--or);color:#fff;display:flex;align-items:center;justify-content:center;font:700 13pt var(--head)">{n}</div><div style="padding:3.6mm 5mm">{te(a, b, c, d)}</div><div style="display:flex;flex-direction:column;justify-content:center;align-items:flex-end;padding-right:5mm;text-align:right"><div class="t" style="color:var(--or);font-size:13pt">{k}</div><div class="te" style="font-size:8.6pt">{ke}</div></div></div>'
    for n, a, b, c, d, k, ke in [('01', 'Nguồn lực tại chỗ', 'Local resources', 'Khoảng 300 nhân sự, hơn 10 phòng kinh doanh tại ĐBSCL.', 'About 300 staff and more than 10 sales offices in the Mekong Delta.', '~300', 'staff'),
                                 ('02', 'Bảy lĩnh vực bổ trợ', 'Seven reinforcing lines', 'Số hóa · Tài chính · Bảo hiểm · An sinh · Lái xe · Máy bán hàng · Việc làm.', 'Digital · Finance · Insurance · Social security · Driver training · Vending · Jobs.', '7 lĩnh vực', '7 lines'),
                                 ('03', 'Vận hành minh bạch', 'Transparent operations', 'KPI rõ ràng; kiểm soát ngân sách, dòng tiền và rủi ro.', 'Clear KPIs; control of budget, cash flow and risk.', 'Quản trị + Thực thi', 'Governance + delivery')]) + '''</div>
'''))

# 07 flagship projects ------------------------------------------------
PJ = [('01', 'Máy bán hàng tự động', 'Vending machines', 'Đưa hàng thiết yếu và thanh toán QR về xã, phường; kết hợp hướng dẫn mở tài khoản, thẻ. Kết nối VPBank, Toro và VNPAY; đánh giá thí điểm trước khi mở rộng.', 'Essential goods and QR payment brought to communes, combined with help opening accounts and cards. With VPBank, Toro and VNPAY; piloted and assessed before scaling.'),
      ('02', 'Đào tạo lái xe', 'Driver training', 'Tư vấn, tiếp nhận hồ sơ và kết nối cơ sở đào tạo đủ điều kiện. Nghiên cứu đầu tư cơ sở đào tạo, sân sát hạch tại khu vực Sóc Trăng.', 'Advice, enrolment and referral to qualified training centres. An investment in a training site and test ground in the Sóc Trăng area is under study.'),
      ('03', 'Cung ứng nhân lực &amp; Tư vấn XKLĐ', 'Workforce supply &amp; overseas employment', 'Tuyển chọn, đào tạo nghề và ngoại ngữ; kết nối việc làm tại Châu Âu, Đông Á. Minh bạch chi phí, lộ trình và hỗ trợ người lao động suốt hợp đồng.', 'Selection, vocational and language training; job placement in Europe and East Asia. Transparent costs and timeline, with support throughout the contract.')]
P.append(std(7, 'Dự án trọng điểm', 'Flagship projects', f'''
{h1('Ba dự án.<br>*Mở rộng hệ sinh thái.*', 'Three projects. A growing ecosystem.')}
<div class="band" style="margin-top:7mm;display:grid;grid-template-columns:44mm 1fr;gap:6mm;align-items:center"><div>{te('Kết nối nguồn lực', 'Connecting resources')}</div>
 <div style="border-left:.3mm solid #f0a78d;padding-left:6mm"><div class="s" style="color:#fff;margin:0">Phòng Quản lý Dự án chủ trì. Tận dụng mạng lưới và điểm chạm sẵn có.</div><div class="se" style="color:#ffe1d3">Led by the Project Management Office, building on the existing network and touchpoints.</div></div></div>
<div style="margin-top:5mm;display:flex;flex-direction:column;gap:3mm">''' + ''.join(
    f'<div class="card" style="display:grid;grid-template-columns:20mm 1fr;gap:2mm;padding:5mm 6mm"><div style="font:700 24pt/1 var(--head);color:var(--or);letter-spacing:-.03em">{n}</div><div>{te(a, b)}<div class="pair" style="margin-top:2.6mm;gap:5mm"><p style="font-size:7.8pt">{c}</p><p class="e" style="font-size:8pt">{d}</p></div></div></div>' for n, a, b, c, d in PJ) + f'''</div>
<div class="pair" style="margin-top:4mm;gap:5mm"><p style="font-size:6.8pt;color:var(--mut)">Đào tạo, sát hạch và đưa người lao động đi làm việc ở nước ngoài phải đáp ứng điều kiện của từng chương trình và đơn vị có thẩm quyền.</p><p class="e" style="font-size:7.2pt">Training, testing and overseas placement are subject to the conditions of each programme and of the competent authorities.</p></div>
{lbl('Từ ý tưởng đến triển khai', 'From idea to delivery', '7mm')}
<div class="g3" style="margin-top:3mm">
 <div style="border-top:.7mm solid var(--or);padding-top:3mm">{te('Tham mưu &amp; triển khai', 'Advise &amp; deliver', 'Xây dựng lộ trình, cơ chế phối hợp và phương án nhân sự.', 'Roadmaps, coordination mechanisms and staffing plans.')}</div>
 <div style="border-top:.7mm solid var(--or);padding-top:3mm">{te('Kiểm tra &amp; giám sát', 'Inspect &amp; supervise', 'Rà soát quy trình, nhận diện rủi ro và giữ kỷ luật vận hành.', 'Process reviews, risk detection and operating discipline.')}</div>
 <div style="border-top:.7mm solid var(--or);padding-top:3mm">{te('Đánh giá &amp; báo cáo', 'Evaluate &amp; report', 'Tổng hợp số liệu, phân tích hiệu quả và đề xuất cải tiến.', 'Data consolidation, performance analysis and improvement proposals.')}</div>
</div>
'''))

# 08 roadmap + leadership --------------------------------------------
TL = [('03/2025', 'Thành lập Minh Group ST', 'Company founded'), ('04/2025', 'PKD Tổng hợp, PKD Y &amp; hệ thống PKD địa bàn', 'General, healthcare &amp; area sales offices'), ('09–11/2025', 'PKD 8 &amp; PKD An sinh', 'Office 8 &amp; social security sales'),
      ('01–03/2026', 'Phòng Dự án &amp; PKD 9', 'Project office &amp; office 9'), ('06–07/2026', 'PKD 4 &amp; Phòng Chi trả BTXH', 'Office 4 &amp; welfare payments'), ('09/2026', 'Hoàn thiện 11 PKD địa bàn', '11 area offices completed')]
tl = ''.join(f'<div style="position:relative;padding-top:8mm"><div style="position:absolute;left:0;top:0;width:4.4mm;height:4.4mm;border-radius:50%;background:{"var(--or)" if i in (0, 5) else "#fff"};border:.6mm solid var(--or)"></div><div class="t" style="font-size:8.4pt;color:var(--or)">{d}</div><div class="s" style="font-size:7pt;margin-top:.8mm;font-weight:500;color:var(--ink)">{a}</div><div class="se" style="font-size:7.2pt">{b}</div></div>' for i, (d, a, b) in enumerate(TL))
LD = [('dinh-hoang-minh', 'Ông Đinh Hoàng Minh', 'Cố vấn Cao cấp', 'Senior Advisor'), ('dinh-hoang-cong', 'Ông Đinh Hoàng Công', 'Giám đốc Công ty', 'Director'), ('lu-hong-huynh', 'Ông Lư Hồng Huỳnh', 'Phó Giám đốc', 'Deputy Director'),
      ('nguyen-thi-hong-hue', 'Bà Nguyễn Thị Hồng Huệ', 'Phó Giám đốc', 'Deputy Director'), ('phan-huu-linh', 'Ông Phan Hữu Linh', 'Phó Giám đốc', 'Deputy Director'), ('duong-minh-truong', 'Ông Dương Minh Trường', 'Phó Giám đốc', 'Deputy Director'),
      ('tran-thi-lam-thy', 'Bà Trần Thị Lam Thy', 'Phát triển kinh doanh', 'Business Development')]
def ld(k, n, r, e):
    return f'<div style="display:flex;gap:4mm;align-items:center;border-top:.6mm solid var(--or);background:var(--tint);padding:3mm"><div class="ph" style="width:22mm;height:28mm;flex-shrink:0"><img src="{src(k)}" alt="" style="object-position:center 18%"></div><div><div class="t" style="font-size:9.4pt">{n}</div><div class="s" style="font-weight:600;color:var(--or);margin-top:1.2mm">{r}</div><div class="se" style="font-size:8.2pt">{e}</div></div></div>'
P.append(std(8, 'Lộ trình &amp; Lãnh đạo', 'Roadmap &amp; leadership', f'''
{h1('Lộ trình *2025 – 2026*', 'Roadmap 2025 – 2026')}
<div class="pair" style="margin-top:4mm"><p>Thành lập tháng 03/2025; từng bước phát triển mạng lưới kinh doanh và các phòng chức năng.</p><p class="e">Founded in March 2025; the sales network and functional departments have been built step by step.</p></div>
<div style="position:relative;margin-top:7mm"><div style="position:absolute;left:0;right:0;top:1.9mm;height:.6mm;background:var(--or)"></div><div style="display:grid;grid-template-columns:repeat(6,1fr);gap:3mm">{tl}</div></div>
<div style="display:flex;justify-content:space-between;align-items:baseline;margin-top:9mm"><div><span class="t" style="font-size:15pt">Ban lãnh đạo</span> <span class="te" style="font-size:12pt;margin-left:2mm">Leadership</span></div><span class="cap" style="margin:0">Kết nối qua hotline công ty <i>/ Reach us via the company hotline</i></span></div>
<div class="g2" style="margin-top:4mm;gap:3mm 4mm">{''.join(ld(*x) for x in LD)}</div>
<div class="cap" style="margin-top:5mm">Liên hệ hợp tác <i>/ Partnership enquiries</i>: <b style="color:var(--or)">0977 726 700</b> · minhgroupst@mgst.com.vn</div>
'''))

# 09 achievements -----------------------------------------------------
def tile(k, h, vi, en, pos='center'):
    return f'<div><div class="ph" style="height:{h}"><img src="{src(k)}" alt="" style="object-position:{pos}"></div><div class="cap" style="line-height:1.35">{vi}<br><i>{en}</i></div></div>'
P.append(std(9, 'Thành tựu', 'Achievements', f'''
<div class="g3" style="margin-top:5mm;gap:3mm">{tile('community-support', '40mm', 'Đồng hành cùng Quỹ “Vì người nghèo”', 'Supporting the “For the Poor” Fund')}{tile('field-consultation', '40mm', 'Tư vấn, hỗ trợ người dân tại cơ sở', 'Advising residents on site')}{tile('digital-team', '40mm', 'Đội ngũ tham gia chuyển đổi số', 'The digital transformation team')}</div>
<div style="display:grid;grid-template-columns:1fr 44mm;gap:5mm;margin-top:5mm">
 <div>{h1('Thành tựu<br>*&amp; cộng đồng.*', 'Achievements &amp; community', mt='0')}
  <div class="pair" style="margin-top:3mm;gap:5mm"><p>Sự ghi nhận từ những giá trị sẻ chia.</p><p class="e">Recognition earned by sharing value.</p></div>
  <div style="margin-top:5mm">{tile('community-lighting', '67mm', 'Công trình “Thắp sáng đường quê”', '“Lighting Rural Roads” project')}</div>
  <div style="position:relative;height:66mm;margin-top:4mm;background:var(--tint);overflow:hidden">
   <img src="{src('thank-you-vinh-hoa')}" alt="" style="position:absolute;left:50%;top:7mm;height:58mm;margin-left:-41mm;transform:rotate(-8deg);transform-origin:50% 100%;border:.3mm solid #fff;box-shadow:0 1mm 3.5mm rgba(0,0,0,.22)">
   <img src="{src('thank-you-thanh-thoi-an')}" alt="" style="position:absolute;left:50%;top:7mm;height:58mm;margin-left:-1mm;transform:rotate(7deg);transform-origin:50% 100%;border:.3mm solid #fff;box-shadow:0 1mm 3.5mm rgba(0,0,0,.26)">
  </div>
  <div class="cap">Thư cảm ơn từ địa phương, giữ nguyên nội dung gốc <i>/ Letters of thanks from local authorities, reproduced unaltered</i></div>
 </div>
 <div style="display:flex;flex-direction:column;gap:3mm">{tile('payment-support', '50mm', 'Hỗ trợ người dân tại điểm phục vụ', 'Helping residents at service points')}{tile('partner-meeting', '50mm', 'Phối hợp làm việc tại địa phương', 'Working sessions with local partners')}{tile('social-security', '50mm', 'Tư vấn an sinh tại cơ sở', 'Social security advice on site')}</div>
</div>
'''))

# 10 partnership + contact -------------------------------------------
P.append(std(10, 'Hợp tác &amp; Liên hệ', 'Partnership &amp; contact', f'''
{h1('Cùng đối tác.<br>*Triển khai hiệu quả tại địa bàn.*', 'With our partners. Effective delivery on the ground.')}
<div class="g3" style="margin-top:8mm">
 <div class="card"><div class="num">01</div><div style="margin-top:4mm">{te('Ngân hàng &amp; Tài chính', 'Banking &amp; finance', 'Mở rộng độ phủ, triển khai tại cơ sở và theo sát chất lượng giao dịch.', 'Wider reach, on-site delivery and close follow-up of transaction quality.')}</div></div>
 <div class="card"><div class="num">02</div><div style="margin-top:4mm">{te('Bảo hiểm &amp; An sinh', 'Insurance &amp; social security', 'Phối hợp tư vấn bảo hiểm, phát triển BHXH, BHYT và chi trả tại cơ sở.', 'Joint insurance advice, social and health insurance growth, and local payments.')}</div></div>
 <div class="card"><div class="num">03</div><div style="margin-top:4mm">{te('Dự án &amp; Nhân lực', 'Projects &amp; workforce', 'Kết nối nguồn lực để triển khai dự án, đào tạo và phát triển việc làm.', 'Connecting resources for projects, training and job creation.')}</div></div>
</div>
<div class="card" style="margin-top:5mm;padding:6mm;display:grid;grid-template-columns:1fr 46mm;gap:8mm;align-items:center">
 <div>{lbl('Liên hệ hợp tác', 'Partnership enquiries')}<div class="t" style="font-size:17pt;margin-top:2.5mm">Kết nối cùng Minh Group ST</div><div class="te" style="font-size:12.5pt">Get in touch with Minh Group ST</div>
  <div style="margin-top:6mm;display:flex;flex-direction:column;gap:4mm">
   <div class="row" style="align-items:center"><div class="sq"></div><div>{lbl('Hotline', 'Hotline')}<div class="t" style="font-size:18pt;color:var(--or);margin-top:.6mm">0977 726 700</div></div></div>
   <div class="row" style="align-items:center"><div class="sq"></div><div>{lbl('Email', 'Email')}<div class="t" style="margin-top:.6mm">minhgroupst@mgst.com.vn</div></div></div>
   <div class="row" style="align-items:center"><div class="sq"></div><div>{lbl('Trụ sở chính', 'Head office')}<div class="t" style="margin-top:.6mm">323–325 Phú Lợi, phường Phú Lợi, TP. Cần Thơ</div><div class="te" style="font-size:8.6pt">323–325 Phú Lợi St., Phú Lợi Ward, Cần Thơ City, Vietnam</div></div></div>
  </div></div>
 <div style="background:#fff;padding:5mm;text-align:center"><img src="{src('qr')}" alt="QR mgst.com.vn" style="width:36mm;height:36mm;image-rendering:pixelated"><div class="t" style="font-size:8.6pt;margin-top:3mm">Quét để kết nối</div><div class="te" style="font-size:8.4pt">Scan to connect</div><div class="s" style="color:var(--or);font-weight:600">mgst.com.vn</div></div>
</div>
{slogan('margin-top:5mm', '6mm 9mm 7mm', '25pt', '14pt')}
<div class="pair" style="margin-top:5mm;gap:5mm"><p style="font-size:6.6pt;color:var(--mut)">Hồ sơ năng lực 2026 · Hình ảnh hoạt động, chân dung và thư cảm ơn do Minh Group ST cung cấp. Tên và chức danh lãnh đạo đối chiếu nội dung website.</p><p class="e" style="font-size:7pt">Corporate Profile 2026 · Activity photos, portraits and letters of thanks supplied by Minh Group ST. Names and titles checked against the company website.</p></div>
'''))

if CANVAS:
    names = ['Bìa', 'Tổng quan', 'Năng lực & Tổ chức', 'Chuyển đổi số & Tài chính', 'Bảo hiểm & An sinh', 'Hệ sinh thái', 'Dự án trọng điểm', 'Lộ trình & Lãnh đạo', 'Thành tựu', 'Hợp tác & Liên hệ']
    css = CSS
    for i, pg in enumerate(P, 1):
        doc = f'''<!doctype html>
<html lang="vi">
<head>
<meta charset="utf-8">
<title>Brochure VBi · {i:02d} · {names[i - 1].replace('&', '&amp;')}</title>
<script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
{GF}
<style>
body{{margin:0}}
{css}</style>
</helmet>
{pg}
</x-dc>
<script type="text/x-dc" data-dc-script data-props='{{"$preview":{{"width":816,"height":1145}}}}'>
class Component extends DCLogic {{
renderVals() {{
return {{}};
}}
}}
</script>
</body>
</html>
'''
        open(os.path.join(CANVAS, f'ProfileVBi-{i:02d}.dc.html'), 'w', encoding='utf8').write(doc)
    import json
    print(json.dumps([[f'ProfileVBi-{i:02d}.dc.html', f'Brochure VBi · {i:02d} · {n}'] for i, n in enumerate(names, 1)], ensure_ascii=False))
else:
    doc = f'<!doctype html>\n<html lang="vi">\n<head>\n<meta charset="utf-8">\n<title>Minh Group ST · Hồ sơ năng lực 2026 · Song ngữ VI/EN</title>\n<style>\n{FACES}{CSS}</style>\n</head>\n<body>\n' + '\n'.join(P) + '\n</body>\n</html>\n'
    open(os.path.join(HERE, 'brochure-vbi.html'), 'w', encoding='utf8').write(doc)
    print('ok')
