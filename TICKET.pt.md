# LD-203: Buscar "Steinbeck" acha pelo título, e não pelo autor

| Campo | Valor |
| --- | --- |
| Projeto | LibraryDesk (LD) |
| Tipo de item | Bug |
| Status | A fazer |
| Prioridade | Média |
| Relator | Rachel Owens (Bibliotecária da escola) |
| Trilha | Back-end |
| Versão afetada | 1.0 |
| Componente | API (busca) |
| Rótulos | `api`, `busca`, `sequelize` |
| Sprint | LD Sprint 1 |
| Criado em | 04/03/2026 10:05 |

## Descrição

O oitavo ano lê Steinbeck neste semestre, e a primeira coisa que todo aluno faz no balcão é pedir "um Steinbeck". Então eu digito **Steinbeck** na busca do acervo.

O único livro que aparece é **Reading Steinbeck**, o guia da Dana Whitfield, porque o nome está no título. **Of Mice and Men** e **The Grapes of Wrath**, os livros que eles querem de verdade, não aparecem. Digitar "Lowry" não acha nada, e temos dois dela.

O campo de busca diz "Title or author". Hoje ele é só "Title".

## Passos para reproduzir

Digite `Steinbeck` em **Search the collection**. Ou, no terminal do VS Code, com o app rodando:

```sh
curl 'http://localhost:3001/api/books?q=steinbeck'
curl 'http://localhost:3001/api/books?q=lowry'
```

## Resultado esperado

- `q=steinbeck` responde **Of Mice and Men**, **The Grapes of Wrath** e **Reading Steinbeck**.
- `q=lowry` responde **The Giver** e **Number the Stars**.

## Resultado atual

- `q=steinbeck` responde só **Reading Steinbeck**.
- `q=lowry` responde `[]`.

## Critérios de aceite

- [ ] Uma busca acha os livros cujo nome do autor contém o texto, sem diferenciar maiúsculas.
- [ ] Uma busca continua achando livros por um pedaço do título.
- [ ] Um livro em que título e autor batem aparece uma vez só.

## Ambiente

- LibraryDesk 1.0
- Qualquer navegador; também com curl

## Atividade

**Marcus Lee** · 04/03/2026 10:40
> Os autores ficam numa tabela própria (`authors`), e cada livro aponta para um. A lista de livros já traz o autor junto, ele aparece em todo cartão.
