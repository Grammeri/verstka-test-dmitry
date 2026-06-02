const navLinks = document.querySelectorAll(".nav-link");
const managerEmailInput = document.querySelector(".manager-field-email input");
const managerPrefixInput = document.querySelector(".manager-field-prefix input");
const managerAddButton = document.querySelector(".manager-add-btn");
const managerRowActions = document.querySelector(".manager-row-actions");
const managersTableBody = document.querySelector(".managers-table tbody");
const managerSelect = document.querySelector(".manager-select");
const managerSelectButton = managerSelect?.querySelector(".manager-select-btn");
const managerSelectValue = managerSelect?.querySelector(".manager-select-value");
const managerSelectClear = managerSelect?.querySelector(".manager-select-clear");
const managerSelectMenu = managerSelect?.querySelector(".manager-select-menu");
const svgNS = "http://www.w3.org/2000/svg";
const managerSelectDefaultLabel = managerSelectValue?.textContent.trim() || "Выбрать менеджера";

const managersStorageKey = "journalManagers";

const defaultManagers = [
  { id: "23", email: "111nat@mail.ru", prefix: "Z" },
  { id: "24", email: "manager-bus@mail.ru", prefix: "Бус" },
  { id: "25", email: "manager-kas@mail.ru", prefix: "Кас" },
  { id: "26", email: "manager-n@mail.ru", prefix: "Н" },
  { id: "27", email: "manager-om@mail.ru", prefix: "Ом" },
  { id: "28", email: "manager-p@mail.ru", prefix: "П" },
  { id: "29", email: "manager-sv@mail.ru", prefix: "Св" },
  { id: "30", email: "manager-yu@mail.ru", prefix: "Ю" },
];

const loadManagers = () => {
  try {
    const savedManagers = JSON.parse(localStorage.getItem(managersStorageKey));

    if (Array.isArray(savedManagers)) {
      return savedManagers;
    }
  } catch {
    return [...defaultManagers];
  }

  return [...defaultManagers];
};

const saveManagers = () => {
  localStorage.setItem(managersStorageKey, JSON.stringify(managers));
};

const managers = loadManagers();

const iconCodes = {
  managers: [0xf105, 0xf106],
  resume: [0xf103, 0xf104],
  companies: [0xf10b, 0xf10c],
  import: [0xf109, 0xf10a],
  ads: [0xf10d, 0xf10e],
  letters: [0xf107, 0xf108],
  settings: [0xf101, 0xf102],
};
const navTextWidths = {
  managers: 240,
  resume: 87,
  companies: 110,
  import: 76,
  ads: 145,
  letters: 152,
  settings: 189,
};
function createSvgText(text, options = {}) {
  const svg = document.createElementNS(svgNS, "svg");
  const label = document.createElementNS(svgNS, "text");
  const width = options.width || 260;
  const height = options.height || 30;
  const fontSize = options.size || 20;

  svg.classList.add("svg-label");
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.setAttribute("preserveAspectRatio", "xMinYMid meet");
  svg.setAttribute("aria-hidden", "true");
  svg.style.overflow = options.overflow || "visible";

  label.setAttribute("x", options.x ?? 0);
  label.setAttribute("y", options.y ?? Math.round(fontSize * 0.82));

  if (options.anchor) {
    label.setAttribute("text-anchor", options.anchor);
  }

  label.setAttribute("fill", options.color || "currentColor");
  label.setAttribute("font-family", options.family || "Roboto, Arial, sans-serif");
  label.setAttribute("font-size", fontSize);
  label.setAttribute("font-weight", options.weight || 300);

  if (options.wordSpacing) {
    label.setAttribute("word-spacing", options.wordSpacing);
  }

  label.textContent = text;
  svg.append(label);

  return svg;
}
function renderElementText(element, options = {}) {
  const text = options.text || element.dataset.text || element.textContent.trim();

  element.dataset.text = text;
  element.setAttribute("aria-label", text);
  element.textContent = "";
  element.append(createSvgText(text, options));
}
function renderIcon(link, hovered = false) {
  const icon = link.querySelector(".icon");
  const tab = link.dataset.tab;
  const isResume = tab === "resume";

  if (!icon || !iconCodes[tab]) {
    return;
  }

  icon.textContent = "";
  icon.append(createSvgText(String.fromCharCode(iconCodes[tab][hovered ? 1 : 0]), {
    family: "vsevn-icons",
    size: 34,
    width: 44,
    height: 44,
    x: isResume ? 12 : 22,
    y: 40,
    anchor: "middle",
  }));
}

