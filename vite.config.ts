import tailwindcss from "@tailwindcss/vite";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    TanStackRouterVite({ target: "react", autoCodeSplitting: true }),
    react(),
    tailwindcss(),
    tsconfigPaths(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.png", "logo.png", "apple-touch-icon.png"],
      manifest: {
        name: "Tudoor",
        short_name: "Tudoor",
        description: "India's tutoring marketplace — find tutors, post requirements, and connect safely.",
        theme_color: "#5B5FEF",
        background_color: "#0B1120",
        display: "standalone",
        orientation: "portrait-primary",
        scope: "/",
        start_url: "/",
        categories: ["education", "social"],
        icons: [
          {
            src: "pwa-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "maskable-icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        navigateFallback: "/index.html",
        globPatterns: ["**/*.{js,css,html,ico,png,svg,webp,woff2}"],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\./i,
            handler: "NetworkFirst",
            options: {
              cacheName: "tudoor-api",
              networkTimeoutSeconds: 10,
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 5 },
            },
          },
        ],
      },
      devOptions: {
        enabled: false,
      },
    }),
  ],
});
