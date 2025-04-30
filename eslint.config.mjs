import js from '@eslint/js';
import globals from 'globals';
import { defineConfig } from 'eslint/config';
import prettier from 'eslint-plugin-prettier';

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs}'],
    plugins: { js, prettier },
    extends: ['js/recommended']
  },
  { files: ['**/*.js'], languageOptions: { sourceType: 'commonjs' } },
  {
    files: ['**/*.{js,mjs,cjs}'],
    languageOptions: { globals: globals.browser }
  },
  {
    rules: {
      'prefer-const': 'error',
      'no-var': 'error'
    }
  },
  {
    ignores: ['**/node_modules/**', '**/features/**', '**/*.config.js']
  },
  {
    rules: {
      'prettier/prettier': [
        'error',
        {
          singleQuote: true,
          trailingComma: 'none',
          printWidth: 80,
          tabWidth: 2,
          semi: true
        }
      ]
    }
  }
]);
