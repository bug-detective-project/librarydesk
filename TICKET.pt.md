# LD-104: Ordenar por título põe "The Giver" no T, e não no G

| Campo | Valor |
| --- | --- |
| Projeto | LibraryDesk (LD) |
| Tipo de item | Bug |
| Status | A fazer |
| Prioridade | Baixa |
| Relator | Rachel Owens (Bibliotecária da escola) |
| Trilha | Front-end |
| Versão afetada | 1.0 |
| Componente | Acervo |
| Rótulos | `cliente`, `ordenação`, `catálogo` |
| Sprint | LD Sprint 1 |
| Criado em | 03/03/2026 08:50 |

## Descrição

O acervo ordenado por **Title** junta todos os livros "The …" perto do fim, no T: **The Giver**, **The Grapes of Wrath**, **The Great Gatsby**, **The Outsiders**. E **A Wrinkle in Time** vem antes de todos, no A.

Não é assim que uma biblioteca arquiva títulos. Todo catálogo, e as nossas estantes, ignoram um "The", "A" ou "An" no começo: **The Giver** vai no G, entre **Fahrenheit 451** e **Hatchet**, e **A Wrinkle in Time** no W, no fim. Os alunos procuram os livros do jeito que as estantes estão etiquetadas, e não acham na tela.

## Passos para reproduzir

Abra o acervo (ele abre ordenado por **Title**).

## Resultado esperado

Bridge to Terabithia, Charlotte's Web, Fahrenheit 451, **The Giver**, **The Grapes of Wrath**, **The Great Gatsby**, Hatchet, Holes, Number the Stars, Of Mice and Men, **The Outsiders**, Reading Steinbeck, To Kill a Mockingbird, Wonder, **A Wrinkle in Time**: cada título arquivado pela palavra depois do artigo.

## Resultado atual

**A Wrinkle in Time** primeiro, e os quatro títulos "The" juntos no T.

## Critérios de aceite

- [ ] Ordenar por título ignora um "The", "A" ou "An" no começo.
- [ ] Palavras que só começam parecido com um artigo ("Theo", "Anatomy") são arquivadas como são.
- [ ] O título continua aparecendo inteiro no cartão; só a ordem muda.
- [ ] Ordenar por autor e por mais novos não muda.

## Ambiente

- LibraryDesk 1.0
- Qualquer navegador

## Atividade

**Daniel Price** · 03/03/2026 09:12
> A letrinha nas capas já faz certo: The Giver tem um "G". Então a regra está no código em algum lugar.
