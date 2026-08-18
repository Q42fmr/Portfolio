import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// Демо відкривається напряму з file:// (без dev-сервера). Chrome блокує
// <script type="module"> та <link crossorigin> для file:// через CORS,
// тому збираємо класичний IIFE-бандл і прибираємо ці атрибути з HTML.
const fileProtocolCompat = {
  name: "file-protocol-compat",
  transformIndexHtml: {
    order: "post",
    handler(html) {
      return html
        .replace(/<script type="module" crossorigin src="([^"]+)"><\/script>/, '<script defer src="$1"></script>')
        .replace(/ crossorigin/g, "");
    },
  },
};

export default defineConfig({
  plugins: [vue(), fileProtocolCompat],
  base: "./",
  build: {
    outDir: "../../portfolio/plant-shop",
    emptyOutDir: true,
    modulePreload: false,
    rollupOptions: { output: { format: "iife" } }
  }
});
