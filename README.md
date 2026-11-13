# entrega-facil

### Autor: Lucas Brugge de Almeida

O Entrega Fácil é uma aplicação web para cadastro e acompanhamento de entregas.
Esta versão apresenta a **casca da 2ª entrega**: listagem, cadastro e detalhes em
três páginas HTML responsivas, com Bootstrap e Sass.

Os exemplos estão escritos no HTML. A navegação, o menu responsivo e o modal
Bootstrap funcionam. Busca, filtros, cadastro, consulta de CEP e atualização de
status permanecem como apresentação visual, sem gravações. APIs, CRUD, validações,
jQuery e armazenamento no navegador ficam para a 3ª entrega.

## 📚 Documentação do Projeto

- [📄 Product Requirements Document (PRD)](docs/prd.md) — Escopo e histórias de usuário da 1ª entrega.
- [🛠️ Arquitetura da Aplicação](docs/architecture.md) — Modelo de dados, tecnologias e integrações previstas na 1ª entrega.

Os dois documentos permanecem integralmente preservados. Descrevem a proposta
completa, incluindo funcionalidades que não fazem parte desta casca.
[docs/validacao-tecnica.md](docs/validacao-tecnica.md) é um registro histórico
de outubro; seus testes e comandos de API não descrevem a versão atual.

## 🎨 Design

