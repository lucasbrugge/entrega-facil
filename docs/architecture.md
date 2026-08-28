# Architecture — Entrega Fácil

## 1. Visão técnica

O Entrega Fácil será desenvolvido como uma aplicação web responsiva utilizando HTML5, SCSS/CSS, JavaScript e Bootstrap.

Os dados das entregas serão persistidos através de uma API fake utilizando JSON Server.

A aplicação também consumirá a API pública ViaCEP para consulta e preenchimento automático de endereços.

## 2. Tecnologias

### HTML5

Responsável pela estrutura semântica das páginas.

### Bootstrap 5

Framework CSS utilizado para layout responsivo e componentes visuais.

### SCSS

Utilizado para customização e modularização dos estilos.

Serão utilizados:

- variáveis;
- mixins;
- funções;
- arquivos parciais.

### JavaScript ES6+

Responsável por:

- validação dos formulários;
- manipulação dinâmica do DOM;
- Web Storage;
- requisições assíncronas;
- comunicação com JSON Server;
- comunicação com ViaCEP;
- regras de negócio.

### jQuery

Utilizado em manipulações do DOM e interações da aplicação.

### jQuery Mask Plugin

Utilizado para aplicar máscaras aos campos:

- CPF;
- telefone;
- CEP.

### JSON Server

Utilizado como API fake para armazenar e disponibilizar os dados das entregas.

### ViaCEP

API pública utilizada para consulta de endereços brasileiros através do CEP.

### Node.js e NPM

Utilizados para gerenciamento de pacotes, dependências e ferramentas de desenvolvimento.

### ESLint

Utilizado para análise e padronização do código JavaScript.

### Prettier

Utilizado para formatação automática do código.

## 3. API pública

### ViaCEP

A ViaCEP será utilizada para consulta de CEPs brasileiros.

Formato previsto da requisição:

`GET https://viacep.com.br/ws/{cep}/json/`

O CEP deverá ser enviado com oito dígitos.

Dados utilizados pela aplicação:

- `cep`;
- `logradouro`;
- `bairro`;
- `localidade`;
- `uf`.

Fluxo:

`CEP → fetch → ViaCEP → JSON → preenchimento do formulário`

A aplicação realizará consultas independentes para:

- endereço de origem;
- endereço de destino.

### Tratamento de erros

A aplicação deverá tratar:

- CEP com formato inválido;
- CEP inexistente;
- falha de comunicação com a API.

## 4. API fake

Será utilizado JSON Server.

Estrutura inicial:

```json
{
  "entregas": []
}
```

Operações previstas:

- `GET /entregas`;
- `POST /entregas`;
- `GET /entregas/:id`;
- `PATCH /entregas/:id`.

## 5. Modelo de dados

### Entidade Entrega

erDiagram
ENTREGA ||--|| ENDERECO_ORIGEM : possui
ENTREGA ||--|| ENDERECO_DESTINO : possui

    ENTREGA {
        string id PK
        string clienteNome
        string clienteCpf
        string clienteTelefone
        string produtoNome
        string produtoDescricao
        string dataPrevista
        string status
    }

    ENDERECO_ORIGEM {
        string cep
        string logradouro
        string numero
        string bairro
        string cidade
        string uf
    }

    ENDERECO_DESTINO {
        string cep
        string logradouro
        string numero
        string bairro
        string cidade
        string uf
    }

### Exemplo

```json
{
  "id": "1",
  "clienteNome": "João Silva",
  "clienteCpf": "123.456.789-00",
  "clienteTelefone": "(42) 99999-9999",
  "produtoNome": "Notebook",
  "produtoDescricao": "Notebook para entrega",
  "origem": {
    "cep": "85000-000",
    "logradouro": "Rua Exemplo",
    "numero": "100",
    "bairro": "Centro",
    "cidade": "Guarapuava",
    "uf": "PR"
  },
  "destino": {
    "cep": "80000-000",
    "logradouro": "Rua Exemplo",
    "numero": "250",
    "bairro": "Centro",
    "cidade": "Curitiba",
    "uf": "PR"
  },
  "dataPrevista": "2026-09-10",
  "status": "Pendente"
}
```

## 6. Estrutura prevista do projeto

Após o início da implementação:

```text
entrega-facil/
│
├── docs/
│   ├── prd.md
│   └── architecture.md
│
├── assets/
│   ├── css/
│   │   └── main.css
│   ├── scss/
│   │   ├── _variables.scss
│   │   ├── _mixins.scss
│   │   ├── _components.scss
│   │   └── main.scss
│   ├── js/
│   │   ├── api.js
│   │   ├── deliveries.js
│   │   ├── form.js
│   │   ├── validations.js
│   │   └── storage.js
│   └── images/
│
├── pages/
│   ├── cadastro.html
│   └── detalhes.html
│
├── db/
│   └── db.json
│
├── index.html
├── package.json
├── .gitignore
└── README.md
```

## 7. Design System

A identidade visual deverá transmitir:

- organização;
- agilidade;
- segurança;
- clareza.

### Paleta inicial

#### Background

`#F5F7FA`

#### Surface

`#FFFFFF`

#### Primary

`#2563EB`

#### Secondary

`#475569`

#### Success

`#198754`

#### Warning

`#FFC107`

#### Danger

`#DC3545`

#### Text

`#1E293B`

### Tipografia

Fonte principal:

`Inter`

Fallback:

`Arial, sans-serif`

A aplicação utilizará unidades relativas e tipografia responsiva.

## 8. Componentes

Pelo menos três componentes do protótipo serão posteriormente implementados com Bootstrap.

### Navbar

Utilizada na navegação principal.

### Card

Utilizado para apresentar cada entrega na listagem.

### Modal

Poderá ser utilizado para confirmações ou ações rápidas.

Outros componentes previstos:

- Forms;
- Buttons;
- Badge;
- Alert;
- Bootstrap Grid.

## 9. Responsividade

A aplicação seguirá abordagem Mobile First.

Serão consideradas versões:

- mobile;
- desktop.

Serão utilizados:

- Bootstrap Grid;
- Flexbox;
- CSS Grid;
- unidades relativas;
- media queries;
- `clamp()`.

## 10. Validação

Os formulários utilizarão:

- validação HTML nativa;
- JavaScript;
- expressões regulares;
- mensagens de erro e sucesso.

### CPF

A Regex será utilizada para validar o formato:

`000.000.000-00`

A validação por Regex verificará o formato e não a validade matemática do CPF.

### Telefone

Formato previsto:

`(00) 00000-0000`

### CEP

Formato visual previsto:

`00000-000`

Antes da consulta à ViaCEP, o valor será convertido para oito dígitos.

## 11. Web Storage

LocalStorage será utilizado para armazenar temporariamente o rascunho do formulário de cadastro de entrega.

Após o cadastro ser concluído com sucesso, o rascunho poderá ser removido.

Os dados definitivos permanecerão armazenados no JSON Server.

## 12. Status das entregas

Estados permitidos:

- Pendente;
- Em transporte;
- Entregue;
- Cancelada.

Os status poderão ser representados visualmente através de badges.

## 13. Tratamento de erros

A aplicação deverá tratar:

- formulário inválido;
- CEP inválido;
- CEP inexistente;
- falha na ViaCEP;
- falha no JSON Server;
- entrega não encontrada.

## 14. Deploy

### GitHub Pages

Será utilizado para atender ao requisito de publicação da disciplina.

### VPS

Uma versão completa poderá ser hospedada em VPS para permitir a execução contínua do JSON Server e persistência das entregas.

Nesse ambiente, o servidor web poderá atuar como proxy reverso para o JSON Server.
