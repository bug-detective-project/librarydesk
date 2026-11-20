# Code review: LD-202, o empréstimo mais antigo não é o que importa

O balcão tinha a regra certa e fez a pergunta errada ao banco. Aqui está a abordagem de referência, para você comparar com a sua.

## Por que o bug aconteceu

- "Este exemplar está emprestado?" virou "pegue um empréstimo deste exemplar e veja se voltou".
- `order: [['id', 'ASC']]` com `findOne` pega o **primeiro** empréstimo que o exemplar já teve. A variável até se chama `last`, que é o que o autor quis e não o que a consulta faz.
- Um exemplar emprestado pela primeira vez tem um empréstimo só, então o primeiro e o último são o mesmo e todo teste rápido passa. O bug só aparece quando o exemplar tem histórico.

## Por que o conserto de referência está certo

- `where: { copyId, returnedAt: null }` é a própria regra: um exemplar está emprestado quando um dos seus empréstimos não voltou.
- Não depende da ordem das linhas, de ids nem de datas, então continua certo por mais que o histórico cresça.
- A página do livro e a contagem de exemplares disponíveis usam a mesma ideia (um exemplar está fora quando tem empréstimo aberto), então o balcão agora concorda com o que mostra.

## Compare com o seu conserto

- Você trocou `'ASC'` por `'DESC'`? Funciona hoje: o empréstimo mais novo é o que pode estar aberto. Ainda é uma pergunta indireta, e quebra no dia em que existirem dois empréstimos abertos do mesmo exemplar, que é exatamente o que este bug criou nos dados.
- Você usou `Loan.count` com `returnedAt: null`? Mesma regra, mesmo resultado; está ótimo.
- Você pensou nos dois computadores mandando a requisição no mesmo segundo? As duas checagens podem passar antes de qualquer empréstimo ser gravado. Isso pede uma transação com trava, ou um índice único nos empréstimos abertos de um exemplar; é um passo além deste ticket, e vale conhecer.
