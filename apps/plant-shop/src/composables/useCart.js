import { computed, reactive, watch } from "vue";
import { PRODUCTS } from "../data/products.js";

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

/** Єдиний реактивний стан кошика, спільний для всіх сторінок. */
const cart = reactive(restoreCart());

watch(
  cart,
  (value) => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(value));
    } catch {
      // сховище недоступне (політики браузера) — кошик працює без persist
    }
  },
  { deep: true }
);

const cartItems = computed(() =>
  cart.map((item) => ({ ...PRODUCTS.find((p) => p.id === item.id), qty: item.qty }))
);
const cartCount = computed(() => cart.reduce((sum, item) => sum + item.qty, 0));
const cartTotal = computed(() =>
  cartItems.value.reduce((sum, item) => sum + item.price * item.qty, 0)
);

function addToCart(id) {
  const row = cart.find((item) => item.id === id);
  if (row) row.qty += 1;
  else cart.push({ id, qty: 1 });
}

function increment(id) {
  const row = cart.find((item) => item.id === id);
  if (row) row.qty += 1;
}

function decrement(id) {
  const row = cart.find((item) => item.id === id);
  if (!row) return;
  if (row.qty > 1) row.qty -= 1;
  else removeFromCart(id);
}

function removeFromCart(id) {
  const index = cart.findIndex((item) => item.id === id);
  if (index !== -1) cart.splice(index, 1);
}

function clearCart() {
  cart.splice(0, cart.length);
}

export function useCart() {
  return {
    cartItems,
    cartCount,
    cartTotal,
    addToCart,
    increment,
    decrement,
    removeFromCart,
    clearCart,
  };
}
