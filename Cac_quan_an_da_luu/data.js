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
//       phone: "Số điện thoại (có thể để trống \"\")" }
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
      { label: "CN1", address: "22 Tân Quý, Quận Tân Phú", hours: "15:00–22:00", phone: "" },
      { label: "CN2", address: "644 Nguyễn Văn Quá, Quận 12", hours: "15:00–21:00", phone: "" }
    ],
    note: "Buffet 79k, ăn thoải mái bún đậu, nem nướng, bánh tráng thịt luộc."
  },
  {
    name: "Kim Cherry",
    category: "Ăn vặt",
    badge: "badge-vat",
    branches: [
      { label: "", address: "53 Nguyễn Trãi, P. Chợ Quán, Q.5 (đối diện ĐH Sài Gòn)", hours: "08:00–22:00", phone: "" }
    ],
    note: "Xe bánh tráng nhỏ, có chỗ ngồi. Nổi bật bánh tráng mỡ hành (15–20k), bánh tráng trứng gà vữa (20k), sate tuổi thơ, trà sữa/trà trái cây tự pha."
  },
  {
    name: "Kokoria – Chicken & Cheese",
    category: "Gà Hàn",
    badge: "badge-ga",
    branches: [
      { label: "Sư Vạn Hạnh", address: "573/2 Sư Vạn Hạnh, P.12, Quận 10", hours: "10:30–22:00", phone: "" },
      { label: "Lê Văn Duyệt", address: "106 Lê Văn Duyệt, P.1, Quận Bình Thạnh", hours: "10:30–22:00", phone: "0909 407 981" },
      { label: "Tân Bình", address: "28 Trương Công Định, P.14, Quận Tân Bình", hours: "10:30–22:00", phone: "" },
      { label: "Gò Vấp", address: "699 Phan Văn Trị, P.1, Quận Gò Vấp", hours: "10:30–22:00", phone: "0938 115 428" }
    ],
    note: "Chuỗi quán gà rán/gà phô mai kiểu Hàn Quốc, nổi bật với món gà phô mai \"signature\", ngoài ra có mì lạnh, mì tương đen, gà sốt cay, khoai tây lắc phô mai. Giá trung bình khoảng 120.000 – 150.000đ/người."
  },
  {
    name: "Cơm gà xối mỡ Thanh",
    category: "Cơm gà",
    badge: "badge-com",
    branches: [
      { label: "", address: "Hẻm 214 Nguyễn Trãi, P.2, Quận 5", hours: "15:00–23:00", phone: "" }
    ],
    note: "Gà xối mỡ giòn rụm, mềm bên trong. Cơm thấm mỡ gà, tơi xốp. Có thêm cơm chiên thịt heo xù, mực sốt chua ngọt."
  },
  {
    name: "Bún Thang Cậu Ba",
    category: "Bún",
    badge: "badge-bun",
    branches: [
      { label: "", address: "829 Trần Hưng Đạo, P.1, Quận 5", hours: "06:00–15:00", phone: "" }
    ],
    note: "Bún thang chuẩn vị miền Bắc, nước dùng trong ngọt từ xương gà và tôm khô, ăn kèm gà xé, giò lụa, trứng thái sợi, nấm hương, mắm tôm. Có thêm bún mọc, phở gà, miến gà."
  },
  {
    name: "Cá Viên Chiên Anh Mỹ",
    category: "Ăn vặt",
    badge: "badge-vat",
    branches: [
      { label: "", address: "81 Nguyễn Thái Học, P. Cầu Ông Lãnh, Quận 1", hours: "15:30–00:00", phone: "" }
    ],
    note: "Cá viên chiên nước mắm tỏi phi, ăn kèm bắp xào. Không gian rộng rãi, thoáng mát, phù hợp nhóm đông."
  },
  {
    name: "Geylang By 9",
    category: "Cháo",
    badge: "badge-chao",
    branches: [
      { label: "", address: "25 Cô Bắc, P. Cầu Ông Lãnh, Quận 1", hours: "16:00–03:00", phone: "0906 776 194" }
    ],
    note: "Cháo ếch kiểu Singapore, không gian giản dị mang phong cách Singapore. Có chỗ để xe miễn phí."
  },
  {
    name: "Cacao Dừa 136",
    category: "Ăn vặt",
    badge: "badge-vat",
    branches: [
      { label: "", address: "136/1 Nguyễn Tri Phương, P.9, Quận 5 (hẻm đối diện trường Trần Khai Nguyên)", hours: "08:00–22:00", phone: "0938 845 359" }
    ],
    note: "Cacao dừa béo mịn, ngọt vừa, dừa tắc cũng ngon. Quán trong hẻm, có phòng máy lạnh trên lầu."
  },
  {
    name: "Chè Cô Giang",
    category: "Chè",
    badge: "badge-che",
    branches: [
      { label: "", address: "85 Cô Giang, P. Cầu Ông Lãnh, Quận 1", hours: "15:00–22:00", phone: "" }
    ],
    note: "Quán chè về đêm luôn đông khách, đa dạng loại chè: chè ba màu, sâm bổ lượng, chè đậu đen nước cốt dừa, chè đậu xanh, chè mè đen. Giá rẻ, khoảng 18k/ly. Không gian ngồi hơi chật, chủ yếu khách quen ghé ăn."
  },
  {
    name: "Bingsu Cafe (BingBing)",
    category: "Bingsu",
    badge: "badge-bingsu",
    branches: [
      { label: "", address: "283/72 Cách Mạng Tháng Tám, Quận 10", hours: "10:30–23:30", phone: "0704 412 082" }
    ],
    note: "Bingsu có 3 size, size nhỏ vẫn đủ cho 1 người ăn. Không gian nhỏ nhưng décor dễ thương, nhân viên thân thiện, có hỏi trước độ cay khi order món khác kèm."
  },
  {
    name: "Bún Bò Huế Cô Ân",
    category: "Bún",
    badge: "badge-bun",
    branches: [
      { label: "", address: "331/10 Đ. Nguyễn Thiện Thuật, P. Bàn Cờ", hours: "24/24", phone: "028 3833 2806" }
    ],
    note: "Bún bò Huế đúng vị, chủ quán gốc Huế, nước dùng đậm đà thơm mắm ruốc. Quán mở 24/24, nhiều thịt, giá hợp lý. Có chú chó nhỏ dễ thương chạy quanh quán."
  },
  {
    name: "Bún Thịt Nướng Chả Giò - Nguyễn Trung Trực",
    category: "Bún",
    badge: "badge-bun",
    branches: [
      { label: "", address: "1 Nguyễn Trung Trực, P. Bến Thành", hours: "06:00–20:30", phone: "0909 139 017" }
    ],
    note: "Bún thịt nướng lâu năm nổi tiếng, chả giò giòn. Ngồi ghế nhựa bên lề đường đối diện quán. Giá khoảng 190k/2 phần, gần trung tâm."
  }
];