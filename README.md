# Portfolio — Oleksandr Beshun

Static «cinematic resume» (UA `/`, EN `/en/`) deployed to Cloudflare Pages → https://q42fmr.shop

## Layout

- `index.html`, `en/index.html` — page skeletons (five scenes, topbar, player); all dynamic content comes from `assets/js/data.js`.
- `assets/js/render.js` — paints work clips, the Gantt timeline, stack, languages, contact links and the printed CV from data; pure helpers are unit-tested.
- `assets/js/motion.js` — GSAP ScrollTrigger scenes, hero/counter tweens, Lenis smooth scroll and the autoplay player; honours `prefers-reduced-motion`.
- `assets/js/main.js` — bootstrap: language, filters, Gantt navigation, copy-email, local time, replay.
- `assets/css/style.css` — tokens, scene palettes, components, Gantt, player, print CV.
- `portfolio/<demo>/` — six concept sites (Pulse, KAVA Roasters, Anna Kovalenko, Flow, Insight, Verde): multi-page, each with its own `assets/{css,js,img}`, favicon set, `robots.txt`, `sitemap.xml`, README and a `credits.html` page. Photos come from Wikimedia Commons under free licences; `assets/credits.json` in each demo lists author, licence and source for every file. `apps/plant-shop/` is the Vue source of `portfolio/plant-shop/`; `portfolio/wp/dashdoor/` is a copy of a client white page.
- `assets/img/projects/<clip id>-desktop.jpg|-mobile.jpg` — screenshots per clip id; `assets/img/og.jpg`, `assets/img/portrait.jpg`.
- `assets/files/cv.pdf`, `cv-en.pdf` — printed from the hidden `#cv-print` section.

## Commands

- `npm test` — unit tests for render helpers (Node 22, no dependencies).
- `cd apps/plant-shop && npm install && npm run build` — rebuild the Verde demo into `portfolio/plant-shop/`.

## Editing content

Everything textual lives in `assets/js/data.js` (`window.PORTFOLIO`): profile, positions, clips (with `{ ua, en }` fields), stack groups, languages, education. Adding a clip = adding an object to `clips` in chronological order and, if `images: true`, two screenshots named after its `id`.

## Release

Work in `stage` → check the Cloudflare preview → merge to `main` → production.
After content changes regenerate the screenshots (headless Chromium, 1280×800 and 390×844, JPEG ≤150 KB) and the CV PDFs (print the pages to A4 — the `#cv-print` section is what gets printed).

Cache busting: there are no hashed filenames, and the Cloudflare zone's Browser Cache TTL (4 h) overrides the `no-cache` rules in `_headers`. Whenever CSS/JS changes, bump the `?v=` query on the `<link>`/`<script>` tags (`index.html`, `en/index.html`, `portfolio/*/index.html`) — e.g. `?v=20261102b` → `?v=20261103`. Alternatively set Caching → Configuration → Browser Cache TTL to “Respect Existing Headers” in the Cloudflare dashboard, after which `_headers` makes this bump unnecessary.
