import { fileURLToPath } from "node:url";
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://example.com",
  vite: {
    resolve: {
      alias: {
        "#contentrain": fileURLToPath(new URL("./.contentrain/client/index.mjs", import.meta.url)),
      },
    },
  },
});
