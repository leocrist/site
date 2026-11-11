# Phân tích và lựa chọn ảnh thật MGST

Ngày cập nhật: 10/11/2026. Nguồn: `../assets/photo_mgst`, gồm **26 ảnh và 6 thư cảm ơn PDF**. Đã xem toàn bộ ảnh và render trang đầu của cả 6 PDF; các PDF đều có 1 trang.

Theo phản hồi tiếp theo của người dùng, **trang 09 giữ nguyên cấu trúc Thành tựu của V8**: dải 3 ảnh trên, cột trái với tiêu đề/ảnh lớn/2 thư nghiêng, cột phải 3 ảnh. Chỉ thay tư liệu thật và caption đúng ngữ cảnh; không dùng lưới CSR thay cho bố cục V8. Hai thư giữ góc nghiêng −4°/+4°, mỗi khung cao 62 mm; ảnh chính cao 79 mm.

## Ảnh được đưa vào VFinal

| Trang | Tư liệu lựa chọn | Lý do và cách đặt ảnh |
|---|---|---|
| 01 — Bìa | Ảnh lễ ra quân chuyển đổi số, tên gốc bắt đầu `1793936102797` | Có đội ngũ và bối cảnh hoạt động. Khung ảnh 93 mm, dải tiêu đề riêng 42 mm; chữ và dòng nguồn không đè người hoặc banner. Chỉ cắt phần trần và ghế dưới. |
| 02 — Tổng quan | Ảnh buổi làm việc `1764683231263`; đội ngũ trước trụ sở địa phương `1793951269063` | Thể hiện phối hợp và nguồn lực. Tách ảnh ở trên, nội dung ở dưới để không đặt chữ trên mặt người. |
| 03 — Năng lực thực địa | Tư vấn tại địa bàn `1793936527961`; hỗ trợ an sinh `1793856899382` | Hai khung ngang 107,5 × 60 mm, cách nhau 1 mm; vùng cắt riêng giữ hoạt động chính và khuôn mặt, bỏ khoảng trống thừa. Thay hoàn toàn ảnh văn phòng AI. |
| 04 — Chuyển đổi số & Tài chính | Lễ ra quân và buổi làm việc tại địa phương | Gắn với triển khai và phối hợp; không diễn giải đây là ảnh bệnh viện, số hóa bệnh án hay ảnh ký hợp tác ngân hàng khi ảnh không chứng minh điều đó. |
| 05 — Bảo hiểm & An sinh | Điểm tư vấn an sinh `1791118688869`; hỗ trợ người dân `1793856899382` | Khớp với nội dung phục vụ tại cơ sở. Không cắt bỏ nội dung bối cảnh chính; không ghi tên xã hoặc thời điểm chưa xác minh. |
| 08 — Ban lãnh đạo | Đủ 7 chân dung theo xác nhận bổ sung của người dùng | Đinh Hoàng Minh, Đinh Hoàng Công, Lư Hồng Huỳnh, Nguyễn Thị Hồng Huệ, Phan Hữu Linh, Dương Minh Trường và Trần Thị Lam Thy. Giữ chức danh có nguồn cho 6 người; bà Lam Thy dùng nhãn tạm **Phát triển kinh doanh** theo gợi ý trực tiếp của người dùng. Bố cục 2–2–2–1, thẻ cuối căn giữa, trong cùng trang. |
| 09 — Thành tựu & Cộng đồng | Bàn giao công trình “Thắp sáng đường quê” `1793955382782`; hoạt động ủng hộ Quỹ Vì người nghèo `1793955723522` | Đã đọc banner ở ảnh gốc: công trình chiếu sáng tại xã Mỹ Hiệp, Đồng Tháp; hoạt động Quỹ Vì người nghèo tại Cần Thơ. Giữ banner, người chính và dấu nguồn sẵn có; caption nằm ngoài vùng ảnh. Không tự cộng số tiền tài trợ hoặc quy mọi khoản đóng góp cho riêng MGST. |
| 09 — Thư cảm ơn | `THƯ CẢM ƠN (4).pdf` và `THƯ CẢM ƠN 1.pdf` | Đã đọc trực tiếp bản render: UBND xã **Thạnh Thới An**, ngày **10/12/2025**; UBND xã **Vĩnh Hoà**, ngày **15/01/2026**. Hiển thị ảnh toàn trang; liên kết mở PDF gốc. |

