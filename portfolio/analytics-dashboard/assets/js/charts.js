/* «Insight» — BI-дашборд · графіки (Chart.js v4).
   Інстанси створюються один раз і надалі лише оновлюються даними (без пересоздання). */

window.InsightCharts = (() => {
  "use strict";
  const D = window.Insight;
  const { CONFIG, fmtUAH, fmtCompact, fmtPct1, fmtDayShort, fmtTooltipDay } = D;

  let labelDates = []; // дати точок лінійного графіка (для тултіпів)

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

  function createCharts($) {
    Chart.defaults.font.family = "'Inter', system-ui, sans-serif";
    Chart.defaults.font.size = 12;
    Chart.defaults.color = "#94a3b8";
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      Chart.defaults.animation = false;
    }

    const line = new Chart($("lineChart"), {
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

    const bar = new Chart($("barChart"), {
      type: "bar",
      data: {
        labels: CONFIG.categories,
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

    const doughnut = new Chart($("doughnutChart"), {
      type: "doughnut",
      data: {
        labels: CONFIG.channels,
        datasets: [{
          data: [],
          backgroundColor: CONFIG.channelColors,
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

    return { line, bar, doughnut };
  }

  function renderChannelLegend(el, values, total) {
    el.innerHTML = CONFIG.channels.map((name, i) => {
      const v = values[i];
      const pct = total ? (v / total) * 100 : 0;
      return `<li class="flex items-center gap-2.5 text-sm">
        <span class="h-2.5 w-2.5 shrink-0 rounded-full" style="background:${CONFIG.channelColors[i]}"></span>
        <span class="text-slate-300">${name}</span>
        <span class="ml-auto font-medium tabular-nums text-slate-100">${fmtUAH.format(v)}</span>
        <span class="w-12 text-right text-xs tabular-nums text-slate-500">${fmtPct1.format(pct)}%</span>
      </li>`;
    }).join("");
  }

  function renderCharts(charts, store, period, cur, prev, k, legendEl) {
    labelDates = Array.from({ length: period }, (_, i) => {
      const d = new Date(D.TODAY);
      d.setDate(d.getDate() - (period - 1 - i));
      return d;
    });

    charts.line.data.labels = labelDates.map((d) => fmtDayShort.format(d));
    charts.line.data.datasets[0].data = store.revenueByDay(cur, period, 0);
    charts.line.data.datasets[1].data = store.revenueByDay(prev, period, period);
    charts.line.update();

    charts.bar.data.datasets[0].data = store.sumBy(cur, "category", CONFIG.categories);
    charts.bar.update();

    const byChannel = store.sumBy(cur, "channel", CONFIG.channels);
    charts.doughnut.data.datasets[0].data = byChannel;
    charts.doughnut.$center = { label: "Дохід", value: `${fmtCompact.format(k.revenue)} ₴` };
    charts.doughnut.update();
    renderChannelLegend(legendEl, byChannel, k.revenue);
  }

  return { createCharts, renderCharts };
})();
