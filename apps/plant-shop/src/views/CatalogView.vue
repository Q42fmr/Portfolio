<script setup>
import { computed, ref } from "vue";
import { CATEGORIES, PRODUCTS } from "../data/products.js";
import { formatPrice, pluralizeItems } from "../format.js";
import { useCart } from "../composables/useCart.js";
import ProductCard from "../components/ProductCard.vue";

const { addToCart } = useCart();

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
</script>

<template>
  <section class="catalog" id="catalog">
    <div class="container">
      <div class="catalog-head">
        <div>
          <p class="eyebrow">Каталог</p>
          <h1 class="section-title">Оберіть свою рослину</h1>
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
</template>

<style>
/* каталог */
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
</style>
