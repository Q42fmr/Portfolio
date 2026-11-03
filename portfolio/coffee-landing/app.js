/* KAVA Roasters — інтерактив лендінгу */
"use strict";

var PHONE_RE = /^\+?[\d\s()-]{10,}$/;

/** Сьогоднішня дата у форматі YYYY-MM-DD (локальний час). */
function todayISO() {
  var d = new Date();
  var month = String(d.getMonth() + 1).padStart(2, "0");
  var day = String(d.getDate()).padStart(2, "0");
  return d.getFullYear() + "-" + month + "-" + day;
}

class KavaSite {
  constructor(root) {
    this.root = root;
    this.bindMenu();
    this.bindTabs();
    this.bindBooking();
    this.bindReveal();

    var year = root.getElementById("year");
    if (year) year.textContent = String(new Date().getFullYear());
  }

  /* Мобільне меню (бургер) */
  bindMenu() {
    var root = this.root;
    var toggle = root.getElementById("nav-toggle");
    var panel = root.getElementById("nav-panel");
    if (!toggle || !panel) return;

    var setOpen = function (open) {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Закрити меню навігації" : "Відкрити меню навігації");
      panel.classList.toggle("is-open", open);
    };

    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });

    panel.addEventListener("click", function (event) {
      if (event.target.closest("a")) setOpen(false);
    });

    root.addEventListener("keydown", function (event) {
      if (event.key === "Escape") setOpen(false);
    });

    // Тінь хедера після початку прокрутки
    var header = root.getElementById("site-header");
    if (header) {
      var onScroll = function () {
        header.classList.toggle("is-scrolled", window.scrollY > 8);
      };
      root.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
    }
  }

  /* Таби меню */
  bindTabs() {
    var root = this.root;
    var tablist = root.querySelector('[role="tablist"]');
    if (!tablist) return;

    var tabs = Array.prototype.slice.call(tablist.querySelectorAll('[role="tab"]'));
    var panels = tabs.map(function (tab) {
      return root.getElementById(tab.getAttribute("aria-controls"));
    });

    var select = function (tab, focus) {
      tabs.forEach(function (candidate, index) {
        var active = candidate === tab;
        candidate.setAttribute("aria-selected", String(active));
        candidate.tabIndex = active ? 0 : -1;
        if (panels[index]) panels[index].hidden = !active;
      });
      if (focus) tab.focus();
    };

    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        select(tab, false);
      });
    });

    tablist.addEventListener("keydown", function (event) {
      var index = tabs.indexOf(document.activeElement);
      if (index === -1) return;
      var next = null;
      if (event.key === "ArrowRight") next = tabs[(index + 1) % tabs.length];
      else if (event.key === "ArrowLeft") next = tabs[(index - 1 + tabs.length) % tabs.length];
      else if (event.key === "Home") next = tabs[0];
      else if (event.key === "End") next = tabs[tabs.length - 1];
      if (next) {
        event.preventDefault();
        select(next, true);
      }
    });
  }

  /* Форма бронювання */
  bindBooking() {
    var root = this.root;
    var form = root.getElementById("booking-form");
    if (!form) return;

    var nameInput = root.getElementById("bk-name");
    var phoneInput = root.getElementById("bk-phone");
    var dateInput = root.getElementById("bk-date");
    var guestsSelect = root.getElementById("bk-guests");
    var success = root.getElementById("booking-success");
    var summary = root.getElementById("booking-summary");
    var again = root.getElementById("booking-again");

    if (!dateInput) return;

    // Мінімальна дата — сьогодні (для нативного календаря)
    dateInput.min = todayISO();

    var setError = function (input, message) {
      var box = root.getElementById(input.id + "-error");
      if (message) {
        input.setAttribute("aria-invalid", "true");
        input.setAttribute("aria-describedby", input.id + "-error");
        if (box) {
          box.textContent = message;
          box.hidden = false;
        }
      } else {
        input.removeAttribute("aria-invalid");
        input.removeAttribute("aria-describedby");
        if (box) box.hidden = true;
      }
    };

    var validators = [
      {
        input: nameInput,
        check: function (value) {
          return value.trim().length >= 2 ? "" : "Вкажіть імʼя — щонайменше 2 символи.";
        }
      },
      {
        input: phoneInput,
        check: function (value) {
          return PHONE_RE.test(value.trim()) ? "" : "Вкажіть номер у форматі +380 (XX) XXX-XX-XX.";
        }
      },
      {
        input: dateInput,
        check: function (value) {
          if (!value) return "Оберіть дату візиту.";
          return value >= todayISO() ? "" : "Дата не може бути в минулому — оберіть сьогодні або пізніше.";
        }
      }
    ];

    validators.forEach(function (rule) {
      rule.input.addEventListener("input", function () {
        setError(rule.input, "");
      });
    });

    var guestsWord = function (count) {
      return count === 1 ? "гостя" : "гостей";
    };

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      var firstInvalid = null;
      validators.forEach(function (rule) {
        var message = rule.check(rule.input.value);
        setError(rule.input, message);
        if (message && !firstInvalid) firstInvalid = rule.input;
      });

      if (firstInvalid) {
        firstInvalid.focus();
        return;
      }

      var guests = parseInt(guestsSelect.value, 10);
      var dateHuman = new Date(dateInput.value + "T00:00:00").toLocaleDateString("uk-UA", {
        day: "numeric",
        month: "long"
      });
      summary.textContent =
        nameInput.value.trim() + ", чекаємо вас " + dateHuman +
        " — столик для " + guests + " " + guestsWord(guests) + " уже за вами.";

      form.hidden = true;
      success.hidden = false;
      success.focus();
    });

    if (again) {
      again.addEventListener("click", function () {
        form.reset();
        validators.forEach(function (rule) {
          setError(rule.input, "");
        });
        success.hidden = true;
        form.hidden = false;
        nameInput.focus();
      });
    }
  }

  /* Мʼяка поява секцій */
  bindReveal() {
    var root = this.root;
    var items = root.querySelectorAll("[data-reveal]");
    if (!items.length || !("IntersectionObserver" in window)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    items.forEach(function (element) {
      element.classList.add("reveal");
      observer.observe(element);
    });
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", function () {
    new KavaSite(document);
  });
} else {
  new KavaSite(document);
}
