# Design System aplicado — complemento técnico da Entrega 2

Este documento registra os tokens efetivamente aplicados no Entrega Fácil e
complementa a [arquitetura aprovada](docs/architecture.md), sem alterá-la. Os
valores abaixo descrevem a implementação desta entrega; não representam uma
aprovação anterior do professor. Referência visual: [protótipo no Stitch](https://stitch.withgoogle.com/projects/2737167932936789921).

## Tokens e aplicação

| Token Sass             | Valor                                | Aplicação                                                         |
| ---------------------- | ------------------------------------ | ----------------------------------------------------------------- |
| `$bg`                  | `#fbf9f8`                            | Fundo de todas as páginas, por `--bs-body-bg`.                    |
| `$ink`                 | `#1b1c1c`                            | Texto do corpo, por `--bs-body-color`, e sombra sólida dos cards. |
| `$font-body`           | `Inter, Arial, sans-serif`           | Texto e formulários, por `--bs-body-font-family`.                 |
| `$font-heading`        | `'Space Grotesk', Inter, sans-serif` | Títulos, marca e metadados.                                       |
| `$section-marker-size` | `clamp(1.7rem, 4vw, 2rem)`           | Marcadores das seções do cadastro.                                |
| `$space-unit`          | `0.25rem`                            | Unidade da função Sass `space()`.                                 |

Os tokens estão em `assets/scss/_variables.scss`. `main.scss` conecta as
variáveis às propriedades CSS do Bootstrap **depois** de `bootstrap.min.css`.
O projeto não recompila nem troca `$primary` do framework: os componentes
continuam usando as classes Bootstrap, e a identidade própria entra no CSS comum.

## Reuso e componentes

- `square-size($size)`: mixin com largura e altura; usado na marca das três
  páginas e nos marcadores do cadastro. O alinhamento `inline-grid` do marcador
  permanece em `cadastro.scss`, separado das dimensões compartilhadas.
- `space($steps)`: retorna `$steps * $space-unit`; `space(8)` gera `2rem`
  para o ícone e `space(1)` gera `0.25rem` para a sombra dos cards. A unidade
  acompanha a fonte raiz; com 16px equivale a 32px e 4px, respectivamente.
- Título: `clamp(1.65rem, 3vw, 2rem)`. Marca: `clamp(1rem, 2.5vw, 1.15rem)`.
- Ações principais: `btn-dark`; secundárias: `btn-outline-dark`; exclusão:
  `btn-outline-danger`/`btn-danger`. São cores nativas do Bootstrap, não `$ink`.
- Status: badges semânticos do Bootstrap. Pendente usa amarelo; em transporte,
  azul; entregue, verde; cancelada, vermelho.
- Cards: `card bg-white border-dark ef-card`; bordas e arredondamento do
  Bootstrap, com sombra sólida própria. Não há tema próprio de botões ou inputs.
- Imagem da marca: WebP de 32/64/96px, `srcset`, `sizes="32px"`, `img-fluid`
  e `object-fit-contain`. Com fonte raiz padrão, ocupa 2rem por 2rem.

## Responsividade e relação com o protótipo

O layout conserva navbar, filtros, cards de entregas, cadastro por seções,
origem/destino e modal de status do protótipo. No celular, os campos e cards
empilham; origem/destino ficam lado a lado a partir de `lg` (992px). A listagem
usa uma coluna, duas a partir de `md` (768px) e três a partir de `xl` (1200px).

As adaptações da implementação incluem ícone na marca, filtros com quebra de
linha, bordas/arredondamento nativos do Bootstrap e ação adicional de exclusão.
Os dados demonstrativos e a quantidade de cards diferem das imagens do Stitch.
O formulário segue a organização do protótipo desktop, com origem e destino
sob a mesma etapa; a variante mobile do Stitch usa outra numeração. Essas
diferenças devem ser mostradas e justificadas na apresentação.

As fontes Google exigem internet e têm fallback. A interface, Bootstrap,
JavaScript e WebP são locais. A execução visual pode usar `?modo=demo`, sem API.
