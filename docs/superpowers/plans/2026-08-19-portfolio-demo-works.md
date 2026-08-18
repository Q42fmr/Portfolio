# Portfolio Demo Works Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Замінити заглушки портфоліо шістьма реальними інтерактивними демо-проєктами (магазин, 2 лендінги, портфоліо фотографа, студія танцю, BI-дашборд) і підключити їх до карток головної сторінки з реальними скріншотами.

**Architecture:** Кожне демо — самодостатня папка `portfolio/<slug>/` зі своїм брендингом. Магазин — Vue 3 + Vite (source в `apps/plant-shop/`, committed build). Решта — static HTML + Tailwind CDN + vanilla JS. Інтеграція через масиви `PROJECTS_UA`/`PROJECTS_EN` у спільному `assets/js/main.js`.

**Tech Stack:** HTML5, Tailwind CDN, vanilla JS, Vue 3 + Vite (тільки магазин), Chart.js v4 CDN (тільки дашборд), Google Fonts.

**Spec:** `docs/superpowers/specs/2026-08-19-portfolio-demo-works-design.md`

## Global Constraints

- Гілка: `stage` (реліз-процес користувача; worktree-ізоляція не потрібна — це задокументований робочий процес репо).
- Мова контенту демо: українська; `<html lang="uk">`.
- Кожне демо містить у футері текст: `Демо-проєкт для портфоліо` і посилання `← До портфоліо` на `../../index.html#projects`.
- Без вигаданих реальних клієнтів/брендів (NDA-safe). Телефони формату `+380 (XX) XXX-XX-XX`, адреси вигадані («м. Київ, вул. Прикладна, 1»).
- Зовнішні залежності ТІЛЬКИ: `https://cdn.tailwindcss.com`, Google Fonts, `https://cdn.jsdelivr.net/npm/chart.js@4` (лише дашборд), `https://picsum.photos` (лише фотограф).
- Статичні демо: структура `portfolio/<slug>/index.html` + `style.css` + `app.js` (лінки відносні: `./style.css`, `./app.js`).
- Адаптивність: перевірка на 390×844 і 1280×800; мобільне меню-бургер там, де є navbar.
- Нуль помилок у консолі браузера при відкритті та кліках.
- Slug-и зафіксовані: `plant-shop`, `saas-landing`, `coffee-landing`, `photographer-portfolio`, `dance-studio`, `analytics-dashboard`.
- Кожен `<head>`: `charset`, `viewport`, `<title>`, `<meta name="description">` українською.
- Tailwind CDN конфіг у кожному демо задає брендовий колір через `tailwind.config = { theme: { extend: { colors: { brand: "<hex>" } } } }`.
- НЕ запускати глобальні лінтери/форматери/тести — фінальна верифікація одним проходом у Task 9.

---

### Task 1: «Verde» — магазин рослин (Vue 3 + Vite)

**Files:**
- Create: `apps/plant-shop/package.json`, `apps/plant-shop/vite.config.js`, `apps/plant-shop/index.html`, `apps/plant-shop/src/main.js`, `apps/plant-shop/src/App.vue`, `apps/plant-shop/src/data/products.js`, `apps/plant-shop/src/components/*.vue` (за потреби)
- Generated: `portfolio/plant-shop/` (build-артефакт, комітиться)

**Interfaces:**
- Produces: працююча сторінка за `portfolio/plant-shop/index.html`, що відкривається з відносних шляхів (без dev-сервера).

- [ ] **Step 1: Scaffold**

`apps/plant-shop/package.json`:
```json
{
  "name": "plant-shop",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": { "dev": "vite", "build": "vite build", "preview": "vite preview" },
  "dependencies": { "vue": "^3.5.13" },
  "devDependencies": { "@vitejs/plugin-vue": "^5.2.1", "vite": "^6.0.0" }
}
```

`apps/plant-shop/vite.config.js`:
```js
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  base: "./",
  build: { outDir: "../../portfolio/plant-shop", emptyOutDir: true }
});
```

Виконати `npm install` у `apps/plant-shop/`. Додати `apps/plant-shop/node_modules` у корінний `.gitignore`, якщо `node_modules` ще не ігнорується глобально.

- [ ] **Step 2: Дані товарів**

