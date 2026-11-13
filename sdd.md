# Design System aplicado — complemento técnico da Entrega 2

Este documento descreve a casca atual e complementa a
[arquitetura da 1ª entrega](docs/architecture.md), preservada integralmente.
Os detalhes de implementação abaixo não representam aprovação retroativa.
Referência visual: [protótipo original no Stitch](https://stitch.withgoogle.com/projects/2737167932936789921).

## Tokens e aplicação

| Token Sass             | Valor                                | Aplicação e origem                                                                                                                                      |
| ---------------------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `$bg`                  | `#fbf9f8`                            | Fundo das três páginas; corresponde ao fundo do protótipo.                                                                                              |
| `$ink`                 | `#1b1c1c`                            | Texto do corpo e sombra sólida; corresponde ao texto principal do protótipo.                                                                            |
| `$font-body`           | `Inter, Arial, sans-serif`           | Inter do protótipo, com alternativas locais.                                                                                                            |
| `$font-heading`        | `'Space Grotesk', Inter, sans-serif` | Fonte de títulos e metadados do protótipo.                                                                                                              |
| `$section-marker-size` | `clamp(1.7rem, 4vw, 2rem)`           | Adaptação fluida dos marcadores do cadastro.                                                                                                            |
| `$space-unit`          | `0.25rem`                            | Passo da função `space()`; equivale a 4px com fonte raiz de 16px, compatível com o menor espaçamento do protótipo.                                      |
| `$corner-radius`       | `0.125rem`                           | Cantos discretos compartilhados (2px com fonte raiz de 16px); usa o token `rounded.sm` da escala do Stitch como adaptação para uma casca mais quadrada. |

Os sete tokens estão em [assets/scss/_variables.scss](assets/scss/_variables.scss).
[main.scss](assets/scss/main.scss) conecta fundo, texto e fonte às propriedades
`--bs-body-bg`, `--bs-body-color` e `--bs-body-font-family`. Cada HTML carrega
Bootstrap, `main.css` e o CSS da página, nessa ordem.

## Reuso e componentes

- `square-size($size)` define largura e altura. É reutilizado no ícone da marca
  e nos marcadores do cadastro.
- `space($steps)` multiplica a quantidade de passos por `$space-unit`.
  `space(8)` produz `2rem` para o ícone e `space(1)` produz `0.25rem` para a sombra.
- O título usa `clamp(1.65rem, 3vw, 2rem)` e a marca usa
  `clamp(1rem, 2.5vw, 1.15rem)`; os limites são adaptações da implementação.
- Cards, botões, campos, badges, navbar e modal usam componentes Bootstrap.
  A sombra `0 0.25rem 0 #1b1c1c` mantém a identidade visual dos cards.
- O menu móvel e o modal de status funcionam pelos atributos `data-bs-*` e pelo
  `bootstrap.bundle.min.js`. Não há JavaScript próprio da aplicação.
- O ícone usa WebP de 32/64/96px, `srcset`, `sizes="2rem"`, `img-fluid` e
  `object-fit: contain`. A seleção acompanha a densidade de pixels e o tamanho
  informado em `sizes`; a largura do ícone não aumenta com a janela.

## Responsividade e adaptações

O grid Bootstrap da listagem mostra uma coluna no celular, duas a partir de
768px e três a partir de 1200px. Os campos usam `row` e `col-*` do framework.

O layout próprio `.ef-address-grid`, em `cadastro.scss`, organiza origem e
destino em uma coluna. A media query `min-width: 62rem` passa a duas colunas.
Essa regra demonstra CSS Grid próprio, separado do grid Bootstrap.

As fontes, o fundo e a sombra vêm da identidade Neo-Industrial Mono. Botões
`btn-dark`, bordas, foco e cores dos badges conservam os padrões do
Bootstrap; não se afirma reprodução exata de todos os tokens do Stitch.
O framework não é recompilado nem tem sua variável Sass `$primary` alterada.

O cadastro mantém a organização desktop do protótipo, com origem e destino
na mesma etapa. A listagem possui três exemplos fictícios, com detalhes apenas
da entrega #001. Busca, filtros, consulta de CEP e gravações estão desabilitados.
O modal permite abrir, selecionar uma opção e fechar, sem persistir alterações.

## Arquivos de estilo

| Entrada Sass    | CSS compilado                     | Página                                                                 |
| --------------- | --------------------------------- | ---------------------------------------------------------------------- |
| `main.scss`     | `assets/css/main.css`             | Todas: fontes, cores, títulos, ícone e sombra.                         |
| `entregas.scss` | `app/entregas.css`                | Listagem: movimento discreto no hover, respeitando movimento reduzido. |
| `cadastro.scss` | `app/pages/cadastro/cadastro.css` | Cadastro: Grid próprio e marcadores.                                   |
| `detalhes.scss` | `app/pages/detalhes/detalhes.css` | Detalhes: quebras de linha na descrição.                               |

Os CSS compilados são versionados: um clone não precisa compilar Sass para abrir
as telas. Bootstrap e imagens são locais. Google Fonts exige internet; as fontes
alternativas permitem continuar usando a interface quando o serviço não responde.

## Ajuste dos cantos

O token `$corner-radius`, em `assets/scss/_variables.scss`, alimenta
`--bs-border-radius`, `--bs-border-radius-sm` e `--bs-border-radius-lg` no
`:root` de `main.scss`. Cards, botões, campos, badges, menu e modal usam essas
variáveis do Bootstrap. O botão `.btn-close` também recebe o raio comum,
pois o framework define seu arredondamento com um valor fixo.

Os encontros de campos e botões em `input-group` continuam retos; o Bootstrap
calcula os cantos internos de cards e modais a partir do raio externo e da borda.
O valor atual é uma adaptação solicitada para reduzir os cantos: `0.125rem`
(2px na fonte padrão), menor que os 4px descritos para os componentes do protótipo.

Para cantos totalmente retos, altere `$corner-radius` para `0`. Para um toque
mais suave, use `0.25rem` (4px na fonte padrão). Depois execute
`npm run sass:build`; não edite o CSS compilado nem os arquivos de `vendor/`.
