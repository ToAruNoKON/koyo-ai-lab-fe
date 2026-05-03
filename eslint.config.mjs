import { createConfigForNuxt } from "@nuxt/eslint-config/flat";
import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

// Fix issues with eslint and structuredClone being undefined
global.structuredClone = (val) => JSON.parse(JSON.stringify(val));

export default createConfigForNuxt()
  // Ignore src/volt directory
  .prepend({
    ignores: ["src/volt/**"],
  })
  // Disable console logs
  .prepend({
    rules: {
      "no-console": ["error", { allow: ["warn", "error"] }],
    },
  })
  .override("nuxt/vue/rules", {
    rules: {
      "vue/multi-word-component-names": "off",
    },
  })
  // Add prettier
  .append(eslintConfigPrettier, eslintPluginPrettierRecommended);
