/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  root: true,
  extends: ['@weni/eslint-config/vue3', '@vue/eslint-config-typescript'],
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 'latest',
    ecmaFeatures: {
      importAssertions: true,
    },
  },
  env: {
    browser: true,
    node: true,
  },
};
