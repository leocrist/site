# Update the live Home page content to the brochure facts, keeping its layout.
# usage: python3 home_update.py <live Main.dc.html> <out Main.dc.html> <site_gen.py> <tmp dir>
import sys, re
MAIN, OUTF, GEN, TMP = sys.argv[1:5]
ns = {}
sys.argv = [GEN, MAIN, TMP]
exec(open(GEN, encoding='utf8').read(), ns)
frow, B, CR, HOT, HOT_T, ADDR = ns['frow'], ns['B'], ns['CR'], ns['HOT'], ns['HOT_T'], ns['ADDR']

s = open(MAIN, encoding='utf8').read()
def rep(a, b, count=1):
    global s
    assert a in s, a[:80]
    s = s.replace(a, b) if count == 0 else s.replace(a, b, count)

# hero
rep('<a href="Services.dc.html" class="pill rise" aria-label="Mảng mới: Lao động Châu Âu và Trường lái xe. Xem chi tiết"><span class="nb">Mảng mới</span>Lao động Châu Âu và Trường lái xe ',
    '<a href="About.dc.html" class="pill rise" aria-label="Hồ sơ năng lực 2026. Xem giới thiệu"><span class="nb">2026</span>Hệ sinh thái giải pháp đa lĩnh vực ')
rep('Chuyển đổi số, tài chính và bảo hiểm cho người dân miền Tây, cùng đào tạo nghề và cơ hội việc làm tại Châu Âu. Một đầu mối, có mặt tận phường xã.',
    'Chuyển đổi số, tài chính – ngân hàng, bảo hiểm và an sinh xã hội cho người dân miền Tây. Hơn 300 nhân sự có mặt tận phường xã.')
# hero strip: replace the driving-school and airport photos
for old, new in [('072335b34db791b58d3628311142cbd4', 'h'), ('0225b5a651d3d16f70bcbfb49b2f9067', 'k')]:
    alt_old = {'072335b34db791b58d3628311142cbd4': 'Xe tập lái gắn biển L đỗ trong bãi', '0225b5a651d3d16f70bcbfb49b2f9067': 'Sảnh nhà ga sân bay quốc tế Frankfurt'}[old]
    cr_old = {'072335b34db791b58d3628311142cbd4': 'Ảnh: TudorTulok · CC0', '0225b5a651d3d16f70bcbfb49b2f9067': 'Ảnh: uggboy · CC BY 2.0'}[old]
    s = s.replace(f'/_blob/{old}" alt="{alt_old}"', f'{B[new]}" alt="{CR[new][0]}"').replace(f'/_blob/{old}" alt=""', f'{B[new]}" alt=""')
    s = s.replace(cr_old, CR[new][1])
assert '072335b34' not in s.split('<section class="vband"')[0] and '0225b5a6' not in s.split('<section class="vband"')[0]

# stats
rep('Mỗi ngày, mạng lưới của chúng tôi đưa dịch vụ số đến <span style="color: #ca4d25; font-weight: 600">1.000+ người dân</span> miền Tây.',
    'Mỗi ngày, đội ngũ của chúng tôi tiếp cận và hỗ trợ trực tiếp <span style="color: #ca4d25; font-weight: 600">2.000+ người dân</span> miền Tây.')
rep('<dt style="font-size: 15px; color: #5c5c5c; margin-top: 8px">điểm bán khắp các tỉnh</dt><dd style="font-size: 56px; line-height: 1; font-weight: 600; letter-spacing:-0.02em; color: #ca4d25; font-variant-numeric: tabular-nums">1.000+</dd>',
    '<dt style="font-size: 15px; color: #5c5c5c; margin-top: 8px">nhân sự trẻ tại các tỉnh</dt><dd style="font-size: 56px; line-height: 1; font-weight: 600; letter-spacing:-0.02em; color: #ca4d25; font-variant-numeric: tabular-nums">300+</dd>')
