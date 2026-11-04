<script setup>
import { reactive, ref } from "vue";

const form = reactive({ name: "", email: "", message: "" });
const errors = reactive({ name: "", email: "", message: "" });
const sent = ref(false);

const validators = {
  name: (v) => v.trim().length >= 2 || "Введіть імʼя — щонайменше 2 символи",
  email: (v) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || "Введіть коректний email, напр. maria@ukr.net",
  message: (v) => v.trim().length >= 10 || "Опишіть питання — щонайменше 10 символів",
};

function validateField(field) {
  const result = validators[field](form[field]);
  errors[field] = result === true ? "" : result;
  return result === true;
}

function onInput(field) {
  if (errors[field]) validateField(field);
}

function submit() {
  const fields = ["name", "email", "message"];
  const ok = fields.map(validateField).every(Boolean);
  if (!ok) return;
  sent.value = true;
  form.name = "";
  form.email = "";
  form.message = "";
}
</script>

<template>
  <section class="page-hero">
    <div class="container page-hero-inner">
      <p class="eyebrow">Контакти</p>
      <h1 class="section-title">Напишіть нам</h1>
      <p class="page-lead">
        Відповідаємо протягом робочого дня. Для термінових питань телефонуйте — зазвичай ми на
        місці в робочі години.
      </p>
    </div>
  </section>

  <section class="contacts-section">
    <div class="container contacts-grid">
      <div class="contacts-details">
        <div class="contact-row">
          <h3>Адреса</h3>
          <p>м. Київ, вул. Ярославів Вал, 21</p>
        </div>
        <div class="contact-row">
          <h3>Телефон</h3>
          <a href="tel:+380445748016">+380 (44) 574-80-16</a>
        </div>
        <div class="contact-row">
          <h3>Email</h3>
          <a href="mailto:hello@verde-plants.ua">hello@verde-plants.ua</a>
        </div>
        <div class="contact-row">
          <h3>Графік роботи</h3>
          <p>Пн–Пт: 9:00–20:00</p>
          <p>Сб–Нд: 10:00–18:00</p>
        </div>
      </div>

      <form v-if="!sent" class="contact-form" novalidate @submit.prevent="submit">
        <div class="field">
          <label class="field-label" for="c-name">Імʼя</label>
          <input
            id="c-name"
            v-model="form.name"
            type="text"
            class="field-input"
            :class="{ invalid: errors.name }"
            placeholder="Марія"
            autocomplete="name"
            :aria-invalid="Boolean(errors.name)"
            @blur="validateField('name')"
            @input="onInput('name')"
          />
          <p v-if="errors.name" class="field-error">{{ errors.name }}</p>
        </div>
        <div class="field">
          <label class="field-label" for="c-email">Email</label>
          <input
            id="c-email"
            v-model="form.email"
            type="text"
            inputmode="email"
            class="field-input"
            :class="{ invalid: errors.email }"
            placeholder="maria@ukr.net"
            autocomplete="email"
            :aria-invalid="Boolean(errors.email)"
            @blur="validateField('email')"
            @input="onInput('email')"
          />
          <p v-if="errors.email" class="field-error">{{ errors.email }}</p>
        </div>
        <div class="field">
          <label class="field-label" for="c-message">Повідомлення</label>
          <textarea
            id="c-message"
            v-model="form.message"
            class="field-input field-textarea"
            :class="{ invalid: errors.message }"
            placeholder="Питання про догляд чи наявність рослини…"
            rows="4"
            :aria-invalid="Boolean(errors.message)"
            @blur="validateField('message')"
            @input="onInput('message')"
          ></textarea>
          <p v-if="errors.message" class="field-error">{{ errors.message }}</p>
        </div>
        <button class="btn btn-block" type="submit">Надіслати</button>
      </form>

      <div v-else class="contact-success">
        <div class="success-icon">
          <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M4 12.5l5 5L20 6.5" />
          </svg>
        </div>
        <h3>Дякуємо!</h3>
        <p>Повідомлення надіслано. Ми відповімо на пошту протягом робочого дня.</p>
        <button class="btn btn-ghost" type="button" @click="sent = false">Написати ще раз</button>
      </div>
    </div>
  </section>
</template>

<style>
.contacts-section {
  padding: 24px 0 88px;
}

.contacts-grid {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 40px;
}

.contacts-details {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.contact-row h3 {
  font-size: 12.5px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--muted);
  margin-bottom: 4px;
}

.contact-row p,
.contact-row a {
  font-size: 15.5px;
  color: var(--ink);
}

.contact-row a:hover {
  color: var(--brand-600);
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: 18px;
  padding: 24px;
  box-shadow: var(--shadow-sm);
}

.field-textarea {
  height: auto;
  padding: 10px 13px;
  resize: vertical;
}

.contact-success {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  text-align: center;
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: 18px;
  padding: 40px 24px;
}

.contact-success h3 {
  font-size: 22px;
  color: var(--deep);
}

.contact-success p {
  color: var(--muted);
  max-width: 34ch;
  margin-bottom: 8px;
}

@media (max-width: 820px) {
  .contacts-grid {
    grid-template-columns: 1fr;
    gap: 26px;
  }
}
</style>
