# Contacts API

API de gerenciamento de contatos construída com NestJS, MongoDB e Swagger.

## - Visão geral

Este projeto implementa um backend RESTful para criação, listagem, atualização e inativação de contatos.

- Framework: NestJS 11
- Banco de dados: MongoDB via Mongoose
- Documentação de API: Swagger
- Validação global: `class-validator` + `class-transformer`
- Tratamento de exceções personalizado

## - Pré-requisitos

- Node.js 18+ (recomendado)
- npm 10+ ou equivalente
- Docker e Docker Compose (opcional para MongoDB)

## - Instalação

1. Clone o repositório:

```bash
git clone https://github.com/Oberdann/contacts-api.git
cd contacts-api
```

2. Instale dependências:

```bash
npm install
```

## 🔧 Configuração

O projeto carrega variáveis de ambiente via `dotenv`.
Crie um arquivo `.env` na raiz com as variáveis abaixo:

```env
PORT=3000
DATABASE_URL=mongodb://localhost:27017/contactsdb
```

> Se `PORT` não estiver definido, a aplicação usará `3000`.

## - Execução

### Modo de desenvolvimento

```bash
npm run dev
```

### Build e produção

```bash
npm run build
npm run start:prod
```

### Executando com Docker Compose

```bash
docker compose up -d
```

Depois, inicie a API localmente:

```bash
npm run dev
```

## - Endpoints e documentação

A aplicação usa o prefixo global `api/v1`.

- Documentação Swagger: `http://localhost:3000/doc`

> Ajuste a porta se você definiu `PORT` diferente.

## - Scripts disponíveis

- `npm run build` — compila o projeto
- `npm run dev` — executa em modo watch
- `npm run start` — inicia a aplicação
- `npm run start:prod` — inicia a versão compilada
- `npm run lint` — executa ESLint e corrige problemas
- `npm run format` — formata o código com Prettier
- `npm run test` — executa testes unitários

## - Testes

Execute os testes unitários:

```bash
npm run test
```

## - Estrutura do projeto

- `src/main.ts` — bootstrap da aplicação, validação global e Swagger
- `src/app.module.ts` — configuração do Mongoose e importação do módulo de contatos
- `src/modules/contacts` — controller, serviço, DTOs, exceções e mapper
- `src/common/filters` — filtro global de exceções
- `src/database/contacts.schema.ts` — schema do MongoDB

## - Observações

- A conexão com o MongoDB usa `DATABASE_URL`.
- O Swagger está disponível em `/doc`.
- Todos os endpoints são expostos sob `api/v1`.
- A validação global rejeita campos extras fora dos DTOs.
