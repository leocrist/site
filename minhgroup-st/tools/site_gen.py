# Generates the website sub-pages in the Home page's design language.
# usage: python3 site_gen.py <live Main.dc.html> <out project dir>
import re, sys, os

MAIN, OUT = sys.argv[1], sys.argv[2]
home = open(MAIN, encoding='utf8').read()
HOME_CSS = re.search(r'<style>(.*?)</style>', home, re.S).group(1)
SPK = re.search(r'<svg class="vb-spk"[^>]*>(<path d="[^"]+"></path>)</svg>', home).group(1)

B = {  # artifact blobs
 'logo': '/_blob/a59374f9219055b49892dcb2ad96f385',
 'a': '/_blob/45860b7d149a390970149582f9b89451', 'b': '/_blob/f5040f4716dac4c066f6f0653b44e4e6',
 'f': '/_blob/35c914cb179315c1ed8aadf2038fe9d7', 'g': '/_blob/79c011ce9bdbe1ced6739433e7fdd9c6',
 'h': '/_blob/c4dc9283c7a0db1adf5c77c4978be8b0', 'k': '/_blob/7b27c5ec9692f7cb740afbd91ad776cc',
 'l': '/_blob/731930f256d63826095fbe8b538ce38b',
 'pvi': '/_blob/5e81120a5d760314400d7c3cd78d07cc', 'pti': '/_blob/d2e087652b3544da1e57390d20c76236',
 'vcb': '/_blob/15854dcaa6fa5a8fc38f7881b3d38fad', 'agri': '/_blob/5bb1ed721ba769b0c1a9d2fa70312f3b',
}
CR = {
 'a': ('Người phụ nữ đội nón lá trên ghe ở chợ nổi Cần Thơ', 'Ảnh: Vyacheslav Argenberg · CC BY 4.0'),
 'b': ('Người bán hàng rong vừa đội thúng bánh vừa xem điện thoại', 'Ảnh: Peter van der Sluijs · CC BY-SA 3.0'),
 'f': ('Dòng xe máy trên đường phố Cần Thơ', 'Ảnh: Dragfyre · CC BY-SA 3.0'),
 'g': ('Cầu Cần Thơ nhìn từ trên cao', 'Ảnh: Tuong Lam Photos · CC BY-SA 4.0'),
 'h': ('Sạp rau ở chợ Cần Thơ', 'Ảnh: Franzfoto · CC BY-SA 3.0'),
 'k': ('Cầu Cần Thơ bắc qua sông Hậu', 'Ảnh: Christophe95 · CC BY-SA 4.0'),
 'l': ('Trụ tháp cầu Cần Thơ lúc chiều', 'Ảnh: Franzfoto · CC BY-SA 3.0'),
}
ON, ONP, BGOR = ' class="on"', ' class="on" aria-current="page"', ' style="background: #fdf1eb"'
HOT, HOT_T = '0977 726 700', 'tel:0977726700'
MAIL = 'minhgroupst@mgst.com.vn'
ADDR = '323–325 Phú Lợi, phường Phú Lợi, TP. Cần Thơ'

I = {  # 24px stroke icons
 'id': '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10.5" r="2.5"/><path d="M5.5 17c.8-1.6 2.1-2.5 3.5-2.5s2.7.9 3.5 2.5M15 10h3M15 14h2"/>',
 'tax': '<path d="M6 3h12v18l-3-2-3 2-3-2-3 2z"/><path d="M9 8h6M9 12h6M9 16h3"/>',
 'qr': '<rect x="4" y="4" width="6" height="6"/><rect x="14" y="4" width="6" height="6"/><rect x="4" y="14" width="6" height="6"/><path d="M14 14h2v2h-2zM18 18h2v2h-2zM14 18h2M18 14h2"/>',
 'hos': '<rect x="4" y="7" width="16" height="14"/><path d="M12 10.5v6M9 13.5h6M9 7V4h6v3"/>',
 'plus': '<circle cx="12" cy="12" r="8.5"/><path d="M12 8v8M8 12h8"/>',
 'bank': '<path d="M3 9l9-5 9 5M5 10.5v7M9.7 10.5v7M14.3 10.5v7M19 10.5v7M3 20h18"/>',
 'card': '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20M6 15h4"/>',
 'scan': '<path d="M4 8V4h4M16 4h4v4M20 16v4h-4M8 20H4v-4"/><circle cx="12" cy="11" r="2.6"/><path d="M8 16.5c1-2 7-2 8 0"/>',
 'scale': '<path d="M12 4v16M7 20h10M5 8h14M5 8l-2.5 6a2.8 2.8 0 0 0 5 0zM19 8l-2.5 6a2.8 2.8 0 0 0 5 0z"/>',
 'car': '<path d="M3 15l2-5.5A2 2 0 0 1 6.9 8h10.2A2 2 0 0 1 19 9.5l2 5.5v3H3z"/><circle cx="7.5" cy="18" r="1.5"/><circle cx="16.5" cy="18" r="1.5"/><path d="M3 13h18"/>',
 'home': '<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/><path d="M9 21v-6h6v6"/>',
 'shield': '<path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z"/><path d="M9 12l2 2 4-4"/>',
 'heart': '<path d="M20.8 6.6a5 5 0 0 0-8.8-1.9 5 5 0 0 0-8.8 1.9c-.9 4 3 7.6 8.8 12.4 5.8-4.8 9.7-8.4 8.8-12.4z"/>',
 'users': '<circle cx="9" cy="8" r="3"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><circle cx="17" cy="9" r="2.3"/><path d="M16.5 14c2.6.2 4.5 2.3 4.5 5"/>',
 'gift': '<rect x="3" y="8" width="18" height="13" rx="1"/><path d="M12 8v13M3 12h18M12 8c-2-4-6-4-6-1.5S9 8 12 8zm0 0c2-4 6-4 6-1.5S15 8 12 8z"/>',
 'medal': '<circle cx="12" cy="14" r="6"/><path d="M8.5 9 6 3h4l2 4 2-4h4l-2.5 6"/><path d="M12 11.5v5M10 14h4"/>',
 'search': '<circle cx="11" cy="11" r="6"/><path d="M20 20l-4.6-4.6"/>',
 'grid': '<rect x="4" y="4" width="16" height="16"/><path d="M4 12h16M12 4v16"/>',
 'link': '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
 'bolt': '<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
 'trend': '<path d="M3 17l6-6 4 4 8-8"/><path d="M15 7h6v6"/>',
 'cpu': '<rect x="6" y="6" width="12" height="12" rx="1.5"/><path d="M9.5 9.5h5v5h-5zM9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3"/>',
 'map': '<path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2z"/><path d="M9 4v14M15 6v14"/>',
 'gov': '<path d="M3 10l9-6 9 6M5 10v8M10 10v8M14 10v8M19 10v8M3 21h18"/>',
 'phone': '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>',
 'mail': '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
 'pin': '<path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/>',
 'clock': '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
 'doc': '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M12 12v6M9 15l3 3 3-3"/>',
 'book': '<path d="M4 19V5a2 2 0 0 1 2-2h13v14H6a2 2 0 0 0-2 2zm0 0a2 2 0 0 0 2 2h13M9 7h6M9 11h4"/>',
 'flag': '<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>',
 'eye': '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
 'compass': '<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>',
 'check': '<path d="M5 12.5l4.2 4.2L19 7"/>',
 'person': '<circle cx="12" cy="8.5" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/>',
 'photo': '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="10" r="1.8"/><path d="M21 16l-5-5-8 8"/>',
}
def ic(n, size=22, sw=1.7):
    return f'<svg width="{size}" height="{size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="{sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">{I[n]}</svg>'
ARROW = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"></path></svg>'
SP = f'<svg viewBox="0 0 24 24">{SPK}</svg>'

def img(k, cls='ph hasimg', style='', alt=None):
    a, c = CR[k]
    return f'<div class="{cls}" style="{style}"><img src="{B[k]}" alt="{alt or a}" loading="lazy" decoding="async"><span class="cr">{c}</span></div>'

