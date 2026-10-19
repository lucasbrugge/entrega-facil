const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const jsonServer = require('json-server');
const { chromium } = require('playwright');
const { createServer } = require('../scripts/serve.cjs');
const sharp = require('sharp');
let browser, frontend, apiServer, router, base, apiUrl, temp;
let failureMode = null;
const seed = JSON.parse(fs.readFileSync('db.json', 'utf8'));
const listen = (server) => new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const close = (server) => new Promise((resolve) => server.close(resolve));
async function reset() {
  router.db.setState(structuredClone(seed)).write();
  failureMode = null;
}
async function contextFor(width = 1440, demo = false) {
  const context = await browser.newContext({
    viewport: { width, height: 1000 },
    ignoreHTTPSErrors: true,
    reducedMotion: 'reduce',
  });
  context.on('page', (page) => page.setDefaultTimeout(15000));
  await context.addInitScript((url) => {
    window.ENTREGA_FACIL_API_URL = url;
  }, apiUrl);
  if (demo) await context.route(apiUrl + '/**', (route) => route.abort());
  return context;
}
async function fillForm(page, mobile = true) {
  await page.locator('#cliente-nome').fill('Cliente Teste');
  await page.locator('#cliente-cpf').fill('52998224725');
  await page.locator('#cliente-telefone').fill(mobile ? '42999994444' : '4233334444');
  await page.locator('#produto-nome').fill('Produto de teste');
  await page.locator('#data-prevista').fill('2026-12-15');
  for (const prefix of ['origem', 'destino']) {
    for (const [field, value] of Object.entries({
      cep: '01001000',
      logradouro: 'Praça da Sé',
      numero: '10',
      bairro: 'Sé',
      cidade: 'São Paulo',
      uf: 'SP',
    }))
      await page.locator(`#${prefix}-${field}`).fill(value);
  }
}
async function settle(page, url) {
  await page.goto(base + url, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
}
before(async () => {
  temp = fs.mkdtempSync(path.join(os.tmpdir(), 'entrega-tests-'));
  const db = path.join(temp, 'db.json');
  fs.writeFileSync(db, JSON.stringify(seed));
  const api = jsonServer.create();
  router = jsonServer.router(db);
  api.use(jsonServer.defaults({ logger: false, static: temp }));
  api.use(jsonServer.bodyParser);
  api.use((req, res, next) => {
    if (failureMode && req.method === 'POST' && req.path === '/enderecos') {
      const count = router.db
        .get('enderecos')
        .filter({ entregaId: req.body.entregaId })
        .size()
        .value();
      if (count === 1) return res.status(500).json({ error: 'Falha simulada no segundo endereço' });
    }
    if (failureMode === 'cleanup' && req.method === 'DELETE')
      return res.status(503).json({ error: 'Limpeza indisponível' });
    next();
  });
  api.use(router);
  apiServer = api.listen(0, '127.0.0.1');
  await new Promise((resolve) => apiServer.on('listening', resolve));
  apiUrl = `http://127.0.0.1:${apiServer.address().port}`;
  frontend = createServer();
  await listen(frontend);
  base = `http://127.0.0.1:${frontend.address().port}`;
  browser = await chromium.launch({ headless: true });
});
after(async () => {
  await browser?.close();
  if (frontend) await close(frontend);
  if (apiServer) await close(apiServer);
  if (temp) fs.rmSync(temp, { recursive: true, force: true });
});

test('JSON Server real: GET, POST, filtro, PATCH e persistência em disco', async () => {
  await reset();
  const request = async (url, method = 'GET', body) => {
    const response = await fetch(apiUrl + url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    });
    assert.ok(response.ok);
    return response.json();
  };
  assert.equal((await request('/entregas')).length, 4);
  assert.equal((await request('/enderecos')).length, 8);
  const delivery = await request('/entregas', 'POST', { ...seed.entregas[0], id: 'api-check' });
  for (let i = 0; i < 2; i++)
    await request('/enderecos', 'POST', {
      ...seed.enderecos[i],
      id: `api-address-${i}`,
      entregaId: delivery.id,
    });
  assert.equal((await request('/enderecos?entregaId=api-check')).length, 2);
  assert.equal((await request('/entregas/api-check')).id, 'api-check');
  await request('/entregas/api-check', 'PATCH', { status: 'Entregue' });
  assert.equal(
    JSON.parse(fs.readFileSync(path.join(temp, 'db.json'))).entregas.find(
      (item) => item.id === 'api-check',
    ).status,
    'Entregue',
  );
});

