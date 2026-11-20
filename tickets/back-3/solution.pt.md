# Solução: Busque também o nome do autor

**Causa raiz.** O `findBooks` em `server/src/library.ts` monta `where: { title: { [Op.like]: '%steinbeck%' } }`. O nome do autor nunca é comparado, então só os livros com o nome no título são encontrados.

## Passo a passo

1. **Reproduza.** `curl 'http://localhost:3001/api/books?q=lowry'` responde `[]`.
2. **Leia a consulta.** O `where` do `findBooks` tem uma condição só, em `title`.
3. **Ache de onde vem o autor.** O `bookIncludes` junta o `Author` como `author`, então as colunas dele são alcançáveis do `where` principal como `'$author.name$'`.
4. **Compare o texto com qualquer um dos dois:**

   ```ts
   const where = text
     ? { [Op.or]: [{ title: { [Op.like]: likeText(text) } }, { '$author.name$': { [Op.like]: likeText(text) } }] }
     : {};
   ```

   O `likeText` mantém literal um `%` ou `_` digitado na busca. A collation padrão do MySQL não diferencia maiúsculas, então `LOWRY` e `lowry` dão a mesma resposta.

A referência também adiciona um teste de regressão, `server/src/books-search-author.test.ts`: os livros de Steinbeck, Lowry e Harper Lee achados por um pedaço do nome do autor, e um título que continua sendo achado.

Depois rode `npm test`, busque `Steinbeck` no acervo e mova o cartão para **In QA**.
