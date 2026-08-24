// ============================================================
// LOGIC HIỂN THỊ / TÌM KIẾM / SẮP XẾP
// File này đọc dữ liệu từ biến DATA (định nghĩa trong data.js).
// Không cần sửa file này khi thêm quán mới.
// ============================================================

// --- Vietnamese-friendly search: strip diacritics + tone marks, handle đ/Đ, lowercase ---
function normalizeVN(str){
  return (str || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim();
}

const CATEGORIES = ["Tất cả", ...Array.from(new Set(DATA.map(d => d.category)))];

let state = { category: "Tất cả", query: "", sortKey: "name", sortDir: 1 };

function renderTabs(){
  const tabsEl = document.getElementById("tabs");
  tabsEl.innerHTML = "";
  CATEGORIES.forEach(cat => {
    const li = document.createElement("li");
    li.className = "nav-item";
    const btn = document.createElement("button");
    btn.className = "nav-link" + (state.category === cat ? " active" : "");
    btn.type = "button";
    btn.textContent = cat;
    btn.addEventListener("click", () => { state.category = cat; render(); });
    li.appendChild(btn);
    tabsEl.appendChild(li);
  });
}

function getFiltered(){
  let rows = DATA.filter(r => state.category === "Tất cả" || r.category === state.category);
  if(state.query.trim()){
    const q = normalizeVN(state.query);
    rows = rows.filter(r => {
      const haystack = [
        r.name,
        r.category,
        r.note,
        ...r.branches.map(b => b.label),
        ...r.branches.map(b => b.address)
      ].map(normalizeVN).join(" | ");
      return haystack.includes(q);
    });
  }
  rows = rows.slice().sort((a,b) => {
    let av, bv;
    if(state.sortKey === "address"){
      av = a.branches[0].address; bv = b.branches[0].address;
    } else {
      av = (a[state.sortKey] || "").toString();
      bv = (b[state.sortKey] || "").toString();
    }
    av = normalizeVN(av); bv = normalizeVN(bv);
    if(av < bv) return -1 * state.sortDir;
    if(av > bv) return 1 * state.sortDir;
    return 0;
  });
  return rows;
}

function renderTable(){
  const rows = getFiltered();
  const body = document.getElementById("table-body");
  body.innerHTML = "";

  if(rows.length === 0){
    body.innerHTML = '<tr class="empty-row"><td colspan="4">Không tìm thấy quán nào.</td></tr>';
  } else {
    rows.forEach(r => {
      const tr = document.createElement("tr");
      const branchBlocks = r.branches.map(b => `
        <div class="branch-block">
          ${b.label ? `<span class="branch-label">${b.label}</span>` : ""}
          <div class="branch-addr">${b.address}</div>
          <div class="branch-meta">
            <span class="branch-hours">${b.hours}</span>
            ${b.phone ? `<span class="branch-phone">· ${b.phone}</span>` : ""}
          </div>
        </div>
      `).join("");
      tr.innerHTML = `
        <td class="col-name">
          <span class="name-vn">${r.name}</span>
        </td>
        <td><span class="badge rounded-pill ${r.badge}">${r.category}</span></td>
        <td data-label="Chi nhánh"><div class="branch-list">${branchBlocks}</div></td>
        <td class="note" data-label="Ghi chú">
          <div class="note-text">${r.note}</div>
          <button type="button" class="note-toggle d-none">Xem thêm</button>
        </td>
      `;
      body.appendChild(tr);
    });
  }

  document.getElementById("count-visible").textContent = rows.length;
  initNoteToggles();
}

function initNoteToggles(){
  const isMobile = window.matchMedia("(max-width: 700px)").matches;

  document.querySelectorAll(".note").forEach(cell => {
    const text = cell.querySelector(".note-text");
    const btn = cell.querySelector(".note-toggle");

    // Reset phần chung (không đụng tới line-clamp ở đây — mỗi nhánh
    // mobile/desktop bên dưới tự set clamp tường minh cho đúng ngữ cảnh).
    text.classList.remove("expanded");
    btn.classList.add("d-none");
    btn.textContent = "Xem thêm";

    if(isMobile){
      // Mobile: dựa vào rule CSS mặc định .note-text{-webkit-line-clamp:1}.
      // Xoá mọi style inline có thể còn sót lại từ lần đo desktop trước đó
      // (ví dụ khi người dùng thu nhỏ cửa sổ), để quay lại đúng CSS mặc định.
      text.style.display = "";
      text.style.webkitBoxOrient = "";
      text.style.webkitLineClamp = "";
      text.style.overflow = "";

      if(text.scrollHeight > text.clientHeight + 1){
        btn.classList.remove("d-none");
        // Dùng onclick (không phải addEventListener) — initNoteToggles() có thể
        // chạy lại nhiều lần trên CÙNG một nút (ví dụ mỗi lần resize), nếu dùng
        // addEventListener thì listener sẽ cộng dồn: số lượng chẵn -> bấm 1 cái
        // là mở-rồi-đóng ngay trong cùng 1 click, nhìn như nút không phản ứng gì.
        btn.onclick = () => {
          const expanded = text.classList.toggle("expanded");
          btn.textContent = expanded ? "Thu gọn" : "Xem thêm";
        };
      }
    } else {
      // Desktop: chỉ giới hạn ghi chú nếu nó CAO HƠN cột "Chi nhánh" của
      // cùng hàng — nếu hàng đã đủ chỗ (nhiều chi nhánh) thì hiện full luôn.
      // Cắt theo SỐ DÒNG TRỌN VẸN (line-clamp), không cắt theo pixel để
      // tránh cắt ngang giữa dòng chữ.
      const row = cell.closest("tr");
      const branchCell = row.children[2];
      if(!branchCell) return;

      // Đo chiều cao thật của nội dung chi nhánh (div .branch-list),
      // KHÔNG đo trực tiếp <td> — vì các ô trong cùng 1 hàng bảng HTML
      // luôn tự kéo giãn cao bằng nhau, nên offsetHeight của <td> không
      // phản ánh đúng nội dung thật, làm phép so sánh bị sai lệch.
      const branchList = branchCell.querySelector(".branch-list");
      const targetHeight = branchList ? branchList.offsetHeight : branchCell.offsetHeight;
      const naturalHeight = text.scrollHeight;

      const lineHeight = parseFloat(getComputedStyle(text).lineHeight) || 20;
      const naturalLines = Math.round(naturalHeight / lineHeight);
      const maxLines = Math.max(1, Math.floor(targetHeight / lineHeight));

      const applyClamp = (lines) => {
        text.style.display = "-webkit-box";
        text.style.webkitBoxOrient = "vertical";
        text.style.webkitLineClamp = lines;
        text.style.overflow = "hidden";
      };
      // Trạng thái "hiện đầy đủ", set TƯỜNG MINH — không dựa vào việc
      // reset style inline về "" (vì lúc đó CSS mặc định -webkit-line-clamp:1
      // của .note-text vẫn còn hiệu lực và sẽ âm thầm cắt về 1 dòng, dù
      // JS đã tính là không cần cắt gì cả — đây chính là bug gốc).
      const showFull = () => {
        text.style.display = "-webkit-box";
        text.style.webkitBoxOrient = "vertical";
        text.style.webkitLineClamp = "none";
        text.style.overflow = "visible";
      };

      if(naturalLines > maxLines){
        applyClamp(maxLines);
        btn.classList.remove("d-none");
        // onclick thay vì addEventListener — cùng lý do như nhánh mobile ở trên:
        // tránh cộng dồn listener khi initNoteToggles() chạy lại (resize...).
        btn.onclick = () => {
          const collapsed = text.style.webkitLineClamp !== "none" && text.style.webkitLineClamp !== "";
          if(collapsed){
            text.style.webkitLineClamp = "none";
            text.style.overflow = "visible";
            btn.textContent = "Thu gọn";
          } else {
            applyClamp(maxLines);
            btn.textContent = "Xem thêm";
          }
        };
      } else {
        showFull();
      }
    }
  });
}

function renderSortIndicators(){
  document.querySelectorAll("thead th").forEach(th => {
    th.classList.remove("sorted");
    const arrow = th.querySelector(".arrow");
    if(th.dataset.key === state.sortKey){
      th.classList.add("sorted");
      arrow.textContent = state.sortDir === 1 ? "▾" : "▴";
    } else {
      arrow.textContent = "▾";
    }
  });
}

function render(){
  renderTabs();
  renderTable();
  renderSortIndicators();
}

document.querySelectorAll("thead th").forEach(th => {
  th.addEventListener("click", () => {
    const key = th.dataset.key;
    if(state.sortKey === key){ state.sortDir *= -1; }
    else { state.sortKey = key; state.sortDir = 1; }
    render();
  });
});

document.getElementById("search-input").addEventListener("input", (e) => {
  state.query = e.target.value;
  render();
});

let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(initNoteToggles, 150);
});

render();