- 🎨 [Design System aplicado e tokens da casca](sdd.md) — Complemento técnico, sem modificar a arquitetura original.
- 🖼️ Protótipo no Figma/Stitch — [Páginas](https://stitch.withgoogle.com/projects/2737167932936789921)

## 🌐 Site em Produção - GitHub Pages

A partir da Entrega 3.

## 💻 Tecnologias e Dependências

- **Bootstrap 5.3.8:** grid, cards, campos, botões, badges, navbar e modal.
- **Sass:** tokens, mixin reutilizado, função de espaçamento e estilos por página.
- **Node.js e npm:** gerenciamento das dependências e ferramentas de desenvolvimento.
- **ESLint e Prettier:** verificação dos scripts e padronização do código.

Bootstrap, suas licenças, CSS compilados e imagens acompanham o projeto.
Google Fonts carrega Inter e Space Grotesk pela internet, com fontes alternativas.
ViaCEP e JSON Server continuam previstos nos documentos originais para a etapa
de comportamento; não são dependências desta versão.

## ✅ Checklist | Indicadores de Desempenho (ID) dos Resultados de Aprendizagem (RA)

Os enunciados abaixo foram preservados literalmente de `6ddf6c9df7`.
As marcações comprovadas da 1ª entrega (**01, 15, 16 e 17**) foram preservadas.
Os IDs **02–10** ficam desmarcados até o autor conferir as evidências e confirmar
que consegue explicar o código. Os IDs 15 e 16 também integram a avaliação desta fase.

No commit histórico, 18 e 19 estavam marcados, mas a evidência era incompleta:
18 tinha apenas a separação de documentos em `docs/`; 19 não tinha configuração
de linter ou formatador. A estrutura atual e as ferramentas fornecem evidências
para conferência, sem atribuir sua implementação à 1ª entrega. O enunciado
reserva os IDs 17–19 à 3ª entrega; o 17 é mantido como registro histórico.

#### RA1 - Utilizar Frameworks CSS para estilização de elementos HTML e criação de layouts responsivos.

- [x] ID 01 - Prototipa interfaces adaptáveis para no mínimo os tamanhos de tela mobile e desktop, usando ferramentas de design tradicionais (Figma, Quant UX ou Sketch) ou IA (Stitch).
- [ ] ID 02 - Implementa layout responsivo com Framework CSS (Bootstrap, Materialize) usando Flexbox ou Grid do próprio framework.
- [ ] ID 03 - Implementa layout responsivo com CSS puro, usando Flexbox ou Grid Layout.
- [ ] ID 04 - Utiliza componentes prontos de um Framework CSS (ex.: card, button) e componentes JavaScript do framework (ex.: modal, carousel).
- [ ] ID 05 - Cria layout fluido usando unidades relativas (vw, vh, %, em, rem) no lugar de unidades fixas (px).
- [ ] ID 06 - Aplica um Design System consistente (cores, tipografia, padrões de componentes) em toda a aplicação.
- [ ] ID 07 - Utiliza Sass (SCSS) com ou sem framework, aplicando variáveis, mixins e funções para modularizar o código.
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
- [ ] ID 18 - Organiza arquivos do projeto de forma modular, seguindo padrão de exemplo fornecido.
- [ ] ID 19 - Configura linters e formatadores (ESLint, Prettier) para manter qualidade e padronização do código.

#### RA4 - Aplicar bibliotecas de funções e componentes em JavaScript para aprimorar a interatividade de páginas web.

- [ ] ID 20 - Utiliza jQuery para manipulação do DOM e interatividade (eventos, animações, manipulação de elementos)
- [ ] ID 21 - Integra e configura um plugin jQuery relevante (ex.: jQuery Mask Plugin) ou outra biblioteca de funções.

#### RA5 - Efetuar requisições assíncronas para uma API fake e APIs públicas, permitindo a obtenção e manipulação de dados dinamicamente.

- [ ] ID 22 - Realiza requisições assíncronas para uma API fake (ex.: JSON Server) para persistir dados de um formulário.
- [ ] ID 23 - Realiza requisições assíncronas para uma API fake para exibir dados na página.
- [ ] ID 24 - Realiza requisições assíncronas para APIs públicas reais (OpenWeather, ViaCEP etc.), exibindo os dados e tratando erros.

### Evidências para confirmação do autor

Antes de marcar os IDs 02–10, conferir no código: conceito, motivo de uso,
sintaxe e efeito de retirar cada recurso. A explicação do autor continua necessária.

### Organização e origem das telas

```text
app/
  index.html
  entregas.css
  pages/cadastro/
    index.html
    cadastro.css
  pages/detalhes/
    index.html
    detalhes.css
assets/
  css/
  scss/
  images/
  vendor/
docs/
```

Os três HTML foram recuperados seletivamente de `c5048275ab`, conferidos e
adaptados para conteúdo estático. O Sass enxuto, as imagens e o Bootstrap local
foram reaproveitados da `main` em `525a647`. O histórico permanece acessível.

Referências: [modelo de README](https://github.com/utfpr-gp/roubank-css) e
[organização por páginas](https://github.com/utfpr-gp/joao-lenao--gerador-relatorio-medico).

## 🚀 Manual de execução

Requer Node.js **20.19+, 22.13+ ou 24+**, npm e a extensão **Live Server** do VS Code.

Após publicar a `main` atualizada, clone o projeto:

```bash
git clone https://github.com/lucasbrugge/entrega-facil.git
cd entrega-facil
npm install
```

Na cópia de trabalho atual, basta executar `npm install` na raiz. No VS Code,
abra **app/index.html**, clique com o botão direito e escolha **Open with Live
Server**. A página inicial é **app/index.html**; mantenha a raiz inteira do
projeto aberta no editor para os caminhos de `assets/` funcionarem.

A listagem contém o link **Ver detalhes** da entrega #001. Nos detalhes, use
**Nova Entrega** para abrir o cadastro e **Cancelar** para retornar à listagem.
No celular, esses links também estão disponíveis pelo menu recolhível.

Os estilos compilados e o Bootstrap já acompanham a versão. Não é necessário
executar Sass ou uma API para abrir as páginas.

### Desenvolvimento

```bash
npm run sass:build
npm run sass:watch
npm run lint
npm run format:check
```

Edite `assets/scss/`. O Sass gera o estilo compartilhado em `assets/css/main.css`
e os estilos específicos em `app/entregas.css`, `app/pages/cadastro/cadastro.css`
e `app/pages/detalhes/detalhes.css`. Preserve os CSS compilados junto do código-fonte.
`npm run format` formata os arquivos de trabalho, preservando `docs/`, bibliotecas,
CSS compilados e lockfile.

## 📱 Telas da aplicação

- [Listagem de entregas](app/index.html)
- [Cadastro](app/pages/cadastro/index.html)
- [Detalhes da entrega](app/pages/detalhes/index.html)

Abra as páginas pelo Live Server conforme o manual acima.
