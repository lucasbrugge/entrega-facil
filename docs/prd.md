# PRD — Entrega Fácil
### Autor: Lucas Brugge de Almeida

## 1. Visão geral

O Entrega Fácil é uma aplicação web responsiva para cadastro e acompanhamento básico de entregas.

A aplicação permitirá registrar dados do cliente, informações do produto, endereço de origem, endereço de destino, data prevista e situação atual da entrega.

O projeto será desenvolvido como um MVP acadêmico, priorizando simplicidade e atendimento aos requisitos da disciplina.

## 2. Problema

O acompanhamento de pequenas entregas pode ser realizado de maneira desorganizada quando informações de clientes, produtos, endereços e status ficam espalhadas em anotações ou mensagens.

O Entrega Fácil centraliza essas informações em uma única aplicação.

## 3. Objetivo

Desenvolver uma aplicação que permita:

- cadastrar entregas;
- consultar CEPs automaticamente;
- listar entregas cadastradas;
- visualizar os detalhes de uma entrega;
- atualizar o status da entrega.

## 4. Público-alvo

Pequenos negócios, profissionais autônomos ou usuários que desejem registrar e acompanhar entregas de forma simples.

## 5. Escopo do MVP

### 5.1 Cadastro de entrega

O usuário poderá cadastrar uma entrega contendo:

#### Cliente

- nome;
- CPF;
- telefone.

#### Produto

- nome do produto;
- descrição opcional.

#### Origem

- CEP;
- logradouro;
- número;
- bairro;
- cidade;
- UF.

#### Destino

- CEP;
- logradouro;
- número;
- bairro;
- cidade;
- UF.

#### Entrega

- data prevista;
- status.

### 5.2 Consulta de CEP

Ao informar um CEP válido, a aplicação realizará uma consulta à API pública ViaCEP.

Quando o CEP for encontrado, os seguintes campos serão preenchidos automaticamente:

- logradouro;
- bairro;
- cidade;
- UF.

O número do endereço continuará sendo informado manualmente.

A consulta será utilizada tanto para o endereço de origem quanto para o endereço de destino.

### 5.3 Listagem

As entregas cadastradas serão exibidas em formato de cards.

Cada card apresentará informações resumidas, como:

- identificador da entrega;
- cliente;
- produto;
- cidade de origem;
- cidade de destino;
- data prevista;
- status.

### 5.4 Detalhes

O usuário poderá acessar os detalhes completos de uma entrega cadastrada.

### 5.5 Status

A entrega possuirá um dos seguintes estados:

- Pendente;
- Em transporte;
- Entregue;
- Cancelada.

O status poderá ser atualizado após o cadastro.

## 6. Fora do escopo

Para manter o projeto como MVP, não serão implementados:

- autenticação;
- múltiplos usuários;
- cadastro separado de clientes;
- cadastro de entregadores;
- rastreamento GPS;
- mapas;
- cálculo de rotas;
- cálculo de frete;
- estoque;
- pagamentos;
- emissão de documentos fiscais;
- notificações;
- gestão financeira.

## 7. User Stories

### US01 — Cadastrar entrega

Como usuário, quero cadastrar uma entrega para armazenar as informações necessárias para seu acompanhamento.

### US02 — Consultar CEP

Como usuário, quero informar um CEP para que o sistema preencha automaticamente os dados do endereço.

### US03 — Visualizar entregas

Como usuário, quero visualizar as entregas cadastradas em cards para consultar rapidamente suas principais informações.

### US04 — Visualizar detalhes

Como usuário, quero acessar os detalhes de uma entrega para visualizar todas as informações cadastradas.

### US05 — Atualizar status

Como usuário, quero atualizar o status de uma entrega para representar sua situação atual.

## 8. Regras de negócio

### RN01

Toda entrega deverá possuir um cliente identificado por nome.

### RN02

O CPF deverá respeitar o formato definido pela validação da aplicação.

### RN03

O telefone deverá respeitar o formato definido pela validação da aplicação.

### RN04

Os CEPs de origem e destino deverão possuir oito dígitos e ser consultados através da API ViaCEP.

### RN05

Quando a API retornar um CEP inexistente, a aplicação deverá informar o erro ao usuário.

### RN06

Os campos de endereço retornados pela ViaCEP poderão ser preenchidos automaticamente.

### RN07

O número dos endereços deverá ser informado manualmente pelo usuário.

### RN08

Toda entrega deverá possuir ao menos um produto identificado por nome.

### RN09

A data prevista deverá ser informada no cadastro.

### RN10

Toda entrega deverá possuir um status válido.

### RN11

Os dados cadastrados serão persistidos através da API fake implementada com JSON Server.

### RN12

Falhas na API pública deverão ser tratadas sem impedir o funcionamento das demais funcionalidades da aplicação.

## 9. Páginas

A aplicação terá três páginas principais.

### Página 1 — Entregas

Responsável pela listagem das entregas em cards.

Principais elementos:

- Navbar;
- botão para nova entrega;
- cards;
- badges de status;
- botão para visualizar detalhes.

### Página 2 — Cadastro de entrega

Responsável pelo formulário de cadastro.

O formulário será dividido em:

- dados do cliente;
- produto;
- origem;
- destino;
- dados da entrega.

### Página 3 — Detalhes da entrega

Responsável pela visualização completa de uma entrega.

Apresentará:

- dados do cliente;
- informações do produto;
- endereço de origem;
- endereço de destino;
- data prevista;
- status;
- opção de atualização do status.

## 10. Critérios de sucesso do MVP

O MVP será considerado funcional quando o usuário conseguir:

1. cadastrar uma entrega;
2. consultar CEPs de origem e destino;
3. visualizar as entregas cadastradas;
4. acessar os detalhes de uma entrega;
5. atualizar seu status.
