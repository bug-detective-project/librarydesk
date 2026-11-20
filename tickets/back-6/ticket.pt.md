# LD-206: Construir o endpoint de renovação de empréstimo

| Campo | Valor |
| --- | --- |
| Projeto | LibraryDesk (LD) |
| Tipo de item | História |
| Status | A fazer |
| Prioridade | Alta |
| Relator | Rachel Owens (Bibliotecária da escola) |
| Trilha | Back-end |
| Versão afetada | 1.0 |
| Componente | API (empréstimos) |
| Rótulos | `api`, `empréstimos`, `endpoint` |
| Sprint | LD Sprint 1 |
| Criado em | 02/03/2026 09:00 |

## Descrição

O botão **Renew** está em todo empréstimo, na lista de empréstimos e na página de cada leitor, e hoje ele só responde "Not found". A tela foi terminada na sprint passada; a API nunca ganhou a parte dela. Os alunos pedem para renovar todo dia, e estou anotando prazos novos no papel.

Por favor, construa o endpoint que o botão chama.

## O que já existe

- O cliente chama `POST /api/loans/:id/renew` (`client/src/api/loans.ts`) e mostra, num toast, ou "*título* is renewed until *data*" ou o `error` da resposta.
- O `server/src/fines.ts` tem `LOAN_DAYS` (14) e `MAX_RENEWALS` (2); o `server/src/clock.ts` tem `today()` e `addDays`.
- O `server/src/library.ts` tem as outras ações de um empréstimo (`lend`, `returnLoan`) e o `loanView`, o formato que todo endpoint de empréstimo responde.

## As regras de uma renovação

| Caso | Resposta |
| --- | --- |
| O empréstimo não existe | **404**, `{"error": "There is no such loan"}` |
| O id não é um número inteiro | **400** |
| O exemplar já voltou | **409**, `{"error": "This copy is already back"}` |
| O empréstimo está atrasado (o prazo é antes de hoje) | **409**, `{"error": "The loan is overdue: return the copy first"}` |
| O empréstimo já foi renovado duas vezes | **409**, `{"error": "A loan is renewed at most 2 times"}` |
| Um leitor espera o livro (uma reserva em aberto) | **409**, `{"error": "Another reader is waiting for this book"}` |
| Nos outros casos | **200**, o empréstimo (como `loanView`), com prazo **14 dias a partir de hoje** e `renewals` um a mais |

Renovar no próprio dia do prazo pode: o empréstimo ainda não está atrasado.

## Como conferir

Na biblioteca de exemplo, **Emma Johnson** está com **To Kill a Mockingbird** (empréstimo 1). No terminal do VS Code, com o app rodando:

```sh
curl -X POST http://localhost:3001/api/loans/1/renew
```

Ou clique em **Renew** em **To Kill a Mockingbird** na tela **Loans**.

## Critérios de aceite

- [ ] `POST /api/loans/:id/renew` responde cada caso da tabela.
- [ ] Uma renovação põe o prazo em 14 dias a partir de hoje e soma um a `renewals`.
- [ ] Uma renovação recusada não muda nada.
- [ ] O botão **Renew** mostra o prazo novo, e o motivo quando é recusada.

## Ambiente

- LibraryDesk 1.0

## Atividade

**Daniel Price** · 02/03/2026 09:20
> O **Wonder** do Ethan já foi renovado duas vezes, o **Number the Stars** do Liam está atrasado e a Emma espera **A Wrinkle in Time**. Bons casos para testar.
