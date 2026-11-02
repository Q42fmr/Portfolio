(function (window) {
  "use strict";

  const GANTT = { start: "2021-09", end: "2026-12", months: 64 };

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

  window.PortfolioRender = { GANTT, t, monthIndex, ganttSpan, formatTimecode, countProjects, visibleClipIds };
})(window);
