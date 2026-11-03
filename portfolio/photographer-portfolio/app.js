/* Анна Коваленко — фотограф · демо-портфоліо */
'use strict';

document.documentElement.classList.add('js');

/* ---------- Дані галереї: 12 робіт, по 3 на жанр ---------- */

const PHOTOS = [
  { id: 1,  genre: 'wedding',  title: 'Обмін обітницями' },
  { id: 2,  genre: 'portrait', title: 'Світло з вікна' },
  { id: 3,  genre: 'street',   title: 'Ранок на Подолі' },
  { id: 4,  genre: 'nature',   title: 'Туман над Дніпром' },
  { id: 5,  genre: 'wedding',  title: 'Перший танець' },
  { id: 6,  genre: 'portrait', title: 'Портрет у майстерні' },
  { id: 7,  genre: 'street',   title: 'Дощ на Хрещатику' },
  { id: 8,  genre: 'nature',   title: 'Карпатська полонина' },
  { id: 9,  genre: 'wedding',  title: 'Ранок нареченої' },
  { id: 10, genre: 'portrait', title: 'Тихий погляд' },
  { id: 11, genre: 'street',   title: 'Тіні старого міста' },
  { id: 12, genre: 'nature',   title: 'Золота година' }
];

const GENRE_LABELS = {
  wedding: 'Весілля',
  portrait: 'Портрет',
  street: 'Стріт',
  nature: 'Природа'
};

/* Висоти 400/600/800 чергуються — для masonry-ритму */
const HEIGHTS = [600, 800, 400];
const heightOf = (id) => HEIGHTS[id % 3];
const thumbUrl = (id) => `https://picsum.photos/seed/anna-${id}/600/${heightOf(id)}`;
const fullUrl = (id) => `https://picsum.photos/seed/anna-${id}/1200/800`;

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

let currentGenre = 'all';
const visiblePhotos = () =>
  currentGenre === 'all' ? PHOTOS.slice() : PHOTOS.filter((p) => p.genre === currentGenre);

const plural = (n, one, few, many) => {
  const m10 = n % 10;
  const m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return one;
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few;
  return many;
};

/* ---------- Зображення: плавна поява + фолбек при помилці ---------- */

const fadeInWhenLoaded = (img) => {
  const done = () => img.classList.add('is-loaded');
  if (img.complete && img.naturalWidth > 0) done();
  else img.addEventListener('load', done, { once: true });
};

const guardImage = (img, onFail) => {
  if (img.complete && img.naturalWidth === 0 && img.src) {
    onFail();
    return;
  }
  img.addEventListener('error', onFail, { once: true });
};

/* ---------- Галерея ---------- */

const gallery = $('#gallery');
const countEl = $('#gallery-count');

function buildFigure(photo) {
  const h = heightOf(photo.id);

  const figure = document.createElement('figure');
  figure.className = 'photo';
  figure.dataset.genre = photo.genre;
  figure.dataset.id = String(photo.id);

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'photo-btn';
  btn.dataset.id = String(photo.id);
  btn.setAttribute('aria-label', `Відкрити фото «${photo.title}» у повному розмірі`);

  const img = document.createElement('img');
  img.className = 'bw-img fade-img';
  img.src = thumbUrl(photo.id);
  img.width = 600;
  img.height = h;
  img.loading = 'lazy';
  img.decoding = 'async';
  img.alt = `${photo.title} — жанр: ${GENRE_LABELS[photo.genre]}`;

  const fallback = document.createElement('span');
  fallback.className = 'photo-fallback';
  fallback.style.aspectRatio = `600 / ${h}`;
  fallback.textContent = GENRE_LABELS[photo.genre];
  fallback.setAttribute('aria-hidden', 'true');

  const cap = document.createElement('span');
  cap.className = 'photo-cap';
  cap.innerHTML =
    `<span class="photo-cap-title">${photo.title}</span>` +
    `<span class="photo-cap-genre">${GENRE_LABELS[photo.genre]}</span>`;

  fadeInWhenLoaded(img);
  guardImage(img, () => figure.classList.add('is-broken'));

  btn.append(img, fallback, cap);
  figure.append(btn);
  return figure;
}

function renderGallery(genre = currentGenre) {
  if (!gallery) return;
  currentGenre = genre;

  if (!gallery.dataset.built) {
    const frag = document.createDocumentFragment();
    PHOTOS.forEach((p) => frag.append(buildFigure(p)));
    gallery.append(frag);
    gallery.dataset.built = '1';
  }

  let shown = 0;
  $$('.photo', gallery).forEach((fig) => {
    const show = genre === 'all' || fig.dataset.genre === genre;
    fig.hidden = !show;
    if (show) shown += 1;
  });

  if (countEl) {
    countEl.textContent = `${shown} ${plural(shown, 'робота', 'роботи', 'робіт')}`;
  }
}

