const menuToggle = document.getElementById("menu-toggle");
const mobileMenu = document.getElementById("mobile-menu");
const links = Array.from(document.querySelectorAll(".nav-link"));
const sections = Array.from(document.querySelectorAll("main section[id]"));
const projectsGrid = document.getElementById("projects-grid");
const projectModal = document.getElementById("project-modal");
const projectModalTitle = document.getElementById("project-modal-title");
const projectModalDescription = document.getElementById("project-modal-description");
const projectModalStack = document.getElementById("project-modal-stack");
const projectModalProcess = document.getElementById("project-modal-process");
const projectModalOpen = document.getElementById("project-modal-open");
const projectModalGithub = document.getElementById("project-modal-github");
const projectModalClose = document.getElementById("project-modal-close");
const contactForm = document.getElementById("contact-form");
const feedback = document.getElementById("form-feedback");
const isEnglish = document.documentElement.lang === "en";
const ASSET_PREFIX = isEnglish ? ".." : ".";

const THEME_KEY = "theme";
const themeToggle = document.getElementById("theme-toggle");
const rootEl = document.documentElement;

function setStoredTheme(theme) {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (error) {
    /* localStorage unavailable (private mode, etc.) */
  }
}

if (themeToggle) {
  themeToggle.setAttribute("aria-pressed", String(rootEl.classList.contains("dark")));
  themeToggle.addEventListener("click", () => {
    const nextIsDark = !rootEl.classList.contains("dark");
    rootEl.classList.toggle("dark", nextIsDark);
    themeToggle.setAttribute("aria-pressed", String(nextIsDark));
    setStoredTheme(nextIsDark ? "dark" : "light");
  });
}

