# Verde — магазин кімнатних рослин

Концепт-проєкт для портфоліо: демо інтернет-магазину кімнатних рослин на Vue 3 + Vite.
Реального магазину Verde не існує, фіктивний домен — `verde-plants.ua`.

## Сторінки

- `/` — головна: hero, переваги, популярні товари.
- `/catalog` — каталог із фільтрами за категорією, пошуком за назвою, сортуванням і слайдером ціни.
- `/product/:id` — картка товару: велике фото, опис, догляд, додавання в кошик, схожі товари.
- `/about` — про магазин.
- `/delivery` — доставка і оплата.
- `/contacts` — контакти та форма зворотного зв'язку з валідацією.
- `/credits` — автори фотографій та ліцензії.
- `*` — сторінка 404.

Маршрутизація — `vue-router` із hash-історією (`createWebHashHistory`), тому демо однаково
працює і відкритим напряму з диска (`file://`), і на статичному хостингу без налаштування
серверних rewrite-правил.

## Структура

```
apps/plant-shop/
├── index.html
├── public/
│   ├── favicon.svg, apple-touch-icon.png, site.webmanifest
│   ├── robots.txt, sitemap.xml, credits.json
│   └── img/
│       ├── hero-greenhouse-walkway.jpg, about-shop-interior.jpg
│       └── products/*.jpg (12 фото товарів)
└── src/
    ├── main.js, App.vue, style.css
    ├── router/index.js
    ├── composables/useCart.js       — спільний реактивний стан кошика + localStorage
    ├── data/products.js, credits.js
    ├── components/
    │   ├── AppHeader.vue, AppFooter.vue
    │   ├── ProductCard.vue, CartDrawer.vue
    └── views/
        ├── HomeView.vue, CatalogView.vue, ProductView.vue
        ├── AboutView.vue, DeliveryView.vue, ContactsView.vue
        ├── CreditsView.vue, NotFoundView.vue
```

Збірка публікується в `../../portfolio/plant-shop/` (`vite build`, `emptyOutDir: true`).

## Як запустити

```bash
npm install
npm run dev      # розробка, http://localhost:5173
npm run build    # збірка у portfolio/plant-shop/
```

Зібраний `portfolio/plant-shop/index.html` можна відкрити напряму подвійним кліком
(`file://`) або роздати будь-яким статичним сервером (`npx serve portfolio/plant-shop`).

## Стек

Vue 3 (Composition API, `<script setup>`), Vue Router 4 (hash history), Vite 6.
Без CSS-фреймворків — усі стилі написані вручну (дизайн-токени в `src/style.css`).

## Фото

Усі зображення — ліцензійні фотографії з Wikimedia Commons (CC BY / CC BY-SA / Public Domain).
Повний перелік авторів і ліцензій — на сторінці `/credits` та у `public/credits.json`.

---

Це демонстраційний проєкт для портфоліо, не реальний інтернет-магазин.