/* ---------- Фільтр за жанром ---------- */

const filterButtons = $$('.filter-btn');

function onFilterClick(e) {
  const btn = e.currentTarget;
  if (btn.getAttribute('aria-pressed') === 'true') return;
  filterButtons.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
  renderGallery(btn.dataset.filter);
}

filterButtons.forEach((btn) => btn.addEventListener('click', onFilterClick));

/* ---------- Lightbox ---------- */

const lightbox = $('#lightbox');
const lbStage = lightbox ? $('.lightbox-stage', lightbox) : null;
const lbImg = $('#lightbox-img');
const lbFallback = lightbox ? $('.lightbox-fallback', lightbox) : null;
const lbTitle = $('#lightbox-title');
const lbMeta = $('#lightbox-meta');
const lbPrevBtn = lightbox ? $('[data-lb-prev]', lightbox) : null;
const lbNextBtn = lightbox ? $('[data-lb-next]', lightbox) : null;
const lbCloseBtn = lightbox ? $('.lb-close', lightbox) : null;

let lbList = [];
let lbIndex = 0;
let lbOpener = null;
let lbToken = 0;

const isLightboxOpen = () => Boolean(lightbox) && lightbox.classList.contains('is-open');

function setLightboxImage(photo) {
  const t = ++lbToken;
  lbStage.classList.remove('is-loaded');
  lbFallback.hidden = true;
  lbImg.hidden = false;
  lbImg.alt = `${photo.title} — ${GENRE_LABELS[photo.genre]}`;

  const done = (ok) => () => {
    if (t !== lbToken) return;
    if (!ok) {
      lbImg.hidden = true;
      lbImg.removeAttribute('src');
      lbFallback.hidden = false;
    }
    lbStage.classList.add('is-loaded');
  };

  lbImg.onload = done(true);
  lbImg.onerror = done(false);
  lbImg.src = fullUrl(photo.id);
  if (lbImg.complete && lbImg.naturalWidth > 0) done(true)();
}

function showLightboxPhoto(i) {
  const n = lbList.length;
  if (!n) return;
  lbIndex = ((i % n) + n) % n;
  const photo = lbList[lbIndex];

  lbTitle.textContent = photo.title;
  lbMeta.textContent = `${GENRE_LABELS[photo.genre]} · ${lbIndex + 1} / ${n}`;
  lbFallback.textContent = GENRE_LABELS[photo.genre];
  setLightboxImage(photo);

  const single = n <= 1;
  lbPrevBtn.hidden = single;
  lbNextBtn.hidden = single;

  /* підвантажуємо сусідні кадри наперед */
  if (n > 1) {
    [lbList[(lbIndex + 1) % n], lbList[(lbIndex - 1 + n) % n]].forEach((p) => {
      const pre = new Image();
      pre.src = fullUrl(p.id);
    });
  }
}

function openLightbox(id) {
  lbList = visiblePhotos();
  const i = lbList.findIndex((p) => p.id === id);
  if (i === -1) return;
  lbOpener = document.activeElement;
  lightbox.classList.add('is-open');
  document.body.classList.add('no-scroll');
  showLightboxPhoto(i);
  lbCloseBtn.focus();
}

function closeLightbox() {
  lbToken += 1; /* скасовуємо «хвости» завантаження */
  lightbox.classList.remove('is-open');
  document.body.classList.remove('no-scroll');
  if (lbOpener && document.contains(lbOpener)) lbOpener.focus();
  lbOpener = null;
}

function onGalleryClick(e) {
  const btn = e.target.closest('.photo-btn');
  if (!btn) return;
  openLightbox(Number(btn.dataset.id));
}

function onLightboxKeydown(e) {
  if (!isLightboxOpen()) return;
  switch (e.key) {
    case 'Escape':
      e.preventDefault();
      closeLightbox();
      break;
    case 'ArrowLeft':
      e.preventDefault();
      showLightboxPhoto(lbIndex - 1);
      break;
    case 'ArrowRight':
      e.preventDefault();
      showLightboxPhoto(lbIndex + 1);
      break;
    case 'Tab': {
      /* просте кільце фокуса всередині діалогу */
      const ring = [lbCloseBtn, lbPrevBtn, lbNextBtn].filter((b) => !b.hidden);
      if (!ring.length) break;
      const first = ring[0];
      const last = ring[ring.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (document.activeElement === last || !ring.includes(document.activeElement))) {
        e.preventDefault();
        first.focus();
      }
      break;
    }
  }
}

if (lightbox && gallery) {
  gallery.addEventListener('click', onGalleryClick);
  lbPrevBtn.addEventListener('click', () => showLightboxPhoto(lbIndex - 1));
  lbNextBtn.addEventListener('click', () => showLightboxPhoto(lbIndex + 1));
  $$('[data-lb-close]', lightbox).forEach((el) => el.addEventListener('click', closeLightbox));
  document.addEventListener('keydown', onLightboxKeydown);
}