EXTRA_CSS = r'''
/* ---- sub-pages: same system as Home ---- */
.dk-sec .cell p,.dk-sec .lead{color:#a39d98}
.crumb{font-size:12px;color:#8a8a8a;letter-spacing:.04em}.crumb a{color:#8a8a8a;text-decoration:none}.crumb a:hover{color:#ca4d25}
.phero .cells{height:520px}
.phero .fade{top:360px}
.subnav{display:grid;grid-template-columns:repeat(5,minmax(0,1fr))}
.subnav a{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:18px 24px;font-size:14px;font-weight:500;color:#5c5c5c;text-decoration:none;transition:background .2s,color .2s}
.subnav a:hover{background:#fafafa;color:#201e1d}
.subnav a.on{background:#fdf1eb;color:#a63c1b}
.subnav a .num{font-size:12px}
.stat dd{font-size:56px;line-height:1;font-weight:600;letter-spacing:-0.02em;color:#ca4d25;font-variant-numeric:tabular-nums}
.stat dt{font-size:15px;color:#5c5c5c;margin-top:8px}
.stat{display:flex;flex-direction:column-reverse;justify-content:center;align-items:center;text-align:center;gap:4px;padding:36px 24px;margin:0}
.dk-sec .stat dd{color:#ef7a52}.dk-sec .stat dt{color:#a39d98}
.big-or{background:#ca4d25 !important;color:#fffaf6}
.big-or h4,.big-or p{color:#fffaf6 !important}
.big-or .ic{background:rgb(255 255 255 / 16%) !important;color:#fffaf6 !important}
.lead-q{font-size:30px;line-height:1.35;letter-spacing:-0.01em;font-weight:500;text-wrap:balance}
.lead-q span{color:#ca4d25}
.dk-sec .lead-q span{color:#ef7a52}
.tl-row{display:grid;grid-template-columns:10rem minmax(0,1.1fr) minmax(0,1fr)}
.tl-row>*{padding:24px 32px;display:flex;flex-direction:column;justify-content:center;gap:4px}
.tl-row .mo{font-size:28px;font-weight:600;letter-spacing:-0.02em;color:#ca4d25;font-variant-numeric:tabular-nums}
.tl-row h4{font-size:17px;font-weight:500;margin:0}
.tl-row p{font-size:14px;line-height:1.6;color:#5c5c5c}
.yr{display:flex;align-items:baseline;justify-content:space-between;gap:16px;padding:40px 40px 20px}
.yr b{font-size:64px;line-height:1;font-weight:600;letter-spacing:-0.03em}
.pkd{display:grid;grid-template-columns:repeat(11,minmax(0,1fr))}
.pkd>*{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:20px 4px;gap:2px}
.pkd b{font-size:24px;font-weight:600;color:#ca4d25;line-height:1}
.pkd span{font-size:11px;letter-spacing:.06em;color:#8a8a8a}
.ldr{display:grid;grid-template-columns:120px minmax(0,1fr);gap:24px;align-items:center;padding:32px}
.ldr .pt{width:120px;height:120px;border-radius:12px;background:repeating-linear-gradient(135deg,#f6dfd3 0 1px,transparent 1px 8px);border:1px solid #f6dfd3;display:flex;align-items:center;justify-content:center;color:#d9a48b}
.ldr .pt.on{border:2px solid #ca4d25}
.ldr h3{font-size:19px;font-weight:600}
.ldr .role{font-size:13px;font-weight:600;color:#ca4d25;margin-top:4px}
.ldr p{font-size:14px;line-height:1.6;color:#5c5c5c;margin-top:10px}
.mx{display:grid;grid-template-columns:15rem repeat(17,minmax(0,1fr));font-size:13px}
.mx>*{display:flex;align-items:center;justify-content:center;min-height:52px}
.mx .nm{justify-content:flex-start;padding:0 24px;font-weight:500}
.mx .hd{font-size:12px;color:#8a8a8a;min-height:44px}
.mx .d{width:14px;height:14px;border-radius:50%;background:#ca4d25}
.mx .e{width:4px;height:4px;border-radius:50%;background:#d9d6d3}
.mx .all{grid-column:span 17;justify-content:flex-start;padding-left:24px;color:#a63c1b;font-size:12px;letter-spacing:.04em}
.pillar h4{font-size:19px !important}
.chips-row{display:flex;gap:8px;flex-wrap:wrap}
.tagline{display:inline-flex;align-items:center;gap:8px;font-size:13px;color:#8a8a8a}
.tagline svg{width:14px;height:14px;fill:#ca4d25;stroke:#ca4d25;stroke-width:2;stroke-linejoin:round}
.gal{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));grid-auto-rows:260px}
.gal>.ph{border:0;border-radius:0}
.gal .w2{grid-column:span 2}.gal .h2r{grid-row:span 2}
.svc-anchor{display:grid;grid-template-columns:repeat(4,minmax(0,1fr))}
.svc-anchor a{display:flex;flex-direction:column;gap:6px;padding:24px 32px;text-decoration:none;color:#201e1d;transition:background .2s}
.svc-anchor a:hover{background:#fdf1eb}
.svc-anchor b{font-size:16px;font-weight:500}
.logos{display:flex;align-items:center;justify-content:center;gap:56px;flex-wrap:wrap;padding:28px 40px}
.logos img{display:block;width:auto;opacity:.85}
.cmt{display:grid;grid-template-columns:72px minmax(0,1fr)}
.cmt>*{padding:20px 24px;display:flex;flex-direction:column;justify-content:center;gap:4px}
.cmt b{font-size:28px;font-weight:300;color:#ca4d25}
.cmt h4{font-size:17px;font-weight:500;margin:0}
.cmt p{font-size:14px;color:#5c5c5c;line-height:1.6}
.map{min-height:420px;background-color:#fdf1eb;background-image:linear-gradient(to right,#f6dfd3 1px,transparent 1px),linear-gradient(to bottom,#f6dfd3 1px,transparent 1px);background-size:48px 48px;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:10px;color:#a63c1b;font-size:14px;text-align:center}
.map .pinb{width:56px;height:56px;border-radius:50%;background:#ca4d25;color:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 0 0 12px rgb(202 77 37 / 14%)}
@media (max-width:900px){.subnav{grid-template-columns:repeat(2,minmax(0,1fr))}.tl-row{grid-template-columns:1fr}.pkd{grid-template-columns:repeat(4,minmax(0,1fr))}.ldr{grid-template-columns:80px minmax(0,1fr);padding:24px 20px}.ldr .pt{width:80px;height:80px}.mx{display:none}.gal{grid-template-columns:1fr 1fr}.svc-anchor{grid-template-columns:1fr 1fr}.yr{padding:32px 20px 16px}.yr b{font-size:44px}.lead-q{font-size:22px}}
'''

NAV = [('Main.dc.html', 'Trang chủ'), ('About.dc.html', 'Giới thiệu'), ('Services.dc.html', 'Dịch vụ'),
       ('News.dc.html', 'Tin tức'), ('Gallery.dc.html', 'Thư viện'), ('Contact.dc.html', 'Liên hệ')]
ABOUT_GROUP = ['About.dc.html', 'History.dc.html', 'Organization.dc.html', 'Leadership.dc.html', 'Market.dc.html']
SUB = [('About.dc.html', '01', 'Thông tin công ty'), ('History.dc.html', '02', 'Lịch sử & Cột mốc'),
       ('Organization.dc.html', '03', 'Cơ cấu tổ chức'), ('Leadership.dc.html', '04', 'Ban lãnh đạo'),
       ('Market.dc.html', '05', 'Năng lực & Vị thế')]

def header(cur):
    on = 'About.dc.html' if cur in ABOUT_GROUP else cur
    links = '\n'.join(f'<a href="{h}"{ON if h == on else ""}>{t}</a>' for h, t in NAV)
    return f'''<header style="position: sticky; top: 0; z-index: 20; border-bottom: 1px solid #ebebeb; background: rgb(255 255 255 / 90%); backdrop-filter: blur(12px)">
<div class="box" style="display: flex; align-items: center; justify-content: space-between; gap: 16px; min-height: 64px; padding: 0 20px">
<a href="Main.dc.html" style="display: flex; align-items: center; gap: 10px; text-decoration: none; color: #201e1d">
<img src="{B['logo']}" alt="Logo Minh Group ST" width="40" height="40" style="width: 40px; height: 40px; object-fit: contain; mix-blend-mode: multiply">
<span style="font-weight: 600; font-size: 15px; letter-spacing: .02em">Minh Group ST</span>
</a>
<nav class="nav" aria-label="Điều hướng chính" style="display: flex; gap: 2px">
{links}
</nav>
<div style="display: flex; align-items: center; gap: 8px">
<div class="lang" role="group" aria-label="Ngôn ngữ / Language"><a href="{cur}" aria-current="true" hreflang="vi">VI</a><a href="MainEN.dc.html" hreflang="en" lang="en">EN</a></div>
<a class="btn btn-p" href="Contact.dc.html">Liên hệ hợp tác</a>
</div>
</div>
</header>'''

