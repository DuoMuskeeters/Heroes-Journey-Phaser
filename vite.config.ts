import { defineConfig } from "vite";
import checker from "vite-plugin-checker";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), checker({ typescript: true })],
  server: {
    port: 3000,
  },
  build: {
    chunkSizeWarningLimit: 2000,
  },
});
