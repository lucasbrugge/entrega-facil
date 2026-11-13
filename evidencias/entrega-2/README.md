# Evidências da preparação — 13/11/2026

Estado inicial: branch `main`, árvore limpa, commit
`ac0a5e4803db10d7dc0aed1a6563adec92d95dfb`, sem tags locais.
Não houve commit, push, criação de tag ou publicação de vídeo nesta preparação.
O checklist aprovado, seus textos e o link original do protótipo foram preservados.

O arquivo `entrega-2.md` não estava disponível. O enunciado completo foi localizado
no anexo `Texto colado.txt` desta conversa e consultado para a revisão dos 11 IDs,
as quatro perguntas do vídeo e as condições de submissão.

## Duas verificações separadas

| Item                      | Clone remoto publicado                                                                       | Cópia isolada do trabalho atual                                                                            |
| ------------------------- | -------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Origem                    | `git clone https://github.com/lucasbrugge/entrega-facil.git` em pasta temporária nova        | Arquivos da pasta de trabalho copiados para outra pasta temporária, sem `.git` nem `node_modules` original |
| Versão                    | Commit `ac0a5e4803db10d7dc0aed1a6563adec92d95dfb`                                            | Mesmo código de aplicação, com a preparação documental local                                               |
| Instalação                | `npm install` concluído; estado Git limpo após instalação; dependências declaradas presentes | `npm install` próprio concluído: 93 pacotes instalados                                                     |
| Servidor                  | Live Server, raiz do clone, entrada `/app/index.html`                                        | Live Server, raiz da cópia, entrada `/app/index.html`                                                      |
| Navegador                 | Chromium 158.0.8127.18                                                                       | Chromium 158.0.8127.18                                                                                     |
| Layout                    | Três páginas em 390 e 1440px                                                                 | Três páginas em 390 e 1440px                                                                               |
| Interações                | Navegação, menu mobile e modal aprovados                                                     | Navegação, menu mobile e modal aprovados                                                                   |
| Capturas usadas no README | Não                                                                                          | Seis capturas reais desta cópia                                                                            |

A instalação usou `npm install --no-audit --no-fund --cache <pasta temporária>`;
as opções não mudam o procedimento de abertura descrito no README. O clone
remoto foi conferido novamente após a conclusão da instalação. A pasta de
trabalho isolada recebeu também os documentos finais e as capturas para a
checagem de links; isso não publica os arquivos nem os transforma em evidência
do clone remoto.

Os hashes dos HTML, CSS, SCSS, imagens e bibliotecas coincidem nas duas cópias.
As adições desta tarefa são o README atualizado, capturas, mapa, roteiro e este
registro. Elas ainda não foram enviadas ao GitHub.

## Resultados observados

- Seis combinações de página/largura em cada cópia: 12 cenários finais ao todo.
- Três páginas distintas; nenhum transbordamento horizontal em 390/1440px.
- CSS e imagens locais carregados sem erro; ícones visíveis; cantos externos de até 2px na fonte padrão.
- Navegação listagem → detalhes #001 → cadastro → listagem, em celular e desktop.
- Menu mobile abre e fecha, com `aria-expanded` atualizado.
- Modal abre e fecha pelo botão, pelo X e por Escape; foco devolvido ao acionador. Botão de gravação continua desabilitado.
- Nenhum erro JavaScript, HTTP local, falha externa ou requisição de dados `fetch`/XHR observado nos fluxos testados.
- `npm run lint` aprovado na pasta de trabalho; atualmente analisa a configuração ESLint, pois não há JS próprio da aplicação.
- Quatro CSS correspondem à compilação em memória dos SCSS. Nenhum build foi necessário para abrir as páginas.
- Prettier, `git diff --check`, links locais, intervalos do mapa e preservação do checklist conferidos ao final.

## Origem e leitura das imagens

Os seis PNG mostram páginas inteiras em larguras de **390px** e **1440px**, com
viewport inicial de **900px** de altura e densidade **1x**. O formulário é mais
alto que a janela inicial. São capturas novas da aplicação real, não imagens
geradas. Os exemplos de clientes e entregas são fictícios.

No [README principal](../../README.md#-telas-da-aplicação), cada captura aparece
separadamente, identificada por página e largura. Abra a imagem para consultar
os detalhes na resolução original; o GitHub pode reduzi-la à largura do leitor.

## Limites e problemas encontrados

- A primeira tentativa de clone no sandbox falhou por DNS; o clone real foi concluído com acesso à rede autorizado.
- A primeira instalação npm do clone remoto ficou sem progresso e foi interrompida; a repetição concluiu com sucesso. O teste final do navegador ocorreu depois dela.
- Foi usado o motor da extensão instalada **Live Server 5.7.10**, pacote interno **2.2.0**, iniciado programaticamente. Não foi acionado o menu visual do VS Code. Essa abertura manual permanece uma conferência útil no computador do autor.
- Os testes são em Chromium com viewports simulados; não houve teste em aparelho físico ou em outros navegadores.
- A submissão pública, o acesso anônimo ao Stitch/vídeo e os links de uma futura tag ainda não foram validados. Não existe tag `entrega-2` criada nesta tarefa.
- O enunciado informa prazo de 08/11 às 23:59; confirmar a orientação do docente para a submissão atual.

## Próximos passos

1. Revisar [mapa provisório](../../mapa-entrega-2.md), [roteiro](../../roteiro-entrega-2.md), capturas e diff; manter o checklist aprovado.
2. Em etapa posterior, commitar e publicar os arquivos finais; repetir o teste de clone remoto para esse novo commit.
3. Criar/publicar a tag `entrega-2` no commit revisado; conferir o mapa definitivo com links `blob/entrega-2/` e linhas reais da tag.
4. Gravar o vídeo em duas partes, explicando os quatro pontos de cada ID; publicar como não listado e testar os links deslogado.
5. Enviar ao Moodle o link da tag, o mapa definitivo e o vídeo.

[Medições estruturadas das duas cópias](verificacao.json).
