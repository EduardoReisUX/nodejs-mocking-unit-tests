# Testes unitários em serviços Nodejs

Entendendo como utilizar o Mocking nativo do test runner do node em testes unitários.

## Ferramentas

- **Node@20.9.0**
- sinon@15.2.0: para os fake timers.
- c8@8.0.1: para criar relatório de test coverage.

## Como rodar

Para baixar as dependências e rodar o servidor:

```sh
npm ci --silent
npm start
```

Para rodar os testes automatizados: `npm test` ou `npm test:dev`

## Aprendizados

Algumas coisas que aprendi durante o projeto.

### node crypto

O módulo `node:crypto` está sendo utilizado para gerar UUIDs dos TODOs. Esse pacote funciona dependendo do sistema operacional, se o SO cair ou estiver com algum defeito, então o pacote não funcionará como o esperado. Então, dentre dos testes, fazemos a sua substituição antes de todos os testes rodarem, e atribuiremos novamente o seu papel original.

```javascript
// todoService.test.js
import crypto from "node:crypto";

// ...

before(() => {
  const DEFAULT_ID = "0001";
  crypto.randomUUID = () => DEFAULT_ID;
});

after(async () => {
  crypto.randomUUID = (await import("node:crypto")).randomUUID;
});
```

Mas é mais fácil substituir o pacote por outro de terceiros.

### deepStrictEqual - comparação com tipos de dados

O método `deepStrictEqual` compara se os dados são iguais e do mesmo tipo. Objetos atribuídos como tipos diferentes darão erro. Um objeto `Todo` não será igual ao objeto que contém todas as propriedades de `Todo`.

```javascript
  {
    error: {
+     data: Todo {
-     data: {
        id: '0001',
...
      message: 'invalid data'
    }
  }
```

Para corrigir isso, adicionamos `JSON.stringify()` para o resultado e o esperado, ao invés de `assert.deepStrictEqual(result, expected)`, como a seguir:

```javascript
// todoService.test.js
assert.deepStrictEqual(JSON.stringify(result), JSON.stringify(expected))
```

Outras alternativas seriam instalar o sinon.js ou o chai.

### mock context

### sinon sandbox

Sinon é uma biblioteca de testes dedicado em spies, stubs e mocks que contém **Fake Timers**, essencial para trabalharmos com datas em node. TODO

### test coverage com node

O comando `node --experimental-test-coverage --test` faz o test coverage do projeto. Porém, é recomendado instalar pacotes de terceiros por ser uma funcionalidade experimental do node, como o `c8@8.0.1`.

## Fontes

- [Como Fazer Testes unitários em serviços - Bancos de Dados, Web APIs e mais || Erick Wendel](https://www.youtube.com/watch?v=iDaBo7ge604)
- [Node.js v21.5.0 documentation - Mocking](https://nodejs.org/api/test.html#mocking)
- [Node.js v21.5.0 documentation - Coverage reporters](https://nodejs.org/api/test.html#coverage-reporters)
- [Fake timers - Sinon.JS](https://sinonjs.org/releases/v17/fake-timers/)
- [Sandboxes - Sinon.JS](https://sinonjs.org/releases/v17/sandbox/)