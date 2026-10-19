const sharp = require('sharp');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
(async () => {
  for (const size of [32, 64, 96]) {
    await sharp(path.join(root, 'assets/images/entrega-icon.svg'))
      .resize(size, size)
      .webp({ quality: 85, effort: 6 })
      .toFile(path.join(root, `assets/images/entrega-icon-${size}.webp`));
  }
  console.log('Ícone de entregas gerado em WebP: 32, 64 e 96px.');
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
