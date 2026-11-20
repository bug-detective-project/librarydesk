# LD-103: Enter no campo de autor envia o formulário de cadastro

| Campo | Valor |
| --- | --- |
| Projeto | LibraryDesk (LD) |
| Tipo de item | Bug |
| Status | A fazer |
| Prioridade | Média |
| Relator | Daniel Price (Auxiliar da biblioteca) |
| Trilha | Front-end |
| Versão afetada | 1.0 |
| Componente | Formulário de novo livro |
| Rótulos | `cliente`, `formulário`, `teclado` |
| Sprint | LD Sprint 1 |
| Criado em | 06/03/2026 10:20 |

## Descrição

Quando cadastro um livro, digito as primeiras letras do autor, chego ao nome com as setas e aperto **Enter**, como em toda caixa de busca. O nome vai para o campo e, no mesmo instante, o formulário inteiro é enviado: aparecem mensagens vermelhas embaixo de **ISBN** e **Year**, que eu ainda não tinha preenchido.

Se eu já tinha preenchido o resto, o livro é cadastrado com o que estiver lá, antes de eu conferir. Cadastrei **East of Eden** duas vezes ontem por causa disso.

O mesmo acontece quando digito o nome de um autor novo e aperto Enter para ficar com ele.

## Passos para reproduzir

1. Abra **New book**.
2. Em **Author**, digite `Stein`, aperte **↓** para destacar **John Steinbeck** e aperte **Enter**.

## Resultado esperado

**John Steinbeck** fica no campo Author, a lista fecha, e mais nada acontece: o formulário só é enviado pelo **Add book**.

## Resultado atual

O autor é escolhido e o formulário é enviado: aparecem mensagens embaixo dos campos vazios (ou o livro é cadastrado, se eles estavam preenchidos).

## Critérios de aceite

- [ ] Enter no campo Author escolhe o autor destacado e não envia o formulário.
- [ ] Enter num nome que não está na lista fica com ele como autor novo e não envia o formulário.
- [ ] O **Add book** continua enviando o formulário; Enter nos outros campos continua funcionando como sempre.

## Ambiente

- LibraryDesk 1.0
- Qualquer navegador

## Atividade

**Rachel Owens** · 06/03/2026 10:41
> As setas e o Escape nesse campo funcionam perfeitamente. É só o Enter.
