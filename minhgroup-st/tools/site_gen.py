# Builds every website page from one stylesheet (site.css) and one set of components.
# usage: python3 site_gen.py <out project dir> [--preview <assets dir>]
#   --preview writes plain .html files that open without the canvas runtime
import re, sys, os, json
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from icons import I

OUT = sys.argv[1]
PREVIEW = sys.argv[3] if len(sys.argv) > 3 and sys.argv[2] == '--preview' else None
CSS = open(os.path.join(HERE, 'site.css'), encoding='utf8').read()
LANG = 'vi'
def T(vi, en=None):
    return en if (LANG == 'en' and en is not None) else vi

B = {  # artifact blobs -> repo files (used by --preview)
 'logo': ('/_blob/a59374f9219055b49892dcb2ad96f385', 'logo-mgst.png'),
 'a': ('/_blob/45860b7d149a390970149582f9b89451', 'photos/mg-a.jpg'),
 'b': ('/_blob/f5040f4716dac4c066f6f0653b44e4e6', 'photos/mg-b.jpg'),
 'f': ('/_blob/35c914cb179315c1ed8aadf2038fe9d7', 'photos/mg-f.jpg'),
 'g': ('/_blob/79c011ce9bdbe1ced6739433e7fdd9c6', 'photos/mg-g.jpg'),
 'h': ('/_blob/c4dc9283c7a0db1adf5c77c4978be8b0', 'photos/mg-h.jpg'),
 'k': ('/_blob/7b27c5ec9692f7cb740afbd91ad776cc', 'photos/mg-k.jpg'),
 'l': ('/_blob/731930f256d63826095fbe8b538ce38b', 'photos/mg-l.jpg'),
 'pvi': ('/_blob/5e81120a5d760314400d7c3cd78d07cc', 'logos/pvi-w.png'),
}
def blob(k):
    return (PREVIEW + '/' + B[k][1]) if PREVIEW else B[k][0]
CR = {
 'a': ('Người phụ nữ đội nón lá trên ghe ở chợ nổi Cần Thơ', 'Vyacheslav Argenberg · CC BY 4.0'),
 'b': ('Người bán hàng rong vừa đội thúng bánh vừa xem điện thoại', 'Peter van der Sluijs · CC BY-SA 3.0'),
 'f': ('Dòng xe máy trên đường phố Cần Thơ', 'Dragfyre · CC BY-SA 3.0'),
 'g': ('Cầu Cần Thơ nhìn từ trên cao', 'Tuong Lam Photos · CC BY-SA 4.0'),
 'h': ('Sạp rau ở chợ Cần Thơ', 'Franzfoto · CC BY-SA 3.0'),
 'k': ('Cầu Cần Thơ bắc qua sông Hậu', 'Christophe95 · CC BY-SA 4.0'),
 'l': ('Trụ tháp cầu Cần Thơ lúc chiều', 'Franzfoto · CC BY-SA 3.0'),
}
HOT, HOT_T, MAIL = '0977 726 700', 'tel:0977726700', 'minhgroupst@mgst.com.vn'
ADDR = '323–325 Phú Lợi, phường Phú Lợi, TP. Cần Thơ'

I.update({
 'menu': '<path d="M4 7h16M4 12h16M4 17h16"/>',
 'x': '<path d="M6 6l12 12M18 6L6 18"/>',
 'chat': '<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/><path d="M8.5 11h.01M12 11h.01M15.5 11h.01"/>',
 'msg': '<path d="M12 3C7 3 3 6.6 3 11.2c0 2.5 1.2 4.7 3.1 6.2V21l3-1.7c.9.3 1.9.4 2.9.4 5 0 9-3.6 9-8.3S17 3 12 3z"/><path d="M7.5 13l3-3 2.5 2 3.5-3"/>',
 'vend': '<rect x="5" y="2.5" width="14" height="19" rx="2"/><path d="M8 6h5v7H8zM16 6v3M16 12v1M8 17h8"/>',
 'globe': '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.8 3 2.8 15 0 18M12 3c-2.8 3-2.8 15 0 18"/>',
 'cap': '<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11.5V16c2 2 10 2 12 0v-4.5M22 9v6"/>',
 'coins': '<ellipse cx="9" cy="7" rx="6" ry="3"/><path d="M3 7v5c0 1.7 2.7 3 6 3M3 12v5c0 1.7 2.7 3 6 3s6-1.3 6-3"/><ellipse cx="15" cy="13" rx="6" ry="3"/><path d="M21 13v4"/>',
 'chart': '<path d="M4 20V4M4 20h16M8 16v-5M12 16V8M16 16v-3"/>',
 'layers': '<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5M3 17.5l9 5 9-5"/>',
 'bulb': '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.5 1 2.5h6c0-1 .3-1.8 1-2.5A6 6 0 0 0 12 3z"/>',
 'hand': '<path d="M3 14l4-1 4 2h4a2 2 0 0 1 0 4H9"/><path d="M15 15l4-2a1.8 1.8 0 0 1 2 3l-6 4H7l-4-2"/><circle cx="14" cy="6" r="3"/>',
 'truck': '<path d="M2 6h11v10H2zM13 9h5l3 4v3h-8z"/><circle cx="6.5" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/>',
})
SPK = '<path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"></path>'
SP = f'<svg viewBox="0 0 24 24" aria-hidden="true">{SPK}</svg>'

# ---------------------------------------------------------------- components
def ic(n, size=22, sw=1.7):
    return f'<svg width="{size}" height="{size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="{sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">{I[n]}</svg>'
ARROW = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"></path></svg>'

def acc(t):  # *text* -> accent span
    return re.sub(r'\*(.+?)\*', r'<span>\1</span>', t)
def btn(label, href, kind='primary', arrow=False, lg=False, attrs=''):
    return f'<a class="btn btn--{kind}{" btn--lg" if lg else ""}" href="{href}"{attrs}>{label}{" " + ARROW if arrow else ""}</a>'
def photo(k, cls='', alt=None):
    a, c = CR[k]
    return f'<figure class="ph {cls}"><img src="{blob(k)}" alt="{alt or a}" loading="lazy" decoding="async"><figcaption class="cr">Ảnh: {c}</figcaption></figure>'
def empty(label, cls='', icon='photo'):
    return f'<div class="ph ph--empty {cls}">{ic(icon, 18)}<span>{label}</span></div>'
def sec(body, cls='', id=''):
    i = f' id="{id}"' if id else ''
    return f'<section class="sec {cls}"{i}>\n<div class="box"><span class="x l" aria-hidden="true"></span><span class="x r" aria-hidden="true"></span>\n{body}\n</div>\n</section>\n'
def head(eyebrow, title, lead='', actions='', center=False, level=2):
    e = f'<p class="eyebrow">{SP}{eyebrow}</p>' if eyebrow else ''
    l = f'<p class="lead">{lead}</p>' if lead else ''
    a = f'<div class="actions">{actions}</div>' if actions else ''
    return f'<div class="sec-hd{" center" if center else ""}">{e}<h{level} class="h2">{acc(title)}</h{level}>{l}{a}</div>'
def grid(items, cols=3, cls='', tag='ul'):
    w = 'li' if tag == 'ul' else 'div'
    return f'<{tag} class="grid c{cols} {cls}">' + ''.join(f'<{w}>{x}</{w}>' for x in items) + f'</{tag}>'
def card(title, text='', icon=None, href=None, num=None, more=None, cls='', items=None, tag=None):
    el = 'a' if href else 'div'
    h = f' href="{href}"' if href else ''
    out = f'<{el} class="card {cls}"{h}>'
    if icon: out += f'<span class="ic">{ic(icon)}</span>'
    if num: out += f'<span class="num">{num}</span>'
    if tag: out += f'<span class="tag" style="align-self: flex-start">{tag}</span>'
    out += f'<h3>{title}</h3>'
    if text: out += f'<p>{text}</p>'
    if items: out += '<ul>' + ''.join(f'<li>{x}</li>' for x in items) + '</ul>'
    if more: out += f'<span class="more">{more} {ARROW}</span>'
    return out + f'</{el}>'
def stats(rows, cols=4):
    return f'<dl class="grid c{cols} keep2">' + ''.join(f'<div class="stat"><dt>{l}</dt><dd>{n}</dd></div>' for n, l in rows) + '</dl>'
def feat(num, title, text, cards, id='', cols=3, action=''):
    i = f' id="{id}"' if id else ''
    return (f'<div class="feat"{i}><div class="feat-hd"><span class="tag" style="align-self: flex-start">{num}</span><h3>{title}</h3><p>{text}</p>{action}</div>'
            + grid(cards, cols) + '</div>')
def steps(rows, cols=3):
    return f'<ol class="grid c{cols}">' + ''.join(f'<li><div class="step"><b>{i:02d}</b><h3>{t}</h3><p>{d}</p></div></li>' for i, (t, d) in enumerate(rows, 1)) + '</ol>'
def split(left, right, flip=False):
    return f'<div class="split{" flip" if flip else ""}"><div>{left}</div>{right}</div>'
def vband(words):
    one = ''.join(f'<li>{w}{SP}</li>' for w in words)
    hid = ''.join(f'<li aria-hidden="true">{w}{SP}</li>' for w in words)
    return f'<div class="vband"><ul>{one}{hid}</ul></div>\n'
def faq(rows):
    plus = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"></path></svg>'
    return '<div class="faq-list">' + ''.join(f'<details class="faq"><summary>{q}{plus}</summary><p>{a}</p></details>' for q, a in rows) + '</div>'
def cta(title=None, text=None):
    title = title or T('Cần một đối tác *có mặt tận địa bàn?*', 'Need a partner *already on the ground?*')
    text = text or T('Để lại yêu cầu, chuyên viên phụ trách đúng mảng sẽ liên hệ trong giờ làm việc.', 'Leave a request and the specialist for that line of work will call you back during office hours.')
    return sec(f'''<div class="cta"><div><h2 class="h2">{acc(title)}</h2><p class="lead">{text}</p><div class="actions">{btn(T('Gửi yêu cầu hợp tác', 'Send a partnership request'), 'Contact.dc.html#form', arrow=True, lg=True)}{btn(T('Xem lĩnh vực hoạt động', 'See what we do'), 'Services.dc.html', 'secondary', lg=True)}</div></div>
<div><span class="eyebrow">Hotline</span><a class="tel" href="{HOT_T}">{HOT}</a><a href="mailto:{MAIL}" style="font-size: 15px">{MAIL}</a></div></div>''', 'sec--dk')

