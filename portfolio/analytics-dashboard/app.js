/* «Insight» — BI-дашборд · демо-дані та інтерактивність.
   Детермінований генератор (mulberry32), Chart.js v4 (інстанси оновлюються, не пересоздаються),
   таблиця транзакцій із сортуванням, пошуком і пагінацією. */

(() => {
  "use strict";

  /* ────────────────── PRNG (детермінований) ────────────────── */
  function mulberry32(seed) {
    return function () {
      let t = (seed += 0x6d2b79f5);
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /* ────────────────── Довідники ────────────────── */
  const CATEGORIES = ["Електроніка", "Одяг", "Дім", "Спорт", "Краса"];
  const CHANNELS = ["Сайт", "Instagram", "Маркетплейс", "Офлайн"];
  const CHANNEL_WEIGHTS = [0.38, 0.24, 0.22, 0.16];
  const CHANNEL_COLORS = ["#38bdf8", "#818cf8", "#34d399", "#fbbf24"];
  const CUSTOMERS = [
    "Олена Шевченко", "Андрій Коваленко", "Марія Бондаренко", "Тарас Мельник",
    "Ірина Ткаченко", "Дмитро Кравченко", "Софія Олійник", "Максим Шевчук",
    "Наталія Поліщук", "Олексій Бойко", "Катерина Лисенко", "Богдан Руденко",
    "Юлія Савченко", "Віктор Марченко", "Анна Клименко", "Роман Петренко",
    "Оксана Гончаренко", "Сергій Захарченко", "Тетяна Мороз", "Павло Литвиненко",
  ];
  const STATUS_BADGE = { "Оплачено": "badge-paid", "Повернення": "badge-refund", "Очікує": "badge-pending" };

  const VISIBLE_DAYS = 90; // максимальний період дашборда
  const HISTORY_DAYS = VISIBLE_DAYS * 2; // + прихована база для дельт «до попереднього періоду»
  const PAGE_SIZE = 10;

  const TODAY = new Date();
  TODAY.setHours(12, 0, 0, 0);

  /* ────────────────── Генерація даних ────────────────── */
  function generateData() {
    const rng = mulberry32(20260819);
    const txs = [];
    const sessionsByDaysAgo = {};
    let seq = 10000;
    for (let ago = HISTORY_DAYS - 1; ago >= 0; ago--) {
      const day = new Date(TODAY);
      day.setDate(day.getDate() - ago);
      let count = 3 + Math.floor(rng() * 10); // 3–12 транзакцій на день
      const wd = day.getDay();
      if (wd === 0 || wd === 6) count = Math.max(3, count - 3); // вихідні спокійніші
      const progress = 1 - ago / (HISTORY_DAYS - 1); // легкий висхідний тренд чека
      for (let i = 0; i < count; i++) {
        const rChannel = rng();
        let channel = CHANNELS[CHANNELS.length - 1];
        let acc = 0;
        for (let c = 0; c < CHANNELS.length; c++) {
          acc += CHANNEL_WEIGHTS[c];
          if (rChannel < acc) { channel = CHANNELS[c]; break; }
        }
        const rStatus = rng();
        const status = rStatus < 0.85 ? "Оплачено" : rStatus < 0.92 ? "Повернення" : "Очікує";
        const amount = Math.round(200 + Math.pow(rng(), 1.6) * 7800 * (0.82 + 0.18 * progress)); // 200–8000 ₴
        const date = new Date(day);
        date.setHours(8 + Math.floor(rng() * 14), Math.floor(rng() * 60), 0, 0);
        txs.push({
          date,
          daysAgo: ago,
          id: "TX-" + ++seq,
          customer: CUSTOMERS[Math.floor(rng() * CUSTOMERS.length)],
          category: CATEGORIES[Math.floor(rng() * CATEGORIES.length)],
          channel,
          amount,
          status,
        });
      }
      sessionsByDaysAgo[ago] = Math.round(count / (0.025 + rng() * 0.02));
    }
    return { txs, sessionsByDaysAgo };
  }

  /* ────────────────── Форматування ────────────────── */
  const fmtUAH = new Intl.NumberFormat("uk-UA", { style: "currency", currency: "UAH", currencyDisplay: "narrowSymbol", maximumFractionDigits: 0 });
  const fmtInt = new Intl.NumberFormat("uk-UA");
  const fmtCompact = new Intl.NumberFormat("uk-UA", { notation: "compact", maximumFractionDigits: 1 });
  const fmtPct1 = new Intl.NumberFormat("uk-UA", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  const fmtDayShort = new Intl.DateTimeFormat("uk-UA", { day: "2-digit", month: "2-digit" });
  const fmtDateFull = new Intl.DateTimeFormat("uk-UA", { day: "2-digit", month: "2-digit", year: "numeric" });
  const fmtTime = new Intl.DateTimeFormat("uk-UA", { hour: "2-digit", minute: "2-digit" });
  const fmtRangeDay = new Intl.DateTimeFormat("uk-UA", { day: "numeric", month: "short" });
  const fmtTooltipDay = new Intl.DateTimeFormat("uk-UA", { weekday: "short", day: "numeric", month: "long" });

  const plural = new Intl.PluralRules("uk-UA");
  const TX_WORDS = { one: "транзакція", few: "транзакції", many: "транзакцій", other: "транзакції" };
  const REC_WORDS = { one: "запис", few: "записи", many: "записів", other: "запису" };
  const word = (n, forms) => forms[plural.select(n)] || forms.many;

  const esc = (s) => String(s).replace(/[&<>"']/g, (ch) => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]
  ));

  /* ────────────────── Стан ────────────────── */
  const state = { period: 30, sortKey: "date", sortDir: "desc", query: "", page: 1 };
  const DEFAULT_DIR = { date: "desc", amount: "desc" }; // решта колонок — asc
  const { txs: ALL, sessionsByDaysAgo } = generateData();
  const charts = {};
  let labelDates = []; // дати точок лінійного графіка (для тултіпів)

  const $ = (id) => document.getElementById(id);
  const el = {
    kpiRevenue: $("kpiRevenue"), kpiRevenueDelta: $("kpiRevenueDelta"),
    kpiOrders: $("kpiOrders"), kpiOrdersDelta: $("kpiOrdersDelta"),
    kpiAvg: $("kpiAvg"), kpiAvgDelta: $("kpiAvgDelta"),
    kpiConversion: $("kpiConversion"), kpiConversionDelta: $("kpiConversionDelta"),
    rangeText: $("rangeText"), rangeCount: $("rangeCount"), periodChip: $("periodChip"),
    periodSwitch: $("periodSwitch"), channelLegend: $("channelLegend"),
    txHead: $("txHead"), txBody: $("txBody"), tableMeta: $("tableMeta"),
    searchInput: $("searchInput"), pageInfo: $("pageInfo"), pager: $("pager"),
    sidebar: $("sidebar"), backdrop: $("backdrop"),
    sidebarOpen: $("sidebarOpen"), sidebarClose: $("sidebarClose"),
  };

  /* ────────────────── Агрегації ────────────────── */
  function slicePeriod(period) {
    const cur = [];
    const prev = [];
    for (const t of ALL) {
      if (t.daysAgo < period) cur.push(t);
      else if (t.daysAgo < period * 2) prev.push(t);
    }
    return { cur, prev };
  }

  function sumSessions(minAgo, maxAgoExclusive) {
    let total = 0;
    for (let ago = minAgo; ago < maxAgoExclusive; ago++) total += sessionsByDaysAgo[ago] || 0;
    return total;
  }

  function kpisOf(list, sessionsSum) {
    let revenue = 0;
    for (const t of list) revenue += t.amount;
    const orders = list.length;
    return {
      revenue,
      orders,
      avg: orders ? revenue / orders : 0,
      conversion: sessionsSum ? (orders / sessionsSum) * 100 : 0,
    };
  }

  // Дохід за днями: index 0 — найстаріший день вікна. offset зсуває вікно назад.
  function revenueByDay(list, period, offset) {
    const out = new Array(period).fill(0);
    for (const t of list) out[period - 1 - (t.daysAgo - offset)] += t.amount;
    return out;
  }

  function sumBy(list, key, order) {
    const map = Object.create(null);
    for (const t of list) map[t[key]] = (map[t[key]] || 0) + t.amount;
    return order.map((k) => map[k] || 0);
  }

  /* ────────────────── KPI-дельти ────────────────── */
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

  /* ────────────────── Графіки (створюються один раз) ────────────────── */
  function tooltipOpts(extra) {
    return Object.assign({
      backgroundColor: "#0b1526",
      borderColor: "rgba(148, 163, 184, 0.18)",
      borderWidth: 1,
      titleColor: "#f1f5f9",
      titleFont: { weight: 600, size: 12 },
      bodyColor: "#cbd5e1",
      bodyFont: { size: 12 },
      padding: 12,
      cornerRadius: 10,
      boxPadding: 4,
      displayColors: true,
      usePointStyle: true,
    }, extra);
  }

  const centerTextPlugin = {
    id: "centerText",
    afterDraw(chart) {
      const c = chart.$center;
      if (!c) return;
      const { ctx, chartArea } = chart;
      const x = (chartArea.left + chartArea.right) / 2;
      const y = (chartArea.top + chartArea.bottom) / 2;
      ctx.save();
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = "600 11px Inter, sans-serif";
      ctx.fillStyle = "#64748b";
      ctx.fillText(c.label, x, y - 12);
      ctx.font = "700 17px Inter, sans-serif";
      ctx.fillStyle = "#f1f5f9";
      ctx.fillText(c.value, x, y + 8);
      ctx.restore();
    },
  };

  function initCharts() {
    Chart.defaults.font.family = "'Inter', system-ui, sans-serif";
    Chart.defaults.font.size = 12;
    Chart.defaults.color = "#94a3b8";
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      Chart.defaults.animation = false;
    }

    charts.line = new Chart($("lineChart"), {
      type: "line",
      data: {
        labels: [],
        datasets: [
          {
            label: "Поточний період",
            data: [],
            borderColor: "#38bdf8",
            backgroundColor(context) {
              const { ctx, chartArea } = context.chart;
              if (!chartArea) return "rgba(56, 189, 248, 0.15)";
              const g = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
              g.addColorStop(0, "rgba(56, 189, 248, 0.26)");
              g.addColorStop(1, "rgba(56, 189, 248, 0)");
              return g;
            },
            fill: true,
            tension: 0.35,
            borderWidth: 2.5,
            pointRadius: 0,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "#38bdf8",
            pointHoverBorderColor: "#0f172a",
            pointHoverBorderWidth: 2,
          },
          {
            label: "Попередній період",
            data: [],
            borderColor: "rgba(148, 163, 184, 0.45)",
            borderDash: [5, 5],
            fill: false,
            tension: 0.35,
            borderWidth: 1.5,
            pointRadius: 0,
            pointHoverRadius: 4,
            pointHoverBackgroundColor: "#94a3b8",
            pointHoverBorderColor: "#0f172a",
            pointHoverBorderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: "index", intersect: false },
        plugins: {
          legend: {
            position: "top",
            align: "end",
            labels: { boxWidth: 14, boxHeight: 2, padding: 16, font: { size: 11.5 } },
          },
          tooltip: tooltipOpts({
            callbacks: {
              title: (items) => (items.length ? fmtTooltipDay.format(labelDates[items[0].dataIndex]) : ""),
              label: (ctx) => ` ${ctx.dataset.label}: ${fmtUAH.format(ctx.parsed.y)}`,
            },
          }),
        },
        scales: {
          x: {
            grid: { display: false },
            border: { color: "rgba(148, 163, 184, 0.15)" },
            ticks: { maxTicksLimit: 10, maxRotation: 0, font: { size: 11 } },
          },
          y: {
            beginAtZero: true,
            grid: { color: "rgba(148, 163, 184, 0.08)" },
            border: { display: false },
            ticks: { maxTicksLimit: 6, font: { size: 11 }, callback: (v) => `${fmtCompact.format(v)} ₴` },
          },
        },
      },
    });

    charts.bar = new Chart($("barChart"), {
      type: "bar",
      data: {
        labels: CATEGORIES,
        datasets: [{
          label: "Дохід",
          data: [],
          backgroundColor: "rgba(56, 189, 248, 0.75)",
          hoverBackgroundColor: "#7dd3fc",
          borderRadius: { topLeft: 8, topRight: 8 },
          borderSkipped: false,
          maxBarThickness: 46,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: tooltipOpts({
            displayColors: false,
            callbacks: { label: (ctx) => ` ${fmtUAH.format(ctx.parsed.y)}` },
          }),
        },
        scales: {
          x: { grid: { display: false }, border: { color: "rgba(148, 163, 184, 0.15)" }, ticks: { font: { size: 11 } } },
          y: {
            beginAtZero: true,
            grid: { color: "rgba(148, 163, 184, 0.08)" },
            border: { display: false },
            ticks: { maxTicksLimit: 6, font: { size: 11 }, callback: (v) => `${fmtCompact.format(v)} ₴` },
          },
        },
      },
    });

    charts.doughnut = new Chart($("doughnutChart"), {
      type: "doughnut",
      data: {
        labels: CHANNELS,
        datasets: [{
          data: [],
          backgroundColor: CHANNEL_COLORS,
          borderColor: "#1e293b",
          borderWidth: 3,
          hoverBorderColor: "#1e293b",
          hoverOffset: 8,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "68%",
        layout: { padding: 8 },
        plugins: {
          legend: { display: false },
          tooltip: tooltipOpts({
            callbacks: {
              label(ctx) {
                const total = ctx.dataset.data.reduce((a, b) => a + b, 0) || 1;
                return ` ${ctx.label}: ${fmtUAH.format(ctx.parsed)} (${fmtPct1.format((ctx.parsed / total) * 100)}%)`;
              },
            },
          }),
        },
      },
      plugins: [centerTextPlugin],
    });
  }

  /* ────────────────── Рендер ────────────────── */
  function renderChannelLegend(values, total) {
    el.channelLegend.innerHTML = CHANNELS.map((name, i) => {
      const v = values[i];
      const pct = total ? (v / total) * 100 : 0;
      return `<li class="flex items-center gap-2.5 text-sm">
        <span class="h-2.5 w-2.5 shrink-0 rounded-full" style="background:${CHANNEL_COLORS[i]}"></span>
        <span class="text-slate-300">${name}</span>
        <span class="ml-auto font-medium tabular-nums text-slate-100">${fmtUAH.format(v)}</span>
        <span class="w-12 text-right text-xs tabular-nums text-slate-500">${fmtPct1.format(pct)}%</span>
      </li>`;
    }).join("");
  }

  function rangeLabel(period) {
    const start = new Date(TODAY);
    start.setDate(start.getDate() - (period - 1));
    const left = start.getFullYear() === TODAY.getFullYear()
      ? fmtRangeDay.format(start)
      : `${fmtRangeDay.format(start)} ${start.getFullYear()}`;
    return `${left} — ${fmtRangeDay.format(TODAY)} ${TODAY.getFullYear()}`;
  }

  function updateAll() {
    const period = state.period;
    const { cur, prev } = slicePeriod(period);
    const sessionsCur = sumSessions(0, period);
    const sessionsPrev = sumSessions(period, period * 2);
    const k = kpisOf(cur, sessionsCur);
    const kPrev = kpisOf(prev, sessionsPrev);

    // KPI
    el.kpiRevenue.textContent = fmtUAH.format(k.revenue);
    el.kpiOrders.textContent = fmtInt.format(k.orders);
    el.kpiAvg.textContent = fmtUAH.format(Math.round(k.avg));
    el.kpiConversion.textContent = `${fmtPct1.format(k.conversion)}%`;
    el.kpiRevenueDelta.innerHTML = deltaBadge(k.revenue, kPrev.revenue);
    el.kpiOrdersDelta.innerHTML = deltaBadge(k.orders, kPrev.orders);
    el.kpiAvgDelta.innerHTML = deltaBadge(k.avg, kPrev.avg);
    el.kpiConversionDelta.innerHTML = deltaBadge(k.conversion, kPrev.conversion, true);

    // Заголовок і чип
    el.rangeText.textContent = rangeLabel(period);
    el.rangeCount.textContent = `${fmtInt.format(k.orders)} ${word(k.orders, TX_WORDS)}`;
    el.periodChip.textContent = `Останні ${period} днів`;

    // Дати точок лінійного графіка
    labelDates = Array.from({ length: period }, (_, i) => {
      const d = new Date(TODAY);
      d.setDate(d.getDate() - (period - 1 - i));
      return d;
    });

    // Графіки: оновлення даних наявних інстансів (без пересоздання)
    charts.line.data.labels = labelDates.map((d) => fmtDayShort.format(d));
    charts.line.data.datasets[0].data = revenueByDay(cur, period, 0);
    charts.line.data.datasets[1].data = revenueByDay(prev, period, period);
    charts.line.update();

    charts.bar.data.datasets[0].data = sumBy(cur, "category", CATEGORIES);
    charts.bar.update();

    const byChannel = sumBy(cur, "channel", CHANNELS);
    charts.doughnut.data.datasets[0].data = byChannel;
    charts.doughnut.$center = { label: "Дохід", value: `${fmtCompact.format(k.revenue)} ₴` };
    charts.doughnut.update();
    renderChannelLegend(byChannel, k.revenue);

    renderTable();
  }

  /* ────────────────── Таблиця ────────────────── */
  const AVATAR_HUES = [199, 239, 160, 42, 350, 172];
  function avatarStyle(name) {
    let h = 0;
    for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
    const hue = AVATAR_HUES[h % AVATAR_HUES.length];
    return `background:hsla(${hue},70%,60%,.14);color:hsl(${hue},75%,72%)`;
  }
  const initialsOf = (name) => name.split(" ").map((w) => w[0]).slice(0, 2).join("");

  function filteredSortedRows() {
    let rows = ALL.filter((t) => t.daysAgo < state.period);
    const q = state.query.trim().toLowerCase();
    if (q) {
      rows = rows.filter((t) => t.customer.toLowerCase().includes(q) || t.id.toLowerCase().includes(q));
    }
    const dir = state.sortDir === "asc" ? 1 : -1;
    const key = state.sortKey;
    rows.sort((a, b) => {
      let r;
      if (key === "amount") r = a.amount - b.amount;
      else if (key === "date") r = a.date - b.date || a.id.localeCompare(b.id);
      else r = String(a[key]).localeCompare(String(b[key]), "uk") || (a.date - b.date);
      return r * dir;
    });
    return rows;
  }

  function rowHtml(t) {
    return `<tr>
      <td class="whitespace-nowrap tabular-nums text-slate-300">${fmtDateFull.format(t.date)} <span class="text-xs text-slate-500">${fmtTime.format(t.date)}</span></td>
      <td class="whitespace-nowrap font-mono text-xs text-slate-500">${t.id}</td>
      <td class="whitespace-nowrap"><span class="flex items-center gap-2.5"><span class="avatar" style="${avatarStyle(t.customer)}">${initialsOf(t.customer)}</span><span class="font-medium text-slate-100">${t.customer}</span></span></td>
      <td class="whitespace-nowrap text-slate-300">${t.category}</td>
      <td class="whitespace-nowrap text-slate-400">${t.channel}</td>
      <td class="whitespace-nowrap text-right font-semibold tabular-nums text-slate-100">${fmtUAH.format(t.amount)}</td>
      <td class="whitespace-nowrap"><span class="badge ${STATUS_BADGE[t.status]}">${t.status}</span></td>
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

  function renderPager(pages) {
    const cur = state.page;
    let html = `<button class="pg-btn" type="button" data-page="${cur - 1}" ${cur === 1 ? "disabled" : ""} aria-label="Попередня сторінка">‹</button>`;
    for (const p of pageList(pages, cur)) {
      html += p === "…"
        ? '<span class="pg-gap" aria-hidden="true">…</span>'
        : `<button class="pg-btn${p === cur ? " active" : ""}" type="button" data-page="${p}" ${p === cur ? 'aria-current="page"' : ""}>${p}</button>`;
    }
    html += `<button class="pg-btn" type="button" data-page="${cur + 1}" ${cur === pages ? "disabled" : ""} aria-label="Наступна сторінка">›</button>`;
    el.pager.innerHTML = html;
  }

  function syncSortHeaders() {
    el.txHead.querySelectorAll(".th-btn").forEach((btn) => {
      const th = btn.closest("th");
      const ind = btn.querySelector(".sort-ind");
      if (btn.dataset.key === state.sortKey) {
        btn.classList.add("sorted");
        ind.textContent = state.sortDir === "asc" ? "▲" : "▼";
        th.setAttribute("aria-sort", state.sortDir === "asc" ? "ascending" : "descending");
      } else {
        btn.classList.remove("sorted");
        ind.textContent = "";
        th.removeAttribute("aria-sort");
      }
    });
  }

  function renderTable() {
    const periodTotal = ALL.reduce((n, t) => n + (t.daysAgo < state.period ? 1 : 0), 0);
    const rows = filteredSortedRows();
    const total = rows.length;
    const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    if (state.page > pages) state.page = pages;
    if (state.page < 1) state.page = 1;
    const from = (state.page - 1) * PAGE_SIZE;
    const slice = rows.slice(from, from + PAGE_SIZE);

    el.txBody.innerHTML = slice.length
      ? slice.map(rowHtml).join("")
      : `<tr><td colspan="7" class="px-4 py-10 text-center text-sm text-slate-500">Нічого не знайдено за запитом «${esc(state.query.trim())}»</td></tr>`;

    el.tableMeta.textContent = state.query.trim()
      ? `Знайдено ${fmtInt.format(total)} із ${fmtInt.format(periodTotal)}`
      : `${fmtInt.format(periodTotal)} ${word(periodTotal, REC_WORDS)} за обраний період`;

    el.pageInfo.textContent = total
      ? `Показано ${fmtInt.format(from + 1)}–${fmtInt.format(from + slice.length)} із ${fmtInt.format(total)}`
      : "Немає записів";

    renderPager(pages);
    syncSortHeaders();
  }

  /* ────────────────── Події ────────────────── */
  function bindEvents() {
    // Перемикач періоду
    el.periodSwitch.addEventListener("click", (e) => {
      const btn = e.target.closest(".seg-btn");
      if (!btn) return;
      const period = Number(btn.dataset.period);
      if (period === state.period) return;
      state.period = period;
      state.page = 1;
      el.periodSwitch.querySelectorAll(".seg-btn").forEach((b) => {
        const active = b === btn;
        b.classList.toggle("active", active);
        b.setAttribute("aria-pressed", String(active));
      });
      updateAll();
    });

    // Сортування
    el.txHead.addEventListener("click", (e) => {
      const btn = e.target.closest(".th-btn");
      if (!btn) return;
      const key = btn.dataset.key;
      if (state.sortKey === key) {
        state.sortDir = state.sortDir === "asc" ? "desc" : "asc";
      } else {
        state.sortKey = key;
        state.sortDir = DEFAULT_DIR[key] || "asc";
      }
      state.page = 1;
      renderTable();
    });

    // Пошук
    const onSearch = () => {
      const q = el.searchInput.value;
      if (q === state.query) return;
      state.query = q;
      state.page = 1;
      renderTable();
    };
    el.searchInput.addEventListener("input", onSearch);
    el.searchInput.addEventListener("search", onSearch);

    // Пагінація
    el.pager.addEventListener("click", (e) => {
      const btn = e.target.closest(".pg-btn");
      if (!btn || btn.disabled) return;
      const page = Number(btn.dataset.page);
      if (!Number.isFinite(page) || page === state.page) return;
      state.page = page;
      renderTable();
    });

    // Мобільний сайдбар
    const openNav = () => {
      document.body.classList.add("nav-open");
      el.sidebarOpen.setAttribute("aria-expanded", "true");
      el.sidebarClose.focus();
    };
    const closeNav = (refocus) => {
      if (!document.body.classList.contains("nav-open")) return;
      document.body.classList.remove("nav-open");
      el.sidebarOpen.setAttribute("aria-expanded", "false");
      if (refocus) el.sidebarOpen.focus();
    };
    el.sidebarOpen.addEventListener("click", openNav);
    el.sidebarClose.addEventListener("click", () => closeNav(true));
    el.backdrop.addEventListener("click", () => closeNav(false));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeNav(true);
    });
    window.matchMedia("(min-width: 1024px)").addEventListener("change", (e) => {
      if (e.matches) closeNav(false);
    });

    // Декоративні пункти меню (демо)
    document.querySelectorAll("[data-decorative]").forEach((a) => {
      a.addEventListener("click", (e) => e.preventDefault());
    });
  }

  /* ────────────────── Старт ────────────────── */
  initCharts();
  bindEvents();
  updateAll();
})();