function renderNavText(link) {
  const text = link.querySelector(".nav-text");

  if (!text) {
    return;
  }
  renderElementText(text, {
    size: 21,
    width: navTextWidths[link.dataset.tab] || 180,
    height: 24,
    x: 0,
    y: 19,
    wordSpacing: link.dataset.tab === "letters" ? 2 : link.dataset.tab === "settings" ? 4 : 0,
    weight: link.classList.contains("active") ? 400 : 300,
  });
}

function getNextManagerId() {
  const ids = managers.map((manager) => Number(manager.id)).filter(Number.isFinite);

  return String((ids.length ? Math.max(...ids) : 22) + 1);
}

function updateManagersCardHeight() {
  const card = document.querySelector(".import-card");

  if (!card) {
    return;
  }

  const baseHeight = 39.16667;
  const bottomGap = 1.5625;

  const tableTop = 11.5625;
  const tableHeadHeight = 3.125;
  const tableRowHeight = 2.55208;
  const tableHeight = tableTop + tableHeadHeight + managers.length * tableRowHeight + bottomGap;

  const selectTop = 14.6875;
  const controlHeight = 2.60417;
  const selectHeight = selectTop + controlHeight + managers.length * controlHeight + bottomGap;

  card.style.height = `${Math.max(baseHeight, tableHeight, selectHeight)}vw`;
}

function getSortedManagers() {
  return [...managers].sort((firstManager, secondManager) =>
    firstManager.prefix.localeCompare(secondManager.prefix, "ru", { sensitivity: "base" })
  );
}

function renderManagersData() {
  const tableBody = document.querySelector(".managers-table tbody");
  const sortedManagers = getSortedManagers();

  if (tableBody) {
    tableBody.innerHTML = sortedManagers.map((manager, index) => `
      <tr>
        <td>${index + 1}</td>
        <td>${manager.id}</td>
        <td class="manager-editable-cell" data-id="${manager.id}" data-field="email">${manager.email}</td>
        <td class="manager-editable-cell" data-id="${manager.id}" data-field="prefix">${manager.prefix}</td>
      </tr>
    `).join("");
  }

  if (managerSelectMenu) {
    managerSelectMenu.innerHTML = sortedManagers.map((manager) => `
      <li role="option" data-value="${manager.prefix}" aria-selected="false">${manager.prefix}</li>
    `).join("");
  }

  updateManagersCardHeight();

  if (managerRowActions) {
    managerRowActions.innerHTML = sortedManagers.map((manager) => `
      <button class="manager-row-remove-btn" type="button" data-id="${manager.id}" aria-label="Удалить менеджера ${manager.prefix}"></button>
    `).join("");
  }
}
function renderManagersPageText() {
  const managerFormTitle = document.querySelector(".manager-form-title");

  if (managerFormTitle) {
    renderElementText(managerFormTitle, {
      size: 21,
      width: 340,
      height: 28,
      y: 20,
      x: 0,
      weight: 300,
      color: "#62560e",
    });
  }

  document.querySelectorAll(".manager-field span").forEach((element) => {
    const field = element.closest(".manager-field");
    const isPrefix = field?.classList.contains("manager-field-prefix");

    renderElementText(element, {
      text: element.textContent.trim(),
      size: 21.6,
      width: isPrefix ? 130 : 90,
      height: 26,
      y: 15,
      weight: 200,
      color: "#62560e",
    });
  });

  document.querySelectorAll(".managers-table th, .managers-table td").forEach((cell) => {
    const text = cell.textContent.trim();
    const columnIndex = cell.cellIndex;
    const widths = [48, 48, 330, 120];

    const isHead = cell.tagName === "TH";
    const isBody = cell.tagName === "TD";

    let textX = 0;
    let textY = 20;
    let textSize = 21;
    if (isHead && columnIndex === 0) {
      textX = 6;
      textY = 20;
      textSize = 21;
    }

    if (isHead && columnIndex === 1) {
      textX = 7;
      textY = 18;
      textSize = 21;
    }

    if (isBody && columnIndex === 0) {
      textX = 5;
      textY = 19;
      textSize = 21;
    }

    if (isBody && columnIndex === 1) {
      textX = 2;
      textY = 19;
      textSize = 21;
    }
    if (columnIndex === 3) {
      textSize = 23;
    }

    renderElementText(cell, {
      text,
      size: textSize,
      width: widths[columnIndex] || 160,
      height: 26,
      overflow: "hidden",
      x: textX,
      y: textY,
      weight: 300,
      color: columnIndex === 1 ? "#0087fc" : "#62560e",
    });
  });

  document.querySelectorAll(".manager-select-menu li").forEach((item) => {
    renderElementText(item, {
      text: item.dataset.value || item.textContent.trim(),
      size: 21,
      width: 80,
      height: 26,
      overflow: "hidden",
      y: 20,
      weight: 300,
      color: "currentColor",
    });
  });
}

