# 📄 Product Requirements Document (PRD) - Entrega Fácil

## 1. Visão Geral e Objetivo

O **Entrega Fácil** é uma aplicação web para cadastro e acompanhamento básico de entregas.

O sistema tem como objetivo centralizar, de forma simples, as principais informações de uma entrega, reunindo dados do cliente, produto, endereço de origem, endereço de destino, data prevista e status.

A aplicação busca facilitar o controle de pequenas entregas, evitando que essas informações fiquem dispersas em anotações, mensagens ou outros meios de consulta.

Como apoio ao cadastro, o sistema utilizará a consulta de CEP para preencher automaticamente informações dos endereços de origem e destino, reduzindo o preenchimento manual e possíveis erros.

## 2. Atores do Sistema

* **Operador:** Usuário responsável por cadastrar e acompanhar as entregas na aplicação. Pode registrar uma nova entrega, consultar as entregas cadastradas, visualizar seus detalhes e atualizar seu status.

## 3. Histórias de Usuário e Escopo

Abaixo estão as funcionalidades principais do MVP (Minimum Viable Product), escritas sob a perspectiva do usuário final.

### 📦 Épico 1: Cadastro de Entregas

* **US01 - Cadastrar Entrega:** Como um Operador, quero cadastrar uma nova entrega informando os dados do cliente, produto, origem, destino e data prevista, para manter as informações da entrega organizadas.

  * *Critérios de Aceitação:* Os campos obrigatórios devem ser preenchidos; CPF, telefone e CEP devem respeitar os formatos definidos pela aplicação; a entrega deve possuir um status.

* **US02 - Consultar CEP de Origem:** Como um Operador, quero consultar o CEP do endereço de origem para preencher automaticamente os dados do endereço e agilizar o cadastro.

  * *Critérios de Aceitação:* O CEP deve possuir formato válido; quando encontrado, o sistema deve preencher os dados de endereço disponíveis; caso o CEP não seja encontrado, o usuário deve ser informado.

* **US03 - Consultar CEP de Destino:** Como um Operador, quero consultar o CEP do endereço de destino para preencher automaticamente os dados do endereço e reduzir erros de preenchimento.

  * *Critérios de Aceitação:* O CEP deve possuir formato válido; quando encontrado, o sistema deve preencher os dados de endereço disponíveis; caso o CEP não seja encontrado, o usuário deve ser informado.

### 🚚 Épico 2: Acompanhamento de Entregas

* **US04 - Visualizar Entregas:** Como um Operador, quero visualizar as entregas cadastradas em cards para consultar rapidamente suas principais informações.

  * *Critérios de Aceitação:* Cada card deve apresentar as informações essenciais da entrega, incluindo cliente, produto, origem, destino, data prevista e status.

* **US05 - Visualizar Detalhes da Entrega:** Como um Operador, quero visualizar os detalhes de uma entrega para consultar todas as informações registradas.

* **US06 - Atualizar Status da Entrega:** Como um Operador, quero atualizar o status de uma entrega para manter sua situação atual registrada.

  * *Critérios de Aceitação:* O status deve aceitar apenas os valores definidos pela aplicação: **Pendente**, **Em transporte**, **Entregue** ou **Cancelada**.
