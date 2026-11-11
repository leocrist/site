"""Create a static VFinal from rendered V8 snapshots (see brochure-vfinal/REVIEW.md)."""
from pathlib import Path
from bs4 import BeautifulSoup
from html import escape
import shutil
import subprocess
import sys

ROOT = Path(__file__).resolve().parent.parent
SNAPSHOTS = Path(sys.argv[1])
OUT = ROOT / 'brochure-vfinal'
OUT.mkdir(exist_ok=True)

TITLES = ['Bìa', 'Tổng quan', 'Năng lực & tổ chức', 'Chuyển đổi số & Tài chính',
          'Bảo hiểm & An sinh', 'Hệ sinh thái', 'Dự án trọng điểm',
          'Lộ trình & Lãnh đạo', 'Trách nhiệm cộng đồng', 'Hợp tác & Liên hệ']

def html(element, markup):
    assert element is not None, markup[:80]
    element.clear()
    element.extend(BeautifulSoup(markup, 'html.parser').contents)

def text(element, value):
    assert element is not None, value
    element.clear()
    element.append(value)

def exact(soup, before, after):
    matches = soup.find_all(string=lambda t: t and str(t).strip() == before)
    assert matches, before
    for match in matches:
        match.replace_with(after)

EXTRA = '''
.final-org{display:grid;grid-template-columns:repeat(4,1fr);height:100%;border-top:.4mm solid #ca4d25}
.final-org>div{padding:2mm 2.5mm;border-right:.2mm solid #dedede;background:#fff}
.final-org b{font:600 7.2pt/1.25 Inter;display:block;min-height:8mm;color:#a93d1b}
.final-org ul{margin:1mm 0 0;padding-left:3mm;font:400 6.8pt/1.4 Inter}
.final-leader{display:flex!important;gap:4mm!important;align-items:center;padding:5mm!important}
.final-leader .monogram{width:17mm;height:17mm;background:#f5f5f5;color:#ca4d25;display:grid;place-items:center;font:700 13pt Inter;flex:none}
.csr-hero{height:48mm;position:relative;margin:6mm 0 0;overflow:hidden}
.csr-hero img{width:100%;height:100%;object-fit:cover;object-position:center 45%}
.csr-hero figcaption{position:absolute;bottom:0;right:0;background:#fff;padding:1.5mm 2mm;font:400 6.5pt Inter;color:#5c5c5c}
.csr-grid{display:grid;grid-template-columns:1fr 1fr;gap:0;border-top:.25mm solid #dedede;border-left:.25mm solid #dedede;margin-top:6mm}
.csr-card{min-height:46mm;padding:5mm;border-right:.25mm solid #dedede;border-bottom:.25mm solid #dedede}
.csr-card .index{font:700 18pt Inter;color:#ca4d25;margin-bottom:3mm}
.csr-card h2{font-size:12pt;line-height:1.3;margin-bottom:2mm}
.csr-card p{font-size:9pt;line-height:1.5;color:#5c5c5c}
.csr-band{margin-top:6mm;padding:5mm;background:#f5f5f5;border-left:1mm solid #ca4d25;font:600 12pt/1.4 Inter}
.final-facts{font-size:8pt;line-height:1.5;color:#5c5c5c}
'''

