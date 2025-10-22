const CONFIG = {
  TOAST_DURATION: 3000,
  ANIMATION_DURATION: 0.3,
};

const state = {
  selectedPages: new Set(),
  isDarkMode: false,
};

const elements = {
  html: document.documentElement,
  themeToggle: null,
  sunIcon: null,
  moonIcon: null,
  selectAllCheckbox: null,
  pageList: null,
  pageCheckboxes: null,
  doneBtn: null,
  toastContainer: null,
};

function toggleTheme() {
  state.isDarkMode = !state.isDarkMode;

  if (state.isDarkMode) {
    elements.html.classList.add("dark");
    elements.sunIcon.classList.remove("hidden");
    elements.moonIcon.classList.add("hidden");
    console.log("Dark mode enabled");
  } else {
    elements.html.classList.remove("dark");
    elements.sunIcon.classList.add("hidden");
    elements.moonIcon.classList.remove("hidden");
    console.log("Light mode enabled");
  }
}

function initTheme() {
  elements.html.classList.remove("dark");
  state.isDarkMode = false;
  elements.sunIcon.classList.add("hidden");
  elements.moonIcon.classList.remove("hidden");
}

function handleSelectAll(e) {
  const isChecked = e.target.checked;

  elements.pageCheckboxes.forEach((checkbox) => {
    checkbox.checked = isChecked;
    const pageId = checkbox.dataset.pageCheckbox;

    if (isChecked) {
      state.selectedPages.add(pageId);
    } else {
      state.selectedPages.delete(pageId);
    }
  });
}

function handlePageToggle(pageId, checkbox) {
  if (checkbox.checked) {
    state.selectedPages.add(pageId);
  } else {
    state.selectedPages.delete(pageId);
  }

  updateSelectAllState();
}

function updateSelectAllState() {
  const totalPages = elements.pageCheckboxes.length;
  const selectedCount = state.selectedPages.size;

  if (selectedCount === 0) {
    elements.selectAllCheckbox.checked = false;
    elements.selectAllCheckbox.indeterminate = false;
  } else if (selectedCount === totalPages) {
    elements.selectAllCheckbox.checked = true;
    elements.selectAllCheckbox.indeterminate = false;
  } else {
    elements.selectAllCheckbox.checked = false;
    elements.selectAllCheckbox.indeterminate = true;
  }
}

function handlePageItemClick(e) {
  if (e.target.classList.contains("checkbox")) return;

  const listItem = e.currentTarget;
  const pageId = listItem.dataset.pageId;
  const checkbox = listItem.querySelector("[data-page-checkbox]");

  checkbox.checked = !checkbox.checked;
  handlePageToggle(pageId, checkbox);
}

function showToast(message) {
  const existingToast = elements.toastContainer.querySelector(".toast");
  if (existingToast) {
    gsap.to(existingToast, {
      opacity: 0,
      y: 20,
      duration: 0.2,
      onComplete: () => existingToast.remove(),
    });
  }

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `
    <svg class="toast-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
    <div class="toast-message">${message}</div>
  `;

  gsap.set(toast, { opacity: 0, y: 20 });
  elements.toastContainer.appendChild(toast);

  gsap.to(toast, {
    opacity: 1,
    y: 0,
    duration: CONFIG.ANIMATION_DURATION,
    ease: "power2.out",
  });

  setTimeout(() => {
    gsap.to(toast, {
      opacity: 0,
      y: 20,
      duration: CONFIG.ANIMATION_DURATION,
      ease: "power2.in",
      onComplete: () => toast.remove(),
    });
  }, CONFIG.TOAST_DURATION);
}

function handleDone() {
  const count = state.selectedPages.size;
  const message =
    count === 1 ? `${count} page selected` : `${count} pages selected`;

  showToast(message);
}

function initEventListeners() {
  elements.themeToggle.addEventListener("click", toggleTheme);
  elements.selectAllCheckbox.addEventListener("change", handleSelectAll);
  elements.pageCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", (e) => {
      const pageId = e.target.dataset.pageCheckbox;
      handlePageToggle(pageId, e.target);
    });
  });

  const pageItems = elements.pageList.querySelectorAll(".page-item");
  pageItems.forEach((item) => {
    item.addEventListener("click", handlePageItemClick);
  });

  elements.doneBtn.addEventListener("click", handleDone);
}

function initElements() {
  elements.themeToggle = document.getElementById("theme-toggle");
  elements.sunIcon = document.getElementById("sun-icon");
  elements.moonIcon = document.getElementById("moon-icon");
  elements.selectAllCheckbox = document.querySelector("[data-select-all]");
  elements.pageList = document.getElementById("page-list");
  elements.pageCheckboxes = document.querySelectorAll("[data-page-checkbox]");
  elements.doneBtn = document.getElementById("done-btn");
  elements.toastContainer = document.getElementById("toast-container");
}

function init() {
  initElements();
  initTheme();
  initEventListeners();
}

document.addEventListener("DOMContentLoaded", init);