NAV = [('About', 'Giới thiệu', 'About'), ('Organization', 'Tổ chức', 'Organization'), ('Services', 'Lĩnh vực', 'What we do'),
       ('Projects', 'Dự án', 'Projects'), ('News', 'Tin tức', 'News')]
def header(cur):
    home = 'MainEN.dc.html' if LANG == 'en' else 'Main.dc.html'
    def links():
        return ''.join(f'<a href="{k}.dc.html"{" aria-current=" + chr(34) + "page" + chr(34) if k == cur else ""}>{T(vi, en)}</a>' for k, vi, en in NAV)
    c_vi = ' aria-current="true"' if LANG == 'vi' else ''
    c_en = ' aria-current="true"' if LANG == 'en' else ''
    vi_href = 'Main.dc.html' if cur == 'Main' else cur + '.dc.html'
    return f'''<header class="hd">
<div class="box">
<a class="brand" href="{home}"><img src="{blob('logo')}" alt="" width="40" height="40"><span>Minh Group ST</span></a>
<nav class="nav" aria-label="{T('Điều hướng chính', 'Main navigation')}">{links()}</nav>
<div class="hd-end">
<div class="lang" role="group" aria-label="Ngôn ngữ / Language"><a href="{vi_href}"{c_vi} hreflang="vi" lang="vi">VI</a><a href="MainEN.dc.html"{c_en} hreflang="en" lang="en">EN</a></div>
{btn(T('Liên hệ hợp tác', 'Contact us'), 'Contact.dc.html')}
<details class="mnav"><summary aria-label="{T('Mở menu', 'Open menu')}">{ic('menu', 22, 2)}</summary><nav aria-label="{T('Điều hướng di động', 'Mobile navigation')}"><a href="{home}"{' aria-current="page"' if cur == 'Main' else ''}>{T('Trang chủ', 'Home')}</a>{links()}{btn(T('Liên hệ hợp tác', 'Contact us'), 'Contact.dc.html', lg=True)}</nav></details>
</div>
</div>
</header>
'''
def footer():
    return f'''<footer class="ft">
<div class="box"><span class="x l" aria-hidden="true"></span><span class="x r" aria-hidden="true"></span>
<div class="grid">
<div><img class="logo" src="{blob('logo')}" alt="" width="48" height="48"><span class="co">Công ty TNHH Minh Group ST</span><span class="addr">{ADDR}<br>MST: [Mã số thuế]</span><a class="tel" href="{HOT_T}">{HOT}</a><a href="mailto:{MAIL}">{MAIL}</a></div>
<div><h2>{T('Công ty', 'Company')}</h2><a href="About.dc.html">{T('Giới thiệu', 'About')}</a><a href="About.dc.html#cot-moc">{T('Lịch sử &amp; Cột mốc', 'Milestones')}</a><a href="Organization.dc.html">{T('Cơ cấu tổ chức', 'Organization')}</a><a href="Organization.dc.html#lanh-dao">{T('Ban lãnh đạo', 'Leadership')}</a><a href="News.dc.html">{T('Tin tức &amp; Thư viện', 'News &amp; media')}</a></div>
<div><h2>{T('Lĩnh vực', 'What we do')}</h2><a href="Services.dc.html#k1">{T('Chuyển đổi số &amp; Tài chính', 'Digital &amp; financial services')}</a><a href="Services.dc.html#k2">{T('Bảo hiểm &amp; An sinh', 'Insurance &amp; social security')}</a><a href="Services.dc.html#k3">{T('Quản lý vận hành', 'Operations')}</a><a href="Services.dc.html#k4">{T('Dự án &amp; Nhân lực', 'Projects &amp; workforce')}</a></div>
<div><h2>{T('Dự án &amp; Kết nối', 'Projects &amp; contact')}</h2><a href="Projects.dc.html#may-ban-hang">{T('Máy bán hàng tự động', 'Vending machines')}</a><a href="Projects.dc.html#lai-xe">{T('Đào tạo lái xe', 'Driver training')}</a><a href="Projects.dc.html#nhan-luc">{T('Cung ứng nhân lực', 'Workforce supply')}</a><a href="Contact.dc.html">{T('Liên hệ', 'Contact')}</a><a href="https://zalo.me/">Zalo OA</a></div>
</div>
<p class="ft-end"><span>© 2026 Minh Group ST</span><span>{T('Tiên phong số hóa · Hiệu quả bứt phá', 'Digital first · Breakthrough results')}</span></p>
<div class="wm" aria-hidden="true">MINH GROUP<span>.</span></div>
</div>
</footer>
'''
# quick-consult dialog + dock: same component and logic on every page
POP = '''<sc-if value="{{open}}" hint-placeholder-val="{{ false }}">
<div class="pop" role="dialog" aria-label="@TITLE@">
<div class="pop-hd"><span><img src="@LOGO@" alt="" width="28" height="28" style="width: 28px; height: 28px; object-fit: contain"><span><b>@TITLE@</b><span>Minh Group ST</span></span></span><button type="button" class="pop-x" aria-label="@CLOSE@" onClick="{{toggle}}">@XICON@</button></div>
<sc-if value="{{sent}}" hint-placeholder-val="{{ false }}">
<div class="ask-done" role="status"><span class="ask-ok" aria-hidden="true">@CHECK@</span><b class="ask-q">@DONE@</b><p>@DONE1@ {{svcLabel}} @DONE2@ {{phone}} @DONE3@</p><button type="button" class="btn btn--secondary" onClick="{{reset}}">@AGAIN@</button></div>
</sc-if>
<sc-if value="{{notSent}}" hint-placeholder-val="{{ true }}">
<div class="ask">
<label for="ask-msg" class="ask-q">@Q@</label>
<div class="chips" role="group" aria-label="@PICK@"><sc-for list="{{chips}}" as="c" hint-placeholder-count="6"><button type="button" class="chip" aria-pressed="{{c.pressed}}" onClick="{{c.pick}}">{{c.label}}</button></sc-for></div>
<textarea id="ask-msg" rows="2" placeholder="{{placeholder}}" onInput="{{onMsg}}"></textarea>
<label class="field">@PHONE@<input type="tel" inputmode="tel" autocomplete="tel" placeholder="09xx xxx xxx" onInput="{{onPhone}}" aria-invalid="{{phoneInvalid}}" aria-describedby="ask-err"></label>
<p id="ask-err" class="err" role="alert">{{errText}}</p>
<button type="button" class="btn btn--primary btn--lg" onClick="{{submit}}">@SEND@ @ARROW@</button>
</div>
<div class="ask-ft"><a href="@HOT_T@">@CALL@ @HOT@</a><a href="https://zalo.me/">Zalo OA</a></div>
</sc-if>
</div>
</sc-if>
<div class="dock" aria-label="@QUICK@">
<a class="zalo opt" href="https://zalo.me/" aria-label="Zalo OA">Zalo</a>
<a class="opt" href="https://m.me/" aria-label="Facebook Messenger">@MSG@</a>
<a href="@HOT_T@" aria-label="@CALL@ @HOT@">@TEL@</a>
<button type="button" class="chat" aria-label="@TITLE@" aria-expanded="{{openStr}}" onClick="{{toggle}}">@CHAT@</button>
</div>
'''
def dock():
    if PREVIEW:
        return ''
    m = {'TITLE': T('Tư vấn nhanh', 'Quick enquiry'), 'CLOSE': T('Đóng', 'Close'), 'LOGO': blob('logo'), 'XICON': ic('x', 18, 2), 'CHECK': ic('check', 24, 2.2),
         'DONE': T('Đã nhận yêu cầu của bạn', 'We have your request'), 'DONE1': T('Chuyên viên phụ trách mảng', 'The specialist for'),
         'DONE2': T('sẽ gọi lại số', 'will call'), 'DONE3': T('trong giờ làm việc.', 'during office hours.'), 'AGAIN': T('Gửi yêu cầu khác', 'Send another'),
         'Q': T('Bạn cần hỗ trợ việc gì?', 'What do you need help with?'), 'PICK': T('Chọn nhanh lĩnh vực', 'Pick a topic'), 'PHONE': T('Số điện thoại', 'Phone number'),
         'SEND': T('Gửi yêu cầu', 'Send request'), 'ARROW': ARROW, 'HOT_T': HOT_T, 'HOT': HOT, 'CALL': T('Gọi', 'Call'), 'QUICK': T('Liên hệ nhanh', 'Quick contact'),
         'MSG': ic('msg', 20, 1.8), 'TEL': ic('phone', 20, 2), 'CHAT': ic('chat', 22, 1.9)}
    return re.sub(r'@([A-Z0-9_]+)@', lambda x: m[x.group(1)], POP)
