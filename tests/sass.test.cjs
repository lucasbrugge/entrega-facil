const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const sass = require('sass');

test('CSS versionado corresponde à compilação atual dos módulos Sass', () => {
  const result = sass.compile('assets/scss/main.scss', { sourceMap: false });
  assert.equal(fs.readFileSync('assets/css/style.css', 'utf8').trim(), result.css.trim());
  for (const file of [
    '_variables.scss',
    '_mixins.scss',
    '_base.scss',
    '_layout.scss',
    '_components.scss',
    'main.scss',
  ])
    assert.ok(fs.existsSync(`assets/scss/${file}`));
  assert.match(fs.readFileSync('assets/scss/main.scss', 'utf8'), /@use 'components'/);
  assert.match(result.css, /clamp\(/);
});