FOOTER = f'''<footer class="fd">
<div class="box">
<div class="rg ft" style="grid-template-columns: 1.4fr repeat(3, minmax(0, 1fr))">
<div class="pad" style="padding: 56px 40px 40px; display: flex; flex-direction: column; gap: 12px"><img src="{B['logo']}" alt="Logo Minh Group ST" width="48" height="48" style="width: 48px; height: 48px; object-fit: contain; border-radius: 12px; background: #ffffff; padding: 4px"><span style="font-weight: 600; color: #ffffff">Công ty TNHH Minh Group ST</span><span style="font-size: 14px; line-height: 1.6; color: #a3a3a3">{ADDR}<br>MST: [Mã số thuế]</span><a href="{HOT_T}" style="font-size: 22px; font-weight: 500; color: #ffffff; margin-top: 4px">{HOT}</a><a href="mailto:{MAIL}" style="font-size: 14px">{MAIL}</a></div>
<div style="padding: 56px 32px 40px; display: flex; flex-direction: column; gap: 10px"><span class="mono" style="font-size: 13px; font-weight: 600; color: #ffffff">Giới thiệu</span><a href="About.dc.html">Thông tin công ty</a><a href="History.dc.html">Lịch sử &amp; Cột mốc</a><a href="Organization.dc.html">Cơ cấu tổ chức</a><a href="Leadership.dc.html">Ban lãnh đạo</a><a href="Market.dc.html">Năng lực &amp; Vị thế</a></div>
<div style="padding: 56px 32px 40px; display: flex; flex-direction: column; gap: 10px"><span class="mono" style="font-size: 13px; font-weight: 600; color: #ffffff">Lĩnh vực</span><a href="Services.dc.html#cds">Chuyển đổi số &amp; Y tế số</a><a href="Services.dc.html#tc">Tài chính – Ngân hàng</a><a href="Services.dc.html#bh">Bảo hiểm &amp; An sinh</a><a href="Services.dc.html#ct">Chi trả BTXH &amp; Dự án</a></div>
<div style="padding: 56px 32px 40px; display: flex; flex-direction: column; gap: 10px"><span class="mono" style="font-size: 13px; font-weight: 600; color: #ffffff">Kết nối</span><a href="https://zalo.me/">Zalo OA</a><a href="https://facebook.com/">Facebook</a><a href="News.dc.html">Tin tức</a><a href="Gallery.dc.html">Thư viện</a></div>
</div>
<p class="mono pad" style="border-top: 1px solid #34302d; padding: 16px 40px; font-size: 12px; color: #8a8a8a; display: flex; justify-content: space-between; flex-wrap: wrap; gap: 8px"><span>© 2026 Minh Group ST</span><span>Tiên phong số hóa · Hiệu quả bứt phá</span></p>
<div class="wm" aria-hidden="true">MINH GROUP<span>.</span></div>
</div>
</footer>'''

DOCK = f'''<div aria-label="Liên hệ nhanh" style="position: fixed; right: 20px; bottom: 20px; display: flex; flex-direction: column; gap: 8px; z-index: 30">
<a class="dk" href="https://zalo.me/" aria-label="Zalo OA" style="color: #0068ff">Zalo</a>
<a class="dk" href="https://m.me/" aria-label="Facebook Messenger"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3C7 3 3 6.6 3 11.2c0 2.5 1.2 4.7 3.1 6.2V21l3-1.7c.9.3 1.9.4 2.9.4 5 0 9-3.6 9-8.3S17 3 12 3z"></path><path d="M7.5 13l3-3 2.5 2 3.5-3"></path></svg></a>
<a class="dk" href="{HOT_T}" aria-label="Gọi hotline {HOT}">{ic('phone',20,2)}</a>
<a class="dk dk-chat" href="Contact.dc.html#tu-van" aria-label="Gửi yêu cầu tư vấn"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"></path><path d="M8.5 11h.01M12 11h.01M15.5 11h.01"></path></svg></a>
</div>'''

def hero(cur, crumb, pill, h1, lead, deco):
    """Home-style hero: ruled cells, a few hatched/icon cells and sparkle nodes, centred title."""
    cells = ''
    for kind, col, row, extra in deco:
        if kind == 'ht':
            cells += f'<span class="hc ht" aria-hidden="true" style="left: calc(100% * {col} / 11); top: {row*96}px"></span>'
        elif kind == 'ic':
            cells += f'<span class="hc ic2" aria-hidden="true" style="left: calc(100% * {col} / 11); top: {row*96}px; animation-delay: {extra}s"><svg viewBox="0 0 24 24">{I[deco_icon[(col,row)]]}</svg></span>' if False else f'<span class="hc ic2" aria-hidden="true" style="left: calc(100% * {col} / 11); top: {row*96}px; animation-delay: {extra[1]}s"><svg viewBox="0 0 24 24">{I[extra[0]]}</svg></span>'
        elif kind == 'hn':
            cells += f'<span class="hn{" rv" if extra else ""}" aria-hidden="true" style="left: calc(100% * {col} / 11); top: {row*96}px; animation-delay: .{col}s">{SP}</span>'
    trail = ' / '.join(f'<a href="{h}">{t}</a>' if h else t for h, t in crumb)
    return f'''<section class="hero phero">
<div class="box">
<div class="cells" aria-hidden="true"></div>
{cells}
<div class="fade" aria-hidden="true"></div>
<div class="pad" style="position: relative; display: flex; flex-direction: column; align-items: center; text-align: center; padding: 88px 40px 96px">
<p class="crumb rise">{trail}</p>
<span class="pill rise" style="margin-top: 20px; animation-delay: .04s"><span class="nb">{pill[0]}</span>{pill[1]}<span class="tg">{ic('compass',12,2.4) if False else '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"></path></svg>'}</span></span>
<h1 class="h1 rise" style="margin-top: 24px; max-width: 880px; font-size: 54px; line-height: 1.08; letter-spacing:-0.01em; text-wrap: balance; animation-delay: .08s">{h1}</h1>
<p class="lead rise" style="margin-top: 20px; animation-delay: .16s">{lead}</p>
</div>
</div>
</section>'''

def subnav(cur):
    links = ''.join(f'<a href="{h}"{ONP if h == cur else ""}><span>{t}</span><span class="num">{n}</span></a>' for h, n, t in SUB)
    return f'''<section class="sec">
<div class="box">
<span class="x l"></span><span class="x r"></span>
<nav class="rg subnav" aria-label="Giới thiệu">{links}</nav>
</div>
</section>'''

def sec(inner, cls='sec', aria=''):
    return f'''<section class="{cls}"{aria}>
<div class="box">
<span class="x l"></span><span class="x r"></span>
{inner}
</div>
</section>'''

def head_block(h2, lead=None, center=True, pad='88px 40px 56px', size=None):
    st = f' style="font-size: {size}px"' if size else ''
    al = 'align-items: center; text-align: center' if center else ''
    lp = f'<p class="lead">{lead}</p>' if lead else ''
    return f'<div class="pad" style="padding: {pad}; display: flex; flex-direction: column; gap: 20px; {al}"><h2 class="h2"{st}>{h2}</h2>{lp}</div>'

def stats(items, lead=None, note=None, dark=False):
    cols = ('1.5fr ' if lead else '') + f'repeat({len(items)}, minmax(0, 1fr))'
    first = f'<div class="pad" style="display: flex; align-items: center; padding: 36px 40px"><p style="font-size: 26px; line-height: 1.4; letter-spacing: -0.01em; text-wrap: pretty">{lead}</p></div>' if lead else ''
    cells = ''.join(f'<dl class="stat"><dt>{t}</dt><dd>{n}</dd></dl>' for n, t in items)
    nt = f'<p class="mono pad" style="border-top: 1px solid {"#3a3633" if dark else "#ebebeb"}; padding: 12px 40px; font-size: 12px; color: #8a8a8a; text-align: center">{note}</p>' if note else ''
    return f'<div class="rg" style="grid-template-columns: {cols}">{first}{cells}</div>{nt}'

def cells(items, cols=2, link=None, top=True):
    out = []
    for it in items:
        icn, h, p = it[:3]; extra = it[3] if len(it) > 3 else ''
        tag = 'a' if link else 'div'
        href = f' href="{link}"' if link else ''
        go = '<span class="go" aria-hidden="true">↗</span>' if link else ''
        out.append(f'<li><{tag}{href} class="cell {extra}" style="height: 100%; box-sizing: border-box"><span class="ic" aria-hidden="true">{ic(icn)}</span><div style="display: flex; justify-content: space-between; gap: 12px"><h4>{h}</h4>{go}</div><p>{p}</p></{tag}></li>')
    bt = ' border-top: 1px solid #ebebeb;' if top else ''
    return f'<ul class="rg" style="grid-template-columns: repeat({cols}, minmax(0, 1fr));{bt} margin: 0">{"".join(out)}</ul>'

def frow(k, h3, p, items, link='Services.dc.html', tag=None, anchor=''):
    t = f'<span class="tag" style="align-self: flex-start">{tag}</span>' if tag else ''
    aid = f' id="{anchor}"' if anchor else ''
    return f'''<div class="frow"{aid}>
<div class="fcard"><span class="fbg" aria-hidden="true" style="background-image: url('{B[k]}')"></span><h3 style="font-size: 20px">{h3}</h3>{t}<p style="font-size: 14px; line-height: 1.6; color: #5c5c5c">{p}</p></div>
{cells(items, 2, link, top=False)}
</div>'''

def vband(words):
    t = ''
    for _ in range(4):
        for w in words:
            t += f'<span>{w}</span><svg class="vb-spk" viewBox="0 0 24 24" aria-hidden="true">{SPK}</svg>'
    return f'<section class="vband" aria-label="{", ".join(words)}"><div class="vb-track" aria-hidden="true">{t}</div></section>'

