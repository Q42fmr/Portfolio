/* ============================================================
   Анна Коваленко — фотограф · демо-портфоліо
   renderGallery(genre) · initFilter() · initLightbox() · initForm()
   ============================================================ */
(() => {
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

  function initFilter() {
    const buttons = $$('.filter-btn');
    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        if (btn.getAttribute('aria-pressed') === 'true') return;
        buttons.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
        renderGallery(btn.dataset.filter);
      });
    });
  }

  /* ---------- Lightbox ---------- */

  function initLightbox() {
    const lb = $('#lightbox');
    if (!lb || !gallery) return;

    const stage = $('.lightbox-stage', lb);
    const img = $('#lightbox-img');
    const fallback = $('.lightbox-fallback', lb);
    const titleEl = $('#lightbox-title');
    const metaEl = $('#lightbox-meta');
    const btnPrev = $('[data-lb-prev]', lb);
    const btnNext = $('[data-lb-next]', lb);
    const btnClose = $('.lb-close', lb);

    let list = [];
    let index = 0;
    let opener = null;
    let token = 0;

    const isOpen = () => lb.classList.contains('is-open');

    function setImage(photo) {
      const t = ++token;
      stage.classList.remove('is-loaded');
      fallback.hidden = true;
      img.hidden = false;
      img.alt = `${photo.title} — ${GENRE_LABELS[photo.genre]}`;

      const done = (ok) => () => {
        if (t !== token) return;
        if (!ok) {
          img.hidden = true;
          img.removeAttribute('src');
          fallback.hidden = false;
        }
        stage.classList.add('is-loaded');
      };

      img.onload = done(true);
      img.onerror = done(false);
      img.src = fullUrl(photo.id);
      if (img.complete && img.naturalWidth > 0) done(true)();
    }

    function show(i) {
      const n = list.length;
      if (!n) return;
      index = ((i % n) + n) % n;
      const photo = list[index];

      titleEl.textContent = photo.title;
      metaEl.textContent = `${GENRE_LABELS[photo.genre]} · ${index + 1} / ${n}`;
      fallback.textContent = GENRE_LABELS[photo.genre];
      setImage(photo);

      const single = n <= 1;
      btnPrev.hidden = single;
      btnNext.hidden = single;

      /* підвантажуємо сусідні кадри наперед */
      if (n > 1) {
        [list[(index + 1) % n], list[(index - 1 + n) % n]].forEach((p) => {
          const pre = new Image();
          pre.src = fullUrl(p.id);
        });
      }
    }

    function open(id) {
      list = visiblePhotos();
      const i = list.findIndex((p) => p.id === id);
      if (i === -1) return;
      opener = document.activeElement;
      lb.classList.add('is-open');
      document.body.classList.add('no-scroll');
      show(i);
      btnClose.focus();
    }

    function close() {
      token += 1; /* скасовуємо «хвости» завантаження */
      lb.classList.remove('is-open');
      document.body.classList.remove('no-scroll');
      if (opener && document.contains(opener)) opener.focus();
      opener = null;
    }

    /* делегування кліків по мініатюрах */
    gallery.addEventListener('click', (e) => {
      const btn = e.target.closest('.photo-btn');
      if (!btn) return;
      open(Number(btn.dataset.id));
    });

    btnPrev.addEventListener('click', () => show(index - 1));
    btnNext.addEventListener('click', () => show(index + 1));
    $$('[data-lb-close]', lb).forEach((el) => el.addEventListener('click', close));

    document.addEventListener('keydown', (e) => {
      if (!isOpen()) return;
      switch (e.key) {
        case 'Escape':
          e.preventDefault();
          close();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          show(index - 1);
          break;
        case 'ArrowRight':
          e.preventDefault();
          show(index + 1);
          break;
        case 'Tab': {
          /* просте кільце фокуса всередині діалогу */
          const ring = [btnClose, btnPrev, btnNext].filter((b) => !b.hidden);
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
    });
  }

  /* ---------- Контакт-форма ---------- */

  function initForm() {
    const form = $('#contact-form');
    if (!form) return;

    const status = $('#form-status');
    const dateEl = $('#f-date');
    if (dateEl) {
      const today = new Date();
      today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
      dateEl.min = today.toISOString().slice(0, 10);
    }

    const fields = [
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
    ];

    const setError = (field, message) => {
      const wrap = field.el.closest('.field');
      const err = wrap ? $('.field-error', wrap) : null;
      if (wrap) wrap.classList.toggle('is-invalid', Boolean(message));
      field.el.setAttribute('aria-invalid', message ? 'true' : 'false');
      if (err) {
        err.textContent = message || '';
        err.hidden = !message;
      }
    };

    fields.forEach((f) => {
      f.el.addEventListener('input', () => setError(f, ''));
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let firstBad = null;

      fields.forEach((f) => {
        const bad = !f.test(f.el.value);
        setError(f, bad ? f.msg : '');
        if (bad && !firstBad) firstBad = f.el;
      });

      if (firstBad) {
        status.hidden = true;
        firstBad.focus();
        return;
      }

      form.reset();
      status.hidden = false;
      status.focus();
    });
  }

  /* ---------- Мобільне меню ---------- */

  function initNav() {
    const toggle = $('#nav-toggle');
    const menu = $('#nav-menu');
    if (!toggle || !menu) return;

    const setOpen = (open) => {
      menu.hidden = !open;
      toggle.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Закрити меню' : 'Відкрити меню');
    };

    toggle.addEventListener('click', () => setOpen(menu.hidden));
    $$('a', menu).forEach((a) => a.addEventListener('click', () => setOpen(false)));

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !menu.hidden) setOpen(false);
    });

    const mq = window.matchMedia('(min-width: 768px)');
    mq.addEventListener('change', (e) => {
      if (e.matches) setOpen(false);
    });
  }

  /* ---------- Статичні фото (hero, портрет) ---------- */

  function initStaticImages() {
    $$('img[data-photo]').forEach((img) => {
      fadeInWhenLoaded(img);
      guardImage(img, () => {
        const fig = img.closest('figure');
        if (fig) fig.classList.add('is-broken');
      });
    });
  }

  /* ---------- Поява секцій при скролі ---------- */

  function initReveal() {
    const items = $$('[data-reveal]');
    if (!items.length) return;

    const revealAll = () => {
      document.documentElement.classList.add('reveal-off');
      items.forEach((el) => el.classList.add('is-visible'));
    };

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !('IntersectionObserver' in window)) {
      revealAll();
      return;
    }

    let alive = false;
    const io = new IntersectionObserver(
      (entries) => {
        alive = true;
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -36px 0px' }
    );

    items.forEach((el) => io.observe(el));

    /* Страховка: IO завжди шле початковий колбек для кожного елемента.
       Якщо за секунду не прийшов жоден (приховане вікно, обмежений
       webview) — показуємо весь контент одразу, без анімації. */
    window.setTimeout(() => {
      if (!alive) {
        io.disconnect();
        revealAll();
      }
    }, 1000);
  }

  /* ---------- Старт ---------- */

  const init = () => {
    renderGallery('all');
    initFilter();
    initLightbox();
    initForm();
    initNav();
    initStaticImages();
    initReveal();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
