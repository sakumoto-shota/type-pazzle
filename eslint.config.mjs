import eslint from '@eslint/js';
import nextPlugin from '@next/eslint-plugin-next';
import prettierConfig from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import promisePlugin from 'eslint-plugin-promise';
import unusedImportsPlugin from 'eslint-plugin-unused-imports';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: [
      '.next/',
      'node_modules/',
      'dist/',
      'out/',
      'next.config.js'
    ]
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      sourceType: 'commonjs'
    }
  },
  {
    plugins: {
      'import': importPlugin,
      'unused-imports': unusedImportsPlugin,
      'promise': promisePlugin,
      '@next/next': nextPlugin
    },
    rules: {
      'no-console': 'warn',
      'spaced-comment': ['warn', 'always', { 'markers': ['/'] }],
      'eqeqeq': ['error', 'allow-null'],
      'sort-imports': ['error', { 'ignoreDeclarationSort': true }],
      'import/order': ['error', { 'alphabetize': { 'order': 'asc' }, 'newlines-between': 'never' }],
      'unused-imports/no-unused-imports': 'error',
      'promise/prefer-await-to-then': ['error', { 'strict': true }]
    }
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.json']
      }
    },
    rules: {
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-unnecessary-condition': 'warn',
      '@typescript-eslint/no-confusing-void-expression': 'warn',
      '@typescript-eslint/naming-convention': [
        'warn',
        { 'selector': 'variable', 'format': ['strictCamelCase'] },
        {
          'selector': 'variable',
          'modifiers': ['const'],
          'format': ['strictCamelCase', 'PascalCase', 'UPPER_CASE']
        },
        { 'selector': 'typeAlias', 'format': ['PascalCase'] }
      ],
      '@typescript-eslint/switch-exhaustiveness-check': 'error',
      '@typescript-eslint/strict-boolean-expressions': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', { 'ignoreRestSiblings': true }]
    }
  },
  prettierConfig
); 