`src/data/products.js` — експорт `PRODUCTS`: 12 обʼєктів `{ id, name, price, category, description, care, svg }`. Категорії: `large` (Монстера Деліціоза 899, Фікус Лірата 749, Стреліція 1299), `succulent` (Сансевієрія 349, Ехеверія 199, Хавортія 179, Кактус Опунція 229), `flowering` (Спатифілум 429, Антуріум 599, Орхідея Фаленопсис 699), `accessory` (Кашпо керамічне 299, Набір для догляду 399). `svg` — інлайн SVG-рядок ілюстрації (стилізовані листя/горщик, 2–4 кольори, viewBox="0 0 200 200"; для кожного товару свій силует/колір). `care` — 2–3 речення догляду.

- [ ] **Step 3: App.vue — каталог, фільтри, кошик, checkout**

Функціонал (Composition API, `ref`/`computed`):
- Hero: назва «Verde», слоган, CTA «До каталогу» (анкор).
- Панель фільтрів: категорія (кнопки: Усі / Великі рослини / Сукуленти / Квітучі / Аксесуари), пошук за назвою (input), сортування (select: «За назвою», «Ціна ↑», «Ціна ↓»), максимальна ціна (range 100–1500 з поточним значенням).
- `filteredProducts` — computed, що застосовує всі 4 фільтри послідовно.
- Grid карток товарів: SVG, назва, ціна `XXX ₴`, кнопка «У кошик», клік по картці → модал товару (опис + догляд + «У кошик»).
- Кошик-drawer справа: список позицій із кількістю (+/−), видалення, підсумок; бейдж кількості на іконці кошика в хедері.
- Persist: `watch` кошика → `localStorage.setItem("verde-cart", JSON.stringify(...))`; ініціалізація з localStorage у try/catch.
- Checkout: кнопка «Оформити замовлення» в drawer → форма (імʼя ≥2 символів, телефон regex `/^\+?[\d\s()-]{10,}$/`, email regex, адреса ≥5 символів); помилки під полями; успіх → екран «Дякуємо! Замовлення №<random> прийнято» + очищення кошика.
- Футер: бейдж «Демо-проєкт для портфоліо» + `← До портфоліо` → `../../index.html#projects`.
- Палітра: brand `#16a34a`, фони кремові `#fdfbf7`, Google Font «Nunito» (заголовки) через `<link>` в `index.html`. Tailwind: у Vite-проєкті БЕЗ CDN — писати стилі у scoped `<style>` App.vue або звичайний CSS (Tailwind CDN у build непотрібен; простий CSS прийнятний і легший).

- [ ] **Step 4: Build і перевірка**

Run: `npm run build` (cwd `apps/plant-shop`). Expected: `portfolio/plant-shop/index.html` + `assets/*` створені.
Відкрити `portfolio/plant-shop/index.html` браузером: каталог рендериться, фільтр «Сукуленти» лишає 4 товари, пошук «монстера» — 1, кошик додає/зберігається після reload, checkout валідує і показує success. Консоль чиста.

- [ ] **Step 5: Commit**

```bash
git add apps/plant-shop portfolio/plant-shop .gitignore
git commit -m "feat: add Verde plant shop demo (Vue 3 + Vite)"
```

---

### Task 2: «Pulse» — SaaS-лендінг

**Files:**
- Create: `portfolio/saas-landing/index.html`, `portfolio/saas-landing/style.css`, `portfolio/saas-landing/app.js`

**Interfaces:**
- Produces: сторінка за `portfolio/saas-landing/index.html`.

- [ ] **Step 1: Розмітка**

Секції по порядку:
1. Navbar: лого «Pulse», анкори (Можливості, Як працює, Тарифи, FAQ), CTA «Спробувати», бургер на mobile.
2. Hero: H1 «Аналітика продажів для малого бізнесу», підзаголовок, 2 CTA; праворуч CSS-мокап дашборда (стилізовані div-бари/лінії, без зображень).
3. Стрічка «Нам довіряють»: 5 текстових псевдо-лого (сірі, generic: «Craft&Co», «Bloomly», …).
4. Features: 6 карток (Звіти в реальному часі; Інтеграція з CRM; Прогноз продажів; Дашборди без коду; Експорт у Excel/PDF; Сповіщення у Telegram) — іконки інлайн SVG.
5. How-it-works: 3 пронумеровані кроки (Підключіть дані → Оберіть шаблон → Отримуйте звіти).
6. Pricing: перемикач «Щомісяця / Щороку −20%»; 3 плани: Старт 0 ₴, Бізнес 499 ₴/міс (виділений «Популярний»), Про 999 ₴/міс; річні ціни = міс×12×0.8, оновлюються в DOM.
7. Testimonials: 3 відгуки (імʼя, роль, текст).
8. FAQ: 5 питань, акордеон.
9. CTA-блок з формою email (валідація regex, success-повідомлення).
10. Footer з бейджем демо.

