# Revisão técnica — Entrega Fácil

Verificação executada em 19/10/2026, com Node.js 22.23.2 e Chromium 156.

## Implementado e testado

- Layout, componentes Bootstrap, Sass e tipografia fluida preservados (IDs 02 a 08).
- Ícone real na navbar, WebP de 32/64/96px (498/852/1108 bytes), `srcset`, `sizes`,
  dimensões relativas e `object-fit`; seleção 1x/2x/3x confirmada no navegador (09 e 10).
- Mensagens específicas e acessíveis de validação, CPF algorítmico, regex, máscaras,
  status e modo demo persistente (11 a 14, 20 e 21).
  jQuery 4.0.0 e Mask Plugin 1.14.16 com versões fixadas; compatibilidade confirmada
  pela suíte, sem necessidade de downgrade para jQuery 3.
- ESLint e Prettier configurados e executados, sem alterar protótipos (19).
- JSON Server 0.17.4: GET das coleções e detalhes, POST de entrega e endereços,
  filtro por `entregaId`, PATCH de status e persistência em disco/reload (22 e 23).
- Compensação de falha no segundo endereço, resposta perdida após POST persistido,
  falha explícita de limpeza e nova tentativa sem duplicar cadastros.
- Consulta ViaCEP real em origem e destino após máscaras, incluindo logradouro,
  bairro, cidade e UF e preservação do número; CEP incompleto, inexistente,
  falha de rede e nova consulta reproduzidos com mocks (24).

As ferramentas de execução e versionamento (15 a 18) foram conferidas no
repositório. O protótipo do ID 01 é o já registrado pelo projeto.

## Comandos e evidências

- `npm run sass:build`: compilação concluída; teste compara CSS versionado com o Sass.
- `npm run sass:watch`: recompilação automática confirmada após edição temporária.
- `npm run vendor:sync` e `npm run images:build`: bibliotecas e imagens geradas.
- `npm run lint`: nenhum erro.
- `npm run format:check`: arquivos abrangidos formatados.
- `npm test`: 15 testes aprovados, um teste externo ignorado por padrão.
- `npm run test:external`: um teste real ViaCEP aprovado, sem interceptação da API externa.
- `npm run api`: servidor iniciado em localhost:3000, GET verificado.
- `npm start`: frontend iniciado em localhost:8080, HTML verificado.
- `git diff --check`: sem erros de whitespace.

A suíte usa JSON Server real e uma cópia temporária do banco, removida ao terminar.
Desktop (1440px) e mobile (390px) foram verificados nas três páginas, incluindo
menu, filtros, busca, formulário, badges e modal, sem overflow horizontal ou
exceções JavaScript. Capturas ficam em `test-results/`, ignorado pelo Git.
No ambiente desta execução, Chromium utilizou bibliotecas temporárias em `/tmp`
porque a instalação de dependências de sistema via sudo não estava disponível.

## Pendências fora dos requisitos funcionais

- `npm audit`: cinco alertas altos preexistentes na cadeia de `gh-pages`.
- PDF e gerador Sass não estavam presentes no checkout inicial; haviam sido
  removidos no commit `5d1565c`. Nenhum PDF ou conteúdo histórico foi alterado.
  A referência quebrada a `docs:sass` foi retirada do package.json e do manual.
- A compensação é uma recuperação de cliente, não uma transação de banco. Se a API
  permanecer indisponível durante a limpeza, a interface informa o ID e bloqueia
  uma nova criação até a limpeza na mesma página. Se ela for fechada, é necessário
  conferir o ID na API antes de reenviar. Essa limitação está documentada no README.

Não restaram requisitos funcionais parciais ou integrações implementadas sem
validação externa nesta revisão. O teste externo é separado para não exigir
respostas ViaCEP em toda execução da suíte.
