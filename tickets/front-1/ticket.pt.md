# LD-101: O contador de livros disponíveis não muda depois do empréstimo

| Campo | Valor |
| --- | --- |
| Projeto | LibraryDesk (LD) |
| Tipo de item | Bug |
| Status | A fazer |
| Prioridade | Média |
| Relator | Daniel Price (Auxiliar da biblioteca) |
| Trilha | Front-end |
| Versão afetada | 1.0 |
| Componente | Página do livro |
| Rótulos | `cliente`, `estado`, `empréstimos` |
| Sprint | LD Sprint 1 |
| Criado em | 04/03/2026 13:25 |

## Descrição

Na página de um livro, embaixo do título, aparece quantos exemplares estão na estante: "2 of 3 copies available". Quando empresto um exemplar em **Lend a copy**, a lista de exemplares se atualiza na hora (o exemplar mostra com quem está), as barrinhas mudam de cor, e o toast diz "Copy B001-2 lent to…". O número não muda: fica em "2 of 3".

Um aluno pediu o último exemplar no balcão e eu disse que ainda havia um, porque a página dizia isso. Não havia. O número só fica certo depois que recarrego a página.

## Passos para reproduzir

1. Abra **To Kill a Mockingbird** pelo acervo: "2 of 3 copies available".
2. Em **Lend a copy**, escolha **Ava Thompson** e clique em **Lend**.

## Resultado esperado

"1 of 3 copies available", assim que o exemplar é emprestado.

## Resultado atual

"2 of 3 copies available", até a página ser recarregada.

## Critérios de aceite

- [ ] O contador de exemplares disponíveis acompanha os exemplares depois de todo empréstimo, sem recarregar.
- [ ] Emprestar o último exemplar mostra "0 of N copies available".
- [ ] O contador está certo quando a página abre.

## Ambiente

- LibraryDesk 1.0
- Qualquer navegador

## Atividade

**Rachel Owens** · 04/03/2026 13:40
> As barrinhas ao lado do número estão certas, conferi. É só o número.
