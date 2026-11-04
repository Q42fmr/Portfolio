<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import AppHeader from "./components/AppHeader.vue";
import AppFooter from "./components/AppFooter.vue";
import CartDrawer from "./components/CartDrawer.vue";
import { useCart } from "./composables/useCart.js";

const { cartItems, cartCount, cartTotal, increment, decrement, removeFromCart, clearCart } =
  useCart();

const cartOpen = ref(false);

watch(cartOpen, (open) => {
  document.body.classList.toggle("no-scroll", open);
});

function onKeydown(event) {
  if (event.key === "Escape" && cartOpen.value) cartOpen.value = false;
}

onMounted(() => window.addEventListener("keydown", onKeydown));
onBeforeUnmount(() => window.removeEventListener("keydown", onKeydown));
</script>

<template>
  <a href="#main" class="skip-link">Перейти до контенту</a>
  <AppHeader :cart-count="cartCount" @open-cart="cartOpen = true" />

  <main id="main">
    <RouterView />
  </main>

  <AppFooter />

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