def logic(h):
    defs = T([
        ('Hợp tác ngân hàng', 'Ví dụ: Ngân hàng cần đội ngũ mở tài khoản số tại 5 xã'),
        ('Bảo hiểm', 'Ví dụ: Tư vấn bảo hiểm xe cơ giới và tai nạn'),
        ('BHXH, BHYT', 'Ví dụ: Tôi muốn tham gia BHYT hộ gia đình cho 4 người'),
        ('Chi trả trợ cấp', 'Ví dụ: Hỏi lịch nhận lương hưu tháng này tại xã'),
        ('Học lái xe', 'Ví dụ: Tôi muốn đăng ký học lái xe hạng A1'),
        ('Việc làm ngoài nước', 'Ví dụ: Tìm hiểu đơn hàng đi Nhật Bản')], [
        ('Bank partnership', 'e.g. We need a field team to open accounts in 5 communes'),
        ('Insurance', 'e.g. Motor and accident cover'),
        ('Social insurance', 'e.g. Family health insurance for 4 people'),
        ('Benefit payments', 'e.g. This month\'s pension payment schedule'),
        ('Driver training', 'e.g. I would like to register for an A1 licence'),
        ('Work abroad', 'e.g. Openings in Japan')])
    err = T('Vui lòng nhập số điện thoại 10 số, bắt đầu bằng 0.', 'Please enter a 10-digit phone number starting with 0.')
    return ('''<script type="text/x-dc" data-dc-script data-props='{"$preview":{"width":1440,"height":%d}}'>
class Component extends DCLogic {
  renderVals() {
    const st = this.state || {};
    const svc = st.svc ?? 0;
    const defs = %s;
    const digits = (st.phone || '').replace(/\\D/g, '');
    const valid = /^0\\d{9}$/.test(digits);
    const bad = !!st.tried && !valid;
    return {
      chips: defs.map((d, i) => ({ label: d[0], pressed: i === svc ? 'true' : 'false', pick: () => this.setState({ svc: i }) })),
      placeholder: defs[svc][1],
      svcLabel: defs[svc][0],
      phone: digits,
      onMsg: (e) => this.setState({ msg: e.target.value }),
      onPhone: (e) => this.setState({ phone: e.target.value }),
      phoneInvalid: bad ? 'true' : 'false',
      errText: bad ? %s : '',
      submit: () => valid ? this.setState({ sent: true, tried: false }) : this.setState({ tried: true }),
      reset: () => this.setState({ sent: false, phone: '', msg: '', tried: false }),
      open: !!st.open,
      openStr: st.open ? 'true' : 'false',
      toggle: () => this.setState({ open: !st.open }),
      sent: !!st.sent,
      notSent: !st.sent
    };
  }
}
</script>''' % (h, json.dumps([list(d) for d in defs], ensure_ascii=False).replace("'", "\\u2019"), json.dumps(err, ensure_ascii=False)))

FONT = '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,300;0,14..32,400;0,14..32,500;0,14..32,600;0,14..32,700;1,14..32,400&amp;display=swap">'
HEIGHTS = json.load(open(os.path.join(HERE, 'heights.json'))) if os.path.exists(os.path.join(HERE, 'heights.json')) else {}
def page(name, title, cur, body):
    h = HEIGHTS.get(name, 3000)
    main = f'<div class="page">\n{header(cur)}<main>\n{body}</main>\n{footer()}{dock()}</div>'
    if PREVIEW:
        doc = f'<!doctype html>\n<html lang="{LANG}">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1">\n<title>{title}</title>\n{FONT}\n<style>\n{CSS}</style>\n</head>\n<body>\n{main}\n</body>\n</html>\n'
        open(os.path.join(OUT, name + '.html'), 'w', encoding='utf8').write(doc)
        return
    doc = f'''<!doctype html>
<html lang="{LANG}">
<head>
<meta charset="utf-8">
<title>{title} – Minh Group ST</title>
<script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
{FONT}
<style>
{CSS}</style>
</helmet>
{main}
</x-dc>
{logic(h)}
</body>
</html>
'''
    open(os.path.join(OUT, name + '.dc.html'), 'w', encoding='utf8').write(doc)

def backdrop(cells):
    out = '<div class="cells" aria-hidden="true"></div>'
    for i, (col, row, kind) in enumerate(cells):
        pos = f'left: calc(var(--cell) * {col}); top: {row * 96}px'
        if kind == 'ht':
            out += f'<span class="hc hc--ht" aria-hidden="true" style="{pos}"></span>'
        else:
            out += f'<span class="hc hc--ic" aria-hidden="true" style="{pos}; animation-delay: {i * 1.4:.1f}s"><svg viewBox="0 0 24 24">{I[kind]}</svg></span>'
    return out
def phero(crumbs, eyebrow, title, lead, k, actions=''):
    cr = '<nav aria-label="Breadcrumb"><ol class="crumb"><li><a href="Main.dc.html">Trang chủ</a></li>' + ''.join(f'<li>{c}</li>' for c in crumbs) + '</ol></nav>'
    a = f'<div class="actions">{actions}</div>' if actions else ''
    return f'''<section class="hero phero">
<div class="box">{backdrop([(5, 0, 'ht'), (6, 1, 'shield'), (4, 3, 'link')])}
<div class="phero-in"><div class="phero-tx rise">{cr}<p class="eyebrow">{SP}{eyebrow}</p><h1 class="h1">{acc(title)}</h1><p class="lead">{lead}</p>{a}</div>{photo(k)}</div>
</div>
</section>
'''

# ---------------------------------------------------------------- shared content
KHOI = [  # id, short, full, theme, icon
 ('k1', 'Khối 01', 'Chuyển đổi số &amp; Dịch vụ tài chính', 'Kết nối đối tác – Vững vàng địa bàn – Đồng hành cùng cộng đồng', 'bank'),
 ('k2', 'Khối 02', 'Bảo hiểm &amp; An sinh xã hội', 'Bảo vệ tài chính gia đình – Đồng hành cùng an sinh địa phương', 'shield'),
 ('k3', 'Khối 03', 'Quản lý vận hành &amp; Nội bộ', 'Quản trị nhân sự vững mạnh – Tài chính minh bạch – Vận hành hiệu quả', 'layers'),
 ('k4', 'Khối 04', 'Phát triển dự án &amp; Cung ứng nhân lực', 'Tham mưu chiến lược – Chủ động triển khai – Kiểm soát hiệu quả', 'compass'),
]
PROJ = [
 ('may-ban-hang', 'Máy bán hàng tự động', 'Đưa máy bán hàng thiết yếu, thanh toán bằng mã QR về xã, phường; kết hợp hỗ trợ người dân mở tài khoản, thẻ ngân hàng.', 'Toro · VNPAY · VPBank', 'vend', 'h'),
 ('lai-xe', 'Đào tạo lái xe', 'Tư vấn, tiếp nhận và hoàn thiện hồ sơ học lái xe qua mạng lưới sẵn có; định hướng đầu tư cơ sở đào tạo tại Sóc Trăng.', 'Hạng A1, A, B', 'car', 'f'),
 ('nhan-luc', 'Cung ứng nhân lực &amp; Tư vấn XKLĐ', 'Tuyển chọn, đào tạo nghề và ngoại ngữ, đưa người lao động Việt Nam đến thị trường Châu Âu và Đông Á.', 'Châu Âu · Đông Á', 'globe', 'k'),
]
CSR = [
 ('bulb', 'Thắp sáng đường quê', 'Tài trợ công trình chiếu sáng, nâng cao an toàn giao thông và diện mạo nông thôn mới.'),
 ('gift', 'Quà tặng an sinh', 'Trao thẻ bảo hiểm, quà tặng và kinh phí hỗ trợ cho gia đình có hoàn cảnh khó khăn.'),
 ('scan', 'Phổ cập kỹ năng số', 'Hướng dẫn người dân dùng ngân hàng điện tử, nhận trợ cấp và thanh toán trực tuyến an toàn.'),
 ('qr', 'Số hóa hộ kinh doanh', 'Hỗ trợ trang bị mã QR thanh toán và tiếp cận các tiện ích tài chính hiện đại.'),
]