rep('<dt style="font-size: 15px; color: #5c5c5c; margin-top: 8px">nhân sự tư vấn lưu động</dt><dd style="font-size: 56px; line-height: 1; font-weight: 600; letter-spacing:-0.02em; color: #ca4d25; font-variant-numeric: tabular-nums">200+</dd>',
    '<dt style="font-size: 15px; color: #5c5c5c; margin-top: 8px">ngân hàng đối tác</dt><dd style="font-size: 56px; line-height: 1; font-weight: 600; letter-spacing:-0.02em; color: #ca4d25; font-variant-numeric: tabular-nums">12+</dd>')
rep('<dt style="font-size: 15px; color: #5c5c5c; margin-top: 8px">mảng dịch vụ, một đầu mối</dt><dd style="font-size: 56px; line-height: 1; font-weight: 600; letter-spacing:-0.02em; color: #ca4d25; font-variant-numeric: tabular-nums">4</dd>',
    '<dt style="font-size: 15px; color: #5c5c5c; margin-top: 8px">PKD địa bàn và PKD Y</dt><dd style="font-size: 56px; line-height: 1; font-weight: 600; letter-spacing:-0.02em; color: #ca4d25; font-variant-numeric: tabular-nums">11+1</dd>')
rep('Số liệu theo hồ sơ năng lực công ty, cập nhật [tháng/năm].', 'Số liệu theo hồ sơ năng lực Minh Group ST, 2026.')

# four focus fields
rep('<h2 class="h2" style="text-wrap: balance">Một đầu mối, <span>bốn nhu cầu lớn của một gia đình</span></h2>',
    '<h2 class="h2" style="text-wrap: balance">Một hệ sinh thái, <span>bốn lĩnh vực mũi nhọn</span></h2>')
rep('<p class="lead">Từ chiếc điện thoại cài VNeID đầu tiên, tấm bảo hiểm xe, tấm bằng lái đến tấm visa sang Châu Âu.</p>',
    '<p class="lead">Từ định danh VNeID, tài khoản ngân hàng, tấm bảo hiểm đến khoản chi trả an sinh đến tận tay người dân.</p>')
i = s.index('<div class="frow">'); j = s.index('</section>', i)
end = s.rindex('</div>', i, j)  # closes .box
F = '\n'.join([
 frow('b', 'Chuyển đổi số &amp; Y tế số', 'Cầu nối đưa ứng dụng số vào đời sống người dân và chính quyền.', [
   ('id', 'VNeID và eTax Mobile', 'Kích hoạt định danh, cài đặt thuế số cho người dân, hộ kinh doanh.'),
   ('qr', 'Thanh toán không tiền mặt', 'Mở tài khoản, tạo mã QR tại chợ, tuyến đường văn minh.'),
   ('hos', 'Số hóa kênh y tế', 'PKD Y cùng bệnh viện, trạm y tế: hồ sơ sức khỏe điện tử, viện phí số.'),
   ('users', '2.000+ lượt mỗi ngày', 'Người dân được nhân sự tiếp cận và hỗ trợ trực tiếp.')], 'Services.dc.html#cds'),
 frow('f', 'Tài chính – Ngân hàng', 'Đối tác chiến lược của hơn 12 ngân hàng thương mại.', [
   ('card', 'Mở rộng mạng lưới khách hàng', 'Tài khoản, thẻ, tín dụng đến cả đô thị và nông thôn.'),
   ('scan', 'Tài khoản số, sinh trắc học', 'Ra quân cùng ngân hàng tại địa phương.'),
   ('scale', 'Tư vấn giải pháp tài chính', 'Chọn giải pháp vốn phù hợp năng lực thực tế.'),
   ('book', 'Cẩm nang dịch vụ số', 'Hướng dẫn từng bước, đọc trong 3 phút.')], 'Services.dc.html#tc'),
 frow('a', 'Bảo hiểm &amp; An sinh', 'Đại lý tổ chức của PVI, PTI, TASCO.', [
   ('car', 'Xe cơ giới, trách nhiệm dân sự', 'Bảo hiểm bắt buộc và tự nguyện cho xe máy, ô tô.'),
   ('home', 'Tài sản, tai nạn', 'Cho hộ gia đình, hộ kinh doanh, doanh nghiệp.'),
   ('shield', 'BHXH tự nguyện', 'Cùng chính quyền tuyên truyền, vận động người dân.'),
   ('heart', 'BHYT hộ gia đình', 'Bảo vệ tài chính gia đình trước rủi ro.')], 'Services.dc.html#bh'),
 frow('k', 'Chi trả BTXH &amp; Dự án', 'Trao giá trị – gửi trọn trách nhiệm.', [
   ('gift', 'Chi trả lương hưu, trợ cấp', 'Đúng đối tượng, đúng số tiền, đúng thời gian.'),
   ('medal', 'Người có công', 'Phục vụ chu đáo người lớn tuổi, gia đình chính sách.'),
   ('search', 'Nghiên cứu thị trường', 'Phòng Dự án khảo sát nhu cầu, tiềm năng vùng.'),
   ('link', 'Kết nối nguồn lực', 'Gọi vốn, hợp tác công – tư (PPP).')], 'Services.dc.html#ct'),
])
s = s[:i] + F + '\n' + s[end:]

