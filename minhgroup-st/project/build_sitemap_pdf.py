from pathlib import Path
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

ROOT = Path(__file__).resolve().parents[1]
OUT = Path(__file__).resolve().parent / 'sitemap-website-minh-group-st.pdf'
F = ROOT / 'brochure-v5' / 'fonts'
pdfmetrics.registerFont(TTFont('Inter', str(F / 'Inter-Regular.ttf')))
pdfmetrics.registerFont(TTFont('InterBold', str(F / 'Inter-Bold.ttf')))
W, H = 1190, 842
c = canvas.Canvas(str(OUT), pagesize=(W, H))
c.setTitle('Minh Group ST | Sitemap Website | Giai doan 1')
ORANGE, INK, MUTED, LINE = '#C94D27', '#22201E', '#716B66', '#DFDAD5'

def txt(x, y, value, size=11, bold=False, color=INK):
    c.setFillColor(color)
    c.setFont('InterBold' if bold else 'Inter', size)
    c.drawString(x, y, value)

def panel(x, y, w, h, number, title, items):
    c.setFillColor('#FAF8F6')
    c.roundRect(x, y, w, h, 10, stroke=0, fill=1)
    c.setStrokeColor(LINE)
    c.setLineWidth(.8)
    c.roundRect(x, y, w, h, 10, stroke=1, fill=0)
    c.setFillColor(ORANGE)
    c.circle(x+24, y+h-25, 11, stroke=0, fill=1)
    txt(x+18, y+h-29, number, 8, True, '#FFFFFF')
    txt(x+17, y+h-60, title, 11, True)
    c.setStrokeColor(LINE)
    c.line(x+17, y+h-76, x+w-17, y+h-76)
    for i, item in enumerate(items):
        txt(x+17, y+h-101-i*23, '• '+item, 8.5, color=MUTED)

c.setFillColor('#FFFFFF')
c.rect(0, 0, W, H, stroke=0, fill=1)
c.setFillColor(ORANGE)
c.rect(0, H-7, W, 7, stroke=0, fill=1)
txt(48, 783, 'MINH GROUP ST  /  GIAI ĐOẠN 1', 10, True, ORANGE)
txt(48, 735, 'Cấu trúc thông tin website', 31, True)
txt(48, 709, 'Sitemap đề xuất dựa trên cấu trúc website hiện tại · 6 trang chính', 11, color=MUTED)
txt(1015, 783, '01  /  WEBSITE', 10, True, ORANGE)
c.setFillColor(INK)
c.roundRect(453, 620, 284, 67, 10, stroke=0, fill=1)
txt(477, 658, 'TRANG CHỦ', 16, True, '#FFFFFF')
txt(477, 636, 'Điểm vào chính  ·  VI / EN', 10, color='#F39A78')
data = [
 ('01','GIỚI THIỆU',['Tổng quan','Lịch sử & cột mốc']),
 ('02','TỔ CHỨC',['Cơ cấu 4 khối','Ban lãnh đạo']),
 ('03','LĨNH VỰC',['Chuyển đổi số','Bảo hiểm & An sinh','Quản lý vận hành','Dự án & Nhân lực']),
 ('04','DỰ ÁN',['Máy bán hàng','Đào tạo lái xe','Cung ứng nhân lực']),
 ('05','TIN TỨC',['Tin hoạt động','Hình ảnh & thành tựu']),
 ('06','LIÊN HỆ',['Hotline · Email','Địa chỉ · Biểu mẫu']),
]
x0, gap, bw = 48, 12, (1094-5*12)/6
c.setStrokeColor(ORANGE)
c.setLineWidth(1.25)
c.line(595, 620, 595, 585)
c.line(x0+bw/2, 585, x0+5*(bw+gap)+bw/2, 585)
for i, entry in enumerate(data):
    x = x0+i*(bw+gap)
    c.line(x+bw/2, 585, x+bw/2, 556)
    panel(x, 292, bw, 264, *entry)
txt(48, 144, 'QUY TẮC PHÂN CẤP', 10, True, ORANGE)
txt(48, 121, 'Trang chính = URL riêng. Mục con = section/anchor. CTA liên hệ và lối vào brochure xuất hiện theo ngữ cảnh.', 10)
txt(48, 96, 'VI/EN: đã có chuyển ngữ ở trang chủ; phạm vi dịch các trang còn lại cần được thống nhất.', 10, color=MUTED)
c.setStrokeColor(LINE)
c.line(48, 70, 1142, 70)
txt(48, 47, 'Nguồn: tools/site_gen.py · Bản đồ nội dung giai đoạn 1', 9, color=MUTED)
txt(1050, 47, 'MGST  /  2026', 9, True, ORANGE)
c.save()
print(OUT)
