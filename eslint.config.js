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
        ...globals.node,
      },
    },

    plugins: {
      import: importPlugin,
      prettier: prettierPlugin,
      security: securityPlugin,
      node: nodePlugin,
    },

    rules: {
      // CORE
      'no-unused-vars': ['warn', { argsIgnorePattern: 'next' }],
      'no-undef': 'error',
      'no-console': 'off',

      // IMPORT
      'import/no-unresolved': 'error',
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'always',
        },
      ],

      // SECURITY
      'security/detect-object-injection': 'off',

      // PRETTIER
      'prettier/prettier': [
        'error',
        {
          endOfLine: 'auto',
        },
      ],
    },
  },

  prettierConfig,
];
