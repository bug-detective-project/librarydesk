# Code review: LD-203, a outra metade de "Title or author"

O campo de busca prometia dois campos e a consulta comparava um. Aqui está a abordagem de referência, para você comparar com a sua.

## Por que o bug aconteceu

- O autor não é uma coluna de `books`; ele fica em `authors`, e a consulta chega a ele pelo `include` que já o traz para os cartões.
- O `where` foi escrito só para o título. Um livro cujo título por acaso tem o nome do autor ("Reading Steinbeck") fazia a busca parecer meio certa.

## Por que o conserto de referência está certo

- `'$author.name$'` deixa o `where` principal comparar uma coluna da tabela juntada, então o banco faz a busca inteira numa instrução só.
- `Op.or` mantém a busca por título como estava: qualquer um dos dois basta.
- Um livro tem exatamente um autor, então a junção não pode listar um livro duas vezes.
- O `likeText` já escapava `%` e `_`; a condição nova usa ele também.

## Compare com o seu conserto

- Você colocou a condição dentro do `include` (`include: [{ model: Author, where: … }]`)? Isso torna o include obrigatório: só sobram livros cujo **autor** bate, e a busca por título some.
- Você carregou todos os livros e filtrou em JavaScript? Funciona com 15 livros; o banco existe para fazer isso com 15.000.
- Você acrescentou `LOWER(...)` dos dois lados? Não é preciso com a collation padrão do MySQL, e impede o banco de usar um índice na coluna.