PARTNERS = sec(f'''<div class="rg" style="grid-template-columns: auto minmax(0, 1fr)">
<p class="mono pad" style="display: flex; align-items: center; padding: 24px 40px; font-size: 13px; color: #5c5c5c; white-space: nowrap">Đồng hành cùng</p>
<div class="logos" style="justify-content: flex-start"><img src="{B['pvi']}" alt="PVI Insurance" style="height: 36px"><img src="{B['pti']}" alt="PTI – Bảo hiểm Bưu điện" style="height: 40px"><span style="font-size: 22px; font-weight: 800; letter-spacing: .14em; color: #d6d1cc">TASCO</span><img src="{B['vcb']}" alt="Vietcombank" style="height: 34px"><img src="{B['agri']}" alt="Agribank" style="height: 22px"><span class="mono" style="font-size: 13px; color: #a39d98">và hơn 12 ngân hàng thương mại</span></div>
</div>''', 'sec mq dk-sec')

def cta(h2='Cần một đối tác <span>có mặt tận địa bàn?</span>', lead='Gọi hotline hoặc để lại yêu cầu, chuyên viên khu vực sẽ liên hệ trong giờ hành chính.'):
    return sec(f'''<div class="rg" style="grid-template-columns: minmax(0, 1.3fr) minmax(0, 1fr)">
<div class="pad" style="padding: 72px 40px; display: flex; flex-direction: column; gap: 20px">
<h2 class="h2" style="font-size: 40px">{h2}</h2>
<p class="lead">{lead}</p>
<div style="display: flex; gap: 10px; flex-wrap: wrap"><a class="btn btn-p" href="Contact.dc.html#tu-van">Gửi yêu cầu {ARROW}</a><a class="btn btn-s" href="Services.dc.html">Xem các lĩnh vực</a></div>
</div>
<a href="{HOT_T}" class="pad" style="padding: 72px 40px; display: flex; flex-direction: column; justify-content: center; gap: 6px; text-decoration: none; color: #201e1d; background: #fdf1eb"><span class="mono" style="font-size: 13px; color: #a63c1b">Hotline</span><span style="font-size: 44px; font-weight: 500; letter-spacing: -0.01em">{HOT}</span><span style="font-size: 14px; color: #5c5c5c">{MAIL}</span></a>
</div>''')

def page(cur, title, body, h):
    css = HOME_CSS + EXTRA_CSS
    return f'''<!doctype html>
<html lang="vi">
<head>
<meta charset="utf-8">
<title>{title} – Minh Group ST</title>
<script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,300;0,14..32,400;0,14..32,500;0,14..32,600;0,14..32,800;1,14..32,400&amp;display=swap">
<style>{css}</style>
</helmet>
<div style="min-height: 100vh">
{header(cur)}
{body}
{FOOTER}
{DOCK}
</div>
</x-dc>
<script type="text/x-dc" data-dc-script data-props='{{"$preview":{{"width":1440,"height":{h}}}}}'>
class Component extends DCLogic {{
  renderVals() {{ return {{}}; }}
}}
</script>
</body>
</html>
'''

PAGES = {}

# ================= ABOUT =================
PAGES['About.dc.html'] = ('Thông tin công ty', '\n'.join([
 hero('About.dc.html', [('Main.dc.html','Trang chủ'), (None,'Giới thiệu'), (None,'Thông tin công ty')], ('Từ 2025', 'Doanh nghiệp đa lĩnh vực · Cần Thơ'),
      'Đồng hành cùng chính quyền và doanh nghiệp bằng <span style="color: #ca4d25">một hệ sinh thái giải pháp</span>',
      'Minh Group ST phát triển trên nền tảng chuyển đổi số, nghiên cứu – phát triển thị trường và hệ sinh thái giải pháp toàn diện cho miền Tây.',
      [('ht',0,0,None),('ic',10,1,('shield',0)),('ic',0,2,('bank',2.2)),('ht',10,3,None),('hn',2,1,0),('hn',9,3,1)]),
 subnav('About.dc.html'),
 sec(f'''<div class="rg" style="grid-template-columns: minmax(0, 1fr) minmax(0, 1fr)">
<div class="pad" style="padding: 88px 40px; display: flex; flex-direction: column; gap: 20px">
<h2 class="h2" style="font-size: 44px">Không chỉ cung cấp giải pháp, <span>mà trực tiếp đồng hành</span></h2>
<p class="lead">Công ty TNHH Minh Group ST là doanh nghiệp hoạt động đa lĩnh vực. Chúng tôi đồng hành cùng đối tác, khách hàng và cơ quan quản lý để tối ưu hóa hiệu quả vận hành và mở rộng thị trường.</p>
<p class="lead">Đội ngũ hơn 300 nhân sự trẻ, năng động phân bổ trực tiếp tại các tỉnh miền Tây: am hiểu sâu thị trường địa phương và chủ động thích ứng với chuyển động công nghệ.</p>
</div>
{img('a', style='min-height: 520px; border: 0')}
</div>'''),
 sec(stats([('300+','nhân sự trẻ tại các tỉnh miền Tây'),('11+1','phòng kinh doanh địa bàn và PKD Y'),('12+','ngân hàng thương mại đối tác'),('2.000+','lượt người dân được hỗ trợ mỗi ngày')], note='Số liệu theo hồ sơ năng lực Minh Group ST, 2026.')),
 sec(f'''<div class="rg" style="grid-template-columns: minmax(0, 1fr) minmax(0, 1fr)">
<div class="frow" style="grid-template-columns: 1fr; border-top: 0"><div class="fcard" style="min-height: 340px; padding-top: 72px"><span class="fbg" aria-hidden="true" style="background-image: url('{B['g']}')"></span><span class="num">Tầm nhìn</span><h3>Tập đoàn giải pháp đa lĩnh vực hàng đầu miền Tây</h3><p>Dẫn đầu về năng lực triển khai chuyển đổi số, kết nối tài chính và dịch vụ an sinh xã hội.</p></div></div>
<div class="frow" style="grid-template-columns: 1fr; border-top: 0"><div class="fcard" style="min-height: 340px; padding-top: 72px"><span class="fbg" aria-hidden="true" style="background-image: url('{B['b']}')"></span><span class="num">Sứ mệnh</span><h3>Đưa công nghệ đến gần từng người dân</h3><p>Đưa công nghệ và tiện ích hiện đại đến gần hơn với từng người dân, doanh nghiệp và tổ chức; tạo giá trị thực tiễn, bền vững cho cộng đồng.</p></div></div>
</div>'''),
 sec(head_block('Triết lý <span>hành động</span>', 'Bốn mệnh đề định hướng mọi quyết định của Minh Group ST.', pad='72px 40px 48px') +
     '<ul class="rg" style="grid-template-columns: repeat(4, minmax(0, 1fr)); border-top: 1px solid #3a3633; margin: 0">' +
     ''.join(f'<li class="cell{" big-or" if i==3 else ""}" style="padding: 40px 32px"><span class="ic" aria-hidden="true">{ic(n)}</span><p style="font-size: 14px">{a}</p><h4 style="font-size: 32px; font-weight: 500; letter-spacing: -0.02em">{b}</h4></li>' for i,(n,a,b) in enumerate([('bolt','Công nghệ tạo ra','Tốc độ'),('users','Con người tạo ra','Giá trị'),('trend','Thị trường tạo ra','Cơ hội'),('link','Sự kết nối tạo ra','Sức mạnh')])) + '</ul>', 'sec dk-sec'),
 sec(f'''<div class="rg" style="grid-template-columns: minmax(0, 1fr) minmax(0, 1fr)">
<div class="pad" style="padding: 88px 40px; display: flex; flex-direction: column; gap: 24px">
<span class="tagline">{SP} Câu chuyện thương hiệu</span>
<p class="lead-q">Thị trường không nằm trên những con số hay báo cáo lý thuyết. Thị trường được cấu thành từ <span>con người, nhu cầu sống và sự thay đổi từng ngày.</span></p>
</div>
<div class="pad" style="padding: 88px 40px; display: flex; flex-direction: column; gap: 20px; justify-content: center">
<p class="lead">Thay vì phát triển riêng lẻ từng mảng kinh doanh, Minh Group ST thiết lập mô hình hệ sinh thái đa tầng. Mỗi lĩnh vực bổ trợ cho nhau, tạo nên sức mạnh tổng hợp.</p>
<div class="chips-row">{''.join(f'<a class="chip" href="Services.dc.html#{a}" style="text-decoration: none">{t}</a>' for a,t in [('cds','Chuyển đổi số'),('tc','Tài chính – Ngân hàng'),('bh','Bảo hiểm'),('bh','An sinh xã hội'),('ct','Phát triển dự án')])}</div>
</div>
</div>'''),
 vband(['Nhanh chóng', 'Tin cậy', 'Hiệu quả']),
 sec(f'''<div class="rg" style="grid-template-columns: minmax(0, 1fr) auto">
<div class="pad" style="padding: 40px; display: flex; align-items: center; gap: 20px"><span class="ic" style="margin: 0">{ic('doc')}</span><div style="display: flex; flex-direction: column; gap: 4px"><h3 style="font-size: 19px">Hồ sơ năng lực Minh Group ST 2026</h3><span class="mono" style="font-size: 13px; color: #8a8a8a">PDF · 8 trang · song ngữ sẽ cập nhật</span></div></div>
<div class="pad" style="padding: 40px; display: flex; align-items: center"><a class="btn btn-p" href="#">Tải hồ sơ năng lực {ARROW}</a></div>
</div>''', 'sec'),
]), 3600)

