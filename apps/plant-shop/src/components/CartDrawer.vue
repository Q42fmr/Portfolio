<script setup>
import { reactive, ref, watch } from "vue";
import { formatPrice } from "../format.js";

const props = defineProps({
  open: { type: Boolean, default: false },
  items: { type: Array, default: () => [] },
  total: { type: Number, default: 0 },
});
const emit = defineEmits(["close", "increment", "decrement", "remove", "clear"]);

const FREE_SHIPPING = 1000;

/** Поточний екран drawer-а: кошик → форма → успіх. */
const view = ref("cart");
const orderNumber = ref(null);

const form = reactive({ name: "", phone: "", email: "", address: "" });
const errors = reactive({ name: "", phone: "", email: "", address: "" });

const validators = {
  name: (v) => v.trim().length >= 2 || "Введіть імʼя — щонайменше 2 символи",
  phone: (v) =>
    /^\+?[\d\s()-]{10,}$/.test(v.trim()) ||
    "Введіть коректний телефон, напр. +380 (44) 574-80-16",
  email: (v) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ||
    "Введіть коректний email, напр. maria@ukr.net",
  address: (v) => v.trim().length >= 5 || "Введіть адресу доставки — щонайменше 5 символів",
};

function validateField(field) {
  const result = validators[field](form[field]);
  errors[field] = result === true ? "" : result;
  return result === true;
}

function onInput(field) {
  if (errors[field]) validateField(field);
}

function submitOrder() {
  const fields = ["name", "phone", "email", "address"];
  const ok = fields.map(validateField).every(Boolean);
  if (!ok) return;
  orderNumber.value = Math.floor(10000 + Math.random() * 90000);
  view.value = "success";
  emit("clear");
}

watch(
  () => props.open,
  (open) => {
    if (open) return;
    const wasSuccess = view.value === "success";
    setTimeout(() => {
      view.value = "cart";
      if (wasSuccess) {
        form.name = "";
        form.phone = "";
        form.email = "";
        form.address = "";
        orderNumber.value = null;
      }
      for (const key of Object.keys(errors)) errors[key] = "";
    }, 260);
  }
);

const titles = { cart: "Кошик", form: "Оформлення", success: "Замовлення" };
</script>