const PROJECTS_UA = [
  {
    slug: "assistant",
    title: "Assistant | Online Task Manager with AI",
    description:
      "Онлайн таск-менеджер із AI-асистентом: задачі, нотатки, розклад і чат в одному інтерфейсі.",
    stack: ["Vite", "Vue", "JavaScript", "Cloudflare Functions", "LocalStorage"],
    process:
      "Спроєктував SPA-структуру, реалізував модулі задач/розкладу/нотаток, додав AI-чат через API-проксі та організував збереження стану в LocalStorage.",
    siteUrl: "./portfolio/Assistant/index.html",
    githubUrl: "https://github.com/Q42fmr/Assistant/",
    hasImages: false
  },
  {
    slug: "plant-shop",
    title: "Verde | Онлайн-магазин рослин",
    description:
      "Інтернет-магазин кімнатних рослин: каталог із фільтрами, пошуком і сортуванням, кошик із збереженням стану та оформлення замовлення.",
    stack: ["Vue 3", "Vite", "JavaScript", "CSS", "LocalStorage"],
    process:
      "Задача: конверсійна вітрина з повним клієнтським флоу покупки. Реалізація: SPA на Vue 3 — реактивні фільтри й кошик, персист у LocalStorage, валідація форми замовлення.",
    siteUrl: "./portfolio/plant-shop/",
    githubUrl: null,
    hasImages: false
  },
  {
    slug: "saas-landing",
    title: "Pulse | SaaS-лендінг",
    description:
      "Лендінг сервісу аналітики продажів для малого бізнесу: звіти в реальному часі, дашборди без коду та форма реєстрації.",
    stack: ["HTML", "Tailwind CSS", "JavaScript"],
    process:
      "Задача: конверсійний SaaS-лендінг із чіткою структурою офера. Реалізація: секції hero/features/pricing/FAQ на Tailwind, анімовані переходи та валідація форми на JS.",
    siteUrl: "./portfolio/saas-landing/",
    githubUrl: null,
    hasImages: false
  },
  {
    slug: "coffee-landing",
    title: "KAVA Roasters | Лендінг кав'ярні",
    description:
      "Лендінг кав'ярні та обсмажувальні: меню напоїв і десертів, історія бренду та онлайн-бронювання столика.",
    stack: ["HTML", "Tailwind CSS", "JavaScript"],
    process:
      "Задача: атмосферний лендінг локального бізнесу з бронюванням. Реалізація: адаптивна верстка на Tailwind, галерея меню та форма бронювання з валідацією.",
    siteUrl: "./portfolio/coffee-landing/",
    githubUrl: null,
    hasImages: false
  },
  {
    slug: "photographer-portfolio",
    title: "Anna Kovalenko | Портфоліо фотографа",
    description:
      "Портфоліо фотографа з галереями за жанрами (весільна, портретна, стріт, пейзажна), лайтбоксом і формою для запису на зйомку.",
    stack: ["HTML", "Tailwind CSS", "JavaScript"],
    process:
      "Задача: візуально мінімалістичне портфоліо з акцентом на фото. Реалізація: адаптивні галереї з фільтрами за жанром, лайтбокс на JS, форма контакту.",
    siteUrl: "./portfolio/photographer-portfolio/",
    githubUrl: null,
    hasImages: false
  },
  {
    slug: "dance-studio",
    title: "Flow | Сайт студії танцю",
    description:
      "Сайт студії танцю з інтерактивним розкладом занять, картками тренерів, тарифами абонементів і формою запису на пробне заняття.",
    stack: ["HTML", "Tailwind CSS", "JavaScript"],
    process:
      "Задача: сайт-каталог послуг із записом на заняття. Реалізація: інтерактивна таблиця розкладу з фільтрами на JS, адаптивна сітка тренерів і тарифів на Tailwind.",
    siteUrl: "./portfolio/dance-studio/",
    githubUrl: null,
    hasImages: false
  },
  {
    slug: "analytics-dashboard",
    title: "Insight | Аналітичний дашборд",
    description:
      "BI-дашборд аналітики продажів: KPI-картки з динамікою, графіки доходу за днями/категоріями/каналами та таблиця транзакцій із пошуком і пагінацією.",
    stack: ["HTML", "Tailwind CSS", "JavaScript", "Chart.js"],
    process:
      "Задача: наочний дашборд для аналізу продажів без бекенду. Реалізація: графіки на Chart.js з мокованими даними, таблиця транзакцій із сортуванням, пошуком і пагінацією на JS.",
    siteUrl: "./portfolio/analytics-dashboard/",
    githubUrl: null,
    hasImages: false
  }
];

