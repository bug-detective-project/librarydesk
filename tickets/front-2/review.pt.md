# Code review: LD-102, um tipo que mentia

O TypeScript só consegue conferir o código contra o que os tipos dizem, e o tipo de `fine` descrevia o desejo, não o que chega pela rede. Aqui está a abordagem de referência, para você comparar com a sua.

## Por que o bug aconteceu

- O MySQL guarda dinheiro como `DECIMAL(8,2)`. O driver `mysql2` devolve um `DECIMAL` como string, de propósito: um número do JavaScript não guarda todo decimal com exatidão. A API repassa como está.
- O tipo `Loan` do cliente dizia `number`. Nada confere o JSON de um `fetch` contra um tipo, então a mentira nunca foi pega.
- Com o tipo errado, `total + loan.fine` foi aceito, e `+` com string concatena. Uma multa escondia o problema, porque `Number("00.75")` ainda é 0.75.

## Por que o conserto de referência está certo

- O tipo agora diz o que a API manda, então o compilador volta a ajudar: qualquer `+ loan.fine` novo é erro de tipo.
- O `Number()` acontece num lugar só, onde os valores são somados.
- A API continua mandando texto, então nenhum centavo é arredondado no caminho.

## Compare com o seu conserto

- Você mudou só o `finesDue` e deixou `fine: number`? A página funciona, e a próxima pessoa que somar multas cai na mesma armadilha.
- Você converteu na API (`Number(loan.fine)` no `loanView`)? Também funciona, com uma decisão a tomar: dinheiro como float pela rede. Para centavos costuma dar certo; é uma escolha, não um conserto do cliente.
- Você usou `parseFloat`? Mesmo resultado para estas strings; o `Number` recusa números parciais como `"1.00abc"` em vez de ler `1`.
