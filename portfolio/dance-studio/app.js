/* Flow — студія танцю: розклад, фільтри, меню, акордеон, форма пробного. */
"use strict";

/* ---------- Дані розкладу ---------- */

const DAY_NAMES = ["Понеділок", "Вівторок", "Середа", "Четвер", "Пʼятниця", "Субота", "Неділя"];
const DAY_SHORT = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"];

const STYLE_COLORS = {
  "Hip-Hop": "#ec4899",
  "Contemporary": "#8b5cf6",
  "High Heels": "#f472b6",
  "Breaking": "#d946ef",
  "Kids 6–10": "#e2e8f0",
};

const SCHEDULE = [
  { day: 1, time: "18:00", style: "Hip-Hop", level: "Початківці", trainer: "Даша Коваль" },
  { day: 1, time: "19:30", style: "Contemporary", level: "Всі рівні", trainer: "Соломія Ткач" },
  { day: 1, time: "21:00", style: "High Heels", level: "Продовжуючі", trainer: "Ліля Романюк" },
  { day: 2, time: "17:00", style: "Kids 6–10", level: "Початківці", trainer: "Даша Коваль" },
  { day: 2, time: "19:00", style: "Breaking", level: "Початківці", trainer: "Артем Білий" },
  { day: 2, time: "20:30", style: "Hip-Hop", level: "Продовжуючі", trainer: "Даша Коваль" },
  { day: 3, time: "18:00", style: "Contemporary", level: "Початківці", trainer: "Соломія Ткач" },
  { day: 3, time: "19:30", style: "High Heels", level: "Початківці", trainer: "Ліля Романюк" },
  { day: 3, time: "21:00", style: "Hip-Hop", level: "Всі рівні", trainer: "Даша Коваль" },
  { day: 4, time: "17:00", style: "Kids 6–10", level: "Всі рівні", trainer: "Соломія Ткач" },
  { day: 4, time: "19:00", style: "Breaking", level: "Продовжуючі", trainer: "Артем Білий" },
  { day: 4, time: "20:30", style: "Contemporary", level: "Продовжуючі", trainer: "Соломія Ткач" },
  { day: 5, time: "18:00", style: "Hip-Hop", level: "Початківці", trainer: "Даша Коваль" },
  { day: 5, time: "19:30", style: "Breaking", level: "Всі рівні", trainer: "Артем Білий" },
  { day: 5, time: "21:00", style: "High Heels", level: "Продовжуючі", trainer: "Ліля Романюк" },
  { day: 6, time: "11:00", style: "Kids 6–10", level: "Початківці", trainer: "Даша Коваль" },
  { day: 6, time: "12:30", style: "Hip-Hop", level: "Всі рівні", trainer: "Даша Коваль" },
  { day: 6, time: "14:00", style: "Contemporary", level: "Всі рівні", trainer: "Соломія Ткач" },
  { day: 6, time: "15:30", style: "High Heels", level: "Початківці", trainer: "Ліля Романюк" },
  { day: 7, time: "12:00", style: "Breaking", level: "Початківці", trainer: "Артем Білий" },
  { day: 7, time: "13:30", style: "Contemporary", level: "Продовжуючі", trainer: "Соломія Ткач" },
];

const PHONE_RE = /^\+?[\d\s()-]{10,}$/;

/* ---------- Розклад ---------- */

function classWord(n) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if ((mod10 === 1 && mod100 !== 11) || (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14))) {
    return "заняття";
  }
  return "занять";
}

function renderSchedule(styleFilter = "all", levelFilter = "all") {
  const grid = document.getElementById("schedule-grid");
  if (!grid) return;

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

function initScheduleFilters() {
  const styleSel = document.getElementById("filter-style");
  const levelSel = document.getElementById("filter-level");
  if (!styleSel || !levelSel) return;

  const apply = () => renderSchedule(styleSel.value, levelSel.value);
  styleSel.addEventListener("change", apply);
  levelSel.addEventListener("change", apply);
}

/* ---------- Мобільне меню ---------- */

function initMenu() {
  const btn = document.getElementById("menu-btn");
  const menu = document.getElementById("mobile-menu");
  if (!btn || !menu) return;

  const setOpen = (open) => {
    btn.setAttribute("aria-expanded", String(open));
    btn.setAttribute("aria-label", open ? "Закрити меню" : "Відкрити меню");
    menu.classList.toggle("hidden", !open);
    btn.querySelector(".icon-burger").classList.toggle("hidden", open);
    btn.querySelector(".icon-close").classList.toggle("hidden", !open);
  };

  btn.addEventListener("click", () => setOpen(btn.getAttribute("aria-expanded") !== "true"));
  menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setOpen(false)));
}

/* ---------- FAQ-акордеон ---------- */

function initAccordion() {
  const items = Array.from(document.querySelectorAll(".faq-item"));
  items.forEach((item) => {
    const btn = item.querySelector(".faq-btn");
    if (!btn) return;
    btn.addEventListener("click", () => {
      const willOpen = !item.classList.contains("open");
      items.forEach((other) => {
        const isTarget = other === item && willOpen;
        other.classList.toggle("open", isTarget);
        other.querySelector(".faq-btn").setAttribute("aria-expanded", String(isTarget));
      });
    });
  });
}

/* ---------- Форма пробного заняття ---------- */

function setFieldError(field, message) {
  const errEl = document.getElementById(field.id + "-error");
  field.setAttribute("aria-invalid", message ? "true" : "false");
  if (errEl) {
    errEl.textContent = message || "";
    errEl.hidden = !message;
  }
  return !message;
}

function initTrialForm() {
  const form = document.getElementById("trial-form");
  if (!form) return;

  const styleSel = document.getElementById("trial-style");
  const nameIn = document.getElementById("trial-name");
  const phoneIn = document.getElementById("trial-phone");
  const success = document.getElementById("trial-success");
  const successStyle = document.getElementById("trial-success-style");
  const again = document.getElementById("trial-again");

  const clearOnInput = (field, evt) =>
    field.addEventListener(evt, () => setFieldError(field, ""));
  clearOnInput(styleSel, "change");
  clearOnInput(nameIn, "input");
  clearOnInput(phoneIn, "input");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

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
  });

  if (again) {
    again.addEventListener("click", () => {
      form.reset();
      [styleSel, nameIn, phoneIn].forEach((f) => setFieldError(f, ""));
      success.hidden = true;
      form.hidden = false;
      styleSel.focus();
    });
  }
}

/* ---------- Клік по напрямку → передвибір у формі ---------- */

function initStyleLinks() {
  const styleSel = document.getElementById("trial-style");
  const form = document.getElementById("trial-form");
  const success = document.getElementById("trial-success");
  if (!styleSel) return;

  document.querySelectorAll("[data-style-link]").forEach((link) => {
    link.addEventListener("click", () => {
      if (form && form.hidden && success) {
        success.hidden = true;
        form.hidden = false;
      }
      styleSel.value = link.dataset.styleLink;
      setFieldError(styleSel, "");
    });
  });
}

/* ---------- Старт ---------- */

document.addEventListener("DOMContentLoaded", () => {
  renderSchedule();
  initScheduleFilters();
  initMenu();
  initAccordion();
  initTrialForm();
  initStyleLinks();
});
