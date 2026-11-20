# Code review: LD-107, uma tabela que só conhecia uma largura

Uma tabela de seis colunas não cabe num celular; o desenho tinha previsto cartões e o CSS nunca os construiu. Aqui está a abordagem de referência, para você comparar com a sua.

## Por que o bug aconteceu

- O `white-space: nowrap` em toda célula fazia cada coluna ficar da largura do seu texto mais longo.
- Nada mudava em espaços estreitos, então a tabela definia a largura da página e a página rolava para o lado.
- A marcação tinha `data-label` em toda célula para os cartões, então a parte que faltava era só CSS.

## Por que o conserto de referência está certo

- Uma container query mede o espaço que a tabela recebe, então ela vira cartões ao lado do menu de um tablet, dentro da página de um leitor e num celular, com uma regra só.
- A mesma marcação serve aos dois layouts: o `td::before` mostra o `data-label`, então um cartão lê "DUE Mar 13, 2026" sem elementos novos.
- Só os valores que não podem quebrar (uma data, um valor) mantêm o `nowrap`.
- Numa tela larga nada muda: a tabela mantém as colunas.

## Compare com o seu conserto

- Você pôs a tabela numa caixa com `overflow-x: auto`? A página para de rolar, a tabela rola no lugar, e os botões continuam fora de vista num celular. O ticket pede os botões na tela.
- Você usou `@media (max-width: 767px)`? O celular fica certo; a página do leitor e o tablet ao lado do menu, onde a tabela tem menos espaço que a janela, continuam estourando.
- Você escondeu colunas em telas pequenas? Aí o leitor ou o prazo não podem mais ser lidos, e os critérios de aceite pedem os dois.
