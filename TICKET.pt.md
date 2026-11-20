# LD-107: A tabela de empréstimos estoura a tela

| Campo | Valor |
| --- | --- |
| Projeto | LibraryDesk (LD) |
| Tipo de item | Bug |
| Status | A fazer |
| Prioridade | Média |
| Relator | Daniel Price (Auxiliar da biblioteca) |
| Trilha | Front-end |
| Versão afetada | 1.0 |
| Componente | Empréstimos |
| Rótulos | `cliente`, `css`, `responsividade` |
| Sprint | LD Sprint 1 |
| Criado em | 04/03/2026 16:20 |

## Descrição

Confiro devoluções pelo celular quando ando pelas estantes, e a tela de empréstimos não cabe nele: a tabela é mais larga que a tela, a página rola para o lado, e os botões **Return** e **Renew** ficam para fora, à direita. Rolo para a esquerda e para a direita a cada linha.

Também acontece no tablet do balcão, onde o menu ocupa o lado esquerdo, e na página de um leitor, onde a tabela é mais estreita.

## Passos para reproduzir

1. Abra **Loans** numa janela de 375px de largura (na barra de dispositivos do navegador, um iPhone SE ou parecido).
2. Tente chegar ao botão **Return** de um empréstimo.

## Resultado esperado

Sem espaço para as seis colunas, cada empréstimo vira um cartão: o livro e o exemplar no alto, depois Reader, Due, Status e Fine, cada um ao lado do rótulo, e os botões embaixo. Nada rola para o lado, em 375px e em 768px.

## Resultado atual

A tabela mantém as seis colunas, as células nunca quebram linha, e a página rola para o lado; os botões ficam fora da tela.

## Critérios de aceite

- [ ] Em 375px e em 768px a tela de empréstimos não rola para o lado.
- [ ] Todo botão Return e Renew está na tela.
- [ ] O livro, o leitor e o prazo de cada empréstimo podem ser lidos.
- [ ] Numa tela larga a tabela mantém as colunas.

## Ambiente

- LibraryDesk 1.0
- Qualquer navegador; celulares a partir de 375px de largura

## Atividade

**Rachel Owens** · 04/03/2026 16:35
> As células já sabem os rótulos delas (`data-label="Due"` e assim por diante), lembro disso de quando foi construído. Os cartões estavam planejados.
