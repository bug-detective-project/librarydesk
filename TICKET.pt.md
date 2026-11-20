# LD-205: A lista de atrasados inclui livros já devolvidos

| Campo | Valor |
| --- | --- |
| Projeto | LibraryDesk (LD) |
| Tipo de item | Bug |
| Status | A fazer |
| Prioridade | Alta |
| Relator | Rachel Owens (Bibliotecária da escola) |
| Trilha | Back-end |
| Versão afetada | 1.0 |
| Componente | API (empréstimos) |
| Rótulos | `api`, `empréstimos`, `consulta` |
| Sprint | LD Sprint 1 |
| Criado em | 02/03/2026 15:30 |

## Descrição

Toda sexta eu imprimo a aba **Overdue** e levo os avisos às salas. Na sexta passada mandei aviso para o Noah por **Hatchet**, e a professora devolveu com um bilhete: ele devolveu na quarta. A Ava também, com **The Outsiders**, semanas atrás.

A aba Overdue está misturando os livros que ainda estão fora com livros que voltaram atrasados. Essas linhas até dizem **Returned** na coluna Status, e ainda têm botão **Return**. O contador vermelho ao lado de **Loans** no menu conta essas também.

## Passos para reproduzir

1. Abra **Loans** e clique em **Overdue**.
2. Olhe o contador ao lado de **Loans** no menu.

Ou, no terminal do VS Code, com o app rodando:

```sh
curl 'http://localhost:3001/api/loans?status=overdue'
```

## Resultado esperado

Só **Number the Stars** (Liam Carter) e **Of Mice and Men** (David Kim): os exemplares ainda fora depois do prazo. O contador diz **2**.

## Resultado atual

Esses dois, mais todo empréstimo que voltou (Hatchet, Charlotte's Web, The Outsiders, The Grapes of Wrath, The Giver), marcados como **Returned**. O contador diz mais que 2.

## Critérios de aceite

- [ ] A lista de atrasados tem só exemplares que não voltaram e cujo prazo já passou.
- [ ] Um exemplar devolvido pela aba Overdue sai da lista.
- [ ] A lista de todos os exemplares fora (**On loan**) não muda.

## Ambiente

- LibraryDesk 1.0
- Qualquer navegador; também com curl

## Atividade

**Daniel Price** · 02/03/2026 15:52
> Overdue deveria ser uma parte de "On loan". Hoje a aba Overdue tem linhas que a aba On loan não tem.