# ---------------------------------------------------------------- pages
def home():
    hero = f'''<section class="hero">
<div class="box">{backdrop([(0, 0, 'shield'), (9, 0, 'ht'), (10, 1, 'card'), (0, 2, 'ht'), (0, 3, 'vend'), (10, 4, 'globe'), (10, 0, 'bank')])}
<div class="hero-in rise">
<a class="pill" href="About.dc.html"><b>MGST</b>{T('Hệ sinh thái đa tầng tại Đồng bằng sông Cửu Long', 'A multi-layer ecosystem in the Mekong Delta')}</a>
<h1 class="h1">{acc(T('Tiên phong số hóa. *Hiệu quả bứt phá.*', 'Digital first. *Breakthrough results.*'))}</h1>
<p class="lead">{T('Minh Group ST đưa dịch vụ tài chính số, bảo hiểm và an sinh đến tận tay người dân miền Tây, bằng lực lượng tại chỗ và quy trình quản trị khép kín.', 'Minh Group ST brings digital finance, insurance and social security to households across the Mekong Delta, with its own field force and an end-to-end operating process.')}</p>
<div class="actions">{btn(T('Liên hệ hợp tác', 'Partner with us'), 'Contact.dc.html', arrow=True, lg=True)}{btn(T('Xem lĩnh vực hoạt động', 'See what we do'), 'Services.dc.html', 'secondary', lg=True)}</div>
</div>
</div>
<div class="strip"><ul>{''.join(f'<li>{photo(k, w)}</li>' for k, w in [('k', 'w'), ('b', 'n'), ('h', 'w'), ('a', 'n'), ('g', 'w'), ('f', 'n')])}{''.join(f'<li aria-hidden="true">{photo(k, w, alt="")}</li>' for k, w in [('k', 'w'), ('b', 'n'), ('h', 'w'), ('a', 'n'), ('g', 'w'), ('f', 'n')])}</ul></div>
</section>
'''
    st = sec(stats([('~300', T('nhân sự chuyên trách tại địa bàn', 'dedicated field staff')), ('10+', T('phòng kinh doanh phủ các tỉnh, thành ĐBSCL', 'sales offices across the delta')),
                    ('40.000', T('tài khoản/tháng, sản lượng cao nhất từng đạt', 'accounts a month at peak output')), ('25+', T('xã, phường đang triển khai mô hình an sinh', 'communes running our social-security model'))]).replace('class="grid', 'style="border-top: 0" class="grid'))
    kd = T([
        ('Lực lượng trực tiếp tại thị trường, hiện diện thường trực ở bệnh viện, mở tài khoản và hướng dẫn thanh toán không tiền mặt.', ['~300 nhân sự, 10+ phòng kinh doanh', 'PKD Y tế túc trực tại bệnh viện', 'Đối soát, báo cáo minh bạch']),
        ('Đại lý tổ chức của các tổng công ty bảo hiểm, phát triển BHXH tự nguyện, BHYT hộ gia đình và chi trả bảo trợ xã hội.', ['Bảo hiểm phi nhân thọ (PVI)', 'BHXH, BHYT trên 25+ xã, phường', 'Chi trả 100% tại 6 xã, phường']),
        ('Nhân sự và Tài chính – Kế toán trong một bộ máy thống nhất, gắn chi phí với năng suất thực tế.', ['Hệ thống KPI minh bạch', 'Kiểm soát ngân sách, dòng tiền', 'Phòng ngừa rủi ro pháp lý, thuế']),
        ('Phòng Quản lý Dự án tham mưu, triển khai và giám sát các chương trình trọng điểm của Ban Giám đốc.', ['Máy bán hàng tự động', 'Đào tạo lái xe', 'Cung ứng nhân lực, XKLĐ'])], [
        ('A direct field force with a standing presence in hospitals, opening accounts and teaching cashless payment.', ['~300 staff, 10+ sales offices', 'Healthcare desk inside hospitals', 'Transparent reconciliation']),
        ('Corporate agent for national insurers; voluntary social insurance, family health insurance and welfare payments.', ['Non-life insurance (PVI)', 'Social insurance in 25+ communes', '100% payout rate in 6 communes']),
        ('HR and finance in a single office, tying cost to real productivity.', ['Transparent KPI system', 'Budget and cash-flow control', 'Legal and tax risk prevention']),
        ('The project office advises on, runs and audits the board\'s priority programmes.', ['Vending machines', 'Driver training', 'Workforce supply'])])
    names_en = ['Digital &amp; financial services', 'Insurance &amp; social security', 'Operations', 'Projects &amp; workforce']
    cards = [card(T(k[2], names_en[i]), kd[i][0], icon=k[4], href=f'Services.dc.html#{k[0]}', num=T(k[1], f'Division 0{i + 1}'), items=kd[i][1], more=T('Xem chi tiết', 'Learn more')) for i, k in enumerate(KHOI)]
    fields = sec(head(T('Lĩnh vực hoạt động', 'What we do'), T('Một hệ sinh thái, *bốn khối bổ trợ lẫn nhau*', 'One ecosystem, *four divisions that reinforce each other*'),
                      T('Thay vì phát triển riêng lẻ từng mảng, MGST thiết lập mô hình đa tầng: mỗi lĩnh vực là điểm chạm đưa khách hàng đến lĩnh vực kế tiếp.', 'Rather than growing each line on its own, MGST runs a layered model in which every service is a touchpoint for the next.'))
                 + grid(cards, 4), id='linh-vuc')
    pj_en = [('Vending machines', 'Essential-goods machines paid by QR in communes, paired with help opening bank accounts and cards.'),
             ('Driver training', 'Advice, enrolment and paperwork through our existing network; a training site in Sóc Trăng is under study.'),
             ('Workforce supply', 'Selection, vocational and language training, and placement in Europe and East Asia.')]
    pcards = [f'<a class="post" href="Projects.dc.html#{p[0]}">{photo(p[5])}<span class="post-tx"><span class="tag" style="align-self: flex-start">{p[3]}</span><h3>{T(p[1], pj_en[i][0])}</h3><p>{T(p[2], pj_en[i][1])}</p></span></a>' for i, p in enumerate(PROJ)]
    projects = sec(head(T('Dự án trọng điểm', 'Flagship projects'), T('Ba dự án *đang triển khai*', 'Three projects *under way*'),
                        T('Do Phòng Quản lý Dự án chủ trì, tận dụng chính mạng lưới nhân sự và điểm chạm sẵn có của hệ sinh thái.', 'Led by the project office and built on the ecosystem\'s existing people and touchpoints.'),
                        btn(T('Xem tất cả dự án', 'All projects'), 'Projects.dc.html', 'secondary', arrow=True)) + grid(pcards, 3))
    band = vband(T(['Gần dân trong triển khai', 'Minh bạch với đối tác', 'Trách nhiệm với cộng đồng'], ['Close to the people', 'Transparent with partners', 'Responsible to the community']))
    val = T([('map', 'Mở rộng độ phủ', 'Đưa dịch vụ tài chính số đến người dân và hộ kinh doanh truyền thống qua mạng lưới bán hàng trực tiếp.'),
             ('bolt', 'Tự chủ, linh hoạt', 'Tự chủ tổ chức bộ máy, phân bổ địa bàn và điều chỉnh nhân sự theo quy mô từng chương trình.'),
             ('check', 'Quản trị chất lượng', 'Theo sát trải nghiệm sau khi mở tài khoản, hỗ trợ duy trì số dư và giao dịch thường xuyên.'),
             ('chart', 'Báo cáo xuyên suốt', 'Dữ liệu minh bạch, chuẩn xác phục vụ đối soát và tham mưu điều chỉnh chiến lược kịp thời.')],
            [('map', 'Wider reach', 'Digital finance delivered to households and traditional traders through direct sales.'),
             ('bolt', 'Autonomous and flexible', 'We staff, allocate territory and scale teams to fit each programme.'),
             ('check', 'Quality after sign-up', 'We follow the customer after onboarding to keep balances and transactions active.'),
             ('chart', 'Reporting throughout', 'Accurate data for reconciliation and timely strategy adjustments.')])
    why = sec(head(T('Giá trị cho đối tác', 'Value for partners'), T('Đối tác chiến lược của *ngân hàng, bảo hiểm và cơ quan quản lý*', 'A strategic partner to *banks, insurers and public agencies*'),
                   T('Quy trình khép kín từ tiếp nhận chính sách, đào tạo nghiệp vụ, điều phối địa bàn, kiểm soát chất lượng đến đối soát kết quả.', 'A closed loop from policy intake and training to field coordination, quality control and reconciliation.'))
              + grid([card(t, d, icon=i) for i, t, d in val], 4), 'sec--dk')
    partners = sec(f'<ul class="logos" aria-label="{T("Đối tác được nêu trong hồ sơ năng lực", "Partners named in our profile")}"><li><img src="{blob("pvi")}" alt="PVI" style="filter: invert(1) brightness(.35)"></li><li>VPBank</li><li>VNPAY</li><li>Toro</li><li class="tag tag--line" style="font-size: 12px; font-weight: 500">{T("Logo chính thức: chờ đối tác cung cấp", "Official logos pending")}</li></ul>')
    csr_en = [('Lighting rural roads', 'Sponsored street lighting for safer travel and better-looking villages.'), ('Welfare gifts', 'Insurance cards, gifts and direct support for families in need.'),
              ('Digital skills for all', 'Teaching e-banking, benefit receipt and safe online payment.'), ('Digitising small traders', 'QR payment codes and access to modern financial tools.')]
    csr = sec(head(T('Trách nhiệm cộng đồng', 'Community'), T('Hiệu quả kinh doanh *gắn với lợi ích địa phương*', 'Business results *tied to local benefit*'))
              + split(grid([card(T(t, csr_en[n][0]), T(d, csr_en[n][1]), icon=i) for n, (i, t, d) in enumerate(CSR)], 2).replace('class="grid', 'style="border-top: 0" class="grid'), photo('a')))
    qa = T([('MGST hợp tác với đối tác theo hình thức nào?', 'MGST tổ chức triển khai các chương trình của ngân hàng, bảo hiểm và cơ quan quản lý tại địa bàn: tự tổ chức nhân sự, phân bổ khu vực, kiểm soát chất lượng và đối soát kết quả theo điều khoản hợp tác.'),
            ('MGST đang hoạt động ở những khu vực nào?', 'Hơn 10 phòng kinh doanh phủ các tỉnh, thành Đồng bằng sông Cửu Long, trọng tâm là Cần Thơ, Sóc Trăng, An Giang và Đồng Tháp.'),
            ('Người dân được hỗ trợ những gì khi mở tài khoản?', 'Nhân sự MGST hướng dẫn mở và sử dụng tài khoản, nhận tiền, chuyển khoản, thanh toán không dùng tiền mặt; tại bệnh viện có hỗ trợ thanh toán viện phí.'),
            ('Chi trả bảo trợ xã hội được thực hiện ra sao?', 'Chi trả cho người hưởng lương hưu, trợ cấp và người có công tại 6 xã, phường, ưu tiên chuyển sang chi trả qua tài khoản; hỗ trợ tận nhà cho người cao tuổi, ốm đau.'),
            ('Làm sao để đăng ký học lái xe hoặc tìm hiểu việc làm ngoài nước?', 'Gửi yêu cầu qua nút Tư vấn nhanh hoặc gọi hotline. Chuyên viên sẽ tư vấn hạng bằng, hồ sơ, đơn hàng và lộ trình phù hợp.')],
           [('How does MGST work with partners?', 'We run banks\', insurers\' and agencies\' programmes in the field: staffing, territory allocation, quality control and reconciliation under the partnership terms.'),
            ('Where does MGST operate?', 'More than 10 sales offices across the Mekong Delta, centred on Cần Thơ, Sóc Trăng, An Giang and Đồng Tháp.'),
            ('What help do people get when opening an account?', 'Our staff show them how to open and use an account, receive and send money and pay without cash; in hospitals we help with bill payment.'),
            ('How are welfare payments made?', 'Pensions and allowances are paid in 6 communes, moving from cash to bank accounts, with home visits for the elderly and ill.'),
            ('How do I ask about driver training or work abroad?', 'Use Quick enquiry or call the hotline. A specialist will advise on licence class, paperwork, openings and timeline.')])
    faqs = sec(head(T('Câu hỏi thường gặp', 'FAQ'), T('Những điều đối tác và người dân *hay hỏi*', 'What partners and residents *ask most*')) + faq(qa))
    page('MainEN' if LANG == 'en' else 'Main', T('Trang chủ', 'Home'), 'Main', hero + st + fields + projects + band + why + partners + csr + faqs + cta())

