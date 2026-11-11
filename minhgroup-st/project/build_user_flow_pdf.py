from pathlib import Path
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

ROOT = Path(__file__).resolve().parents[1]
OUT = Path(__file__).resolve().parent / 'user-flow-website-minh-group-st.pdf'
F = ROOT / 'brochure-v5' / 'fonts'
pdfmetrics.registerFont(TTFont('Inter', str(F / 'Inter-Regular.ttf')))
pdfmetrics.registerFont(TTFont('InterBold', str(F / 'Inter-Bold.ttf')))
W, H = 1190, 842
c = canvas.Canvas(str(OUT), pagesize=(W, H))
c.setTitle('Minh Group ST | User Flow Website | Giai doan 1')
ORANGE, INK, MUTED, LINE = '#C94D27', '#22201E', '#716B66', '#DFDAD5'

def txt(x, y, value, size=10, bold=False, color=INK):
    c.setFillColor(color)
    c.setFont('InterBold' if bold else 'Inter', size)
    c.drawString(x, y, value)

def node(x, y, w, heading, subtitle, kind='normal'):
    fill = INK if kind == 'end' else '#FFF3EE' if kind == 'start' else '#FAF8F6'
    c.setFillColor(fill)
    c.roundRect(x, y, w, 67, 9, stroke=0, fill=1)
    c.setStrokeColor(ORANGE if kind in ('start', 'end') else LINE)
    c.setLineWidth(1.2 if kind in ('start', 'end') else .8)
    c.roundRect(x, y, w, 67, 9, stroke=1, fill=0)
    fg = '#FFFFFF' if kind == 'end' else INK
    sub = '#F1B9A4' if kind == 'end' else MUTED
    txt(x+15, y+39, heading, 11, True, fg)
    txt(x+15, y+19, subtitle, 9, color=sub)

def arrow(x1, y, x2):
    c.setStrokeColor(ORANGE)
    c.setLineWidth(1.3)
    c.line(x1, y, x2-6, y)
    p=c.beginPath()
    p.moveTo(x2-7,y+4)
    p.lineTo(x2,y)
    p.lineTo(x2-7,y-4)
    c.drawPath(p, stroke=1)

c.setFillColor('#FFFFFF')
c.rect(0, 0, W, H, stroke=0, fill=1)
c.setFillColor(ORANGE)
c.rect(0, H-7, W, 7, stroke=0, fill=1)
txt(48, 783, 'MINH GROUP ST  /  GIAI ĐOẠN 1', 10, True, ORANGE)
txt(48, 735, 'User flow website', 31, True)
txt(48, 709, 'Ba hành trình chính từ khám phá thông tin đến hành động', 11, color=MUTED)
txt(1030, 783, '03  /  FLOW', 10, True, ORANGE)

flows = [
 ('01  /  ĐỐI TÁC HỢP TÁC', 588, [
  ('Vào trang chủ','Tìm hiểu Minh Group ST','start'),
  ('Xem lĩnh vực','Chọn khối phù hợp','normal'),
  ('Đánh giá năng lực','Tổ chức · Dự án · Tin tức','normal'),
  ('Liên hệ hợp tác','Hotline / email / biểu mẫu','end')]),
 ('02  /  NGƯỜI DÂN TÌM DỊCH VỤ', 390, [
  ('Vào trang chủ','Từ tìm kiếm / liên kết','start'),
  ('Xem lĩnh vực','Tài chính / Bảo hiểm','normal'),
  ('Đọc thông tin','Điều kiện · điểm phục vụ','normal'),
  ('Kết nối tư vấn','Hotline / email / biểu mẫu','end')]),
 ('03  /  NGƯỜI XEM HỒ SƠ NĂNG LỰC', 192, [
  ('Vào trang chủ','Tìm hồ sơ công ty','start'),
  ('Mở brochure','Xem bản HTML hoặc PDF','normal'),
  ('Kiểm tra bằng chứng','Thành tựu · Lãnh đạo','normal'),
  ('Liên hệ','Trao đổi bước tiếp theo','end')]),
]
xs=[48,331,614,897]
for label, y, steps in flows:
    txt(48, y+99, label, 11, True, ORANGE)
    for i,(title,sub,kind) in enumerate(steps):
        node(xs[i], y, 245, title, sub, kind)
        if i<3: arrow(xs[i]+245, y+33.5, xs[i+1]-8)
    if y>192:
        c.setStrokeColor(LINE)
        c.line(48, y-47, 1142, y-47)

txt(48, 107, 'ĐIỂM CẦN CHỐT', 10, True, ORANGE)
txt(48, 85, 'Biểu mẫu hiện là giao diện; cần xác định nơi nhận dữ liệu và trạng thái gửi thành công/lỗi trước khi triển khai.', 10)
c.setStrokeColor(LINE)
c.line(48, 65, 1142, 65)
txt(1050, 43, 'MGST  /  2026', 9, True, ORANGE)
c.save()
print(OUT)
