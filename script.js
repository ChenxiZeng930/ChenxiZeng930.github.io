const notesList = document.querySelector("#notesList");
const searchInput = document.querySelector("#searchInput");
const categorySelect = document.querySelector("#categorySelect");

let notes = [];

const formatSize = (sizeMB) => {
  if (!Number.isFinite(Number(sizeMB))) return "未知大小";
  if (Number(sizeMB) >= 1024) return `${(Number(sizeMB) / 1024).toFixed(2)} GB`;
  return `${Number(sizeMB).toFixed(1)} MB`;
};

const renderNotes = () => {
  const query = searchInput.value.trim().toLowerCase();
  const category = categorySelect.value;
  const filtered = notes.filter((note) => {
    const matchesQuery =
      !query ||
      note.title.toLowerCase().includes(query) ||
      note.category.toLowerCase().includes(query) ||
      note.sourceName.toLowerCase().includes(query);
    const matchesCategory = category === "all" || note.category === category;
    return matchesQuery && matchesCategory;
  });

  if (filtered.length === 0) {
    notesList.innerHTML = '<div class="empty">没有找到匹配的笔记。</div>';
    return;
  }

  notesList.innerHTML = filtered
    .slice(0, 120)
    .map((note) => {
      const previewButton = note.previewUrl
        ? `<a class="button secondary" href="${note.previewUrl}">在线预览</a>`
        : '<span class="button disabled">待导出预览</span>';
      const downloadButton = note.downloadUrl
        ? `<a class="button primary" href="${note.downloadUrl}">下载 PDF</a>`
        : '<span class="button disabled">待上传 PDF</span>';

      return `
        <article class="note-card">
          <div>
            <h3>${note.title}</h3>
            <div class="note-meta">
              <span>${note.category}</span>
              <span>${formatSize(note.sizeMB)}</span>
              <span>${note.status === "pending-pdf-export" ? "等待 PDF 导出" : note.status}</span>
            </div>
          </div>
          <div class="note-actions">
            ${previewButton}
            ${downloadButton}
          </div>
        </article>
      `;
    })
    .join("");

  if (filtered.length > 120) {
    notesList.insertAdjacentHTML(
      "beforeend",
      `<div class="empty">当前显示前 120 条结果，请继续输入关键词缩小范围。共匹配 ${filtered.length} 条。</div>`
    );
  }
};

const initCategories = () => {
  const categories = [...new Set(notes.map((note) => note.category))].sort((a, b) =>
    a.localeCompare(b, "zh-CN")
  );
  categorySelect.insertAdjacentHTML(
    "beforeend",
    categories.map((category) => `<option value="${category}">${category}</option>`).join("")
  );
};

const initSummary = async () => {
  const response = await fetch("data/notes-summary.json");
  const summary = await response.json();
  document.querySelector("#totalCount").textContent = summary.totalCount;
  document.querySelector("#publicCount").textContent = summary.publicCount;
  document.querySelector("#excludedCount").textContent = summary.excludedCount;
  document.querySelector("#totalSize").textContent = `${summary.totalSizeGB} GB`;
};

const initNotes = async () => {
  try {
    const response = await fetch("data/notes.json");
    notes = await response.json();
    initCategories();
    await initSummary();
    renderNotes();
  } catch (error) {
    notesList.innerHTML =
      '<div class="empty">笔记索引加载失败。请通过本地服务器或 GitHub Pages 打开网站。</div>';
  }
};

searchInput.addEventListener("input", renderNotes);
categorySelect.addEventListener("change", renderNotes);
initNotes();
