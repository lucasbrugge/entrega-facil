const { chromium } = require('playwright');
const fs = require('node:fs');
const path = require('node:path');
const { spawn } = require('node:child_process');
const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const escape = text => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const code = (file, text = read(file)) => `<p class="caption">${file}</p><pre>${escape(text)}</pre>`;
const img = (name, cls = '') => `<img class="${cls}" src="data:image/png;base64,${fs.readFileSync(path.join(root, 'docs/evidencias', name)).toString('base64')}">`;
(async () => {
  const listingServer = spawn('python3', ['-m', 'http.server', '8766', '--bind', '127.0.0.1', '--directory', root], { stdio: 'ignore' });
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1000, height: 540 } });
    // Listagem real do filesystem servida pelo http.server da biblioteca padrão Python.
    for (let attempt = 0; attempt < 50; attempt++) {
      try { await fetch('http://127.0.0.1:8766/assets/scss/'); break; }
      catch { await new Promise(resolve => setTimeout(resolve, 100)); }
    }
    await page.goto('http://127.0.0.1:8766/assets/scss/');
    await page.getByText('_base.scss', { exact: true }).waitFor();
    await page.screenshot({ path: path.join(root, 'docs/evidencias/estrutura-scss.png'), fullPage: true });
    const report = JSON.parse(read('docs/evidencias/validacao.json'));
    const component = read('assets/scss/_components.scss');
    const card = component.slice(component.indexOf('.ef-card {'), component.indexOf('.ef-card-title'));
    const includeStart = component.indexOf('@include m.mobile');
    const include = component.slice(includeStart, component.indexOf('\n}', includeStart) + 2);
    const layout = read('assets/scss/_layout.scss');
    const navbar = layout.slice(layout.indexOf('.ef-navbar {'), layout.indexOf('.ef-page {'));
    const html = `<!doctype html><html lang="pt-BR"><meta charset="utf-8"><title>Atividade Sass — Entrega Fácil</title><style>
      @page { size: A4; margin: 15mm; }
      * { box-sizing: border-box; } body { font: 12px/1.5 Arial,sans-serif; color:#1b1c1c; margin:0; }
      section { break-after:page; } section:last-child { break-after:auto; }
      h1 { font-size:30px; line-height:1.1; margin:12px 0; } h2 { font-size:22px; border-bottom:2px solid; padding-bottom:8px; } h3 { font-size:15px; }
      pre { white-space:pre-wrap; overflow-wrap:anywhere; background:#f5f3f3; border:1px solid #c4c7c7; padding:12px; font:11px/1.4 monospace; }
      .caption { color:#444748; font-size:11px; margin:10px 0 4px; } img { display:block; max-width:100%; max-height:220mm; margin:auto; object-fit:contain; }
      .tree { max-height:75mm; } .row { display:flex; gap:20px; align-items:flex-start; } .row>div { flex:1; min-width:0; } .mobile { max-height:210mm; } .half { max-height:100mm; }
    </style><body>
    <section><p>ATIVIDADE ACADÊMICA • 19/10/2026</p><h1>Entrega Fácil<br>Refatoração com Sass</h1>
      <p>Autor: Lucas Brugge de Almeida</p><p>Aplicação responsiva para cadastrar e acompanhar entregas, reunindo cliente, produto, origem, destino e status. A refatoração transforma o CSS existente em módulos SCSS, preservando o design Neo-Industrial Mono, o Bootstrap 5.3.8 e a lógica JavaScript.</p>
      <h2>1. Estrutura final e módulos</h2><p>Captura real da pasta assets/scss/, aberta no navegador local. Base define tipografia e propriedades globais; layout organiza navbar, páginas e footer; components reúne cards, formulários, badges e modal.</p>
      ${img('estrutura-scss.png','tree')}${code('assets/scss/main.scss')}
      <p>Os módulos usam @use. O @import url de Google Fonts é uma importação CSS nativa preservada, não uma importação de módulos Sass.</p></section>
    <section><h2>2. Variáveis utilizadas</h2><p>Cores e fontes originais, bordas, sombras, espaçamentos e breakpoint centralizados. As propriedades CSS --ef-* e --bs-* continuam disponíveis em tempo de execução, com valores Sass interpolados.</p>
      ${code('assets/scss/_variables.scss')}
      <p>Exemplos de uso: v.$border e v.$radius nos cards; v.$font-display nos rótulos; v.$space no layout; v.$mobile-max no mixin.</p></section>
    <section><h2>3. Nesting e responsividade</h2><p>Aninhamento raso mantém a especificidade original: .ef-card .card-header e .ef-navbar .nav-link, por exemplo.</p>
      <div class="row"><div>${code('assets/scss/_layout.scss',navbar)}</div><div>${code('assets/scss/_components.scss',card)}${code('assets/scss/_mixins.scss')}${code('assets/scss/_components.scss',include)}</div></div>
      <p>O mixin reutilizado preserva o limite original de 575.98px. A compilação é executada com npm run sass:build; npm run sass:watch acompanha alterações.</p></section>
    <section><h2>4. Resultado — listagem desktop</h2><p>Captura real em 1440 × 1000, com style.css compilado e quatro entregas de demonstração. Navbar, filtros, cards, badges e footer preservados.</p>${img('listagem-1440.png')}<p class="caption">docs/evidencias/listagem-1440.png</p></section>
    <section><h2>5. Resultado — cadastro desktop</h2><p>Captura real da página completa em 1440px: formulários, grid de endereços e botões.</p>${img('cadastro-1440.png')}<p class="caption">docs/evidencias/cadastro-1440.png</p></section>
    <section><h2>6. Resultado — mobile</h2><p>Capturas reais em viewport de 390 × 1000; imagens de página inteira reduzidas proporcionalmente. Arquivos PNG originais disponíveis em docs/evidencias/.</p><div class="row"><div>${img('listagem-390.png','mobile')}<p class="caption">Listagem • 390px</p></div><div>${img('cadastro-390.png','mobile')}<p class="caption">Cadastro • 390px</p></div></div></section>
    <section><h2>7. Detalhes, modal e validação</h2><div class="row"><div>${img('detalhes-1440.png','half')}</div><div>${img('modal-390.png','half')}</div></div>
      <h3>Evidências executadas</h3><p>Chromium ${escape(report.browser)}. Comparação pixel a pixel entre o CSS original do commit ${report.baseline.slice(0,7)} e o CSS compilado nas três páginas, em 1440, 390, 575 e 576px. Todos os 12 pares são idênticos e não apresentam overflow horizontal.</p>
      <p>Validados: Bootstrap e CSS único por página; dados demo; busca, filtros e estado vazio; menu mobile; validação de obrigatórios e CEP inválido; cadastro completo, redirecionamento e persistência; abertura do modal, alteração e persistência de status; ausência de exceções JavaScript.</p>
      <p>Comandos: npm run sass:build; npm test; npm run sass:watch (verificação de recompilação); git diff --check. Relatório detalhado: docs/evidencias/validacao.json.</p>
      <h3>Limites e pendências</h3><p>A API local foi tornada indisponível deliberadamente nos testes para exercitar o fallback demo existente. Não foi validado o backend JSON Server nem a consulta externa de CEP bem-sucedida. Bootstrap e fontes mantêm a dependência de rede original. npm audit registrou cinco alertas altos na cadeia preexistente do gh-pages, fora do escopo da atividade.</p>
      <p>Chromium foi executado com bibliotecas temporárias em /tmp porque o ambiente não permite instalar bibliotecas via sudo. Capturas são reais; nenhum JavaScript da aplicação foi modificado.</p></section>
    </body></html>`;
    await page.setContent(html, { waitUntil: 'load' });
    await page.pdf({ path: path.join(root, 'docs/atividade-sass.pdf'), format: 'A4', printBackground: true, displayHeaderFooter: true, headerTemplate:'<span></span>', footerTemplate:'<div style="font:9px Arial;width:100%;text-align:center">Entrega Fácil • Sass — <span class="pageNumber"></span> / <span class="totalPages"></span></div>' });
    console.log('PDF gerado: docs/atividade-sass.pdf');
  } finally { await browser.close(); listingServer.kill(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
