import eslint from '@eslint/js';
import nextPlugin from '@next/eslint-plugin-next';
import prettierConfig from 'eslint-config-prettier';
import * as tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

export default [
  {
    ignores: [
      '.next/',
      'node_modules/',
      'dist/',
      'out/',
      'next.config.js',
      'e2e/**/*',
      'playwright.config.ts'
    ]
  },
  eslint.configs.recommended,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      sourceType: 'module',
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json'
      },
      globals: {
        document: 'readonly',
        fetch: 'readonly',
        window: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      '@next/next': nextPlugin
    },
    rules: {
      'no-console': 'warn',
      'spaced-comment': ['warn', 'always', { 'markers': ['/'] }],
      'eqeqeq': ['error', 'allow-null'],
      '@typescript-eslint/no-extra-semi': 'warn',
    }
  },
  prettierConfig
]; 