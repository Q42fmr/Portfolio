<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { CATEGORIES, PRODUCTS } from "./data/products.js";
import { formatPrice, pluralizeItems } from "./format.js";
import ProductCard from "./components/ProductCard.vue";
import ProductModal from "./components/ProductModal.vue";
import CartDrawer from "./components/CartDrawer.vue";

/* ---------- фільтри ---------- */
const PRICE_MAX = 1500;
const activeCategory = ref("all");
const searchQuery = ref("");
const sortBy = ref("name");
const maxPrice = ref(PRICE_MAX);

const filteredProducts = computed(() => {
  let list = PRODUCTS;
  if (activeCategory.value !== "all") {
    list = list.filter((p) => p.category === activeCategory.value);
  }
  const query = searchQuery.value.trim().toLowerCase();
  if (query) {
    list = list.filter((p) => p.name.toLowerCase().includes(query));
  }
  list = list.filter((p) => p.price <= maxPrice.value);
  const sorted = [...list];
  switch (sortBy.value) {
    case "price-asc":
      sorted.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      sorted.sort((a, b) => b.price - a.price);
      break;
    default:
      sorted.sort((a, b) => a.name.localeCompare(b.name, "uk"));
  }
  return sorted;
});

const hasActiveFilters = computed(
  () =>
    activeCategory.value !== "all" ||
    searchQuery.value.trim() !== "" ||
    sortBy.value !== "name" ||
    maxPrice.value < PRICE_MAX
);

function resetFilters() {
  activeCategory.value = "all";
  searchQuery.value = "";
  sortBy.value = "name";
  maxPrice.value = PRICE_MAX;
}

/* ---------- кошик ---------- */
const CART_KEY = "verde-cart";

function restoreCart() {
  try {
    const raw = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    if (!Array.isArray(raw)) return [];
    return raw.filter(
      (item) =>
        item &&
        typeof item === "object" &&
        PRODUCTS.some((p) => p.id === item.id) &&
        Number.isInteger(item.qty) &&
        item.qty > 0
    );
  } catch {
    return [];
  }
}

const cart = ref(restoreCart());

watch(
  cart,
  (value) => {
    localStorage.setItem(CART_KEY, JSON.stringify(value));
  },
  { deep: true }
);

const cartItems = computed(() =>
  cart.value.map((item) => ({ ...PRODUCTS.find((p) => p.id === item.id), qty: item.qty }))
);
const cartCount = computed(() => cart.value.reduce((sum, item) => sum + item.qty, 0));
const cartTotal = computed(() =>
  cartItems.value.reduce((sum, item) => sum + item.price * item.qty, 0)
);

function addToCart(id) {
  const row = cart.value.find((item) => item.id === id);
  if (row) row.qty += 1;
  else cart.value.push({ id, qty: 1 });
}

function increment(id) {
  const row = cart.value.find((item) => item.id === id);
  if (row) row.qty += 1;
}

function decrement(id) {
  const row = cart.value.find((item) => item.id === id);
  if (!row) return;
  if (row.qty > 1) row.qty -= 1;
  else removeFromCart(id);
}

function removeFromCart(id) {
  cart.value = cart.value.filter((item) => item.id !== id);
}

function clearCart() {
  cart.value = [];
}

/* ---------- оверлеї ---------- */
const cartOpen = ref(false);
const menuOpen = ref(false);
const selectedProduct = ref(null);

function openProduct(product) {
  selectedProduct.value = product;
}

function closeProduct() {
  selectedProduct.value = null;
}

watch([cartOpen, selectedProduct], ([drawer, modal]) => {
  document.body.classList.toggle("no-scroll", Boolean(drawer || modal));
});

function onKeydown(event) {
  if (event.key !== "Escape") return;
  if (selectedProduct.value) closeProduct();
  else if (cartOpen.value) cartOpen.value = false;
  else if (menuOpen.value) menuOpen.value = false;
}

