# Solução: Cartões quando a tabela não tem espaço

**Causa raiz.** O `client/src/components/LoanTable.module.css` estiliza a tabela só para telas largas: toda célula tem `white-space: nowrap`, e nada muda quando o espaço é estreito. Seis colunas que não quebram precisam de muito mais que 375px, então a página rola para o lado.

## Passo a passo

1. **Reproduza** em 375px: a página rola para o lado.
2. **Leia o CSS.** `nowrap` em toda célula; nenhuma regra para larguras estreitas.
3. **Dê um container à tabela** no `LoanTable.tsx`: `<div className={styles.wrap}><table …>…</table></div>`, e no CSS:

   ```css
   .wrap {
     container-type: inline-size;
   }
   ```

4. **Deixe as células quebrarem**: tire o `white-space: nowrap` de `.table td`; mantenha só no prazo e na multa:

   ```css
   .table td[data-label='Due'],
   .table td[data-label='Fine'] {
     white-space: nowrap;
   }
   ```

5. **Transforme as linhas em cartões** quando o container da tabela é estreito:

   ```css
   @container (max-width: 699px) {
     .table, .table tbody, .table tr, .table td { display: block; }
     .table { border: none; background: none; box-shadow: none; }
     .table thead { display: none; }
     .table tr { margin-bottom: 12px; padding: 14px 16px; border: 1px solid var(--line); border-radius: 14px; background: var(--surface); }
     .table td { display: flex; justify-content: space-between; gap: 12px; padding: 6px 0; border: none; text-align: right; }
     .table td::before { content: attr(data-label); color: var(--muted); font-size: 0.75rem; font-weight: 700; text-transform: uppercase; }
     .table td:first-child { display: block; text-align: left; }
     .table td:first-child::before, .actions::before { content: none; }
     .table td.actions { justify-content: flex-end; gap: 8px; }
   }
   ```

Uma container query, não uma media query: a mesma tabela fica ao lado do menu e dentro da página de um leitor, e o que importa é a largura dela.

A referência também adiciona um teste de regressão, `client/src/components/LoanTable.layout.test.tsx`: ele confere as próprias regras (uma regra para largura estreita que transforma as linhas em blocos e esconde o cabeçalho, e células que podem quebrar linha), já que o ambiente de teste não calcula layout.

Depois rode `npm test`, abra Loans em 375px e em 768px e mova o cartão para **In QA**.
