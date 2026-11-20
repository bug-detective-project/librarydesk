# LD-108: Reservar funciona para livro disponível e não para emprestado

| Campo | Valor |
| --- | --- |
| Projeto | LibraryDesk (LD) |
| Tipo de item | História |
| Status | A fazer |
| Prioridade | Alta |
| Relator | Rachel Owens (Bibliotecária da escola) |
| Trilha | Front-end |
| Versão afetada | 1.0 |
| Componente | Página do livro |
| Rótulos | `cliente`, `formulário`, `reservas` |
| Sprint | LD Sprint 1 |
| Criado em | 03/03/2026 11:30 |

## Descrição

O formulário **Reserve** da página de um livro ficou pela metade. Ele só aparece quando há um exemplar na estante, e aí separa esse exemplar, o que é útil. Mas o motivo de termos pedido reservas é o caso contrário: um aluno quer um livro cujos exemplares estão todos fora, e quer ser o próximo da fila.

Em **A Wrinkle in Time**, que está com a Sophia e que a Emma espera, não há formulário nenhum. A página até diz "Every copy is out. Reserve the book to join the queue." e não oferece jeito de fazer isso. O código tem um `TODO (LD-108)` onde a fila deveria entrar.

A API já faz as duas coisas: separa um exemplar quando há um na estante, e põe o leitor na fila quando não há, respondendo o lugar dele.

## O que já existe

- `POST /api/books/:id/reservations` com `{ "readerId": … }` responde `{ "id", "position", "ready" }`: `ready` é `true` quando um exemplar foi separado, e `position` é o lugar do leitor na fila.
- O `client/src/components/ReserveForm.tsx` manda a requisição e mostra um toast.
- O cartão **Reservations** da `client/src/pages/BookPage.tsx` mostra a fila.

## O que falta

- O formulário precisa estar em **todo** livro, com ou sem exemplar na estante.
- Quando `ready` é `false`, o toast diz o lugar na fila: **"*leitor* is number *posição* in the queue for *título*"**, por exemplo "Liam Carter is number 2 in the queue for A Wrinkle in Time".
- Quando `ready` é `true`, o toast fica como está: "A copy of *título* is put aside for *leitor*".
- Depois de reservar, a fila da página mostra o leitor.

## Critérios de aceite

- [ ] Um livro com todos os exemplares fora pode ser reservado pela página dele.
- [ ] O toast diz o lugar do leitor na fila.
- [ ] A fila mostra o leitor novo no fim.
- [ ] Um livro com exemplar na estante continua separando um, com a mensagem dele.

## Ambiente

- LibraryDesk 1.0
- Qualquer navegador

## Atividade

**Daniel Price** · 03/03/2026 11:52
> Fahrenheit 451 também é bom para testar: o único exemplar está fora e ninguém espera ainda, então o primeiro leitor é o número 1.
