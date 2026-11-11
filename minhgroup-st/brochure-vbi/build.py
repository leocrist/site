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

FACES = '''@font-face{font-family:'Plus Jakarta Sans';font-weight:500;src:url(../brochure-v3/fonts/PlusJakartaSans-Medium.ttf)}
@font-face{font-family:'Plus Jakarta Sans';font-weight:600;src:url(../brochure-v3/fonts/PlusJakartaSans-SemiBold.ttf)}
@font-face{font-family:'Plus Jakarta Sans';font-weight:700;src:url(../brochure-v3/fonts/PlusJakartaSans-Bold.ttf)}
@font-face{font-family:'Plus Jakarta Sans';font-weight:800;src:url(../brochure-v3/fonts/PlusJakartaSans-ExtraBold.ttf)}
@font-face{font-family:'Be Vietnam Pro';font-weight:400;src:url(../brochure-v3/fonts/BeVietnamPro-Regular.ttf)}
@font-face{font-family:'Be Vietnam Pro';font-weight:500;src:url(../brochure-v3/fonts/BeVietnamPro-Medium.ttf)}
@font-face{font-family:'Be Vietnam Pro';font-weight:600;src:url(../brochure-v3/fonts/BeVietnamPro-SemiBold.ttf)}
@font-face{font-family:'Lora';font-style:italic;font-weight:400;src:url(fonts/Lora-Italic.ttf)}
@font-face{font-family:'Lora';font-style:italic;font-weight:700;src:url(fonts/Lora-BoldItalic.ttf)}
@page{size:216mm 303mm;margin:0}
html,body{background:#d9d9d9}
@media screen{.page{margin:10mm auto;box-shadow:0 2mm 10mm rgba(32,30,29,.2)}}
'''
CSS = '''*{box-sizing:border-box;margin:0;padding:0}
:root{--or:#ca4d25;--or2:#a63c1b;--ink:#201e1d;--tx:#3d3a38;--mut:#5c5c5c;--en:#5f5650;--ln:#dedede;--tint:#f5f5f5;--head:'Plus Jakarta Sans',sans-serif;--body:'Be Vietnam Pro',sans-serif;--enf:'Lora',serif}
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
/* the two voices */
h1{font:700 26pt/1.12 var(--head);letter-spacing:-.022em}
h1 span{color:var(--or)}
.eh{display:flex;align-items:center;gap:3mm;margin-top:3mm;font:italic 400 17pt/1.2 var(--enf);color:var(--or)}
.eh::before{content:"";flex:0 0 9mm;height:.35mm;background:var(--or)}
p{font:400 8.7pt/1.55 var(--body);color:var(--tx)}
p.e,.e{font:italic 400 9.3pt/1.45 var(--enf);color:var(--en)}
.lbl{font:700 6.2pt var(--head);letter-spacing:.16em;text-transform:uppercase;color:var(--mut)}
.t{font:700 10.4pt/1.25 var(--head);letter-spacing:-.01em}
.te{font:italic 400 10pt/1.25 var(--enf);color:var(--or);margin-top:.7mm}
.s{font:400 7.9pt/1.45 var(--body);color:var(--tx);margin-top:1.2mm}
.se{font:italic 400 8.3pt/1.4 var(--enf);color:var(--en);margin-top:.6mm}
.sq{width:3.2mm;height:3.2mm;background:var(--or);flex-shrink:0}
.num{font:800 9pt var(--head);color:#fff;background:var(--or);width:8mm;height:8mm;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.stat b{display:block;font:800 29pt/1 var(--head);letter-spacing:-.03em;color:var(--or)}
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
.pair>.e{padding-left:6mm;border-left:.35mm solid var(--or)}
.band{background:var(--or);color:#fff;padding:4.5mm 6mm}
.band .t{color:#fff}.band .te{color:#ffe1d3}.band .eh::before{background:#fff}
.dk{background:var(--ink);color:#fff}
.li{display:flex;gap:3.2mm;align-items:flex-start;padding:2.6mm 0;border-top:.25mm solid var(--ln)}
.li .t{font-size:9pt}.li .te{font-size:9.2pt}
.ck{width:4.2mm;height:4.2mm;border:.35mm solid var(--or);flex-shrink:0;position:relative;margin-top:.4mm}
.ck::after{content:"";position:absolute;left:1.1mm;top:.35mm;width:1.2mm;height:2.2mm;border:solid var(--or);border-width:0 .4mm .4mm 0;transform:rotate(45deg)}
'''
GF = ('<link rel="preconnect" href="https://fonts.googleapis.com">\n<link rel="stylesheet" href="https://fonts.googleapis.com/css2?'
      'family=Plus+Jakarta+Sans:wght@500;600;700;800&amp;family=Be+Vietnam+Pro:wght@400;500;600&amp;family=Lora:ital,wght@1,400;1,700&amp;display=swap">')

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
# 01 cover ------------------------------------------------------------
P.append(page(1, f'''
<div style="position:absolute;left:18mm;right:18mm;top:14mm;height:14mm;display:flex;justify-content:space-between;align-items:center">
 <img src="{src('logo')}" alt="Minh Group ST" style="height:12mm">
 <div style="text-align:right"><div style="font:700 11pt var(--head);letter-spacing:-.01em">Hồ sơ năng lực 2026</div><div class="te" style="font-size:10.5pt">Corporate Profile 2026</div></div>
</div>
<div class="sq" style="position:absolute;left:7mm;top:19.5mm"></div><div class="sq" style="position:absolute;right:7mm;top:19.5mm"></div>
<div class="ph" style="position:absolute;left:0;right:0;top:36mm;height:119mm"><img src="{src('digital-launch')}" alt=""></div>
<div class="dk" style="position:absolute;left:0;right:0;top:133mm;height:60mm;padding:9mm 18mm 0">
 <h1 style="font-size:31pt;color:#fff">Tiên phong số hóa –<br><span style="color:#ef7a52">Hiệu quả bứt phá</span></h1>
 <div class="eh" style="font-size:17pt;color:#f6c4ae;margin-top:4mm">Digital first. Breakthrough results.</div>
 <div class="cap" style="position:absolute;right:18mm;bottom:3mm;color:#a39d98;margin:0">Lễ ra quân chuyển đổi số <i style="color:#a39d98">/ Digital transformation launch</i> · Tư liệu Minh Group ST</div>
</div>
<div style="position:absolute;left:18mm;right:18mm;top:203mm;display:grid;grid-template-columns:repeat(3,1fr) 46mm;gap:6mm;align-items:start">
 {stat('~300', 'Nhân sự chuyên trách', 'Dedicated field staff')}{stat('10+', 'Phòng kinh doanh', 'Sales offices')}{stat('4', 'Khối hoạt động', 'Operating divisions')}
</div>
<div class="band" style="position:absolute;left:0;right:0;top:246mm;height:24mm;padding:0 18mm;display:grid;grid-template-columns:repeat(3,1fr);align-items:center">
 <div><div class="t" style="font-size:13pt">Gần dân</div><div class="te" style="font-size:10pt">Close to the people</div></div>
 <div><div class="t" style="font-size:13pt">Minh bạch</div><div class="te" style="font-size:10pt">Transparent</div></div>
 <div><div class="t" style="font-size:13pt">Trách nhiệm</div><div class="te" style="font-size:10pt">Responsible</div></div>
</div>
<div style="position:absolute;left:18mm;right:18mm;top:277mm;display:flex;justify-content:space-between;align-items:baseline">
 <div><span style="font:800 7.6pt var(--head);letter-spacing:.08em">CÔNG TY TNHH MINH GROUP ST</span> <span class="e" style="font-size:8pt">/ Minh Group ST Co., Ltd.</span></div>
 <div style="text-align:right;font-size:6.6pt;color:var(--mut)">Tài chính số · Bảo hiểm &amp; An sinh · Dự án &amp; Nhân lực<br><span class="e" style="font-size:7.2pt">Digital finance · Insurance &amp; social security · Projects &amp; workforce</span></div>
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
P.append(std(3, 'Năng lực &amp; Tổ chức', 'Capability &amp; organisation', f'''
<div class="row" style="align-items:flex-end;gap:8mm">
 <div style="flex:1.25">{h1('Bám sát cơ sở.<br>*Triển khai đến tận nơi.*', 'On the ground. Delivered to the door.')}</div>
 <div style="flex:1"><p>Lực lượng tại chỗ kết nối dịch vụ của đối tác với nhu cầu thực tế tại bệnh viện, cơ quan hành chính và hộ gia đình.</p><p class="e" style="margin-top:1.2mm">A local force linking partners' services to real needs in hospitals, public offices and homes.</p></div>
</div>
<div class="g3 line" style="margin-top:6mm;padding-top:5mm">{stat('~300', 'nhân sự chuyên trách tại địa bàn', 'dedicated field staff')}{stat('10+', 'phòng kinh doanh tại ĐBSCL', 'sales offices in the Mekong Delta')}{stat('4', 'khối hoạt động bổ trợ nhau', 'mutually reinforcing divisions')}</div>
<div class="row" style="margin-top:6mm">{ph('field-consultation', '53mm', flex='1.25')}{ph('payment-support', '53mm')}</div>
<div class="cap">Hoạt động thực tế tại cơ sở <i>/ Field activities</i> · Tư liệu Minh Group ST</div>
<div class="g4" style="margin-top:4mm">
 <div class="card" style="padding:3mm">{te('Bệnh viện', 'Hospitals', 'Viện phí không tiền mặt', 'Cashless hospital bills')}</div>
 <div class="card" style="padding:3mm">{te('Hành chính công', 'Public offices', 'Phối hợp triển khai tại cơ sở', 'Joint roll-out on site')}</div>
 <div class="card" style="padding:3mm">{te('Ấp, khu vực', 'Hamlets', 'Tư vấn BHXH, BHYT', 'Social &amp; health insurance advice')}</div>
 <div class="card" style="padding:3mm">{te('Hộ gia đình', 'Households', 'Hỗ trợ người cao tuổi', 'Support for the elderly')}</div>
</div>
<div style="display:flex;justify-content:space-between;align-items:baseline;margin-top:6mm">{lbl('Cơ cấu tổ chức', 'Organisation')}<span class="cap" style="margin:0">1 ban lãnh đạo · 4 khối · 12 đơn vị <i>/ 1 board · 4 divisions · 12 units</i></span></div>
<div style="display:flex;justify-content:center;margin-top:3mm"><div style="background:var(--or);color:#fff;padding:1.8mm 9mm;text-align:center"><div class="t" style="font-size:8.6pt;color:#fff">Ban lãnh đạo</div><div class="te" style="font-size:8pt;color:#ffe1d3;margin:0">Board of management</div></div></div>
<div style="width:.35mm;height:3.5mm;background:var(--or);margin:0 auto"></div>
<div class="g4">{org}</div>
'''))

# 04 digital + finance ------------------------------------------------
def rows(items):
    return ''.join(f'<div class="li"><div class="ck"></div><div>{te(a, b, c, d)}</div></div>' for a, b, c, d in items)
P.append(std(4, 'Chuyển đổi số &amp; Tài chính', 'Digital transformation &amp; finance', f'''
{h1('Công nghệ *&amp;* Tài chính', 'Technology &amp; finance', size='28pt')}
<div class="row" style="margin-top:6mm">{ph('digital-launch', '42mm')}{ph('partner-meeting', '42mm')}</div>
<div class="g2" style="margin-top:5mm;gap:8mm">
 <div>{lbl('Chuyển đổi số &amp; Y tế số', 'Digital &amp; e-health')}<div class="t" style="font-size:13pt;margin-top:2mm">Đưa công nghệ <span style="color:var(--or)">đến gần dân.</span></div><div class="te" style="font-size:10.5pt">Bringing technology closer to people.</div>
  <div style="margin-top:3mm">{rows([('Mở tài khoản &amp; thẻ', 'Accounts &amp; cards', 'Kết nối người dân với ngân hàng đối tác', 'Connecting residents with partner banks'), ('Hướng dẫn sử dụng', 'Hands-on guidance', 'Cài ứng dụng, hỗ trợ giao dịch số', 'App set-up and help with digital transactions'), ('Thanh toán bằng mã QR', 'QR payment', 'Phổ cập thanh toán không tiền mặt', 'Making cashless payment an everyday habit')])}</div></div>
 <div>{lbl('Tài chính – Ngân hàng', 'Banking &amp; finance')}<div class="t" style="font-size:13pt;margin-top:2mm">Cầu nối ngân hàng <span style="color:var(--or)">với miền Tây.</span></div><div class="te" style="font-size:10.5pt">The bridge between banks and the Delta.</div>
  <div style="margin-top:3mm">{rows([('Mở rộng độ phủ', 'Wider reach', 'Tiếp cận người dân và hộ kinh doanh', 'Reaching residents and small traders'), ('Quản trị chất lượng', 'Quality management', 'Theo sát trải nghiệm sau khi mở tài khoản', 'Following the customer after onboarding'), ('Đối soát minh bạch', 'Transparent reconciliation', 'Báo cáo kết quả xuyên suốt cho đối tác', 'Continuous results reporting to partners')])}</div></div>
</div>
<div class="g2 line" style="margin-top:2mm;padding-top:5mm;gap:8mm">
 <div class="row" style="align-items:center;gap:5mm"><div class="stat"><b>10+</b></div><div><div class="s" style="margin:0">phòng kinh doanh trực tiếp triển khai tại địa bàn</div><div class="se">sales offices delivering directly in the field</div></div></div>
 <div class="row" style="align-items:center;gap:5mm"><div class="stat"><b>40.000</b></div><div><div class="s" style="margin:0">tài khoản/tháng, sản lượng cao nhất từng đạt</div><div class="se">accounts a month at peak output</div></div></div>
</div>
<div class="g2" style="margin-top:5mm;gap:8mm">
 <div class="card">{lbl('Kênh y tế số · PKD Y', 'E-health channel')}<div class="g3" style="margin-top:3mm;gap:3mm">
  <div>{te('Nhân sự thường trực', 'Standing staff')}</div><div>{te('Mở tài khoản', 'Account opening')}</div><div>{te('Viện phí không tiền mặt', 'Cashless bills')}</div></div>
  <div class="s" style="margin-top:2.6mm">Hướng dẫn người dân tại bệnh viện</div><div class="se">Guiding patients inside hospitals</div></div>
 <div class="band">{lbl('Quy trình triển khai khép kín', 'Closed-loop delivery').replace('class="lbl"', 'class="lbl" style="color:#ffe1d3"').replace('<i>', '<i style="color:#fff">')}
  <div class="t" style="font-size:8.8pt;margin-top:3mm;line-height:1.5">Tiếp nhận chính sách → Đào tạo → Điều phối địa bàn → Kiểm soát chất lượng → Đối soát</div>
  <div class="te" style="font-size:8.6pt;line-height:1.45;margin-top:1.4mm">Policy intake → Training → Field coordination → Quality control → Reconciliation</div></div>
</div>
'''))

# 05 insurance + social security -------------------------------------
P.append(std(5, 'Bảo hiểm &amp; An sinh', 'Insurance &amp; social security', f'''
{h1('Bảo hiểm *&amp;* An sinh', 'Insurance &amp; social security', size='28pt')}
<div class="row" style="margin-top:6mm">{ph('social-security', '42mm')}{ph('payment-support', '42mm')}</div>
<div class="g2" style="margin-top:5mm;gap:8mm">
 <div>{lbl('Bảo hiểm &amp; An sinh xã hội', 'Insurance &amp; social security')}<div class="t" style="font-size:13pt;margin-top:2mm">Bảo vệ tài chính <span style="color:var(--or)">từng gia đình.</span></div><div class="te" style="font-size:10.5pt">Protecting every family's finances.</div>
  {lbl('Đại lý tổ chức · PVI', 'Corporate agent · PVI', '4mm')}
  <div class="g3" style="margin-top:2mm;gap:2.5mm"><div class="card" style="padding:2.6mm 3mm">{te('Tài sản', 'Property')}</div><div class="card" style="padding:2.6mm 3mm">{te('Cơ giới', 'Motor')}</div><div class="card" style="padding:2.6mm 3mm">{te('Tai nạn', 'Accident')}</div></div>
  {lbl('Phòng Kinh doanh An sinh', 'Social security sales', '4mm')}
  <div style="margin-top:1.5mm">{rows([('BHXH tự nguyện', 'Voluntary social insurance', 'Tuyên truyền cùng chính quyền', 'Outreach together with local authorities'), ('BHYT hộ gia đình', 'Family health insurance', 'Bảo vệ tài chính gia đình', 'Protecting household finances')])}</div></div>
 <div>{lbl('Chi trả bảo trợ xã hội', 'Social welfare payments')}<div class="t" style="font-size:13pt;margin-top:2mm">Trao giá trị, <span style="color:var(--or)">gửi trọn trách nhiệm.</span></div><div class="te" style="font-size:10.5pt">Delivering value with full responsibility.</div>
  {lbl('3 cam kết vận hành', '3 operating commitments', '4mm')}
  <div style="margin-top:1.5mm">''' + ''.join(f'<div class="li"><div class="num" style="width:6.5mm;height:6.5mm;font-size:7.4pt">{n}</div><div>{te(a, b, c, d)}</div></div>' for n, a, b, c, d in [
      ('01', 'Chính xác', 'Accurate', 'Đúng người, đúng tiền, đúng hẹn', 'Right person, right amount, right time'), ('02', 'Trách nhiệm', 'Accountable', 'Kiểm soát tài chính chặt chẽ', 'Strict financial control'),
      ('03', 'Tận tâm', 'Devoted', 'Với người có công, người cao tuổi', 'To veterans and the elderly')]) + f'''</div></div>
</div>
<div class="g2" style="margin-top:4mm;gap:8mm">
 <div class="card">{lbl('Mạng lưới an sinh', 'Social security network')}<div class="stat" style="margin-top:2.5mm"><b style="font-size:22pt">25+ <span style="font-size:11pt;letter-spacing:0">xã, phường</span></b><div class="te" style="font-size:9.4pt;margin-top:1mm">25+ communes and wards</div></div>
  <div class="s" style="margin-top:2.6mm">BHXH tự nguyện · BHYT hộ gia đình · Bảo hiểm học sinh</div><div class="se">Voluntary social insurance · Family health insurance · Student insurance</div></div>
 <div class="card">{lbl('Chi trả bảo trợ xã hội', 'Welfare payments')}<div class="stat" style="margin-top:2.5mm"><b style="font-size:22pt">6 <span style="font-size:11pt;letter-spacing:0">xã, phường</span></b><div class="te" style="font-size:9.4pt;margin-top:1mm">6 communes and wards</div></div>
  <div class="s" style="margin-top:2.6mm">Tỷ lệ chi trả 100% trong phạm vi triển khai. Đúng đối tượng · Đúng số tiền · Kịp thời · Minh bạch.</div><div class="se">100% payout rate within the roll-out area. Right recipient · Right amount · On time · Transparent.</div></div>
</div>
<div class="row" style="margin-top:4mm;align-items:flex-start;gap:4mm"><div class="sq" style="margin-top:.6mm"></div><div>{lbl('Đối tượng phục vụ', 'Who we serve')}<div class="s">Người hưởng lương hưu · Người nhận trợ cấp bảo trợ xã hội · Người có công với cách mạng</div><div class="se">Pensioners · Social welfare recipients · People with meritorious service to the nation</div></div></div>
'''))

# 06 ecosystem --------------------------------------------------------
ECO = [('01', 'Chuyển đổi số &amp; Tài chính', 'Digital &amp; finance', 'Ngân hàng · Dịch vụ số', 'Banking · Digital services'), ('02', 'Bảo hiểm &amp; An sinh', 'Insurance &amp; social security', 'BHXH · BHYT · Chi trả', 'Social insurance · Health insurance · Payments'),
       ('04', 'Dự án &amp; Nhân lực', 'Projects &amp; workforce', 'Lái xe · Máy bán hàng · Việc làm', 'Driver training · Vending · Jobs'), ('03', 'Quản lý vận hành', 'Operations', 'Nhân sự · Kế toán · Hậu cần', 'HR · Accounting · Logistics')]
eco = ''.join(f'<div class="card" style="padding:6mm;display:flex;flex-direction:column;{"align-items:flex-end;text-align:right;" if i % 2 else ""}{"justify-content:flex-end;" if i > 1 else ""}"><div class="num" style="width:10mm;height:10mm;font-size:10pt;margin-bottom:3mm">{n}</div>{te(a, b, c, d)}</div>' for i, (n, a, b, c, d) in enumerate(ECO))
P.append(std(6, 'Hệ sinh thái', 'Ecosystem', f'''
{h1('Bốn khối hoạt động.<br>*Bảy lĩnh vực kết nối.*', 'Four divisions. Seven connected lines of business.')}
<div style="position:relative;margin-top:8mm"><div class="g2" style="grid-auto-rows:51mm;gap:3mm">{eco}</div>
 <div style="position:absolute;left:50%;top:50%;width:34mm;height:34mm;margin:-17mm 0 0 -17mm;border-radius:50%;background:#fff;border:.6mm solid var(--or);display:flex;align-items:center;justify-content:center"><img src="{src('mark')}" alt="Minh Group ST" style="width:21mm"></div></div>
{lbl('Lợi thế cạnh tranh cốt lõi', 'Core competitive advantages', '9mm')}
<div style="margin-top:3mm;display:flex;flex-direction:column;gap:2.5mm">''' + ''.join(
    f'<div class="card" style="padding:0;display:grid;grid-template-columns:16mm 1fr 34mm;align-items:stretch"><div style="background:var(--or);color:#fff;display:flex;align-items:center;justify-content:center;font:800 13pt var(--head)">{n}</div><div style="padding:3.6mm 5mm">{te(a, b, c, d)}</div><div style="display:flex;flex-direction:column;justify-content:center;align-items:flex-end;padding-right:5mm;text-align:right"><div class="t" style="color:var(--or);font-size:13pt">{k}</div><div class="te" style="font-size:8.6pt">{ke}</div></div></div>'
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
    f'<div class="card" style="display:grid;grid-template-columns:20mm 1fr;gap:2mm;padding:5mm 6mm"><div style="font:800 24pt/1 var(--head);color:var(--or);letter-spacing:-.03em">{n}</div><div>{te(a, b)}<div class="pair" style="margin-top:2.6mm;gap:5mm"><p style="font-size:7.8pt">{c}</p><p class="e" style="font-size:8pt;padding-left:5mm">{d}</p></div></div></div>' for n, a, b, c, d in PJ) + f'''</div>
<div class="pair" style="margin-top:4mm;gap:5mm"><p style="font-size:6.8pt;color:var(--mut)">Đào tạo, sát hạch và đưa người lao động đi làm việc ở nước ngoài phải đáp ứng điều kiện của từng chương trình và đơn vị có thẩm quyền.</p><p class="e" style="font-size:7.2pt;padding-left:5mm">Training, testing and overseas placement are subject to the conditions of each programme and of the competent authorities.</p></div>
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
<div class="g2" style="margin-top:4mm;gap:3mm 4mm">{''.join(ld(*x) for x in LD[:6])}</div>
<div style="width:calc(50% - 2mm);margin:3mm auto 0">{ld(*LD[6])}</div>
<div class="cap" style="margin-top:5mm">Liên hệ hợp tác <i>/ Partnership enquiries</i>: <b style="color:var(--or)">0977 726 700</b> · minhgroupst@mgst.com.vn</div>
'''))

# 09 achievements -----------------------------------------------------
def tile(k, h, vi, en, pos='center'):
    return f'<div><div class="ph" style="height:{h}"><img src="{src(k)}" alt="" style="object-position:{pos}"></div><div class="cap" style="line-height:1.35">{vi}<br><i>{en}</i></div></div>'
P.append(std(9, 'Thành tựu', 'Achievements', f'''
<div class="g3" style="margin-top:5mm;gap:3mm">{tile('community-support', '40mm', 'Đồng hành cùng Quỹ “Vì người nghèo”', 'Supporting the “For the Poor” Fund')}{tile('field-consultation', '40mm', 'Tư vấn, hỗ trợ người dân tại cơ sở', 'Advising residents on site')}{tile('digital-team', '40mm', 'Đội ngũ tham gia chuyển đổi số', 'The digital transformation team')}</div>
<div style="display:grid;grid-template-columns:1fr 44mm;gap:5mm;margin-top:5mm">
 <div>{h1('Thành tựu<br>*&amp; cộng đồng.*', 'Achievements &amp; community', mt='0')}
  <div class="pair" style="margin-top:3mm;gap:5mm"><p>Sự ghi nhận từ những giá trị sẻ chia.</p><p class="e" style="padding-left:5mm">Recognition earned by sharing value.</p></div>
  <div style="margin-top:5mm">{tile('community-lighting', '72mm', 'Công trình “Thắp sáng đường quê”', '“Lighting Rural Roads” project')}</div>
  <div class="row" style="margin-top:4mm;gap:5mm;align-items:flex-start">
   <div style="flex:1"><div style="background:var(--tint);padding:3mm;display:flex;justify-content:center"><img src="{src('thank-you-vinh-hoa')}" alt="" style="height:56mm;box-shadow:0 .6mm 2mm rgba(0,0,0,.18)"></div></div>
   <div style="flex:1"><div style="background:var(--tint);padding:3mm;display:flex;justify-content:center"><img src="{src('thank-you-thanh-thoi-an')}" alt="" style="height:56mm;box-shadow:0 .6mm 2mm rgba(0,0,0,.18)"></div></div>
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
<div class="card" style="margin-top:6mm;padding:7mm;display:grid;grid-template-columns:1fr 46mm;gap:8mm;align-items:center">
 <div>{lbl('Liên hệ hợp tác', 'Partnership enquiries')}<div class="t" style="font-size:17pt;margin-top:2.5mm">Kết nối cùng Minh Group ST</div><div class="te" style="font-size:12.5pt">Get in touch with Minh Group ST</div>
  <div style="margin-top:6mm;display:flex;flex-direction:column;gap:4mm">
   <div class="row" style="align-items:center"><div class="sq"></div><div>{lbl('Hotline', 'Hotline')}<div class="t" style="font-size:18pt;color:var(--or);margin-top:.6mm">0977 726 700</div></div></div>
   <div class="row" style="align-items:center"><div class="sq"></div><div>{lbl('Email', 'Email')}<div class="t" style="margin-top:.6mm">minhgroupst@mgst.com.vn</div></div></div>
   <div class="row" style="align-items:center"><div class="sq"></div><div>{lbl('Trụ sở chính', 'Head office')}<div class="t" style="margin-top:.6mm">323–325 Phú Lợi, phường Phú Lợi, TP. Cần Thơ</div><div class="te" style="font-size:8.6pt">323–325 Phú Lợi St., Phú Lợi Ward, Cần Thơ City, Vietnam</div></div></div>
  </div></div>
 <div style="background:#fff;padding:5mm;text-align:center"><img src="{src('qr')}" alt="QR mgst.com.vn" style="width:36mm;height:36mm;image-rendering:pixelated"><div class="t" style="font-size:8.6pt;margin-top:3mm">Quét để kết nối</div><div class="te" style="font-size:8.4pt">Scan to connect</div><div class="s" style="color:var(--or);font-weight:600">mgst.com.vn</div></div>
</div>
<div class="band" style="margin-top:6mm;padding:7mm"><div class="t" style="font-size:22pt;line-height:1.15">Tiên phong số hóa –<br>Hiệu quả bứt phá</div><div class="eh" style="color:#fff;font-size:15pt;margin-top:3.5mm">Digital first. Breakthrough results.</div></div>
<div class="pair" style="margin-top:5mm;gap:5mm"><p style="font-size:6.6pt;color:var(--mut)">Hồ sơ năng lực 2026 · Hình ảnh hoạt động, chân dung và thư cảm ơn do Minh Group ST cung cấp. Tên và chức danh lãnh đạo đối chiếu nội dung website.</p><p class="e" style="font-size:7pt;padding-left:5mm">Corporate Profile 2026 · Activity photos, portraits and letters of thanks supplied by Minh Group ST. Names and titles checked against the company website.</p></div>
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
