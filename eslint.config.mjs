import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";
import pluginSecurity from "eslint-plugin-security";
import importX from 'eslint-plugin-import-x';

export default defineConfig([
  { ignores: ["eslint.config.mjs", "**/*.spec.js", "**/*.test.js", "tailwind.config.js"] },
  pluginSecurity.configs.recommended,
  { files: ["**/*.{js,cjs}"], plugins: { js }, extends: ["js/recommended"], languageOptions: { globals: globals.node } },
  { files: ["**/*.js"], languageOptions: { sourceType: "commonjs" } },
  {
    plugins: { 'import': importX },
    rules: {
      'import/no-cycle': 'error',
      'import/no-self-import': 'error',
      'import/first': 'error',
      'import/newline-after-import': 'error',
      'import/no-mutable-exports': 'error',
    },
  },

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
    'function-paren-newline': 'error',
    'computed-property-spacing': ['error', 'never'],
    'array-bracket-spacing': ['error', 'never'],
    'object-curly-spacing': ['error', 'always'],
    'space-in-parens': ['error', 'never'],
    'space-infix-ops': 'error',
    'keyword-spacing': ['error', { before: true, after: true }],
    'key-spacing': ['error', { beforeColon: false, afterColon: true }],
    'eol-last': ['error', 'always'],
    'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0 }],
    'semi': ['error', 'always'],
    'quotes': ['error', 'single', { avoidEscape: true }],
    'indent': ['error', 2, { SwitchCase: 1 }],
    'no-trailing-spaces': 'error',
    'no-class-assign': 'error',
    'no-duplicate-imports': 'error',
    'eqeqeq': ['error', 'always', { null: 'ignore' }],
    'no-eval': 'error',
    'no-else-return': ['error', { allowElseIf: false }],
    'no-lonely-if': 'error',
    'no-unneeded-ternary': ['error', { defaultAssignment: false }],
    'no-nested-ternary': 'error',
    'one-var': ['error', 'never'],
    'no-multi-assign': 'error',
    'object-shorthand': ['error', 'always'],
    'prefer-object-spread': 'error',
    'prefer-arrow-callback': ['error', { allowNamedFunctions: false }],
    'no-useless-constructor': 'error',
    'no-dupe-class-members': 'error',
    }
  }
]);
