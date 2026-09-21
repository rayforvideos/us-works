import { defineConfig, mergeConfig } from "vitest/config";

import viteConfig from "./vite.config.ts";

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: "jsdom",
      pool: "vmThreads",
      globals: true,
      setupFiles: ["./src/shared/testing/setup.ts"],
      env: { VITE_API_BASE_URL: "http://api.test" },
      css: { include: [/styles\/theme\/.*\.css/] },
    },
  }),
);
