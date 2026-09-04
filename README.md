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

- Framework CSS: Bootstrap
- JavaScript:
  - jQuery - Para manipulação do DOM e interatividade.
  - jQuery Mask Plugin - Para aplicação de máscaras em CPF, telefone e CEP.
  - JSON Server - Para simular uma API REST.
- API Pública:
  - ViaCEP - Consulta de CEP e preenchimento automático dos endereços.

## ✅ Checklist | Indicadores de Desempenho (ID) dos Resultados de Aprendizagem (RA)

#### RA1 - Utilizar Frameworks CSS para estilização de elementos HTML e criação de layouts responsivos.

- [ ] ID 01 - Prototipa interfaces adaptáveis para no mínimo os tamanhos de tela mobile e desktop, usando ferramentas de design tradicionais (Figma, Quant UX ou Sketch) ou IA (Stitch).
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

- [ ] ID 15 - Configura ambiente com Node.js e NPM para gerenciamento de pacotes e dependências.
- [ ] ID 16 - Utiliza boas práticas de versionamento no Git/GitHub (branch main ou branches específicos, uso de .gitignore).
- [ ] ID 17 - Mantém um README.md padronizado, conforme template da disciplina, com checklist preenchido.
- [ ] ID 18 - Organiza arquivos do projeto de forma modular, seguindo padrão de exemplo fornecido.
- [ ] ID 19 - Configura linters e formatadores (ESLint, Prettier) para manter qualidade e padronização do código.

#### RA4 - Aplicar bibliotecas de funções e componentes em JavaScript para aprimorar a interatividade de páginas web.

- [ ] ID 20 - Utiliza jQuery para manipulação do DOM e interatividade (eventos, animações, manipulação de elementos)
- [ ] ID 21 - Integra e configura um plugin jQuery relevante (ex.: jQuery Mask Plugin) ou outra biblioteca de funções.

#### RA5 - Efetuar requisições assíncronas para uma API fake e APIs públicas, permitindo a obtenção e manipulação de dados dinamicamente.

- [ ] ID 22 - Realiza requisições assíncronas para uma API fake (ex.: JSON Server) para persistir dados de um formulário.
- [ ] ID 23 - Realiza requisições assíncronas para uma API fake para exibir dados na página.
- [ ] ID 24 - Realiza requisições assíncronas para APIs públicas reais (OpenWeather, ViaCEP etc.), exibindo os dados e tratando erros.

## 🚀 Manual de execução

As instruções de execução serão adicionadas durante o desenvolvimento da aplicação.

## 📱 Telas da aplicação

As imagens das telas serão adicionadas após o desenvolvimento da aplicação.