def about():
    b = phero(['Giới thiệu'], 'Về Minh Group ST', 'Doanh nghiệp tiên phong với mô hình *hệ sinh thái đa tầng*',
              'Công ty TNHH Minh Group ST (MGST) hoạt động tại Đồng bằng sông Cửu Long, là đối tác tin cậy của ngân hàng, tập đoàn bảo hiểm, cơ quan quản lý nhà nước và các tổ chức quốc tế.', 'g',
              btn('Xem cơ cấu tổ chức', 'Organization.dc.html', arrow=True) + btn('Lĩnh vực hoạt động', 'Services.dc.html', 'secondary'))
    b += sec(stats([('03/2025', 'thành lập tại Cần Thơ'), ('~300', 'nhân sự chuyên trách'), ('10+', 'phòng kinh doanh địa bàn'), ('4', 'khối hoạt động bổ trợ nhau')]).replace('class="grid', 'style="border-top: 0" class="grid'))
    b += sec(head('Tổng quan', 'Sức mạnh tại chỗ, *thấu hiểu địa bàn*')
             + split('<div class="pad prose"><p>Với nguồn lực tại chỗ và sự thấu hiểu sâu sắc địa bàn, MGST tổ chức triển khai các chương trình hợp tác ngân hàng, bảo hiểm và an sinh, kết nối sản phẩm của đối tác với nhu cầu thực tế của người dân và hộ kinh doanh.</p><p>Thay vì phát triển riêng lẻ từng mảng, MGST từng bước thiết lập <strong>mô hình hệ sinh thái đa tầng</strong>: từ chuyển đổi số, tài chính – ngân hàng, bảo hiểm, an sinh xã hội đến đào tạo lái xe, máy bán hàng tự động và cung ứng việc làm, mỗi lĩnh vực đều bổ trợ cho lĩnh vực còn lại.</p></div>', photo('k')))
    eco = [('scan', 'Chuyển đổi số'), ('bank', 'Tài chính – Ngân hàng'), ('shield', 'Bảo hiểm'), ('heart', 'An sinh xã hội'), ('car', 'Đào tạo lái xe'), ('vend', 'Máy bán hàng tự động'), ('globe', 'Cung ứng việc làm')]
    b += sec(head('Hệ sinh thái', '*Bảy lĩnh vực* tạo nên sức mạnh tổng hợp', 'Mỗi lĩnh vực là một điểm chạm: người dân mở tài khoản tại bệnh viện có thể tham gia bảo hiểm, đăng ký học lái xe hay mua hàng giá hội viên tại máy.')
             + grid([card(t, icon=i, num=f'{n:02d}') for n, (i, t) in enumerate(eco, 1)] + [card('Xem bốn khối hoạt động', 'Cách các lĩnh vực được tổ chức thành bốn khối.', href='Services.dc.html', cls='card--brand', more='Lĩnh vực')], 4), 'sec--tint')
    b += vband(['Gần dân trong triển khai', 'Minh bạch với đối tác', 'Trách nhiệm với cộng đồng'])
    b += sec(head('Triết lý hành động', 'Ba cam kết *định hình cách chúng tôi làm việc*')
             + grid([card('Gần dân trong triển khai', 'Nhân sự bám sát địa bàn, có mặt ở bệnh viện, trung tâm hành chính công, ấp và khu vực; sẵn sàng đến tận nhà người cao tuổi.', icon='users', num='01'),
                     card('Minh bạch với đối tác', 'Dữ liệu chuẩn xác, đối soát rõ ràng, báo cáo định kỳ và xử lý phát sinh kịp thời giữa đối tác và lực lượng cơ sở.', icon='eye', num='02'),
                     card('Trách nhiệm với cộng đồng', 'Gắn hiệu quả kinh doanh với lợi ích thiết thực cho địa phương qua các hoạt động an sinh và phổ cập kỹ năng số.', icon='heart', num='03')], 3), 'sec--dk')
    b += sec(head('Đối tác chiến lược', 'Chúng tôi đồng hành cùng *bốn nhóm đối tác*')
             + grid([card('Ngân hàng', 'Mở rộng độ phủ tài khoản số, duy trì chất lượng giao dịch.', icon='bank'), card('Tập đoàn bảo hiểm', 'Đại lý tổ chức, tư vấn và hỗ trợ bồi thường tận nơi.', icon='shield'),
                     card('Cơ quan quản lý nhà nước', 'Phối hợp phát triển BHXH, BHYT và chi trả bảo trợ xã hội.', icon='gov'), card('Tổ chức quốc tế', 'Hợp tác cung ứng và đào tạo nguồn nhân lực.', icon='globe')], 4))
    tl = [('2025', 'Đặt nền móng', 'Thành lập công ty và những phòng kinh doanh đầu tiên.', [
              ('03/2025', 'Thành lập Công ty TNHH Minh Group ST', 'Đặt nền móng vận hành và cấu trúc hoạt động tại miền Tây.', 'Công ty'),
              ('04/2025', 'PKD Tổng hợp, PKD Y và PKD địa bàn 1, 2, 3, 5, 6, 7', 'Thúc đẩy chuyển đổi số y tế và địa phương.', '8 phòng kinh doanh'),
              ('09/2025', 'PKD 8', 'Mở rộng độ phủ hỗ trợ chuyển đổi số.', 'Phòng kinh doanh'),
              ('11/2025', 'PKD An sinh', 'Đẩy mạnh BHXH, BHYT và an sinh cộng đồng.', 'Khối An sinh')]),
          ('2026', 'Hoàn thiện mạng lưới', 'Bổ sung phòng chức năng và phủ kín địa bàn.', [
              ('01/2026', 'Phòng Dự án', 'Hạt nhân xây dựng và thúc đẩy chiến lược kinh doanh.', 'Khối Dự án'),
              ('03/2026', 'PKD 9', 'Tiếp tục tăng cường mạng lưới.', 'Phòng kinh doanh'),
              ('04/2026', 'Phòng Kế toán – Nhân sự*', 'Củng cố quản trị nội bộ và tối ưu vận hành.', 'Khối Vận hành'),
              ('06/2026', 'PKD 4', 'Hoàn thiện mắt xích mạng lưới miền Tây.', 'Phòng kinh doanh'),
              ('07/2026', 'Phòng Chi trả Bảo trợ xã hội', 'Chi trả hưu trí, trợ cấp và chế độ người có công.', 'Khối An sinh'),
              ('09/2026', 'PKD 10 và PKD 11', 'Hoàn thiện mạng lưới phòng kinh doanh địa bàn.', '2 phòng kinh doanh')])]
    t = ''
    for y, lab, note, rows in tl:
        t += (f'<div class="tl-grp"><div class="tl-yr"><div><b>{y}</b><h3>{lab}</h3><span>{note} {len(rows)} cột mốc.</span></div></div><ol class="tl">'
              + ''.join(f'<li><time>{d}</time><div><h3>{h}</h3><p>{p}</p><span class="tag">{g}</span></div></li>' for d, h, p, g in rows) + '</ol></div>')
    b += sec(head('Lịch sử &amp; Cột mốc', 'Từ một công ty mới đến *mạng lưới phủ miền Tây*') + t + '<p class="pad hint blk">* Mốc 04/2026 giữ theo hồ sơ gốc, cần xác nhận lại (có thể là 04/2025).</p>', id='cot-moc')
    b += sec(head('Trách nhiệm cộng đồng', 'Đồng hành cùng *địa phương và người dân*') + grid([card(t_, d, icon=i) for i, t_, d in CSR], 4), 'sec--tint')
    page('About', 'Giới thiệu', 'About', b + cta())

def organization():
    b = phero(['Tổ chức &amp; Lãnh đạo'], 'Cơ cấu tổ chức', 'Bộ máy gọn, *bốn khối rõ vai trò*',
              'Ban lãnh đạo điều hành bốn khối: Chuyển đổi số, An sinh, Quản lý vận hành và Xây dựng kế hoạch – thực thi dự án.', 'l',
              btn('Xem ban lãnh đạo', '#lanh-dao', arrow=True) + btn('Lĩnh vực hoạt động', 'Services.dc.html', 'secondary'))
    units = [('Khối 01', 'Chuyển đổi số', ['PKD Lưu động', 'PKD kênh Y tế', 'PKD Tổng hợp']), ('Khối 02', 'An sinh', ['Phòng An sinh (BHXH, BHYT)', 'Phòng Chi trả', 'Bảo hiểm học sinh']),
             ('Khối 03', 'Quản lý vận hành &amp; Nội bộ', ['Nhân sự', 'Kế toán', 'Hậu cần &amp; Kỹ thuật']), ('Khối 04', 'Kế hoạch &amp; Thực thi dự án', ['Trường dạy lái xe', 'Máy bán hàng tự động', 'Cung ứng nhân lực'])]
    cols = [f'<div class="org-col"><header><span>{n}</span><h3>{t}</h3></header><ul>' + ''.join(f'<li>{ic("check", 16, 2.2)}{u}</li>' for u in us) + '</ul></div>' for n, t, us in units]
    b += sec(head('Sơ đồ tổ chức', 'Một ban lãnh đạo, *bốn khối, mười hai đơn vị*') + '<div class="org-root"><b>Ban lãnh đạo</b></div>' + grid(cols, 4, tag='div'), id='so-do')
    b += sec(head('Vai trò từng khối', 'Mỗi khối *một nhiệm vụ trọng tâm*')
             + grid([card(k[2], k[3], icon=k[4], num=k[1], href=f'Services.dc.html#{k[0]}', more='Xem chi tiết') for k in KHOI], 4), 'sec--tint')
    ld = [('Ông Đinh Hoàng Minh', 'Cố vấn Cao cấp'), ('Ông Đinh Hoàng Công', 'Giám đốc Công ty'), ('Ông Lư Hồng Huỳnh', 'Phó Giám đốc'),
          ('Bà Nguyễn Thị Hồng Huệ', 'Phó Giám đốc'), ('Ông Phan Hữu Linh', 'Phó Giám đốc'), ('Ông Dương Minh Trường', 'Phó Giám đốc')]
    b += sec(head('Ban lãnh đạo', 'Những người *điều hành hệ sinh thái*', 'Ảnh chân dung và phạm vi phụ trách sẽ được cập nhật khi có xác nhận từ Ban Giám đốc.')
             + grid([f'<div class="person"><span class="av" role="img" aria-label="Ảnh chân dung: chờ cập nhật">{ic("person", 32, 1.4)}</span><div><h3>{n}</h3><p>{r}</p></div></div>' for n, r in ld], 3, tag='div'), id='lanh-dao')
    b += sec(head('Nền tảng quản trị', 'Nhân sự và tài chính trong *một bộ máy thống nhất*')
             + grid([card('Đồng bộ nguồn lực', 'Gắn kế hoạch chi phí với năng suất lao động thực tế.', icon='link'), card('Phòng ngừa rủi ro', 'Chủ động nhận diện rủi ro pháp lý lao động, BHXH, thuế và an toàn tài chính.', icon='shield'),
                     card('Tối ưu vận hành', 'Nâng tốc độ xử lý công việc, bảo đảm phát triển bền vững cho toàn công ty.', icon='trend')], 3), 'sec--dk')
    page('Organization', 'Tổ chức & Lãnh đạo', 'Organization', b + cta())

