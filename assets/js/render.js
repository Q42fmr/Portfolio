(function (window) {
  "use strict";

  const GANTT = { start: "2021-09", end: "2026-12", months: 64 };

  // ---------- pure helpers ----------

  function t(field, lang) {
    if (field == null) return "";
    if (typeof field === "string") return field;
    return field[lang] ?? field.ua ?? "";
  }

  function monthIndex(ym) {
    const [y, m] = ym.split("-").map(Number);
    return y * 12 + (m - 1);
  }

  function ganttSpan(clip, nowYm) {
    const start = monthIndex(GANTT.start);
    const end = monthIndex(GANTT.end);
    const from = Math.max(start, Math.min(end, monthIndex(clip.from)));
    const to = Math.max(from, Math.min(end, monthIndex(clip.to ?? nowYm)));
    return { col: from - start + 1, span: to - from + 1 };
  }

  function formatTimecode(progress, totalSeconds) {
    const p = Math.min(1, Math.max(0, Number(progress) || 0));
    const s = Math.round(p * totalSeconds);
    const pad = (n) => String(n).padStart(2, "0");
    return `${pad(Math.floor(s / 3600))}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}`;
  }

  function countProjects(clips) {
    return clips.filter((c) => c.kind === "project").length;
  }

  function visibleClipIds(clips, category) {
    return clips.filter((c) => category === "all" || c.category === category).map((c) => c.id);
  }

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const href = (url, prefix) => (/^https?:\/\//.test(url) ? url : `${prefix}/${url}`);
  const L = (lang, ua, en) => (lang === "en" ? en : ua);
  const fmtYm = (ym) => ym.split("-").reverse().join(".");
  const pad2 = (n) => String(n).padStart(2, "0");

  function periodLabel(clip, lang) {
    if (!clip.to) return `${fmtYm(clip.from)} — ${L(lang, "тепер", "now")}`;
    return clip.from === clip.to ? fmtYm(clip.from) : `${fmtYm(clip.from)} — ${fmtYm(clip.to)}`;
  }

  function clipMarkup(clip, index, total, lang, prefix, categoriesById) {
    const cat = categoriesById[clip.category];
    const n = pad2(index + 1);
    const title = esc(t(clip.title, lang));
    const links = [
      clip.siteUrl ? `<a class="btn btn--primary" href="${esc(href(clip.siteUrl, prefix))}" target="_blank" rel="noreferrer">${L(lang, "Відкрити", "Open")} ↗</a>` : "",
      clip.githubUrl ? `<a class="btn btn--ghost" href="${esc(clip.githubUrl)}" target="_blank" rel="noreferrer">GitHub ↗</a>` : ""
    ].join("");
    const collage = clip.images
      ? `
      <div class="collage">
        <div class="collage__desktop"><img src="${prefix}/assets/img/projects/${clip.id}-desktop.jpg" alt="${title} — desktop" loading="lazy" width="1280" height="800"></div>
        <div class="collage__mobile"><img src="${prefix}/assets/img/projects/${clip.id}-mobile.jpg" alt="${title} — mobile" loading="lazy" width="390" height="844"></div>
      </div>`
      : "";
    return `
      <article class="clip" id="clip-${clip.id}" data-category="${clip.category}" data-from="${clip.from}">
        <p class="clip__meta mono">
          <span>${esc(periodLabel(clip, lang))}</span>
          <span class="clip__cat" style="--cat:var(--c-${clip.category})">${esc(t(cat.label, lang))}</span>
          ${clip.nda ? `<span class="chip chip--ink">${L(lang, "під NDA", "under NDA")}</span>` : ""}
          <span class="clip__index">${L(lang, "Кліп", "Clip")} ${n}/${total}</span>
        </p>
        <h3 class="clip__title">${title}</h3>
        <p class="clip__tagline lead">${esc(t(clip.tagline, lang))}</p>
        <div class="clip__grid">
          <div><p class="mono">${L(lang, "Що", "What")}</p><p>${esc(t(clip.what, lang))}</p></div>
          <div><p class="mono">${L(lang, "Результат", "Result")}</p><p>${esc(t(clip.result, lang))}</p></div>
        </div>
        <ul class="clip__tags">${clip.tags.map((x) => `<li class="chip">${esc(x)}</li>`).join("")}</ul>
        ${collage}
        ${links ? `<div class="clip__actions">${links}</div>` : ""}
      </article>`;
  }

  // ---------- DOM painters (browser only) ----------

  let state = { data: null, lang: "ua", nowYm: "", activeId: null, category: "all" };

  const byId = (id) => document.getElementById(id);

  function renderFilters(data, lang) {
    const el = byId("work-filters");
    if (!el) return;
    el.innerHTML = [`<button type="button" data-category="all" aria-pressed="true">${L(lang, "Усі", "All")}</button>`]
      .concat(data.categories.map((c) => `<button type="button" data-category="${c.id}" aria-pressed="false">${esc(t(c.label, lang))}</button>`))
      .join("");
  }

  function renderClips(data, lang, prefix) {
    const el = byId("clips");
    if (!el) return;
    const cats = Object.fromEntries(data.categories.map((c) => [c.id, c]));
    el.innerHTML = data.clips.map((clip, i) => clipMarkup(clip, i, data.clips.length, lang, prefix, cats)).join("");
  }

  // Greedy interval packing: returns a lane index per item (items in chronological order).
  function packLanes(items, nowYm) {
    const laneEnds = [];
    return items.map((it) => {
      const s = ganttSpan(it, nowYm);
      const start = s.col;
      const end = s.col + s.span - 1;
      let lane = laneEnds.findIndex((e) => e < start);
      if (lane === -1) { lane = laneEnds.length; laneEnds.push(end); } else laneEnds[lane] = end;
      return lane;
    });
  }

  function renderGantt(data, lang, nowYm) {
    const el = byId("gantt");
    if (!el) return;
    const variant = document.body.dataset.gantt || "";
    const startYear = Number(GANTT.start.slice(0, 4));
    const endYear = Number(GANTT.end.slice(0, 4));
    const startMonth = Number(GANTT.start.slice(5, 7));
    const firstYearSpan = 12 - startMonth + 1;
    const years = [];
    for (let y = startYear; y <= endYear; y++) {
      const style = y === startYear ? ` style="grid-column: span ${firstYearSpan}"` : "";
      years.push(`<span class="gantt__year"${style}>${y}</span>`);
    }
    const goTo = L(lang, "Перейти до кліпу", "Go to clip");
    const header = `<div class="gantt__months gantt__head">${years.join("")}<span class="gantt__cursor" id="gantt-cursor" style="--x:0%"><span id="gantt-cursor-date"></span></span></div>`;
    const legend = `<ul class="gantt__legend">${data.categories
      .map((c) => `<li><button type="button" data-category="${c.id}" aria-pressed="false" style="--cat:var(--c-${c.id})">${esc(t(c.label, lang))}</button></li>`)
      .join("")}</ul>`;
    const caption = variant ? `<div class="gantt__caption-row"><span class="gantt__caption" id="gantt-caption" aria-live="polite"></span>${legend}</div>` : "";

    const positionBar = (p) => {
      const s = ganttSpan(p, nowYm);
      const cls = p.id === "nda" ? "gantt__bar gantt__bar--position gantt__bar--nda" : "gantt__bar gantt__bar--position";
      return `<span class="${cls}" style="--col:${s.col};--span:${s.span}" title="${esc(t(p.title, lang))}"></span>`;
    };

    if (variant === "b") {
      const lanes = packLanes(data.clips, nowYm);
      const laneCount = Math.max(0, ...lanes) + 1;
      const bars = Array.from({ length: laneCount }, () => []);
      data.clips.forEach((clip, i) => {
        const s = ganttSpan(clip, nowYm);
        const title = esc(t(clip.title, lang));
        const wide = s.span >= 4 ? " gantt__bar--wide" : "";
        bars[lanes[i]].push(`<button type="button" class="gantt__bar gantt__bar--lane${wide}" data-clip="${clip.id}" data-category="${clip.category}" style="--col:${s.col};--span:${s.span};--cat:var(--c-${clip.category})" aria-label="${goTo} ${title}" title="${pad2(i + 1)} ${title}"><span>${pad2(i + 1)} ${title}</span></button>`);
      });
      el.innerHTML = `
      <div class="gantt__grid gantt__grid--lanes" role="list" style="--months:${GANTT.months}">
        ${header}
        <div class="gantt__lane gantt__lane--position" role="listitem"><div class="gantt__track">${data.positions.map(positionBar).join("")}</div></div>
        ${bars.map((b) => `<div class="gantt__lane" role="listitem"><div class="gantt__track">${b.join("")}</div></div>`).join("")}
      </div>
      ${caption}`;
      return;
    }

    const positionRows = data.positions
      .map((p) => `
        <div class="gantt__row gantt__row--position" role="listitem">
          <span class="gantt__label gantt__label--position" title="${esc(t(p.title, lang))}">${esc(t(p.title, lang))}</span>
          <div class="gantt__track">${positionBar(p)}</div>
        </div>`)
      .join("");

    const clipRows = data.clips
      .map((clip, i) => {
        const s = ganttSpan(clip, nowYm);
        const title = esc(t(clip.title, lang));
        return `
        <div class="gantt__row" data-clip="${clip.id}" data-category="${clip.category}" role="listitem">
          <button type="button" class="gantt__label" data-clip="${clip.id}" title="${title}">${pad2(i + 1)} ${title}</button>
          <div class="gantt__track"><button type="button" class="gantt__bar" data-clip="${clip.id}" style="--col:${s.col};--span:${s.span};--cat:var(--c-${clip.category})" aria-label="${goTo} ${title}" title="${pad2(i + 1)} ${title}"></button></div>
        </div>`;
      })
      .join("");

    el.innerHTML = `
      <div class="gantt__grid" role="list" style="--months:${GANTT.months}">
        <span class="gantt__head gantt__head--label">${L(lang, "Позиція / кліп", "Position / clip")}</span>
        ${header}
        ${positionRows}
        ${clipRows}
      </div>
      ${variant ? caption : legend}`;
  }

  function renderMarquees(data, lang) {
    const fill = (id, items) => {
      const track = document.querySelector(`#${id} .marquee__track`);
      if (!track) return;
      const twice = items.concat(items);
      track.innerHTML = twice.map((x) => `<span>${esc(t(x, lang))} ·</span>`).join("");
    };
    fill("now-marquee", data.profile.marquee[lang] || data.profile.marquee.ua);
    const groups = Object.fromEntries(data.stack.map((g) => [g.id, g.items]));
    fill("stack-marquee-a", (groups.frontend || []).concat(groups.qa || []));
    fill("stack-marquee-b", groups.ai || []);
  }

  function renderStack(data, lang) {
    const el = byId("stack-groups");
    if (!el) return;
    el.innerHTML = data.stack
      .map((g) => `
      <section class="stack-group" aria-labelledby="stack-${g.id}">
        <h3 class="mono" id="stack-${g.id}">${esc(t(g.label, lang))}</h3>
        <ul>${g.items.map((x) => `<li>${esc(t(x, lang))}</li>`).join("")}</ul>
      </section>`)
      .join("");
  }

  function renderLanguages(data, lang) {
    const el = byId("languages");
    if (!el) return;
    el.innerHTML = data.languages
      .map((l) => {
        const segs = Array.from({ length: 6 }, (_, i) => `<span class="${i < l.score ? "is-on" : ""}"></span>`).join("");
        return `<li><span>${esc(t(l.label, lang))}</span><span class="lang-scale" aria-hidden="true">${segs}</span><span class="mono">${l.level}</span></li>`;
      })
      .join("");
  }

  function renderContactLinks(data) {
    const el = byId("contact-links");
    if (!el) return;
    const p = data.profile;
    const entries = [
      ["Telegram", p.telegram, true],
      ["LinkedIn", p.linkedin, true],
      ["GitHub", p.github, true],
      [p.phoneDisplay, p.phone ? `tel:${p.phone}` : "", false]
    ].filter(([, url]) => url);
    el.innerHTML = entries
      .map(([label, url, ext]) => `<li><a class="btn btn--ghost" href="${esc(url)}"${ext ? ' target="_blank" rel="noreferrer"' : ""}>${esc(label)}${ext ? " ↗" : ""}</a></li>`)
      .join("");
  }

  function renderNow(data, lang) {
    const summary = byId("now-summary");
    if (summary) summary.textContent = t(data.profile.summary, lang);
    const chips = byId("now-chips");
    if (chips) chips.innerHTML = data.profile.nowChips.map((x) => `<li class="chip">${esc(x)}</li>`).join("");
    const counter = byId("counter-projects");
    if (counter) counter.dataset.target = String(countProjects(data.clips));
  }

  function renderCv(data, lang, prefix) {
    const el = byId("cv-print");
    if (!el) return;
    const p = data.profile;
    const contacts = [p.email, p.phoneDisplay, p.site, p.telegram, p.linkedin, p.github].filter(Boolean).map((v) => v.replace(/^https?:\/\//, ""));
    const posById = Object.fromEntries(data.positions.map((x) => [x.id, x]));
    const jobsFor = (pid) => data.clips.filter((c) => c.position === pid && c.kind === "job");
    const projectsFor = (pid) => data.clips.filter((c) => c.position === pid && c.kind === "project");
    const li = (c) => `<li><strong>${esc(t(c.title, lang))}.</strong> ${esc(t(c.what, lang))} <span class="mono">${c.tags.map(esc).join(" · ")}</span></li>`;
    const grouped = (pid) => {
      const list = projectsFor(pid);
      if (!list.length) return "";
      return `<li><strong>${L(lang, "Запущені сайти", "Sites shipped")} (${list.length}).</strong> ${list.map((c) => esc(t(c.title, lang))).join(" · ")}</li>`;
    };
    const projects = data.clips.filter((c) => c.kind === "project" && !c.position).slice().reverse();
    const links = (c) => [c.siteUrl ? href(c.siteUrl, prefix) : "", c.githubUrl || ""].filter(Boolean).map((u) => (/^https?:/.test(u) ? u.replace(/^https?:\/\//, "") : `${p.site.replace(/^https?:\/\//, "")}/${u.replace(/^\.{1,2}\//, "")}`));
    const nda = posById.nda;
    const collar = posById.collar;

    el.innerHTML = `
      <header class="cv-head">
        <div>
          <h1>${esc(t(p.name, lang))}</h1>
          <p>${esc(t(p.role, lang))} · ${esc(t(p.level, lang))} · ${esc(t(p.location, lang))}</p>
          <p class="mono">${contacts.map(esc).join(" · ")}</p>
        </div>
        <p class="mono">${esc(t(p.status, lang))}</p>
      </header>
      <h2>${L(lang, "Коротко", "Summary")}</h2>
      <p>${esc(t(p.summary, lang))}</p>
      <h2>${L(lang, "Досвід", "Experience")}</h2>
      <div class="cv-row"><h3>${esc(t(nda.title, lang))}</h3><span class="mono">${esc(t(p.nowLabel, lang))}</span></div>
      <ul>${jobsFor("nda").map(li).join("")}${grouped("nda")}</ul>
      <div class="cv-row"><h3>${esc(t(collar.title, lang))}</h3><span class="mono">${fmtYm(collar.from)} — ${fmtYm(collar.to)}</span></div>
      <ul>${jobsFor("collar").map((c) => `<li>${esc(t(c.what, lang))} <span class="mono">${c.tags.map(esc).join(" · ")}</span></li>`).join("")}${grouped("collar")}</ul>
      ${data.otherExperience.map((o) => `<div class="cv-row"><h3>${esc(t(o.title, lang))}</h3><span class="mono">${esc(o.period)}</span></div><p>${esc(t(o.detail, lang))}</p>`).join("")}
      <h2>${L(lang, "Проєкти", "Projects")}</h2>
      <ul>${projects.map((c) => { const u = links(c); return `<li><strong>${esc(t(c.title, lang))}</strong> — ${esc(t(c.tagline, lang))} <span class="mono">${esc(periodLabel(c, lang))} · ${c.tags.map(esc).join(" · ")}${u.length ? " · " + u.map(esc).join(" · ") : ""}</span></li>`; }).join("")}</ul>
      <h2>${L(lang, "Навички", "Skills")}</h2>
      ${data.stack.map((g) => `<p><strong>${esc(t(g.label, lang))}:</strong> ${g.items.map((x) => esc(t(x, lang))).join(" · ")}</p>`).join("")}
      <h2>${L(lang, "Освіта", "Education")}</h2>
      ${data.education.map((e) => `<div class="cv-row"><p><strong>${esc(t(e.title, lang))}</strong> — ${esc(t(e.detail, lang))}</p><span class="mono">${esc(e.period)}</span></div>`).join("")}
      <h2>${L(lang, "Мови", "Languages")}</h2>
      <p>${data.languages.map((l) => `${esc(t(l.label, lang))} ${l.level}`).join(" · ")}</p>`;
  }

  function updateCounter(lang) {
    const el = byId("work-counter");
    if (!el || !state.data) return;
    const visible = visibleClipIds(state.data.clips, state.category);
    const idx = Math.max(0, visible.indexOf(state.activeId));
    el.textContent = `${L(lang, "Кліп", "Clip")} ${pad2(visible.length ? idx + 1 : 0)} / ${visible.length}`;
  }

  function applyFilter(category, lang) {
    state.category = category;
    document.querySelectorAll("#work-filters button[data-category]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.category === category)));
    document.querySelectorAll(".gantt__legend button[data-category]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.category === category)));
    document.querySelectorAll(".clip[data-category], .gantt [data-clip][data-category]").forEach((el) => {
      el.classList.toggle("is-hidden", category !== "all" && el.dataset.category !== category);
    });
    const counter = byId("work-counter");
    if (counter) counter.setAttribute("aria-live", "polite");
    const visible = visibleClipIds(state.data.clips, category);
    if (!visible.includes(state.activeId) && visible.length) setActiveClip(visible[0]);
    else updateCounter(lang);
    if (typeof window.ScrollTrigger !== "undefined") window.ScrollTrigger.refresh();
  }

  function setActiveClip(id) {
    if (!state.data || state.activeId === id) return;
    state.activeId = id;
    document.querySelectorAll(".clip.is-active, .gantt .is-active").forEach((el) => el.classList.remove("is-active"));
    const clipEl = byId(`clip-${id}`);
    if (clipEl) clipEl.classList.add("is-active");
    document.querySelectorAll(`.gantt [data-clip="${id}"]`).forEach((el) => el.classList.add("is-active"));
    const caption = byId("gantt-caption");
    const idx = state.data.clips.findIndex((c) => c.id === id);
    if (caption && idx !== -1) caption.textContent = `${pad2(idx + 1)} · ${t(state.data.clips[idx].title, state.lang)} · ${periodLabel(state.data.clips[idx], state.lang)}`;
    const clip = state.data.clips.find((c) => c.id === id);
    const cursor = byId("gantt-cursor");
    if (clip && cursor) {
      const s = ganttSpan(clip, state.nowYm);
      cursor.style.setProperty("--x", `${(((s.col - 1) / GANTT.months) * 100).toFixed(2)}%`);
      const date = byId("gantt-cursor-date");
      if (date) date.textContent = fmtYm(clip.from);
    }
    updateCounter(state.lang);
  }

  function renderAll({ data, lang, prefix, nowYm }) {
    state = { data, lang, nowYm, activeId: null, category: "all" };
    renderNow(data, lang);
    renderMarquees(data, lang);
    renderFilters(data, lang);
    renderClips(data, lang, prefix);
    renderGantt(data, lang, nowYm);
    renderStack(data, lang);
    renderLanguages(data, lang);
    renderContactLinks(data);
    renderCv(data, lang, prefix);
    if (data.clips.length) setActiveClip(data.clips[0].id);
    return { clipIds: data.clips.map((c) => c.id) };
  }

  window.PortfolioRender = {
    GANTT, t, monthIndex, ganttSpan, formatTimecode, countProjects, visibleClipIds,
    clipMarkup, packLanes, renderAll, applyFilter, setActiveClip
  };
})(window);