# capability block
rep('Phối hợp cùng chính quyền địa phương trong đề án chuyển đổi số cộng đồng. 200+ nhân sự lưu động làm việc song song với kênh CSKH online.',
    'Hơn 300 nhân sự trẻ có mặt tại trạm y tế, bệnh viện, cơ quan hành chính và từng hộ gia đình, qua 11 phòng kinh doanh địa bàn.')
# news tags + third image
rep('[dd/mm/yyyy] · Ký kết', '[dd/mm/yyyy] · Ngân hàng')
rep('[dd/mm/yyyy] · Hợp tác', '[dd/mm/yyyy] · An sinh')
# FAQ
rep('Mua bảo hiểm qua Minh Group có khác mua trực tiếp từ PVI, PTI không?', 'Mua bảo hiểm qua Minh Group có khác mua trực tiếp từ PVI, PTI, TASCO không?')
rep('Hợp đồng do chính PVI, PTI phát hành', 'Hợp đồng do chính PVI, PTI, TASCO phát hành')
s = re.sub(r'<details class="faq"><summary>Chương trình lao động Châu Âu có thu phí trước không\?.*?</details>',
  '<details class="faq"><summary>Chi trả lương hưu, trợ cấp qua Minh Group được thực hiện thế nào?<svg class="faq-plus" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14M12 5v14"></path></svg></summary><p>Phòng Chi trả Bảo trợ xã hội thực hiện chi trả lương hưu, trợ cấp bảo trợ xã hội và chế độ người có công theo đúng danh sách được phê duyệt: đúng đối tượng, đúng số tiền, đúng thời gian, với quy trình kiểm soát tài chính nghiêm ngặt.</p></details>', s, count=1, flags=re.S)
s = re.sub(r'<details class="faq"><summary>Trường lái xe đào tạo những hạng bằng nào\?.*?</details>',
  '<details class="faq"><summary>Minh Group hỗ trợ bệnh viện, trạm y tế những gì?<svg class="faq-plus" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14M12 5v14"></path></svg></summary><p>PKD Y đồng hành cùng Sở Y tế, bệnh viện đa khoa, trung tâm y tế huyện và trạm y tế xã/phường: số hóa hồ sơ sức khỏe điện tử, triển khai viện phí không tiền mặt và tối ưu quy trình tiếp đón bệnh nhân qua nền tảng số.</p></details>', s, count=1, flags=re.S)