const PROJECTS_EN = [
  {
    slug: "assistant",
    title: "Assistant | Online Task Manager with AI",
    description:
      "Online task manager with AI assistant: tasks, notes, schedule and chat in one interface.",
    stack: ["Vite", "Vue", "JavaScript", "Cloudflare Functions", "LocalStorage"],
    process:
      "Built SPA architecture, implemented task/schedule/notes modules, connected AI chat via API proxy and managed client state persistence with LocalStorage.",
    siteUrl: "../portfolio/Assistant/",
    githubUrl: "https://github.com/Q42fmr/Assistant/",
    hasImages: false
  },
  {
    slug: "plant-shop",
    title: "Verde | Houseplant Online Store",
    description:
      "Houseplant e-commerce store: catalog with filters, search and sorting, cart with persisted state, and checkout flow.",
    stack: ["Vue 3", "Vite", "JavaScript", "CSS", "LocalStorage"],
    process:
      "Task: conversion-focused storefront with a full client-side purchase flow. Implementation: Vue 3 SPA — reactive filters and cart, LocalStorage persistence, checkout form validation.",
    siteUrl: "../portfolio/plant-shop/",
    githubUrl: null,
    hasImages: false
  },
  {
    slug: "saas-landing",
    title: "Pulse | SaaS Landing Page",
    description:
      "Landing page for a sales analytics service for small businesses: real-time reports, no-code dashboards and a signup form.",
    stack: ["HTML", "Tailwind CSS", "JavaScript"],
    process:
      "Task: high-conversion SaaS landing with a clear offer structure. Implementation: hero/features/pricing/FAQ sections built with Tailwind, animated transitions and JS form validation.",
    siteUrl: "../portfolio/saas-landing/",
    githubUrl: null,
    hasImages: false
  },
  {
    slug: "coffee-landing",
    title: "KAVA Roasters | Coffee Shop Landing Page",
    description:
      "Landing page for a coffee shop and roastery: drinks and dessert menu, brand story and online table booking.",
    stack: ["HTML", "Tailwind CSS", "JavaScript"],
    process:
      "Task: an atmospheric landing page for a local business with booking. Implementation: responsive Tailwind layout, menu gallery and a validated booking form.",
    siteUrl: "../portfolio/coffee-landing/",
    githubUrl: null,
    hasImages: false
  },
  {
    slug: "photographer-portfolio",
    title: "Anna Kovalenko | Photographer Portfolio",
    description:
      "Photographer portfolio with genre galleries (wedding, portrait, street, landscape), a lightbox and a booking contact form.",
    stack: ["HTML", "Tailwind CSS", "JavaScript"],
    process:
      "Task: a visually minimal portfolio focused on the photography. Implementation: responsive genre-filtered galleries, a JS lightbox and a contact form.",
    siteUrl: "../portfolio/photographer-portfolio/",
    githubUrl: null,
    hasImages: false
  },
  {
    slug: "dance-studio",
    title: "Flow | Dance Studio Website",
    description:
      "Dance studio website with an interactive class schedule, instructor cards, membership pricing and a trial-class signup form.",
    stack: ["HTML", "Tailwind CSS", "JavaScript"],
    process:
      "Task: a service-catalog site with class booking. Implementation: an interactive, filterable schedule table in JS, a responsive instructor and pricing grid built with Tailwind.",
    siteUrl: "../portfolio/dance-studio/",
    githubUrl: null,
    hasImages: false
  },
  {
    slug: "analytics-dashboard",
    title: "Insight | Analytics Dashboard",
    description:
      "BI sales analytics dashboard: KPI cards with trends, revenue charts by day/category/channel, and a searchable, paginated transactions table.",
    stack: ["HTML", "Tailwind CSS", "JavaScript", "Chart.js"],
    process:
      "Task: a clear, backend-free dashboard for sales analysis. Implementation: Chart.js charts driven by mock data, a transactions table with sorting, search and pagination in JS.",
    siteUrl: "../portfolio/analytics-dashboard/",
    githubUrl: null,
    hasImages: false
  }
];

if (menuToggle && mobileMenu) {
  menuToggle.addEventListener("click", () => {
    const expanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!expanded));
    mobileMenu.classList.toggle("hidden");
  });
}

links.forEach((link) => {
  link.addEventListener("click", () => {
    if (window.innerWidth < 768 && mobileMenu && menuToggle) {
      mobileMenu.classList.add("hidden");
      menuToggle.setAttribute("aria-expanded", "false");
    }
  });
});

