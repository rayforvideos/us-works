import fsd from "@feature-sliced/steiger-plugin";
import { defineConfig } from "steiger";

export default defineConfig([
  ...fsd.configs.recommended,
  { files: ["./src/shared/**"], rules: { "fsd/public-api": "off" } },
  {
    files: [
      "./src/features/edit-content/**",
      "./src/features/edit-notification/**",
      "./src/features/publish-content/**",
    ],
    rules: { "fsd/insignificant-slice": "off" },
  },
]);