# ================= HISTORY =================
EV25 = [('03','Thành lập Công ty TNHH Minh Group ST','Đặt nền móng vận hành và cấu trúc hoạt động tại miền Tây.'),
        ('04','Thành lập PKD Tổng hợp, PKD Y và PKD địa bàn 1, 2, 3, 5, 6, 7','Hợp tác hơn 12 ngân hàng; thúc đẩy chuyển đổi số y tế và địa phương.'),
        ('09','Thành lập PKD 8','Mở rộng độ phủ hỗ trợ chuyển đổi số.'),
        ('11','Thành lập PKD An sinh','Đẩy mạnh hoạt động BHXH, BHYT và an sinh cộng đồng.')]
EV26 = [('01','Thành lập Phòng Dự án','Hạt nhân xây dựng và thúc đẩy chiến lược kinh doanh.'),
        ('03','Thành lập PKD 9','Tiếp tục tăng cường mạng lưới chuyển đổi số.'),
        ('04','Thành lập Phòng Kế toán – Nhân sự*','Củng cố quản trị nội bộ và tối ưu vận hành.'),
        ('06','Thành lập PKD 4','Hoàn thiện mắt xích mạng lưới số hóa miền Tây.'),
        ('07','Thành lập Phòng Chi trả Bảo trợ xã hội','Chi trả hưu trí, trợ cấp và chế độ người có công.'),
        ('09','Thành lập PKD 10 và PKD 11','Hoàn thiện mạng lưới 11 phòng kinh doanh địa bàn.')]
def tl(year, sub, evs, last=False):
    rows = ''.join(f'<div class="rg tl-row" style="border-top: 1px solid #ebebeb"><div><span class="mo">{m}/{year}</span></div><div><h4>{t}</h4></div><div{BGOR if last and i==len(evs)-1 else ""}><p>{f}</p></div></div>' for i,(m,t,f) in enumerate(evs))
    return f'<div class="yr"><b>{year}</b><span class="mono" style="font-size: 13px; color: #8a8a8a">{sub}</span></div>{rows}'
PAGES['History.dc.html'] = ('Lịch sử & Cột mốc', '\n'.join([
 hero('History.dc.html', [('Main.dc.html','Trang chủ'), (None,'Giới thiệu'), (None,'Lịch sử & Cột mốc')], ('03/2025', 'Hành trình phát triển'),
      '18 tháng, <span style="color: #ca4d25">11 phòng kinh doanh</span> địa bàn',
      'Từ một pháp nhân mới thành lập đến mạng lưới 11 phòng kinh doanh địa bàn, PKD Y và 5 phòng chức năng.',
      [('ht',10,0,None),('ic',0,1,('flag',0)),('ic',10,3,('map',2.2)),('ht',0,3,None),('hn',1,1,0),('hn',9,2,1)]),
 subnav('History.dc.html'),
 sec(tl('2025','Đặt nền móng', EV25)),
 sec(tl('2026','Hoàn thiện mạng lưới', EV26, True) + '<p class="mono pad" style="border-top: 1px solid #ebebeb; padding: 12px 40px; font-size: 12px; color: #8a8a8a">* Mốc 04/2026 giữ theo hồ sơ gốc; cần xác nhận lại (có thể là 04/2025).</p>'),
 sec(stats([('03/2025','thành lập tại Cần Thơ'),('11','phòng kinh doanh địa bàn'),('1','PKD Y chuyên trách y tế'),('5','phòng chức năng')]), 'sec dk-sec'),
 cta(),
]), 2800)

# ================= ORGANIZATION =================
FUNC = [('grid','Phòng Dự án','"Bộ não" nghiên cứu và thực thi các dự án trọng điểm.'),
        ('heart','PKD An sinh','Tuyên truyền, vận động BHXH tự nguyện và BHYT hộ gia đình.'),
        ('gift','Phòng Chi trả BTXH','Chi trả lương hưu, trợ cấp, chế độ người có công.'),
        ('bank','PKD Tổng hợp','Đầu mối hợp tác với hơn 12 ngân hàng thương mại.'),
        ('users','Kế toán – Nhân sự','Quản trị nội bộ, tài chính và nguồn lực.')]
PAGES['Organization.dc.html'] = ('Cơ cấu tổ chức', '\n'.join([
 hero('Organization.dc.html', [('Main.dc.html','Trang chủ'), (None,'Giới thiệu'), (None,'Cơ cấu tổ chức')], ('11 + 1 + 5', 'Mạng lưới & phòng chức năng'),
      'Bộ máy gọn, <span style="color: #ca4d25">phủ sâu tận địa bàn</span>',
      'Ban Giám đốc điều phối 11 phòng kinh doanh địa bàn, PKD Y chuyên trách y tế và 5 phòng chức năng.',
      [('ic',0,0,('users',0)),('ht',10,1,None),('ht',0,3,None),('ic',10,3,('grid',2.2)),('hn',2,2,0),('hn',9,1,1)]),
 subnav('Organization.dc.html'),
 sec(f'''<div class="pad" style="padding: 48px 40px; display: flex; justify-content: center; background: #201e1d; color: #fff"><div style="display: flex; flex-direction: column; align-items: center; gap: 6px"><span class="mono" style="font-size: 12px; color: #a39d98">Điều hành</span><span style="font-size: 28px; font-weight: 600">Ban Giám đốc</span><a href="Leadership.dc.html" style="font-size: 14px; color: #ef7a52">Xem phân công phụ trách ↗</a></div></div>
<div class="rg" style="grid-template-columns: 2.2fr 1fr; border-top: 1px solid #ebebeb">
<div class="pad" style="padding: 32px 40px; display: flex; justify-content: space-between; align-items: baseline"><h3 style="font-size: 19px">Khối phòng kinh doanh địa bàn</h3><span class="mono" style="font-size: 13px; color: #8a8a8a">11 PKD · phủ các tỉnh miền Tây</span></div>
<div class="pad" style="padding: 32px 40px"><h3 style="font-size: 19px">Kênh y tế</h3></div>
</div>
<div class="rg" style="grid-template-columns: 2.2fr 1fr; border-top: 1px solid #ebebeb">
<div class="rg pkd">{''.join(f'<div><span>PKD</span><b>{i}</b></div>' for i in range(1,12))}</div>
<div class="big-or" style="display: flex; flex-direction: column; justify-content: center; padding: 20px 32px; gap: 4px"><span class="mono" style="font-size: 12px; opacity: .8">PKD Y</span><span style="font-size: 15px; line-height: 1.5">Sở Y tế, bệnh viện đa khoa, TTYT huyện, trạm y tế xã/phường</span></div>
</div>
<div class="pad" style="padding: 32px 40px; border-top: 1px solid #ebebeb"><h3 style="font-size: 19px">Phòng chức năng</h3></div>
{cells(FUNC, 5)}'''),
 sec(head_block('Mỗi khối <span>một vai trò rõ ràng</span>', None, pad='72px 40px 40px') + cells([
   ('map','11 PKD địa bàn','Nhân sự có mặt trực tiếp tại địa phương: hỗ trợ VNeID, eTax, thanh toán QR, mở tài khoản và sản phẩm tài chính.'),
   ('hos','PKD Y','Đồng hành cùng Sở Y tế, bệnh viện và trạm y tế: số hóa hồ sơ sức khỏe, viện phí không tiền mặt, tiếp đón bệnh nhân qua nền tảng số.'),
   ('grid','Phòng Dự án','Nghiên cứu thị trường, xây dựng mô hình kinh doanh khả thi, kết nối vốn và đối tác công – tư (PPP).'),
   ('gift','Phòng Chi trả BTXH','Mảng đặc thù: đúng đối tượng, đúng số tiền, đúng thời gian; kiểm soát tài chính nghiêm ngặt.')], 2)),
 cta(),
]), 2800)

# ================= LEADERSHIP =================
LDR = [('Ông Đinh Hoàng Minh','Cố vấn Cao cấp','Phòng Kế toán Tổng hợp, Phòng Kinh doanh Tổng hợp',['TH','KT'],False),
       ('Ông Đinh Hoàng Công','Giám đốc Công ty','Phòng Kinh doanh Y (PKD Y); phụ trách chung toàn bộ Công ty',['Y'],True),
       ('Ông Lư Hồng Huỳnh','Phó Giám đốc','Khối PKD địa bàn: PKD 3, 4, 5, 9, 11',['3','4','5','9','11'],False),
       ('Bà Nguyễn Thị Hồng Huệ','Phó Giám đốc','Khối PKD địa bàn: PKD 2, 6, 7',['2','6','7'],False),
       ('Ông Phan Hữu Linh','Phó Giám đốc','Khối chuyên trách: Phòng Dự án, Phòng Chi trả, PKD An sinh',['DA','CT','AS'],False),
       ('Ông Dương Minh Trường','Phó Giám đốc','Khối PKD địa bàn: PKD 1, 8, 10',['1','8','10'],False)]
