import { createRouter, createWebHashHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import CatalogView from "../views/CatalogView.vue";
import ProductView from "../views/ProductView.vue";
import AboutView from "../views/AboutView.vue";
import DeliveryView from "../views/DeliveryView.vue";
import ContactsView from "../views/ContactsView.vue";
import CreditsView from "../views/CreditsView.vue";
import NotFoundView from "../views/NotFoundView.vue";

// Hash-історія: демо відкривається і з file://, і зі статичного хостингу
// без налаштування серверних rewrite-правил.
const router = createRouter({
  history: createWebHashHistory(),
  scrollBehavior() {
    return { top: 0 };
  },
  routes: [
    { path: "/", name: "home", component: HomeView, meta: { title: "Verde — магазин кімнатних рослин" } },
    { path: "/catalog", name: "catalog", component: CatalogView, meta: { title: "Каталог — Verde" } },
    { path: "/product/:id", name: "product", component: ProductView, props: true },
    { path: "/about", name: "about", component: AboutView, meta: { title: "Про нас — Verde" } },
    { path: "/delivery", name: "delivery", component: DeliveryView, meta: { title: "Доставка і оплата — Verde" } },
    { path: "/contacts", name: "contacts", component: ContactsView, meta: { title: "Контакти — Verde" } },
    { path: "/credits", name: "credits", component: CreditsView, meta: { title: "Фото та ліцензії — Verde" } },
    { path: "/:pathMatch(.*)*", name: "not-found", component: NotFoundView, meta: { title: "Сторінку не знайдено — Verde" } },
  ],
});

router.afterEach((to) => {
  document.title = to.meta.title || "Verde — магазин кімнатних рослин";
});

export default router;
