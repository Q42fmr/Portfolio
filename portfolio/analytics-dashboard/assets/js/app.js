/* «Insight» — BI-дашборд · підключення сторінок за document.body.dataset.page. */

(() => {
  "use strict";
  const D = window.Insight;
  const { CONFIG, fmtUAH, fmtInt, fmtPct1, fmtDateFull, word, TX_WORDS, avatarStyle, initialsOf } = D;
  const $ = (id) => document.getElementById(id);

  function deltaBadge(cur, prev, inPoints = false) {
    if (!inPoints && !(prev > 0)) return '<span class="delta delta-flat">—</span>';
    const diff = inPoints ? cur - prev : ((cur - prev) / prev) * 100;
    if (Math.abs(diff) < 0.05) return '<span class="delta delta-flat">≈ 0%</span>';
    const up = diff > 0;
    const cls = up ? "delta-up" : "delta-down";
    const arrow = up ? "↑" : "↓";
    const unit = inPoints ? " в.п." : "%";
    return `<span class="delta ${cls}">${arrow} ${fmtPct1.format(Math.abs(diff))}${unit}</span>`;
  }

  function rangeLabel(period) {
    const start = new Date(D.TODAY);
    start.setDate(start.getDate() - (period - 1));
    const left = start.getFullYear() === D.TODAY.getFullYear()
      ? D.fmtRangeDay.format(start)
      : `${D.fmtRangeDay.format(start)} ${start.getFullYear()}`;
    return `${left} — ${D.fmtRangeDay.format(D.TODAY)} ${D.TODAY.getFullYear()}`;
  }

  /* ────────────────── Мобільний сайдбар (спільне для всіх сторінок) ────────────────── */
  function wireSidebar() {
    const sidebar = $("sidebar"), backdrop = $("backdrop");
    const openBtn = $("sidebarOpen"), closeBtn = $("sidebarClose");
    if (!sidebar || !openBtn) return;
    const openNav = () => {
      document.body.classList.add("nav-open");
      openBtn.setAttribute("aria-expanded", "true");
      closeBtn.focus();
    };
    const closeNav = (refocus) => {
      if (!document.body.classList.contains("nav-open")) return;
      document.body.classList.remove("nav-open");
      openBtn.setAttribute("aria-expanded", "false");
      if (refocus) openBtn.focus();
    };
    openBtn.addEventListener("click", openNav);
    closeBtn.addEventListener("click", () => closeNav(true));
    backdrop.addEventListener("click", () => closeNav(false));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeNav(true);
    });
    window.matchMedia("(min-width: 1024px)").addEventListener("change", (e) => {
      if (e.matches) closeNav(false);
    });
  }

  /* ────────────────── Огляд (index.html) ────────────────── */
  function pageOverview() {
    const el = {
      kpiRevenue: $("kpiRevenue"), kpiRevenueDelta: $("kpiRevenueDelta"),
      kpiOrders: $("kpiOrders"), kpiOrdersDelta: $("kpiOrdersDelta"),
      kpiAvg: $("kpiAvg"), kpiAvgDelta: $("kpiAvgDelta"),
      kpiConversion: $("kpiConversion"), kpiConversionDelta: $("kpiConversionDelta"),
      rangeText: $("rangeText"), rangeCount: $("rangeCount"), periodChip: $("periodChip"),
      periodSwitch: $("periodSwitch"), channelLegend: $("channelLegend"),
      recentBody: $("recentBody"),
    };

    const store = D.createStore();
    const charts = window.InsightCharts.createCharts($);

    function renderKpis(k, kPrev, period) {
      el.kpiRevenue.textContent = fmtUAH.format(k.revenue);
      el.kpiOrders.textContent = fmtInt.format(k.orders);
      el.kpiAvg.textContent = fmtUAH.format(Math.round(k.avg));
      el.kpiConversion.textContent = `${fmtPct1.format(k.conversion)}%`;
      el.kpiRevenueDelta.innerHTML = deltaBadge(k.revenue, kPrev.revenue);
      el.kpiOrdersDelta.innerHTML = deltaBadge(k.orders, kPrev.orders);
      el.kpiAvgDelta.innerHTML = deltaBadge(k.avg, kPrev.avg);
      el.kpiConversionDelta.innerHTML = deltaBadge(k.conversion, kPrev.conversion, true);

      el.rangeText.textContent = rangeLabel(period);
      el.rangeCount.textContent = `${fmtInt.format(k.orders)} ${word(k.orders, TX_WORDS)}`;
      el.periodChip.textContent = `Останні ${period} днів`;
    }

    function renderRecent(cur) {
      const recent = cur.slice().sort((a, b) => b.date - a.date).slice(0, 10);
      el.recentBody.innerHTML = recent.length
        ? recent.map(window.InsightTable.rowHtml).join("")
        : `<tr><td colspan="7" class="px-4 py-10 text-center text-sm text-slate-500">Немає транзакцій за обраний період</td></tr>`;
    }

    function refresh() {
      const period = store.state.period;
      const { cur, prev } = store.slicePeriod(period);
      const sessionsCur = store.sumSessions(0, period);
      const sessionsPrev = store.sumSessions(period, period * 2);
      const k = store.kpisOf(cur, sessionsCur);
      const kPrev = store.kpisOf(prev, sessionsPrev);
      renderKpis(k, kPrev, period);
      window.InsightCharts.renderCharts(charts, store, period, cur, prev, k, el.channelLegend);
      renderRecent(cur);
    }

    el.periodSwitch.addEventListener("click", (e) => {
      const btn = e.target.closest(".seg-btn");
      if (!btn) return;
      const period = Number(btn.dataset.period);
      if (period === store.state.period) return;
      store.setPeriod(period);
      el.periodSwitch.querySelectorAll(".seg-btn").forEach((b) => {
        const active = b === btn;
        b.classList.toggle("active", active);
        b.setAttribute("aria-pressed", String(active));
      });
      refresh();
    });

    refresh();
  }

  /* ────────────────── Транзакції (transactions.html) ────────────────── */
  function pageTransactions() {
    const el = {
      txHead: $("txHead"), txBody: $("txBody"), tableMeta: $("tableMeta"),
      searchInput: $("searchInput"), pageInfo: $("pageInfo"), pager: $("pager"),
      statusFilter: $("statusFilter"), exportBtn: $("exportCsv"),
    };
    const store = D.createStore();
    store.setPeriod(CONFIG.visibleDays); // повна історія на сторінці транзакцій

    const render = () => window.InsightTable.renderTable(el, store);

    el.txHead.addEventListener("click", (e) => {
      const btn = e.target.closest(".th-btn");
      if (!btn) return;
      store.setSort(btn.dataset.key);
      render();
    });

    const onSearch = () => {
      const q = el.searchInput.value;
      if (q === store.state.query) return;
      store.setQuery(q);
      render();
    };
    el.searchInput.addEventListener("input", onSearch);
    el.searchInput.addEventListener("search", onSearch);

    el.statusFilter.addEventListener("change", () => {
      store.setStatus(el.statusFilter.value);
      render();
    });

    el.pager.addEventListener("click", (e) => {
      const btn = e.target.closest(".pg-btn");
      if (!btn || btn.disabled) return;
      const page = Number(btn.dataset.page);
      if (!Number.isFinite(page) || page === store.state.page) return;
      store.setPage(page);
      render();
    });

    el.exportBtn.addEventListener("click", () => {
      const rows = store.filteredSortedRows();
      const stamp = new Date().toISOString().slice(0, 10);
      window.InsightTable.exportCsv(rows, `insight-transactions-${stamp}.csv`);
    });

    render();
  }

  /* ────────────────── Товари (products.html) ────────────────── */
  function pageProducts() {
    const grid = $("productsGrid");
    const products = D.createProductData();
    const totalRevenue = products.reduce((n, p) => n + p.revenue, 0);
    const totalSold = products.reduce((n, p) => n + p.sold, 0);
    $("productsTotalRevenue").textContent = fmtUAH.format(totalRevenue);
    $("productsTotalSold").textContent = fmtInt.format(totalSold);
    grid.innerHTML = products.map((p) => `
      <article class="card rise overflow-hidden" style="--d:0s">
        <img src="${p.img}" alt="${p.name}" class="h-44 w-full object-cover" loading="lazy" width="900" height="600">
        <div class="p-4">
          <p class="text-xs font-semibold uppercase tracking-wide text-brand">${p.category}</p>
          <h3 class="mt-1 text-sm font-semibold text-slate-100">${p.name}</h3>
          <dl class="mt-3 grid grid-cols-2 gap-y-1.5 text-xs text-slate-400">
            <dt>Ціна</dt><dd class="text-right font-medium tabular-nums text-slate-200">${fmtUAH.format(p.price)}</dd>
            <dt>Продано</dt><dd class="text-right font-medium tabular-nums text-slate-200">${fmtInt.format(p.sold)} шт.</dd>
            <dt>Дохід</dt><dd class="text-right font-semibold tabular-nums text-slate-100">${fmtUAH.format(p.revenue)}</dd>
          </dl>
        </div>
      </article>`).join("");
  }

  /* ────────────────── Клієнти (customers.html) ────────────────── */
  function pageCustomers() {
    const store = D.createStore();
    const customers = D.createCustomerData(store);
    const body = $("customersBody");
    body.innerHTML = customers.map((c) => `
      <tr>
        <td class="whitespace-nowrap"><span class="flex items-center gap-2.5"><span class="avatar" style="${avatarStyle(c.name)}">${initialsOf(c.name)}</span><span class="font-medium text-slate-100">${c.name}</span></span></td>
        <td class="whitespace-nowrap text-slate-300">${c.city}</td>
        <td class="whitespace-nowrap text-right tabular-nums text-slate-300">${fmtInt.format(c.orders)}</td>
        <td class="whitespace-nowrap text-right font-semibold tabular-nums text-slate-100">${fmtUAH.format(c.ltv)}</td>
        <td class="whitespace-nowrap text-right text-slate-400">${c.last ? fmtDateFull.format(c.last) : "—"}</td>
      </tr>`).join("");
    $("customersMeta").textContent = `${fmtInt.format(customers.length)} клієнтів у базі`;
  }

  /* ────────────────── Налаштування (settings.html) ────────────────── */
  function pageSettings() {
    document.querySelectorAll(".toggle-switch").forEach((btn) => {
      btn.addEventListener("click", () => {
        const on = btn.getAttribute("aria-checked") === "true";
        btn.setAttribute("aria-checked", String(!on));
      });
    });
  }

  /* ────────────────── Вхід (login.html) ────────────────── */
  function pageLogin() {
    const form = $("loginForm");
    if (!form) return;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      window.location.href = "index.html";
    });
  }

  /* ────────────────── Підключення за сторінкою ────────────────── */
  const page = document.body.dataset.page;
  wireSidebar();
  const pages = {
    overview: pageOverview,
    transactions: pageTransactions,
    products: pageProducts,
    customers: pageCustomers,
    settings: pageSettings,
    login: pageLogin,
  };
  if (pages[page]) pages[page]();
})();