onMounted(() => window.addEventListener("keydown", onKeydown));
onBeforeUnmount(() => window.removeEventListener("keydown", onKeydown));
</script>

<template>
  <header class="site-header">
    <div class="container header-inner">
      <a class="logo" href="#top" aria-label="Verde — на початок сторінки">
        <svg viewBox="0 0 32 32" width="30" height="30" aria-hidden="true">
          <circle cx="16" cy="16" r="16" fill="#16a34a" />
          <path d="M16 6c6 3.6 7.8 10.8 0 18-7.8-7.2-6-14.4 0-18z" fill="#fdfbf7" />
        </svg>
        <span>Verde</span>
      </a>

      <nav class="nav" :class="{ open: menuOpen }" aria-label="Основна навігація">
        <a href="#catalog" @click="menuOpen = false">Каталог</a>
        <a href="#benefits" @click="menuOpen = false">Переваги</a>
        <a href="#contacts" @click="menuOpen = false">Контакти</a>
      </nav>

      <div class="header-actions">
        <button
          class="icon-btn burger"
          type="button"
          aria-label="Меню"
          :aria-expanded="menuOpen"
          @click="menuOpen = !menuOpen"
        >
          <svg v-if="!menuOpen" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
            <path d="M3 6h18M3 12h18M3 18h18" />
          </svg>
          <svg v-else viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
            <path d="M5 5l14 14M19 5L5 19" />
          </svg>
        </button>

        <button class="icon-btn cart-btn" type="button" aria-label="Відкрити кошик" @click="cartOpen = true">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M5 8h14l-1.3 12H6.3L5 8z" />
            <path d="M8.5 8V6.5a3.5 3.5 0 0 1 7 0V8" />
          </svg>
          <Transition name="pop">
            <span v-if="cartCount" :key="cartCount" class="cart-badge">{{ cartCount }}</span>
          </Transition>
        </button>
      </div>
    </div>
  </header>

  <main>
    <!-- ================= HERO ================= -->
    <section class="hero" id="top">
      <div class="container hero-inner">
        <div class="hero-text">
          <p class="eyebrow">Магазин кімнатних рослин</p>
          <h1 class="hero-title">Verde<span class="hero-dot">.</span></h1>
          <p class="hero-slogan">Зелень, з якою дім оживає.</p>
          <p class="hero-sub">
            Добірка невибагливих рослин із доставкою по Києву за 24 години. До кожної — інструкція
            догляду простою мовою.
          </p>
          <div class="hero-cta">
            <a class="btn btn-lg" href="#catalog">До каталогу</a>
            <a class="btn btn-lg btn-ghost" href="#benefits">Як ми працюємо</a>
          </div>
        </div>

        <div class="hero-art" aria-hidden="true">
          <svg viewBox="0 0 440 380">
            <path d="M70 372 L70 200 C 70 110 138 44 224 44 C 310 44 378 110 378 200 L378 372 Z" fill="#e9f1da" />
            <circle cx="122" cy="88" r="24" fill="#f3c052" />
            <g fill="none" stroke="#1e7a41" stroke-width="7" stroke-linecap="round">
              <path d="M224 300 C 220 250 200 220 168 196" />
              <path d="M224 300 C 228 246 250 214 284 192" />
              <path d="M224 300 C 224 252 224 224 224 196" />
            </g>
            <path d="M168 196 C 112 200 84 144 110 96 C 168 82 210 130 198 188 C 190 204 178 204 168 196 Z" fill="#35a35f" />
            <path d="M284 192 C 340 194 368 136 340 90 C 282 76 240 126 254 184 C 262 200 274 200 284 192 Z" fill="#1e7a41" />
            <path d="M224 196 C 190 168 194 120 224 96 C 254 120 258 168 224 196 Z" fill="#35a35f" />
            <g fill="none" stroke="#e9f1da" stroke-width="10" stroke-linecap="round">
              <path d="M122 110 L 162 148" />
              <path d="M112 140 L 152 168" />
              <path d="M330 104 L 290 142" />
              <path d="M340 134 L 298 162" />
            </g>
            <path d="M158 292 h132 v20 h-12 l-14 60 h-80 l-14 -60 h-12 z" fill="#c2703d" />
            <path d="M186 336 h76" stroke="#e9f1da" stroke-width="6" stroke-linecap="round" />
          </svg>
        </div>
      </div>
    </section>

    <!-- ================= ПЕРЕВАГИ ================= -->
    <section class="benefits" id="benefits">
      <div class="container benefits-inner">
        <div class="benefit">
          <span class="benefit-icon">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M1.5 6h12v10h-12z" />
              <path d="M13.5 9.5h4l3 3.2V16h-7" />
              <circle cx="6" cy="18" r="2" />
              <circle cx="17" cy="18" r="2" />
            </svg>
          </span>
          <div>
            <h3>Доставка за 24 години</h3>
            <p>По Києву та передмістю — дбайливо запаковано, з підігрівом узимку.</p>
          </div>
        </div>
        <div class="benefit">
          <span class="benefit-icon">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M12 3l7 3v5c0 4.6-3 7.7-7 9.2C8 18.7 5 15.6 5 11V6z" />
              <path d="M9 11.5l2 2 4-4" />
            </svg>
          </span>
          <div>
            <h3>30 днів гарантії</h3>
            <p>Якщо рослина загине не з вашої вини — безкоштовно замінимо.</p>
          </div>
        </div>
        <div class="benefit">
          <span class="benefit-icon">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M4 5h16v11H9.5L4 20z" />
              <path d="M8 9h8M8 12h5" />
            </svg>
          </span>
          <div>
            <h3>Підтримка догляду</h3>
            <p>Підкажемо, що робити з жовтим листям, — просто напишіть нам.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ================= КАТАЛОГ ================= -->
    <section class="catalog" id="catalog">
      <div class="container">
        <div class="catalog-head">
          <div>
            <p class="eyebrow">Каталог</p>
            <h2 class="section-title">Оберіть свою рослину</h2>
          </div>
          <p class="results-line" aria-live="polite">
            Знайдено: <strong>{{ filteredProducts.length }}</strong>
            {{ pluralizeItems(filteredProducts.length) }}
          </p>
        </div>

        <div class="filters">
          <div class="filter-cats" role="group" aria-label="Категорії">
            <button
              v-for="cat in CATEGORIES"
              :key="cat.id"
              class="cat-pill"
              :class="{ active: activeCategory === cat.id }"
              type="button"
              @click="activeCategory = cat.id"
            >
              {{ cat.label }}
            </button>
            <button v-if="hasActiveFilters" class="reset-pill" type="button" @click="resetFilters">
              Скинути фільтри
            </button>
          </div>

          <div class="filter-row">
            <div>
              <label class="filter-label" for="search-input">Пошук за назвою</label>
              <div class="search-wrap">
                <svg class="search-icon" viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
                  <circle cx="11" cy="11" r="7" />
                  <path d="M20 20l-4-4" />
                </svg>
                <input
                  id="search-input"
                  v-model="searchQuery"
                  type="text"
                  class="search-input"
                  placeholder="Наприклад, монстера…"
                />
                <button
                  v-if="searchQuery"
                  class="search-clear"
                  type="button"
                  aria-label="Очистити пошук"
                  @click="searchQuery = ''"
                >
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true">
                    <path d="M6 6l12 12M18 6L6 18" />
                  </svg>
                </button>
              </div>
            </div>

            <div>
              <label class="filter-label" for="sort-select">Сортування</label>
              <select id="sort-select" v-model="sortBy" class="sort-select">
                <option value="name">За назвою</option>
                <option value="price-asc">Ціна ↑</option>
                <option value="price-desc">Ціна ↓</option>
              </select>
            </div>

            <div>
              <div class="range-head">
                <label class="filter-label" for="price-range">Ціна до</label>
                <output class="range-value" for="price-range">{{ formatPrice(maxPrice) }} ₴</output>
              </div>
              <input
                id="price-range"
                v-model.number="maxPrice"
                type="range"
                min="100"
                max="1500"
                step="25"
              />
              <div class="range-scale"><span>100 ₴</span><span>1 500 ₴</span></div>
            </div>
          </div>
        </div>

        <div v-if="filteredProducts.length" class="products-grid">
          <ProductCard
            v-for="product in filteredProducts"
            :key="product.id"
            :product="product"
            @open="openProduct"
            @add="addToCart"
          />
        </div>

        <div v-else class="empty-state">
          <svg viewBox="0 0 64 64" width="88" height="88" fill="none" aria-hidden="true">
            <circle cx="32" cy="32" r="30" fill="#eef2e0" />
            <circle cx="28" cy="28" r="11" stroke="#71795f" stroke-width="2.4" />
            <path d="M36.5 36.5L46 46" stroke="#71795f" stroke-width="2.4" stroke-linecap="round" />
            <path d="M28 21c3.4 2 4.4 6.1 0 10.2-4.4-4.1-3.4-8.2 0-10.2z" fill="#16a34a" />
          </svg>
          <h3>Нічого не знайдено</h3>
          <p>Спробуйте інший запит або скиньте фільтри — можливо, ваша рослина сховалась.</p>
          <button class="btn btn-ghost" type="button" @click="resetFilters">Скинути фільтри</button>
        </div>
      </div>
    </section>
  </main>

  <!-- ================= ФУТЕР ================= -->
  <footer class="site-footer" id="contacts">
    <div class="container footer-grid">
      <div class="footer-brand">
        <a class="logo logo-light" href="#top">
          <svg viewBox="0 0 32 32" width="28" height="28" aria-hidden="true">
            <circle cx="16" cy="16" r="16" fill="#16a34a" />
            <path d="M16 6c6 3.6 7.8 10.8 0 18-7.8-7.2-6-14.4 0-18z" fill="#fdfbf7" />
          </svg>
          <span>Verde</span>
        </a>
        <p>
          Магазин кімнатних рослин, який допомагає озеленити дім без стресу: підбираємо, доставляємо
          і вчимо доглядати.
        </p>
      </div>
      <div class="footer-col">
        <h4>Контакти</h4>
        <a href="tel:+380441234567">+380 (44) 123-45-67</a>
        <a href="mailto:hello@verde.plants">hello@verde.plants</a>
        <p>м. Київ, вул. Прикладна, 1</p>
      </div>
      <div class="footer-col">
        <h4>Графік роботи</h4>
        <p>Пн–Пт: 9:00–20:00</p>
        <p>Сб–Нд: 10:00–18:00</p>
      </div>
    </div>
    <div class="container footer-bottom">
      <span class="demo-badge">Демо-проєкт для портфоліо</span>
      <a class="back-link" href="../../index.html#projects">← До портфоліо</a>
    </div>
  </footer>

  <ProductModal :product="selectedProduct" @close="closeProduct" @add="addToCart" />
  <CartDrawer
    :open="cartOpen"
    :items="cartItems"
    :total="cartTotal"
    @close="cartOpen = false"
    @increment="increment"
    @decrement="decrement"
    @remove="removeFromCart"
    @clear="clearCart"
  />
