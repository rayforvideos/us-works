import { defineConfig, mergeConfig } from "vitest/config";

import viteConfig from "./vite.config.ts";

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: "jsdom",
      globals: true,
      setupFiles: ["./src/shared/config/test-setup.ts"],
      env: { VITE_API_BASE_URL: "http://api.test" },
    },
  }),
);