<template>
  <Transition name="fade">
    <div v-if="open" class="drawer-backdrop" @click="emit('close')"></div>
  </Transition>
  <Transition name="slide">
    <aside v-if="open" class="drawer" role="dialog" aria-modal="true" aria-label="Кошик">
      <header class="drawer-head">
        <button
          v-if="view === 'form'"
          class="drawer-back"
          type="button"
          aria-label="Назад до кошика"
          @click="view = 'cart'"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M15 5l-7 7 7 7" />
          </svg>
        </button>
        <h3 class="drawer-title">{{ titles[view] }}</h3>
        <button class="drawer-close" type="button" aria-label="Закрити кошик" @click="emit('close')">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </header>

      <!-- екран кошика -->
      <template v-if="view === 'cart'">
        <div class="drawer-body">
          <ul v-if="items.length" class="cart-list">
            <li v-for="item in items" :key="item.id" class="cart-item">
              <div class="cart-thumb" v-html="item.svg"></div>
              <div class="cart-info">
                <p class="cart-name">{{ item.name }}</p>
                <p class="cart-unit">{{ formatPrice(item.price) }} ₴ / шт.</p>
                <div class="cart-qty">
                  <button type="button" :aria-label="`Зменшити кількість: ${item.name}`" @click="emit('decrement', item.id)">−</button>
                  <span aria-live="polite">{{ item.qty }}</span>
                  <button type="button" :aria-label="`Збільшити кількість: ${item.name}`" @click="emit('increment', item.id)">+</button>
                </div>
              </div>
              <div class="cart-side">
                <button class="cart-remove" type="button" :aria-label="`Видалити ${item.name}`" @click="emit('remove', item.id)">
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
                    <path d="M6 6l12 12M18 6L6 18" />
                  </svg>
                </button>
                <p class="cart-line-total">{{ formatPrice(item.price * item.qty) }} ₴</p>
              </div>
            </li>
          </ul>

          <div v-else class="cart-empty">
            <svg viewBox="0 0 64 64" width="72" height="72" fill="none" aria-hidden="true">
              <circle cx="32" cy="32" r="30" fill="#eef2e0" />
              <path d="M20 26h24l-2 18H22l-2-18z" stroke="#71795f" stroke-width="2" stroke-linejoin="round" />
              <path d="M26 26v-3a6 6 0 0 1 12 0v3" stroke="#71795f" stroke-width="2" />
              <path d="M32 10c4 2.4 5.2 7.2 0 12-5.2-4.8-4-9.6 0-12z" fill="#16a34a" />
            </svg>
            <p class="cart-empty-title">Кошик порожній</p>
            <p class="cart-empty-text">Загляньте в каталог — там 12 рослин, які чекають на свій дім.</p>
            <button class="btn" type="button" @click="emit('close')">До каталогу</button>
          </div>
        </div>

        <footer v-if="items.length" class="drawer-foot">
          <div class="shipping-hint">
            <template v-if="total < FREE_SHIPPING">
              <p>До безкоштовної доставки ще <strong>{{ formatPrice(FREE_SHIPPING - total) }} ₴</strong></p>
              <div class="shipping-bar" role="presentation">
                <div class="shipping-bar-fill" :style="{ width: Math.min(100, (total / FREE_SHIPPING) * 100) + '%' }"></div>
              </div>
            </template>
            <p v-else class="shipping-free">
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M4 12.5l5 5L20 6.5" />
              </svg>
              Доставка безкоштовна
            </p>
          </div>
          <div class="total-row">
            <span>Разом</span>
            <strong>{{ formatPrice(total) }} ₴</strong>
          </div>
          <button class="btn btn-block" type="button" @click="view = 'form'">Оформити замовлення</button>
        </footer>
      </template>

      <!-- екран форми -->
      <template v-else-if="view === 'form'">
        <form class="drawer-body checkout-form" novalidate @submit.prevent="submitOrder">
          <div class="field">
            <label class="field-label" for="co-name">Імʼя</label>
            <input
              id="co-name"
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
            <label class="field-label" for="co-phone">Телефон</label>
            <input
              id="co-phone"
              v-model="form.phone"
              type="tel"
              class="field-input"
              :class="{ invalid: errors.phone }"
              placeholder="+380 (44) 574-80-16"
              autocomplete="tel"
              :aria-invalid="Boolean(errors.phone)"
              @blur="validateField('phone')"
              @input="onInput('phone')"
            />
            <p v-if="errors.phone" class="field-error">{{ errors.phone }}</p>
          </div>
          <div class="field">
            <label class="field-label" for="co-email">Email</label>
            <input
              id="co-email"
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
            <label class="field-label" for="co-address">Адреса доставки</label>
            <input
              id="co-address"
              v-model="form.address"
              type="text"
              class="field-input"
              :class="{ invalid: errors.address }"
              placeholder="м. Київ, вул. Ярославів Вал, 21, кв. 2"
              autocomplete="street-address"
              :aria-invalid="Boolean(errors.address)"
              @blur="validateField('address')"
              @input="onInput('address')"
            />
            <p v-if="errors.address" class="field-error">{{ errors.address }}</p>
          </div>
          <p class="checkout-note">Оплата при отриманні. Доставляємо по Києву та передмістю протягом 24 годин.</p>
        </form>
        <footer class="drawer-foot">
          <div class="total-row">
            <span>Разом</span>
            <strong>{{ formatPrice(total) }} ₴</strong>
          </div>
          <button class="btn btn-block" type="button" @click="submitOrder">Підтвердити замовлення</button>
        </footer>
      </template>

      <!-- екран успіху -->
      <div v-else class="drawer-body success">
        <div class="success-icon">
          <svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M4 12.5l5 5L20 6.5" />
          </svg>
        </div>
        <h4 class="success-title">Дякуємо!</h4>
        <p class="success-text">
          Замовлення <strong>№{{ orderNumber }}</strong> прийнято. Менеджер зателефонує вам протягом
          години, щоб узгодити доставку.
        </p>
        <button class="btn" type="button" @click="emit('close')">Продовжити покупки</button>
      </div>
    </aside>
  </Transition>
</template>

<style>
.drawer-backdrop {
  position: fixed;
  inset: 0;
  z-index: 70;
  background: rgba(26, 40, 24, 0.5);
}

.drawer {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 71;
  display: flex;
  flex-direction: column;
  width: min(420px, 100%);
  background: var(--cream);
  box-shadow: -18px 0 50px -30px rgba(26, 40, 24, 0.5);
}

.drawer-head {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 20px;
  border-bottom: 1px solid var(--line);
}

.drawer-title {
  font-size: 19px;
  color: var(--deep);
  margin-right: auto;
}

.drawer-back,
.drawer-close {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border-radius: 999px;
  border: 1px solid var(--line);
  background: var(--card);
  color: var(--muted);
  transition:
    color 0.15s ease,
    border-color 0.15s ease;
}

