const trimTrailingSlash = (value?: string) => (value || "").replace(/\/+$/, "");

export const backendUrl = trimTrailingSlash(
  import.meta.env.VITE_BACKEND_URL || "/backoffice-api"
);

const viteBase = import.meta.env.BASE_URL || "/";

export const routerBasename =
  viteBase === "/" ? undefined : trimTrailingSlash(viteBase);
