# Code review: LD-207, uma promessa que ninguém esperou

O 404 já estava lá, lançado pelo `loadReader`. Só não tinha para onde ir. Aqui está a abordagem de referência, para você comparar com a sua.

## Por que o bug aconteceu

- O Express 5 trata os erros de rotas async por você, mas só se puder vê-los: a rota precisa ser `async` (ou devolver a promessa) para uma rejeição chegar ao tratador de erros.
- `findReader(...).then(...)` sem `return` e sem `.catch` deixa a promessa rejeitada sozinha. Desde o Node 15, uma rejeição sem tratamento encerra o processo por padrão.
- As outras rotas da API foram escritas com `async`/`await`, então só esta, e só para um leitor que não existe, podia derrubar.

## Por que o conserto de referência está certo

- Uma linha, no mesmo estilo de todas as outras rotas: `async`, `await`, `res.json`.
- O tratador de erros do `app.ts` continua sendo o único lugar que transforma erros em respostas: o 404 diz "There is no such reader", e um erro que ninguém previu continua respondendo 500 e indo para o log.
- A API continua de pé para todo mundo: um favorito ruim não para mais o balcão.

## Compare com o seu conserto

- Você acrescentou um `.catch((error) => res.status(404).json(...))`? O processo sobrevive, mas todo erro vira 404: um banco fora do ar responderia "There is no such reader".
- Você acrescentou `process.on('unhandledRejection', ...)` no `index.ts`? O processo sobrevive e a requisição nunca recebe resposta: a página fica em "Loading the reader…" para sempre.
- Você conferiu `null` no `findReader`? O `loadReader` já lança o `NotFoundError`; o problema nunca foi o leitor que falta, e sim para onde o erro ia.