</template>

<style>
/* ================= ХЕДЕР ================= */
.site-header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(253, 251, 247, 0.88);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--line);
}

.header-inner {
  display: flex;
  align-items: center;
  gap: 28px;
  height: 66px;
}

.logo {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  font-size: 21px;
  font-weight: 900;
  color: var(--deep);
  letter-spacing: -0.3px;
}

.nav {
  display: flex;
  gap: 26px;
  margin-left: 12px;
}

.nav a {
  font-weight: 700;
  font-size: 14.5px;
  color: var(--ink);
  transition: color 0.15s ease;
}

.nav a:hover {
  color: var(--brand-600);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
}

.icon-btn {
  position: relative;
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  color: var(--ink);
  transition:
    background 0.15s ease,
    color 0.15s ease;
}

.icon-btn:hover {
  background: rgba(22, 163, 74, 0.08);
  color: var(--brand-700);
}

.cart-badge {
  position: absolute;
  top: 1px;
  right: 0;
  min-width: 17px;
  height: 17px;
  padding: 0 4px;
  display: grid;
  place-items: center;
  border-radius: 999px;
  background: var(--brand);
  color: #fff;
  font-size: 10.5px;
  font-weight: 800;
  line-height: 1;
}

.burger {
  display: none;
}

@media (max-width: 800px) {
  .burger {
    display: grid;
  }

  .nav {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    flex-direction: column;
    gap: 0;
    margin: 0;
    padding: 6px 24px 14px;
    background: var(--cream);
    border-bottom: 1px solid var(--line);
    box-shadow: var(--shadow-md);
    opacity: 0;
    visibility: hidden;
    transform: translateY(-8px);
    transition:
      opacity 0.2s ease,
      transform 0.2s var(--ease-out),
      visibility 0.2s;
  }

  .nav.open {
    opacity: 1;
    visibility: visible;
    transform: none;
  }

  .nav a {
    padding: 12px 0;
    border-bottom: 1px solid var(--line);
    font-size: 16px;
  }

  .nav a:last-child {
    border-bottom: none;
  }
}

