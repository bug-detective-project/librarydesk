# Code review: LD-201, um dia não é um momento

A regra era simples, "atrasado a partir do dia seguinte ao prazo", e o código respondia outra pergunta: quantos blocos de 24 horas passaram desde a meia-noite em Londres. Aqui está a abordagem de referência, para você comparar com a sua.

## Por que o bug aconteceu

- Um prazo é um **dia** (`DATEONLY` na tabela, `'2026-03-09'` na API). Uma devolução é um **momento** (`returnedAt`, um `DATETIME`).
- Para compará-los, o código transformou o dia num momento com `new Date(dueOn)`. Um texto só com a data é lido como UTC, então o momento é a meia-noite em UTC, 20h do dia anterior em Nova York.
- O `Math.ceil` depois transformou qualquer fração de dia num dia inteiro. Os dois erros juntos somam exatamente um dia a toda multa.

## Por que o conserto de referência está certo

- Compara coisas iguais: o dia da devolução, no fuso da escola, com o dia do prazo.
- O `libraryDate` usa a base de fusos horários (`America/New_York`), então o horário de verão é tratado; nenhum deslocamento é escrito à mão.
- O `daysBetween` trabalha com datas à meia-noite UTC dos dois lados, então não sobra arredondamento para errar.
- A multa de um empréstimo em aberto usa o mesmo `lateDays`, então a lista de empréstimos e o recibo sempre concordam.

## Compare com o seu conserto

- Você trocou `Math.ceil` por `Math.floor`? O último dia fica certo para devoluções de dia, mas uma devolução às 21h no último dia ainda conta como atraso no verão, e os dias de atraso são contados a partir da meia-noite errada.
- Você acrescentou `T23:59:59` ao prazo? Sem fuso, isso é lido como horário **local**, então o resultado depende do computador que roda a API; e o distrito roda em UTC.
- Você subtraiu quatro horas? Nova York fica cinco horas atrás de UTC no inverno.
- Você usou `toISOString().slice(0, 10)` para o dia da devolução? Esse é o dia em UTC: uma devolução à noite em Nova York cai no dia seguinte.