s = re.sub(r'<details class="faq"><summary>Tôi muốn làm đại lý, điểm bán thì cần điều kiện gì\?.*?</details>',
  '<details class="faq"><summary>Ngân hàng, doanh nghiệp muốn triển khai chương trình tại địa phương thì làm thế nào?<svg class="faq-plus" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14M12 5v14"></path></svg></summary><p>Liên hệ hotline hoặc gửi yêu cầu ở cuối trang. Ngân hàng làm việc với Phòng Kinh doanh Tổng hợp; dự án mới và hợp tác công – tư làm việc với Phòng Dự án. Đội ngũ 11 phòng kinh doanh địa bàn sẽ triển khai trực tiếp tại cơ sở.</p></details>', s, count=1, flags=re.S)
assert 'Châu Âu có thu phí' not in s and 'Trường lái xe đào tạo' not in s and 'làm đại lý, điểm bán' not in s

# form + chat chips
rep('<label>Dịch vụ quan tâm<select><option>Chuyển đổi số, tài chính</option><option>Bảo hiểm phi nhân thọ</option><option>Lao động Châu Âu</option><option>Đào tạo lái xe</option><option>Hợp tác đại lý</option></select></label>',
    '<label>Lĩnh vực quan tâm<select><option>Chuyển đổi số, y tế số</option><option>Tài chính – ngân hàng</option><option>Bảo hiểm</option><option>An sinh (BHXH, BHYT)</option><option>Chi trả bảo trợ xã hội</option><option>Hợp tác dự án</option></select></label>')
rep("{ label: 'Lao động Châu Âu', ph: 'Ví dụ: Tôi 25 tuổi, muốn sang Đức làm điều dưỡng' },", "{ label: 'BHXH, BHYT', ph: 'Ví dụ: Tôi muốn tham gia BHYT hộ gia đình cho 4 người' },")
rep("{ label: 'Học lái xe', ph: 'Ví dụ: Học bằng B số tự động, lịch buổi tối' },", "{ label: 'Chi trả trợ cấp', ph: 'Ví dụ: Hỏi lịch nhận lương hưu tháng này tại xã' },")
rep("{ label: 'Làm đại lý', ph: 'Ví dụ: Tôi có cửa hàng ở Vĩnh Long, muốn làm điểm bán' }", "{ label: 'Hợp tác triển khai', ph: 'Ví dụ: Ngân hàng cần đội ngũ mở tài khoản số tại 5 xã' }")

# footer + contact facts
rep('[Địa chỉ trụ sở], TP. Cần Thơ', ADDR)
rep('<a href="Services.dc.html">Chuyển đổi số</a><a href="Services.dc.html">Bảo hiểm</a><a href="Services.dc.html">Lao động Châu Âu</a><a href="Services.dc.html">Lái xe</a>',
    '<a href="Services.dc.html#cds">Chuyển đổi số &amp; Y tế số</a><a href="Services.dc.html#tc">Tài chính – Ngân hàng</a><a href="Services.dc.html#bh">Bảo hiểm &amp; An sinh</a><a href="Services.dc.html#ct">Chi trả BTXH &amp; Dự án</a>')
rep('<a href="History.dc.html">Lịch sử</a><a href="Organization.dc.html">Cơ cấu tổ chức</a><a href="Leadership.dc.html">Ban lãnh đạo</a></div>',
    '<a href="History.dc.html">Lịch sử &amp; Cột mốc</a><a href="Organization.dc.html">Cơ cấu tổ chức</a><a href="Leadership.dc.html">Ban lãnh đạo</a><a href="Market.dc.html">Năng lực &amp; Vị thế</a></div>')
rep('<span>Nhanh chóng · Tin cậy · Hiệu quả</span>', '<span>Tiên phong số hóa · Hiệu quả bứt phá</span>')
s = s.replace('tel:0939980090', HOT_T).replace('0939 980 090', HOT)
assert '0939' not in s and 'Châu Âu' not in s and 'lái xe' not in s.lower(), [m.start() for m in re.finditer('Châu Âu|lái xe', s)]
open(OUTF, 'w', encoding='utf8').write(s)
print('ok', len(s))
