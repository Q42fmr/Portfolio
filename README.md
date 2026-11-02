# Portfolio — Oleksandr Beshun

Static «cinematic resume» (UA `/`, EN `/en/`) deployed to Cloudflare Pages → https://q42fmr.shop

## Layout

- `index.html`, `en/index.html` — page skeletons (five scenes, topbar, player); all dynamic content comes from `assets/js/data.js`.
- `assets/js/render.js` — paints work clips, the Gantt timeline, stack, languages, contact links and the printed CV from data; pure helpers are unit-tested.
- `assets/js/motion.js` — GSAP ScrollTrigger scenes, hero/counter tweens, Lenis smooth scroll and the autoplay player; honours `prefers-reduced-motion`.
- `assets/js/main.js` — bootstrap: language, filters, Gantt navigation, copy-email, local time, replay.
- `assets/css/style.css` — tokens, scene palettes, components, Gantt, player, print CV.
- `portfolio/<demo>/` — six static demo sites + `Assistant`; `apps/plant-shop/` is the Vue source of `portfolio/plant-shop/`.
- `assets/img/projects/<clip id>-desktop.jpg|-mobile.jpg` — screenshots per clip id; `assets/img/og.jpg`, `assets/img/portrait.jpg`.
- `assets/files/cv.pdf`, `cv-en.pdf` — printed from the hidden `#cv-print` section.
- `docs/superpowers/specs`, `docs/superpowers/plans` — design specs and implementation plans.

## Commands

- `npm test` — unit tests for render helpers (Node 22, no dependencies).
- `cd apps/plant-shop && npm install && npm run build` — rebuild the Verde demo into `portfolio/plant-shop/`.

## Editing content

Everything textual lives in `assets/js/data.js` (`window.PORTFOLIO`): profile, positions, clips (with `{ ua, en }` fields), stack groups, languages, education. Adding a clip = adding an object to `clips` in chronological order and, if `images: true`, two screenshots named after its `id`.

## Release

Work in `stage` → check the Cloudflare preview → merge to `main` → production.
After content changes regenerate screenshots and CV PDFs (see Tasks 9–10 in `docs/superpowers/plans/2026-11-02-portfolio-v2-cinematic-resume.md`).
