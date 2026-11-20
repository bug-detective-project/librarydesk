# LD-201: Livro devolvido no último dia do prazo é cobrado como atraso

| Campo | Valor |
| --- | --- |
| Projeto | LibraryDesk (LD) |
| Tipo de item | Bug |
| Status | A fazer |
| Prioridade | Alta |
| Relator | Rachel Owens (Bibliotecária da escola) |
| Trilha | Back-end |
| Versão afetada | 1.0 |
| Componente | API (multas) |
| Rótulos | `api`, `multas`, `datas` |
| Sprint | LD Sprint 1 |
| Criado em | 05/03/2026 08:20 |

## Descrição

Ontem uma mãe escreveu para a escola: a filha devolveu **Holes** no último dia do prazo, antes do almoço, e o balcão cobrou **$0.25**. O recibo na tela dizia "Copy B006-1 is back, $0.25 in fines". Conferi a ficha: o prazo era aquele mesmo dia. Ela estava em dia.

Não é só esse caso. Todo livro que volta no último dia do prazo leva um dia de multa, e os livros que estão mesmo atrasados levam um dia a mais: **Number the Stars**, que venceu seis dias atrás, mostra **$1.75** na lista de empréstimos. Seis dias a 25 centavos dá $1.50.

Dizemos aos alunos que eles têm até o fim do último dia. O balcão precisa concordar com a gente.

## Passos para reproduzir

Na biblioteca de exemplo, **Olivia Bennett** está com **Holes**, que vence hoje.

1. Abra **Loans**.
2. Olhe a coluna **Fine** de **Number the Stars** (Liam Carter).
3. Clique em **Return** em **Holes**.

Ou, no terminal do VS Code, com o app rodando:

```sh
curl 'http://localhost:3001/api/loans?status=active'
```

## Resultado esperado

- Devolver **Holes** diz "Copy B006-1 is back on the shelf", e o empréstimo fica com multa `"0.00"`.
- **Number the Stars** deve **$1.50** até agora: seis dias de atraso.

## Resultado atual

- "Copy B006-1 is back, $0.25 in fines", e o empréstimo fica com multa `"0.25"`.
- **Number the Stars** mostra **$1.75**.

## Critérios de aceite

- [ ] Um exemplar devolvido no último dia do prazo, a qualquer hora, não paga nada.
- [ ] Um exemplar devolvido depois do prazo paga 25 centavos por dia depois dele: dois dias de atraso dão `"0.50"`.
- [ ] A multa que um exemplar atrasado acumula até agora conta os mesmos dias inteiros.
- [ ] Os dias são contados no fuso da escola (Nova York), qualquer que seja o fuso do computador que roda a API.

## Ambiente

- LibraryDesk 1.0
- Qualquer navegador; também com curl

## Atividade

**Marcus Lee** · 05/03/2026 09:02
> As multas são calculadas pela API quando o exemplar volta. Para constar: os servidores do distrito rodam em UTC, e a escola fica em Nova York.
