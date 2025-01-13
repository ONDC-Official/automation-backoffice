import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // base: `${process.env.VITE_BASE_URL}`,
  base: "/",
  server: {
    host: "0.0.0.0", // Allow traffic from the internet
    port: process.env.VITE_PORT, // You can change this to any available port
  },
});
