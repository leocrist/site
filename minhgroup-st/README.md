# Minh Group ST – Website wireframe

Wireframe 10 trang song ngữ (VI chính, có bản EN cho Trang chủ) cho Công ty TNHH Minh Group ST, xuất từ Design canvas.

## Cấu trúc

Website 7 trang (VI) + Trang chủ EN + 1 trang design system, dựng từ **một stylesheet và một bộ component**:

- `tools/site.css`: toàn bộ token (màu, chữ, khoảng cách, bo góc, lưới 13 ô) và component. Breakpoint: ≤1023, ≤767, ≤479.
- `tools/site_gen.py`: sinh mọi trang từ các component dùng chung (`sec`, `head`, `grid`, `card`, `stats`, `feat`, `steps`, `split`, `faq`, `cta`, header, footer, dock). `python3 tools/site_gen.py project` ghi ra `project/`; thêm `--preview assets` để ra HTML thường, mở được không cần canvas.
- `tools/icons.py`, `tools/heights.json`: bộ icon nét và chiều cao artboard ở 1440px.
- `project/canvas.json` + `project/*.dc.html`: artboard trên Design canvas.

| Trang | File | Nội dung |
|---|---|---|
| Trang chủ (VI, EN) | `Main`, `MainEN` | Hero, số liệu, 4 khối, 3 dự án, giá trị cho đối tác, CSR, FAQ |
| Giới thiệu | `About` | Tổng quan, hệ sinh thái 7 lĩnh vực, triết lý, nhóm đối tác, cột mốc, CSR |
| Tổ chức & Lãnh đạo | `Organization` | Sơ đồ 4 khối 12 đơn vị, ban lãnh đạo |
| Lĩnh vực hoạt động | `Services` | 4 khối theo hồ sơ năng lực (`#k1`–`#k4`) |
| Dự án trọng điểm | `Projects` | Máy bán hàng tự động, đào tạo lái xe, cung ứng nhân lực |
| Tin tức & Thư viện | `News` | Bài viết (placeholder) + lưới ảnh |
| Liên hệ | `Contact` | Kênh liên hệ, form, bản đồ (placeholder) |
| Design system | `System` | Token và component để dựng lại trong Figma |

Nguồn nội dung: `Ho_so_nang_luc_Minh_Group_ST` (PDF) và `MGST.docx`. Các trang cũ History, Leadership, Market, Gallery đã gộp vào About, Organization và News.

- `assets/photos/`: ảnh minh họa từ Wikimedia Commons (tác giả, giấy phép trong `credits.json`), cần thay bằng ảnh thật.

## Cần xác nhận trước khi bàn giao

- Logo chính thức của PVI, VPBank, VNPAY, Toro và quyền sử dụng.
- MST, giờ làm việc, bản đồ, ảnh chân dung và phạm vi phụ trách của lãnh đạo, tiêu đề bài viết: đang là placeholder `[...]`.
- Mốc 04/2026 (Phòng Kế toán – Nhân sự) có thể là 04/2025.

## Brochure / Corporate Profile (A4, 8 trang)

Ba phương án, mỗi bản có HTML nguồn, PDF và ảnh preview; đồng thời có artboard tương ứng trên canvas (`project/`):

| Thư mục | Hướng | Artboard canvas |
|---|---|---|
| `brochure/` | Bản 1: ruled grid như website, cam #ca4d25, Inter | `project/Brochure01–08.dc.html` |
| `brochure-v2/` | Bản 2: editorial, màu logo (đỏ + gradient mặt trời), Playfair Display + Be Vietnam Pro | `project/BrochureV2-01–08.dc.html` |
| `brochure-v4/` | Bản 4: theo mẫu tham chiếu, đỏ logo, Montserrat + Be Vietnam Pro | `project/ProfileV4-01–08.dc.html` |
| `brochure-v5/` | Bản 5: Web DNA (lưới ô, crosshair, fcard, vband) + nội dung brochure | `project/ProfileV5-01–08.dc.html` |
| `brochure-v6/` | Bản 6: "Survey Sheet", theo ngôn ngữ Brochure 1, bám đủ 10 mục docx + ma trận phân công lãnh đạo | `project/ProfileV6-01–08.dc.html` |
| `brochure-v3/` | Bản 3: Corporate Profile in ấn, màu website (cam #ca4d25, than #201e1d), Plus Jakarta Sans + Be Vietnam Pro, bleed 3mm | `project/ProfileV3-01–08.dc.html` |

Bản 3 có `SPEC.md` (lưới, typography, tokens, layout từng trang) và `tokens.json`. Logo vector ở `assets/logo/`.

### Brochure V8 và VFinal (10 trang)

| Thư mục | Nội dung | Artboard canvas |
|---|---|---|
| `brochure-v8/` | Bản V8, ảnh minh họa | `project/ProfileV8-01–10.dc.html` |
| `brochure-vfinal/` | Bản VFinal: nội dung rà theo website, ảnh và thư cảm ơn thật do MGST cung cấp | `project/ProfileVFinal-01–10.dc.html` |

`tools/brochure_to_canvas.py` chuyển DOM đã render của từng trang thành artboard (khổ 216 × 303 mm, gồm 3 mm bleed). `assets/canvas/` là bản ảnh nhẹ dùng cho canvas; ảnh gốc độ phân giải in nằm trong thư mục từng bản.

### Brochure VBi: song ngữ VI / EN (10 trang)

`brochure-vbi/`: nội dung của VFinal, mỗi khối chữ có hai giọng trên cùng trang. Tiếng Việt là giọng chính (Inter như VFinal, mực đen); tiếng Anh là giọng thứ hai (Lora nghiêng, cam đất nung).

- `build.py`: sinh `brochure-vbi.html`; thêm `--canvas <thư mục>` để ra artboard `ProfileVBi-01–10.dc.html`.
- `MinhGroupST-Profile-VBi.pdf`: 10 trang, khổ 216 × 303 mm (A4 + 3 mm bleed).
- `design-philosophy.md`: triết lý thiết kế "Twin Register".
- Bản tiếng Anh do máy dịch từ nội dung VFinal, cần người bản ngữ rà lại trước khi in.

