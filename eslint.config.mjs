import js from "@eslint/js";
import globals from "globals";
import css from "@eslint/css";
import { defineConfig } from "eslint/config";
import pluginSecurity from "eslint-plugin-security";

export default defineConfig([
  { ignores: ["eslint.config.mjs"] },
  pluginSecurity.configs.recommended,
  { files: ["**/*.{js,cjs}"], plugins: { js }, extends: ["js/recommended"], languageOptions: { globals: globals.node } },
  { files: ["**/*.js"], languageOptions: { sourceType: "commonjs" } },
  { files: ["**/*.css"], plugins: { css }, language: "css/css", extends: ["css/recommended"] },
  {
    rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'prefer-const': 'error',
    'consistent-return': 'off', // Allow different return patterns
    'arrow-body-style': ['error', 'as-needed'],
    'prefer-destructuring': ['error', {
      array: false, // Don't force array destructuring
      object: true,
    }],
    'no-param-reassign': ['error', {
      props: true,
      ignorePropertyModificationsFor: ['req', 'res', 'session'],
    }],
    'max-len': ['error', {
      code: 120,
      ignoreComments: true,
      ignoreStrings: true,
      ignoreTemplateLiterals: true,
    }],
    // Security plugin rules - PCI DSS Requirement 6.2.1
    'security/detect-object-injection': 'warn', // Downgraded to warning
    'security/detect-non-literal-regexp': 'error',
    'security/detect-unsafe-regex': 'error',
    'security/detect-buffer-noassert': 'error',
    'security/detect-child-process': 'error',
    'security/detect-disable-mustache-escape': 'error',
    'security/detect-eval-with-expression': 'error',
    'security/detect-no-csrf-before-method-override': 'error',
    'security/detect-non-literal-fs-filename': 'error',
    'security/detect-non-literal-require': 'error',
    'security/detect-possible-timing-attacks': 'error',
    'security/detect-pseudoRandomBytes': 'error',
    'class-methods-use-this': 'off', // Allow class methods that don't use this
    'global-require': 'off', // Allow require() in functions
    'func-names': 'off', // Allow anonymous functions
    'comma-dangle': ['error', {
      arrays: 'always-multiline',
      objects: 'always-multiline',
      imports: 'always-multiline',
      exports: 'always-multiline',
      functions: 'never',
    }],
    // Complexity Rules - Relaxed for OAuth implementation
    'complexity': 'warn', // Downgraded to warning
    'max-depth': 'warn', // Downgraded to warning
    'max-lines': 'warn', // Downgraded to warning
    'max-lines-per-function': 'warn', // Downgraded to warning
    'max-params': 'warn', // Downgraded to warning
    'no-restricted-syntax': 'warn', // Downgraded to warning
    'no-await-in-loop': 'warn', // Downgraded to warning
    'no-plusplus': 'warn', // Downgraded to warning
    'radix': 'warn', // Downgraded to warning
    'no-var': 'error',
    'no-const-assign': 'error',
    'no-object-constructor': 'error',
    'no-array-constructor': 'error',
    'prefer-template': 'warn',
    'default-param-last': 'warn',
    'no-new-func':'error',
    'space-before-function-paren': ['error','always'],
    'space-before-blocks': ['error', 'always'],
    'function-paren-newline': 'error'


    }
  }
]);
