from pathlib import Path
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.utils import ImageReader
from PIL import Image, ImageOps
from io import BytesIO

ROOT = Path(__file__).resolve().parents[1]
OUT = Path(__file__).resolve().parent / 'so-do-phan-bo-brochure-minh-group-st.pdf'
F = ROOT / 'brochure-v5' / 'fonts'
pdfmetrics.registerFont(TTFont('Inter', str(F / 'Inter-Regular.ttf')))
pdfmetrics.registerFont(TTFont('InterBold', str(F / 'Inter-Bold.ttf')))
W, H = 1190, 842
c = canvas.Canvas(str(OUT), pagesize=(W, H))
c.setTitle('Minh Group ST | So do phan bo Brochure VBi | Giai doan 1')
ORANGE, INK, MUTED, LINE = '#C94D27', '#22201E', '#716B66', '#DFDAD5'
PHOTOS = ROOT / 'brochure-vfinal' / 'assets' / 'photos'

def photo(path, x, y, w, h):
    with Image.open(path) as source:
        image = ImageOps.fit(source.convert('RGB'), (int(w*2), int(h*2)), method=Image.Resampling.LANCZOS, centering=(.5, 0 if path.name == 'dinh-hoang-cong.jpg' else .5))
        data = BytesIO()
        image.save(data, 'JPEG', quality=88)
        data.seek(0)
        c.drawImage(ImageReader(data), x, y, w, h)

def txt(x, y, value, size=10, bold=False, color=INK):
    c.setFillColor(color)
    c.setFont('InterBold' if bold else 'Inter', size)
    c.drawString(x, y, value)

def card(x, y, n, title, role, content, asset, image):
    w, h = 207, 219
    c.setFillColor('#FAF8F6')
    c.roundRect(x, y, w, h, 10, stroke=0, fill=1)
    c.setStrokeColor(LINE)
    c.setLineWidth(.8)
    c.roundRect(x, y, w, h, 10, stroke=1, fill=0)
    c.setFillColor(ORANGE)
    c.roundRect(x+13, y+h-45, 38, 29, 5, stroke=0, fill=1)
    txt(x+21, y+h-36, n, 13, True, '#FFFFFF')
    txt(x+61, y+h-29, title[0], 11, True)
    if len(title)>1: txt(x+61, y+h-43, title[1], 11, True)
    txt(x+15, y+h-75, role, 9, True, ORANGE)
    c.setStrokeColor(LINE)
    c.line(x+15, y+h-86, x+w-15, y+h-86)
    for i, line in enumerate(content): txt(x+15, y+h-107-i*17, line, 9, color=INK)
    photo(PHOTOS/image, x+12, y+11, w-24, 61)

c.setFillColor('#FFFFFF')
c.rect(0, 0, W, H, stroke=0, fill=1)
c.setFillColor(ORANGE)
c.rect(0, H-7, W, 7, stroke=0, fill=1)
txt(48, 783, 'MINH GROUP ST  /  GIAI ĐOẠN 1', 10, True, ORANGE)
txt(48, 735, 'Phân bổ nội dung brochure', 31, True)
txt(48, 709, 'Profile Company VBi · 10 trang · nội dung song ngữ VI/EN', 11, color=MUTED)
txt(1000, 783, '02  /  BROCHURE', 10, True, ORANGE)

data = [
 ('01',['Bìa'], 'NHẬN DIỆN', ['Logo · tên công ty', 'Thông điệp thương hiệu', 'Chỉ số nổi bật'], ['Ảnh hoạt động'],'digital-launch.jpg'),
 ('02',['Tổng quan'], 'TẠO BỐI CẢNH', ['Công ty · mô hình', 'Giá trị cho đối tác'], ['Ảnh thực tế'],'partner-meeting.jpg'),
 ('03',['Năng lực &','Tổ chức'], 'CHỨNG MINH NĂNG LỰC', ['Quy mô · điểm chạm', '4 khối · 12 đơn vị'], ['Ảnh hiện trường', 'Sơ đồ tổ chức'],'digital-team.jpg'),
 ('04',['Công nghệ &','Tài chính'], 'DỊCH VỤ 01', ['Dịch vụ số · ngân hàng', 'Quy trình triển khai'], ['Ảnh hoạt động', 'Họp đối tác'],'field-consultation.jpg'),
 ('05',['Bảo hiểm &','An sinh'], 'DỊCH VỤ 02', ['BHXH · BHYT · bảo hiểm', 'Chi trả bảo trợ'], ['Ảnh tư vấn', 'Ảnh chi trả'],'social-security.jpg'),
 ('06',['Hệ sinh thái'], 'KẾT NỐI NĂNG LỰC', ['4 khối · 7 lĩnh vực', 'Lợi thế cạnh tranh'], ['Sơ đồ hệ sinh thái'],'payment-support.jpg'),
 ('07',['Dự án','trọng điểm'], 'MỞ RỘNG', ['Máy bán hàng · lái xe', 'Cung ứng nhân lực'], ['Nội dung dự án'],'partner-meeting.jpg'),
 ('08',['Lộ trình &','Lãnh đạo'], 'CON NGƯỜI', ['Mốc 2025–2026', 'Ban lãnh đạo'], ['Chân dung thật'],'dinh-hoang-cong.jpg'),
 ('09',['Thành tựu &','Cộng đồng'], 'BẰNG CHỨNG', ['Hoạt động cộng đồng', 'Thư cảm ơn'], ['Ảnh thật · thư gốc'],'community-lighting.jpg'),
 ('10',['Hợp tác &','Liên hệ'], 'CHUYỂN ĐỔI', ['Nhóm đối tác · liên hệ', 'Hotline · email · QR'], ['Logo · mã QR'],'community-support.jpg'),
]
for i, item in enumerate(data):
    x = 48+(i%5)*220
    y = 418 if i<5 else 181
    card(x, y, *item)
    if i in (4, 9): continue
    c.setStrokeColor(ORANGE)
    c.setLineWidth(1)
    c.line(x+209, y+110, x+218, y+110)
txt(48, 144, 'LUỒNG ĐỌC', 9, True, ORANGE)
txt(48, 122, 'Nhận diện  →  Tin cậy  →  Năng lực  →  Dịch vụ  →  Dự án  →  Bằng chứng  →  Liên hệ', 10)
txt(48, 96, 'Cần chốt: logo · số liệu/chức danh · quyền ảnh/thư · nội dung dịch tiếng Anh trước khi xuất bản.', 10, color=MUTED)
c.setStrokeColor(LINE)
c.line(48, 70, 1142, 70)
txt(48, 47, 'Nguồn: brochure-vbi/build.py · Bản đồ nội dung giai đoạn 1', 9, color=MUTED)
txt(1050, 47, 'MGST  /  2026', 9, True, ORANGE)
c.save()
print(OUT)
