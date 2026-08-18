<script setup>
import { ref, watch } from "vue";
import { CATEGORY_LABELS } from "../data/products.js";
import { formatPrice } from "../format.js";

const props = defineProps({
  product: { type: Object, default: null },
});
const emit = defineEmits(["close", "add"]);

const added = ref(false);
let timer = null;

watch(
  () => props.product,
  () => {
    added.value = false;
    clearTimeout(timer);
  }
);

function add() {
  emit("add", props.product.id);
  added.value = true;
  clearTimeout(timer);
  timer = setTimeout(() => (added.value = false), 1400);
}
</script>

<template>
  <Transition name="modal">
    <div v-if="product" class="modal-backdrop" @click.self="emit('close')">
      <div class="modal" role="dialog" aria-modal="true" :aria-label="product.name">
        <button class="modal-close" type="button" aria-label="Закрити" @click="emit('close')">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
        <div class="modal-media" v-html="product.svg"></div>
        <div class="modal-info">
          <span class="modal-chip">{{ CATEGORY_LABELS[product.category] }}</span>
          <h3 class="modal-name">{{ product.name }}</h3>
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
    </div>
  </Transition>
</template>

<style>
.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 60;
  display: grid;
  place-items: center;
  padding: 20px;
  background: rgba(26, 40, 24, 0.5);
}

.modal {
  position: relative;
  display: grid;
  grid-template-columns: 280px 1fr;
  width: min(720px, 100%);
  max-height: calc(100vh - 40px);
  overflow: auto;
  background: var(--card);
  border-radius: 20px;
  box-shadow: var(--shadow-md);
}

.modal-close {
  position: absolute;
  top: 14px;
  right: 14px;
  z-index: 2;
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border-radius: 999px;
  background: var(--cream);
  border: 1px solid var(--line);
  color: var(--muted);
  transition:
    color 0.15s ease,
    border-color 0.15s ease;
}

.modal-close:hover {
  color: var(--ink);
  border-color: var(--line-strong);
}

.modal-media {
  padding: 26px;
  background: var(--cream-2);
  display: grid;
  place-items: center;
}

.modal-media svg {
  width: 100%;
  max-width: 240px;
  height: auto;
}

.modal-info {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 28px 30px 26px;
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
  font-size: 24px;
  color: var(--deep);
}

.modal-desc {
  font-size: 15px;
  color: var(--ink);
}

.modal-care {
  background: #f1f7ec;
  border-left: 3px solid var(--brand);
  border-radius: 10px;
  padding: 12px 14px;
}

.modal-care h4 {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13.5px;
  color: var(--brand-700);
  margin-bottom: 4px;
}

.modal-care p {
  font-size: 13.5px;
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
  font-size: 24px;
  font-weight: 900;
  color: var(--deep);
}

@media (max-width: 640px) {
  .modal {
    grid-template-columns: 1fr;
  }

  .modal-media {
    padding: 18px;
  }

  .modal-media svg {
    max-width: 180px;
  }

  .modal-info {
    padding: 20px;
  }
}
</style>
