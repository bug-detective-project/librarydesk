# Code review: LD-204, limpe primeiro, confira depois

Duas funções corretas, chamadas na ordem errada. Aqui está a abordagem de referência, para você comparar com a sua.

## Por que o bug aconteceu

- O `normalizeIsbn` transforma o que as pessoas digitam na forma canônica; o `isValidIsbn` confere a forma canônica.
- O `parseIsbn` conferia primeiro. A checagem canônica via traços e dizia não, e a forma canônica só era montada para valores que já eram canônicos.
- Digitar só os dígitos esconde o problema, por isso o `curl` funcionou e o formulário, que sempre põe traços, nunca funcionou.

## Por que o conserto de referência está certo

- A entrada é normalizada uma vez, na borda, e tudo depois trabalha com a forma canônica: o dígito verificador, a checagem de duplicidade e o que é guardado.
- O `isValidIsbn` mantém o `/^\d{13}$/` estrito: depois de normalizar, o que não for 13 dígitos está errado de verdade.
- Um dígito verificador errado continua recusado com a mesma mensagem, então o formulário se comporta como antes para números ruins.

## Compare com o seu conserto

- Você afrouxou a regex do `isValidIsbn` para aceitar traços? Aí o dígito verificador é calculado sobre um texto com traços, e o ISBN guardado fica com eles: a checagem de duplicidade veria `9780306406157` e `978-0-306-40615-7` como dois livros.
- Você tirou os traços no `createBook` antes de chamar o `parseIsbn`? Funciona, mas o próximo que chamar o `parseIsbn` cai na mesma armadilha; a própria função deveria aceitar o que as pessoas digitam.
- Você também tirou outros caracteres (pontos, letras)? A mensagem promete traços e espaços; o resto deve continuar recusado.
