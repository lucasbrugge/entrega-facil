# entrega-facil

### Autor: Lucas Brugge de Almeida

O Entrega Fácil é uma aplicação web responsiva para cadastro e acompanhamento básico de entregas. A aplicação permitirá cadastrar os dados do cliente, informações do produto, endereço de origem, endereço de destino, data prevista e status da entrega.

O frontend da aplicação será desenvolvido com HTML, CSS e JavaScript e o backend será simulado por uma API Fake utilizando JSON Server. A aplicação também consumirá a API pública ViaCEP para consultar CEPs e preencher automaticamente os dados de endereço.

## 📚 Documentação do Projeto

Para entender as regras de negócio, o escopo e a arquitetura técnica da aplicação, consulte os documentos abaixo:

- [📄 Product Requirements Document (PRD)](docs/prd.md) - Visão geral, público-alvo, histórias de usuário e regras de negócio.
- [🛠️ Arquitetura da Aplicação](docs/architecture.md) - Design System, modelo de dados, tecnologias utilizadas, API pública e arquitetura da aplicação.

## 🎨 Design

- 🎨 Design System - Documentado no arquivo `docs/architecture.md`.
- 🖼️ Protótipo no Figma/Stitch - [Páginas](https://stitch.withgoogle.com/projects/2737167932936789921)
## 🌐 Site em Produção - GitHub Pages

Link será adicionado após a publicação da aplicação.

## 💻 Tecnologias e Dependências

### Framework CSS

**Bootstrap 5.3.8**

O Bootstrap foi escolhido por oferecer um sistema de Grid responsivo
e uma ampla variedade de componentes prontos compatíveis com o
protótipo do Entrega Fácil, como Navbar, Cards, Buttons, Forms,
Input Groups, Badges e Modals.

Além de facilitar a adaptação da aplicação para dispositivos mobile,
tablet e desktop, o framework possui classes utilitárias para
espaçamento, alinhamento e responsividade. O projeto possui
documentação consolidada, licença MIT e desenvolvimento ativo.

O Bootstrap será customizado com SCSS/CSS para manter a identidade
visual Neo-Industrial do projeto.

### API Pública

**ViaCEP**

O ViaCEP foi escolhido por fornecer uma API pública e gratuita para
consulta de endereços brasileiros através do CEP.

No Entrega Fácil, a API será utilizada nos campos de origem e destino.
Ao informar um CEP válido, a aplicação poderá preencher automaticamente
dados como logradouro, bairro, cidade e UF.

Essa integração reduz o preenchimento manual dos endereços e permite
demonstrar requisições assíncronas e tratamento de erros utilizando
dados reais.

## ✅ Checklist | Indicadores de Desempenho (ID) dos Resultados de Aprendizagem (RA)

#### RA1 - Utilizar Frameworks CSS para estilização de elementos HTML e criação de layouts responsivos.

- [x] ID 01 - Prototipa interfaces adaptáveis para no mínimo os tamanhos de tela mobile e desktop, usando ferramentas de design tradicionais (Figma, Quant UX ou Sketch) ou IA (Stitch).
- [ ] ID 02 - Implementa layout responsivo com Framework CSS (Bootstrap, Materialize) usando Flexbox ou Grid do próprio framework.
- [ ] ID 03 - Implementa layout responsivo com CSS puro, usando Flexbox ou Grid Layout.
- [ ] ID 04 - Utiliza componentes prontos de um Framework CSS (ex.: card, button) e componentes JavaScript do framework (ex.: modal, carousel).
- [ ] ID 05 - Cria layout fluido usando unidades relativas (vw, vh, %, em, rem) no lugar de unidades fixas (px).
- [ ] ID 06 - Aplica um Design System consistente (cores, tipografia, padrões de componentes) em toda a aplicação.
- [x] ID 07 - Utiliza Sass (SCSS) com ou sem framework, aplicando variáveis, mixins e funções para modularizar o código.
- [ ] ID 08 - Aplica tipografia responsiva (media queries mobile first) ou tipografia fluida (função clamp() + unidades relativas).
- [ ] ID 09 - Aplica técnicas de responsividade de imagens usando CSS (object-fit, containers com unidades relativas).
- [ ] ID 10 - Otimiza imagens usando formatos modernos (WebP) e carregamento adaptativo (srcset, picture, ou parâmetros do Cloudinary).

#### RA2 - Realizar tratamento de formulários e aplicar validações customizadas no lado cliente.

- [ ] ID 11 - Implementa validação HTML nativa (campos obrigatórios, tipos, limites de caracteres) com mensagens de erro/sucesso no lado cliente.
- [ ] ID 12 - Aplica expressões regulares (REGEX) para validações customizadas (e-mail, telefone, datas, etc.)
- [ ] ID 13 - Utiliza elementos de seleção em formulários (checkbox, radio, select) para coleta de dados.
- [ ] ID 14 - Implementa leitura e escrita no Web Storage (localStorage/sessionStorage) para persistir dados localmente.

#### RA3 - Aplicar ferramentas para otimização do processo de desenvolvimento web.

- [x] ID 15 - Configura ambiente com Node.js e NPM para gerenciamento de pacotes e dependências.
- [x] ID 16 - Utiliza boas práticas de versionamento no Git/GitHub (branch main ou branches específicos, uso de .gitignore).
- [x] ID 17 - Mantém um README.md padronizado, conforme template da disciplina, com checklist preenchido.
- [x] ID 18 - Organiza arquivos do projeto de forma modular, seguindo padrão de exemplo fornecido.
- [x] ID 19 - Configura linters e formatadores (ESLint, Prettier) para manter qualidade e padronização do código.

#### RA4 - Aplicar bibliotecas de funções e componentes em JavaScript para aprimorar a interatividade de páginas web.

- [ ] ID 20 - Utiliza jQuery para manipulação do DOM e interatividade (eventos, animações, manipulação de elementos)
- [ ] ID 21 - Integra e configura um plugin jQuery relevante (ex.: jQuery Mask Plugin) ou outra biblioteca de funções.

#### RA5 - Efetuar requisições assíncronas para uma API fake e APIs públicas, permitindo a obtenção e manipulação de dados dinamicamente.

- [ ] ID 22 - Realiza requisições assíncronas para uma API fake (ex.: JSON Server) para persistir dados de um formulário.
- [ ] ID 23 - Realiza requisições assíncronas para uma API fake para exibir dados na página.
- [ ] ID 24 - Realiza requisições assíncronas para APIs públicas reais (OpenWeather, ViaCEP etc.), exibindo os dados e tratando erros.

## 🚀 Manual de execução

Consulte os comandos de instalação, servidor local e compilação Sass abaixo.

## 📱 Telas da aplicação

Capturas reais de desktop e mobile estão em `docs/evidencias/` e no PDF da atividade Sass.

## Sass: desenvolvimento e compilação

Requer Node.js 20.19+ e npm. Instale as dependências e compile:

```bash
npm ci
npm run sass:build
```

Para recompilar automaticamente enquanto edita:

```bash
npm run sass:watch
```

Edite `assets/scss/`, nunca o CSS gerado. `main.scss` carrega os módulos
com `@use`: tokens em `_variables.scss`, responsividade em `_mixins.scss`,
estilos globais em `_base.scss`, estrutura em `_layout.scss` e componentes
em `_components.scss`. O `@import url(...)` de Google Fonts é CSS nativo,
não o mecanismo legado de módulos Sass.

As três páginas utilizam somente `assets/css/style.css` como CSS personalizado.
Bootstrap 5.3.8 (CSS e bundle JS) vem uma única vez do CDN, com integridade;
é necessária conexão para Bootstrap e Google Fonts. O CSS compilado é versionado.
O antigo `app.css` foi removido; sua referência permanece no histórico Git.

Para servir localmente, execute `python3 -m http.server 8080` e abra
`http://localhost:8080`. Sem JSON Server em `localhost:3000`, a aplicação usa
os dados de demonstração existentes e persiste alterações no navegador.

### Validação e entrega acadêmica

```bash
npx playwright install --with-deps chromium
npm run sass:build
npm test
npm run docs:sass
```

`npm test` inicia seu próprio servidor temporário, compara pixel a pixel as três
páginas com o CSS original do commit `00152b2` em 1440, 390, 575 e 576px, e
exercita navbar, filtros, busca, validação de formulário, cadastro persistido e
modal de status no modo demo. Requer o histórico desse commit, Chromium e acesso
aos CDNs. O contexto de teste tolera certificados HTTPS do ambiente; as páginas
mantêm seus atributos de integridade. A API é interceptada como indisponível;
não há validação de JSON Server ou de uma consulta ViaCEP bem-sucedida.

O PDF está em [docs/atividade-sass.pdf](docs/atividade-sass.pdf).
As capturas reais e o relatório ficam em `docs/evidencias/`.
`npm run docs:sass` gera o PDF com trechos dos arquivos implementados e
as capturas produzidas pelo teste, incluindo a listagem real da pasta SCSS.

Pendência identificada por `npm audit`: cinco alertas altos na cadeia de
`gh-pages` preexistente. A correção dessa ferramenta de publicação fica fora
do escopo da refatoração Sass.
