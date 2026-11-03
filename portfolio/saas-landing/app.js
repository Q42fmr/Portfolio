/* Pulse — SaaS-лендінг: інтерактив (демо-проєкт для портфоліо) */
"use strict";

const Pulse = {
  /* Бургер-меню на mobile */
  menu() {
    const btn = document.getElementById("menu-btn");
    const menu = document.getElementById("mobile-menu");
    const iconBurger = document.getElementById("icon-burger");
    const iconClose = document.getElementById("icon-close");
    if (!btn || !menu) return;

    const setOpen = (open) => {
      menu.classList.toggle("hidden", !open);
      iconBurger.classList.toggle("hidden", open);
      iconClose.classList.toggle("hidden", !open);
      btn.setAttribute("aria-expanded", String(open));
      btn.setAttribute("aria-label", open ? "Закрити меню" : "Відкрити меню");
    };

    btn.addEventListener("click", () => {
      setOpen(menu.classList.contains("hidden"));
    });

    /* Закривати меню після переходу за анкором */
    menu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => setOpen(false));
    });
  },

  /* Плавний скрол до анкорів: власна rAF-анімація замість scroll-behavior,
     бо нативний smooth-скрол зривається реф-лоу sticky-хедера */
  anchors() {
    const HEADER_OFFSET = 84;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const smoothScrollTo = (targetY) => {
      const startY = window.scrollY;
      const distance = targetY - startY;
      if (reduceMotion.matches || Math.abs(distance) < 2) {
        window.scrollTo(0, targetY);
        return;
      }
      const duration = Math.min(900, 400 + Math.abs(distance) * 0.08);
      const startTime = performance.now();
      const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);
      let ticked = false;
      let rafId = 0;
      const step = (now) => {
        ticked = true;
        const progress = Math.min(1, (now - startTime) / duration);
        window.scrollTo(0, startY + distance * easeOutQuart(progress));
        if (progress < 1) rafId = requestAnimationFrame(step);
      };
      rafId = requestAnimationFrame(step);
      /* У фоновій/прихованій вкладці rAF не тікає — стрибаємо одразу до цілі */
      setTimeout(() => {
        if (!ticked) {
          cancelAnimationFrame(rafId);
          window.scrollTo(0, targetY);
        }
      }, 200);
    };

    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener("click", (event) => {
        const hash = link.getAttribute("href");
        if (hash === "#" || hash === "#top") {
          event.preventDefault();
          smoothScrollTo(0);
          return;
        }
        const target = document.querySelector(hash);
        if (!target) return;
        event.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
        smoothScrollTo(Math.max(0, top));
        history.pushState(null, "", hash);
        target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
        target.addEventListener("blur", () => target.removeAttribute("tabindex"), { once: true });
      });
    });
  },

  /* Перемикач «Щомісяця / Щороку −20%»: читає data-monthly / data-yearly */
  pricing() {
    const buttons = document.querySelectorAll(".js-period-btn");
    const prices = document.querySelectorAll(".js-price");
    const notes = document.querySelectorAll(".js-note");
    if (!buttons.length || !prices.length) return;

    const apply = (period) => {
      prices.forEach((el) => {
        const next = el.dataset[period];
        if (next === undefined || el.textContent === next) return;
        el.textContent = next;
        el.classList.remove("price-swap");
        void el.offsetWidth; /* перезапуск анімації */
        el.classList.add("price-swap");
      });
      notes.forEach((el) => {
        const next = el.dataset[period];
        if (next !== undefined) el.textContent = next;
      });
      buttons.forEach((b) => {
        const active = b.dataset.period === period;
        b.classList.toggle("seg-active", active);
        b.setAttribute("aria-pressed", String(active));
      });
    };

    buttons.forEach((b) => {
      b.addEventListener("click", () => apply(b.dataset.period));
    });
  },

  /* FAQ-акордеон: відкритий лише один пункт, aria-expanded синхронізовано */
  accordion() {
    const items = Array.from(document.querySelectorAll(".faq-item"));
    if (!items.length) return;

    const setState = (item, open) => {
      item.classList.toggle("open", open);
      item.querySelector(".faq-trigger").setAttribute("aria-expanded", String(open));
    };

    items.forEach((item) => {
      item.querySelector(".faq-trigger").addEventListener("click", () => {
        const willOpen = !item.classList.contains("open");
        items.forEach((other) => setState(other, other === item && willOpen));
      });
    });
  },

  /* Поява секцій при скролі */
  reveal() {
    const targets = document.querySelectorAll(".reveal");
    if (!targets.length) return;

    if (!("IntersectionObserver" in window)) {
      targets.forEach((el) => el.classList.add("visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    targets.forEach((el) => observer.observe(el));
  },

  /* Email-форма: regex-валідація + success-стан */
  form() {
    const form = document.getElementById("demo-form");
    const input = document.getElementById("email-input");
    const error = document.getElementById("form-error");
    const wrap = document.getElementById("form-wrap");
    const success = document.getElementById("form-success");
    const successEmail = document.getElementById("success-email");
    if (!form || !input || !error || !wrap || !success || !successEmail) return;

    const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const value = input.value.trim();

      if (!EMAIL_RE.test(value)) {
        error.classList.remove("hidden");
        input.classList.add("ring-2", "ring-red-400");
        input.focus();
        return;
      }

      successEmail.textContent = value;
      wrap.classList.add("hidden");
      success.classList.remove("hidden");
    });

    input.addEventListener("input", () => {
      error.classList.add("hidden");
      input.classList.remove("ring-2", "ring-red-400");
    });
  },

  start() {
    this.menu();
    this.anchors();
    this.pricing();
    this.accordion();
    this.reveal();
    this.form();
  },
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => Pulse.start());
} else {
  Pulse.start();
}
