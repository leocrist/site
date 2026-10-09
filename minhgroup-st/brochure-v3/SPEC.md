# Minh Group ST · Corporate Profile 2026 (bản 3): Đặc tả thiết kế

**Ý tưởng:** "Cửu Long Network". Chín nhánh sông Cửu Long được vẽ thành chín tuyến metro số, chạy từ thượng nguồn ra biển. Hai tuyến được tô màu: xanh dương cho công nghệ và tài chính, xanh lá cho an sinh và y tế. Bảy tuyến còn lại là mạng lưới nền. Hình tuyến metro này xuyên suốt cả cuốn: bìa trước, dải tiêu đề của trang đôi 4–5, lộ trình phát triển và bìa sau.

**Danh sách file**

| File | Mục đích |
|---|---|
| `brochure-v3.html` | File nguồn, đặt lề xén 3mm (`--b:3mm`) |
| `MinhGroupST-Profile-v3-print.pdf` | Bản gửi nhà in: khổ 216×303mm, đã khai báo TrimBox 210×297 và BleedBox |
| `MinhGroupST-Profile-v3.pdf` | Bản A4 đã xén, dùng xem trên màn hình hoặc gửi email |
| `preview-spreads-v3.png` | Xem theo đúng cặp trang khi mở cuốn ghim giữa |
| `tokens.json` | Design tokens: màu, chữ, khoảng cách, lưới |

---

## 1. Quy chuẩn in

| Thông số | Giá trị |
|---|---|
| Khổ thành phẩm | A4, 210×297mm, khổ dọc |
| Lề xén (bleed) | 3mm mỗi cạnh; mọi mảng màu và ảnh tràn lề đều kéo ra tới mép bleed |
| Vùng an toàn | 15mm từ mép xén; chữ, logo và QR luôn nằm trong vùng này |
| Đóng cuốn | Ghim giữa (saddle-stitch), 8 trang = 2 tờ in gấp đôi |
| Cặp trang khi mở | [ – , 1 ] · [2, 3] · [4, 5] · [6, 7] · [8, – ] |
| Phần tử vắt qua gáy | Chỉ có dải navy và tuyến metro ở trang 4–5. Không đặt chữ qua gáy. |
| Font | Nhúng toàn bộ, dạng CID TrueType, không có font Type 3. Plus Jakarta Sans dùng bản tĩnh, không dùng bản variable. |
| Hệ màu file | RGB. Nhà in hoặc bộ phận chế bản cần chuyển sang profile FOGRA39 / ISO Coated v2 (xem mục 3). |

> **Bảng bình trang (imposition), tự xếp lại theo thứ tự ghim giữa:**
> - Tờ ngoài: mặt A = 8 | 1, mặt B = 2 | 7.
> - Tờ trong: mặt A = 6 | 3, mặt B = 4 | 5.
>
> Nhà in thường tự bình trang; file PDF chỉ cần đúng thứ tự từ 1 đến 8.

## 2. Hệ lưới

- **Vùng nội dung:** 180×267mm, trong lề an toàn 15mm.
- **12 cột:** mỗi cột 11,333mm, khoảng cách cột (gutter) 4mm, bước cột 15,333mm.
  - Công thức: `x(cột c) = 15 + (c−1)×15,333`; `rộng(span s) = s×15,333 − 4`.
- **Các span hay dùng:**
  - 4+4+4: ba con số lớn ở trang 3.
  - 5+7: bất đối xứng ở trang 2.
  - 6+6: hai cột lĩnh vực ở trang 4 và 5.
  - 12: sơ đồ, bảng, khối CTA.
- **Header chạy trang (running header)** ở y=11mm: nhãn chương bên ngoài, logo bên trong. Trang chẵn và trang lẻ đổi bên cho nhau.
- **Footer** ở cách mép dưới 9mm: số trang luôn nằm ở mép ngoài.
- **Nhịp dọc:** bội số của 2mm. Khoảng cách giữa các khối: 3 / 4 / 5 / 6mm.

## 3. Màu (design tokens)

| Token | HEX | CMYK tham chiếu* | Dùng cho |
|---|---|---|---|
| `navy` | #201E1D | C100 M80 Y35 K45 | Màu chủ đạo, nền bìa, trang 6, khối nhấn |
| `navy-2` / `navy-3` | #2A2725 / #3A3633 | C95 M70 Y30 K30 / C90 M60 Y20 K15 | Thẻ đặt trên nền navy |
| `blue` | #CA4D25 | C90 M55 Y0 K0 | Công nghệ, tài chính, nút và liên kết |
| `blue-l` | #EF7A52 | C55 M30 Y0 K0 | Chữ hoặc nét xanh trên nền navy (độ tương phản ≥ 4.5:1) |
| `green` | #A93D1B | C85 M10 Y70 K5 | An sinh, y tế, bảo hiểm |
| `green-l` | #F2A07E | C60 M0 Y45 K0 | Nhãn xanh lá trên nền navy |
| `slate` | #3A3633 | **K90** (đề xuất) | Chữ thân bài |
| `mut` | #5C5C5C | K65 | Chú thích, mô tả phụ |
| `off` | #FAF7F4 | C2 M1 Y0 K0 (đề xuất bỏ, xem ghi chú) | Nền khối |
| `line` | #EBE7E3 | C15 M8 Y3 K0 | Đường kẻ, viền thẻ |

