# Code review: LD-108, terminando o caso que importava

A metade construída era a metade fácil. Aqui está a abordagem de referência, para você comparar com a sua.

## Por que estava incompleto

- O formulário era protegido por `book.available > 0`, que o escondia exatamente quando uma reserva significa algo: quando todos os exemplares estão fora.
- A requisição já ia para uma API que conhecia os dois casos, mas o cliente jogava a resposta fora e sempre dizia "put aside".
- O próprio texto da página ("Reserve the book to join the queue") prometia a metade que faltava.

## Por que a solução de referência está certa

- O formulário está sempre lá; a API decide o que uma reserva significa para este livro, e o cliente conta à pessoa o que aconteceu.
- O `ready` e o `position` vêm do servidor, então o lugar é o de verdade, mesmo que alguém tenha reservado um segundo antes.
- Recarregar o livro depois de reservar mostra a fila que o servidor tem, em vez de um palpite somado no cliente.

## Compare com a sua solução

- Você calculou o lugar no cliente (`book.reservations.length + 1`)? Acerta quase sempre, e erra quando dois balcões reservam ao mesmo tempo; o `position` da API sempre acerta.
- Você manteve a condição `available > 0` e acrescentou um segundo formulário para a fila? Funciona com duas cópias do mesmo formulário para manter.
- Você desabilitou o botão para leitores que já estão na fila? Um bom cuidado; a API também responde 409 nesse caso, e o toast mostra a mensagem dela.
