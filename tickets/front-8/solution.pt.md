# Solução: Reserve todo livro, e diga o lugar na fila

**O que faltava.** A `BookPage` só mostrava o formulário quando havia exemplar na estante (`book.available > 0`), e o `ReserveForm` ignorava a resposta da API e sempre dizia "put aside". A API já respondia `ready` e `position`.

## Passo a passo

1. **Reproduza.** **A Wrinkle in Time** não tem formulário de reserva.
2. **Mostre o formulário em todo livro** na `client/src/pages/BookPage.tsx`:

   ```tsx
   <ReserveForm book={book} readers={readers ?? []} onReserved={reload} />
   ```

3. **Use a resposta** no `client/src/components/ReserveForm.tsx`, no lugar do `TODO`:

   ```tsx
   const result = await reserveBook(book.id, reader.id);
   if (result.ready) {
     toast.success(`A copy of ${book.title} is put aside for ${reader.name}`);
   } else {
     toast.success(`${reader.name} is number ${result.position} in the queue for ${book.title}`);
   }
   ```

O `onReserved` recarrega o livro, então a fila da página mostra o leitor novo.

A referência também adiciona um teste de regressão, `client/src/reserve-queue.test.tsx`: reservar um livro com todos os exemplares fora diz o lugar e mostra o leitor na fila, e um livro com exemplar na estante continua separando um.

Depois rode `npm test`, reserve **A Wrinkle in Time** para o Liam Carter e mova o cartão para **In QA**.