\* Giá trị CMYK ở đây chỉ là điểm xuất phát, cần đối chiếu bằng bản in thử (proof) trên profile FOGRA39.

- `#CA4D25` nằm **ngoài gam màu CMYK**: khi in sẽ xỉn và ngả sang tím-xanh. Muốn giữ đúng màu thì phải dùng màu pha Pantone 2728 C / 285 C.
- Chữ thân bài 9–10pt nên in **một bản K** (100K hoặc 90K) để không bị lệch chồng màu. Không nên in slate bằng 4 màu.
- `#FAF7F4` chỉ khoảng 2% mực, nên khi in gần như không thấy. Nên đổi thành C5 M2 Y0 K0, hoặc dùng giấy trắng và viền `line`.

## 4. Typography

| Vai trò | Font | Cỡ / dòng | Độ đậm | Ghi chú |
|---|---|---|---|---|
| Display (bìa) | Plus Jakarta Sans | 42pt / 1.04 | ExtraBold 800 | letter-spacing −0.03em, word-spacing +0.09em |
| H1 | Plus Jakarta Sans | 25pt / 1.10 | 800 | Tiêu đề trang |
| H2 | Plus Jakarta Sans | 16pt / 1.18 | 800 | Tiêu đề lĩnh vực |
| H3 | Plus Jakarta Sans | 11pt / 1.30 | 700 | Tiêu đề thẻ |
| Big Stat | Plus Jakarta Sans | 36–48pt / 0.95 | 800 | Dấu "+" tô màu `blue` |
| Label | Plus Jakarta Sans | 6.8pt, VIẾT HOA | 700 | tracking +0.16em |
| Body | Be Vietnam Pro | 9.5pt / 1.45 | Regular 400 | |
| Body-S | Be Vietnam Pro | 9pt / 1.42 | 400 | Mô tả trong thẻ |
| Caption | Be Vietnam Pro | 7.6pt / 1.40 | 400 | Chỉ dùng cho chú thích phụ |

- **Dấu tiếng Việt:** Plus Jakarta Sans có khoảng trắng giữa các từ rất hẹp, nên tiêu đề được cộng `word-spacing:.09em`.
- **Khoảng cách dòng cho dấu:** line-height ≥ 1.04 cho cỡ display. Nếu nhỏ hơn, dấu của chữ hoa như "Ố", "Ể" sẽ chạm vào dòng trên.
- **Cỡ chữ tối thiểu khi in:** 7pt, và chỉ áp dụng cho chú thích ảnh hoặc ghi nguồn.

## 5. Thành phần (components)

- **Stat Callout:** gạch màu 1,2mm ở trên, con số 46pt, nhãn 9.5pt.
- **Info Card:** bo góc 2,4mm, padding 5mm, viền `line` 0,25mm. Biểu tượng (icon) đặt trong vòng tròn 9mm, nền là màu nhạt (tint) của nhóm màu.
- **Huy hiệu triết lý:** lưới 2×2, ô thứ tư (Sức mạnh) tô màu `blue` làm điểm kết.
- **Horizontal Accent Card** (trang 6): cấu trúc 3 cột `22mm | nội dung | 44mm`. Khối số bên trái mang màu của nhóm.
- **Ga metro** (trang 4–5, trang 7): vòng tròn bán kính 3–4mm, viền 0,9–1mm, nhãn bằng Plus Jakarta 800.
- **Khung QR:** 38×38mm, có 3 ô định vị (finder pattern) và chữ "[Placeholder]". **Bắt buộc thay bằng QR thật trước khi in**, cỡ in tối thiểu 20×20mm.

## 6. Bố cục từng trang

| Trang | Lưới | Nội dung chính |
|---|---|---|
| 1 · Bìa trước | Toàn trang navy | 9 tuyến Cửu Long chạy chéo; slogan cỡ display; dải chân trang có tên công ty và tagline |
| 2 · Tổng quan | 5 / 7 | Trái: tuyên ngôn thương hiệu và khối "Thông điệp" có slogan. Phải: thẻ Tầm nhìn, thẻ Sứ mệnh và 4 huy hiệu triết lý |
| 3 · Năng lực thực địa | 4/4/4 → 6/6 → 12 | 3 con số lớn; ảnh và 4 điểm chạm; sơ đồ mạng lưới (Ban Giám đốc → 11 PKD dạng tuyến metro, PKD Y, 5 phòng chức năng) |
| 4 · Trang đôi trái | Dải navy 60mm, 6/6, ảnh tràn lề | Lĩnh vực 01 Chuyển đổi số & Y tế số; Lĩnh vực 02 Tài chính – Ngân hàng (12+, 12 ngân hàng hội tụ) |
| 5 · Trang đôi phải | Giống trang 4 | Lĩnh vực 03 Bảo hiểm & An sinh (PVI · PTI · TASCO); Lĩnh vực 04 Chi trả BTXH (3 cam kết) & Phòng Dự án (3 bước) |
| 6 · Hệ sinh thái | Toàn trang navy | Sơ đồ hình bảy cạnh nối đủ 7 đỉnh với nhau (K7); 3 thẻ lợi thế cạnh tranh |
| 7 · Lộ trình & Điều hành | 12 | Lộ trình dạng metro gồm 6 ga trên 2 dải năm; danh bạ 6 lãnh đạo |
| 8 · Bìa sau | Toàn trang navy | 3 mũi nhọn chiến lược; khối CTA (hotline, email, địa chỉ, QR); slogan; ghi nguồn ảnh |