const setActiveLink = () => {
  const scrollY = window.scrollY + 140;
  let currentId = sections[0]?.id;

  sections.forEach((section) => {
    if (scrollY >= section.offsetTop) {
      currentId = section.id;
    }
  });

  links.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${currentId}`);
  });
};

window.addEventListener("scroll", setActiveLink);
window.addEventListener("load", setActiveLink);

function renderProjects() {
  if (!projectsGrid) return;
  const projects = isEnglish ? PROJECTS_EN : PROJECTS_UA;
  projectsGrid.innerHTML = projects
    .map(
      (project, index) => `
      <article class="project-card project-card-clickable" data-project-index="${index}">
        <div class="project-collage">
          ${
            project.hasImages
              ? `
          <div class="project-screen project-screen-desktop">
            <img src="${ASSET_PREFIX}/assets/img/projects/${project.slug}-desktop.jpg" alt="${project.title} — desktop" loading="lazy">
          </div>
          <div class="project-screen project-screen-mobile">
            <img src="${ASSET_PREFIX}/assets/img/projects/${project.slug}-mobile.jpg" alt="${project.title} — mobile" loading="lazy">
          </div>
          `
              : `
          <div class="project-screen project-screen-desktop">
            <span class="project-screen-label">${isEnglish ? "Desktop" : "Десктоп"}</span>
          </div>
          <div class="project-screen project-screen-mobile">
            <span class="project-screen-label">${isEnglish ? "Mobile" : "Мобайл"}</span>
          </div>
          `
          }
        </div>
        <h3 class="mt-4 text-lg font-semibold">${project.title}</h3>
        <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">${project.description}</p>
        <p class="mt-3 text-xs text-slate-500 dark:text-slate-400">${project.stack.join(" • ")}</p>
      </article>
    `
    )
    .join("");

  projectsGrid.querySelectorAll("[data-project-index]").forEach((card) => {
    card.addEventListener("click", () => {
      const project = projects[Number(card.getAttribute("data-project-index"))];
      openProjectModal(project);
    });
  });
}

function openProjectModal(project) {
  if (
    !projectModal ||
    !projectModalTitle ||
    !projectModalDescription ||
    !projectModalStack ||
    !projectModalProcess ||
    !projectModalOpen ||
    !projectModalGithub
  ) {
    return;
  }

  projectModalTitle.textContent = project.title;
  projectModalDescription.textContent = project.description;
  projectModalStack.textContent = project.stack.join(" • ");
  projectModalProcess.textContent = project.process;
  projectModalOpen.href = project.siteUrl;
  projectModalGithub.classList.toggle("hidden", !project.githubUrl);
  if (project.githubUrl) {
    projectModalGithub.href = project.githubUrl;
  } else {
    projectModalGithub.removeAttribute("href");
  }
  projectModal.classList.remove("hidden");
  projectModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function closeProjectModal() {
  if (!projectModal) return;
  projectModal.classList.add("hidden");
  projectModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

if (projectModal) {
  projectModal.addEventListener("click", (event) => {
    const target = event.target;
    if (target instanceof HTMLElement && target.hasAttribute("data-close-modal")) {
      closeProjectModal();
    }
  });
}

if (projectModalClose) {
  projectModalClose.addEventListener("click", closeProjectModal);
}

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeProjectModal();
  }
});

if (contactForm && feedback) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(contactForm);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const message = String(formData.get("message") || "").trim();
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const requiredMessage =
      contactForm.getAttribute("data-msg-required") || "Заповніть всі поля форми.";
    const invalidMessage =
      contactForm.getAttribute("data-msg-invalid") || "Вкажіть коректний email.";
    const successMessage =
      contactForm.getAttribute("data-msg-success") ||
      "Дякую! Зараз відкриється ваш email-клієнт.";
    const subjectText =
      contactForm.getAttribute("data-subject") || "Запит з портфоліо-сайту";
    const nameLabel = contactForm.getAttribute("data-label-name") || "Ім'я";
    const messageLabel =
      contactForm.getAttribute("data-label-message") || "Повідомлення";
    const targetEmail =
      contactForm.getAttribute("data-mailto") || "your.email@example.com";

    if (!name || !email || !message) {
      feedback.textContent = requiredMessage;
      return;
    }

    if (!isEmailValid) {
      feedback.textContent = invalidMessage;
      return;
    }

    const subject = encodeURIComponent(subjectText);
    const body = encodeURIComponent(
      `${nameLabel}: ${name}\nEmail: ${email}\n\n${messageLabel}:\n${message}`
    );
    window.location.href = `mailto:${targetEmail}?subject=${subject}&body=${body}`;
    feedback.textContent = successMessage;
    feedback.classList.remove("text-rose-600", "dark:text-rose-300");
    feedback.classList.add("text-emerald-600", "dark:text-emerald-300");
  });
}

const yearElement = document.getElementById("year");
if (yearElement) {
  yearElement.textContent = String(new Date().getFullYear());
}

renderProjects();
