# Code review: LD-103, a ação padrão do Enter

O tratador fez o trabalho dele e depois deixou o navegador fazer o seu. Aqui está a abordagem de referência, para você comparar com a sua.

## Por que o bug aconteceu

- O envio implícito é uma regra do HTML: Enter num campo de uma linha de um formulário aciona o botão de envio do formulário.
- Um tratador de tecla roda **antes** da ação padrão. A menos que ele chame `preventDefault()`, a ação padrão acontece depois.
- Os ramos das setas impediam a ação padrão delas (mover o cursor) e o ramo do Enter não, então o campo escolhia o autor e o navegador enviava o formulário, os dois com um aperto de tecla.

## Por que o conserto de referência está certo

- `preventDefault()` só no ramo do Enter deste campo: aqui o Enter significa "escolher", e continua com o sentido de sempre no resto do formulário.
- O botão de envio e o `onSubmit` não mudam, então o formulário continua sendo enviado pelo **Add book** e pelo Enter nos outros campos.
- O comentário diz o porquê, para a próxima pessoa não tirar a linha achando que é sobra.

## Compare com o seu conserto

- Você tirou o `<form>` ou mudou o botão para `type="button"`? Aí o Enter no campo Title também para de enviar, e a semântica de formulário do navegador (e o ponto de referência "formulário" dos leitores de tela) se perde.
- Você chamou `preventDefault()` no `onKeyDown` do formulário para todo Enter? Mesmo problema: o Enter nos outros campos para de funcionar.
- Você barrou o envio no `onSubmit` quando a lista de autores está aberta? Funciona, com o estado da lista vazando para o formulário; quem sabe o que o Enter significa é o campo.