/* ---------- Контакт-форма ---------- */

const contactForm = $('#contact-form');
const formStatus = $('#form-status');
const dateField = $('#f-date');

if (dateField) {
  const today = new Date();
  today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
  dateField.min = today.toISOString().slice(0, 10);
}

const formFields = contactForm
  ? [
      {
        el: $('#f-name'),
        test: (v) => v.trim().length >= 2,
        msg: 'Вкажіть імʼя — щонайменше 2 символи.'
      },
      {
        el: $('#f-email'),
        test: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
        msg: 'Вкажіть коректну email-адресу.'
      },
      {
        el: $('#f-message'),
        test: (v) => v.trim().length >= 10,
        msg: 'Розкажіть трохи більше — від 10 символів.'
      }
    ]
  : [];

function setFieldError(field, message) {
  const wrap = field.el.closest('.field');
  const err = wrap ? $('.field-error', wrap) : null;
  if (wrap) wrap.classList.toggle('is-invalid', Boolean(message));
  field.el.setAttribute('aria-invalid', message ? 'true' : 'false');
  if (err) {
    err.textContent = message || '';
    err.hidden = !message;
  }
}

function onFieldInput(e) {
  const field = formFields.find((f) => f.el === e.currentTarget);
  if (field) setFieldError(field, '');
}

function submitContact(e) {
  e.preventDefault();
  let firstBad = null;

  formFields.forEach((f) => {
    const bad = !f.test(f.el.value);
    setFieldError(f, bad ? f.msg : '');
    if (bad && !firstBad) firstBad = f.el;
  });

  if (firstBad) {
    formStatus.hidden = true;
    firstBad.focus();
    return;
  }

  contactForm.reset();
  formStatus.hidden = false;
  formStatus.focus();
}

if (contactForm && formStatus) {
  formFields.forEach((f) => f.el.addEventListener('input', onFieldInput));
  contactForm.addEventListener('submit', submitContact);
}

/* ---------- Мобільне меню ---------- */

const navToggle = $('#nav-toggle');
const navMenu = $('#nav-menu');

function setNavOpen(open) {
  navMenu.hidden = !open;
  navToggle.classList.toggle('is-open', open);
  navToggle.setAttribute('aria-expanded', String(open));
  navToggle.setAttribute('aria-label', open ? 'Закрити меню' : 'Відкрити меню');
}

function onNavToggleClick() {
  setNavOpen(navMenu.hidden);
}

function onNavLinkClick() {
  setNavOpen(false);
}

function onNavKeydown(e) {
  if (e.key === 'Escape' && !navMenu.hidden) setNavOpen(false);
}

function onViewportChange(e) {
  if (e.matches) setNavOpen(false);
}

if (navToggle && navMenu) {
  navToggle.addEventListener('click', onNavToggleClick);
  $$('a', navMenu).forEach((a) => a.addEventListener('click', onNavLinkClick));
  document.addEventListener('keydown', onNavKeydown);
  window.matchMedia('(min-width: 768px)').addEventListener('change', onViewportChange);
}

/* ---------- Статичні фото (hero, портрет) ---------- */

$$('img[data-photo]').forEach((img) => {
  fadeInWhenLoaded(img);
  guardImage(img, () => {
    const fig = img.closest('figure');
    if (fig) fig.classList.add('is-broken');
  });
});

/* ---------- Поява секцій при скролі ---------- */

const revealItems = $$('[data-reveal]');

function revealAllSections() {
  document.documentElement.classList.add('reveal-off');
  revealItems.forEach((el) => el.classList.add('is-visible'));
}

function onRevealIntersect(entries, io) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      io.unobserve(entry.target);
    }
  });
}

if (revealItems.length) {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealAllSections();
  } else {
    let revealObserved = false;
    const revealObserver = new IntersectionObserver(
      (entries) => {
        revealObserved = true;
        onRevealIntersect(entries, revealObserver);
      },
      { threshold: 0.12, rootMargin: '0px 0px -36px 0px' }
    );

    revealItems.forEach((el) => revealObserver.observe(el));

    /* Страховка: IO завжди шле початковий колбек для кожного елемента.
       Якщо за секунду не прийшов жоден (приховане вікно, обмежений
       webview) — показуємо весь контент одразу, без анімації. */
    window.setTimeout(() => {
      if (!revealObserved) {
        revealObserver.disconnect();
        revealAllSections();
      }
    }, 1000);
  }
}

/* ---------- Старт: скрипт підключений у кінці body, DOM уже готовий ---------- */

queueMicrotask(() => renderGallery('all'));
