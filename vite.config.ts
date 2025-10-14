import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    tailwindcss(),
    VitePWA({
      // Manifest configuration
      manifest: {
        name: "i.p",
        short_name: "i.p",
        description: "Система личной эффективности",
        theme_color: "#fcfcfc",
        background_color: "#fcfcfc",
        start_url: "/",
        icons: [
          {
            src: "/pwa.png",
            sizes: "256x256",
            type: "image/png",
          },
        ],
      },
      // Workbox configuration (for `generateSW` strategy)
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,webmanifest}"],
        // Add more options as needed, e.g., runtimeCaching
      },
      // Strategy for generating the service worker
      // 'generateSW' (default) or 'injectManifest'
      strategies: "generateSW",
      // Register service worker automatically
      injectRegister: "auto", // 'auto', 'inline', 'script', 'script-defer', or null (manual)
      // Other options like periodicSyncForUpdates, devOptions, etc.
      // devOptions: {
      //   enabled: true,
      //   type: 'module', // or 'classic'
      // },
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
