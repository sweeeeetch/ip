// vite.config.ts
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate", // check for updates automatically
      injectRegister: "auto",
      manifest: {
        name: "i.p",
        short_name: "i.p",
        description: "Система личной эффективности",
        theme_color: "#fcfcfc",
        background_color: "#fcfcfc",
        start_url: "/",
        icons: [
          { src: "/pwa.png", sizes: "256x256", type: "image/png" },
        ],
      },
      workbox: {
        // DO NOT precache HTML (especially /index.html)
        globPatterns: ["**/*.{js,css,ico,png,svg,webmanifest}"],

        // make the new SW take control immediately
        clientsClaim: true,
        skipWaiting: true,
        cleanupOutdatedCaches: true,

        // Runtime strategies
        runtimeCaching: [
          // Page navigations: always try network first so updates are seen immediately
          {
            urlPattern: ({ request }) => request.mode === "navigate",
            handler: "NetworkFirst",
            options: {
              cacheName: "pages",
              networkTimeoutSeconds: 3, // fall back to cache if truly offline/slow
              expiration: { maxEntries: 50, maxAgeSeconds: 24 * 60 * 60 },
            },
          },
          // Static assets (js/css/img/fonts): hashed → safe to cache, but revalidate
          {
            urlPattern: ({ request }) =>
              ["script", "style", "image", "font"].includes(request.destination),
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "assets",
              expiration: { maxEntries: 200, maxAgeSeconds: 30 * 24 * 60 * 60 },
            },
          },
        ],
      },
      // Don’t use app-shell fallback here; runtime caching above handles SPA navigations
      strategies: "generateSW",
    }),
  ],
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
});