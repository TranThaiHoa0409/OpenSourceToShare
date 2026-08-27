# Tổng hợp — Sổ Quán Ăn Đã Lưu

Repo: `TranThaiHoa0409/TranThaiHoaPersonalDirectories` — thư mục `Cac_quan_an_da_luu/`
File liên quan: `index.html`, `style.css`, `app.js`, `data.js`, `dish.png`,
`dish-maskable.png`, `manifest.json`

---

## Cấu trúc dữ liệu mỗi quán

Mỗi quán là 1 object trong mảng `DATA` (`data.js`):

```js
{
  name: "Tên quán",
  category: "Tên category (hiển thị trên UI)",
  badge: "class-css-badge-tuong-ung",
  branches: [
    { label: "", address: "địa chỉ", hours: "giờ mở cửa", phone: "SĐT (nếu có)" }
    // có thể thêm nhiều object nữa nếu quán có nhiều chi nhánh
  ],
  note: "Ghi chú/nhận xét về quán, món đặc trưng, giá tham khảo..."
}
```

- `branches` luôn là mảng — 1 chi nhánh vẫn phải để trong `[ ]`.
- `badge` phải khớp với 1 class `.badge-xxx{...}` khai báo trong `style.css`. Category
  mới → cần tạo badge mới (chọn màu chưa dùng, tránh trùng với badge khác).

**Danh sách category/badge tính đến hiện tại:**

| Category | Badge class | Ghi chú |
|---|---|---|
| Buffet | `badge-buffet` | có sẵn từ trước |
| Ăn vặt | `badge-vat` | có sẵn từ trước |
| Gà Hàn | `badge-ga` | có sẵn từ trước |
| Cơm gà | `badge-com-ga` | có sẵn từ trước |
| Bún | `badge-bun` | có sẵn từ trước |
| Cháo | `badge-chao` | có sẵn từ trước |
| Chè | `badge-che` | có sẵn từ trước |
| Bingsu | `badge-bingsu` | có sẵn từ trước |
| Hủ tiếu | `badge-hu-tieu` | badge mới |
| Xíu mại | `badge-xiu-mai` | badge mới |
| Hủ tiếu Mì | `badge-hu-tieu-mi` | badge mới, riêng cho quán bán cả 2 loại |
| Trà sữa | `badge-tra-sua` | đổi tên từ `badge-tra` |
| Mì | `badge-mi` | badge mới, tạo sẵn, chưa có quán nào dùng |

---

## Bug ghi chú bị cắt sai (line-clamp)

**Nguyên nhân:** `style.css` có rule mặc định áp dụng cho **mọi** kích thước màn
hình (không nằm trong `@media max-width:700px`):

```css
.note-text{
  display:-webkit-box;
  -webkit-line-clamp:1;   /* mặc định LUÔN cắt 1 dòng */
  ...
}
```

Khi `app.js` tính ra ghi chú đủ ngắn (không cần cắt), code chỉ reset style inline về
`""` — rơi lại đúng vào rule CSS mặc định ở trên. Nhánh `if` không chạy nên nút "Xem
thêm" cũng không được thêm → ghi chú bị cắt câm lặng, không cách nào mở ra.

**Cách sửa:** thêm nhánh `else` set tường minh trạng thái "hiện đầy đủ" thay vì để
rơi về CSS mặc định:

```js
const showFull = () => {
  text.style.display = "-webkit-box";
  text.style.webkitBoxOrient = "vertical";
  text.style.webkitLineClamp = "none";
  text.style.overflow = "visible";
};

if(naturalLines > maxLines){
  applyClamp(maxLines);
  // ... hiện nút "Xem thêm"
} else {
  showFull();
}
```

Đồng thời tách riêng phần reset của nhánh mobile (vẫn cần dựa đúng vào CSS mặc định
`clamp:1`) khỏi nhánh desktop, để hai nhánh không giẫm lên nhau.

---

## Bug nút "Xem thêm" bấm không phản ứng

**Triệu chứng:** sau khi sửa bug line-clamp, có lúc bấm nút "Xem thêm" không mở ra
gì cả.

