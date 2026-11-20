import { expect, test } from '@playwright/test';
import { listBooks, openCollection, titlesShown } from '../../../support/app.ts';

/** The filing rule of library catalogs: a title is filed without its leading article. */
const filed = (title: string): string => title.replace(/^(the|a|an)\s+/i, '').toLowerCase();

test.describe('Ticket front-4: sorting by title follows the filing rule', () => {
  test('the collection files "The" and "A" titles under their next word', async ({ page, request }) => {
    const expected = (await listBooks(request)).map((book) => book.title).sort((a, b) => filed(a).localeCompare(filed(b), 'en'));
    await openCollection(page);

    await expect(page.getByRole('combobox', { name: 'Sort by' })).toHaveValue('title');
    await expect.poll(() => titlesShown(page)).toEqual(expected);
  });

  test('The Giver comes between Fahrenheit 451 and Hatchet', async ({ page }) => {
    await openCollection(page);

    const titles = await titlesShown(page);
    expect(titles.indexOf('The Giver')).toBeGreaterThan(titles.indexOf('Fahrenheit 451'));
    expect(titles.indexOf('The Giver')).toBeLessThan(titles.indexOf('Hatchet'));
    expect(titles.at(-1)).toBe('A Wrinkle in Time');
  });

  test('going back to Title after another order files them the same way', async ({ page }) => {
    await openCollection(page);
    const first = await titlesShown(page);
    const sort = page.getByRole('combobox', { name: 'Sort by' });

    await sort.selectOption('newest');
    await sort.selectOption('title');

    expect(await titlesShown(page)).toEqual(first);
  });
});