/* ================= HERO ================= */
.hero {
  padding: 64px 0 72px;
  overflow: hidden;
}

.hero-inner {
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  gap: 48px;
  align-items: center;
}

.hero-title {
  font-size: clamp(56px, 9vw, 92px);
  font-weight: 900;
  line-height: 0.95;
  letter-spacing: -2px;
  color: var(--deep);
  margin: 10px 0 6px;
}

.hero-dot {
  color: #c2703d;
}

.hero-slogan {
  font-size: clamp(20px, 3.2vw, 27px);
  font-weight: 800;
  color: var(--ink);
  margin-bottom: 12px;
}

.hero-sub {
  font-size: 16.5px;
  color: var(--muted);
  max-width: 46ch;
}

.hero-cta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 30px;
}

.hero-art svg {
  width: 100%;
  height: auto;
}

@media (max-width: 900px) {
  .hero {
    padding: 40px 0 48px;
  }

  .hero-inner {
    grid-template-columns: 1fr;
    gap: 32px;
  }

  .hero-art {
    max-width: 380px;
    margin: 0 auto;
  }
}

/* ================= ПЕРЕВАГИ ================= */
.benefits {
  padding: 30px 0;
  background: var(--cream-2);
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
  scroll-margin-top: 80px;
}

.benefits-inner {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;
}

