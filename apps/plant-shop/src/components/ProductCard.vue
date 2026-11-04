<script setup>
import { ref } from "vue";
import { CATEGORY_LABELS } from "../data/products.js";
import { formatPrice } from "../format.js";

const props = defineProps({
  product: { type: Object, required: true },
});
const emit = defineEmits(["add"]);

const added = ref(false);
let timer = null;

function add() {
  emit("add", props.product.id);
  added.value = true;
  clearTimeout(timer);
  timer = setTimeout(() => (added.value = false), 1400);
}
</script>

<template>
  <RouterLink :to="`/product/${product.id}`" class="card" :aria-label="`Детальніше про ${product.name}`">
    <div class="card-media">
      <img :src="product.image" :alt="product.name" width="900" height="900" loading="lazy" />
    </div>
    <div class="card-body">
      <span class="card-cat">{{ CATEGORY_LABELS[product.category] }}</span>
      <h3 class="card-name">{{ product.name }}</h3>
      <div class="card-row">
        <span class="card-price">{{ formatPrice(product.price) }} ₴</span>
        <button
          class="card-add"
          :class="{ 'is-added': added }"
          type="button"
          :aria-label="`Додати в кошик: ${product.name}`"
          @click.prevent.stop="add"
        >
          <svg v-if="!added" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M5 8h14l-1.3 12H6.3L5 8z" />
            <path d="M8.5 8V6.5a3.5 3.5 0 0 1 7 0V8" />
          </svg>
          <svg v-else viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M4 12.5l5 5L20 6.5" />
          </svg>
          <span>{{ added ? "Додано" : "У кошик" }}</span>
        </button>
      </div>
    </div>
  </RouterLink>
</template>

<style>
.card {
  display: flex;
  flex-direction: column;
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  overflow: hidden;
  cursor: pointer;
  transition:
    transform 0.22s var(--ease-out),
    box-shadow 0.22s ease,
    border-color 0.22s ease;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
  border-color: #cbdfc0;
}

.card-media {
  aspect-ratio: 1 / 1;
  background: var(--cream-2);
  overflow: hidden;
}

.card-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-body {
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 3px;
  padding: 14px 16px 16px;
}

.card-cat {
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--muted);
}

.card-name {
  font-size: 16.5px;
  line-height: 1.25;
  color: var(--ink);
}

.card-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-top: auto;
  padding-top: 12px;
}

.card-price {
  font-size: 17px;
  font-weight: 800;
  color: var(--deep);
  white-space: nowrap;
}

.card-add {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: var(--brand);
  color: #fff;
  border-radius: 999px;
  padding: 8px 14px;
  font-weight: 700;
  font-size: 13.5px;
  white-space: nowrap;
  transition:
    background 0.18s ease,
    transform 0.12s ease;
}

.card-add:hover {
  background: var(--brand-600);
}

.card-add:active {
  transform: scale(0.95);
}

.card-add.is-added {
  background: var(--deep);
}

@media (max-width: 560px) {
  .card-body {
    padding: 10px 12px 12px;
  }

  .card-name {
    font-size: 14px;
  }

  .card-price {
    font-size: 14.5px;
  }

  .card-add {
    padding: 7px 10px;
    font-size: 12px;
  }
}
</style>
