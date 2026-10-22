# entrega-facil

### Autor: Lucas Brugge de Almeida

O Entrega Fácil é uma aplicação web responsiva para cadastro e acompanhamento básico de entregas. A aplicação permite cadastrar os dados do cliente, informações do produto, endereço de origem, endereço de destino, data prevista e status da entrega.

O frontend utiliza HTML, Sass e JavaScript, com Bootstrap e jQuery. Uma API fake executável com JSON Server persiste entregas e endereços. A consulta ViaCEP preenche os endereços a partir do CEP.

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

O Bootstrap é customizado com SCSS/CSS para manter a identidade
visual Neo-Industrial do projeto.

### API Pública

**ViaCEP**

O ViaCEP foi escolhido por fornecer uma API pública e gratuita para
consulta de endereços brasileiros através do CEP.

No Entrega Fácil, a API é utilizada nos campos de origem e destino.
Ao informar um CEP válido, a aplicação poderá preencher automaticamente
dados como logradouro, bairro, cidade e UF.

Essa integração reduz o preenchimento manual dos endereços e permite
demonstrar requisições assíncronas e tratamento de erros utilizando
dados reais.

## ✅ Checklist | Indicadores de Desempenho (ID) dos Resultados de Aprendizagem (RA)

#### RA1 - Utilizar Frameworks CSS para estilização de elementos HTML e criação de layouts responsivos.

- [x] ID 01 - Prototipa interfaces adaptáveis para no mínimo os tamanhos de tela mobile e desktop, usando ferramentas de design tradicionais (Figma, Quant UX ou Sketch) ou IA (Stitch).
- [x] ID 02 - Implementa layout responsivo com Framework CSS (Bootstrap, Materialize) usando Flexbox ou Grid do próprio framework.
- [x] ID 03 - Implementa layout responsivo com CSS puro, usando Flexbox ou Grid Layout.
- [x] ID 04 - Utiliza componentes prontos de um Framework CSS (ex.: card, button) e componentes JavaScript do framework (ex.: modal, carousel).
- [x] ID 05 - Cria layout fluido usando unidades relativas (vw, vh, %, em, rem) no lugar de unidades fixas (px).
- [x] ID 06 - Aplica um Design System consistente (cores, tipografia, padrões de componentes) em toda a aplicação.
- [x] ID 07 - Utiliza Sass (SCSS) com ou sem framework, aplicando variáveis, mixins e funções para modularizar o código.
- [x] ID 08 - Aplica tipografia responsiva (media queries mobile first) ou tipografia fluida (função clamp() + unidades relativas).
- [x] ID 09 - Aplica técnicas de responsividade de imagens usando CSS (object-fit, containers com unidades relativas).
- [x] ID 10 - Otimiza imagens usando formatos modernos (WebP) e carregamento adaptativo (srcset, picture, ou parâmetros do Cloudinary).

#### RA2 - Realizar tratamento de formulários e aplicar validações customizadas no lado cliente.

- [x] ID 11 - Implementa validação HTML nativa (campos obrigatórios, tipos, limites de caracteres) com mensagens de erro/sucesso no lado cliente.
- [x] ID 12 - Aplica expressões regulares (REGEX) para validações customizadas (e-mail, telefone, datas, etc.)
- [x] ID 13 - Utiliza elementos de seleção em formulários (checkbox, radio, select) para coleta de dados.
- [x] ID 14 - Implementa leitura e escrita no Web Storage (localStorage/sessionStorage) para persistir dados localmente.

#### RA3 - Aplicar ferramentas para otimização do processo de desenvolvimento web.

- [x] ID 15 - Configura ambiente com Node.js e NPM para gerenciamento de pacotes e dependências.
- [x] ID 16 - Utiliza boas práticas de versionamento no Git/GitHub (branch main ou branches específicos, uso de .gitignore).
- [x] ID 17 - Mantém um README.md padronizado, conforme template da disciplina, com checklist preenchido.
- [x] ID 18 - Organiza arquivos do projeto de forma modular, seguindo padrão de exemplo fornecido.
- [x] ID 19 - Configura linters e formatadores (ESLint, Prettier) para manter qualidade e padronização do código.

#### RA4 - Aplicar bibliotecas de funções e componentes em JavaScript para aprimorar a interatividade de páginas web.

- [x] ID 20 - Utiliza jQuery para manipulação do DOM e interatividade (eventos, animações, manipulação de elementos)
- [x] ID 21 - Integra e configura um plugin jQuery relevante (ex.: jQuery Mask Plugin) ou outra biblioteca de funções.

#### RA5 - Efetuar requisições assíncronas para uma API fake e APIs públicas, permitindo a obtenção e manipulação de dados dinamicamente.

- [x] ID 22 - Realiza requisições assíncronas para uma API fake (ex.: JSON Server) para persistir dados de um formulário.
- [x] ID 23 - Realiza requisições assíncronas para uma API fake para exibir dados na página.
- [x] ID 24 - Realiza requisições assíncronas para APIs públicas reais (OpenWeather, ViaCEP etc.), exibindo os dados e tratando erros.

## 🚀 Instalação e execução

