/* Flow — студія танцю: розклад, фільтри, меню, акордеон, форма пробного.
   Дані розкладу підключаються окремим файлом assets/js/schedule-data.js. */
"use strict";

/* Стан UI тримає активні фільтри розкладу — усе інше читається з DOM. */
const state = {
  styleFilter: "all",
  levelFilter: "all",
};

function classWord(n) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if ((mod10 === 1 && mod100 !== 11) || (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14))) {
    return "заняття";
  }
  return "занять";
}

function renderSchedule(appState) {
  const grid = document.getElementById("schedule-grid");
  if (!grid) return;

  const { styleFilter, levelFilter } = appState;
  let total = 0;

  const columns = DAY_NAMES.map((name, i) => {
    const items = SCHEDULE
      .filter((s) =>
        s.day === i + 1 &&
        (styleFilter === "all" || s.style === styleFilter) &&
        (levelFilter === "all" || s.level === levelFilter))
      .sort((a, b) => a.time.localeCompare(b.time));

    total += items.length;

    const cards = items.length
      ? items.map((s) => `
        <article class="class-card" style="--c:${STYLE_COLORS[s.style]}">
          <div class="flex items-baseline justify-between gap-2">
            <time class="class-time">${s.time}</time>
            <span class="class-level">${s.level}</span>
          </div>
          <h4 class="class-style">${s.style}</h4>
          <p class="class-trainer">${s.trainer}</p>
        </article>`).join("")
      : `<p class="day-empty" title="Немає занять">—</p>`;

    return `
      <section class="day-col" aria-label="${name}">
        <h3 class="day-head"><span class="lg:hidden">${name}</span><span class="hidden lg:inline">${DAY_SHORT[i]}</span></h3>
        ${cards}
      </section>`;
  });

  grid.innerHTML = columns.join("");

  const countEl = document.getElementById("schedule-count");
  if (countEl) {
    countEl.textContent = total > 0
      ? `Показано: ${total} ${classWord(total)} на тиждень`
      : "За цими фільтрами занять немає — спробуйте інше поєднання";
  }
}

function setFieldError(field, message) {
  const errEl = document.getElementById(field.id + "-error");
  field.setAttribute("aria-invalid", message ? "true" : "false");
  if (errEl) {
    errEl.textContent = message || "";
    errEl.hidden = !message;
  }
  return !message;
}

function setMenuOpen(btn, menu, open) {
  btn.setAttribute("aria-expanded", String(open));
  btn.setAttribute("aria-label", open ? "Закрити меню" : "Відкрити меню");
  menu.classList.toggle("hidden", !open);
  const iconBurger = btn.querySelector(".icon-burger");
  if (iconBurger) iconBurger.classList.toggle("hidden", open);
  const iconClose = btn.querySelector(".icon-close");
  if (iconClose) iconClose.classList.toggle("hidden", !open);
}

function handleMenuToggle() {
  const btn = document.getElementById("menu-btn");
  const menu = document.getElementById("mobile-menu");
  if (!btn || !menu) return;
  setMenuOpen(btn, menu, btn.getAttribute("aria-expanded") !== "true");
}

function handleMenuLinkClick(target) {
  const menu = document.getElementById("mobile-menu");
  const btn = document.getElementById("menu-btn");
  if (!menu || !btn || !menu.contains(target)) return;
  if (target.tagName === "A") setMenuOpen(btn, menu, false);
}

function handleAccordionToggle(trigger) {
  const item = trigger.closest(".faq-item");
  if (!item) return;
  const items = Array.from(document.querySelectorAll(".faq-item"));
  const willOpen = !item.classList.contains("open");
  items.forEach((other) => {
    const isTarget = other === item && willOpen;
    other.classList.toggle("open", isTarget);
    other.querySelector(".faq-btn").setAttribute("aria-expanded", String(isTarget));
  });
}

function handleScheduleFilterChange() {
  const styleSel = document.getElementById("filter-style");
  const levelSel = document.getElementById("filter-level");
  if (!styleSel || !levelSel) return;
  state.styleFilter = styleSel.value;
  state.levelFilter = levelSel.value;
  renderSchedule(state);
}

/* Застосовує стиль, переданий у URL (?style=Hip-Hop або #Hip-Hop), до
   фільтра розкладу — так посилання з index.html/classes.html одразу
   показують потрібний напрямок. */
