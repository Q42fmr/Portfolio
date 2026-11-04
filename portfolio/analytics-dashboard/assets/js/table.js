/* «Insight» — BI-дашборд · таблиця транзакцій: рядки, пагінація, сортування, CSV. */

window.InsightTable = (() => {
  "use strict";
  const D = window.Insight;
  const { CONFIG, fmtUAH, fmtInt, fmtDateFull, fmtTime, esc, word, REC_WORDS, avatarStyle, initialsOf } = D;

  function rowHtml(t) {
    return `<tr>
      <td class="whitespace-nowrap tabular-nums text-slate-300">${fmtDateFull.format(t.date)} <span class="text-xs text-slate-500">${fmtTime.format(t.date)}</span></td>
      <td class="whitespace-nowrap font-mono text-xs text-slate-500">${t.id}</td>
      <td class="whitespace-nowrap"><span class="flex items-center gap-2.5"><span class="avatar" style="${avatarStyle(t.customer)}">${initialsOf(t.customer)}</span><span class="font-medium text-slate-100">${t.customer}</span></span></td>
      <td class="whitespace-nowrap text-slate-300">${t.category}</td>
      <td class="whitespace-nowrap text-slate-400">${t.channel}</td>
      <td class="whitespace-nowrap text-right font-semibold tabular-nums text-slate-100">${fmtUAH.format(t.amount)}</td>
      <td class="whitespace-nowrap"><span class="badge ${CONFIG.statusBadge[t.status]}">${t.status}</span></td>
    </tr>`;
  }

  function pageList(pages, cur) {
    if (pages <= 7) return Array.from({ length: pages }, (_, i) => i + 1);
    const out = [1];
    const lo = Math.max(2, cur - 1);
    const hi = Math.min(pages - 1, cur + 1);
    if (lo > 2) out.push("…");
    for (let p = lo; p <= hi; p++) out.push(p);
    if (hi < pages - 1) out.push("…");
    out.push(pages);
    return out;
  }

  function renderPager(pagerEl, store, pages) {
    const cur = store.state.page;
    let html = `<button class="pg-btn" type="button" data-page="${cur - 1}" ${cur === 1 ? "disabled" : ""} aria-label="Попередня сторінка">‹</button>`;
    for (const p of pageList(pages, cur)) {
      html += p === "…"
        ? '<span class="pg-gap" aria-hidden="true">…</span>'
        : `<button class="pg-btn${p === cur ? " active" : ""}" type="button" data-page="${p}" ${p === cur ? 'aria-current="page"' : ""}>${p}</button>`;
    }
    html += `<button class="pg-btn" type="button" data-page="${cur + 1}" ${cur === pages ? "disabled" : ""} aria-label="Наступна сторінка">›</button>`;
    pagerEl.innerHTML = html;
  }

  function syncSortHeaders(headEl, store) {
    headEl.querySelectorAll(".th-btn").forEach((btn) => {
      const th = btn.closest("th");
      const ind = btn.querySelector(".sort-ind");
      if (btn.dataset.key === store.state.sortKey) {
        btn.classList.add("sorted");
        ind.textContent = store.state.sortDir === "asc" ? "▲" : "▼";
        th.setAttribute("aria-sort", store.state.sortDir === "asc" ? "ascending" : "descending");
      } else {
        btn.classList.remove("sorted");
        ind.textContent = "";
        th.removeAttribute("aria-sort");
      }
    });
  }

  // el: { txHead, txBody, tableMeta, pageInfo, pager }
  function renderTable(el, store) {
    const periodTotal = store.all.reduce((n, t) => n + (t.daysAgo < store.state.period ? 1 : 0), 0);
    const rows = store.filteredSortedRows();
    const total = rows.length;
    const pages = Math.max(1, Math.ceil(total / CONFIG.pageSize));
    if (store.state.page > pages) store.state.page = pages;
    if (store.state.page < 1) store.state.page = 1;
    const from = (store.state.page - 1) * CONFIG.pageSize;
    const slice = rows.slice(from, from + CONFIG.pageSize);

    el.txBody.innerHTML = slice.length
      ? slice.map(rowHtml).join("")
      : `<tr><td colspan="7" class="px-4 py-10 text-center text-sm text-slate-500">Нічого не знайдено за запитом «${esc(store.state.query.trim())}»</td></tr>`;

    el.tableMeta.textContent = store.state.query.trim() || store.state.status
      ? `Знайдено ${fmtInt.format(total)} із ${fmtInt.format(periodTotal)}`
      : `${fmtInt.format(periodTotal)} ${word(periodTotal, REC_WORDS)} за обраний період`;

    el.pageInfo.textContent = total
      ? `Показано ${fmtInt.format(from + 1)}–${fmtInt.format(from + slice.length)} із ${fmtInt.format(total)}`
      : "Немає записів";

    renderPager(el.pager, store, pages);
    syncSortHeaders(el.txHead, store);
  }

  /* ────────────────── CSV-експорт ────────────────── */
  function csvEscape(v) {
    const s = String(v);
    return /[",\n;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  }

  function exportCsv(rows, filename) {
    const head = ["Дата", "ID", "Клієнт", "Категорія", "Канал", "Сума", "Статус"];
    const lines = [head.join(";")];
    for (const t of rows) {
      lines.push([
        `${fmtDateFull.format(t.date)} ${fmtTime.format(t.date)}`,
        t.id, t.customer, t.category, t.channel, t.amount, t.status,
      ].map(csvEscape).join(";"));
    }
    const blob = new Blob(["\ufeff" + lines.join("\r\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return { rowHtml, renderTable, exportCsv };
})();
