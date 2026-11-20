# Code review: LD-206, um endpoint pequeno com quatro regras

A rota são duas linhas; o trabalho está nas regras e na ordem delas. Aqui está a abordagem de referência, para você comparar com a sua.

## Por que foi construído assim

- A ação fica no `library.ts`, com as outras regras do balcão, e a rota só lê a requisição e a chama. Amanhã uma renovação pode vir de outra tela, e as regras vêm junto.
- Toda recusa é conferida antes de qualquer gravação: uma renovação recusada deixa o empréstimo exatamente como estava.
- A ordem segue a tabela: um exemplar que voltou não tem "atraso" nem "renovações" para discutir, e as checagens baratas rodam antes da consulta das reservas.
- O prazo novo conta a partir de **hoje**, não do prazo antigo. Essa é a regra da biblioteca, e é por isso que renovar no último dia dá exatamente 14 dias a mais.
- A resposta é o `loanView`, o mesmo formato dos outros endpoints de empréstimo, então o toast do cliente acha `book.title` e `dueOn` onde espera.

## Compare com a sua solução

- Você somou `LOAN_DAYS` ao `dueOn` antigo? Renovar antes daria mais de duas semanas a partir de hoje, e o ticket diz 14 dias a partir de hoje.
- Você escreveu os 409 com `res.status(409).json(...)` na rota? Funciona, mas as regras ficam divididas entre a rota e o `library.ts`, e o tratador de erros já faz isso para todo `ConflictError`.
- Você comparou datas com `new Date(...)`? O `dueOn` e o `today()` são `YYYY-MM-DD`, e textos assim se ordenam como as datas que são; transformá-los em momentos traz de volta os problemas de fuso do LD-201.
- Você contou as reservas do **exemplar**? Reservas são de um livro: alguém esperando **qualquer** exemplar bloqueia a renovação.