function applyStyleFromUrl() {
  const styleSel = document.getElementById("filter-style");
  if (!styleSel) return;

  const params = new URLSearchParams(window.location.search);
  const fromQuery = params.get("style");
  const fromHash = window.location.hash ? decodeURIComponent(window.location.hash.slice(1)) : "";
  const requested = fromQuery || fromHash;
  if (!requested) return;

  const match = Array.from(styleSel.options).find((opt) => opt.value === requested);
  if (!match) return;

  styleSel.value = requested;
  state.styleFilter = requested;
}

/* Застосовує стиль, переданий у URL (?style=Hip-Hop), до форми запису на
   пробне заняття — щоб посилання «Обрати» з index.html/classes.html одразу
   підставляли напрямок. */
function applyStyleToTrialForm() {
  const styleSel = document.getElementById("trial-style");
  if (!styleSel) return;

  const params = new URLSearchParams(window.location.search);
  const requested = params.get("style");
  if (!requested) return;

  const match = Array.from(styleSel.options).find((opt) => opt.value === requested);
  if (!match) return;

  styleSel.value = requested;
}

function handleTrialSubmit(e) {
  e.preventDefault();
  const form = e.target;

  const styleSel = document.getElementById("trial-style");
  const nameIn = document.getElementById("trial-name");
  const phoneIn = document.getElementById("trial-phone");
  const success = document.getElementById("trial-success");
  const successStyle = document.getElementById("trial-success-style");

  const okStyle = setFieldError(styleSel, styleSel.value ? "" : "Оберіть напрямок зі списку");
  const okName = setFieldError(nameIn, nameIn.value.trim().length >= 2 ? "" : "Вкажіть імʼя — щонайменше 2 символи");
  const okPhone = setFieldError(phoneIn, PHONE_RE.test(phoneIn.value.trim()) ? "" : "Вкажіть телефон у форматі +380 (XX) XXX-XX-XX");

  if (!okStyle) { styleSel.focus(); return; }
  if (!okName) { nameIn.focus(); return; }
  if (!okPhone) { phoneIn.focus(); return; }

  if (successStyle) successStyle.textContent = styleSel.value;
  form.hidden = true;
  success.hidden = false;
  success.focus();
}

function handleTrialAgain() {
  const form = document.getElementById("trial-form");
  const success = document.getElementById("trial-success");
  const styleSel = document.getElementById("trial-style");
  const nameIn = document.getElementById("trial-name");
  const phoneIn = document.getElementById("trial-phone");
  if (!form || !success) return;

  form.reset();
  [styleSel, nameIn, phoneIn].forEach((f) => setFieldError(f, ""));
  success.hidden = true;
  form.hidden = false;
  styleSel.focus();
}

function handleFieldClear(field) {
  setFieldError(field, "");
}

/* Єдиний делегований обробник кліків: кожен інтерактивний елемент несе
   data-action, диспетчер вирішує, яку дію виконати. */
function onDocumentClick(e) {
  const actionEl = e.target.closest("[data-action]");
  if (actionEl) {
    const action = actionEl.dataset.action;
    if (action === "menu") return handleMenuToggle();
    if (action === "accordion") return handleAccordionToggle(actionEl);
    if (action === "trial-again") return handleTrialAgain();
  }

  handleMenuLinkClick(e.target);
}

function onDocumentChange(e) {
  if (e.target.id === "filter-style" || e.target.id === "filter-level") {
    handleScheduleFilterChange();
    return;
  }
  if (e.target.id === "trial-style") {
    handleFieldClear(e.target);
  }
}

function onDocumentInput(e) {
  if (e.target.id === "trial-name" || e.target.id === "trial-phone") {
    handleFieldClear(e.target);
  }
}

function onDocumentSubmit(e) {
  if (e.target.id === "trial-form") handleTrialSubmit(e);
}

document.addEventListener("DOMContentLoaded", () => {
  applyStyleFromUrl();
  renderSchedule(state);
  applyStyleToTrialForm();
});

document.addEventListener("click", onDocumentClick);
document.addEventListener("change", onDocumentChange);
document.addEventListener("input", onDocumentInput);
document.addEventListener("submit", onDocumentSubmit);