Tổng cộng sử dụng **15 ảnh nguồn** (có ảnh dùng lại có chủ đích) và **2 PDF gốc**. `photo-manifest.json` lưu tên gốc, tên tài nguyên chuẩn hóa, kích thước và vị trí đầu ra.

## Những tư liệu không đưa vào hoặc không diễn giải vượt nguồn

- **Trần Thị Lam Thy:** người dùng đã xác nhận bổ sung vào phần ban lãnh đạo và yêu cầu tạm ghi **Phát triển kinh doanh**. Đây là nhãn do người dùng đề xuất, chưa phải chức danh chính thức được xác minh; `tools/leadership.json` lưu `roleStatus: provisional` để phục vụ cập nhật sau. Không tự thêm cấp bậc giám đốc/phó giám đốc.
- **Nhóm NHÁNH DỰ ÁN:** ảnh thực tế là đội ngũ tư vấn người dân tại địa bàn; chưa thấy máy bán hàng, cơ sở đào tạo lái xe hay hoạt động cung ứng lao động quốc tế. Chỉ dùng một ảnh cho năng lực thực địa, không dùng làm bằng chứng ba dự án trên trang 07.
- **Ảnh lễ ký kết PVI:** ảnh và chú thích đề cập PVI và cơ quan địa phương; chưa đủ căn cứ để giới thiệu là lễ ký của MGST. Không dùng làm thành tựu ký kết riêng của doanh nghiệp.
- **Thư Thạnh Thới An:** nội dung cảm ơn cả PVI Tây Nam và MGST; không quy toàn bộ khoản kinh phí nêu trong thư thành đóng góp riêng MGST.
- **Địa chỉ trong thư:** là nội dung văn bản tại thời điểm phát hành; giữ nguyên PDF, không lấy địa chỉ lịch sử thay cho địa chỉ liên hệ hiện có trong brochure.
- Bốn thư cảm ơn còn lại và các ảnh tương tự được giữ trong thư mục nguồn; không đưa tất cả vào một trang để tránh lặp nội dung và giảm khả năng đọc.

## Chất lượng và thực thi

- Không dùng AI để sửa người, tạo thêm chi tiết hoặc làm giả bằng chứng. 15 tệp ảnh đầu ra được sao chép nguyên byte từ nguồn; cắt khung chân dung bằng CSS.
- Lần polish ảnh: vùng hiển thị được cắt riêng theo từng ảnh bằng CSS, không sửa tệp gốc. Ảnh sự kiện chính giữ nhóm người và banner; ảnh dọc chọn trọng tâm hoạt động thay vì để ảnh ngang nổi giữa khung xám. Tên người trong chân dung lấy theo tên tệp do người dùng cung cấp, không suy đoán danh tính qua khuôn mặt.
- Bìa 1280 × 706 px đạt khoảng 150 ppi nếu trải rộng 216 mm. Đây là giới hạn ảnh nguồn hiện có; không nâng giả độ phân giải.
- Tên tài nguyên đầu ra dùng chữ thường không dấu, ngăn cách bằng dấu gạch nối, ví dụ `dinh-hoang-cong.jpg`, `field-consultation.jpg`, `thank-you-vinh-hoa.pdf`; nguồn có dấu được giữ nguyên.
- Các trang 06 và 10 giữ sơ đồ, mã QR và thông tin liên hệ. Trang 07 giữ nội dung ba dự án, không chèn ảnh sai ngữ cảnh chỉ để lấp chỗ trống.
- V8 giữ riêng để đối chiếu. Menu website tiếp tục mở VFinal; PDF tải xuống được xuất lại từ đúng các trang HTML có ảnh thật.
