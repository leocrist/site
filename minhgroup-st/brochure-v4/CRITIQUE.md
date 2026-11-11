# Bản 4: Phân tích mẫu tham chiếu và kế hoạch làm lại

## 1. Vì sao bản 3 "chưa ngon"

Chấm theo bộ tiêu chí impeccable, thang 1–5:

| Tiêu chí | Điểm | Lý do |
|---|---|---|
| Nhận diện thương hiệu | 2 | Navy + xanh dương là màu theo phản xạ ngành ("corporate thì navy") và lệch hẳn với logo đỏ–cam. |
| Phân cấp thị giác | 3 | Mỗi trang đều có nhiều khối cùng trọng lượng, không có nhân vật chính. |
| Nhịp trang | 2 | Gần như trang nào cũng là thẻ (card) + icon + chữ. Chưa có trang chuyển chương, chưa có trang "thở". |
| Hình ảnh | 1 | Ảnh nhỏ, rời rạc, chất lượng ảnh tạm lộ rõ. |
| Mẫu bị cấm (anti-pattern) | 2 | Có 3 mẫu bị cấm: lưới thẻ giống hệt nhau, mẫu "con số lớn + nhãn nhỏ" (hero-metric) kiểu SaaS, và thẻ lồng trong khối. |
| Kỹ thuật in | 4 | Lề xén, font và vùng an toàn đều đạt; giữ nguyên cho bản 4. |

**Kết luận:** bản 3 trông giống giao diện dashboard được in ra giấy, chưa ra một ấn phẩm in.

## 2. Ba mẫu tham chiếu làm đúng điều gì

| Thủ pháp | Mẫu | Áp dụng vào bản 4 |
|---|---|---|
| Ảnh lớn nhuộm một màu (duotone đỏ) để thống nhất ảnh không đồng bộ | Business Plan (bìa), Mexil | Bìa trước, dải ảnh trang 4–5, khối ảnh bìa sau. Nhuộm duotone đồng thời che được chất lượng ảnh tạm. |
| Trang phân chương: ảnh dọc + khối nhãn màu "SECTION 0x" + dải hồng chạy ngang | Business Plan (Executive Summary) | Trang 3 "Năng lực thực địa · Section 02" |
| Khối màu cắt chéo đè lên ảnh | Business Plan (mục lục), Mexil | Trang 2: khối đỏ cắt chéo + ảnh cắt chéo. Trang 4–5: đường cắt chéo liền mạch qua gáy. |
| Danh sách có số lớn màu đỏ, kẻ dòng mảnh | Business Plan (Contents) | Triết lý hành động, 3 cam kết, 3 mũi nhọn chiến lược |
| Quy trình bằng vòng tròn đánh số nối nhau | Business Plan (Main Services) | Kênh y tế số (trang 4), Phòng Dự án (trang 5), lộ trình (trang 7) |
| Trang tối có câu trích viết hoa | Business Plan (quote page) | Trang 6, nền than chì: "Sự kết nối tạo ra sức mạnh" |
| Biểu đồ vòng (donut) có đường dẫn nhãn | Business Plan (Management Plan) | Hệ sinh thái 7 trụ cột |
| Ảnh chân dung tròn đè lên dải màu ở mép trang | Business Plan (Main Team), Telerex | Ban lãnh đạo (trang 7): dải đỏ ở mép phải |
| Hình học góc cạnh, đường lưới mạng, mảng chấm (dot grid) | Mexil | Bìa sau, góc trang 6 |
| Tiêu đề viết hoa giãn chữ rộng | Business Plan, Mexil | CORPORATE PROFILE, CÔNG NGHỆ & TÀI CHÍNH, AN SINH & DỰ ÁN |
| Vạch nhỏ giữa chân trang | Business Plan | Dấu chân trang mọi trang (thay cho footer chữ) |

**Không lấy từ mẫu:**
- Đường kẻ chéo (diagonal rule) màu đỏ trên trang team của Telerex: chữ bị xoay nghiêng sẽ khó đọc.
- Ảnh stock người mẫu phương Tây: không hợp với một doanh nghiệp miền Tây.

## 3. Hệ màu

Bản 4 dùng chiến lược **Committed**: đỏ lấy từ logo phủ 30–40% bề mặt, kèm than chì ngả đỏ và nền ấm.

| Token | HEX | Dùng cho |
|---|---|---|
| `--red` | #B21F1D | Màu chủ đạo (đỏ logo) |
| `--red-d` | #7C1412 | Bóng của ảnh duotone, khối nhãn section |
| `--rose` | #F3DEDA | Dải nền hồng của trang phân chương |
| `--ink` | #2B2424 | Than chì ngả đỏ: chữ và trang tối |
| `--tint` | #F5F0EE | Nền ấm |
| `--paper` | #FFFDFC | Giấy (không dùng #fff tuyệt đối) |

Muốn quay lại navy chỉ cần đổi 6 token trên trong `:root`. Bố cục không phải sửa gì.

**Font:**
- Montserrat (tiêu đề, chữ hoa giãn): bản tĩnh, có đủ dấu tiếng Việt.
- Be Vietnam Pro (chữ thân bài).

## 4. Cấu trúc 8 trang

| Trang | Kiểu trang | Thủ pháp chính |
|---|---|---|
| 1 | Bìa | Dải ảnh duotone, tiêu đề giãn chữ, dấu cộng + slogan, dải xám thông tin |
| 2 | Tổng quan | Khối đỏ cắt chéo + ảnh cắt chéo; Tầm nhìn / Sứ mệnh; triết lý dạng mục lục; slogan |
| 3 | Phân chương 02 | Ảnh dọc + nhãn Section; 3 con số trình bày trên dòng kẻ; 4 điểm chạm; sơ đồ mạng lưới |
| 4–5 | Trang đôi | Dải ảnh duotone với đường cắt chéo liền qua gáy; 4 lĩnh vực đánh số trong vòng tròn; 2 quy trình 3 bước đối xứng nhau |
| 6 | Trang tối | Câu trích viết hoa, biểu đồ vòng 7 trụ cột, 3 lợi thế, đường lưới mạng |
| 7 | Lộ trình + đội ngũ | Lộ trình 6 mốc; Ban lãnh đạo với ảnh chân dung tròn trên dải đỏ |
| 8 | Bìa sau | Hình học góc cạnh + ảnh duotone, 3 mũi nhọn, khối liên hệ, QR |

## 5. Rủi ro còn lại

- **Ảnh chân dung lãnh đạo:** đang là placeholder. Trang 7 chỉ đẹp khi có ảnh thật, cùng phông nền và cùng cách cắt khung.
- **Màu đỏ đặc trên diện rộng:** in offset có thể bị lệch tông. Cần in thử bản kiểm tra màu (proof) và chốt giá trị CMYK (gợi ý C10 M100 Y100 K10).
- **Mảng tối và ảnh duotone:** tiêu tốn nhiều mực, nên chọn giấy couché ≥150gsm.
- **Các điểm nội dung chưa chốt từ bản 3 vẫn còn nguyên:** "13 tỉnh", số điện thoại cá nhân, QR thật.