U = ['1','2','3','4','5','6','7','8','9','10','11','Y','TH','KT','DA','CT','AS']
def matrix():
    h = '<div class="nm hd">Lãnh đạo · đơn vị</div>' + ''.join(f'<div class="hd">{u}</div>' for u in U)
    rows = ''
    for n, r, s, us, gm in LDR:
        rows += f'<div class="nm">{n}</div>' + ''.join(f'<div><span class="{"d" if u in us else "e"}"></span></div>' for u in U)
    return f'<div class="rg mx" style="border-top: 1px solid #ebebeb">{h}{rows}</div>'
PAGES['Leadership.dc.html'] = ('Ban lãnh đạo', '\n'.join([
 hero('Leadership.dc.html', [('Main.dc.html','Trang chủ'), (None,'Giới thiệu'), (None,'Ban lãnh đạo')], ('6', 'Lãnh đạo phụ trách theo khối'),
      'Ban lãnh đạo <span style="color: #ca4d25">phụ trách theo khối</span>',
      'Mỗi đơn vị có một lãnh đạo phụ trách trực tiếp, nên đối tác luôn biết cần làm việc với ai.',
      [('ht',0,0,None),('ic',10,0,('person',0)),('ic',0,2,('users',2.2)),('ht',10,3,None),('hn',1,3,0),('hn',9,1,1)]),
 subnav('Leadership.dc.html'),
 sec('<ul class="rg" style="grid-template-columns: repeat(2, minmax(0, 1fr)); margin: 0">' + ''.join(
   f'<li class="ldr"{BGOR if gm else ""}><span class="pt{" on" if gm else ""}" aria-hidden="true">{ic("person",40,1.2)}</span><div><h3>{n}</h3><p class="role">{r}</p><p>{s}</p></div></li>' for n,r,s,us,gm in LDR) + '</ul>'
   + '<p class="mono pad" style="border-top: 1px solid #ebebeb; padding: 12px 40px; font-size: 12px; color: #8a8a8a">Ảnh chân dung đang để trống, chờ ảnh chụp chính thức cùng phông nền.</p>'),
 sec(head_block('Ai phụ trách <span>đơn vị nào</span>', 'Ma trận phân công theo hồ sơ năng lực. Giám đốc phụ trách PKD Y và điều hành chung toàn công ty.', pad='72px 40px 40px') + matrix()
   + '<p class="mono pad" style="border-top: 1px solid #ebebeb; padding: 12px 40px; font-size: 12px; color: #8a8a8a">Y · PKD Y   TH · KD Tổng hợp   KT · Kế toán – Nhân sự   DA · Dự án   CT · Chi trả BTXH   AS · An sinh</p>'),
 cta('Làm việc trực tiếp <span>với đúng người phụ trách</span>', 'Liên hệ hotline để được kết nối với lãnh đạo phụ trách khối hoặc địa bàn bạn quan tâm.'),
]), 2780)

# ================= MARKET =================
PIL = [('cpu','Công nghệ','Giải pháp số hóa hiện đại.'),('bank','Tài chính','Mạng lưới hơn 12 ngân hàng đối tác.'),
       ('shield','Bảo hiểm','Sản phẩm bảo vệ toàn diện từ PVI, PTI, TASCO.'),('heart','An sinh','Tuyên truyền BHXH, BHYT sâu rộng.'),
       ('map','Địa phương','Đồng hành khăng khít cùng chính quyền.'),('link','Đối tác','Cùng phát triển, chia sẻ giá trị.'),
       ('trend','Doanh nghiệp','Giải pháp marketing và phát triển thị trường.')]
PAGES['Market.dc.html'] = ('Năng lực & Vị thế', '\n'.join([
 hero('Market.dc.html', [('Main.dc.html','Trang chủ'), (None,'Giới thiệu'), (None,'Năng lực & Vị thế')], ('7', 'Trụ cột hệ sinh thái'),
      'Sức mạnh nằm ở <span style="color: #ca4d25">khả năng kết nối</span>',
      'Bảy yếu tố liên kết với nhau tạo nên năng lực mà một đơn vị đơn lẻ khó sao chép.',
      [('ic',0,0,('link',0)),('ht',10,0,None),('ht',0,2,None),('ic',10,2,('cpu',2.2)),('hn',2,3,0),('hn',9,1,1)]),
 subnav('Market.dc.html'),
 sec(head_block('Hệ sinh thái <span>7 trụ cột</span>', None, pad='72px 40px 40px') +
     '<ul class="rg" style="grid-template-columns: repeat(4, minmax(0, 1fr)); border-top: 1px solid #ebebeb; margin: 0">' +
     ''.join(f'<li class="cell pillar"><span class="num">0{i+1}</span><span class="ic" aria-hidden="true">{ic(n)}</span><h4>{h}</h4><p>{p}</p></li>' for i,(n,h,p) in enumerate(PIL)) +
     '<li class="cell big-or" style="justify-content: flex-end"><span style="font-size: 72px; font-weight: 300; line-height: 1">7</span><h4 style="font-size: 19px">trụ cột, một hệ sinh thái</h4><p>Mỗi trụ cột bổ trợ cho các trụ cột còn lại.</p></li></ul>'),
 sec(head_block('Lợi thế cạnh tranh <span>cốt lõi</span>', None, pad='72px 40px 40px') +
     '<ul class="rg" style="grid-template-columns: repeat(3, minmax(0, 1fr)); border-top: 1px solid #3a3633; margin: 0">' +
     ''.join(f'<li class="cell" style="padding: 40px 32px"><span class="num">0{i+1}</span><span class="ic" aria-hidden="true">{ic(n)}</span><h4 style="font-size: 20px">{h}</h4><p>{p}</p><span style="font-size: 44px; font-weight: 600; color: #ef7a52; margin-top: 12px">{s}</span></li>' for i,(n,h,p,s) in enumerate([
        ('map','Mạng lưới phủ rộng','Hơn 300 nhân sự phủ khắp các địa bàn miền Tây.','300+'),
        ('users','Am hiểu bản địa','Nắm chính xác thói quen, tâm lý người dân và doanh nghiệp ĐBSCL.','ĐBSCL'),
        ('link','Năng lực thực thi kép','Vừa lập chiến lược, vừa có lực lượng triển khai tận cơ sở.','2×')])) + '</ul>', 'sec dk-sec'),
 sec(f'''<div class="rg" style="grid-template-columns: minmax(0, 1fr) minmax(0, 1fr)">
{img('k', style='min-height: 460px; border: 0')}
<div class="pad" style="padding: 72px 40px; display: flex; flex-direction: column; gap: 20px">
<h2 class="h2" style="font-size: 40px">Định hướng <span>giai đoạn tới</span></h2>
<ul style="display: flex; flex-direction: column; gap: 0; margin-top: 8px">{''.join(f'<li style="display: grid; grid-template-columns: 48px 1fr; gap: 16px; padding: 20px 0; border-top: 1px solid #ebebeb"><span class="num" style="font-size: 20px">0{i+1}</span><div><h4 style="font-size: 17px; font-weight: 500; margin: 0">{h}</h4><p style="font-size: 14px; line-height: 1.6; color: #5c5c5c; margin-top: 6px">{p}</p></div></li>' for i,(h,p) in enumerate([
   ('Mở rộng địa bàn','Gia tăng nhân sự và hoàn thiện mạng lưới chi nhánh tại 13 tỉnh thành ĐBSCL.'),
   ('Đẩy mạnh AI & Digital','Ứng dụng trí tuệ nhân tạo và tự động hóa vào quản lý, nâng năng lực hỗ trợ số hóa người dân.'),
   ('Củng cố quan hệ chiến lược','Liên kết sâu rộng với định chế tài chính, tập đoàn bảo hiểm và cơ quan nhà nước.')]))}</ul>
</div>
</div>'''),
 PARTNERS,
 cta(),
]), 3420)

# ================= SERVICES =================
def svc_head(anchor, n, title, lead, k):
    return f'''<div id="{anchor}" class="rg" style="grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr)">
<div class="pad" style="padding: 72px 40px; display: flex; flex-direction: column; gap: 16px"><span class="num" style="font-size: 15px">Lĩnh vực {n}</span><h2 class="h2" style="font-size: 44px">{title}</h2><p class="lead">{lead}</p></div>
{img(k, style='min-height: 360px; border: 0')}
</div>'''
HEALTH = '<div class="rg" style="grid-template-columns: repeat(4, minmax(0, 1fr)); border-top: 1px solid #ebebeb">' + ''.join(
  f'<div class="cell" style="padding: 24px 32px{"; background: #fdf1eb" if i==3 else ""}"><span class="num">0{i+1}</span><h4>{t}</h4></div>' for i,t in enumerate(['Sở Y tế','Bệnh viện đa khoa','Trung tâm Y tế huyện','Trạm Y tế xã/phường'])) + '</div>'
