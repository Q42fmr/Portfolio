# Анна Коваленко — фотограф (демо)

Концептуальний сайт-портфоліо для вигаданого фотографа Анни Коваленко (Київ).
Весільна, портретна, вулична та пейзажна фотографія. Проєкт створено для
демонстрації верстки у портфоліо розробника — реального бізнесу не існує.

## Сторінки

- `index.html` — головна: hero, добірка з 8 робіт, тізери «Про мене» та «Послуги», відгуки, CTA
- `portfolio.html` — усі 32 роботи з фільтром за жанром і лайтбоксом
- `wedding.html`, `portraits.html`, `street.html`, `landscape.html` — окремі галереї за жанром (по 8 робіт кожна)
- `about.html` — розповідь про Анну та як проходить співпраця
- `pricing.html` — формати зйомки та вартість (3 пакети)
- `contact.html` — форма запису з валідацією на боці клієнта
- `credits.html` — автори та ліцензії всіх фотографій
- `404.html` — сторінка помилки

## Структура

```
photographer-portfolio/
├── index.html, portfolio.html, wedding.html, portraits.html,
│   street.html, landscape.html, about.html, pricing.html,
│   contact.html, credits.html, 404.html
├── favicon.svg, apple-touch-icon.png, site.webmanifest
├── robots.txt, sitemap.xml
├── assets/
│   ├── css/main.css        — усі стилі (поверх Tailwind CDN)
│   ├── js/
│   │   ├── works.js        — дані галереї (32 роботи: id, жанр, назва, файл, alt)
│   │   └── main.js         — галерея, фільтр, лайтбокс, форма, меню, scroll-reveal
│   ├── img/                — фотографії (JPEG, Wikimedia Commons)
│   └── credits.json        — машинний список авторів/ліцензій (джерело для credits.html)
└── README.md
```

## Як запустити

Статичний сайт без збірки. Відкрийте `index.html` у браузері або підніміть
локальний сервер у цій теці, наприклад:

```
npx serve .
```

## Стек

HTML + Tailwind CSS (через CDN) + невеликий шар кастомних стилів
(`assets/css/main.css`) + vanilla JavaScript без фреймворків і збірки.
Дані галереї винесено в окремий модуль `assets/js/works.js`, щоб один
і той самий код (`assets/js/main.js`) обслуговував усі сторінки з галереєю.

## Фотографії

Усі зображення — з Wikimedia Commons за вільними ліцензіями (CC0, Public
Domain, CC BY, CC BY-SA). Повний перелік авторів, ліцензій і посилань на
першоджерело — на сторінці [`credits.html`](./credits.html), яку також
додано у футер кожної сторінки (вимога ліцензій CC BY / CC BY-SA).

## Статус

Демонстраційний проєкт для портфоліо — не є сайтом реального бізнесу.
