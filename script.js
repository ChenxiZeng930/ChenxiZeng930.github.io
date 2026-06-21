const notesList = document.querySelector("#notesList");
const searchInput = document.querySelector("#searchInput");
const categorySelect = document.querySelector("#categorySelect");
const categoryCards = document.querySelector("#categoryCards");
const publicCount = document.querySelector("#publicCount");

let notes = [];

const formatSize = (sizeMB) => {
  if (!Number.isFinite(Number(sizeMB))) return "未知大小";
  if (Number(sizeMB) >= 1024) return `${(Number(sizeMB) / 1024).toFixed(2)} GB`;
  return `${Number(sizeMB).toFixed(1)} MB`;
};

const syncCategoryButtons = () => {
  if (!categoryCards) return;
  categoryCards.querySelectorAll(".category-card").forEach((button) => {
    button.classList.toggle("active", button.dataset.category === categorySelect.value);
  });
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

  syncCategoryButtons();

  if (filtered.length === 0) {
    notesList.innerHTML = '<div class="empty">没有找到匹配的笔记。</div>';
    return;
  }

  notesList.innerHTML = filtered
    .slice(0, 120)
    .map((note) => {
      const previewButton = note.previewUrl
        ? `<a class="button secondary" href="${note.previewUrl}" target="_blank" rel="noreferrer">在线预览</a>`
        : '<span class="button disabled">暂不可预览</span>';
      const downloadButton = note.downloadUrl
        ? `<a class="button primary" href="${note.downloadUrl}" download>下载 PDF</a>`
        : '<span class="button disabled">暂不可下载</span>';

      return `
        <article class="note-card">
          <div>
            <h3>${note.title}</h3>
            <div class="note-meta">
              <span>${note.category}</span>
              <span>${formatSize(note.sizeMB)}</span>
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

  if (categoryCards) {
    categoryCards.innerHTML = [
      `<button class="category-card active" data-category="all">全部<span>${notes.length}</span></button>`,
      ...categories.map((category) => {
        const count = notes.filter((note) => note.category === category).length;
        return `<button class="category-card" data-category="${category}">${category}<span>${count}</span></button>`;
      })
    ].join("");

    categoryCards.querySelectorAll(".category-card").forEach((button) => {
      button.addEventListener("click", () => {
        categorySelect.value = button.dataset.category;
        renderNotes();
      });
    });
  }
};

const initSummary = async () => {
  const response = await fetch("data/notes-summary.json");
  const summary = await response.json();
  if (publicCount) publicCount.textContent = summary.publicCount;
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
      '<div class="empty">笔记索引加载失败。请通过 GitHub Pages 打开网站，或检查 data/notes.json 是否存在。</div>';
  }
};

searchInput.addEventListener("input", renderNotes);
categorySelect.addEventListener("change", renderNotes);
initNotes();
