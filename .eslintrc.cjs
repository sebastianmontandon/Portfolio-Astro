module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:astro/recommended',
    'prettier'
  ],
  env: {
    node: true,
    es2021: true,
    browser: true
  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  rules: {
    'no-console': 'warn',
    'no-unused-vars': ['warn', { 'argsIgnorePattern': '^_', 'varsIgnorePattern': '^_' }],
    'prefer-const': 'error',
    'quotes': ['error', 'single', { 'avoidEscape': true }],
    'semi': ['error', 'always']
  },
  overrides: [
    {
      files: ['*.astro'],
      parser: 'astro-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
        extraFileExtensions: ['.astro']
      },
      rules: {
        'astro/no-set-html-directive': 'error',
        'astro/no-unused-css-selector': 'warn',
        'astro/valid-compile': 'error'
      }
    },
    {
      files: ['**/*.ts', '**/*.tsx'],
      extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking'
      ],
      rules: {
        '@typescript-eslint/explicit-function-return-type': 'warn',
        '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/no-unused-vars': ['warn', { 'argsIgnorePattern': '^_' }]
      }
    }
  ]
};
