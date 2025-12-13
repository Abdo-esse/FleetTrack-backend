import js from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';
import securityPlugin from 'eslint-plugin-security';
import nodePlugin from 'eslint-plugin-node';
import globals from 'globals';

export default [
  js.configs.recommended,

  {
    files: ['**/*.js'],
    ignores: ['node_modules/', 'dist/', 'build/'],

    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node, // Node.js globals
      },
    },

    plugins: {
      import: importPlugin,
      prettier: prettierPlugin,
      security: securityPlugin,
      node: nodePlugin,
    },

    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: 'next' }],
      'no-undef': 'error',
      'no-console': 'off',

      'import/no-unresolved': 'error',
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'always',
        },
      ],

      'security/detect-object-injection': 'off',

      'prettier/prettier': ['error', { endOfLine: 'auto' }],
    },
  },

  // Override Jest
  {
    files: ['tests/**/*.js', '**/*.test.js', '**/*.spec.js'],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
    rules: {
      'no-undef': 'off',
    },
  },

  prettierConfig,
];