Палітра: brand `#6366f1`, світлий фон, Google Font «Manrope».

- [ ] **Step 2: app.js**

- `initMenu()` — бургер.
- `initPricing()` — toggle перемикає data-атрибути `data-monthly`/`data-yearly` у цінах.
- `initAccordion()` — один відкритий пункт, aria-expanded.
- `initReveal()` — IntersectionObserver додає клас `.visible` (CSS: opacity/translate transition).
- `initForm()` — email-валідація + success.

- [ ] **Step 3: Перевірка браузером**

Відкрити сторінку: перемикач цін міняє суми (499→399, 999→799 на «щороку»), акордеон працює, reveal-анімації спрацьовують при скролі, форма валідує. Mobile 390px: бургер відкриває меню. Консоль чиста.

- [ ] **Step 4: Commit**

```bash
git add portfolio/saas-landing
git commit -m "feat: add Pulse SaaS landing demo"
```

---

### Task 3: «KAVA Roasters» — лендінг кав'ярні

**Files:**
- Create: `portfolio/coffee-landing/index.html`, `portfolio/coffee-landing/style.css`, `portfolio/coffee-landing/app.js`

**Interfaces:**
- Produces: сторінка за `portfolio/coffee-landing/index.html`.

- [ ] **Step 1: Розмітка**

Секції:
1. Navbar (лого «KAVA Roasters», анкори: Меню, Про нас, Галерея, Контакти; бургер).
2. Hero: H1 «Свіжообсмажена кава у центрі міста», CTA «Забронювати столик», фон — CSS-градієнт + SVG-зерна.
3. Про нас: 2 колонки (текст обсмажувальні + 3 цифри-факти: «12 сортів», «48 год від обсмаження», «2019 рік заснування»).
4. Меню з табами: Кава (еспресо 65 ₴, капучино 85, фільтр 75, флет вайт 90, раф 95), Десерти (чізкейк 120, круасан 75, тірамісу 130), Зерно на вагу (Ефіопія 420 ₴/250г, Колумбія 390, Бленд дому 350). Таби перемикають видимість списків.
5. Галерея: 6 SVG/CSS-арт плиток (чашка, зерна, турка, пакет зерна, латте-арт, кавомолка).
6. Відгуки: 3 картки.
7. Контакти: адреса, години (Пн–Пт 8:00–21:00, Сб–Нд 9:00–22:00), телефон; мапа-плейсхолдер (div з сіткою і піном).
8. Форма бронювання: імʼя, телефон, дата (input type="date", min=сьогодні), кількість гостей (select 1–8); валідація + success.
9. Footer з бейджем демо.

Палітра: brand `#92400e`, крем `#fbf7f0`, Google Fonts «Playfair Display» (заголовки) + «Inter».

- [ ] **Step 2: app.js** — `initMenu()`, `initTabs()` (aria-selected), `initBookingForm()` (валідація: імʼя ≥2, телефон як у Task 1, дата ≥ сьогодні).

- [ ] **Step 3: Перевірка браузером** — таби перемикають меню, форма відхиляє вчорашню дату і порожнє імʼя, success показується; mobile ok; консоль чиста.

- [ ] **Step 4: Commit**

```bash
git add portfolio/coffee-landing
git commit -m "feat: add KAVA Roasters coffee landing demo"
```

---

### Task 4: «Anna Kovalenko» — портфоліо фотографа

**Files:**
- Create: `portfolio/photographer-portfolio/index.html`, `portfolio/photographer-portfolio/style.css`, `portfolio/photographer-portfolio/app.js`

**Interfaces:**
- Produces: сторінка за `portfolio/photographer-portfolio/index.html`.

- [ ] **Step 1: Розмітка + дані галереї**