test('máscaras locais: CPF, CEP e alternância telefone 10/11 dígitos sem truncar', async () => {
  const context = await contextFor();
  try {
    const page = await context.newPage();
    await settle(page, '/pages/cadastro.html');
    assert.equal(await page.evaluate(() => jQuery.fn.jquery), '4.0.0');
    assert.equal(await page.evaluate(() => typeof jQuery.fn.mask), 'function');
    for (const [id, raw, formatted] of [
      ['cliente-cpf', '52998224725', '529.982.247-25'],
      ['origem-cep', '01001000', '01001-000'],
      ['destino-cep', '80010000', '80010-000'],
    ]) {
      await page.locator('#' + id).pressSequentially(raw, { delay: 30 });
      assert.equal(await page.locator('#' + id).inputValue(), formatted);
    }
    const phone = page.locator('#cliente-telefone');
    await phone.pressSequentially('4233334444', { delay: 30 });
    assert.equal(await phone.inputValue(), '(42) 3333-4444');
    await phone.pressSequentially('4', { delay: 30 });
    assert.equal(await phone.inputValue(), '(42) 33334-4444');
    await phone.press('Backspace');
    await phone.blur();
    assert.equal(await phone.inputValue(), '(42) 3333-4444');
    assert.equal(await page.locator('script[src*="jquery.min.js"]').count(), 1);
    assert.equal(await page.locator('script[src*="jquery.mask.min.js"]').count(), 1);
  } finally {
    await context.close();
  }
});

test('validação textual acessível impede POST inválido e atualiza feedback corrigido', async () => {
  await reset();
  const context = await contextFor();
  try {
    const page = await context.newPage();
    await settle(page, '/pages/cadastro.html');
    let posts = 0;
    page.on('request', (req) => {
      if (req.method() === 'POST') posts++;
    });
    await page.locator('[type="submit"]').click();
    assert.equal(await page.locator('#cliente-nome-error').isVisible(), true);
    assert.equal(await page.locator('[aria-invalid="true"]').count(), 17);
    await fillForm(page);
    await page.locator('#cliente-cpf').fill('11111111111');
    await page.locator('[type="submit"]').click();
    assert.match(await page.locator('#cliente-cpf-error').textContent(), /CPF válido/);
    assert.equal(
      await page.locator('#cliente-cpf').getAttribute('aria-describedby'),
      'cliente-cpf-error',
    );
    assert.equal(posts, 0);
    await page.locator('#cliente-cpf').fill('52998224725');
    assert.equal(await page.locator('#cliente-cpf').getAttribute('aria-invalid'), 'false');
    await page.locator('#cliente-telefone').fill('0000000000');
    await page.locator('[type="submit"]').click();
    assert.match(await page.locator('#cliente-telefone-error').textContent(), /DDD/);
    await page.locator('#cliente-telefone').fill('4233334444');
    await page.locator('#status').evaluate((el) => {
      const option = new Option('Inválido', 'Invalido');
      el.add(option);
      el.value = 'Invalido';
    });
    await page.locator('[type="submit"]').click();
    assert.match(await page.locator('#status-error').textContent(), /permitido/);
    assert.equal(posts, 0);
    assert.equal(router.db.get('entregas').size().value(), 4);
  } finally {
    await context.close();
  }
});

