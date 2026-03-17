import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  build: {
    // Raise the warning threshold to 600 kB; chunks above it are flagged
    chunkSizeWarningLimit: 600,

    // Inline small assets (<4 kB) directly as base64 to save round-trips
    assetsInlineLimit: 4096,

    rollupOptions: {
      output: {
        // Deterministic file names so CDN cache-busting works correctly
        entryFileNames: "assets/[name]-[hash].js",
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash][extname]",

        manualChunks(id) {
          // Vendor chunk: React runtime (stable across deploys)
          if (id.includes("node_modules/react/") || id.includes("node_modules/react-dom/")) {
            return "vendor-react";
          }
          // Router chunk
          if (id.includes("node_modules/react-router")) {
            return "vendor-router";
          }
          // Lucide icons — large icon set, split separately
          if (id.includes("node_modules/lucide-react")) {
            return "vendor-icons";
          }
          // Virtualization lib
          if (id.includes("node_modules/react-window")) {
            return "vendor-react-window";
          }
          // Everything else in node_modules → shared vendor chunk
          if (id.includes("node_modules/")) {
            return "vendor";
          }
        },
      },
    },

    // Generate source maps for production error tracking (upload to Sentry/etc.)
    sourcemap: false,

    // Target modern browsers — removes legacy polyfills
    target: "es2020",
  },

  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: ["src/test/**", "src/main.tsx"],
    },
  },
} as Parameters<typeof defineConfig>[0]);
