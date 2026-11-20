# Solução: O Enter responde à lista, não ao formulário

**Causa raiz.** Num formulário com botão de envio, Enter num campo de texto envia o formulário (envio implícito). O `keyDown` em `client/src/components/AuthorField.tsx` trata o Enter para escolher um autor, mas nunca chama `event.preventDefault()`, então o navegador também envia o formulário.

## Passo a passo

1. **Reproduza.** Digite `Stein`, ↓, Enter: aparecem mensagens embaixo dos campos vazios.
2. **Leia o `keyDown`.** As setas chamam `preventDefault`; o Enter não.
3. **Impeça a ação padrão do Enter** neste campo:

   ```tsx
   } else if (event.key === 'Enter') {
     // Enter answers the list, not the form: the book is saved only by its button.
     event.preventDefault();
     const chosen = shown[active] ?? shown.find((author) => author.name.toLowerCase() === text.trim().toLowerCase());
     // …
   ```

A referência também adiciona um teste de regressão, `client/src/author-enter.test.tsx`: o Enter escolhe o autor destacado, ou fica com um nome novo, e nenhuma requisição de cadastro é feita.

Depois rode `npm test`, siga os passos de novo e mova o cartão para **In QA**.