Requer Node.js **20.19+, 22.13+ ou 24+**, npm e navegador atual. Bootstrap, jQuery
e jQuery Mask Plugin são carregados localmente; Google Fonts e ViaCEP usam internet.

```bash
npm ci
npm run sass:build
```

Inicie a API e o frontend em terminais separados:

```bash
npm run api
```

```bash
npm start
```

Abra **http://localhost:8080**. A API usa **http://localhost:3000** e persiste
alterações em `db.json`. Os dados iniciais são demonstrativos.

### API fake e modo demonstração

O JSON Server **0.17.4**, com versão fixada, é compatível com as rotas GET,
POST, PATCH e DELETE e com o filtro `?entregaId=...` utilizado pela aplicação.
Os IDs iniciais são strings e os novos registros recebem UUIDs conhecidos antes
do envio. Cada entrega possui dois endereços ligados por `entregaId`. O campo
`numeroEntrega` é usado na apresentação, separado do ID interno. O contador
persistente evita reutilizar números depois de excluir registros; JSON Server
não garante incremento atômico entre clientes simultâneos.
Consulte a [documentação da versão utilizada](https://github.com/typicode/json-server/tree/v0.17.4).

Se o salvamento de um endereço falhar, o serviço tenta remover os registros do
cadastro incompleto. A exclusão pelo operador exige confirmação em modal Bootstrap
e remove a entrega e seus endereços. Em falha parcial ou resposta incerta, o
serviço consulta o estado da API antes de repetir ou restaurar registros. Snapshots
no navegador permitem retomar a recuperação depois de recarregar. Preserve o
armazenamento local até concluir uma recuperação pendente.

Sem API, a aplicação usa o modo demonstração e salva somente em `localStorage`,
sem sincronizar com `db.json`. O seeder inicializa apenas um armazenamento ainda
inexistente; dados criados ou excluídos persistem ao recarregar. O modo escolhido
permanece nos links entre páginas. Use `/?modo=demo` para demonstração ou
`/?modo=api` para acessar o JSON Server. Falhas de gravação na API são informadas
sem salvar silenciosamente no modo local.
Em GitHub Pages, o frontend funciona com os arquivos versionados; JSON Server
precisa ser executado separadamente.

### Máscaras e validação

O cadastro carrega uma única cópia local de **jQuery 4.0.0** e **jQuery Mask Plugin
1.14.16**, nessa ordem, antes do módulo `assets/js/utils/masks.js`, inicializado
por `app.js`. O JavaScript usa módulos nativos organizados em `services/`, `data/`,
`features/` e `utils/`.
Consulte a [documentação do plugin](https://igorescobar.github.io/jQuery-Mask-Plugin/docs.html).
As versões minificadas e licenças estão em `assets/vendor/`, permitindo execução
sem publicar `node_modules`. Para sincronizá-las depois de uma atualização deliberada:

```bash
npm run vendor:sync
```

As máscaras formatam CPF, os dois CEPs e telefone fixo/celular com alternância
entre 10 e 11 dígitos. Máscaras não substituem validação: `utils/validation.js` verifica
CPF com dígitos verificadores e bloqueio de repetidos, regex de telefone com DDD e
CEP, obrigatórios, UF, data real e os quatro status permitidos.

O formulário usa `novalidate`, `setCustomValidity()` e `checkValidity()` com
feedback textual Bootstrap, `aria-describedby`, `aria-invalid` e atualização
ao corrigir o campo. CPF, telefone e CEP são enviados e armazenados com a mesma
formatação das máscaras. ViaCEP recebe somente os oito dígitos do CEP e preserva
o número digitado manualmente.

### Imagens responsivas — IDs 09 e 10

O pequeno ícone de entregas da navbar é renderizado nas três páginas. O SVG
original acompanha os WebP otimizados de **32, 64 e 96px**, com menos de 1,2 KB cada.
`srcset` e `sizes="32px"` permitem ao navegador escolher a imagem para a densidade
da tela. O SCSS utiliza `width: 2rem`, `height: auto`, `max-width: 100%` e
`object-fit: contain`. O `alt` vazio evita repetir o nome da marca ao leitor de tela.

```bash
npm run images:build
```

### Sass: desenvolvimento e compilação

```bash
npm run sass:build
npm run sass:watch
```

Edite `assets/scss/`, nunca `assets/css/style.css`, que é compilado e versionado.
`main.scss` usa `@use` para carregar variáveis, mixins, base, layout e componentes.
São preservados os tokens Neo-Industrial Mono, nesting raso, breakpoint mobile,
propriedades CSS `--ef-*` e `--bs-*`, Flexbox, grid Bootstrap e tipografia `clamp()`.
O `@import url(...)` das fontes é CSS nativo, não importação legada de módulos Sass.
As páginas usam apenas Bootstrap e um CSS personalizado compilado.

### Qualidade do código

```bash
npm run lint
npm run format:check
npm run format
```

ESLint considera o JavaScript do navegador, Bootstrap, jQuery e os scripts Node.js.
Prettier formata HTML, SCSS e JavaScript. O CSS compilado, as bibliotecas de
terceiros, o lockfile e os documentos aprovados em `docs/` são preservados pelo
formatador.
