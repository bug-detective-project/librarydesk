# LD-202: O mesmo exemplar foi emprestado a dois leitores

| Campo | Valor |
| --- | --- |
| Projeto | LibraryDesk (LD) |
| Tipo de item | Bug |
| Status | A fazer |
| Prioridade | Alta |
| Relator | Daniel Price (Auxiliar da biblioteca) |
| Trilha | Back-end |
| Versão afetada | 1.0 |
| Componente | API (empréstimos) |
| Rótulos | `api`, `empréstimos`, `regras` |
| Sprint | LD Sprint 1 |
| Criado em | 03/03/2026 14:10 |

## Descrição

Temos dois computadores no balcão. Na terça, o exemplar **B001-1** de **To Kill a Mockingbird** voltou da Emma no primeiro, e eu emprestei para o Liam na hora. Minutos depois, no segundo computador, a Rachel emprestou o **B001-1** para a Olivia; aquela página estava aberta desde antes de o Liam levar o livro. O balcão aceitou.

Agora o sistema diz que o Liam e a Olivia estão com o B001-1, e o livro é um só. A página do livro mostra só um dos dois, então demoramos a perceber.

O balcão recusa um exemplar emprestado, eu já vi isso acontecer. Só não recusou este.

## Passos para reproduzir

No terminal do VS Code, com o app rodando (o empréstimo 1 é o B001-1 da Emma; os leitores 2 e 3 são o Liam e a Olivia):

```sh
curl -X POST http://localhost:3001/api/loans/1/return
curl -X POST http://localhost:3001/api/loans -H 'Content-Type: application/json' -d '{"copyId": 1, "readerId": 2}'
curl -X POST http://localhost:3001/api/loans -H 'Content-Type: application/json' -d '{"copyId": 1, "readerId": 3}'
```

## Resultado esperado

A terceira requisição responde **409** com `{"error": "Copy B001-1 is already on loan"}`, e só o Liam fica com o B001-1.

## Resultado atual

A terceira requisição responde **201**: a Olivia também fica com o B001-1.

## Critérios de aceite

- [ ] Um exemplar emprestado é recusado para qualquer outra pessoa, também depois de ter voltado e saído de novo.
- [ ] Um exemplar na estante continua sendo emprestado.
- [ ] Um exemplar que voltou pode ser emprestado de novo.

## Ambiente

- LibraryDesk 1.0
- Qualquer navegador; também com curl

## Atividade

**Rachel Owens** · 03/03/2026 14:31
> Testei com um exemplar que nunca tinha sido emprestado, e o balcão recusou na segunda vez, como devia. São os exemplares que já saíram uma vez.
