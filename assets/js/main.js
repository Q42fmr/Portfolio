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

const PROJECTS_UA = [
  {
    title: "Assistant | Online Task Manager with AI",
    description:
      "Онлайн таск-менеджер із AI-асистентом: задачі, нотатки, розклад і чат в одному інтерфейсі.",
    stack: ["Vite", "Vue", "JavaScript", "Cloudflare Functions", "LocalStorage"],
    process:
      "Спроєктував SPA-структуру, реалізував модулі задач/розкладу/нотаток, додав AI-чат через API-проксі та організував збереження стану в LocalStorage.",
    siteUrl: "./portfolio/Assistant/index.html",
    githubUrl: "https://github.com/Q42fmr/Assistant/"
  },
  {
    title: "E-commerce Landing",
    description:
      "Адаптивний лендинг для онлайн-магазину з фокусом на конверсію, швидкість завантаження і чітку структуру блоків.",
    stack: ["HTML", "CSS", "JavaScript", "Tailwind CSS"],
    process:
      "Зібрав верстку з нуля, продумав ієрархію контенту, оптимізував CTA-блоки та адаптивність для mobile і desktop.",
    siteUrl: "./portfolio/ecommerce-landing/",
    githubUrl: "https://github.com/your-username/ecommerce-landing"
  },
  {
    title: "Portfolio Template",
    description:
      "Шаблон персонального портфоліо з SEO, адаптивною версткою і структурою резюме для швидкого старту.",
    stack: ["HTML", "Tailwind CSS", "JavaScript"],
    process:
      "Побудував універсальну структуру секцій, додав якірну навігацію, адаптивні стилі та базову SEO-оптимізацію.",
    siteUrl: "./portfolio/portfolio-template/",
    githubUrl: "https://github.com/your-username/portfolio-template"
  }
];

const PROJECTS_EN = [
  {
    title: "Assistant | Online Task Manager with AI",
    description:
      "Online task manager with AI assistant: tasks, notes, schedule and chat in one interface.",
    stack: ["Vite", "Vue", "JavaScript", "Cloudflare Functions", "LocalStorage"],
    process:
      "Built SPA architecture, implemented task/schedule/notes modules, connected AI chat via API proxy and managed client state persistence with LocalStorage.",
    siteUrl: "../portfolio/Assistant/",
    githubUrl: "https://github.com/your-username/assistant"
  },
  {
    title: "E-commerce Landing",
    description:
      "Responsive e-commerce landing focused on conversion, loading speed and clean content hierarchy.",
    stack: ["HTML", "CSS", "JavaScript", "Tailwind CSS"],
    process:
      "Implemented layout from scratch, designed section hierarchy, polished CTA blocks and tuned responsive behavior for mobile and desktop.",
    siteUrl: "../portfolio/ecommerce-landing/",
    githubUrl: "https://github.com/your-username/ecommerce-landing"
  },
  {
    title: "Portfolio Template",
    description:
      "Developer portfolio template with SEO setup, responsive layout and resume-focused structure.",
    stack: ["HTML", "Tailwind CSS", "JavaScript"],
    process:
      "Created reusable section structure, anchor navigation, responsive styles and baseline SEO metadata.",
    siteUrl: "../portfolio/portfolio-template/",
    githubUrl: "https://github.com/your-username/portfolio-template"
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
          <div class="project-screen project-screen-desktop">
            <span class="project-screen-label">${isEnglish ? "Desktop" : "Десктоп"}</span>
          </div>
          <div class="project-screen project-screen-mobile">
            <span class="project-screen-label">${isEnglish ? "Mobile" : "Мобайл"}</span>
          </div>
        </div>
        <h3 class="mt-4 text-lg font-semibold">${project.title}</h3>
        <p class="mt-2 text-sm text-slate-300">${project.description}</p>
        <p class="mt-3 text-xs text-slate-400">${project.stack.join(" • ")}</p>
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
  projectModalGithub.href = project.githubUrl;
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
    feedback.classList.remove("text-rose-300");
    feedback.classList.add("text-emerald-300");
  });
}

const yearElement = document.getElementById("year");
if (yearElement) {
  yearElement.textContent = String(new Date().getFullYear());
}

renderProjects();
