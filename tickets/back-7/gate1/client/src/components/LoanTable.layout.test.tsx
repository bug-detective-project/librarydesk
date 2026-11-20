import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

// The test environment has no layout engine, so these check the rules of the table themselves: where
// there is no room for six columns (a phone of 375px, a tablet beside the menu), each loan becomes a
// card, and no cell refuses to wrap.
const css = readFileSync(join(import.meta.dirname, 'LoanTable.module.css'), 'utf8');

/** The blocks of a rule for a narrow width: @container or @media with a max-width. */
function narrowBlocks(): string[] {
  const blocks: string[] = [];
  const at = /@(container|media)[^{]*max-width[^{]*\{/g;
  for (let match = at.exec(css); match; match = at.exec(css)) {
    let depth = 1;
    let index = match.index + match[0].length;
    while (depth > 0 && index < css.length) {
      depth += css[index] === '{' ? 1 : css[index] === '}' ? -1 : 0;
      index++;
    }
    blocks.push(css.slice(match.index, index));
  }
  return blocks;
}

/** The declarations of the first rule with exactly this selector, outside any @ block. */
function topRule(selector: string): string {
  const outside = css.replace(/@[^{]*\{(?:[^{}]*\{[^{}]*\})*[^{}]*\}/g, '');
  const match = new RegExp(`(^|\\})\\s*${selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*\\{([^}]*)\\}`).exec(outside);
  return match?.[2] ?? '';
}

describe('the table of loans on a narrow screen', () => {
  it('turns each row into a block when there is no room for the columns', () => {
    const blocks = narrowBlocks();

    expect(blocks.length, 'a rule for a narrow width').toBeGreaterThan(0);
    expect(blocks.some((block) => /\.table tr[^{]*\{[^}]*display:\s*block/.test(block) || /\.table tr[\s\S]*?\{[^}]*display:\s*block/.test(block))).toBe(true);
    expect(blocks.some((block) => /thead[^{]*\{[^}]*display:\s*none/.test(block))).toBe(true);
  });

  it('lets the text of a cell wrap', () => {
    expect(topRule('.table td')).not.toMatch(/white-space:\s*nowrap/);
    expect(topRule('.table')).not.toMatch(/min-width:\s*[1-9]/);
  });
});