PAGES['Services.dc.html'] = ('Dịch vụ', '\n'.join([
 hero('Services.dc.html', [('Main.dc.html','Trang chủ'), (None,'Dịch vụ')], ('4', 'Lĩnh vực mũi nhọn'),
      'Bốn lĩnh vực mũi nhọn, <span style="color: #ca4d25">một hệ sinh thái</span>',
      'Chuyển đổi số, tài chính – ngân hàng, bảo hiểm và an sinh xã hội, cùng Phòng Dự án làm hạt nhân chiến lược.',
      [('ic',0,0,('id',0)),('ic',10,1,('bank',2.2)),('ic',0,2,('shield',4.4)),('ic',10,3,('gift',6.6)),('hn',2,1,0),('hn',9,3,1)]),
 sec('<nav class="rg svc-anchor" aria-label="Các lĩnh vực">' + ''.join(f'<a href="#{a}"><span class="num">0{i+1}</span><b>{t}</b></a>' for i,(a,t) in enumerate([('cds','Chuyển đổi số & Y tế số'),('tc','Tài chính – Ngân hàng'),('bh','Bảo hiểm & An sinh'),('ct','Chi trả BTXH & Dự án')])) + '</nav>'),
 sec(svc_head('cds','01','Đưa công nghệ <span>đến gần dân</span>','Mũi nhọn hàng đầu: cầu nối đưa ứng dụng số vào đời sống thực tế của người dân và chính quyền địa phương.','b')
     + cells([('id','Định danh điện tử VNeID','Hướng dẫn, kích hoạt và xử lý vướng mắc khi sử dụng.'),('tax','Thuế số eTax Mobile','Cài đặt, thao tác cho người dân và hộ kinh doanh.'),('qr','Thanh toán không tiền mặt','Mở tài khoản, tạo mã QR tại chợ, tuyến đường văn minh, cửa hàng.'),('users','2.000+ lượt mỗi ngày','Người dân được nhân sự Minh Group ST tiếp cận và hỗ trợ trực tiếp.')], 4)
     + '<div class="pad" style="padding: 32px 40px; border-top: 1px solid #ebebeb; display: flex; justify-content: space-between; gap: 16px; flex-wrap: wrap"><h3 style="font-size: 19px">Số hóa kênh y tế · PKD Y</h3><span class="mono" style="font-size: 13px; color: #8a8a8a">Hồ sơ sức khỏe điện tử · Viện phí không tiền mặt · Tiếp đón bệnh nhân qua nền tảng số</span></div>' + HEALTH),
 sec(svc_head('tc','02','Cầu nối ngân hàng <span>và thị trường miền Tây</span>','Qua Phòng Kinh doanh Tổng hợp, Minh Group ST là đối tác chiến lược tin cậy của hơn 12 ngân hàng thương mại hàng đầu Việt Nam.','f')
     + cells([('card','Mở rộng mạng lưới khách hàng','Tài khoản, thẻ, tín dụng, giải pháp thanh toán đến cả đô thị và nông thôn.'),('scan','Hỗ trợ ngân hàng chuyển đổi số','Ra quân mở tài khoản số, chuẩn hóa sinh trắc học cho khách hàng tại địa phương.'),('scale','Tư vấn giải pháp tài chính','Đơn vị tư vấn độc lập, giúp chọn giải pháp vốn phù hợp năng lực thực tế.')], 3)),
 sec(svc_head('bh','03','Bảo vệ tài chính <span>từng gia đình</span>','Đại lý tổ chức uy tín của các Tổng Công ty Bảo hiểm lớn như PVI, PTI, TASCO; nhân sự lưu động hỗ trợ thủ tục ngay tại địa bàn.','a')
     + f'<div class="rg" style="grid-template-columns: minmax(0, 1fr); border-top: 1px solid #ebebeb"><div class="logos"><img src="{B["pvi"]}" alt="PVI Insurance" style="height: 34px; filter: invert(1) brightness(.35)"><img src="{B["pti"]}" alt="PTI – Bảo hiểm Bưu điện" style="height: 38px; filter: invert(1) brightness(.35)"><span style="font-size: 22px; font-weight: 800; letter-spacing: .14em; color: #3a3633">TASCO</span></div></div>'
     + cells([('home','Bảo hiểm tài sản','Cho hộ gia đình, hộ kinh doanh và doanh nghiệp.'),('car','Xe cơ giới','Bảo hiểm bắt buộc và tự nguyện cho xe máy, ô tô.'),('scale','Trách nhiệm dân sự','Bảo vệ trước nghĩa vụ bồi thường cho bên thứ ba.'),('plus','Tai nạn','Bảo vệ cá nhân và gia đình trước rủi ro.')], 4)
     + '<div class="pad" style="padding: 32px 40px; border-top: 1px solid #ebebeb"><h3 style="font-size: 19px">Phòng Kinh doanh An sinh</h3></div>'
     + cells([('shield','BHXH tự nguyện','Phối hợp chính quyền tuyên truyền, vận động người dân tham gia.'),('heart','BHYT hộ gia đình','Giúp người dân tự tin bảo vệ tài chính gia đình trước rủi ro cuộc sống.')], 2)),
 sec(svc_head('ct','04','Trao giá trị – <span>gửi trọn trách nhiệm</span>','Phòng Chi trả Bảo trợ xã hội: mảng đặc thù, đòi hỏi sự chuẩn xác và đạo đức nghề nghiệp nghiêm túc.','k')
     + '<div class="rg" style="grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); border-top: 1px solid #ebebeb">'
     + '<div class="pad" style="padding: 40px; display: flex; flex-direction: column; gap: 16px"><span class="num">Đối tượng phục vụ</span><div class="chips-row">' + ''.join(f'<span class="chip">{t}</span>' for t in ['Người hưởng lương hưu','Trợ cấp bảo trợ xã hội','Người có công với cách mạng','Thụ hưởng chương trình mục tiêu']) + '</div></div>'
     + '<div class="rg" style="grid-template-columns: 1fr">' + ''.join(f'<div class="cmt" style="background: {"#fdf1eb" if i==0 else "#ffffff"}"><b>0{i+1}</b><div><h4>{h}</h4><p>{p}</p></div></div>' for i,(h,p) in enumerate([('Chính xác','Đúng đối tượng, đúng số tiền, đúng thời gian.'),('Trách nhiệm','Tuân thủ quy trình kiểm soát tài chính nghiêm ngặt.'),('Tận tâm','Phục vụ chu đáo người lớn tuổi, gia đình chính sách.')])) + '</div></div>'
     + '<div class="pad" style="padding: 32px 40px; border-top: 1px solid #ebebeb; display: flex; justify-content: space-between; gap: 16px; flex-wrap: wrap"><h3 style="font-size: 19px">Phòng Dự án · Hạt nhân chiến lược</h3><span class="mono" style="font-size: 13px; color: #8a8a8a">"Bộ não" nghiên cứu và thực thi dự án trọng điểm</span></div>'
     + '<ol class="rg" style="grid-template-columns: repeat(3, minmax(0, 1fr)); border-top: 1px solid #ebebeb; margin: 0; padding: 0; list-style: none">' + ''.join(f'<li class="cell" style="padding: 32px"><span class="num">Bước {i+1}</span><span class="ic" aria-hidden="true">{ic(n)}</span><h4>{h}</h4><p>{p}</p></li>' for i,(n,h,p) in enumerate([('search','Nghiên cứu thị trường','Khảo sát nhu cầu, phân tích đối thủ và tiềm năng vùng.'),('grid','Xây dựng mô hình','Biến ý tưởng thành phương án vận hành khả thi, có khả năng sinh lời.'),('link','Kết nối nguồn lực','Gọi vốn, kết nối đối tác công – tư (PPP) và nguồn lực xã hội.')])) + '</ol>'),
 vband(['Chính xác', 'Trách nhiệm', 'Tận tâm']),
 cta(),
]), 4920)

# ================= NEWS =================
NEWS = [('b','Chuyển đổi số','[Ra quân hỗ trợ kích hoạt VNeID tại phường …]'),('h','Ngân hàng','[Chiến dịch mở tài khoản số cùng ngân hàng đối tác]'),
        ('f','Y tế số','[Triển khai viện phí không tiền mặt tại bệnh viện …]'),('a','An sinh','[Tuyên truyền BHXH tự nguyện tại xã …]'),
        ('g','Nội bộ','[Thành lập PKD 10 và PKD 11]'),('l','Dự án','[Phòng Dự án khảo sát tiềm năng vùng …]')]
