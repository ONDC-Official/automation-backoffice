import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

const normalizeBase = (value?: string) => {
  if (!value || value === "/") return "/";
  return `/${value.replace(/^\/+|\/+$/g, "")}/`;
};

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],
    base: normalizeBase(env.VITE_BASE_URL),
    server: {
      host: "0.0.0.0" // Allow traffic from the internet
    },
  };
});
