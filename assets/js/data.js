window.PORTFOLIO = {
  profile: {
    name: { ua: "Олександр Бешун", en: "Oleksandr Beshun" },
    role: { ua: "Frontend Developer", en: "Frontend Developer" },
    level: { ua: "Junior → Middle", en: "Junior → Middle" },
    location: { ua: "Чернігів · Remote", en: "Chernihiv · Remote" },
    status: {
      ua: "Open to work · Junior/Middle Frontend · remote або Чернігів",
      en: "Open to work · Junior/Middle Frontend · remote or Chernihiv"
    },
    email: "Q42fmr@gmail.com",
    phone: "+380633758707",
    phoneDisplay: "+380 63 375 87 07",
    telegram: "https://t.me/alex_daymar",
    linkedin: "https://www.linkedin.com/in/oleksandr-beshun",
    github: "https://github.com/Q42fmr",
    site: "https://q42fmr.shop",
    timeZone: "Europe/Kyiv",
    nowLabel: { ua: "09.2025 — 11.2026 · 1 рік 3 міс", en: "09.2025 — 11.2026 · 1 yr 3 mos" },
    summary: {
      ua: "Рік у продуктовій веб-студії Bypass: збирав сайти та лендінги з нуля за макетами, вносив правки й редизайни в чужий код, лагодив верстку, форми та скрипти. Тримав якість: ручне QA за чеклістами і авто-QA на Playwright для регресій, Python-скрипти для масових правок десятків сторінок. Щодня — Claude Code, Cursor та агентні воркфлоу: спека → план → реалізація → перевірка.",
      en: "A year at Bypass, a product web studio: built sites and landing pages from scratch to the mockup, shipped edits and redesigns in other people's code, fixed layouts, forms and scripts. Kept quality up: manual QA by checklists plus Playwright auto-QA for regressions, and Python scripts for bulk edits across dozens of pages. Daily tools: Claude Code, Cursor and agentic workflows — spec → plan → implement → verify."
    },
    nowChips: ["Claude Code", "Playwright", "Python", "Vue", "Vite", "Tailwind", "Git"],
    marquee: {
      ua: ["Сайти з нуля", "Редизайни та фікси", "Auto-QA (Playwright)", "Python-скрипти", "Claude Code workflows", "Vue 3"],
      en: ["Sites from scratch", "Redesigns & fixes", "Auto-QA (Playwright)", "Python scripts", "Claude Code workflows", "Vue 3"]
    }
  },

  positions: [
    {
      id: "collar",
      from: "2021-09",
      to: "2024-09",
      title: { ua: "Data Analyst · Collar, Чернігів", en: "Data Analyst · Collar, Chernihiv" }
    },
    {
      id: "freelance",
      from: "2024-10",
      to: "2025-08",
      title: { ua: "Freelance Front-end Developer", en: "Freelance Front-end Developer" }
    },
    {
      id: "nda",
      from: "2025-09",
      to: "2026-11",
      title: { ua: "Junior Frontend Developer · Bypass", en: "Junior Frontend Developer · Bypass" }
    }
  ],

  categories: [
    { id: "web", label: { ua: "Web", en: "Web" } },
    { id: "ai", label: { ua: "AI", en: "AI" } },
    { id: "qa", label: { ua: "QA", en: "QA" } },
    { id: "data", label: { ua: "Data", en: "Data" } },
    { id: "tooling", label: { ua: "Tooling", en: "Tooling" } },
    { id: "demo", label: { ua: "Demo", en: "Demo" } }
  ],

  clips: [
    {
      id: "collar-analyst",
      kind: "job",
      category: "data",
      position: "collar",
      from: "2021-09",
      to: "2024-09",
      nda: false,
      title: { ua: "Collar · Data Analyst", en: "Collar · Data Analyst" },
      tagline: {
        ua: "Аналітика ринків і перші інтерфейси для даних",
        en: "Market analytics and my first interfaces for data"
      },
      what: {
        ua: "Аналітичні звіти по ринках Америки, Європи, України; responsive-дашборди для внутрішніх звітів; компоненти для data-viz платформ; оновлення сайту компанії (форми, дизайн, фікси); Python-автоматизація обробки даних.",
        en: "Market reports for the Americas, Europe and Ukraine; responsive dashboards for internal reporting; components for data-visualization platforms; updates to the company site (forms, design, fixes); Python automation for data processing."
      },
      result: {
        ua: "Звичка працювати від даних і метрик; перший продакшн-фронтенд для реальних користувачів усередині компанії.",
        en: "A habit of working from data and metrics; my first production front end for real users inside the company."
      },
      tags: ["SQL", "Power BI", "Python", "HTML/CSS", "JavaScript"],
      siteUrl: null,
      githubUrl: null,
      images: false
    },
    {
      id: "python-parsers",
      kind: "project",
      category: "data",
      position: null,
      from: "2022-01",
      to: "2024-09",
      nda: false,
      title: { ua: "Парсери та автоматизація даних на Python", en: "Python parsers and data automation" },
      tagline: {
        ua: "Від скрейперів маркетплейсів до регулярних скриптів для Collar",
        en: "From marketplace scrapers to recurring scripts for Collar"
      },
      what: {
        ua: "Почалося зі скрейперів AliExpress і Rozetka на BS4/Selenium; далі — регулярний збір відкритих даних для аналітики Collar: обхід пагінації й динамічних сторінок, очищення і зведення в таблиці (Pandas), Telegram-боти на Aiogram для звітів, автоматизація рутинної обробки даних.",
        en: "Started with AliExpress and Rozetka scrapers on BS4/Selenium; then recurring open-data collection for Collar analytics: pagination and dynamic pages, cleaning and aggregation into tables (Pandas), Aiogram Telegram bots for reports, automation of routine data processing."
      },
      result: {
        ua: "Три роки практики в автоматизації: HTTP, DOM, селектори, Selenium, Pandas — основа для пізніших QA-скриптів.",
        en: "Three years of automation practice: HTTP, DOM, selectors, Selenium, Pandas — the base for the later QA scripts."
      },
      tags: ["Python", "BeautifulSoup", "Selenium", "Pandas", "Aiogram"],
      siteUrl: null,
      githubUrl: "https://github.com/Q42fmr/Parsing",
      images: false
    },
    {
      id: "collar-webadmin",
      kind: "job",
      category: "web",
      position: "collar",
      from: "2024-06",
      to: "2024-09",
      nda: false,
      title: { ua: "Collar · адміністрування сайтів", en: "Collar · website administration" },
      tagline: {
        ua: "Правки, контент і адмін-панель корпоративних сайтів",
        en: "Edits, content and the admin panel of the company sites"
      },
      what: {
        ua: "Підтримка сайтів компанії: правки верстки й стилів, оновлення контенту і банерів, робота в адмін-панелі (сторінки, меню, форми, товарні картки), дрібні задачі — редиректи, мета-теги, биті посилання й зображення, підготовка картинок.",
        en: "Keeping the company sites running: layout and style edits, content and banner updates, admin-panel work (pages, menus, forms, product cards), small tasks — redirects, meta tags, broken links and images, image preparation."
      },
      result: {
        ua: "Перша регулярна робота з живими сайтами й CMS; звичка документувати навіть дрібні правки.",
        en: "My first regular work on live sites and a CMS; the habit of documenting even small edits."
      },
      tags: ["HTML/CSS", "JavaScript", "CMS / admin panel", "SEO basics"],
      siteUrl: null,
      githubUrl: null,
      images: false
    },
    {
      id: "freelance-sites",
      kind: "job",
      category: "web",
      position: "freelance",
      from: "2024-10",
      to: "2025-08",
      nda: false,
      title: { ua: "Фріланс · сайти для клієнтів", en: "Freelance · client sites" },
      tagline: {
        ua: "Лендінги та невеликі сайти за макетами й брифами",
        en: "Landing pages and small sites from mockups and briefs"
      },
      what: {
        ua: "Перші замовлення як фронтенд-фрілансер: лендінги й невеликі багатосторінкові сайти за макетами — верстка, адаптив, форми, базовий JavaScript; правки й підтримка існуючих сайтів клієнтів. Приклади — у наступних кліпах.",
        en: "First jobs as a freelance front-end developer: landing pages and small multi-page sites built to mockups — markup, responsive layouts, forms, basic JavaScript; edits and upkeep of clients' existing sites. Examples in the clips that follow."
      },
      result: {
        ua: "Перехід з аналітики у фронтенд на реальних замовленнях; основа для роботи в студії.",
        en: "The move from analytics to front end on real orders; the base for the studio role."
      },
      tags: ["HTML", "CSS", "JavaScript", "Responsive"],
      siteUrl: null,
      githubUrl: null,
      images: false
    },
    {
      id: "wp-dashdoor",
      kind: "work",
      category: "web",
      position: "freelance",
      from: "2024-11",
      to: "2024-11",
      nda: true,
      title: { ua: "DashDoor · оренда нерухомості (CA)", en: "DashDoor · property rentals (CA)" },
      tagline: {
        ua: "10-сторінковий сайт з пошуком об'єктів і слайдером у hero",
        en: "A 10-page site with a property search widget and a hero slider"
      },
      what: {
        ua: "Кастомний CSS без фреймворку: hero-слайдер із формою пошуку (локація, тип, ціна, спальні), каталог об'єктів, переваги, FAQ-акордеон, контактна форма з валідацією, cookie-банер; 13 зображень, адаптив до 360px.",
        en: "Custom CSS, no framework: a hero slider with a search form (location, type, price, bedrooms), a property catalogue, benefits, an FAQ accordion, a validated contact form, a cookie banner; 13 images, responsive down to 360px."
      },
      result: {
        ua: "Що робив: контакти й домен по всіх сторінках і юридичних текстах, нормалізація посилань, редирект форми. Для портфоліо — статична копія без трекінгу: PNG → WebP (20 МБ → 1,5 МБ), відновлений hero-слайдер, виправлений конфлікт імен у скрипті.",
        en: "What I did: contacts and domain across all pages and legal texts, link normalisation, the form redirect. For the portfolio — a tracking-free static copy: PNG → WebP (20 MB → 1.5 MB), the hero slider restored, a name clash in the script fixed."
      },
      tags: ["HTML", "CSS", "JavaScript"],
      siteUrl: "portfolio/wp/dashdoor/",
      githubUrl: null,
      images: true
    },
    {
      id: "wp-homespot",
      kind: "work",
      category: "web",
      position: "freelance",
      from: "2025-02",
      to: "2025-02",
      nda: true,
      title: { ua: "Homespot · оренда житла (CA)", en: "Homespot · home rentals (CA)" },
      tagline: {
        ua: "Світлий split-hero, плаваючий швидкий пошук і 17 фото",
        en: "A light split hero, a floating quick-search panel and 17 photos"
      },
      what: {
        ua: "10 сторінок на кастомному CSS: двоколонковий hero з фото, плаваюча панель «Quick Property Search», сітка об'єктів, слайдер відгуків, FAQ, cookie-банер, юридичні сторінки.",
        en: "10 pages on custom CSS: a two-column hero with a photo, a floating “Quick Property Search” panel, a property grid, a testimonial slider, an FAQ, a cookie banner, legal pages."
      },
      result: {
        ua: "Що робив: домен і контакти по сторінках, нормалізація посилань у шапці/футері, перевірка split-hero на мобільному.",
        en: "What I did: domain and contacts across pages, link normalisation in header/footer, a mobile check of the split hero."
      },
      tags: ["HTML", "CSS", "JavaScript"],
      siteUrl: null,
      githubUrl: null,
      images: true
    },
    {
      id: "wp-keyfind",
      kind: "work",
      category: "web",
      position: "freelance",
      from: "2025-04",
      to: "2025-04",
      nda: true,
      title: { ua: "KeyFind · оренда нерухомості (CA)", en: "KeyFind · property rentals (CA)" },
      tagline: {
        ua: "Темний навігаційний стиль, 18 секцій і фільтр-панель у hero",
        en: "A dark navy style, 18 sections and a filter panel in the hero"
      },
      what: {
        ua: "Найбільший сайт серії: 18 секцій на 10 сторінках, панель пошуку з чотирма фільтрами в hero, картки об'єктів, кроки процесу, відгуки, FAQ, контактна форма; власний CSS і скрипт без залежностей.",
        en: "The largest site in the series: 18 sections across 10 pages, a four-filter search panel in the hero, property cards, process steps, testimonials, an FAQ, a contact form; custom CSS and a dependency-free script."
      },
      result: {
        ua: "Що робив: домен і контакти на 9 файлах, правки після рев'ю замовника, перевірка 18 секцій на 390px.",
        en: "What I did: domain and contacts in 9 files, fixes after the client's review, a 390px check of all 18 sections."
      },
      tags: ["HTML", "CSS", "JavaScript"],
      siteUrl: null,
      githubUrl: null,
      images: true
    },
    {
      id: "wp-familylawpro",
      kind: "work",
      category: "web",
      position: "freelance",
      from: "2025-07",
      to: "2025-07",
      nda: true,
      title: { ua: "Family Law Pro · юридичні послуги (CA)", en: "Family Law Pro · legal services (CA)" },
      tagline: {
        ua: "Серифна типографіка і темно-зелена палітра для юридичної фірми",
        en: "Serif typography and a dark green palette for a law firm"
      },
      what: {
        ua: "7 сторінок на кастомному CSS: hero з фото й двома CTA, послуги, процес, тарифи, відгуки-слайдер, FAQ, форма консультації з валідацією, cookie-банер; окрема шрифтова пара для «класичного» тону.",
        en: "7 pages on custom CSS: a hero with a photo and two CTAs, services, process, pricing, a testimonial slider, an FAQ, a validated consultation form, a cookie banner; a dedicated serif/sans pair for a classic tone."
      },
      result: {
        ua: "Що робив: контакти й домен у 6 файлах, фінальна правка головної, перевірка серифної типографіки в обох в'юпортах.",
        en: "What I did: contacts and domain in 6 files, a final fix on the home page, a check of the serif typography in both viewports."
      },
      tags: ["HTML", "CSS", "JavaScript"],
      siteUrl: null,
      githubUrl: null,
      images: true
    },
    {
      id: "course-frontend",
      kind: "job",
      category: "web",
      position: null,
      from: "2025-08",
      to: "2025-08",
      nda: false,
      title: { ua: "Курси Front-end · ItGrid", en: "Front-end course · ItGrid" },
      tagline: {
        ua: "Місяць інтенсиву з HTML/CSS перед студійною позицією",
        en: "A one-month HTML/CSS intensive before the studio role"
      },
      what: {
        ua: "HTML5, CSS3 (Flexbox, Grid), адаптивна верстка за макетами Figma, основи JavaScript і Git; навчальні проєкти — лендінги за макетами.",
        en: "HTML5, CSS3 (Flexbox, Grid), responsive layouts from Figma mockups, JavaScript and Git basics; course projects — landing pages built to mockups."
      },
      result: {
        ua: "Систематизація після року фрілансу: наступного місяця — Junior Frontend Developer у студії Bypass.",
        en: "Consolidation after a year of freelancing: the next month — Junior Frontend Developer at the Bypass studio."
      },
      tags: ["HTML5", "CSS3", "Figma", "JavaScript", "Git"],
      siteUrl: null,
      githubUrl: null,
      images: false
    },
    {
      id: "nda-sites",
      kind: "job",
      category: "web",
      position: "nda",
      from: "2025-09",
      to: "2026-11",
      nda: true,
      title: { ua: "Сайти та лендінги: від брифу до запуску", en: "Sites and landing pages: from brief to launch" },
      tagline: {
        ua: "Багатосторінкові white pages для ринків CH, CA, JP, AE, IT — de/en/ja/ar/it, зокрема RTL",
        en: "Multi-page white pages for CH, CA, JP, AE and IT markets — de/en/ja/ar/it, including RTL"
      },
      what: {
        ua: "Сайти на 5–10 сторінок на Tailwind або власному CSS: адаптив, форми з валідацією, cookie-банери, Leaflet-мапи, слайдери, FAQ, юридичні сторінки. Моя частина конвеєра — доведення до запуску: домен, бренд і контакти по всіх сторінках, sitemap/robots, нормалізація посилань, підбір фото, трекінг-кіт (GA4/Bing/FB) і форма з редиректом, перевірка верстки у двох в'юпортах; усе через корпоративний GitLab.",
        en: "5–10-page sites on Tailwind or custom CSS: responsive layouts, validated forms, cookie banners, Leaflet maps, sliders, FAQs, legal pages. My part of the pipeline — taking them to launch: domain, brand and contacts across all pages, sitemap/robots, link normalisation, photo selection, the tracking kit (GA4/Bing/FB) and the form redirect, layout checks in two viewports; all through a corporate GitLab."
      },
      result: {
        ua: "Стабільний цикл «бриф → запуск» з передбачуваними строками; чотири характерних сайти — окремими кліпами нижче.",
        en: "A steady brief-to-launch cycle with predictable timelines; four characteristic sites are separate clips below."
      },
      tags: ["HTML", "CSS", "Tailwind", "JavaScript", "Leaflet", "Git/GitLab"],
      siteUrl: null,
      githubUrl: null,
      images: false
    },
    {
      id: "nda-fixes",
      kind: "job",
      category: "web",
      position: "nda",
      from: "2025-09",
      to: "2026-11",
      nda: true,
      title: { ua: "Редизайни, правки, фікси", en: "Redesigns, edits, fixes" },
      tagline: {
        ua: "Робота в чужому коді без поломок",
        en: "Working in other people's code without breaking it"
      },
      what: {
        ua: "Нові блоки й функціонал у існуючих сайтах, редизайни секцій, виправлення верстки, форм і скриптів; JS для нової поведінки елементів. За рік — 6 300+ комітів у 5 000+ гілках репозиторію: ~1 500 масових оновлень на 8–10 файлів за раз (домени, контакти, юридичні блоки, трекінг) через власні скрипти; серія з 6 фінансових дайджестів перенесена з PHP-шаблонів у статичні сторінки; імпорт 14 копій сайтів до 3 500 файлів кожна.",
        en: "New blocks and features in existing sites, section redesigns, fixes to layouts, forms and scripts; JavaScript for new element behaviour. Over the year — 6,300+ commits in 5,000+ repository branches: ~1,500 bulk updates of 8–10 files at once (domains, contacts, legal blocks, tracking) via my own scripts; a series of 6 finance digests moved from PHP templates to static pages; 14 site copies of up to 3,500 files each imported."
      },
      result: {
        ua: "Швидка орієнтація в незнайомому коді; дисципліна «виправити, не зламати» — і скрипти там, де руки не встигають.",
        en: "Fast orientation in unfamiliar code; the discipline of fixing without breaking — and scripts where hands can't keep up."
      },
      tags: ["HTML", "CSS", "JavaScript", "Python", "Git"],
      siteUrl: null,
      githubUrl: null,
      images: false
    },
    {
      id: "nda-qa",
      kind: "job",
      category: "qa",
      position: "nda",
      from: "2025-09",
      to: "2026-11",
      nda: true,
      title: { ua: "Auto-QA і скрипти для масових правок", en: "Auto-QA and bulk-edit scripts" },
      tagline: {
        ua: "Playwright-регресії та Python для десятків сторінок",
        en: "Playwright regressions and Python across dozens of pages"
      },
      what: {
        ua: "Чеклісти ручного QA (крос-браузер, мобайл, форми); авто-тести на Playwright для регресій після правок; Python-скрипти для масового редагування й перевірки сторінок; Lighthouse-аудити. Виросло у внутрішню платформу qa_lab (окремий кліп).",
        en: "Manual QA checklists (cross-browser, mobile, forms); Playwright auto-tests for regressions after edits; Python scripts for bulk editing and checking pages; Lighthouse audits. Grew into the internal qa_lab platform (separate clip)."
      },
      result: {
        ua: "Менше ручної рутини й регресій; QA як частина процесу, а не етап наприкінці.",
        en: "Less manual routine and fewer regressions; QA as part of the process, not a stage at the end."
      },
      tags: ["Playwright", "Python", "Lighthouse", "node:test"],
      siteUrl: null,
      githubUrl: null,
      images: false
    },
    {
      id: "saas-landing",
      kind: "project",
      category: "demo",
      position: null,
      from: "2025-10",
      to: "2025-10",
      nda: false,
      title: { ua: "Pulse · сайт SaaS-продукту", en: "Pulse · SaaS product site" },
      tagline: {
        ua: "Лендінг, фічі, тарифи, кейси, legal",
        en: "Landing, features, pricing, case studies, legal"
      },
      what: {
        ua: "Сайт на 9 сторінок: hero зі справжніми скриншотами продукту, фічі з кропами інтерфейсу, тарифи місяць/рік (−20 %) з таблицею порівняння і FAQ, три кейси клієнтів, «про нас», privacy/terms, 404; спільні шапка/футер, favicon-набір, sitemap, robots.",
        en: "A 9-page site: a hero with real product screenshots, features with UI crops, monthly/yearly pricing (−20 %) with a comparison table and FAQ, three customer case studies, about, privacy/terms, 404; shared header/footer, a favicon set, sitemap, robots."
      },
      result: {
        ua: "Повноцінний маркетинговий сайт продукту без бібліотек: scroll-reveal, акордеони, перемикач тарифів на чистому JS.",
        en: "A complete product marketing site without libraries: scroll-reveal, accordions and the pricing toggle in plain JavaScript."
      },
      tags: ["HTML", "Tailwind", "JavaScript"],
      siteUrl: "portfolio/saas-landing/",
      githubUrl: null,
      images: true
    },
    {
      id: "wp-artemis",
      kind: "work",
      category: "web",
      position: "nda",
      from: "2025-11",
      to: "2025-11",
      nda: true,
      title: { ua: "Artemis Gallery · арт-консалтинг (JP)", en: "Artemis Gallery · art advisory (JP)" },
      tagline: {
        ua: "Японськомовний сайт галереї-консультанта з мапою і формою запиту",
        en: "A Japanese-language site for an art advisory gallery with a map and an enquiry form"
      },
      what: {
        ua: "9 сторінок японською: hero з галерейним фото, послуги, переваги, відгуки, компанія, юридичні сторінки; Leaflet-мапа локації, форма запиту з валідацією, cookie-банер; типографіка під CJK-текст.",
        en: "9 pages in Japanese: a hero with a gallery photo, services, benefits, testimonials, company and legal pages; a Leaflet location map, a validated enquiry form, a cookie banner; typography tuned for CJK text."
      },
      result: {
        ua: "Мій етап: перейменування бренду по всіх 9 сторінках і мета-тегах, домен у sitemap/robots, фінальна перевірка CJK-типографіки у двох в'юпортах — у день завантаження сайту.",
        en: "My stage: brand rename across all 9 pages and meta tags, the domain in sitemap/robots, a final check of the CJK typography in two viewports — on the day the site was uploaded."
      },
      tags: ["HTML", "Tailwind", "JavaScript", "Leaflet", "i18n/CJK"],
      siteUrl: null,
      githubUrl: null,
      images: true
    },
    {
      id: "wp-eiskristall",
      kind: "work",
      category: "web",
      position: "nda",
      from: "2025-12",
      to: "2025-12",
      nda: true,
      title: { ua: "Eiskristall · зимовий відпочинок (CH)", en: "Eiskristall · winter holidays (CH)" },
      tagline: {
        ua: "Німецькомовний сайт сімейних турів у Гріндельвальді",
        en: "A German-language site for family holidays in Grindelwald"
      },
      what: {
        ua: "9 сторінок на Tailwind: hero з зимовим фото, рядок показників (12+ / 450+ / 98 % / 365), програми, переваги, відгуки, Leaflet-мапа, форма запиту з валідацією, cookie-банер, юридичні сторінки.",
        en: "9 pages on Tailwind: a hero with a winter photo, a stats row (12+ / 450+ / 98 % / 365), programmes, benefits, testimonials, a Leaflet map, a validated enquiry form, a cookie banner, legal pages."
      },
      result: {
        ua: "Мій етап: заміна фотографій у hero, компанії, перевагах і відгуках на тематичні зимові, перевірка Leaflet-мапи і форми.",
        en: "My stage: replacing the photos in the hero, company, benefits and testimonials with on-theme winter imagery, checking the Leaflet map and the form."
      },
      tags: ["HTML", "Tailwind", "JavaScript", "Leaflet"],
      siteUrl: null,
      githubUrl: null,
      images: true
    },
    {
      id: "wp-fumoantico",
      kind: "work",
      category: "web",
      position: "nda",
      from: "2025-12",
      to: "2025-12",
      nda: true,
      title: { ua: "Fumo Antico · гастротури (CH/IT)", en: "Fumo Antico · gastronomy tours (CH/IT)" },
      tagline: {
        ua: "Італійськомовний сайт турів з традиційного копчення — теплий темний стиль",
        en: "An Italian-language site for traditional smoking tours — a warm dark style"
      },
      what: {
        ua: "9 сторінок на Tailwind з найбільшим обсягом кастомного CSS/JS у серії: hero на темному фото, меню турів, переваги, відгуки, Leaflet-мапа, бронювання з валідацією, cookie-банер; кастомні кольори й градієнти поверх Tailwind-конфігу.",
        en: "9 pages on Tailwind with the most custom CSS/JS in the series: a hero on a dark photo, tour menu, benefits, testimonials, a Leaflet map, validated booking, a cookie banner; custom colours and gradients on top of the Tailwind config."
      },
      result: {
        ua: "Мій етап: правки в п'яти файлах у день запуску і повторна ітерація через місяць за фідбеком — єдиний сайт серії з двома раундами.",
        en: "My stage: edits in five files on launch day and a second iteration a month later on feedback — the only site in the series with two rounds."
      },
      tags: ["HTML", "Tailwind", "JavaScript", "Leaflet"],
      siteUrl: null,
      githubUrl: null,
      images: true
    },
    {
      id: "wp-precision",
      kind: "work",
      category: "web",
      position: "nda",
      from: "2025-12",
      to: "2025-12",
      nda: true,
      title: { ua: "Precision · ремонт годинників (AE, RTL)", en: "Precision · watch repair (AE, RTL)" },
      tagline: {
        ua: "Арабськомовний сайт із правостороннім макетом",
        en: "An Arabic-language site with a right-to-left layout"
      },
      what: {
        ua: "9 сторінок арабською з dir=\"rtl\": дзеркальна навігація, вирівнювання й іконки, hero з фото майстерні, послуги, переваги, відгуки, Leaflet-мапа, форма запису з валідацією, cookie-банер.",
        en: "9 pages in Arabic with dir=\"rtl\": mirrored navigation, alignment and icons, a hero with a workshop photo, services, benefits, testimonials, a Leaflet map, a validated booking form, a cookie banner."
      },
      result: {
        ua: "Мій етап: перейменування 16 файлів під структуру проєкту і перевірка RTL-макета (дзеркальна навігація, вирівнювання, іконки) у двох в'юпортах.",
        en: "My stage: renaming 16 files to the project structure and checking the RTL layout (mirrored navigation, alignment, icons) in two viewports."
      },
      tags: ["HTML", "Tailwind", "JavaScript", "RTL", "Leaflet"],
      siteUrl: null,
      githubUrl: null,
      images: true
    },
    {
      id: "coffee-landing",
      kind: "project",
      category: "demo",
      position: null,
      from: "2025-12",
      to: "2025-12",
      nda: false,
      title: { ua: "KAVA Roasters · сайт кав'ярні", en: "KAVA Roasters · coffee shop website" },
      tagline: {
        ua: "Меню, обсмажувальня, бронювання",
        en: "Menu, roastery, table booking"
      },
      what: {
        ua: "Сайт на 6 сторінок: головна з «сьогодні на барі» та галереєю, повне меню з доступними табами (кава/десерти/зерно) з одного джерела даних, «про нас» з процесом обсмаження і командою, контакти з годинами та формою бронювання з валідацією; 15 фото під вільними ліцензіями зі сторінкою кредитів.",
        en: "A 6-page site: a home page with today's picks and a gallery, a full menu with accessible tabs (coffee/desserts/beans) rendered from one data source, an about page with the roasting process and team, contacts with hours and a booking form with validation; 15 free-licence photos with a credits page."
      },
      result: {
        ua: "Сайт локального бізнесу «під ключ»: клавіатурні таби, дані меню в одному модулі, favicon-набір, sitemap і robots.",
        en: "A turnkey local-business site: keyboard-navigable tabs, menu data in one module, a favicon set, sitemap and robots."
      },
      tags: ["HTML", "Tailwind", "JavaScript"],
      siteUrl: "portfolio/coffee-landing/",
      githubUrl: null,
      images: true
    },
    {
      id: "photographer-portfolio",
      kind: "project",
      category: "demo",
      position: null,
      from: "2026-02",
      to: "2026-02",
      nda: false,
      title: { ua: "Anna Kovalenko · сайт фотографа", en: "Anna Kovalenko · photographer website" },
      tagline: {
        ua: "Галереї за жанрами, лайтбокс, пакети",
        en: "Galleries by genre, lightbox, packages"
      },
      what: {
        ua: "Сайт на 11 сторінок: головна з вибраними роботами, загальна галерея з фільтром і окремі сторінки для весіль, портретів, стріту й пейзажу (по 8 робіт), лайтбокс (←/→/Esc, focus trap), «про мене», послуги й пакети, форма запису; 34 фото під вільними ліцензіями з єдиного модуля даних.",
        en: "An 11-page site: a home page with selected works, an all-works gallery with a filter and separate pages for weddings, portraits, street and landscape (8 works each), a lightbox (←/→/Esc, focus trap), about, services and packages, a booking form; 34 free-licence photos driven by one data module."
      },
      result: {
        ua: "Мінімалістичний візуал з акцентом на фото; одна логіка галереї на п'ять сторінок; сторінка кредитів з авторами й ліцензіями.",
        en: "A minimalist look that puts the photos first; one gallery logic shared by five pages; a credits page with authors and licences."
      },
      tags: ["HTML", "Tailwind", "JavaScript"],
      siteUrl: "portfolio/photographer-portfolio/",
      githubUrl: null,
      images: true
    },
    {
      id: "dance-studio",
      kind: "project",
      category: "demo",
      position: null,
      from: "2026-04",
      to: "2026-04",
      nda: false,
      title: { ua: "Flow · сайт студії танцю", en: "Flow · dance studio website" },
      tagline: {
        ua: "Напрямки, розклад з фільтрами, тренери, ціни",
        en: "Styles, a filterable schedule, trainers, pricing"
      },
      what: {
        ua: "Сайт на 8 сторінок: напрямки з фото, тижневий розклад із фільтрами за стилем і рівнем (дані в окремому модулі, стиль передається через URL), тренери, абонементи з FAQ-акордеоном, форма запису на пробне з валідацією, 404; favicon-набір, sitemap, robots, сторінка кредитів.",
        en: "An 8-page site: styles with photos, a weekly schedule filtered by style and level (data in a separate module, the style is passed through the URL), trainers, memberships with an FAQ accordion, a trial-class form with validation, 404; a favicon set, sitemap, robots, a credits page."
      },
      result: {
        ua: "Динамічний розклад на чистому JS з делегуванням подій; темна енергійна палітра; фото тренерів без упізнаваних облич.",
        en: "A dynamic schedule in plain JavaScript with event delegation; a dark, energetic palette; trainer photos without identifiable faces."
      },
      tags: ["HTML", "Tailwind", "JavaScript"],
      siteUrl: "portfolio/dance-studio/",
      githubUrl: null,
      images: true
    },
    {
      id: "assistant",
      kind: "project",
      category: "ai",
      position: null,
      from: "2026-05",
      to: "2026-05",
      nda: false,
      title: { ua: "Assistant · таск-менеджер з AI", en: "Assistant · task manager with AI" },
      tagline: {
        ua: "Задачі, розклад, нотатки і чат з LLM в одному SPA",
        en: "Tasks, schedule, notes and an LLM chat in one SPA"
      },
      what: {
        ua: "Vue-SPA: задачі з пріоритетами й прогресом, таймлайн дня, нотатки; AI-чат через проксі на Cloudflare Functions до Anthropic API, ключ не потрапляє в браузер; стан у LocalStorage.",
        en: "A Vue SPA: tasks with priorities and progress, a day timeline, notes; an AI chat proxied through Cloudflare Functions to the Anthropic API so the key never reaches the browser; state in LocalStorage."
      },
      result: {
        ua: "Перша інтеграція LLM API в продукт і безпечний серверлес-проксі.",
        en: "My first LLM API integration in a product, with a safe serverless proxy."
      },
      tags: ["Vue", "Vite", "Cloudflare Functions", "Anthropic API", "LocalStorage"],
      siteUrl: "portfolio/Assistant/",
      githubUrl: "https://github.com/Q42fmr/Assistant",
      images: true
    },
    {
      id: "analytics-dashboard",
      kind: "project",
      category: "demo",
      position: null,
      from: "2026-06",
      to: "2026-06",
      nda: false,
      title: { ua: "Insight · BI-дашборд", en: "Insight · BI dashboard" },
      tagline: {
        ua: "Огляд, транзакції, товари, клієнти",
        en: "Overview, transactions, products, customers"
      },
      what: {
        ua: "Багатосторінковий дашборд: огляд з KPI і line/bar/donut на Chart.js та перемикачем періоду 7/30/90; транзакції з сортуванням, пошуком, фільтром статусу, пагінацією та експортом у CSV; товари з фото, клієнти з LTV, налаштування, логін, 404. Детермінований генератор даних (seed) спільний для всіх сторінок; код розбитий на data/charts/table/app.",
        en: "A multi-page dashboard: an overview with KPIs, line/bar/donut charts on Chart.js and a 7/30/90-day period switch; transactions with sorting, search, a status filter, pagination and CSV export; products with photos, customers with LTV, settings, login, 404. A seeded deterministic data generator shared by all pages; code split into data/charts/table/app."
      },
      result: {
        ua: "Дашборд рівня внутрішнього BI без бекенда: цифри на всіх сторінках узгоджені між собою; опора на analyst-бекграунд.",
        en: "An internal-BI-grade dashboard without a back end: the numbers agree across every page; built on my analyst background."
      },
      tags: ["HTML", "Tailwind", "JavaScript", "Chart.js"],
      siteUrl: "portfolio/analytics-dashboard/",
      githubUrl: null,
      images: true
    },
    {
      id: "qa-lab",
      kind: "project",
      category: "qa",
      position: null,
      from: "2026-07",
      to: "2026-10",
      nda: false,
      title: { ua: "qa_lab · QA і автофікс для сотень сайтів", en: "qa_lab · QA and auto-fix for hundreds of sites" },
      tagline: {
        ua: "62 перевірки, 51 автофікс, один коміт на гілку",
        en: "62 checks, 51 autofixes, one commit per branch"
      },
      what: {
        ua: "Платформа для парку невеликих сайтів, кожен у власній гілці GitLab: 62 автоматичні перевірки (биті лінки й картинки, форми в нікуди, кукі-банери, юридичні сторінки, контакти, плейсхолдери, мова сторінки), 51 автофікс із прев'ю дифу і одним комітом на гілку через GitLab API з гейтом; headless Chrome через CDP у двох в'юпортах (контраст, overflow, обрізаний текст, «мертві» кнопки кліком), Lighthouse, локальні PHP/Node-деплої; черга авто-QA з вебхуків ClickUp із «@author fixed» і чеклістом; ШІ-міст (правила + Claude) мапить скаргу на перевірки; генератор лого/фавіконок, пошук стокових фото, мультикористувацький режим зі Slack OIDC і Telegram-дайджестами. FastAPI + vanilla JS SPA з i18n (UA/EN/RU), 193 ендпоінти, 2 389 тестів, Docker Swarm + Traefik, GitLab CI.",
        en: "A platform for a fleet of small sites, each in its own GitLab branch: 62 automated checks (broken links and images, forms going nowhere, cookie banners, legal pages, contact blocks, placeholders, page language), 51 autofixes with a diff preview and one commit per branch through the GitLab API behind a commit gate; headless Chrome over CDP in two viewports (contrast, overflow, clipped text, dead buttons found by clicking), Lighthouse, local PHP/Node preview deploys; a webhook-driven ClickUp auto-QA queue with “@author fixed” and checklist ticks; an AI bridge (rules + Claude) mapping complaints to checks; a logo/favicon generator, stock-photo search, multi-user mode with Slack OIDC and Telegram digests. FastAPI + a vanilla JS SPA with i18n (UA/EN/RU), 193 endpoints, 2,389 tests, Docker Swarm + Traefik, GitLab CI."
      },
      result: {
        ua: "Рутинне QA і правки сотень сайтів зведено до «натиснути й перевірити диф»; публічна санітизована копія внутрішнього інструменту з офлайн-демо. Обсяг (193 ендпоінти, 2 389 тестів) — результат трьох місяців щоденної роботи в агентному воркфлоу: архітектуру, перевірки й критерії приймання задавав і верифікував сам, код і тести писалися з Claude Code за спеками.",
        en: "Routine QA and edits across hundreds of sites reduced to “click and review the diff”; a public, sanitised copy of the internal tool with an offline demo. The scale (193 endpoints, 2,389 tests) comes from three months of daily work in an agentic workflow: I designed and verified the architecture, checks and acceptance criteria; code and tests were written with Claude Code from specs."
      },
      tags: ["Python", "FastAPI", "Headless Chrome (CDP)", "GitLab API", "ClickUp API", "Anthropic API", "Docker", "JavaScript"],
      siteUrl: null,
      githubUrl: "https://github.com/Q42fmr/qa_lab",
      images: true
    },
    {
      id: "site-mirror",
      kind: "project",
      category: "tooling",
      position: null,
      from: "2026-08",
      to: "2026-09",
      nda: false,
      title: { ua: "Site-mirror parser", en: "Site-mirror parser" },
      tagline: {
        ua: "Статична копія сайту з веб-UI, CLI і «заморозкою» SPA",
        en: "Static site copies with a web UI, CLI and SPA “freeze”"
      },
      what: {
        ua: "Node 22 + Playwright + Cheerio: обхід сайту, перепис посилань на відносні, зовнішні домени в _external/; веб-UI з чергою, живим логом, лімітами на льоту; проксі SOCKS5/HTTP з локальним мостом для Chromium; маршрути SPA через pushState; freeze — витяг CSS з insertRule, прибирання JS; звіти HTML/JSON; 21 файл тестів на node:test.",
        en: "Node 22 + Playwright + Cheerio: crawls a site, rewrites links to relative ones, puts foreign domains under _external/; a web UI with a queue, live log and limits changeable on the fly; SOCKS5/HTTP proxy with a local bridge for Chromium; SPA routes via pushState; freeze — extracts insertRule CSS and strips JS; HTML/JSON reports; 21 node:test files."
      },
      result: {
        ua: "Інструмент, що робить робочі офлайн-копії WordPress/Elementor/Next.js/Wix-сайтів з 0 запитів до оригіналу.",
        en: "A tool that produces working offline copies of WordPress/Elementor/Next.js/Wix sites with 0 requests to the original."
      },
      tags: ["Node.js", "Playwright", "Cheerio", "node:test", "SOCKS5"],
      siteUrl: null,
      githubUrl: "https://github.com/Q42fmr/site-mirror-parser",
      images: true
    },
    {
      id: "plant-shop",
      kind: "project",
      category: "demo",
      position: null,
      from: "2026-09",
      to: "2026-09",
      nda: false,
      title: { ua: "Verde · інтернет-магазин рослин", en: "Verde · plant web shop" },
      tagline: {
        ua: "Vue 3 + Router: каталог, картка товару, кошик, checkout",
        en: "Vue 3 + Router: catalogue, product page, cart, checkout"
      },
      what: {
        ua: "SPA на Vue 3 + Vite + vue-router: головна, каталог 12 товарів з фільтрами за категорією/ціною, пошуком і сортуванням, сторінка товару з доглядом і схожими рослинами, «про нас», доставка, контакти, кредити, 404; кошик-drawer з persist у LocalStorage, форма замовлення з валідацією і success-станом; фото товарів під вільними ліцензіями.",
        en: "A Vue 3 + Vite + vue-router SPA: home, a 12-product catalogue with category/price filters, search and sorting, a product page with care notes and related plants, about, delivery, contacts, credits, 404; a cart drawer persisted in LocalStorage, an order form with validation and a success state; free-licence product photos."
      },
      result: {
        ua: "Повний клієнтський флоу покупки без бекенда; hash-роутинг і IIFE-білд, що відкривається з диска.",
        en: "A complete client-side purchase flow without a back end; hash routing and an IIFE build that opens straight from disk."
      },
      tags: ["Vue 3", "Vue Router", "Vite", "JavaScript", "CSS", "LocalStorage"],
      siteUrl: "portfolio/plant-shop/",
      githubUrl: null,
      images: true
    },
    {
      id: "velocimetro",
      kind: "project",
      category: "web",
      position: null,
      from: "2026-10",
      to: "2026-10",
      nda: false,
      title: { ua: "Velocímetro Brasil · speed-test", en: "Velocímetro Brasil · speed test" },
      tagline: {
        ua: "Реальний тест швидкості на Next.js, static export",
        en: "A real speed test on Next.js, static export"
      },
      what: {
        ua: "Next.js 16 (App Router, output: export) + React 19 + TypeScript: вимір download/upload/ping/jitter через Cloudflare speed endpoints, історія в LocalStorage, FAQ/глосарій з JSON-LD, юридичні сторінки, a11y-панель (масштаб, контраст); unit-тести Vitest; деплой GitHub Actions → Pages; білд працює з підпапки і з диска.",
        en: "Next.js 16 (App Router, output: export) + React 19 + TypeScript: measures download/upload/ping/jitter via Cloudflare speed endpoints, history in LocalStorage, FAQ/glossary with JSON-LD, legal pages, an a11y panel (font scale, contrast); Vitest unit tests; GitHub Actions → Pages deploy; the build works from a subfolder and from disk."
      },
      result: {
        ua: "Повноцінний продакшн-сайт pt-BR з реальним вимірюванням, SEO і CI.",
        en: "A complete production pt-BR site with real measurement, SEO and CI."
      },
      tags: ["Next.js", "React", "TypeScript", "CSS Modules", "Vitest", "GitHub Actions"],
      siteUrl: "https://q42fmr.github.io/velocimetro-brasil/",
      githubUrl: "https://github.com/Q42fmr/velocimetro-brasil",
      images: true
    },
    {
      id: "portfolio-v2",
      kind: "project",
      category: "web",
      position: null,
      from: "2026-11",
      to: "2026-11",
      nda: false,
      title: { ua: "Portfolio v2 · цей сайт", en: "Portfolio v2 · this site" },
      tagline: {
        ua: "Кіно-резюме на чистому HTML/CSS/JS",
        en: "A cinematic resume in plain HTML/CSS/JS"
      },
      what: {
        ua: "П'ять сцен, Gantt-таймлайн із фільтрами, плеєр з автоскролом (Lenis + GSAP), UA/EN з одного джерела даних, друковане CV → PDF, OG/JSON-LD.",
        en: "Five scenes, a Gantt timeline with filters, an autoplay player (Lenis + GSAP), UA/EN from a single data source, a printable CV → PDF, OG/JSON-LD."
      },
      result: {
        ua: "Сайт, який сам демонструє навички.",
        en: "A site that demonstrates the skills by itself."
      },
      tags: ["HTML", "CSS", "JavaScript", "GSAP", "Lenis"],
      siteUrl: null,
      githubUrl: "https://github.com/Q42fmr/Portfolio",
      images: true
    },
  ],

  stack: [
    {
      id: "frontend",
      label: { ua: "Frontend", en: "Front end" },
      items: ["HTML5", "CSS / SCSS", "Tailwind", "JavaScript (ES2022+)", "Vue 3 + Vite", "React / Next.js (basic)", "TypeScript (basic)", "Responsive & a11y"]
    },
    {
      id: "qa",
      label: { ua: "QA & automation", en: "QA & automation" },
      items: [
        "Playwright",
        "Vitest / node:test",
        "Selenium",
        "Lighthouse / Web Vitals",
        { ua: "QA-чеклісти", en: "QA checklists" },
        { ua: "Python-скрипти для масових правок", en: "Python scripts for bulk edits" }
      ]
    },
    {
      id: "ai",
      label: { ua: "AI-assisted engineering", en: "AI-assisted engineering" },
      items: [
        "Claude Code (spec → plan → implement)",
        "Cursor",
        "RooCode",
        "Codex / Copilot",
        "LLM API (Anthropic)",
        "Prompt engineering",
        "MCP",
        "n8n",
        { ua: "Локальні LLM", en: "Local LLMs" },
        "Agentic orchestrators (omp, Orca)"
      ]
    },
    {
      id: "backend",
      label: { ua: "Back end & data", en: "Back end & data" },
      items: ["Python (Pandas, Aiogram, BS4)", "SQL", "MongoDB", "Node.js", "Cloudflare Pages / Functions", "REST APIs"]
    },
    {
      id: "analytics",
      label: { ua: "Analytics", en: "Analytics" },
      items: ["Power BI", "1C", "Market / sales reporting"]
    },
    {
      id: "workflow",
      label: { ua: "Workflow", en: "Workflow" },
      items: ["Git / GitLab", "Jira", "Asana", "Notion", "Bitrix", "Miro"]
    }
  ],

  languages: [
    { label: { ua: "Українська", en: "Ukrainian" }, level: "C2", score: 6 },
    { label: { ua: "Російська", en: "Russian" }, level: "C1", score: 5 },
    { label: { ua: "English", en: "English" }, level: "B1", score: 3 }
  ],

  education: [
    {
      period: "2010 — 2014",
      title: { ua: "ЧТТК", en: "ChTTK (Chernihiv Technical College)" },
      detail: { ua: "Технічний коледж, комп'ютерна спеціальність", en: "Technical college, computer science track" }
    },
    {
      period: "2014 — 2017",
      title: { ua: "ЧНТУ · Чернігівський національний технологічний університет", en: "ChNTU · Chernihiv National University of Technology" },
      detail: { ua: "Комп'ютерна інженерія (Інститут бізнесу і права); незакінчена вища", en: "Computer engineering (Institute of Business and Law); incomplete degree" }
    },
    {
      period: "2024 — 2025",
      title: { ua: "Genius Space", en: "Genius Space" },
      detail: { ua: "Business Analyst в IT", en: "Business Analyst in IT" }
    },
    {
      period: "2025",
      title: { ua: "ItGrid", en: "ItGrid" },
      detail: { ua: "Курси Front-end", en: "Front-end course" }
    }
  ],

  otherExperience: [
    {
      period: "10.2019 — 07.2021",
      title: { ua: "Marketer · «SMM кураторство», Чернігів", en: "Marketer · SMM Curatorship, Chernihiv" },
      detail: {
        ua: "Консалтинг компаній, аудит телефонних продажів, скрипти продажів, супровід рекламних кампаній до прибутковості.",
        en: "Consulting for companies, sales-call audits, sales scripts, running ad campaigns to profitability."
      }
    }
  ]
};

