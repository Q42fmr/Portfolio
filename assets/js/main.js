(function () {
  "use strict";

  const lang = document.documentElement.lang === "en" ? "en" : "ua";
  const prefix = lang === "en" ? ".." : ".";
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const data = window.PORTFOLIO;
  const R = window.PortfolioRender;
  const now = new Date();
  const nowYm = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  R.renderAll({ data, lang, prefix, nowYm });
  const motion = window.initMotion({ reduced });

  document.getElementById("work-filters").addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-category]");
    if (btn) R.applyFilter(btn.dataset.category, lang);
  });

  document.getElementById("gantt").addEventListener("click", (e) => {
    const legend = e.target.closest(".gantt__legend [data-category]");
    if (legend) { R.applyFilter(legend.dataset.category, lang); return; }
    const el = e.target.closest("[data-clip]");
    if (el) motion.scrollTo(`#clip-${el.dataset.clip}`);
  });

  const copy = document.getElementById("copy-email");
  const emailEl = document.getElementById("contact-email");
  copy.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(data.profile.email);
    } catch {
      const range = document.createRange();
      range.selectNodeContents(emailEl);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    }
    copy.textContent = copy.dataset.done;
    setTimeout(() => { copy.textContent = copy.dataset.label; }, 1500);
  });

  const clock = document.getElementById("local-time");
  const fmt = new Intl.DateTimeFormat(lang === "en" ? "en-GB" : "uk-UA", { hour: "2-digit", minute: "2-digit", timeZone: data.profile.timeZone });
  const tick = () => { clock.textContent = fmt.format(new Date()); };
  tick();
  setInterval(tick, 60000);

  document.getElementById("year").textContent = String(now.getFullYear());

  document.getElementById("replay").addEventListener("click", () => {
    motion.scrollTo(0, { duration: 1.2, onComplete: () => motion.play() });
  });
})();