function renderStaticText() {
  const title = document.querySelector("#managers-title");

  if (title) {
    renderElementText(title, {
      size: 21,
      width: 240,
      height: 29,
      y: 22,
      weight: 400,
      color: "#62560E",
    });
  }

  renderManagersData();
  renderManagersPageText();

  navLinks.forEach((link) => {
    renderIcon(link);
    renderNavText(link);
  });
}

renderStaticText();

function setManagerSelectOpen(isOpen) {
  if (!managerSelect || !managerSelectButton || !managerSelectMenu) {
    return;
  }

  managerSelect.classList.toggle("manager-select--open", isOpen);
  managerSelectButton.setAttribute("aria-expanded", String(isOpen));
  managerSelectMenu.hidden = !isOpen;
}

function renderManagerSelectValue(value = "") {
  if (!managerSelectButton || !managerSelectValue) {
    return;
  }
  const text = value || managerSelectDefaultLabel;
  const isDefault = !value;
  const displayText = isDefault ? text.toUpperCase() : text;

  managerSelectValue.textContent = "";
  managerSelectValue.append(createSvgText(displayText, {
    size: isDefault ? 21.6 : 21,
    width: isDefault ? 232 : 80,
    height: 26,
    overflow: "hidden",
    x: isDefault ? -1 : 2,
    y: isDefault ? 19 : 18,
    weight: 300,
    color: "currentColor",
  }));

  managerSelectButton.setAttribute("aria-label", text);
}

