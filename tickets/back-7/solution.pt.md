# Solução: Deixe o Express ver a rejeição

**Causa raiz.** A rota `GET /readers/:id` em `server/src/routes/readers.ts` dispara `findReader(...)` e só anexa um `.then`. Quando o leitor não existe, o `findReader` rejeita com um `NotFoundError`; a rota não devolveu essa promessa e não é `async`, então o Express nunca a vê. O Node trata uma rejeição sem tratamento como erro fatal e encerra o processo.

## Passo a passo

1. **Reproduza.** `curl -i http://localhost:3001/api/readers/99999` nunca responde, e o terminal da API mostra o erro e para.
2. **Compare com um livro.** `/api/books/99999` lança o mesmo tipo de erro e responde 404: a rota dele é `async` e faz `await` na chamada.
3. **Escreva a rota do mesmo jeito:**

   ```ts
   router.get('/readers/:id', async (req, res) => {
     res.json(await findReader(req.params.id));
   });
   ```

O Express 5 passa o que uma rota async lança para o tratador de erros do `app.ts`, que responde um `NotFoundError` com 404 e a mensagem dele.

A referência também adiciona um teste de regressão, `server/src/readers-unknown.test.ts`: um leitor desconhecido responde 404 em JSON, e a API continua respondendo um leitor conhecido e um id ruim depois.

Depois rode `npm test`, repita os dois `curl` e mova o cartão para **In QA**.
