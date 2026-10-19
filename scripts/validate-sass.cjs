// Requer Chromium: npx playwright install chromium
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { execFileSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');
const original = execFileSync('git', ['show', '00152b26b7155c1bc7e6e1b362a7763e78a7d838:assets/css/app.css'], { cwd: root, encoding: 'utf8' });
const evidence = path.join(root, 'docs/evidencias');
fs.mkdirSync(evidence, { recursive: true });
const checks = [];
const server = http.createServer((req, res) => {
  const file = path.resolve(root, '.' + decodeURIComponent(new URL(req.url, 'http://localhost').pathname));
  if (!file.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404).end(); return; }
    res.setHeader('Content-Type', ({ '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript' })[path.extname(file)] || 'application/octet-stream');
    res.end(data);
  });
});
(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  const browser = await chromium.launch({ headless: true });
  try {
    for (const width of [1440, 390, 575, 576]) {
      const context = await browser.newContext({ viewport: { width, height: 1000 }, reducedMotion: 'reduce', ignoreHTTPSErrors: true });
      // Força a indisponibilidade da API para exercitar o fallback real existente.
      await context.route('http://localhost:3000/**', route => route.abort());
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      for (const [name, url, ready] of [
        ['listagem', '/index.html', '#delivery-list .ef-card'],
        ['cadastro', '/pages/cadastro.html', '#delivery-form'],
        ['detalhes', '/pages/detalhes.html?id=demo-001', '#detail-client'],
      ]) {
        let baseline = true;
        await page.route('**/assets/css/style.css', route => baseline ? route.fulfill({ body: original, contentType: 'text/css' }) : route.continue());
        async function settle() {
          await page.goto(base + url, { waitUntil: 'networkidle' });
          await page.locator(ready).first().waitFor();
          if (name === 'detalhes') await page.waitForFunction(() => document.querySelector('#detail-client').textContent === 'João Silva');
          await page.evaluate(() => document.fonts.ready);
          await page.mouse.move(0, 0);
          await page.evaluate(() => scrollTo(0, 0));
          // Confirma Bootstrap carregado via CDN, sem substituição de recursos no teste.
          assert.equal(await page.evaluate(() => getComputedStyle(document.querySelector('.container')).width !== 'auto' && getComputedStyle(document.querySelector('.container')).paddingLeft === '12px'), true, 'Bootstrap CDN carregado');
          assert.equal(await page.evaluate(() => typeof bootstrap.Modal), 'function');
        }
        await settle();
        const before = await page.screenshot({ fullPage: true, animations: 'disabled' });
        baseline = false;
        await settle();
        const after = await page.screenshot({ fullPage: true, animations: 'disabled' });
        if (!before.equals(after)) {
          fs.writeFileSync('/tmp/sass-before.png', before); fs.writeFileSync('/tmp/sass-after.png', after);
        }
        assert.equal(before.equals(after), true, `${name} ${width}px: diferença visual`);
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `${name}: overflow horizontal`);
        assert.equal(await page.locator('link[href*="bootstrap"]').count(), 1);
        assert.equal(await page.locator('script[src*="bootstrap"]').count(), 1);
        assert.equal(await page.locator('link[href$="assets/css/style.css"]').count(), 1);
        assert.equal(await page.locator('link[href$="app.css"]').count(), 0);
        if ([1440, 390].includes(width)) fs.writeFileSync(path.join(evidence, `${name}-${width}.png`), after);
        if (name === 'listagem') {
          assert.equal(await page.locator('.ef-delivery-card').count(), 4);
          await page.locator('[data-filter="Pendente"]').click();
          assert.equal(await page.locator('.ef-delivery-card').count(), 1);
          await page.locator('[data-filter="todos"]').click();
          await page.locator('#delivery-search').fill('Notebook');
          assert.equal(await page.locator('.ef-delivery-card').count(), 1);
          await page.locator('#delivery-search').fill('inexistente');
          assert.equal(await page.locator('#delivery-empty').isVisible(), true);
          await page.locator('#delivery-search').fill('');
          if (width < 576) {
            await page.locator('.navbar-toggler').click();
            await page.locator('#mainNav.show').waitFor();
          }
        }
        if (name === 'cadastro') {
          await page.locator('[type="submit"]').click();
          assert.equal(await page.locator('form.was-validated').count(), 1);
          assert.equal(await page.locator('#cliente-nome').evaluate(el => el.validity.valueMissing), true);
          await page.locator('[data-cep="origem"]').click();
          assert.match(await page.locator('#origem-feedback').textContent(), /8 números/);
        }
        if (name === 'detalhes') {
          await page.locator('[data-bs-target="#status-modal"]').click();
          await page.locator('#status-modal.show').waitFor();
          if ([1440, 390].includes(width)) await page.screenshot({ path: path.join(evidence, `modal-${width}.png`), fullPage: true, animations: 'disabled' });
          await page.locator('#new-status').selectOption('Entregue');
          await page.locator('#status-form [type="submit"]').click();
          await page.waitForFunction(() => document.querySelector('#detail-status').textContent === 'Entregue');
          await page.reload({ waitUntil: 'networkidle' });
          assert.equal(await page.locator('#detail-status').textContent(), 'Entregue');
          await page.evaluate(() => localStorage.clear());
        }
        await page.unroute('**/assets/css/style.css');
        checks.push(`${name} ${width}px: pixels idênticos ao CSS original; integração, responsividade e interações OK`);
      }
      // Cadastro completo com persistência e redirecionamento reais no modo demo.
      await page.goto(base + '/pages/cadastro.html');
      for (const [id, value] of Object.entries({ 'cliente-nome': 'Teste Sass', 'cliente-cpf': '000.000.000-00', 'cliente-telefone': '(00) 90000-0000', 'produto-nome': 'Pacote Sass', 'data-prevista': '2026-12-01' })) await page.locator('#' + id).fill(value);
      for (const prefix of ['origem', 'destino']) {
        for (const [field, value] of Object.entries({ cep: '85000-000', logradouro: 'Rua Teste', numero: '10', bairro: 'Centro', cidade: 'Guarapuava', uf: 'PR' })) await page.locator(`#${prefix}-${field}`).fill(value);
      }
      await page.locator('[type="submit"]').click();
      await page.waitForURL('**/index.html');
      await page.waitForFunction(() => document.querySelectorAll('.ef-delivery-card').length === 5);
      checks.push(`cadastro persistido e listado em ${width}px: OK`);
      assert.deepEqual(errors, []);
      await context.close();
    }
    fs.writeFileSync(path.join(evidence, 'validacao.json'), JSON.stringify({ date: '2026-10-19', browser: await browser.version(), baseline: '00152b26b7155c1bc7e6e1b362a7763e78a7d838', api: 'indisponível por interceptação; fallback demo real', checks }, null, 2) + '\n');
    console.log(checks.join('\n'));
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; }).finally(() => server.close());
