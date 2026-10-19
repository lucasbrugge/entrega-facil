const js = require('@eslint/js');
const globals = require('globals');

module.exports = [
  { ignores: ['node_modules/**', 'stitch/**', 'assets/vendor/**', 'test-results/**'] },
  js.configs.recommended,
  {
    files: ['assets/js/**/*.js'],
    languageOptions: { globals: { ...globals.browser, bootstrap: 'readonly', jQuery: 'readonly' } },
  },
  { files: ['**/*.cjs'], languageOptions: { globals: globals.node } },
  {
    files: ['tests/**/*.cjs'],
    languageOptions: { globals: { ...globals.browser, jQuery: 'readonly' } },
  },
  { rules: { 'no-unused-vars': ['error', { caughtErrors: 'none' }] } },
];
