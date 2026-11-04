<script setup>
import { CREDITS } from "../data/credits.js";
</script>

<template>
  <section class="page-hero">
    <div class="container page-hero-inner">
      <p class="eyebrow">Фото та ліцензії</p>
      <h1 class="section-title">Автори зображень</h1>
      <p class="page-lead">
        Усі фотографії на цьому сайті — з Wikimedia Commons, розповсюджуються за вільними
        ліцензіями. Нижче — повний перелік авторів, ліцензій і посилань на оригінали.
      </p>
    </div>
  </section>

  <section class="credits-section">
    <div class="container">
      <ul class="credits-list">
        <li v-for="item in CREDITS" :key="item.file" class="credit-row">
          <img :src="item.file" :alt="item.title" width="80" height="80" loading="lazy" />
          <div class="credit-info">
            <p class="credit-title">{{ item.title }}</p>
            <p class="credit-meta">
              Автор: <strong>{{ item.author }}</strong> · Ліцензія: <strong>{{ item.license }}</strong>
            </p>
            <a class="credit-link" :href="item.source" target="_blank" rel="noopener noreferrer">
              Джерело на Wikimedia Commons →
            </a>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<style>
.credits-section {
  padding: 8px 0 88px;
}

.credits-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.credit-row {
  display: flex;
  gap: 16px;
  align-items: center;
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: 14px;
  padding: 14px;
}

.credit-row img {
  flex: none;
  width: 80px;
  height: 80px;
  border-radius: 10px;
  object-fit: cover;
  background: var(--cream-2);
}

.credit-info {
  min-width: 0;
}

.credit-title {
  font-weight: 700;
  font-size: 14.5px;
  color: var(--ink);
}

.credit-meta {
  font-size: 13px;
  color: var(--muted);
  margin-top: 2px;
}

.credit-link {
  display: inline-block;
  margin-top: 4px;
  font-size: 13px;
  font-weight: 700;
  color: var(--brand-700);
}

.credit-link:hover {
  color: var(--brand-600);
}

@media (max-width: 540px) {
  .credit-row {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
