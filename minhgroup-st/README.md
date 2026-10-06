# Minh Group ST – Website wireframe

Wireframe 10 trang song ngữ (VI chính, có bản EN cho Trang chủ) cho Công ty TNHH Minh Group ST, xuất từ Design canvas.

## Cấu trúc

- `project/canvas.json`: bố cục các artboard trên canvas.
- `project/*.dc.html`: từng trang, dạng Design canvas (`<x-dc>` + `DCLogic`). Cần runtime `support.js` của canvas để chạy phần tương tác (popup tư vấn, tab Dịch vụ); phần HTML/CSS tĩnh xem được trực tiếp.
  - `Main.dc.html`: Trang chủ (VI)
  - `MainEN.dc.html`: Home (EN)
  - About, History, Organization, Leadership, Market, Services, News, Gallery, Contact: 9 trang con (chưa đồng bộ hệ lưới mới của Trang chủ)
- `assets/logo-mgst.png`: logo Minh Group ST.
- `assets/photos/`: ảnh minh họa từ Wikimedia Commons. Tác giả và giấy phép ghi trong `credits.json` và trên từng ảnh. Đây là ảnh tạm, cần thay bằng ảnh thật của Minh Group trước khi lên production.
- `assets/logos/`: logo đối tác, bản trắng đơn sắc, lấy từ website chính thức của từng bên.

## Cần xác nhận trước khi bàn giao

- Vietcombank và Agribank đang là đối tác demo, chưa xác nhận là đối tác thật. Cần danh sách ngân hàng và đối tác Đức/Ba Lan thật.
- Logo đối tác cần bản chính thức (SVG) và sự cho phép dùng bản trắng đơn sắc.
- Các chỗ `[...]` (số giấy phép, địa chỉ, MST, giá, ngày tháng) là placeholder.
- Giờ làm việc và cam kết "gọi lại trong 30 phút" trong FAQ là giả định.