Секції: Navbar (Портфоліо, Про мене, Послуги, Контакти) → Hero (імʼя, «Весільний та портретний фотограф, Київ», фото-хедер picsum) → Галерея → Про мене (текст + портрет) → Послуги: 3 пакети (Портретна зйомка 2500 ₴/год; Весільний день 15000 ₴; Love story 4500 ₴) → Відгуки (3) → Контакт-форма (імʼя, email, дата, повідомлення) → Footer з бейджем демо.

Галерея: масив в `app.js` — 12 обʼєктів `{ id, genre, title }`, genre ∈ `wedding|portrait|street|nature` (по 3). URL зображення: `https://picsum.photos/seed/anna-<id>/600/<h>`, h варіюється (400/600/800) для masonry (CSS `columns: 3` / 1 на mobile). `loading="lazy"`, `onerror` → клас із сірим фоном і підписом жанру.

Фільтр: кнопки Усі/Весілля/Портрет/Стріт/Природа — показ/приховування за `data-genre`.

Lightbox: клік по фото → повноекранний оверлей із зображенням `https://picsum.photos/seed/anna-<id>/1200/800`, підписом, кнопками ‹ › та ✕; клавіші ←/→/Esc; навігація в межах відфільтрованого набору.

Палітра: чорно-біла, Google Fonts «Cormorant Garamond» (заголовки) + «Inter».

- [ ] **Step 2: app.js** — `renderGallery(genre)`, `initFilter()`, `initLightbox()` (делегування кліків, keydown-обробник), `initForm()`.

- [ ] **Step 3: Перевірка браузером** — фільтр «Портрет» лишає 3 фото; lightbox відкривається, ←/→ гортають тільки відфільтровані, Esc закриває; mobile: одна колонка. Консоль чиста.

- [ ] **Step 4: Commit**

```bash
git add portfolio/photographer-portfolio
git commit -m "feat: add photographer portfolio demo"
```

---

### Task 5: «Flow» — студія танцю

**Files:**
- Create: `portfolio/dance-studio/index.html`, `portfolio/dance-studio/style.css`, `portfolio/dance-studio/app.js`

**Interfaces:**
- Produces: сторінка за `portfolio/dance-studio/index.html`.

- [ ] **Step 1: Розмітка + дані розкладу**

Секції: Navbar (Напрямки, Розклад, Тренери, Ціни, Контакти) → Hero («Танцюй так, ніби всі дивляться», CTA «Пробне заняття — безкоштовно») → Напрямки: 5 карток (Hip-Hop, Contemporary, High Heels, Breaking, Kids 6–10) з коротким описом → Розклад → Тренери: 4 картки (імʼя, стиль, досвід; аватар — SVG-силует) → Абонементи: Разове 250 ₴ / 8 занять 1600 ₴ (виділений) / Безліміт 2400 ₴/міс → Форма запису на пробне (стиль select, імʼя, телефон) → FAQ (4 питання, акордеон) → Footer з бейджем демо.

Розклад — масив у `app.js`, ~20 записів `{ day: 1..7, time: "19:00", style, level, trainer }`, стилі відповідають напрямкам, рівні `Початківці|Продовжуючі|Всі рівні`. Рендер: сітка 7 колонок (Пн–Нд) на desktop, вертикальний список за днями на mobile.

Фільтри розкладу: селект «Стиль» (Усі + 5) і «Рівень» (Усі + 3) → перерендер; порожній день показує «—».

Палітра: темний фон `#0a0a0f`, brand-акценти `#ec4899` і `#8b5cf6`, Google Font «Unbounded» (заголовки).

- [ ] **Step 2: app.js** — `renderSchedule(styleFilter, levelFilter)`, `initScheduleFilters()`, `initMenu()`, `initAccordion()`, `initTrialForm()` (валідація як у Task 3; select обовʼязковий).

- [ ] **Step 3: Перевірка браузером** — фільтр «Hip-Hop» лишає тільки hip-hop-заняття, «Початківці» звужує далі; форма валідує; mobile-розклад читабельний. Консоль чиста.

- [ ] **Step 4: Commit**

```bash
git add portfolio/dance-studio
git commit -m "feat: add Flow dance studio demo"
```

---

### Task 6: «Insight» — BI-дашборд

**Files:**
- Create: `portfolio/analytics-dashboard/index.html`, `portfolio/analytics-dashboard/style.css`, `portfolio/analytics-dashboard/app.js`