for (const width of [1440, 390]) {
  test(`fluxo real API ${width}px: cadastro, listagem, detalhes, modal e reload`, async () => {
    await reset();
    const context = await contextFor(width);
    const errors = [];
    try {
      const page = await context.newPage();
      page.on('pageerror', (error) => errors.push(error.message));
      await settle(page, '/pages/cadastro.html');
      await fillForm(page, width === 390);
      await page.locator('[type="submit"]').click();
      await page.waitForURL('**/index.html');
      await page.waitForFunction(() => document.querySelectorAll('.ef-delivery-card').length === 5);
      assert.equal(await page.locator('#app-alert').isVisible(), false);
      await page.locator('#delivery-search').fill('Cliente Teste');
      assert.equal(await page.locator('.ef-delivery-card').count(), 1);
      await page.locator('#delivery-list a').click();
      await page.waitForFunction(
        () => document.querySelector('#detail-client').textContent === 'Cliente Teste',
      );
      const created = router.db.get('entregas').find({ clienteNome: 'Cliente Teste' }).value();
      assert.equal(created.clienteCpf, '529.982.247-25');
      assert.equal(created.clienteTelefone, width === 390 ? '(42) 99999-4444' : '(42) 3333-4444');
      assert.equal(router.db.get('enderecos').filter({ entregaId: created.id }).size().value(), 2);
      await page.locator('[data-bs-target="#status-modal"]').click();
      await page.locator('#status-modal.show').waitFor();
      await page.locator('#new-status').selectOption('Entregue');
      await page.locator('#status-form [type="submit"]').click();
      await page.waitForFunction(
        () => document.querySelector('#detail-status').textContent === 'Entregue',
      );
      await page.reload({ waitUntil: 'networkidle' });
      assert.equal(await page.locator('#detail-status').textContent(), 'Entregue');
      assert.equal(router.db.get('entregas').find({ id: created.id }).value().status, 'Entregue');
      fs.mkdirSync('test-results', { recursive: true });
      await page.screenshot({ path: `test-results/detalhes-${width}.png`, fullPage: true });
      for (const url of [
        '/index.html',
        '/pages/cadastro.html',
        `/pages/detalhes.html?id=${created.id}`,
      ]) {
        await settle(page, url);
        assert.equal(
          await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
          true,
        );
        assert.equal(await page.locator('link[href*="bootstrap"]').count(), 1);
        assert.equal(await page.locator('script[src*="bootstrap"]').count(), 1);
        assert.equal(await page.locator('link[href$="style.css"]').count(), 1);
        const image = page.locator('.ef-brand-icon');
        assert.equal(await image.evaluate((el) => el.complete && el.naturalWidth > 0), true);
        if (width === 390) {
          await page.locator('.navbar-toggler').click();
          await page.locator('#mainNav.show').waitFor();
        }
        if (url === '/index.html') {
          await page.locator('[data-filter="Pendente"]').click();
          assert.equal(await page.locator('.ef-delivery-card').count(), 1);
          await page.locator('[data-filter="todos"]').click();
          await page.locator('#delivery-search').fill('inexistente');
          assert.equal(await page.locator('#delivery-empty').isVisible(), true);
        }
      }
      assert.deepEqual(errors, []);
    } finally {
      await context.close();
    }
  });
}

test('compensação: falha no segundo endereço remove entrega e endereço já salvo', async () => {
  await reset();
  failureMode = 'address';
  const context = await contextFor();
  try {
    const page = await context.newPage();
    await settle(page, '/pages/cadastro.html');
    await fillForm(page);
    await page.locator('[type="submit"]').click();
    await page.waitForFunction(() =>
      document.querySelector('#app-alert').textContent.includes('desfeito'),
    );
    assert.equal(router.db.get('entregas').size().value(), 4);
    assert.equal(router.db.get('enderecos').size().value(), 8);
    assert.equal(await page.locator('#cliente-nome').inputValue(), 'Cliente Teste');
    failureMode = null;
    await page.locator('[type="submit"]').click();
    await page.waitForURL('**/index.html');
    assert.equal(router.db.get('entregas').size().value(), 5);
  } finally {
    await context.close();
  }
});

