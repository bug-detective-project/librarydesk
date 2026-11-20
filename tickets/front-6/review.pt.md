# Code review: LD-106, um componente pequeno usado em todo lugar

Cinco situações, três telas, um componente. Aqui está a abordagem de referência, para você comparar com a sua.

## Por que foi construído assim

- O `Record<Status, string>` amarra os textos ao tipo da API: uma sexta situação acrescentada ao `Status` é erro de compilação aqui até ganhar um texto.
- Uma classe por situação, com o nome do valor, deixa o componente sem `if`: o `styles[status]` é a decisão inteira.
- As cores são os tokens do `index.css`, então a etiqueta segue a paleta do app em vez de inventar outra, e os pares (texto forte sobre fundo suave) já passam no AA.
- O ponto é decoração (`aria-hidden`) e usa `currentColor`: uma cor por situação para manter, não duas.
- O `data-status` dá aos testes e a estilos futuros um gancho estável, que não depende da redação do texto.

## Compare com a sua solução

- Você escolheu cores à mão (`#e53935`)? Podem parecer certas, e ignoram a paleta e o contraste dela.
- Você escreveu um `switch` com JSX para cada caso? Funciona; cinco cópias da mesma marcação são cinco lugares para mudar da próxima vez.
- Você mostrou só a cor, sem texto? Cor sozinha falha com quem não a vê, e o ticket pede o texto.
- Você pôs maiúscula no valor cru (`on_loan` → `On_loan`)? Os textos são palavras que uma pessoa lê, então moram no componente.