def services():
    b = phero(['Lĩnh vực hoạt động'], 'Bốn khối hoạt động', 'Một hệ sinh thái, *bốn khối bổ trợ lẫn nhau*',
              'Từ dịch vụ tài chính số, bảo hiểm và an sinh đến vận hành nội bộ và các dự án mới: mỗi khối có chủ đề, năng lực và cam kết riêng.', 'b',
              btn('Liên hệ hợp tác', 'Contact.dc.html', arrow=True))
    b += sec('<nav class="jump" aria-label="Đi nhanh đến từng khối">' + ''.join(f'<a href="#{k[0]}"><span>{k[1]}</span><b>{k[2]}</b></a>' for k in KHOI) + '</nav>', 'sec--sticky')
    def khoi(i, lead, rows, cls=''):
        k = KHOI[i]
        return sec(head(k[1], k[2], f'<strong style="color: var(--tx); font-weight: 600">{k[3]}.</strong> {lead}') + ''.join(rows), cls, k[0])
    b += khoi(0, 'MGST tổ chức triển khai các chương trình hợp tác ngân hàng và dịch vụ tài chính tại miền Tây, kết nối sản phẩm của đối tác với nhu cầu thực tế của người dân và hộ kinh doanh.', [
        stats([('~300', 'nhân sự chuyên trách'), ('10+', 'phòng kinh doanh trực tiếp'), ('20.000–40.000', 'tài khoản/tháng từng đạt')], 3).replace('c3 keep2', 'c3'),
        feat('1.1', 'Năng lực thực thi tại địa bàn', 'Trọng tâm Cần Thơ, Sóc Trăng, An Giang, Đồng Tháp.', [
            card('Quy mô lực lượng', 'Khoảng 300 nhân sự cùng hơn 10 phòng kinh doanh trực tiếp phủ các tỉnh, thành ĐBSCL.', icon='users'),
            card('Hiện diện tại cơ sở y tế', 'PKD Y tế bố trí nhân sự thường trực tại bệnh viện: mở tài khoản, hướng dẫn thanh toán viện phí không tiền mặt.', icon='hos'),
            card('Quy trình khép kín', 'Tiếp nhận chính sách, đào tạo nghiệp vụ, điều phối địa bàn, kiểm soát chất lượng, đối soát kết quả.', icon='check')]),
        feat('1.2', 'Giá trị cho đối tác ngân hàng', 'Không chỉ mở tài khoản, mà theo sát cả quá trình sử dụng.', [
            card('Mở rộng độ phủ', 'Đưa dịch vụ tài chính số đến người dân và hộ kinh doanh truyền thống qua mạng lưới bán hàng trực tiếp.', icon='map'),
            card('Tự chủ &amp; linh hoạt', 'Tự chủ tổ chức bộ máy, phân bổ địa bàn, điều chỉnh nhân sự theo quy mô chương trình.', icon='bolt'),
            card('Chất lượng giao dịch', 'Hỗ trợ duy trì số dư và phát sinh giao dịch thường xuyên theo điều khoản hợp tác.', icon='card'),
            card('Báo cáo xuyên suốt', 'Tổng hợp dữ liệu minh bạch phục vụ đối soát và tham mưu điều chỉnh chiến lược.', icon='chart')], cols=2)])
    b += khoi(1, 'Đại lý tổ chức của các tổng công ty bảo hiểm, đồng thời là lực lượng phát triển BHXH, BHYT và chi trả bảo trợ xã hội tại cơ sở.', [
        feat('2.1', 'Bảo hiểm phi nhân thọ', 'Đại lý tổ chức của các tổng công ty bảo hiểm hàng đầu, tiêu biểu là PVI.', [
            card('Giải pháp toàn diện', 'Bảo hiểm tài sản, xe cơ giới, trách nhiệm dân sự và tai nạn.', icon='shield'),
            card('Đội ngũ lưu động', 'Phản ứng nhanh, tư vấn và hỗ trợ xử lý bồi thường tận nơi tại từng địa bàn.', icon='truck'),
            card('Đối tác bảo hiểm', 'PVI và các tổng công ty bảo hiểm theo từng chương trình hợp tác.', icon='link')]),
        feat('2.2', 'Phòng Kinh doanh An sinh', 'BHXH tự nguyện, BHYT hộ gia đình và bảo hiểm học sinh.', [
            card('BHXH &amp; BHYT', 'Phối hợp chính quyền địa phương tuyên truyền gần dân. Mạng lưới cộng tác viên uy tín đến từng ấp, khu vực, vận hành trên hơn 25 xã, phường.', icon='heart'),
            card('Bảo hiểm học sinh', 'Gói bảo hiểm cho học sinh các cấp; bồi thường minh bạch, nhanh chóng; trích đóng góp quỹ khuyến học địa phương.', icon='cap'),
            card('Nâng cao nhận thức', 'Giúp người dân chủ động thiết lập "màng bọc tài chính" trước rủi ro sức khỏe và lao động.', icon='bulb')]),
        feat('2.3', 'Phòng Chi trả Bảo trợ xã hội', 'Mảng đặc thù, đòi hỏi chuẩn mực đạo đức và sự chính xác tuyệt đối.', [
            card('Quy mô triển khai', 'Vận hành ổn định tại 6 xã, phường: lương hưu, trợ cấp bảo trợ xã hội, người có công với cách mạng.', icon='gov'),
            card('Hiệu quả số hóa', 'Tỷ lệ chi trả 100%, chuyển từ tiền mặt sang chi trả qua tài khoản ngân hàng.', icon='coins'),
            card('Đội ngũ tận tâm', 'Sẵn sàng đến tận nhà hỗ trợ người cao tuổi, người ốm đau, gia đình chính sách.', icon='home')]),
        '<ul class="grid c4 keep2">' + ''.join(f'<li><div class="card card--tint"><span class="num">Tiêu chí chi trả</span><h3>{t}</h3></div></li>' for t in ['Đúng đối tượng', 'Đúng số tiền', 'Kịp thời', 'Minh bạch']) + '</ul>'], 'sec--tint')
    b += khoi(2, 'Khối giữ vai trò "trái tim" điều hành, kết nối hai nguồn lực cốt lõi: quản trị con người và quản trị tài chính.', [
        feat('3.1', 'Quản trị nhân sự', 'Phát huy giá trị con người.', [
            card('Hoạch định &amp; phát triển', 'Cơ cấu tổ chức tối ưu, chuẩn hóa tuyển dụng, đào tạo, bố trí nhân lực theo sự mở rộng của dự án.', icon='users'),
            card('Quản trị hiệu suất (KPI)', 'Đánh giá KPI minh bạch, gắn với lương, thưởng, phúc lợi cạnh tranh.', icon='trend'),
            card('Đào tạo &amp; môi trường', 'Nâng cao tay nghề, xây dựng văn hóa kỷ luật, nhân văn và chuyên nghiệp.', icon='cap')]),
        feat('3.2', 'Kế toán – Tài chính', 'Chính xác, minh bạch và hiệu quả.', [
            card('Hạch toán &amp; tuân thủ', 'Ghi nhận đầy đủ nghiệp vụ, quản lý chứng từ khắt khe, báo cáo tài chính đúng chuẩn mực pháp luật.', icon='tax'),
            card('Ngân sách &amp; dòng tiền', 'Hoạch định ngân sách, phân tích chi phí, tối ưu nguồn vốn, bảo đảm thanh khoản.', icon='coins'),
            card('Tham mưu chiến lược', 'Dữ liệu tài chính đa chiều, định kỳ cho quyết định đầu tư và vận hành của Ban Giám đốc.', icon='chart')])])
    b += khoi(3, 'Phòng Quản lý Dự án là đầu mối tham mưu, thẩm định, triển khai và giám sát các chương trình trọng điểm từ Ban Giám đốc.', [
        feat('4.1', 'Phòng Quản lý Dự án', 'Chủ động trong triển khai, khách quan trong kiểm tra, hiệu quả trong thực hiện.', [
            card('Tham mưu &amp; triển khai', 'Xây dựng lộ trình, cơ chế phối hợp và phương án tổ chức nhân sự cho các dự án mới.', icon='compass'),
            card('Kiểm tra &amp; giám sát', 'Rà soát tuân thủ quy trình nghiệp vụ, phát hiện sớm rủi ro, giữ kỷ luật vận hành toàn hệ thống.', icon='search'),
            card('Đánh giá &amp; báo cáo', 'Tổng hợp số liệu thực tế, phân tích hiệu quả, đề xuất cải tiến liên tục.', icon='chart')]),
        grid([card(p[1], p[2], icon=p[4], tag=p[3], href=f'Projects.dc.html#{p[0]}', more='Xem dự án') for p in PROJ], 3)], 'sec--dk')
    page('Services', 'Lĩnh vực hoạt động', 'Services', b + cta().replace('sec--dk', ''))

