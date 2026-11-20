# LD-106: Criar o componente de etiqueta de situação do livro

| Campo | Valor |
| --- | --- |
| Projeto | LibraryDesk (LD) |
| Tipo de item | História |
| Status | A fazer |
| Prioridade | Média |
| Relator | Rachel Owens (Bibliotecária da escola) |
| Trilha | Front-end |
| Versão afetada | 1.0 |
| Componente | Componentes |
| Rótulos | `cliente`, `componente`, `interface` |
| Sprint | LD Sprint 1 |
| Criado em | 02/03/2026 10:30 |

## Descrição

Em todo lugar em que o balcão mostra uma situação, ele mostra a palavra crua da API: `available`, `on_loan`, `overdue`. Nos cartões do acervo, ao lado de cada exemplar, na tabela de empréstimos. Parece inacabado, e de relance não sei distinguir um livro atrasado de um que está em dia: é o mesmo texto cinza.

As telas já chamam um componente `StatusBadge` para isso (`client/src/components/StatusBadge.tsx`). Ele é um provisório que imprime a palavra. Por favor, construa o componente.

## O que a etiqueta mostra

| Situação (da API) | Texto | Cor |
| --- | --- | --- |
| `available` | Available | verde |
| `on_loan` | On loan | o azul-petróleo do app |
| `reserved` | Reserved | âmbar |
| `overdue` | Overdue | vermelho |
| `returned` | Returned | cinza |

- Uma pílula pequena: o texto por extenso, com um ponto da mesma cor antes.
- Cada situação tem as suas cores, dos tokens de `client/src/index.css` (`--ok` e `--ok-soft`, `--brand-strong` e `--brand-soft`, `--amber` e `--amber-soft`, `--danger` e `--danger-soft`, `--muted` e `--sunken`). O texto mantém contraste de pelo menos 4,5:1 com o fundo.
- A etiqueta leva a situação em `data-status` (`data-status="overdue"`), para um estilo ou um teste achá-la.
- O texto é o único conteúdo: um leitor de tela lê "Overdue", e mais nada.

## Onde aparece

Os cartões do acervo, a página de um livro (a situação do livro e de cada exemplar) e as tabelas de empréstimos (Loans, e On loan na página de um leitor). Essas telas já passam a situação; nada mais muda.

## Critérios de aceite

- [ ] Cada situação mostra o seu texto por extenso, nunca o valor cru.
- [ ] Cada situação tem uma cor própria, legível (AA).
- [ ] A etiqueta tem `data-status` com a situação.
- [ ] Toda tela que mostra uma situação usa a etiqueta.

## Ambiente

- LibraryDesk 1.0
- Qualquer navegador

## Atividade

**Daniel Price** · 02/03/2026 10:48
> Overdue em vermelho, por favor. É a que eu procuro numa manhã cheia.