.drawer-back:hover,
.drawer-close:hover {
  color: var(--ink);
  border-color: var(--line-strong);
}

.drawer-body {
  flex: 1;
  overflow-y: auto;
  padding: 18px 20px;
}

/* --- список --- */
.cart-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.cart-item {
  display: flex;
  gap: 12px;
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: 14px;
  padding: 12px;
}

.cart-thumb {
  flex: none;
  width: 62px;
  height: 62px;
  border-radius: 10px;
  background: var(--cream-2);
  padding: 4px;
}

.cart-thumb svg {
  width: 100%;
  height: 100%;
}

.cart-info {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.cart-name {
  font-weight: 800;
  font-size: 14.5px;
  color: var(--ink);
}

.cart-unit {
  font-size: 12.5px;
  color: var(--muted);
}

.cart-qty {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-top: 6px;
}

.cart-qty button {
  display: grid;
  place-items: center;
  width: 26px;
  height: 26px;
  border-radius: 8px;
  border: 1px solid var(--line-strong);
  background: var(--card);
  font-size: 15px;
  font-weight: 700;
  color: var(--ink);
  line-height: 1;
  transition:
    border-color 0.15s ease,
    color 0.15s ease,
    background 0.15s ease;
}

.cart-qty button:hover {
  border-color: var(--brand);
  color: var(--brand-600);
  background: rgba(22, 163, 74, 0.06);
}

.cart-qty span {
  min-width: 16px;
  text-align: center;
  font-weight: 800;
  font-size: 14px;
}

.cart-side {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
  margin-left: auto;
}

.cart-remove {
  color: var(--muted);
  padding: 4px;
  border-radius: 6px;
  transition: color 0.15s ease;
}

.cart-remove:hover {
  color: var(--danger);
}

.cart-line-total {
  font-weight: 800;
  font-size: 14.5px;
  color: var(--deep);
  white-space: nowrap;
}

/* --- порожній стан --- */
.cart-empty {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  text-align: center;
  padding: 24px 12px;
}

.cart-empty-title {
  font-size: 18px;
  font-weight: 800;
  color: var(--deep);
  margin-top: 6px;
}

.cart-empty-text {
  font-size: 14px;
  color: var(--muted);
  max-width: 30ch;
  margin-bottom: 10px;
}

/* --- підвал --- */
.drawer-foot {
  border-top: 1px solid var(--line);
  padding: 14px 20px 18px;
  background: var(--card);
}

.shipping-hint {
  margin-bottom: 10px;
  font-size: 13px;
  color: var(--muted);
}

.shipping-hint strong {
  color: var(--ink);
}

.shipping-bar {
  height: 5px;
  margin-top: 6px;
  border-radius: 999px;
  background: var(--line);
  overflow: hidden;
}

.shipping-bar-fill {
  height: 100%;
  border-radius: 999px;
  background: var(--brand);
  transition: width 0.3s var(--ease-out);
}

.shipping-free {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--brand-600);
  font-weight: 700;
}

.total-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 12px;
  font-size: 15px;
}

.total-row strong {
  font-size: 21px;
  font-weight: 900;
  color: var(--deep);
}

/* --- форма --- */
.checkout-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.field-label {
  display: block;
  font-size: 13px;
  font-weight: 800;
  color: var(--ink);
  margin-bottom: 5px;
}

.field-input {
  width: 100%;
  height: 44px;
  padding: 0 13px;
  border: 1px solid var(--line-strong);
  border-radius: 11px;
  background: #fff;
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease;
}

.field-input::placeholder {
  color: #a9ad9c;
}

.field-input:focus {
  outline: none;
  border-color: var(--brand);
  box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.14);
}

.field-input.invalid {
  border-color: var(--danger);
}

.field-input.invalid:focus {
  box-shadow: 0 0 0 3px rgba(191, 59, 43, 0.12);
}

.field-error {
  margin-top: 4px;
  font-size: 12.5px;
  font-weight: 600;
  color: var(--danger);
}

.checkout-note {
  font-size: 13px;
  color: var(--muted);
  background: var(--cream-2);
  border-radius: 10px;
  padding: 10px 12px;
}

/* --- успіх --- */
.success {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  text-align: center;
  padding: 32px 24px;
}

.success-icon {
  display: grid;
  place-items: center;
  width: 72px;
  height: 72px;
  border-radius: 999px;
  background: var(--brand);
  animation: badge-pop 0.4s var(--ease-out);
}

.success-title {
  font-size: 24px;
  color: var(--deep);
}

.success-text {
  font-size: 14.5px;
  color: var(--ink);
  max-width: 32ch;
  margin-bottom: 12px;
}
</style>