def projects():
    b = phero(['Dự án trọng điểm'], 'Phòng Quản lý Dự án', 'Ba dự án *mở rộng hệ sinh thái*',
              'Các dự án do Phòng Quản lý Dự án chủ trì, tận dụng lực lượng khoảng 300 nhân sự và những điểm chạm sẵn có tại bệnh viện, trung tâm hành chính công.', 'h',
              btn('Trao đổi về dự án', 'Contact.dc.html', arrow=True))
    b += sec('<nav class="jump" aria-label="Đi nhanh đến từng dự án" style="grid-template-columns: repeat(3, minmax(0, 1fr))">' + ''.join(f'<a href="#{p[0]}"><span>Dự án {i:02d}</span><b>{p[1]}</b></a>' for i, p in enumerate(PROJ, 1)) + '</nav>', 'sec--sticky')
    b += sec(head('Dự án 01', 'Máy bán hàng tự động: *có tài khoản và dùng tài khoản mỗi ngày*',
                  'Hợp tác cùng ngân hàng VPBank, đơn vị cung cấp máy Toro và trung gian thanh toán VNPAY. Người dân mở tài khoản, thẻ qua MGST được đăng ký hội viên và mua hàng giá ưu đãi tại máy.')
             + grid([card('Hội viên &amp; tài khoản', icon='id', items=['Hướng dẫn mở tài khoản, thẻ; cài ứng dụng, thanh toán QR', 'Đăng ký bằng số điện thoại và PIN 4 số, dễ với người lớn tuổi', 'Có phiếu đồng ý xử lý thông tin cá nhân']),
                     card('Lắp đặt &amp; vận hành máy', icon='vend', items=['Đặt tại trung tâm hành chính công, trường học, chợ, tiệm tạp hóa', 'Hiển thị giá hội viên; một mã QR VNPAY', 'Quản lý từ xa, hóa đơn điện tử từng đơn']),
                     card('Hàng hóa thiết yếu', icon='truck', items=['10 nhóm hàng: nước mắm, dầu ăn, đường, mì gói, sữa…', 'Hàng chính hãng từ nhà phân phối tại Cần Thơ', 'Châm hàng, kiểm tra hạn dùng định kỳ']),
                     card('Hội chợ không tiền mặt', icon='qr', items=['Mua sắm hàng thiết yếu tại xã, phường', 'Toàn bộ giao dịch thanh toán bằng mã QR', 'Kết hợp hướng dẫn, giao lưu']),
                     card('Đối soát &amp; báo cáo', icon='chart', items=['Đối soát giao dịch, lượt ưu đãi hằng ngày', 'Theo dõi tài khoản mở, tỷ lệ còn giao dịch, doanh số', 'Báo cáo hằng tuần cho Ban Giám đốc và đối tác']),
                     card('Gần dân – Rõ ràng – Hiệu quả', 'Gần dân trong triển khai, rõ ràng với đối tác, hiệu quả cho địa phương.', cls='card--brand', num='Phương châm')], 3)
             + steps([('Thí điểm', '1 máy trong 1 tháng tại 1 xã, phường; đánh giá kết quả trước khi mở rộng.'), ('Hội chợ số', 'Tổ chức hội chợ không dùng tiền mặt với 11 máy trong 30 ngày.'),
                      ('Nhân rộng', 'Phủ điểm đặt máy tại TP. Cần Thơ, từng bước mở rộng ra các tỉnh ĐBSCL.')]), id='may-ban-hang')
    b += sec(head('Dự án 02', 'Đào tạo lái xe: *thuận tiện, minh bạch, gần dân*',
                  'Trước mắt, MGST phối hợp với các cơ sở đào tạo đủ điều kiện để hỗ trợ tuyển sinh, tiếp nhận và hoàn thiện hồ sơ học lái xe mô tô hạng A1, A theo quy định.')
             + split(grid([card('Mạng lưới tiếp cận', 'Khoảng 300 nhân sự cùng cộng tác viên tại các ấp, khu vực đưa thông tin tuyển sinh đến gần người dân.', icon='users'),
                           card('Liên kết hệ sinh thái', 'Khoảng 10 bệnh viện và 10 điểm phục vụ hành chính công để tư vấn, hướng dẫn thủ tục, kết nối khám sức khỏe.', icon='link'),
                           card('Tiện ích số &amp; bảo hiểm', 'Thanh toán không tiền mặt, dịch vụ ngân hàng và bảo hiểm xe cơ giới từ đối tác.', icon='card'),
                           card('Định hướng đầu tư', 'Nghiên cứu đầu tư cơ sở đào tạo và sân sát hạch tại khu vực Sóc Trăng.', icon='flag')], 2).replace('class="grid', 'style="border-top: 0" class="grid'), photo('f'), flip=True)
             + steps([('Tư vấn hạng bằng', 'Chọn hạng giấy phép lái xe phù hợp nhu cầu.'), ('Hồ sơ &amp; sức khỏe', 'Hướng dẫn chuẩn bị hồ sơ, ảnh và khám sức khỏe.'), ('Đăng ký đào tạo', 'Kết nối với cơ sở đào tạo đủ điều kiện.'),
                      ('Lịch học, sát hạch', 'Cập nhật theo thông báo của đơn vị có thẩm quyền.'), ('Kết quả &amp; thủ tục', 'Tiếp nhận thông tin kết quả và các thủ tục liên quan.')], 5)
             + '<p class="pad hint blk">Việc tổ chức đào tạo, sát hạch chỉ được triển khai khi đáp ứng đầy đủ điều kiện và được cơ quan có thẩm quyền chấp thuận theo quy định.</p>', 'sec--tint', 'lai-xe')
    b += sec(head('Dự án 03', 'Cung ứng nhân lực &amp; tư vấn XKLĐ: *đúng người, đúng việc, đúng tiến độ*',
                  'Cầu nối đưa người lao động Việt Nam ra thị trường quốc tế, tập trung nâng chất lượng tay nghề, ngoại ngữ và tác phong công nghiệp.')
             + grid([card('Nguồn tuyển sâu sát cơ sở', 'Mạng lưới cộng tác viên an sinh tại 25+ xã, phường; liên kết với Sở và Trung tâm Dịch vụ việc làm các tỉnh ĐBSCL.', icon='users'),
                     card('Đào tạo khép kín', 'Đào tạo nghề nội bộ (lái xe, kỹ thuật) cùng tiếng Nhật, Hàn, Anh và văn hóa doanh nghiệp nước sở tại.', icon='cap'),
                     card('Đơn hàng chất lượng', 'Hợp tác với tổ chức xúc tiến và nghiệp đoàn uy tín tại từng thị trường.', icon='medal')], 3)
             + '''<div class="tbl-wrap"><table class="tbl"><caption class="sr">Thị trường và ngành nghề</caption><thead><tr><th scope="col">Thị trường</th><th scope="col">Ngành nghề</th><th scope="col">Đối tác, kênh hợp tác</th></tr></thead><tbody>
<tr><th scope="row">Châu Âu (Hy Lạp…)</th><td>Kỹ thuật công nghiệp: cơ khí, bảo trì, vận hành máy, lắp ráp ô tô, logistics. Nông nghiệp và dịch vụ: chế biến thực phẩm, nhà hàng – khách sạn.</td><td>Chủ sử dụng lao động tại nước sở tại</td></tr>
<tr><th scope="row">Đông Á (Nhật Bản, Hàn Quốc, Đài Loan)</th><td>Kỹ sư, thực tập sinh kỹ năng, điều dưỡng, lao động phổ thông.</td><td>JETRO, KOTRA, KOCHAM và các nghiệp đoàn</td></tr>
</tbody></table></div>'''
             + grid([card('Tuyển chọn nghiêm ngặt', 'Sàng lọc hồ sơ, sức khỏe, chuyên môn và ý thức kỷ luật.', icon='search'),
                     card('Minh bạch tài chính, pháp lý', 'Tuân thủ luật lao động Việt Nam và nước sở tại; công khai chi phí, lộ trình xuất cảnh 6–8 tháng.', icon='scale'),
                     card('Đồng hành suốt hợp đồng', 'Bộ phận quản lý lao động ngoài nước theo sát, hỗ trợ người lao động và chủ sử dụng.', icon='hand')], 3), id='nhan-luc')
    page('Projects', 'Dự án trọng điểm', 'Projects', b + cta())

def news():
    b = phero(['Tin tức &amp; Thư viện'], 'Tin tức', 'Hoạt động mới nhất *từ địa bàn*',
              'Tin hoạt động, dự án và hình ảnh từ các khối của Minh Group ST. Nội dung bài viết đang chờ bộ phận truyền thông cung cấp.', 'a')
    cats = ['Tất cả', 'Chuyển đổi số', 'An sinh', 'Dự án', 'Cộng đồng']
    chips = '<div class="pad chips" role="group" aria-label="Lọc theo chủ đề" style="padding-top: 20px; padding-bottom: 20px">' + ''.join(f'<button type="button" class="chip" aria-pressed="{"true" if i == 0 else "false"}">{c}</button>' for i, c in enumerate(cats)) + '</div>'
    posts = [('Dự án', 'h', '[Tiêu đề: Thí điểm máy bán hàng tự động tại xã, phường]'), ('Cộng đồng', 'a', '[Tiêu đề: Công trình Thắp sáng đường quê]'), ('An sinh', 'b', '[Tiêu đề: Tuyên truyền BHXH tự nguyện]'),
             ('Chuyển đổi số', 'k', '[Tiêu đề: Hỗ trợ thanh toán viện phí không tiền mặt]'), ('Dự án', 'f', '[Tiêu đề: Tiếp nhận hồ sơ học lái xe hạng A1]'), ('Cộng đồng', 'g', '[Tiêu đề: Trao thẻ bảo hiểm cho hộ khó khăn]')]
    b += sec(chips + grid([f'<a class="post" href="News.dc.html">{photo(k)}<span class="post-tx"><span class="tag" style="align-self: flex-start">{c}</span><h3>{t}</h3><p>[Tóm tắt 1–2 câu]</p><time>[Ngày đăng]</time></span></a>' for c, k, t in posts], 3)
             + f'<div class="pad blk" style="display: flex; justify-content: center">{btn("Xem thêm bài viết", "News.dc.html", "secondary")}</div>')
    b += sec(head('Thư viện', 'Hình ảnh *hoạt động*', 'Ảnh hiện tại là ảnh minh họa từ Wikimedia Commons; cần thay bằng ảnh thực tế của Minh Group ST.')
             + '<div class="gal">' + photo('k', 'w2') + photo('a') + photo('b') + photo('h') + photo('f') + photo('g', 'w2') + '</div>', id='thu-vien')
    page('News', 'Tin tức & Thư viện', 'News', b + cta())