test('POST persistido com resposta perdida também é compensado pelos IDs conhecidos', async () => {
  await reset();
  const context = await contextFor();
  try {
    await context.route(apiUrl + '/entregas', async (route) => {
      if (route.request().method() !== 'POST') return route.continue();
      const response = await route.fetch();
      assert.equal(response.status(), 201);
      return route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: '{"error":"Resposta perdida"}',
      });
    });
    const page = await context.newPage();
    await settle(page, '/pages/cadastro.html');
    await fillForm(page);
    await page.locator('[type="submit"]').click();
    await page.waitForFunction(() =>
      document.querySelector('#app-alert').textContent.includes('desfeito'),
    );
    assert.equal(router.db.get('entregas').size().value(), 4);
    assert.equal(router.db.get('enderecos').size().value(), 8);
  } finally {
    await context.close();
  }
});

test('falha na compensação é explícita e retry limpa antes de criar novo registro', async () => {
  await reset();
  failureMode = 'cleanup';
  const context = await contextFor();
  try {
    const page = await context.newPage();
    await settle(page, '/pages/cadastro.html');
    await fillForm(page);
    await page.locator('[type="submit"]').click();
    await page.waitForFunction(() =>
      document.querySelector('#app-alert').textContent.includes('limpeza'),
    );
    assert.equal(router.db.get('entregas').size().value(), 5);
    await page.locator('[type="submit"]').click();
    await page.waitForTimeout(200);
    assert.equal(router.db.get('entregas').size().value(), 5);
    failureMode = null;
    await page.locator('[type="submit"]').click();
    await page.waitForURL('**/index.html');
    assert.equal(router.db.get('entregas').size().value(), 5);
    assert.equal(router.db.get('enderecos').size().value(), 10);
  } finally {
    await context.close();
  }
});

test('demo: API indisponível mantém cadastro e status em localStorage após reload', async () => {
  const context = await contextFor(390, true);
  try {
    const page = await context.newPage();
    await settle(page, '/index.html');
    assert.equal(await page.locator('.ef-delivery-card').count(), 4);
    assert.match(await page.locator('#app-alert').textContent(), /demonstração/);
    await settle(page, '/pages/cadastro.html');
    await fillForm(page);
    await page.locator('[type="submit"]').click();
    await page.waitForURL('**/index.html');
    await page.waitForFunction(() => document.querySelectorAll('.ef-delivery-card').length === 5);
    await page.locator('#delivery-search').fill('Cliente Teste');
    await page.locator('#delivery-list a').click();
    await page.waitForFunction(
      () => document.querySelector('#detail-client').textContent === 'Cliente Teste',
    );
    await page.locator('[data-bs-target="#status-modal"]').click();
    await page.locator('#new-status').selectOption('Cancelada');
    await page.locator('#status-form [type="submit"]').click();
    await page.waitForFunction(
      () => document.querySelector('#detail-status').textContent === 'Cancelada',
    );
    await page.reload({ waitUntil: 'networkidle' });
    assert.equal(await page.locator('#detail-status').textContent(), 'Cancelada');
  } finally {
    await context.close();
  }
});

