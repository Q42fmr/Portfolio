<script setup></script>

<template>
  <section class="page-hero">
    <div class="container page-hero-inner">
      <p class="eyebrow">Про нас</p>
      <h1 class="section-title">Verde — зелень без зайвого клопоту</h1>
      <p class="page-lead">
        Ми почали з однієї полиці сукулентів на районному ринку в 2019 році. Сьогодні Verde —
        невеликий магазин у центрі Києва, де кожну рослину підбирають під умови конкретної
        квартири: освітлення, протяги, навіть звички власника щодо поливу.
      </p>
    </div>
  </section>

  <section class="about-photo">
    <div class="container">
      <img
        src="/img/about-shop-interior.jpg"
        alt="Інтер'єр магазину кімнатних рослин із вітринами та стелажами"
        width="1000"
        height="700"
      />
    </div>
  </section>

  <section class="about-values">
    <div class="container about-grid">
      <div class="about-card">
        <h3>Відбір рослин</h3>
        <p>
          Беремо тільки здорові екземпляри від перевірених розсадників: без шкідників, зі
          сформованим листям і нормальним корінням. Слабкі рослини повертаємо постачальнику.
        </p>
      </div>
      <div class="about-card">
        <h3>Простий догляд</h3>
        <p>
          До кожної рослини додаємо коротку інструкцію простою мовою — без складної ботанічної
          термінології. Якщо щось незрозуміло, просто напишіть нам.
        </p>
      </div>
      <div class="about-card">
        <h3>Локальна команда</h3>
        <p>
          Увесь асортимент проходить через наш склад у Києві, тож ми бачимо кожну рослину
          наживо, перш ніж вона потрапить до каталогу.
        </p>
      </div>
    </div>
  </section>
</template>

<style>
.page-hero {
  padding: 56px 0 24px;
}

.page-hero-inner {
  max-width: 70ch;
}

.page-lead {
  margin-top: 14px;
  font-size: 16.5px;
  color: var(--muted);
}

.about-photo {
  padding: 8px 0 40px;
}

.about-photo img {
  width: 100%;
  max-height: 440px;
  object-fit: cover;
  border-radius: 20px;
  box-shadow: var(--shadow-md);
}

.about-values {
  padding: 8px 0 80px;
}

.about-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.about-card {
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: 16px;
  padding: 22px;
}

.about-card h3 {
  font-size: 16.5px;
  color: var(--deep);
  margin-bottom: 8px;
}

.about-card p {
  font-size: 14.5px;
  color: var(--muted);
}

@media (max-width: 820px) {
  .about-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}
</style>
