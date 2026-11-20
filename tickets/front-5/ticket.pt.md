# LD-105: A página do leitor mostra os empréstimos do leitor anterior

| Campo | Valor |
| --- | --- |
| Projeto | LibraryDesk (LD) |
| Tipo de item | Bug |
| Status | A fazer |
| Prioridade | Alta |
| Relator | Rachel Owens (Bibliotecária da escola) |
| Trilha | Front-end |
| Versão afetada | 1.0 |
| Componente | Página do leitor |
| Rótulos | `cliente`, `rotas`, `carregamento` |
| Sprint | LD Sprint 1 |
| Criado em | 05/03/2026 12:15 |

## Descrição

No fim do dia eu passo por uma turma: abro um aluno e uso o **Also in Grade 7**, à direita, para ir ao próximo. O nome no alto muda, o número da carteirinha muda, e a tabela **On loan** continua mostrando os livros do **primeiro** aluno. Quase cobrei do Liam o livro da Emma.

Se eu recarrego a página, a tabela fica certa. Se volto em **Readers** e clico no aluno lá, também fica certa. Só acontece quando vou de um leitor direto para outro.

## Passos para reproduzir

1. Abra **Readers** e depois **Emma Johnson**: On loan tem **To Kill a Mockingbird**.
2. Em **Also in Grade 7**, clique em **Liam Carter**.

## Resultado esperado

A página do Liam Carter, com **Number the Stars** em On loan.

## Resultado atual

O nome do Liam Carter, e **To Kill a Mockingbird** (o livro da Emma) em On loan. O histórico também é da Emma.

## Critérios de aceite

- [ ] Ir de um leitor para outro mostra os empréstimos e o histórico do leitor da página.
- [ ] Um colega sem livro fora mostra "No book out right now.", não os livros do leitor anterior.
- [ ] Abrir um leitor pela lista, ou recarregar, continua funcionando.

## Ambiente

- LibraryDesk 1.0
- Qualquer navegador

## Atividade

**Marcus Lee** · 05/03/2026 12:40
> Na aba de rede do navegador, ir da Emma para o Liam pede `/api/readers/2` mas nunca pede `/api/readers/2/loans`.
