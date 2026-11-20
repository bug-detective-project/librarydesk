# LD-204: ISBN com traços é recusado

| Campo | Valor |
| --- | --- |
| Projeto | LibraryDesk (LD) |
| Tipo de item | Bug |
| Status | A fazer |
| Prioridade | Média |
| Relator | Daniel Price (Auxiliar da biblioteca) |
| Trilha | Back-end |
| Versão afetada | 1.0 |
| Componente | API (livros) |
| Rótulos | `api`, `validação`, `isbn` |
| Sprint | LD Sprint 1 |
| Criado em | 06/03/2026 11:15 |

## Descrição

A associação de pais doou uma caixa de livros e passei a tarde cadastrando. Não consegui cadastrar nenhum.

Preencho o formulário **New book**, digito o ISBN do verso do livro, e o formulário responde "Type the 13 digits of the ISBN, with or without dashes" embaixo do ISBN. O próprio formulário põe os traços enquanto eu digito (978-0-0000-0000-0), então todo ISBN que digito tem traços. A mensagem diz que traços podem.

O Marcus cadastrou um para mim com `curl`, digitando só os dígitos, e esse entrou. Então os ISBNs estão certos; são os traços.

## Passos para reproduzir

Abra **New book** e cadastre **Little Women**, de Louisa May Alcott, 1868, ISBN `9780306406157` (o formulário mostra `978-0-3064-0615-7`). Ou, no terminal do VS Code, com o app rodando:

```sh
curl -X POST http://localhost:3001/api/books -H 'Content-Type: application/json' \
  -d '{"title": "Little Women", "authorName": "Louisa May Alcott", "isbn": "978-0-306-40615-7", "year": 1868, "copies": 1}'
```

## Resultado esperado

**201**: o livro é cadastrado, com o ISBN guardado como 13 dígitos e mostrado como `978-0-3064-0615-7`.

## Resultado atual

**400**, `{"fields": {"isbn": "Type the 13 digits of the ISBN, with or without dashes"}}`.

## Critérios de aceite

- [ ] Um ISBN digitado com traços, ou com espaços, entre os grupos é aceito.
- [ ] Um ISBN com dígito verificador errado continua recusado, com a mesma mensagem.
- [ ] O livro guarda os 13 dígitos, seja o que for que foi digitado.

## Ambiente

- LibraryDesk 1.0
- Qualquer navegador; também com curl

## Atividade

**Marcus Lee** · 06/03/2026 11:40
> `9780306406157` entra, `978-0-306-40615-7` não. Mesmo livro, mesmo número.
