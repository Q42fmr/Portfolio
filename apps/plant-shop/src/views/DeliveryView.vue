<script setup>
const FREE_SHIPPING = 1000;
</script>

<template>
  <section class="page-hero">
    <div class="container page-hero-inner">
      <p class="eyebrow">Доставка і оплата</p>
      <h1 class="section-title">Як отримати замовлення</h1>
      <p class="page-lead">
        Доставляємо по Києву та найближчих передмістях. Для крихких і великих рослин
        використовуємо захисне пакування й транспорт із підігрівом узимку.
      </p>
    </div>
  </section>

  <section class="info-section">
    <div class="container info-grid">
      <div class="info-card">
        <h3>Доставка кур'єром</h3>
        <p>По Києву — протягом 24 годин після підтвердження замовлення. Вартість — 120 ₴.</p>
        <p class="info-note">Безкоштовно при замовленні від {{ FREE_SHIPPING }} ₴.</p>
      </div>
      <div class="info-card">
        <h3>Самовивіз</h3>
        <p>
          Заберіть замовлення з нашого магазину на вул. Ярославів Вал, 21 у зручний час протягом
          робочого дня.
        </p>
      </div>
      <div class="info-card">
        <h3>Доставка по області</h3>
        <p>
          Для передмість Києва термін доставки — 1–2 дні, вартість розраховується індивідуально
          залежно від відстані.
        </p>
      </div>
    </div>
  </section>

  <section class="info-section">
    <div class="container">
      <h2 class="section-title">Оплата</h2>
      <ul class="payment-list">
        <li>Оплата при отриманні — готівкою або карткою кур'єру.</li>
        <li>Онлайн-оплата карткою на сайті під час оформлення замовлення.</li>
        <li>Безготівковий розрахунок для юридичних осіб — за рахунком.</li>
      </ul>
    </div>
  </section>
</template>

<style>
.info-section {
  padding: 24px 0;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.info-card {
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: 16px;
  padding: 22px;
}

.info-card h3 {
  font-size: 16.5px;
  color: var(--deep);
  margin-bottom: 8px;
}

.info-card p {
  font-size: 14.5px;
  color: var(--muted);
}

.info-note {
  margin-top: 6px;
  font-weight: 700;
  color: var(--brand-700);
}

.payment-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 16px;
}

.payment-list li {
  font-size: 15px;
  color: var(--ink);
  padding-left: 22px;
  position: relative;
}

.payment-list li::before {
  content: "";
  position: absolute;
  left: 0;
  top: 8px;
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: var(--brand);
}

@media (max-width: 820px) {
  .info-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}
</style>
