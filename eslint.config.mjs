import js from "@eslint/js";
import globals from "globals";
import css from "@eslint/css";
import { defineConfig } from "eslint/config";
import pluginSecurity from "eslint-plugin-security";

export default defineConfig([
  pluginSecurity.configs.recommended,
  { files: ["**/*.{js,mjs,cjs}"], plugins: { js }, extends: ["js/recommended"], languageOptions: { globals: globals.node } },
  { files: ["**/*.js"], languageOptions: { sourceType: "commonjs" } },
  { files: ["**/*.css"], plugins: { css }, language: "css/css", extends: ["css/recommended"] },
  {
    rules: {
      'no-debugger': "error",
      'no-console': "warn",
      'prefer-const': 'error',
      'arrow-body-style': ['error', 'as-needed'],
      'prefer-destructuring': ['error', {
      array: false, 
      object: true,
    }],
    'no-param-reassign': ['error', {
      props: true,
      ignorePropertyModificationsFor: ['req', 'res', 'session'],
    }],
    'security/detect-non-literal-regexp': 'error',

    }
  }
]);