for n in range(1, 11):
    soup = BeautifulSoup((SNAPSHOTS / f'page-{n:02}.html').read_text(encoding='utf-8'), 'html.parser')
    for script in soup.find_all('script'):
        script.decompose()
    for node in soup.find_all(True):
        for key in list(node.attrs):
            if key.lower().startswith('on'):
                del node[key]
        for key in ['src', 'href']:
            value = node.get(key, '')
            for host in ('http://localhost:5180/', 'http://127.0.0.1:5180/'):
                if value.startswith(host):
                    node[key] = '../' + value[len(host):]
    for item in soup.find_all(string=True):
        if item.parent.name in ('style', 'script'):
            continue
        value = str(item).replace('Corporate Profile 2026', 'Hồ sơ năng lực 2026')
        if value != str(item):
            item.replace_with(value)
    text(soup.title, f'Minh Group ST · VFinal · {TITLES[n-1]}')
    if not soup.select_one('meta[name="viewport"]'):
        soup.head.append(soup.new_tag('meta', attrs={'name': 'viewport', 'content': 'width=device-width,initial-scale=1'}))
    css = soup.new_tag('style')
    css.string = EXTRA
    soup.head.append(css)
    page = soup.select_one('.page,.sheet')
    label = page.select_one('.rh .lbl')
    if label:
        text(label, f'{n:02} / {TITLES[n-1]}')
    pill = page.select_one('.pill')
    if pill and n in (2, 3, 4, 5):
        html(pill, f'<span class="nb">{n:02}</span>{escape(TITLES[n-1])}')

    if n == 1:
        for card, value, caption in zip(page.select('.cover-figures .kf'), ['~300', '10+', '4'],
                                        ['Nhân sự chuyên trách', 'Phòng kinh doanh', 'Khối hoạt động']):
            text(card.select_one('.stat'), value)
            text(card.select_one('.sm'), caption)
        for e, value in zip(page.select('.vband>span'), ['Gần dân', 'Minh bạch', 'Trách nhiệm']):
            text(e, value)
        text(page.select_one('.foot .xs'), 'Tài chính số · Bảo hiểm & An sinh · Dự án & Nhân lực')

    elif n == 2:
        html(page.select_one('h2.h2'), 'Sức mạnh tại chỗ.<br><span>Thấu hiểu địa bàn.</span>')
        text(page.select_one('p.body'), 'Thành lập tháng 03/2025 tại Cần Thơ, Công ty TNHH Minh Group ST đưa dịch vụ tài chính số, bảo hiểm và an sinh đến người dân Đồng bằng sông Cửu Long bằng lực lượng tại chỗ và quy trình quản trị khép kín.')
        for card, title, body in zip(page.select('.fcard'), ['Mô hình hoạt động', 'Giá trị cho đối tác'], [
            'Bảy lĩnh vực kết nối trong bốn khối hoạt động, cùng phục vụ nhu cầu của người dân và hộ kinh doanh.',
            'Mở rộng độ phủ, triển khai linh hoạt, theo sát chất lượng dịch vụ và báo cáo minh bạch.'
        ]):
            text(card.select_one('.lbl'), title)
            text(card.select_one('.h3,.h2'), body)
        philo = page.select_one('#philo')
        philo['style'] = philo['style'].replace('repeat(4,1fr)', 'repeat(3,1fr)')
        cards = philo.find_all('div', recursive=False)
        cards[-1].decompose()
        for card, title, body in zip(cards[:3], ['Gần dân', 'Minh bạch', 'Trách nhiệm'],
            ['Nhân sự bám sát địa bàn, hỗ trợ người dân tại cơ sở.', 'Dữ liệu chuẩn xác, đối soát rõ ràng với đối tác.', 'Gắn hiệu quả kinh doanh với lợi ích cộng đồng.']):
            content = card.find_all('div', recursive=False)[-1]
            html(content, f'<div class="h3" style="font-size:16pt;color:#ca4d25">{title}</div><p class="sm" style="margin-top:3mm;line-height:1.5">{body}</p>')

    elif n == 3:
        html(page.select_one('h2.h2'), 'Bám sát cơ sở.<br><span>Triển khai đến tận nơi.</span>')
        text(page.select_one('p.body'), 'Lực lượng tại chỗ kết nối dịch vụ của đối tác với nhu cầu thực tế tại bệnh viện, cơ quan hành chính và hộ gia đình.')
        for stat, value, caption in zip(page.select('.stat'), ['~300', '10+', '4'],
            ['nhân sự chuyên trách tại địa bàn', 'phòng kinh doanh tại ĐBSCL', 'khối hoạt động bổ trợ nhau']):
            text(stat, value)
            text(stat.parent.select_one('.sm'), caption)
        touch = page.select('#touch>div')
        for card, title, caption in zip(touch, ['Bệnh viện', 'Hành chính công', 'Ấp, khu vực', 'Hộ gia đình'],
            ['Viện phí không tiền mặt', 'Phối hợp triển khai tại cơ sở', 'Tư vấn BHXH, BHYT', 'Hỗ trợ người cao tuổi']):
            content = card.find_all('div', recursive=False)[-1]
            html(content, f'<div class="h3" style="font-size:8.5pt">{title}</div><div class="xs mut" style="margin-top:1mm">{caption}</div>')
        exact(page, 'Sơ đồ mạng lưới', 'Cơ cấu tổ chức')
        exact(page, '11 PKD địa bàn · 1 PKD Y · 5 phòng chức năng', '1 ban lãnh đạo · 4 khối · 12 đơn vị')
        board = next(e for e in page.select('.g') if e.get_text(' ', strip=True).lower() == 'ban giám đốc')
        text(board.select_one('span'), 'Ban lãnh đạo')
        page.select_one('#func').decompose()
        chart = page.select_one('#pkd')
        chart['style'] = '--c:1;--r:15;--w:12;--h:2;display:block'
        groups = [
            ('Chuyển đổi số & Tài chính', ['PKD Lưu động', 'PKD kênh Y tế', 'PKD Tổng hợp']),
            ('Bảo hiểm & An sinh', ['Phòng An sinh', 'Phòng Chi trả', 'Bảo hiểm học sinh']),
            ('Quản lý vận hành & Nội bộ', ['Nhân sự', 'Kế toán', 'Hậu cần & Kỹ thuật']),
            ('Dự án & Cung ứng nhân lực', ['Đào tạo lái xe', 'Máy bán hàng tự động', 'Cung ứng nhân lực']),
        ]
        html(chart, '<div class="final-org">' + ''.join(f'<div><b>{escape(title)}</b><ul>' + ''.join(f'<li>{escape(t)}</li>' for t in units) + '</ul></div>' for title, units in groups) + '</div>')

    elif n == 4:
        for e, title, desc in zip(page.select('#a-list .h3'),
            ['Mở tài khoản & thẻ', 'Hướng dẫn sử dụng', 'Thanh toán bằng mã QR'],
            ['Kết nối người dân với ngân hàng đối tác', 'Cài ứng dụng, hỗ trợ giao dịch số', 'Phổ cập thanh toán không tiền mặt']):
            text(e, title)
            text(e.parent.select_one('.xs'), desc)
        metrics = page.select('.stat')
        text(metrics[0], '10+')
        text(metrics[0].parent.select_one('.sm'), 'phòng kinh doanh trực tiếp triển khai tại địa bàn')
        text(metrics[1], '40.000')
        metrics[1]['style'] += ';font-size:29pt'
        text(metrics[1].parent.select_one('.sm'), 'tài khoản/tháng — sản lượng cao nhất từng đạt')
        banks = page.select_one('#banks')
        banks['style'] = 'margin-top:3mm;font-size:7.5pt;line-height:1.5;color:#5c5c5c'
        text(banks, 'Theo sát chất lượng sau khi mở tài khoản; hỗ trợ duy trì số dư và giao dịch theo chương trình hợp tác.')
        for row, title, desc in zip(page.select('#b-list .h3'),
            ['Mở rộng độ phủ', 'Quản trị chất lượng', 'Đối soát minh bạch'],
            ['Tiếp cận người dân và hộ kinh doanh', 'Theo sát trải nghiệm sau khi mở tài khoản', 'Báo cáo kết quả xuyên suốt cho đối tác']):
            text(row, title)
            text(row.parent.select_one('.xs'), desc)
        for row, value in zip(page.select('#h-list .h3'), ['Nhân sự thường trực', 'Mở tài khoản ngân hàng', 'Viện phí không tiền mặt']):
            text(row, value)
        text(page.select_one('#h-list .xs'), 'Hướng dẫn người dân tại bệnh viện')
        quote = next(e for e in page.select('.h3') if 'Thị trường được làm nên' in e.get_text())
        text(quote, 'Tiếp nhận chính sách → Đào tạo → Điều phối địa bàn → Kiểm soát chất lượng → Đối soát.')
        quote['style'] = 'font-size:12pt;line-height:1.5;font-weight:600'
        text(quote.parent.select_one('.xs'), 'Quy trình triển khai khép kín')

    elif n == 5:
        tasco = page.find(string=lambda t: t and t.strip() == 'TASCO')
        logos = tasco.parent.parent
        logos.clear()
        logos['style'] = '--c:1;--r:8;--w:6;--h:1;display:flex;align-items:center;padding:0 3mm;background:#f5f5f5'
        html(logos, '<span style="font-size:10pt;font-weight:600;color:#a93d1b">Đại lý tổ chức · PVI</span>')
        exact(page, 'Thụ hưởng chương trình mục tiêu', 'Hỗ trợ tận nhà khi cần') if page.find(string='Thụ hưởng chương trình mục tiêu') else None
        audience = next(e for e in page.select('.xs') if 'Thụ hưởng chương trình mục tiêu' in e.get_text())
        text(audience, 'Người hưởng lương hưu · Người nhận trợ cấp bảo trợ xã hội · Người có công với cách mạng')
        bottom = page.select('.g.fill')[-1]
        cols = bottom.find_all('div', recursive=False)
        text(cols[0].select_one('.lbl'), 'Mạng lưới an sinh')
        html(cols[0].select_one('p'), '<span style="font-size:24pt;color:#ca4d25">25+ xã, phường</span><br><span style="font-size:9pt">BHXH tự nguyện · BHYT hộ gia đình<br>Bảo hiểm học sinh</span>')
        text(cols[1].select_one('.lbl'), 'Chi trả bảo trợ xã hội')
        html(cols[1].select_one('p'), '<span style="font-size:24pt;font-weight:600;color:#ca4d25">6 xã, phường</span><br>Tỷ lệ chi trả 100% trong phạm vi triển khai.<br>Đúng đối tượng · Đúng số tiền · Kịp thời · Minh bạch.')
        cols[1].select_one('p')['style'] = 'margin-top:3mm;font-size:8.5pt;line-height:1.5'

    elif n == 6:
        html(page.select_one('h1'), 'Bốn khối hoạt động.<br><span>Bảy lĩnh vực kết nối.</span>')
        page.select_one('h1')['style'] += ';font-size:25pt'
        network = page.select_one('#hepta')
        network['aria-label'] = 'Bốn khối hoạt động và bảy lĩnh vực trong hệ sinh thái Minh Group ST'
        inner = network.find('svg')
        pairs = [('Chuyển đổi số & Tài chính', 'Ngân hàng · Dịch vụ số'), ('Bảo hiểm & An sinh', 'BHXH · BHYT · Chi trả'),
                 ('Quản lý vận hành', 'Nhân sự · Kế toán · Hậu cần'), ('Dự án & Nhân lực', 'Lái xe · Máy bán hàng · Việc làm')]
        labels = inner.find_all('text', recursive=False)
        for i, (title, desc) in enumerate(pairs):
            text(labels[i*3+1], title)
            labels[i*3+1]['font-size'] = '3.4'
            text(labels[i*3+2], desc)
        for i, card in enumerate(page.select('.benefit')):
            heading = card.select_one('.h3')
            body = card.select_one('p')
            value = card.find_all('div', recursive=False)[-1]
            if i == 0:
                text(heading, 'Nguồn lực tại chỗ')
                text(body, 'Khoảng 300 nhân sự, hơn 10 phòng kinh doanh tại ĐBSCL.')
                text(value, '~300')
            elif i == 1:
                text(heading, 'Bảy lĩnh vực bổ trợ')
                text(body, 'Số hóa · Tài chính · Bảo hiểm · An sinh · Lái xe · Máy bán hàng · Việc làm.')
                text(value, '7 lĩnh vực')
                value['style'] += ';font-size:11pt'
            else:
                text(heading, 'Vận hành minh bạch')
                text(body, 'KPI rõ ràng; kiểm soát ngân sách, dòng tiền và rủi ro.')
                html(value, 'Quản trị<br>+ Thực thi')

    elif n == 7:
        html(page.select_one('h1'), 'Ba dự án.<br><span>Mở rộng hệ sinh thái.</span>')
        page.select_one('h1')['style'] += ';font-size:29pt'
        text(page.select_one('strong'), 'Kết nối nguồn lực')
        intro = page.select_one('strong').parent.find('p')
        html(intro, 'Phòng Quản lý Dự án chủ trì.<br>Tận dụng mạng lưới và điểm chạm sẵn có.')
        grid = page.select_one('.grid')
        grid['style'] = 'margin-top:7mm;grid-template-rows:repeat(3,35mm);border:0;gap:2mm'
        rows = grid.find_all('div', recursive=False)
        for row in rows[3:]:
            row.decompose()
        projects = [
            ('Máy bán hàng tự động', 'Đưa hàng thiết yếu và thanh toán QR về xã, phường; kết hợp hướng dẫn mở tài khoản, thẻ. Kết nối VPBank, Toro và VNPAY; đánh giá thí điểm trước khi mở rộng.'),
            ('Đào tạo lái xe', 'Tư vấn, tiếp nhận hồ sơ và kết nối cơ sở đào tạo đủ điều kiện. Nghiên cứu đầu tư cơ sở đào tạo, sân sát hạch tại khu vực Sóc Trăng.'),
            ('Cung ứng nhân lực & Tư vấn XKLĐ', 'Tuyển chọn, đào tạo nghề và ngoại ngữ; kết nối việc làm tại Châu Âu, Đông Á. Minh bạch chi phí, lộ trình và hỗ trợ người lao động suốt hợp đồng.'),
        ]
        for row, (title, body) in zip(rows[:3], projects):
            text(row.select_one('h2'), title)
            row.select_one('h2')['style'] = 'font-size:11.5pt;line-height:1.3'
            text(row.select_one('p'), body)
            row.select_one('p')['style'] = 'margin-top:2mm;font-size:8.3pt;line-height:1.5'
        note = page.find('p', class_='meta', recursive=False)
        text(note, 'Đào tạo, sát hạch và đưa người lao động đi làm việc ở nước ngoài phải đáp ứng điều kiện của từng chương trình và đơn vị có thẩm quyền.')
        note['style'] += ';font-size:7.5pt'
        for card, title, body in zip(page.select('.grid')[-1].find_all('div', recursive=False),
            ['Tham mưu & triển khai', 'Kiểm tra & giám sát', 'Đánh giá & báo cáo'],
            ['Xây dựng lộ trình, cơ chế phối hợp và phương án nhân sự.', 'Rà soát quy trình, nhận diện rủi ro và giữ kỷ luật vận hành.', 'Tổng hợp số liệu, phân tích hiệu quả và đề xuất cải tiến.']):
            text(card.select_one('h2'), title)
            text(card.select_one('p'), body)

    elif n == 8:
        text(page.select_one('p.body'), 'Thành lập tháng 03/2025; từng bước phát triển mạng lưới kinh doanh và các phòng chức năng.')
        exact(page, 'Danh bạ điều hành', 'Ban lãnh đạo')
        exact(page, 'Liên hệ trực tiếp theo khối phụ trách', 'Kết nối qua hotline công ty')
        for card, monogram in zip(page.select('#leaders>div'), ['ĐHM', 'ĐHC', 'LHH', 'NTHH', 'PHL', 'DMT']):
            title = card.select_one('.h3').get_text(strip=True)
            role = card.select_one('.sm').get_text(strip=True)
            card['class'] = ['final-leader']
            html(card, f'<span class="monogram" aria-hidden="true">{monogram}</span><div><div class="h3" style="font-size:11pt;line-height:1.4">{title}</div><div class="sm or" style="font-weight:600;margin-top:2mm">{role}</div></div>')
        note = next(e for e in page.select('.gx') if 'Ảnh chân dung: chờ ảnh chính thức' in e.get_text())
        html(note, 'Liên hệ hợp tác: <a href="tel:0977726700" style="color:#a93d1b">0977 726 700</a> · minhgroupst@mgst.com.vn')
        note['style'] += ';font-size:8pt'

    elif n == 9:
        footer = str(page.select_one('footer'))
        cards = [
            ('Thắp sáng đường quê', 'Tài trợ công trình chiếu sáng, nâng cao an toàn giao thông và diện mạo nông thôn mới.'),
            ('Quà tặng an sinh', 'Trao thẻ bảo hiểm, quà tặng và kinh phí hỗ trợ gia đình có hoàn cảnh khó khăn.'),
            ('Phổ cập kỹ năng số', 'Hướng dẫn dùng ngân hàng điện tử, nhận trợ cấp và thanh toán trực tuyến an toàn.'),
            ('Số hóa hộ kinh doanh', 'Hỗ trợ trang bị mã QR thanh toán và tiếp cận các tiện ích tài chính hiện đại.'),
        ]
        html(page, '<header class="top"><img src="../assets/logo/mgst-logo.svg" alt="Minh Group ST"><span class="eyebrow">09 / Trách nhiệm cộng đồng</span></header>'
             '<h1 style="font-size:30pt;margin:8mm 0 3mm">Gần dân.<br><span>Đồng hành cùng cộng đồng.</span></h1>'
             '<p style="font-size:10pt">Gắn hiệu quả kinh doanh với lợi ích thiết thực cho địa phương và người dân.</p>'
             '<figure class="csr-hero"><img src="../assets/photos/mg-k.jpg" alt="Cầu Cần Thơ bắc qua sông Hậu"><figcaption>Ảnh minh họa địa bàn · Christophe95 · CC BY-SA 4.0</figcaption></figure>'
             '<div class="csr-grid">' + ''.join(f'<article class="csr-card"><div class="index">0{i}</div><h2>{title}</h2><p>{body}</p></article>' for i, (title, body) in enumerate(cards, 1)) + '</div>'
             '<div class="csr-band">Gần dân trong triển khai.<br>Trách nhiệm với cộng đồng.</div>' + footer)

    elif n == 10:
        html(page.select_one('h1'), 'Cùng đối tác.<br><span>Triển khai hiệu quả tại địa bàn.</span>')
        for card, title, body in zip(page.select('.card'),
            ['Ngân hàng & Tài chính', 'Bảo hiểm & An sinh', 'Dự án & Nhân lực'],
            ['Mở rộng độ phủ, triển khai tại cơ sở và theo sát chất lượng giao dịch.',
             'Phối hợp tư vấn bảo hiểm, phát triển BHXH, BHYT và chi trả tại cơ sở.',
             'Kết nối nguồn lực để triển khai dự án, đào tạo và phát triển việc làm.']):
            text(card.select_one('.h3'), title)
            text(card.select_one('p'), body)
        credits = next(e for e in page.select('.gx.xs') if 'Ảnh minh họa' in e.get_text())
        text(credits, 'Hồ sơ năng lực 2026. Ảnh địa bàn: Wikimedia Commons, tác giả và giấy phép ghi tại từng ảnh. Ảnh AI ở trang 03 dùng để minh họa, không phải tư liệu hoạt động của doanh nghiệp.')
        credits['style'] = '--c:1;--s:12;top:274mm;color:#5c5c5c;font-size:6.5pt;line-height:1.5'
        for e in page.find_all(string=True):
            if 'TP Cần Thơ' in e:
                e.replace_with(str(e).replace('TP Cần Thơ', 'TP. Cần Thơ'))

    (OUT / f'page-{n:02}.html').write_text(str(soup), encoding='utf-8')

shutil.copytree(ROOT / 'brochure-v8/assets', OUT / 'assets', dirs_exist_ok=True)
if (ROOT / 'assets/photo_mgst').is_dir():
    subprocess.run([sys.executable, str(ROOT / 'tools/apply_mgst_photos.py')], check=True)
print(f'Created 10 VFinal pages: {OUT}')
