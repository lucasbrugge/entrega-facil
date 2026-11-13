const js = require('@eslint/js');
const globals = require('globals');

module.exports = [
  { ignores: ['node_modules/**', 'assets/vendor/**'] },
  js.configs.recommended,
  { files: ['**/*.cjs'], languageOptions: { globals: globals.node } },
  { rules: { 'no-unused-vars': ['error', { caughtErrors: 'none' }] } },
];
