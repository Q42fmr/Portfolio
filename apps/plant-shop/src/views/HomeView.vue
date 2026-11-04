<script setup>
import { computed } from "vue";
import { PRODUCTS } from "../data/products.js";
import { useCart } from "../composables/useCart.js";
import ProductCard from "../components/ProductCard.vue";

const { addToCart } = useCart();

const FEATURED_IDS = ["monstera", "ficus-lyrata", "strelitzia", "sansevieria"];
const featured = computed(() => FEATURED_IDS.map((id) => PRODUCTS.find((p) => p.id === id)));
</script>

<template>
  <!-- hero -->
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
          <RouterLink class="btn btn-lg" to="/catalog">До каталогу</RouterLink>
          <a class="btn btn-lg btn-ghost" href="#benefits">Як ми працюємо</a>
        </div>
      </div>

      <div class="hero-art">
        <img
          src="/img/hero-greenhouse-walkway.jpg"
          alt="Світла тропічна оранжерея з пишною зеленню"
          width="960"
          height="720"
        />
      </div>
    </div>
  </section>

  <!-- переваги -->
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

  <!-- популярне -->
  <section class="catalog" id="featured">
    <div class="container">
      <div class="catalog-head">
        <div>
          <p class="eyebrow">Популярне</p>
          <h2 class="section-title">Улюблене наших покупців</h2>
        </div>
        <RouterLink class="results-line" to="/catalog">Весь каталог →</RouterLink>
      </div>

      <div class="products-grid">
        <ProductCard
          v-for="product in featured"
          :key="product.id"
          :product="product"
          @add="addToCart"
        />
      </div>
    </div>
  </section>
</template>

<style>
/* hero */
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

.hero-art {
  border-radius: 24px;
  overflow: hidden;
  box-shadow: var(--shadow-md);
}

.hero-art img {
  width: 100%;
  height: auto;
  display: block;
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
    max-width: 480px;
    margin: 0 auto;
  }
}

/* переваги */
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

/* секція популярного (спільні класи з каталогом) */
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
  font-weight: 700;
  color: var(--brand-700);
  white-space: nowrap;
  padding-bottom: 4px;
}

.results-line strong {
  color: var(--deep);
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(215px, 1fr));
  gap: 20px;
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
</style>
