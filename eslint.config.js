import js from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';
import securityPlugin from 'eslint-plugin-security';
import nodePlugin from 'eslint-plugin-node';

export default [
  js.configs.recommended,

  {
    files: ['**/*.js'],
    ignores: ['node_modules/', 'dist/', 'build/'],

    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },

    plugins: {
      import: importPlugin,
      prettier: prettierPlugin,
      security: securityPlugin,
      node: nodePlugin,
    },

    rules: {
      'no-unused-vars': 'warn',
      'no-undef': 'error',
      'no-console': 'off',

      // IMPORT rules
      'import/no-unresolved': 'error',
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'always',
        },
      ],

      // SECURITY rules
      'security/detect-object-injection': 'off',

      // PRETTIER rules
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
