<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";

defineProps({
  cartCount: { type: Number, default: 0 },
});
const emit = defineEmits(["open-cart"]);

const menuOpen = ref(false);

function onKeydown(event) {
  if (event.key === "Escape" && menuOpen.value) menuOpen.value = false;
}

onMounted(() => window.addEventListener("keydown", onKeydown));
onBeforeUnmount(() => window.removeEventListener("keydown", onKeydown));
</script>

<template>
  <header class="site-header">
    <div class="container header-inner">
      <RouterLink class="logo" to="/" aria-label="Verde — на головну" @click="menuOpen = false">
        <svg viewBox="0 0 32 32" width="30" height="30" aria-hidden="true">
          <circle cx="16" cy="16" r="16" fill="#16a34a" />
          <path d="M16 6c6 3.6 7.8 10.8 0 18-7.8-7.2-6-14.4 0-18z" fill="#fdfbf7" />
        </svg>
        <span>Verde</span>
      </RouterLink>

      <nav class="nav" :class="{ open: menuOpen }" aria-label="Основна навігація">
        <RouterLink to="/catalog" @click="menuOpen = false">Каталог</RouterLink>
        <RouterLink to="/about" @click="menuOpen = false">Про нас</RouterLink>
        <RouterLink to="/delivery" @click="menuOpen = false">Доставка</RouterLink>
        <RouterLink to="/contacts" @click="menuOpen = false">Контакти</RouterLink>
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

        <button class="icon-btn cart-btn" type="button" aria-label="Відкрити кошик" @click="emit('open-cart')">
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
</template>

<style>
/* хедер */
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

.nav a.router-link-active {
  color: var(--brand-700);
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
</style>
