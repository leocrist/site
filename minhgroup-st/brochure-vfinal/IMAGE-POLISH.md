# Kiểm soát ảnh — VFinal

Ngày: 10/11/2026. Phạm vi: tinh chỉnh khung ảnh và tỷ lệ, giữ bố cục Thành tựu V8, đủ 7 lãnh đạo, nguyên văn nội dung nghiệp vụ và hai thư cảm ơn.

| Vị trí | Lỗi trước | Cách sửa |
|---|---|---|
| Bìa | Chữ phủ lên người, ảnh còn nhiều trần/ghế | Ảnh cao 93 mm; tiêu đề trên dải tối riêng 42 mm. Cả tiêu đề và nguồn ảnh tách khỏi ảnh; giữ khuôn mặt và banner. |
| Tổng quan | Khoảng trống thừa làm chủ thể nhỏ | Khung 90 × 42 mm; vùng cắt theo ảnh, bỏ bớt mái nhà/trần/sàn, giữ nhóm người và hoạt động. |
| Thực địa | Hai ảnh khác tỷ lệ tạo đệm và mép không đều | Khung 107,5 × 60 mm, khoảng cách 1 mm; căn riêng từng ảnh. |
| Trang 4–5 | Ảnh nằm giữa mảng nền xám, kích thước nhìn quá nhỏ | Khung 90 × 44 mm lấp đều vùng ảnh; nội dung chữ nằm ngoài ảnh. |
| Ban lãnh đạo | Ảnh thẻ xen ảnh bán thân, kích thước đầu lệch nhau | Khung 20 × 26 mm; vùng hiển thị riêng cho từng người. Ba ảnh bán thân/ngồi được đưa gần hơn tới đầu–vai; không xóa nền, sửa mặt hoặc trang phục. Giữ 2–2–2–1. |
| Thành tựu | Ảnh ngang nhỏ trong cột dọc, caption đè ảnh/nguồn | Giữ topology V8. Dải trên: 58,667 × 32 mm/ảnh; ảnh chính: 132 × 73 mm; cột phải: 44 × 52 mm/ảnh. Caption có vùng riêng phía dưới. |
| Công trình chiếu sáng | Khung ngoài và phần trời thừa cạnh vùng ảnh chính | Cắt phần phụ; giữ banner, dải băng, nhóm người chính và watermark Đồng Tháp góc dưới phải. |
| Thư cảm ơn | Cần tránh làm đầy khung bằng cách cắt văn bản | Giữ toàn bộ trang với `contain`, dấu/chữ ký và link PDF gốc. Hai khung nghiêng −4°/+4° theo V8. |

## Bảo toàn nội dung

- **15 ảnh nguồn và 2 PDF gốc được sao chép nguyên byte**; kiểm tra SHA-256 giữa đầu vào và bản dùng trong brochure.
- 23 vùng hiển thị được mô tả tập trung trong `tools/photo-framing.json` và ghi lại thành tọa độ pixel trong `photo-manifest.json`.
- Khung hiển thị chỉ thay tỷ lệ cắt/căn. Ảnh dùng tỷ lệ tự nhiên, không kéo méo, không tạo phần ảnh mới, không dùng AI sửa người hoặc chữ.
- Ảnh dọc tập trung vào nhân sự và hoạt động chính; các thành phần phụ ở biên có thể nằm ngoài khung. Tệp nguồn đầy đủ vẫn còn nguyên.
- Tên, chức danh và caption nghiệp vụ không thay đổi trong lần polish này. Chức danh bà Lam Thy vẫn là nhãn tạm do người dùng đề xuất.

## Kiểm tra

- Hai lượt visual có giới hạn: bản chỉnh đầy đủ, sau đó một lượt sửa chung và xác nhận.
- Render 10 trang HTML/PDF; kiểm tra desktop 1440 px và mobile 390 px.
- Đo 23 viewport: ảnh lấp khung, tỷ lệ ảnh tự nhiên sai lệch dưới 0,2%; không đè tiêu đề/caption lên ảnh; hai tài liệu vẫn giữ toàn trang.
- Giữ các clipping mask có chủ đích. Cảnh báo `clipped-overflow-container` của máy quét thuộc vùng crop và khổ in cố định, không phải menu/tooltip. Các cảnh báo padding của lưới in hiện có được đối chiếu với bản render, không đổi lưới V8 chỉ để xóa cảnh báo.
- Không diễn giải kết quả máy quét thành chứng nhận tiếp cận hay chất lượng in. Giới hạn độ phân giải ảnh gốc vẫn như báo cáo lựa chọn ảnh.
