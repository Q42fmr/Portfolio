<script setup></script>

<template>
  <footer class="site-footer" id="contacts">
    <div class="container footer-grid">
      <div class="footer-brand">
        <RouterLink class="logo logo-light" to="/">
          <svg viewBox="0 0 32 32" width="28" height="28" aria-hidden="true">
            <circle cx="16" cy="16" r="16" fill="#16a34a" />
            <path d="M16 6c6 3.6 7.8 10.8 0 18-7.8-7.2-6-14.4 0-18z" fill="#fdfbf7" />
          </svg>
          <span>Verde</span>
        </RouterLink>
        <p>
          Магазин кімнатних рослин, який допомагає озеленити дім без стресу: підбираємо, доставляємо
          і вчимо доглядати.
        </p>
      </div>
      <div class="footer-col">
        <h4>Контакти</h4>
        <a href="tel:+380445748016">+380 (44) 574-80-16</a>
        <a href="mailto:hello@verde-plants.ua">hello@verde-plants.ua</a>
        <p>м. Київ, вул. Ярославів Вал, 21</p>
      </div>
      <div class="footer-col">
        <h4>Графік роботи</h4>
        <p>Пн–Пт: 9:00–20:00</p>
        <p>Сб–Нд: 10:00–18:00</p>
      </div>
    </div>
    <div class="container footer-bottom">
      <span class="demo-badge">Концепт-демо для портфоліо, реального магазину не існує</span>
      <div class="footer-bottom-links">
        <RouterLink class="back-link" to="/credits">Фото: автори та ліцензії</RouterLink>
        <a class="back-link" href="../../index.html#projects">← До портфоліо</a>
      </div>
    </div>
  </footer>
</template>

<style>
/* футер */
.site-footer {
  background: var(--deep);
  color: rgba(253, 251, 247, 0.82);
  padding: 48px 0 0;
  scroll-margin-top: 66px;
}

.footer-grid {
  display: grid;
  grid-template-columns: 1.4fr 1fr 1fr;
  gap: 36px;
  padding-bottom: 36px;
}

.footer-brand p {
  margin-top: 12px;
  font-size: 14px;
  max-width: 40ch;
}

.logo-light {
  color: #fdfbf7;
}

.footer-col h4 {
  font-size: 13px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(253, 251, 247, 0.55);
  margin-bottom: 12px;
}

.footer-col a,
.footer-col p {
  display: block;
  font-size: 14.5px;
  margin-bottom: 7px;
}

.footer-col a {
  transition: color 0.15s ease;
}

.footer-col a:hover {
  color: #fff;
}

.footer-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  padding-top: 18px;
  padding-bottom: 20px;
  border-top: 1px solid rgba(253, 251, 247, 0.15);
}

.footer-bottom-links {
  display: flex;
  align-items: center;
  gap: 18px;
  flex-wrap: wrap;
}

.demo-badge {
  display: inline-block;
  font-size: 12.5px;
  font-weight: 700;
  padding: 6px 13px;
  border: 1px solid rgba(253, 251, 247, 0.3);
  border-radius: 999px;
  color: rgba(253, 251, 247, 0.85);
}

.back-link {
  font-size: 14px;
  font-weight: 700;
  color: rgba(253, 251, 247, 0.85);
  transition: color 0.15s ease;
}

.back-link:hover {
  color: #fff;
}

@media (max-width: 720px) {
  .footer-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }
}
</style>