function setManagerSelectValue(value = "") {
  if (!managerSelect || !managerSelectValue || !managerSelectClear || !managerSelectMenu) {
    return;
  }

  const hasValue = Boolean(value);

  renderManagerSelectValue(value);
  managerSelect.classList.toggle("manager-select--selected", hasValue);
  managerSelectClear.hidden = !hasValue;

  managerSelectMenu.querySelectorAll("li").forEach((item) => {
    const isSelected = item.dataset.value === value;

    item.classList.toggle("is-active", isSelected);
    item.setAttribute("aria-selected", String(isSelected));
  });
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function showInputError(input, message) {
  input.setCustomValidity(message);
  input.reportValidity();
  input.focus();

  input.addEventListener("input", () => {
    input.setCustomValidity("");
  }, { once: true });
}

if (managerAddButton && managerEmailInput && managerPrefixInput) {
  managerAddButton.addEventListener("click", () => {
    const email = managerEmailInput.value.trim();
    const prefix = managerPrefixInput.value.trim();

    managerEmailInput.setCustomValidity("");
    managerPrefixInput.setCustomValidity("");

    if (!email) {
      showInputError(managerEmailInput, "Заполните Email");
      return;
    }

    if (!isValidEmail(email)) {
      showInputError(managerEmailInput, "Введите корректный Email");
      return;
    }

    if (!prefix) {
      showInputError(managerPrefixInput, "Заполните префикс");
      return;
    }

    managers.push({
      id: getNextManagerId(),
      email,
      prefix,
    });

    saveManagers();

    managerEmailInput.value = "";
    managerPrefixInput.value = "";

    renderManagersData();
    renderManagersPageText();
    setManagerSelectValue(prefix);
    setManagerSelectOpen(false);
  });
}
if (managerRowActions) {
  managerRowActions.addEventListener("click", (event) => {
    const button = event.target.closest(".manager-row-remove-btn");

    if (!button) {
      return;
    }

    const managerIndex = managers.findIndex((manager) => manager.id === button.dataset.id);

    if (managerIndex === -1) {
      return;
    }

    managers.splice(managerIndex, 1);
    saveManagers();

    renderManagersData();
    renderManagersPageText();
    setManagerSelectValue("");
    setManagerSelectOpen(false);
  });
}
function startManagerCellEdit(cell) {
  const manager = managers.find((item) => item.id === cell.dataset.id);
  const field = cell.dataset.field;

  if (!manager || !field || cell.querySelector("input")) {
    return;
  }

  const oldValue = manager[field];
  const input = document.createElement("input");

  input.className = "manager-table-edit-input";
  input.value = oldValue;
  input.type = field === "email" ? "email" : "text";
  input.setAttribute("aria-label", field === "email" ? "Email" : "Префикс");
  input.setAttribute("autocomplete", "off");
  input.setAttribute("spellcheck", "false");
  input.setAttribute("autocorrect", "off");
  input.setAttribute("autocapitalize", "off");

  cell.textContent = "";
  cell.append(input);
  input.focus();
  input.select();

  const finishEdit = () => {
    const newValue = input.value.trim();

    input.setCustomValidity("");

    if (field === "email" && !newValue) {
      showInputError(input, "Заполните Email");
      return false;
    }

    if (field === "email" && !isValidEmail(newValue)) {
      showInputError(input, "Введите корректный Email");
      return false;
    }

    if (field === "prefix" && !newValue) {
      showInputError(input, "Заполните префикс");
      return false;
    }

    manager[field] = newValue;
    saveManagers();

    renderManagersData();
    renderManagersPageText();
    setManagerSelectValue("");
    setManagerSelectOpen(false);

    return true;
  };

  input.addEventListener("blur", () => {
    finishEdit();
  });

  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      finishEdit();
    }

    if (event.key === "Escape") {
      renderManagersData();
      renderManagersPageText();
    }
  });
}

if (managersTableBody) {
  managersTableBody.addEventListener("click", (event) => {
    const cell = event.target.closest(".manager-editable-cell");

    if (!cell) {
      return;
    }

    startManagerCellEdit(cell);
  });
}
if (managerSelect && managerSelectButton && managerSelectValue && managerSelectClear && managerSelectMenu) {
  setManagerSelectOpen(false);
  setManagerSelectValue("");

  managerSelectButton.addEventListener("click", () => {
    setManagerSelectOpen(managerSelectMenu.hidden);
  });

  managerSelectClear.addEventListener("click", (event) => {
    event.stopPropagation();

    setManagerSelectValue("");
    setManagerSelectOpen(false);
    managerSelectButton.focus();
  });

  managerSelectMenu.addEventListener("click", (event) => {
    const item = event.target.closest("li[data-value]");

    if (!item) {
      return;
    }

    setManagerSelectValue(item.dataset.value || "");
    setManagerSelectOpen(false);
    managerSelectButton.focus();
  });

  document.addEventListener("click", (event) => {
    if (!managerSelect.contains(event.target)) {
      setManagerSelectOpen(false);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setManagerSelectOpen(false);
      managerSelectButton.focus();
    }
  });
}

navLinks.forEach((link) => {
  link.addEventListener("mouseenter", () => renderIcon(link, true));
  link.addEventListener("mouseleave", () => renderIcon(link, false));
  link.addEventListener("click", (event) => {
    event.preventDefault();

    navLinks.forEach((item) => {
      item.classList.remove("active");
      renderNavText(item);
    });

    link.classList.add("active");
    renderNavText(link);
  });
});














