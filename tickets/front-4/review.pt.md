# Code review: LD-104, a regra estava lá, uma linha pulou

Ordenar é fácil; saber **o que** comparar é a parte que pertence ao domínio. Aqui está a abordagem de referência, para você comparar com a sua.

## Por que o bug aconteceu

- Uma biblioteca arquiva um título sem o artigo do começo. O `filingTitle` codifica essa regra, e as capas, a ordem por autor e a ordem por mais novos usam ele.
- A ordem por título, a padrão, comparava os títulos crus. Então o único lugar onde a regra mais importa era o único que a pulava.

## Por que o conserto de referência está certo

- A comparação usa o mesmo `filingTitle` do resto do app, então a ordem na tela e a letra na capa concordam.
- O cartão continua mostrando o título inteiro: só muda a chave da comparação.
- O `Intl.Collator` fica: ele compara letras como as pessoas esperam (maiúsculas, acentos), o que um `<` simples não faz.
- A expressão regular quer espaço depois do artigo, então "Theo" e "Anatomy" não são cortados.

## Compare com o seu conserto

- Você escreveu uma regex nova no `sortBooks`? Funciona; agora há duas cópias da regra para manter iguais.
- Você tirou só o "The"? "A Wrinkle in Time" continua em primeiro.
- Você usou `startsWith('The')`? "Theo and the Tide" seria arquivado como "o and the Tide".
- Você mudou os títulos no banco para "Giver, The"? Era assim nos fichários antigos; o app mostra os títulos como impressos e os ordena pela regra.
