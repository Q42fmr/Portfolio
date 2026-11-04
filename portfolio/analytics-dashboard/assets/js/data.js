/* «Insight» — BI-дашборд · спільні дані.
   Детермінований генератор (mulberry32): усі сторінки (огляд, транзакції, товари, клієнти)
   читають той самий масив транзакцій `store.all`, тому підсумки узгоджені між сторінками. */

window.Insight = (() => {
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

  /* ────────────────── Конфігурація (незмінна) ────────────────── */
  const CONFIG = Object.freeze({
    seed: 20260819,
    categories: Object.freeze(["Електроніка", "Одяг", "Дім", "Спорт", "Краса"]),
    channels: Object.freeze(["Сайт", "Instagram", "Маркетплейс", "Офлайн"]),
    channelWeights: Object.freeze([0.38, 0.24, 0.22, 0.16]),
    channelColors: Object.freeze(["#38bdf8", "#818cf8", "#34d399", "#fbbf24"]),
    customers: Object.freeze([
      "Олена Шевченко", "Андрій Коваленко", "Марія Бондаренко", "Тарас Мельник",
      "Ірина Ткаченко", "Дмитро Кравченко", "Софія Олійник", "Максим Шевчук",
      "Наталія Поліщук", "Олексій Бойко", "Катерина Лисенко", "Богдан Руденко",
      "Юлія Савченко", "Віктор Марченко", "Анна Клименко", "Роман Петренко",
      "Оксана Гончаренко", "Сергій Захарченко", "Тетяна Мороз", "Павло Литвиненко",
    ]),
    cities: Object.freeze([
      "Київ", "Львів", "Харків", "Одеса", "Дніпро", "Вінниця", "Полтава",
      "Івано-Франківськ", "Чернівці", "Ужгород",
    ]),
    statusBadge: Object.freeze({ "Оплачено": "badge-paid", "Повернення": "badge-refund", "Очікує": "badge-pending" }),
    visibleDays: 90, // максимальний період дашборда
    get historyDays() { return this.visibleDays * 2; }, // + прихована база для дельт «до попереднього періоду»
    pageSize: 10,
    defaultDir: Object.freeze({ date: "desc", amount: "desc" }), // решта колонок — asc
    avatarHues: Object.freeze([199, 239, 160, 42, 350, 172]),
    products: Object.freeze([
      { id: "P-01", name: "Бездротові навушники AirSound", category: "Електроніка", price: 1890, img: "assets/img/product-headphones.jpg" },
      { id: "P-02", name: "Розумний годинник PulseFit", category: "Електроніка", price: 4290, img: "assets/img/product-smartwatch.jpg" },
      { id: "P-03", name: "Кросівки Urban White", category: "Одяг", price: 2390, img: "assets/img/product-sneakers.jpg" },
      { id: "P-04", name: "Сонцезахисні окуляри Aviator", category: "Одяг", price: 1290, img: "assets/img/product-sunglasses.jpg" },
      { id: "P-05", name: "Керамічна чашка Morning", category: "Дім", price: 320, img: "assets/img/product-mug.jpg" },
      { id: "P-06", name: "Кімнатна рослина в горщику", category: "Дім", price: 540, img: "assets/img/product-houseplant.jpg" },
      { id: "P-07", name: "Блокнот канцелярський Craft", category: "Дім", price: 210, img: "assets/img/product-notebook.jpg" },
      { id: "P-08", name: "Рюкзак міський Commuter", category: "Спорт", price: 1690, img: "assets/img/product-backpack.jpg" },
    ]),
  });

  const TODAY = new Date();
  TODAY.setHours(12, 0, 0, 0);

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

  /* ────────────────── Store: генерація даних + стан періоду/таблиці ────────────────── */
  function createStore() {
    const rng = mulberry32(CONFIG.seed);
    const all = [];
    const sessionsByDaysAgo = {};
    let seq = 10000;
    for (let ago = CONFIG.historyDays - 1; ago >= 0; ago--) {
      const day = new Date(TODAY);
      day.setDate(day.getDate() - ago);
      let count = 3 + Math.floor(rng() * 10); // 3–12 транзакцій на день
      const wd = day.getDay();
      if (wd === 0 || wd === 6) count = Math.max(3, count - 3); // вихідні спокійніші
      const progress = 1 - ago / (CONFIG.historyDays - 1); // легкий висхідний тренд чека
      for (let i = 0; i < count; i++) {
        const rChannel = rng();
        let channel = CONFIG.channels[CONFIG.channels.length - 1];
        let acc = 0;
        for (let c = 0; c < CONFIG.channels.length; c++) {
          acc += CONFIG.channelWeights[c];
          if (rChannel < acc) { channel = CONFIG.channels[c]; break; }
        }
        const rStatus = rng();
        const status = rStatus < 0.85 ? "Оплачено" : rStatus < 0.92 ? "Повернення" : "Очікує";
        const amount = Math.round(200 + Math.pow(rng(), 1.6) * 7800 * (0.82 + 0.18 * progress)); // 200–8000 ₴
        const date = new Date(day);
        date.setHours(8 + Math.floor(rng() * 14), Math.floor(rng() * 60), 0, 0);
        const customerIdx = Math.floor(rng() * CONFIG.customers.length);
        all.push({
          date,
          daysAgo: ago,
          id: "TX-" + ++seq,
          customer: CONFIG.customers[customerIdx],
          customerIdx,
          category: CONFIG.categories[Math.floor(rng() * CONFIG.categories.length)],
          channel,
          amount,
          status,
        });
      }
      sessionsByDaysAgo[ago] = Math.round(count / (0.025 + rng() * 0.02));
    }

    const state = { period: 30, sortKey: "date", sortDir: "desc", query: "", page: 1, status: "" };

    function slicePeriod(period) {
      const cur = [];
      const prev = [];
      for (const t of all) {
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

    function filteredSortedRows() {
      let rows = all.filter((t) => t.daysAgo < state.period);
      if (state.status) rows = rows.filter((t) => t.status === state.status);
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

    return {
      all,
      state,
      slicePeriod,
      sumSessions,
      kpisOf,
      revenueByDay,
      sumBy,
      filteredSortedRows,
      setPeriod(period) { state.period = period; state.page = 1; },
      setSort(key) {
        if (state.sortKey === key) {
          state.sortDir = state.sortDir === "asc" ? "desc" : "asc";
        } else {
          state.sortKey = key;
          state.sortDir = CONFIG.defaultDir[key] || "asc";
        }
        state.page = 1;
      },
      setQuery(q) { state.query = q; state.page = 1; },
      setStatus(s) { state.status = s; state.page = 1; },
      setPage(p) { state.page = p; },
    };
  }

  /* ────────────────── Похідні дані: товари ────────────────── */
  // Кількість проданих одиниць — із власного детермінованого потоку на основі CONFIG.seed,
  // тому значення незмінні між завантаженнями сторінки (той самий сид, що й у транзакцій).
  function createProductData() {
    const rng = mulberry32(CONFIG.seed + 777);
    return CONFIG.products.map((p) => {
      const sold = 60 + Math.floor(rng() * 540);
      const revenue = sold * p.price;
      return { ...p, sold, revenue };
    });
  }

  /* ────────────────── Похідні дані: клієнти ────────────────── */
  // Кількість замовлень і LTV рахуються з того самого масиву транзакцій `store.all`,
  // тому підсумки клієнтів узгоджені з таблицею транзакцій.
  function createCustomerData(store) {
    const rng = mulberry32(CONFIG.seed + 42);
    const byIdx = new Map();
    for (const t of store.all) {
      if (t.status === "Повернення") continue;
      const rec = byIdx.get(t.customerIdx) || { orders: 0, ltv: 0, last: t.date };
      rec.orders += 1;
      rec.ltv += t.amount;
      if (t.date > rec.last) rec.last = t.date;
      byIdx.set(t.customerIdx, rec);
    }
    return CONFIG.customers.map((name, i) => {
      const rec = byIdx.get(i) || { orders: 0, ltv: 0, last: null };
      return {
        name,
        city: CONFIG.cities[Math.floor(rng() * CONFIG.cities.length)],
        orders: rec.orders,
        ltv: rec.ltv,
        last: rec.last,
      };
    }).sort((a, b) => b.ltv - a.ltv);
  }

  function initialsOf(name) { return name.split(" ").map((w) => w[0]).slice(0, 2).join(""); }

  function avatarStyle(name) {
    let h = 0;
    for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
    const hue = CONFIG.avatarHues[h % CONFIG.avatarHues.length];
    return `background:hsla(${hue},70%,60%,.14);color:hsl(${hue},75%,72%)`;
  }

  return {
    mulberry32, CONFIG, TODAY,
    fmtUAH, fmtInt, fmtCompact, fmtPct1, fmtDayShort, fmtDateFull, fmtTime, fmtRangeDay, fmtTooltipDay,
    word, TX_WORDS, REC_WORDS, esc,
    createStore, createProductData, createCustomerData,
    initialsOf, avatarStyle,
  };
})();
