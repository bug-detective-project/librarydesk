# Solução: Tire os traços antes de conferir

**Causa raiz.** O `parseIsbn` em `server/src/isbn.ts` valida o texto como foi digitado e só depois normaliza. O `isValidIsbn` quer exatamente 13 dígitos, então qualquer traço ou espaço o reprova, e a normalização que os tiraria nunca roda.

## Passo a passo

1. **Reproduza** com o `curl` do ticket, e depois com só os dígitos: só o segundo passa.
2. **Siga o ISBN.** O `createBook` chama `parseIsbn(input.isbn)` e recusa o campo quando recebe `null`.
3. **Leia o `parseIsbn`.** A ordem é validar e depois normalizar.
4. **Inverta a ordem:**

   ```ts
   /** The digits of a valid ISBN, or null when the text is not one. */
   export function parseIsbn(typed: string): string | null {
     const digits = normalizeIsbn(typed);
     return isValidIsbn(digits) ? digits : null;
   }
   ```

A referência também adiciona um teste de regressão, `server/src/isbn-dashes.test.ts`: ISBNs com traços em dois agrupamentos e com espaços lidos como 13 dígitos, um dígito verificador errado ainda recusado, e a API cadastrando um livro digitado com traços.

Depois rode `npm test`, cadastre **Little Women** pelo formulário e mova o cartão para **In QA**.
