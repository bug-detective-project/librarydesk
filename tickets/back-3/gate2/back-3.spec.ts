import { expect, test } from '@playwright/test';
import { listBooks, openCollection, titlesShown } from '../../../support/app.ts';

test.describe('Ticket back-3: the search finds books by their author', () => {
  test('searching an author shows every book of theirs', async ({ page, request }) => {
    const byAuthor = (await listBooks(request)).filter((book) => book.author.name.toLowerCase().includes('steinbeck')).map((book) => book.title);
    expect(byAuthor.length, 'the sample library has books by John Steinbeck').toBeGreaterThan(1);
    await openCollection(page);

    await page.getByRole('searchbox', { name: 'Search the collection' }).fill('Steinbeck');

    await expect.poll(async () => (await titlesShown(page)).sort()).toEqual(expect.arrayContaining(byAuthor));
    expect(await titlesShown(page)).toContain('Reading Steinbeck');
  });

  test('the API finds an author by a piece of the name, in any case', async ({ request }) => {
    const all = await listBooks(request);
    const lowry = all.filter((book) => book.author.name === 'Lois Lowry').map((book) => book.title).sort();

    expect((await listBooks(request, 'LOWRY')).map((book) => book.title).sort()).toEqual(lowry);
    expect((await listBooks(request, 'harp')).map((book) => book.author.name)).toEqual(['Harper Lee']);
  });

  test('a title is still found', async ({ request }) => {
    expect((await listBooks(request, 'wrinkle')).map((book) => book.title)).toEqual(['A Wrinkle in Time']);
  });
});