test('ViaCEP após máscaras: sucesso origem/destino, incompleto, inexistente, rede e retry', async () => {
  const context = await contextFor();
  try {
    let mode = 'success',
      calls = [];
    await context.route('https://viacep.com.br/ws/**', (route) => {
      calls.push(route.request().url());
      if (mode === 'network') return route.abort();
      return route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify(
          mode === 'missing'
            ? { erro: true }
            : { logradouro: 'Praça da Sé', bairro: 'Sé', localidade: 'São Paulo', uf: 'SP' },
        ),
      });
    });
    const page = await context.newPage();
    await settle(page, '/pages/cadastro.html');
    await page.locator('#origem-cep').fill('123');
    await page.locator('[data-cep="origem"]').click();
    assert.match(await page.locator('#origem-feedback').textContent(), /8 números/);
    assert.equal(calls.length, 0);
    for (const prefix of ['origem', 'destino']) {
      await page.locator(`#${prefix}-numero`).fill('123');
      await page.locator(`#${prefix}-cep`).fill('01001000');
      await page.locator(`[data-cep="${prefix}"]`).click();
      await page.waitForFunction(
        (p) => document.querySelector(`#${p}-feedback`).textContent.includes('preenchido'),
        prefix,
      );
      for (const [suffix, value] of Object.entries({
        logradouro: 'Praça da Sé',
        bairro: 'Sé',
        cidade: 'São Paulo',
        uf: 'SP',
        numero: '123',
      }))
        assert.equal(await page.locator(`#${prefix}-${suffix}`).inputValue(), value);
    }
    assert.ok(calls.every((url) => url.endsWith('/01001000/json/')));
    mode = 'missing';
    await page.locator('[data-cep="origem"]').click();
    await page.waitForFunction(() =>
      document.querySelector('#origem-feedback').textContent.includes('não encontrado'),
    );
    mode = 'network';
    await page.locator('[data-cep="origem"]').click();
    await page.waitForFunction(() =>
      document.querySelector('#origem-feedback').textContent.includes('Não foi possível'),
    );
    mode = 'success';
    await page.locator('#origem-cep').fill('80010000');
    await page.locator('[data-cep="origem"]').click();
    await page.waitForFunction(() =>
      document.querySelector('#origem-feedback').textContent.includes('preenchido'),
    );
  } finally {
    await context.close();
  }
});

test('WebP responsivo: arquivos reais otimizados e seleção de resolução pelo navegador', async () => {
  for (const size of [32, 64, 96]) {
    const file = `assets/images/entrega-icon-${size}.webp`;
    const metadata = await sharp(file).metadata();
    assert.equal(metadata.width, size);
    assert.equal(metadata.format, 'webp');
    assert.ok(fs.statSync(file).size < 4000);
  }
  for (const scale of [1, 2, 3]) {
    const context = await browser.newContext({
      viewport: { width: 390, height: 800 },
      deviceScaleFactor: scale,
      ignoreHTTPSErrors: true,
    });
    try {
      const page = await context.newPage();
      await settle(page, '/pages/cadastro.html');
      const current = await page.locator('.ef-brand-icon').evaluate((el) => el.currentSrc);
      assert.ok(current.endsWith(`entrega-icon-${scale * 32}.webp`), current);
    } finally {
      await context.close();
    }
  }
});

test(
  'ViaCEP real: origem e destino com máscaras',
  { skip: process.env.TEST_EXTERNAL !== '1' },
  async () => {
    const context = await contextFor();
    try {
      const page = await context.newPage();
      await settle(page, '/pages/cadastro.html');
      for (const prefix of ['origem', 'destino']) {
        await page.locator(`#${prefix}-numero`).fill('321');
        await page.locator(`#${prefix}-cep`).fill('01001000');
        await page.locator(`[data-cep="${prefix}"]`).click();
        await page.waitForFunction(
          (p) => !document.querySelector(`#${p}-feedback`).textContent.includes('Consultando'),
          prefix,
          { timeout: 25000 },
        );
        assert.match(
          await page.locator(`#${prefix}-feedback`).textContent(),
          /preenchido pelo ViaCEP/,
        );
        assert.equal(await page.locator(`#${prefix}-logradouro`).inputValue(), 'Praça da Sé');
        assert.equal(await page.locator(`#${prefix}-bairro`).inputValue(), 'Sé');
        assert.equal(await page.locator(`#${prefix}-cidade`).inputValue(), 'São Paulo');
        assert.equal(await page.locator(`#${prefix}-uf`).inputValue(), 'SP');
        assert.equal(await page.locator(`#${prefix}-numero`).inputValue(), '321');
      }
      fs.mkdirSync('test-results', { recursive: true });
      await page.screenshot({ path: 'test-results/viacep-real.png', fullPage: true });
    } finally {
      await context.close();
    }
  },
);
