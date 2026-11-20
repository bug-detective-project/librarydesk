# LD-102: Multa aparece como "$NaN"

| Campo | Valor |
| --- | --- |
| Projeto | LibraryDesk (LD) |
| Tipo de item | Bug |
| Status | A fazer |
| Prioridade | Alta |
| Relator | Rachel Owens (Bibliotecária da escola) |
| Trilha | Front-end |
| Versão afetada | 1.0 |
| Componente | Página do leitor |
| Rótulos | `cliente`, `multas`, `tipos` |
| Sprint | LD Sprint 1 |
| Criado em | 05/03/2026 15:10 |

## Descrição

O Noah veio pagar as multas e a página dele dizia **Fines due: $NaN**. Também não havia o botão **Pay fines**, então não consegui marcar como pagas.

O histórico dele está certo: **Charlotte's Web**, $1.00 devido, e **Hatchet**, $0.75 devido. É só o total. A página da Ava, que pagou a única multa, diz $0.00, o que está certo. Um aluno com um único livro atrasado também mostra o valor certo; parece quebrar quando há dois ou mais.

## Passos para reproduzir

1. Abra **Readers** e depois **Noah Ramirez**.
2. Olhe **Fines due**, no canto de cima à direita.

## Resultado esperado

**Fines due: $1.75**, e o botão **Pay fines**.

## Resultado atual

**Fines due: $NaN**, e nenhum botão **Pay fines**.

## Critérios de aceite

- [ ] As multas devidas são a soma das multas não pagas dos livros que voltaram atrasados, em dólares.
- [ ] Um leitor com duas ou mais multas vê o total certo e consegue pagá-las.
- [ ] Multas pagas ficam de fora, e um leitor sem nenhuma vê $0.00.

## Ambiente

- LibraryDesk 1.0
- Qualquer navegador

## Atividade

**Marcus Lee** · 05/03/2026 15:34
> A API me parece certa: `/api/readers/4/loans` tem `"fine": "1.00"` e `"fine": "0.75"`. O banco guarda dinheiro como `DECIMAL`, e o driver do MySQL devolve um `DECIMAL` como string para nunca perder um centavo num float.
