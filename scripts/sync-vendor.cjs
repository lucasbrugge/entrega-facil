const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const files = {
  'node_modules/bootstrap/dist/css/bootstrap.min.css': 'assets/vendor/bootstrap.min.css',
  'node_modules/bootstrap/dist/js/bootstrap.bundle.min.js': 'assets/vendor/bootstrap.bundle.min.js',
  'node_modules/bootstrap/LICENSE': 'assets/vendor/bootstrap-LICENSE.txt',
  'node_modules/jquery/dist/jquery.min.js': 'assets/vendor/jquery.min.js',
  'node_modules/jquery/LICENSE.txt': 'assets/vendor/jquery-LICENSE.txt',
  'node_modules/jquery-mask-plugin/dist/jquery.mask.min.js': 'assets/vendor/jquery.mask.min.js',
  'node_modules/jquery-mask-plugin/LICENSE': 'assets/vendor/jquery-mask-LICENSE.txt',
};
fs.mkdirSync(path.join(root, 'assets/vendor'), { recursive: true });
for (const [source, dest] of Object.entries(files))
  fs.copyFileSync(path.join(root, source), path.join(root, dest));
console.log('Bibliotecas locais sincronizadas com as versões fixadas no npm.');