**Interfaces:**
- Produces: сторінка за `portfolio/analytics-dashboard/index.html`.

- [ ] **Step 1: Дані**

`app.js`: детермінований PRNG:
```js
function mulberry32(seed) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
```
`generateData()` → 90 днів назад від сьогодні: на день 3–12 транзакцій `{ date, id, customer, category, channel, amount, status }`; категорії: Електроніка, Одяг, Дім, Спорт, Краса; канали: Сайт, Instagram, Маркетплейс, Офлайн; статуси: Оплачено (85%), Повернення (7%), Очікує (8%); amount 200–8000 ₴. Імена клієнтів — 20 українських зі списку.

- [ ] **Step 2: Layout + KPI + графіки**

- Sidebar (лого «Insight», пункти: Огляд (active), Замовлення, Клієнти, Звіти, Налаштування — решта декоративні) + topbar із перемикачем періоду: кнопки 7/30/90 днів.
- KPI-ряд: Дохід (сума amount, форматований `Intl.NumberFormat("uk-UA")`), Замовлення (кількість), Середній чек, Повернення (%); у кожній — дельта до попереднього такого ж періоду (стрілка ↑зелена/↓червона).
- Chart.js v4 CDN: line (дохід за днями обраного періоду), bar (дохід за категоріями), doughnut (частки каналів). При зміні періоду — `chart.data` оновлюється + `chart.update()`; інстанси зберігаються, НЕ пересоздаються.
- Таблиця «Останні транзакції»: колонки Дата, ID, Клієнт, Категорія, Канал, Сума, Статус (кольорові бейджі); сортування кліком по заголовку (toggle asc/desc, індикатор ▲▼), пошук за клієнтом/ID, пагінація по 10 рядків (кнопки ‹ 1 2 3 ›).
- Dark UI: фон `#0f172a`, картки `#1e293b`, brand `#38bdf8`, Google Font «Inter». Footer-бейдж демо (в sidebar або під контентом).

- [ ] **Step 3: Перевірка браузером** — перемикання 7/30/90 змінює KPI і всі 3 графіки; сортування за сумою міняє порядок; пошук фільтрує; пагінація гортає. Консоль чиста (Chart.js завантажився).

- [ ] **Step 4: Commit**

```bash
git add portfolio/analytics-dashboard
git commit -m "feat: add Insight analytics dashboard demo"
```

---

### Task 7: Інтеграція карток + видалення стабів

**Files:**
- Modify: `assets/js/main.js:40-104` (масиви), `assets/js/main.js:141-170` (`renderProjects`), `assets/js/main.js:172-194` (`openProjectModal`)
- Modify: `assets/css/style.css` (`.project-collage`, `.project-screen*`)
- Delete: `portfolio/ecommerce-landing/`, `portfolio/portfolio-template/`, `projects/ecommerce-landing.html`, `projects/portfolio-template.html`
- Check/Delete: аналогічні стаби в `en/projects/` (переглянути вміст перед видаленням; `projects/assistant.html` і `en/projects/*assistant*` НЕ чіпати, якщо на них є посилання)

**Interfaces:**
- Consumes: slug-и з Global Constraints; демо-сторінки Tasks 1–6.
- Produces: модель картки `{ slug, title, description, stack, process, siteUrl, githubUrl, hasImages }` — Task 8 покладається на `slug` і `hasImages`.

- [ ] **Step 1: Оновити масиви проєктів**