PAGES['News.dc.html'] = ('Tin tức', '\n'.join([
 hero('News.dc.html', [('Main.dc.html','Trang chủ'), (None,'Tin tức')], ('Mới', 'Hoạt động tại địa bàn'),
      'Tin tức & <span style="color: #ca4d25">hoạt động</span>',
      'Hoạt động thực địa, hợp tác với đối tác và các mốc phát triển của Minh Group ST.',
      [('ht',0,0,None),('ic',10,0,('book',0)),('ic',0,3,('photo',2.2)),('ht',10,2,None),('hn',2,2,0),('hn',9,3,1)]),
 sec('<div class="pad" style="padding: 24px 40px; display: flex; gap: 8px; flex-wrap: wrap">' + ''.join(f'<button type="button" class="chip" aria-pressed="{"true" if i==0 else "false"}">{t}</button>' for i,t in enumerate(['Tất cả','Chuyển đổi số','Y tế số','Ngân hàng','Bảo hiểm','An sinh','Dự án','Nội bộ'])) + '</div>'),
 sec(f'''<a href="#" class="rg" style="grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr); text-decoration: none; color: #201e1d">
{img('k', style='min-height: 420px; border: 0')}
<div class="pad" style="padding: 56px 40px; display: flex; flex-direction: column; justify-content: center; gap: 16px"><span class="tag" style="align-self: flex-start">Nổi bật</span><span class="mono" style="font-size: 12px; color: #8a8a8a">[dd/mm/yyyy] · Nội bộ</span><h2 class="h2" style="font-size: 36px">[Tiêu đề bài viết nổi bật]</h2><p class="lead">[Tóm tắt 2–3 câu về hoạt động, địa bàn, số người dân được hỗ trợ.]</p><span class="btn btn-s" style="align-self: flex-start">Đọc tiếp {ARROW}</span></div>
</a>'''),
 sec('<div class="rg" style="grid-template-columns: repeat(3, minmax(0, 1fr))">' + ''.join(
   f'<a href="#" class="cell">{img(k, style="height: 200px; border-radius: 10px")}<span class="mono" style="font-size: 12px; color: #a39d98">[dd/mm/yyyy] · {t}</span><h4 style="line-height: 1.4">{h}</h4></a>' for k,t,h in NEWS) + '</div>'
   + '<div class="pad" style="padding: 32px 40px; border-top: 1px solid #3a3633; display: flex; justify-content: center"><span class="btn btn-s">Xem thêm bài viết</span></div>', 'sec dk-sec'),
 cta('Báo chí và đối tác <span>cần thêm thông tin?</span>', f'Liên hệ {MAIL} để nhận hồ sơ năng lực và thông cáo báo chí.'),
]), 2720)

# ================= GALLERY =================
GAL = [('k','w2'),('a',''),('b','h2r'),('f',''),('g',''),('h','w2'),('l','')]
PAGES['Gallery.dc.html'] = ('Thư viện', '\n'.join([
 hero('Gallery.dc.html', [('Main.dc.html','Trang chủ'), (None,'Thư viện')], ('Ảnh', 'Miền Tây qua ống kính'),
      'Thư viện <span style="color: #ca4d25">hình ảnh</span>',
      'Hình ảnh hoạt động thực địa, sự kiện và địa bàn Minh Group ST phục vụ.',
      [('ic',0,0,('photo',0)),('ht',10,1,None),('ht',0,2,None),('ic',10,3,('pin',2.2)),('hn',1,2,0),('hn',9,1,1)]),
 sec('<div class="pad" style="padding: 24px 40px; display: flex; gap: 8px; flex-wrap: wrap; align-items: center; justify-content: space-between"><div style="display: flex; gap: 8px; flex-wrap: wrap">' + ''.join(f'<button type="button" class="chip" aria-pressed="{"true" if i==0 else "false"}">{t}</button>' for i,t in enumerate(['Tất cả','Hoạt động thực địa','Sự kiện & ký kết','Đội ngũ','Địa bàn'])) + '</div><span class="mono" style="font-size: 12px; color: #8a8a8a">7 ảnh minh họa · Wikimedia Commons</span></div>'),
 sec('<div class="rg gal">' + ''.join(img(k, cls=f'ph hasimg {c}', style='height: 100%') for k,c in GAL) + '<div class="ph" style="border: 0; flex-direction: column; gap: 8px"><span style="color: #ca4d25">' + ic('photo',28,1.5) + '</span>[Ảnh thực tế của Minh Group ST]</div><div class="ph" style="border: 0">[Ảnh đội ngũ]</div></div>'
   + '<p class="mono pad" style="border-top: 1px solid #ebebeb; padding: 12px 40px; font-size: 12px; color: #8a8a8a">Ảnh hiện tại là ảnh minh họa có giấy phép mở, cần thay bằng ảnh thực tế của công ty trước khi xuất bản.</p>'),
 cta(),
]), 2560)

# ================= CONTACT =================
PAGES['Contact.dc.html'] = ('Liên hệ', '\n'.join([
 hero('Contact.dc.html', [('Main.dc.html','Trang chủ'), (None,'Liên hệ')], ('24h', 'Phản hồi trong giờ hành chính'),
      'Kết nối cùng <span style="color: #ca4d25">Minh Group ST</span>',
      'Hợp tác triển khai tại địa phương, cần hỗ trợ dịch vụ hay muốn làm việc với Phòng Dự án: bắt đầu từ đây.',
      [('ic',0,0,('phone',0)),('ht',10,0,None),('ht',0,3,None),('ic',10,2,('mail',2.2)),('hn',2,1,0),('hn',9,3,1)]),
 sec('<div class="rg" style="grid-template-columns: repeat(3, minmax(0, 1fr))">'
   + f'<a href="{HOT_T}" class="cell big-or" style="padding: 40px 32px"><span class="ic" aria-hidden="true">{ic("phone")}</span><p>Hotline</p><h4 style="font-size: 32px; font-weight: 500">{HOT}</h4></a>'
   + f'<a href="mailto:{MAIL}" class="cell" style="padding: 40px 32px"><span class="ic" aria-hidden="true">{ic("mail")}</span><p>Email</p><h4 style="font-size: 20px">{MAIL}</h4></a>'
   + f'<div class="cell" style="padding: 40px 32px"><span class="ic" aria-hidden="true">{ic("pin")}</span><p>Trụ sở chính</p><h4 style="font-size: 20px; line-height: 1.4">{ADDR}</h4></div></div>'),
 sec(f'''<div id="tu-van" class="rg" style="grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr)">
<div class="map"><span class="pinb">{ic('pin',26,2)}</span><b style="font-size: 16px; color: #201e1d">Minh Group ST</b><span>{ADDR}</span><span class="mono" style="font-size: 12px">[Nhúng bản đồ Google Maps]</span></div>
<form class="pad" style="padding: 56px 40px; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; align-content: center; background: #ffffff">
<h2 class="h2" style="grid-column: 1 / -1; font-size: 36px">Gửi <span>yêu cầu</span></h2>
<label>Họ và tên<input type="text" placeholder="Nguyễn Văn A" autocomplete="name"></label>
<label>Số điện thoại<input type="tel" placeholder="09xx xxx xxx" autocomplete="tel"></label>
<label>Bạn là<select><option>Người dân</option><option>Cơ quan, chính quyền</option><option>Ngân hàng, tổ chức tài chính</option><option>Doanh nghiệp</option><option>Bệnh viện, cơ sở y tế</option></select></label>
<label>Lĩnh vực quan tâm<select><option>Chuyển đổi số, y tế số</option><option>Tài chính – ngân hàng</option><option>Bảo hiểm</option><option>An sinh (BHXH, BHYT)</option><option>Chi trả bảo trợ xã hội</option><option>Hợp tác dự án</option></select></label>
<label style="grid-column: 1 / -1">Nội dung<input type="text" placeholder="Mô tả ngắn nhu cầu của bạn"></label>
<button type="button" class="btn btn-p" style="grid-column: 1 / -1; min-height: 48px">Gửi yêu cầu {ARROW}</button>
<p style="grid-column: 1 / -1; font-size: 12px; color: #8a8a8a">Thông tin được bảo vệ theo Nghị định 13/2023/NĐ-CP.</p>
</form>
</div>'''),
 sec(head_block('Làm việc với <span>đúng đơn vị</span>', None, pad='72px 40px 40px') + cells([
   ('gov','Cơ quan, chính quyền','Phối hợp triển khai VNeID, eTax, thanh toán không tiền mặt, tuyên truyền BHXH – BHYT.'),
   ('bank','Ngân hàng','Liên hệ PKD Tổng hợp: chiến dịch mở tài khoản, sinh trắc học, phát triển khách hàng.'),
   ('hos','Bệnh viện, trạm y tế','Liên hệ PKD Y: số hóa hồ sơ, viện phí không tiền mặt, quy trình tiếp đón.'),
   ('grid','Doanh nghiệp, nhà đầu tư','Liên hệ Phòng Dự án: nghiên cứu thị trường, mô hình kinh doanh, hợp tác PPP.')], 4)),
]), 2180)

os.makedirs(OUT, exist_ok=True)
for fn, (title, body, h) in PAGES.items():
    open(os.path.join(OUT, fn), 'w', encoding='utf8').write(page(fn, title, body, h))
print('\n'.join(PAGES))
