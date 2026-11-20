# LD-207: Leitor inexistente derruba o servidor

| Campo | Valor |
| --- | --- |
| Projeto | LibraryDesk (LD) |
| Tipo de item | Bug |
| Status | A fazer |
| Prioridade | Alta |
| Relator | Marcus Lee (Técnico de TI do distrito) |
| Trilha | Back-end |
| Versão afetada | 1.0 |
| Componente | API (leitores) |
| Rótulos | `api`, `erros`, `queda` |
| Sprint | LD Sprint 1 |
| Criado em | 06/03/2026 16:45 |

## Descrição

Duas vezes nesta semana o balcão parou no meio da tarde: toda página travada em "Loading…", para todo mundo, até eu reiniciar a API.

Achei o gatilho. A Rachel guarda um favorito da página de um aluno que mudou de escola; esse leitor foi removido. Quando ela abre o favorito, a página fica em "Loading the reader…" e o processo da API **termina**. O log diz:

```
Error: There is no such reader
    at loadReader (server/src/library.ts)
Node.js v26.12.1
```

e o processo some. Toda requisição depois disso falha até alguém subir a API de novo.

Um livro desconhecido não faz isso: `/api/books/99999` responde 404 e a API continua.

## Passos para reproduzir

No terminal do VS Code, com o app rodando:

```sh
curl -i http://localhost:3001/api/readers/99999
curl -i http://localhost:3001/api/readers/1
```

Ou abra `http://localhost:5173/readers/99999`.

## Resultado esperado

- A primeira requisição responde **404** com `{"error": "There is no such reader"}`.
- A segunda responde **200** com a Emma Johnson.
- A página diz "There is no such reader".

## Resultado atual

A primeira requisição nunca responde, o processo da API termina, e a segunda não consegue conectar.

## Critérios de aceite

- [ ] Um leitor desconhecido responde 404 em JSON, e a API continua respondendo.
- [ ] Um id que não é número continua respondendo 400.
- [ ] Um leitor que existe continua sendo respondido como antes.

## Ambiente

- LibraryDesk 1.0
- Node.js 26

## Atividade

**Rachel Owens** · 06/03/2026 17:02
> Desculpa! Eu não sabia que um favorito podia fazer isso. Aconteceu logo depois que abri, nas duas vezes.