.benefit {
  display: flex;
  align-items: flex-start;
  gap: 13px;
}

.benefit-icon {
  flex: none;
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: rgba(22, 163, 74, 0.12);
  color: var(--brand-700);
}

.benefit h3 {
  font-size: 15.5px;
  color: var(--deep);
  margin-bottom: 2px;
}

.benefit p {
  font-size: 13.5px;
  color: var(--muted);
}

@media (max-width: 820px) {
  .benefits-inner {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}

/* ================= КАТАЛОГ ================= */
.catalog {
  padding: 64px 0 88px;
  scroll-margin-top: 66px;
}

.catalog-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 22px;
}

.results-line {
  font-size: 14px;
  color: var(--muted);
  white-space: nowrap;
  padding-bottom: 4px;
}

.results-line strong {
  color: var(--deep);
}

@media (max-width: 640px) {
  .catalog {
    padding: 44px 0 64px;
  }

  .catalog-head {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }
}

/* --- фільтри --- */
.filters {
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: 18px;
  padding: 18px;
  margin-bottom: 26px;
  box-shadow: var(--shadow-sm);
}

.filter-cats {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.cat-pill {
  border: 1px solid var(--line-strong);
  border-radius: 999px;
  padding: 8px 16px;
  font-weight: 700;
  font-size: 13.5px;
  color: var(--ink);
  background: transparent;
  transition:
    background 0.16s ease,
    color 0.16s ease,
    border-color 0.16s ease;
}

.cat-pill:hover {
  border-color: var(--brand);
  color: var(--brand-600);
}

.cat-pill.active {
  background: var(--brand);
  border-color: var(--brand);
  color: #fff;
}

.reset-pill {
  margin-left: auto;
  font-size: 13px;
  font-weight: 700;
  color: var(--muted);
  text-decoration: underline;
  text-underline-offset: 3px;
  padding: 8px 4px;
  transition: color 0.15s ease;
}

.reset-pill:hover {
  color: var(--danger);
}

.filter-row {
  display: grid;
  grid-template-columns: minmax(220px, 1.3fr) minmax(150px, 0.8fr) minmax(210px, 1fr);
  gap: 16px;
  align-items: end;
}

.filter-label {
  display: block;
  font-size: 12.5px;
  font-weight: 800;
  color: var(--muted);
  margin-bottom: 6px;
}

.search-wrap {
  position: relative;
}

.search-icon {
  position: absolute;
  top: 50%;
  left: 13px;
  transform: translateY(-50%);
  color: var(--muted);
  pointer-events: none;
}

.search-input {
  width: 100%;
  height: 44px;
  padding: 0 38px 0 38px;
  border: 1px solid var(--line-strong);
  border-radius: 12px;
  background: #fff;
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease;
}

.search-input::placeholder {
  color: #a9ad9c;
}

.search-input:focus {
  outline: none;
  border-color: var(--brand);
  box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.14);
}

