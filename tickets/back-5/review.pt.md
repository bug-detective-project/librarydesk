# Code review: LD-205, um filtro que esqueceu o que filtra

Atrasado é uma condição mais forte que emprestado, e o código escreveu como se fosse outra. Aqui está a abordagem de referência, para você comparar com a sua.

## Por que o bug aconteceu

- Os dois filtros foram escritos lado a lado, e o de atrasados ficou só com a condição que o torna especial (a data) e perdeu a que ele divide com emprestado (não devolvido).
- Um empréstimo devolvido guarda o prazo para o histórico, então a data sozinha pega todo empréstimo que já voltou depois do tempo, e a maioria dos que voltaram em dia também.

## Por que o conserto de referência está certo

- Atrasado = emprestado E prazo vencido. O código agora diz exatamente isso.
- O banco faz o filtro, então o contador do menu, que lê o mesmo endpoint, concorda com a aba.
- Nada muda para `active`.

## Compare com o seu conserto

- Você filtrou `status === 'overdue'` no cliente? A aba parece certa, mas a API e o contador continuam respondendo a lista errada, e a próxima tela que ler o endpoint herda o problema.
- Você conferiu o `returnedAt` no `loanView` e descartou os devolvidos ali? Isso carrega o histórico inteiro para jogar a maior parte fora.
- Você escreveu `{ [Op.and]: [...] }`? É o mesmo AND, escrito mais longo; está ótimo.