def contact():
    b = phero(['Liên hệ'], 'Liên hệ', 'Kết nối đúng *bộ phận phụ trách*',
              'Chọn nhóm nhu cầu, để lại thông tin. Chuyên viên phụ trách sẽ liên hệ lại trong giờ làm việc.', 'g')
    b += sec(grid([card(f'<a href="{HOT_T}" style="color: inherit; text-decoration: none">{HOT}</a>', 'Hotline trong giờ làm việc', icon='phone'), card(f'<a href="mailto:{MAIL}" style="color: inherit; text-decoration: none; word-break: break-all">{MAIL}</a>', 'Hợp tác và hồ sơ năng lực', icon='mail'),
                   card(ADDR, 'Trụ sở chính', icon='pin'), card('[Giờ làm việc]', 'Chờ xác nhận', icon='clock')], 4).replace('class="grid', 'style="border-top: 0" class="grid'))
    opts = ''.join(f'<option>{o}</option>' for o in ['Hợp tác ngân hàng, tài chính', 'Bảo hiểm phi nhân thọ', 'BHXH, BHYT, bảo hiểm học sinh', 'Chi trả bảo trợ xã hội', 'Máy bán hàng tự động', 'Học lái xe', 'Việc làm ngoài nước', 'Khác'])
    form = f'''<div class="pad"><h2 class="h2" style="font-size: 28px; margin-bottom: 24px">Gửi yêu cầu</h2>
<form class="form" aria-label="Gửi yêu cầu liên hệ">
<label class="field"><span>Họ và tên <i aria-hidden="true">*</i></span><input type="text" autocomplete="name" required></label>
<label class="field"><span>Số điện thoại <i aria-hidden="true">*</i></span><input type="tel" inputmode="tel" autocomplete="tel" placeholder="09xx xxx xxx" required></label>
<label class="field">Email<input type="email" autocomplete="email"></label>
<label class="field">Đơn vị, tổ chức<input type="text" autocomplete="organization"></label>
<label class="field full">Nhu cầu<select>{opts}</select></label>
<label class="field full">Nội dung<textarea rows="4" placeholder="Mô tả ngắn nhu cầu của bạn"></textarea></label>
<p class="hint full">Thông tin được bảo vệ theo Nghị định 13/2023/NĐ-CP. Trường có dấu * là bắt buộc.</p>
<div class="full"><button type="button" class="btn btn--primary btn--lg">Gửi yêu cầu {ARROW}</button></div>
</form></div>'''
    b += sec(split(form, empty('Bản đồ: nhúng Google Maps tại 323–325 Phú Lợi', icon='map')), id='form')
    b += sec(head('Đúng bộ phận', 'Bạn thuộc *nhóm nào?*')
             + grid([card('Ngân hàng, tổ chức tài chính', 'Triển khai mở tài khoản, phát triển hộ kinh doanh, đối soát.', icon='bank', num='Khối 01'), card('Doanh nghiệp bảo hiểm, cơ quan BHXH', 'Đại lý tổ chức, phát triển người tham gia, chi trả.', icon='shield', num='Khối 02'),
                     card('Chính quyền địa phương', 'Phối hợp an sinh, phổ cập kỹ năng số, đặt máy bán hàng.', icon='gov', num='Khối 02 · 04'), card('Người dân, người lao động', 'Bảo hiểm, học lái xe, việc làm ngoài nước.', icon='users', num='Khối 02 · 04')], 4), 'sec--tint')
    page('Contact', 'Liên hệ', 'Contact', b)

def system():
    def sw(n, v, d=''):
        return f'<div class="sw"><i style="background: {v}"></i><b>{n}</b><span>{v}{" · " + d if d else ""}</span></div>'
    b = sec(head('Design system', 'MGST Web · *Tokens &amp; Components*', 'Một stylesheet cho mọi trang. Tên token dưới đây là tên biến CSS, dùng thẳng làm tên Variable và Component khi dựng lại trong Figma.', level=1)
            + grid([sw('brand/500', '#ca4d25', 'CTA, accent'), sw('brand/600', '#b54320', 'hover'), sw('brand/700', '#a63c1b', 'chữ trên nền tint'), sw('brand/300', '#ef7a52', 'accent trên nền tối'), sw('brand/100', '#f6dfd3', 'đường kẻ tint'), sw('brand/50', '#fdf1eb', 'nền tint'),
                    sw('ink/900', '#201e1d', 'chữ, nền tối'), sw('ink/700', '#3a3633', 'đường kẻ tối'), sw('ink/600', '#5c5c5c', 'chữ phụ 7:1'), sw('ink/500', '#6f6f6f', 'chú thích 5:1'), sw('line/100', '#ebebeb', 'đường kẻ lưới'), sw('bg/50', '#fafafa', 'nền hover')], 4, 'keep2', tag='div'))
    typ = [('display/h1', 'var(--fs-h1)', '600', 'clamp 34–60 · 1.06', 'Tiên phong số hóa'), ('display/h2', 'var(--fs-h2)', '600', 'clamp 28–44 · 1.12', 'Bốn khối bổ trợ lẫn nhau'), ('title/card', '18px', '600', '18 · 1.3', 'Quy trình khép kín'),
           ('body/lead', 'var(--fs-lead)', '400', '16–18 · 1.65', 'Đưa dịch vụ tài chính số đến tận tay người dân.'), ('body/base', '15px', '400', '15 · 1.6', 'Nội dung thẻ và đoạn mô tả.'), ('label/eyebrow', '13px', '600', '13 · uppercase · .06em', 'LĨNH VỰC HOẠT ĐỘNG')]
    rows = ''.join(f'<div class="spec"><div>{n}<br><span style="font-weight: 400">{m}</span></div><div style="font-size: {s}; font-weight: {w}; line-height: 1.15; letter-spacing: -0.01em">{x}</div></div>' for n, s, w, m, x in typ)
    sp = ''.join(f'<span style="display: inline-flex; flex-direction: column; gap: 6px; font-size: 12px; color: var(--mute)"><i style="display: block; width: {v}px; height: {v}px; background: var(--brand-100); border: 1px solid var(--brand-300)"></i>{v}</span>' for v in [4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80])
    b += sec(head('Typography', 'Inter, *sáu cấp chữ*') + rows)
    b += sec(head('Spacing, radius, breakpoints', 'Thang 4pt và *lưới 13 ô*')
             + f'<div class="spec"><div>space/*</div><div class="row" style="align-items: flex-end">{sp}</div></div>'
             + '<div class="spec"><div>radius/*</div><div class="row"><span class="tag">sm 8</span><span class="tag">md 12</span><span class="tag">lg 16</span><span class="tag">full 999</span></div></div>'
             + '<div class="spec"><div>breakpoints</div><div class="row"><span class="tag tag--line">Desktop ≥1024 · 11 ô nội dung, lề 1 ô</span><span class="tag tag--line">Tablet 768–1023 · 10 ô</span><span class="tag tag--line">Mobile ≤767 · lề 16px, 1 cột</span></div></div>')
    b += sec(head('Components', 'Bộ thành phần *dùng chung*')
             + f'<div class="spec"><div>Button<br><span style="font-weight: 400">primary · secondary · lg<br>cao tối thiểu 44px</span></div><div class="row">{btn("Liên hệ hợp tác", "#", arrow=True)}{btn("Xem lĩnh vực", "#", "secondary")}{btn("Gửi yêu cầu", "#", lg=True, arrow=True)}</div></div>'
             + '<div class="spec"><div>Tag · Chip · Pill</div><div class="row"><span class="tag">Khối 01</span><span class="tag tag--line">Chờ xác nhận</span><button type="button" class="chip" aria-pressed="true">Đang chọn</button><button type="button" class="chip" aria-pressed="false">Mặc định</button><span class="pill"><b>MGST</b>Pill giới thiệu</span></div></div>'
             + '<div class="spec"><div>Card<br><span style="font-weight: 400">default · tint · brand<br>icon, num, list, more</span></div><div style="padding: 0">' + grid([card('Card mặc định', 'Ô trong lưới kẻ, có icon và mô tả.', icon='shield', href='#', more='Xem chi tiết'), card('Card tint', 'Nền brand/50 để nhấn nhóm.', icon='heart', cls='card--tint', num='01'), card('Card brand', 'Một ô nhấn mỗi nhóm.', cls='card--brand', num='Phương châm')], 3).replace('class="grid', 'style="border-top: 0" class="grid') + '</div></div>'
             + '<div class="spec"><div>Stat</div><div style="padding: 0">' + stats([('~300', 'nhân sự'), ('10+', 'phòng kinh doanh'), ('100%', 'tỷ lệ chi trả')], 3).replace('class="grid', 'style="border-top: 0" class="grid') + '</div></div>'
             + '<div class="spec"><div>Feature row<br><span style="font-weight: 400">ô tiêu đề 3 ô lưới + lưới card</span></div><div style="padding: 0">' + feat('1.1', 'Tiêu đề nhóm', 'Mô tả ngắn của nhóm.', [card('Card', 'Mô tả.', icon='users'), card('Card', 'Mô tả.', icon='check')], cols=2).replace('class="feat"', 'class="feat" style="border-top: 0"') + '</div></div>'
             + '<div class="spec"><div>Steps</div><div style="padding: 0">' + steps([('Bước một', 'Mô tả.'), ('Bước hai', 'Mô tả.'), ('Bước ba', 'Mô tả.')]).replace('class="grid', 'style="border-top: 0" class="grid') + '</div></div>'
             + '<div class="spec"><div>Form field</div><div><div class="form"><label class="field"><span>Họ và tên <i aria-hidden="true">*</i></span><input type="text" placeholder="Mặc định"></label><label class="field">Số điện thoại<input type="tel" aria-invalid="true" value="0912"><span class="err">Vui lòng nhập số điện thoại 10 số.</span></label></div></div></div>'
             + '<div class="spec"><div>FAQ</div><div style="padding: 0">' + faq([('Câu hỏi mẫu?', 'Câu trả lời mẫu.')]).replace('class="faq-list"', 'class="faq-list" style="border-top: 0"') + '</div></div>')
    b += sec(head('Section', 'Ba biến thể nền: *default, tint, dark*', 'Thành phần bên trong tự đổi màu theo biến ngữ nghĩa (--bg, --tx, --mute, --line, --accent), không cần viết lại.')
             + grid([card('Trên nền tối', 'Card, tag, nút và đường kẻ tự đổi theo section.', icon='eye', tag='sec--dk'), card('Tương phản', 'Chữ thường 4.5:1 trở lên, kể cả chú thích 12px.', icon='check'), card('Vùng chạm', 'Nút, chip, mục menu cao từ 44px.', icon='hand')], 3), 'sec--dk')
    page('System', 'Design system', '', b)

os.makedirs(OUT, exist_ok=True)
home(); about(); organization(); services(); projects(); news(); contact(); system()
LANG = 'en'; home()
print('ok')
