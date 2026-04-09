import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

import dotenv from "dotenv";

dotenv.config({ path: "./.env.local" });

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000", // Your Backend Port
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
