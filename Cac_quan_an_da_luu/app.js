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
    if(state.sortKey === "hours"){
      av = a.branches[0].hours; bv = b.branches[0].hours;
    } else if(state.sortKey === "address"){
      av = a.branches[0].address; bv = b.branches[0].address;
    } else if(state.sortKey === "phone"){
      av = a.branches[0].phone || ""; bv = b.branches[0].phone || "";
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
    body.innerHTML = '<tr class="empty-row"><td colspan="5">Không tìm thấy quán nào.</td></tr>';
  } else {
    rows.forEach(r => {
      const tr = document.createElement("tr");
      const branchItems = r.branches.map(b => `
        <li>
          ${b.label ? `<span class="branch-label">${b.label}</span>` : ""}
          <span class="branch-addr">${b.address}</span>
        </li>
      `).join("");
      const hoursItems = r.branches.map(b => `
        <li>
          ${b.label ? `<span class="branch-label">${b.label}</span>` : ""}
          <span class="branch-hours">${b.hours}</span>
        </li>
      `).join("");
      const phoneItems = r.branches.map(b => `
        <li>
          ${b.label ? `<span class="branch-label">${b.label}</span>` : ""}
          <span class="branch-hours">${b.phone || "—"}</span>
        </li>
      `).join("");
      tr.innerHTML = `
        <td class="col-name">
          <span class="name-vn">${r.name}</span>
        </td>
        <td><span class="badge rounded-pill ${r.badge}">${r.category}</span></td>
        <td><ul class="branch-list">${branchItems}</ul></td>
        <td><ul class="branch-list">${hoursItems}</ul></td>
        <td><ul class="branch-list">${phoneItems}</ul></td>
        <td class="note">${r.note}</td>
      `;
      body.appendChild(tr);
    });
  }

  document.getElementById("count-visible").textContent = rows.length;
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

render();