import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],

  base: "/",

  server: {
    port: 5173,
    host: true,
  },

  build: {
    sourcemap: true,
    target: "es2020",
  },

  resolve: {
    dedupe: ["react", "react-dom"],
  },
});