// ============================================================
// DANH SÁCH QUÁN ĂN
// Đây là file duy nhất bạn cần sửa khi thêm/sửa quán mới.
// Không cần đụng vào index.html, style.css hay app.js.
//
// Cấu trúc mỗi quán:
// {
//   name: "Tên quán",
//   category: "Loại quán"  (vd: Buffet, Ăn vặt, Gà Hàn, Trà sữa...),
//   badge: "badge-xxx"     (class màu cho nhãn loại quán, xem style.css)
//   branches: [
//     { label: "Tên chi nhánh (có thể để trống \"\")",
//       address: "Địa chỉ",
//       hours: "Giờ mở cửa",
//       hoursNote: "Ghi chú thêm về giờ (không bắt buộc)" }
//   ],
//   note: "Ghi chú sau khi ăn / nhận xét"
// }
// ============================================================

const DATA = [
  {
    name: "Buffet 79k Hương Việt",
    category: "Buffet",
    badge: "badge-buffet",
    branches: [
      { label: "CN1", address: "22 Tân Quý, Quận Tân Phú", hours: "15:00–22:00", hoursNote: "Ngừng nhận khách lúc 21:00" },
      { label: "CN2", address: "644 Nguyễn Văn Quá, Quận 12", hours: "15:00–21:00" }
    ],
    note: "Buffet 79k, ăn thoải mái bún đậu, nem nướng, bánh tráng thịt luộc."
  },
  {
    name: "Kim Cherry",
    category: "Ăn vặt",
    badge: "badge-vat",
    branches: [
      { label: "", address: "53 Nguyễn Trãi, P. Chợ Quán, Q.5 (đối diện ĐH Sài Gòn)", hours: "08:00–22:00" }
    ],
    note: "Xe bánh tráng nhỏ, có chỗ ngồi. Nổi bật bánh tráng mỡ hành (15–20k), bánh tráng trứng gà vữa (20k), sate tuổi thơ, trà sữa/trà trái cây tự pha."
  },
  {
    name: "Kokoria – Chicken & Cheese",
    category: "Gà Hàn",
    badge: "badge-ga",
    branches: [
      { label: "Sư Vạn Hạnh", address: "573/2 Sư Vạn Hạnh, P.12, Quận 10", hours: "10:30–22:00" },
      { label: "Lê Văn Duyệt", address: "106 Lê Văn Duyệt, P.1, Quận Bình Thạnh", hours: "10:30–22:00" },
      { label: "Tân Bình", address: "28 Trương Công Định, P.14, Quận Tân Bình", hours: "10:30–22:00" },
      { label: "Gò Vấp", address: "699 Phan Văn Trị, P.1, Quận Gò Vấp", hours: "10:30–22:00" }
    ],
    note: "Ấn tượng nhất là gà sốt mù tạt mật ong — vị lạ, ít quán khác có. Sẽ quay lại vì món này."
  }
];