.search-clear {
  position: absolute;
  top: 50%;
  right: 8px;
  transform: translateY(-50%);
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  color: var(--muted);
  transition:
    color 0.15s ease,
    background 0.15s ease;
}

.search-clear:hover {
  color: var(--ink);
  background: var(--cream-2);
}

.sort-select {
  width: 100%;
  height: 44px;
  padding: 0 36px 0 14px;
  border: 1px solid var(--line-strong);
  border-radius: 12px;
  background: #fff
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2371795f' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")
    no-repeat right 12px center / 16px;
  appearance: none;
  cursor: pointer;
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease;
}

.sort-select:focus {
  outline: none;
  border-color: var(--brand);
  box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.14);
}

.range-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
}

.range-value {
  font-size: 13.5px;
  font-weight: 800;
  color: var(--brand-700);
}

input[type="range"] {
  width: 100%;
  height: 24px;
  margin: 6px 0 0;
  accent-color: var(--brand);
  cursor: pointer;
}

.range-scale {
  display: flex;
  justify-content: space-between;
  font-size: 11.5px;
  color: var(--muted);
}

@media (max-width: 780px) {
  .filter-row {
    grid-template-columns: 1fr;
    gap: 14px;
  }

  .reset-pill {
    margin-left: 0;
  }
}

/* --- сітка товарів --- */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(215px, 1fr));
  gap: 20px;
}

@media (max-width: 560px) {
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
}

@media (max-width: 350px) {
  .products-grid {
    grid-template-columns: 1fr;
  }
}

/* --- порожній результат --- */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  text-align: center;
  padding: 56px 16px;
}

.empty-state h3 {
  font-size: 21px;
  color: var(--deep);
  margin-top: 8px;
}

.empty-state p {
  color: var(--muted);
  max-width: 42ch;
  margin-bottom: 12px;
}

/* ================= ФУТЕР ================= */
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
