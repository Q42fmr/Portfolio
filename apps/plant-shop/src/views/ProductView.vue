<script setup>
import { computed, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { CATEGORY_LABELS, PRODUCTS } from "../data/products.js";
import { formatPrice } from "../format.js";
import { useCart } from "../composables/useCart.js";
import ProductCard from "../components/ProductCard.vue";

const route = useRoute();
const { addToCart } = useCart();

const product = computed(() => PRODUCTS.find((p) => p.id === route.params.id) || null);

const related = computed(() => {
  if (!product.value) return [];
  return PRODUCTS.filter((p) => p.category === product.value.category && p.id !== product.value.id).slice(0, 3);
});

const added = ref(false);
let timer = null;

watch(product, () => {
  added.value = false;
  clearTimeout(timer);
  document.title = product.value ? `${product.value.name} — Verde` : "Товар не знайдено — Verde";
}, { immediate: true });

function add() {
  if (!product.value) return;
  addToCart(product.value.id);
  added.value = true;
  clearTimeout(timer);
  timer = setTimeout(() => (added.value = false), 1400);
}
</script>

<template>
  <section v-if="product" class="product-page">
    <div class="container">
      <RouterLink class="breadcrumb" to="/catalog">← До каталогу</RouterLink>

      <div class="product-layout">
        <div class="product-media">
          <img :src="product.image" :alt="product.name" width="900" height="900" />
        </div>
        <div class="product-info">
          <span class="modal-chip">{{ CATEGORY_LABELS[product.category] }}</span>
          <h1 class="modal-name">{{ product.name }}</h1>
          <p class="modal-desc">{{ product.description }}</p>
          <div class="modal-care">
            <h4>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M5 19C5 9.5 12 4 20 4c0 8-5.5 15-15 15z" />
                <path d="M5 19c3-6 7-9.5 11-11.5" />
              </svg>
              Догляд
            </h4>
            <p>{{ product.care }}</p>
          </div>
          <div class="modal-foot">
            <span class="modal-price">{{ formatPrice(product.price) }} ₴</span>
            <button class="btn" :class="{ 'btn-added': added }" type="button" @click="add">
              <svg v-if="added" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M4 12.5l5 5L20 6.5" />
              </svg>
              {{ added ? "Додано" : "У кошик" }}
            </button>
          </div>
        </div>
      </div>

      <div v-if="related.length" class="related">
        <h2 class="section-title">Схожі рослини</h2>
        <div class="products-grid">
          <ProductCard v-for="p in related" :key="p.id" :product="p" @add="addToCart" />
        </div>
      </div>
    </div>
  </section>

  <section v-else class="product-missing">
    <div class="container">
      <h1>Такого товару немає</h1>
      <p>Можливо, його вже розкупили, або посилання застаріло.</p>
      <RouterLink class="btn" to="/catalog">До каталогу</RouterLink>
    </div>
  </section>
</template>

<style>
.product-page {
  padding: 40px 0 88px;
}

.breadcrumb {
  display: inline-block;
  font-size: 14px;
  font-weight: 700;
  color: var(--brand-700);
  margin-bottom: 20px;
}

.breadcrumb:hover {
  color: var(--brand-600);
}

.product-layout {
  display: grid;
  grid-template-columns: minmax(280px, 440px) 1fr;
  gap: 40px;
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: 22px;
  padding: 28px;
  box-shadow: var(--shadow-sm);
}

.product-media {
  border-radius: 16px;
  overflow: hidden;
  background: var(--cream-2);
  aspect-ratio: 1 / 1;
}

.product-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.modal-chip {
  align-self: flex-start;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--brand-700);
  background: rgba(22, 163, 74, 0.1);
  border-radius: 999px;
  padding: 4px 10px;
}

.modal-name {
  font-size: 30px;
  color: var(--deep);
}

.modal-desc {
  font-size: 16px;
  color: var(--ink);
}

.modal-care {
  background: #f1f7ec;
  border-left: 3px solid var(--brand);
  border-radius: 10px;
  padding: 14px 16px;
}

.modal-care h4 {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: var(--brand-700);
  margin-bottom: 4px;
}

.modal-care p {
  font-size: 14px;
  color: var(--ink);
}

.modal-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: auto;
  padding-top: 14px;
}

.modal-price {
  font-size: 26px;
  font-weight: 900;
  color: var(--deep);
}

.related {
  margin-top: 56px;
}

.related .section-title {
  margin-bottom: 18px;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(215px, 1fr));
  gap: 20px;
}

.product-missing {
  padding: 90px 0;
  text-align: center;
}

.product-missing h1 {
  font-size: 30px;
  color: var(--deep);
  margin-bottom: 10px;
}

.product-missing p {
  color: var(--muted);
  margin-bottom: 20px;
}

@media (max-width: 720px) {
  .product-layout {
    grid-template-columns: 1fr;
    padding: 18px;
    gap: 22px;
  }
}
</style>