`PROJECTS_UA` — 7 записів у порядку: Assistant (лишити як є + `slug: "assistant"`, `hasImages: false`), далі нові. Для кожного нового: `githubUrl: null`, `hasImages: false` (Task 8 перемкне), `siteUrl: "./portfolio/<slug>/"`. Опис за шаблоном «задача → реалізація» з плану користувача. Приклад запису:
```js
{
  slug: "plant-shop",
  title: "Verde | Онлайн-магазин рослин",
  description: "Інтернет-магазин кімнатних рослин: каталог із фільтрами, пошуком і сортуванням, кошик із збереженням стану та оформлення замовлення.",
  stack: ["Vue 3", "Vite", "JavaScript", "CSS", "LocalStorage"],
  process: "Задача: конверсійна вітрина з повним клієнтським флоу покупки. Реалізація: SPA на Vue 3 — реактивні фільтри й кошик, персист у LocalStorage, валідація форми замовлення.",
  siteUrl: "./portfolio/plant-shop/",
  githubUrl: null,
  hasImages: false
}
```
Аналогічно для saas-landing («Pulse | SaaS-лендінг», stack: HTML/Tailwind/JS), coffee-landing («KAVA Roasters | Лендінг кав'ярні»), photographer-portfolio («Anna Kovalenko | Портфоліо фотографа»), dance-studio («Flow | Сайт студії танцю»), analytics-dashboard («Insight | Аналітичний дашборд», stack: + Chart.js). `PROJECTS_EN` — ті самі 7 slug-ів, `siteUrl: "../portfolio/<slug>/"`, описи англійською.

- [ ] **Step 2: renderProjects + модал**

- На початку main.js: `const ASSET_PREFIX = isEnglish ? ".." : ".";`
- У картці: якщо `project.hasImages` → колаж із `<img src="${ASSET_PREFIX}/assets/img/projects/${project.slug}-desktop.jpg" alt="${project.title} — desktop" loading="lazy">` + аналогічний mobile у поточній розкладці колажу; інакше — існуючі абстрактні блоки.
- `openProjectModal`: `projectModalGithub.classList.toggle("hidden", !project.githubUrl)`; href ставити тільки коли є.
- CSS: `.project-screen img { width: 100%; height: 100%; object-fit: cover; object-position: top; }` (+ прибрати label, коли є img).

- [ ] **Step 3: Видалити стаби і перевірити посилання**

Видалити 4 шляхи зі списку Files. Пошук по репо: `grep -r "ecommerce-landing\|portfolio-template" index.html en/ projects/ assets/` — не повинно лишитись посилань (крім історії в docs). Переглянути `en/projects/` і видалити відповідні стаби.

- [ ] **Step 4: Перевірка браузером**

Відкрити `index.html`: 7 карток, клік → модал без GitHub-кнопки для нових, «Відкрити сайт» веде на демо. Те саме для `en/index.html`. Консоль чиста.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: wire 6 demo works into project cards, drop stubs"
```

---

### Task 8: Скріншоти демо → картки

**Files:**
- Create: `assets/img/projects/<slug>-desktop.jpg`, `assets/img/projects/<slug>-mobile.jpg` для всіх 7 slug-ів (включно `assistant`)
- Modify: `assets/js/main.js` (перемкнути `hasImages: true` в обох масивах)

**Interfaces:**
- Consumes: `slug`/`hasImages` із Task 7; живі демо Tasks 1–6.

- [ ] **Step 1: Зняти скріншоти**

Через browser-інструмент: для кожного slug відкрити `portfolio/<slug>/index.html` (Assistant — `portfolio/Assistant/index.html`), viewport 1280×800 → скріншот JPEG quality≈82; viewport 390×844 → другий. Зберегти в `assets/img/projects/`. Ціль ≤150 КБ на файл (JPEG q82 цього досягає; план уточнює спеку: JPEG замість PNG заради ваги).

- [ ] **Step 2: Увімкнути картинки**

`hasImages: true` у всіх 7 записах обох масивів (Assistant теж, після його скрінів).

- [ ] **Step 3: Перевірка браузером** — картки на UA та EN показують реальні скріни (desktop+mobile колаж), нічого не розтягнуто.

- [ ] **Step 4: Commit**

```bash
git add assets/img/projects assets/js/main.js
git commit -m "feat: real demo screenshots in project cards"
```

---

### Task 9: Фінальна верифікація

- [ ] **Step 1: Повний прохід браузером**

- `index.html` та `en/index.html`: навігація, теми light/dark, 7 карток зі скрінами, модалки, лінки на демо.
- Кожне з 6 демо: ключовий інтерактив (кошик+persist, pricing-toggle, таби меню, lightbox+фільтр, фільтри розкладу, перемикач періодів+сортування таблиці) на 1280 і 390.
- Консоль без помилок на кожній сторінці.

- [ ] **Step 2: Виправити знайдене, закомітити**

```bash
git add -A && git commit -m "fix: polish demo works after full pass"
```
(тільки якщо були правки)

- [ ] **Step 3: Підсумок користувачу** — список демо з шляхами, що перевірено, нагадування про stage→main процес і про реальні GitHub-лінки (чекають URL репо).