**Nguyên nhân:** `initNoteToggles()` được gọi lại mỗi khi có sự kiện `resize`:

```js
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(initNoteToggles, 150);
});
```

Hàm này tái sử dụng **cùng một `<button>`** (không rebuild lại bảng), nhưng dùng
`btn.addEventListener("click", ...)` — mỗi lần gọi lại sẽ **cộng dồn thêm 1
listener mới**, không hề gỡ listener cũ. Nếu tổng số listener là **số chẵn** (ví dụ
đúng 2 lần: 1 lần tải trang + 1 lần resize), một cú bấm sẽ kích hoạt: mở ra → tự
đóng lại ngay trong cùng sự kiện click → nhìn như nút không phản ứng gì.

**Cách sửa:** đổi `btn.addEventListener("click", fn)` → `btn.onclick = fn` ở cả 2
nhánh (mobile & desktop). Gán `onclick` luôn **ghi đè** handler cũ thay vì cộng dồn.

---

## Các quyết định về hạ tầng

### Database ngoài — quyết định: không cần

GitHub Pages deploy theo kiểu **atomic** — bản cũ vẫn tiếp tục phục vụ bình thường
trong lúc build bản mới; chỉ khi build xong mới swap sang bản mới. Nếu build lỗi,
trang vẫn giữ nguyên bản deploy thành công gần nhất, không bao giờ "sập" giữa
chừng. → Sửa `data.js` và commit trực tiếp hoàn toàn an toàn, không có rủi ro
downtime. Giữ nguyên cách lưu data hiện tại, không cần Supabase/Firebase/
Airtable/Google Sheets API.

*(Dung lượng GitHub: file đơn lẻ chặn cứng ở 100MB, repo khuyến nghị dưới ~1GB —
với vài trăm KB data hiện tại thì còn rất xa mới chạm giới hạn.)*

### Dark mode — đã thử, nhưng bỏ (không hợp)

Đã làm thử bản đầy đủ: biến CSS theme tối, nút toggle sáng/tối, lưu lựa chọn qua
`localStorage`, script chống nháy màu khi tải trang. Test hoạt động đúng cả
desktop/mobile, nhưng thấy không hợp giao diện tổng thể → không áp dụng, giữ bản
chỉ có light mode.

### Nếu mở rộng sang loại cửa hàng khác (karaoke, v.v.)

Vì mỗi loại có thông tin khác nhau nhiều, quyết định: **copy riêng từng dự án**
thay vì dùng chung `app.js`/`style.css`. Lưu ý: nếu copy sau khi đã fix 2 bug ở
trên, bug đã fix rồi; nhưng nếu sau này sửa lại `initNoteToggles()` độc lập ở bản
copy, có thể vô tình đưa lại 1 trong 2 bug cũ — nên giữ file tổng hợp này trong
mỗi bản copy làm cheat-sheet tham khảo.

### Repo public — nhận đóng góp từ người khác

3 cách, tuỳ đối tượng:
1. **GitHub Issues** (kèm issue template) — cần tài khoản GitHub, dễ chuẩn hoá.
2. **Pull Request** — dành cho người biết git.
3. **Google Form** — không cần tài khoản GitHub, hợp với bạn bè không rành kỹ
   thuật.

Dù chọn cách nào, dữ liệu vẫn luôn qua tay bạn duyệt trước khi vào `data.js`.

### Nếu `data.js` bị lỗi cú pháp khi push

Push vẫn **thành công bình thường** (git/GitHub không kiểm tra nội dung file JS).
Nhưng khi người dùng mở trang: `data.js` lỗi cú pháp → biến `DATA` không tồn tại →
`app.js` lỗi theo → bảng hiện **trống trơn** ("0 quán đang hiển thị"), không có
thông báo lỗi gì hiện ra cho người xem (trừ khi họ tự mở Console F12). Không sập
trang/404, nhưng site coi như "chết" về hiển thị cho tới khi sửa lại và push bản
đúng. Nên test mở `index.html` trên máy trước khi push, hoặc nhờ kiểm tra cú pháp
trước.

### Nếu `data.js` quá dài — tách file thứ 2

