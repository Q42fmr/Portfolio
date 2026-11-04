<script setup></script>

<template>
  <section class="not-found">
    <div class="container">
      <svg viewBox="0 0 64 64" width="96" height="96" fill="none" aria-hidden="true">
        <circle cx="32" cy="32" r="30" fill="#eef2e0" />
        <circle cx="28" cy="28" r="11" stroke="#71795f" stroke-width="2.4" />
        <path d="M36.5 36.5L46 46" stroke="#71795f" stroke-width="2.4" stroke-linecap="round" />
        <path d="M28 21c3.4 2 4.4 6.1 0 10.2-4.4-4.1-3.4-8.2 0-10.2z" fill="#16a34a" />
      </svg>
      <h1>404 — сторінку не знайдено</h1>
      <p>Такої сторінки немає. Можливо, посилання застаріло, або ви помилились в адресі.</p>
      <RouterLink class="btn" to="/">На головну</RouterLink>
    </div>
  </section>
</template>

<style>
.not-found {
  padding: 100px 0;
  text-align: center;
}

.not-found .container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.not-found h1 {
  font-size: 26px;
  color: var(--deep);
  margin-top: 8px;
}

.not-found p {
  color: var(--muted);
  max-width: 42ch;
  margin-bottom: 10px;
}
</style>