`const DATA` chỉ chặn gán lại biến, không chặn sửa nội dung mảng — dùng `.push()`
ở file phụ:

```js
// data2.js
DATA.push({ name: "...", ... }, { name: "...", ... });
```

Trong `index.html`, thêm dòng script mới **giữa** `data.js` và `app.js`:

```html
<script src="data.js"></script>
<script src="data2.js"></script>
<script src="app.js"></script>
```

Không có mốc "đầy" cụ thể phải canh — tách lúc nào tuỳ thấy thoải mái, không phải
giới hạn kỹ thuật.

---

## Favicon & PWA icon (maskable)

Icon dùng: [Dish icon — Pause08, Flaticon](https://www.flaticon.com/free-icon/dish_857718)
(free, yêu cầu credit tác giả nếu không mua Premium).

File `dish.png` (bản 512px) đặt cùng thư mục với `index.html`. Trong `<head>`,
ngay sau `<title>`:

```html
<link rel="icon" type="image/png" href="dish.png">
<link rel="apple-touch-icon" href="dish.png">
```

- `rel="icon"` → favicon tab trình duyệt, Android cũng tự đọc để hiện icon khi
  "Thêm vào màn hình chính".
- `rel="apple-touch-icon"` → **bắt buộc riêng** cho iOS/Safari — Safari không đọc
  `rel="icon"` khi tạo lối tắt màn hình chính trên iPhone; thiếu dòng này iPhone sẽ
  tự chụp ảnh trang hoặc hiện chữ cái đầu thay vì icon.
- Dùng ảnh 512px chung cho cả 2 thẻ, trình duyệt tự scale khi cần.

**Credit tác giả** (dán vào `<footer>` trong `index.html`):

```html
<footer class="text-center small mt-4">
  Nhấn vào tiêu đề cột để sắp xếp · Nguồn: TranThaiHoaPersonalDirectories
  <br>
  <a href="https://www.flaticon.com/free-icon/dish_857718" title="dish icon" target="_blank" rel="noopener">Dish icon created by Pause08 - Flaticon</a>
</footer>
```

### Vấn đề: icon shortcut màn hình chính bị viền trắng (adaptive icon Android)

**Triệu chứng:** thêm shortcut "Sổ Quán Ăn" vào màn hình chính Android, icon hiện
ra có khung nền trắng bao quanh thay vì nền trong theme, nhìn lệch tông với các
icon app khác.

**Nguyên nhân:** Android tự "đóng gói" icon thành *adaptive icon* khi không có
khai báo icon chuẩn — icon gốc (`dish.png`) không phủ kín hết viền vuông
(full-bleed), nên hệ thống tự tô thêm nền trắng quanh phần trống.

**Cách sửa:** thêm Web App Manifest để khai báo icon đúng chuẩn, gồm 1 bản
"maskable" (full-bleed, icon nằm trong safe-zone hình tròn ở giữa).

`manifest.json` (cùng thư mục `index.html`):
```json
{
  "name": "Sổ Quán Ăn Đã Lưu",
  "short_name": "Sổ Quán Ăn",
  "start_url": "./",
  "display": "standalone",
  "background_color": "#E3DAC3",
  "theme_color": "#A11D2E",
  "icons": [
    { "src": "dish.png", "sizes": "512x512", "type": "image/png", "purpose": "any" },
    { "src": "dish-maskable.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ]
}
```

Thêm vào `<head>` của `index.html`:
```html
<link rel="manifest" href="manifest.json">
<meta name="theme-color" content="#A11D2E">
```

`dish-maskable.png` tạo bằng công cụ **maskable.app** (upload `dish.png`, tô nền
be `#E3DAC3` phủ kín 512×512 — không để trong suốt, icon thu nhỏ nằm gọn trong
safe-zone hình tròn), xuất PNG, đặt cùng thư mục với `dish.png`.

**Lưu ý quan trọng:** Android **cache icon theo shortcut đã tồn tại** — sửa file
trên web không tự cập nhật shortcut cũ. Sau khi push bản mới, phải **xoá shortcut
cũ trên màn hình chính rồi thêm lại** (Chrome → "Thêm vào màn hình chính") mới
thấy nền đổi đúng.