import { expect, test } from '@playwright/test';
import { listBooks } from '../../../support/app.ts';

test.describe('Ticket back-4: an ISBN with dashes is accepted', () => {
  test('the form adds a book whose ISBN it wrote with dashes', async ({ page, request }) => {
    await page.goto('/books/new');
    const form = page.getByRole('form', { name: 'New book' });
    await form.getByLabel('Title').fill('Little Women');
    await form.getByRole('combobox', { name: 'Author' }).fill('Louisa May Alcott');
    await form.getByLabel('ISBN').fill('9780306406157');
    await expect(form.getByLabel('ISBN')).toHaveValue('978-0-3064-0615-7');
    await form.getByLabel('Year').fill('1868');

    await form.getByRole('button', { name: 'Add book' }).click();

    await expect(page.getByRole('heading', { level: 2, name: 'Little Women' })).toBeVisible();
    const added = (await listBooks(request)).find((book) => book.title === 'Little Women');
    expect(added?.isbn).toBe('978-0-3064-0615-7');
  });

  test('the API takes dashes and spaces between the groups', async ({ request }) => {
    for (const [title, isbn] of [
      ['Anne of Green Gables', '978-0-14-310654-8'],
      ['Black Beauty', '978 0 14 132103 5'],
    ]) {
      const response = await request.post('/api/books', { data: { title, authorName: 'Someone Classic', isbn, year: 1900, copies: 1 } });
      expect(response.status(), `POST /api/books with the ISBN "${isbn}": ${await response.text()}`).toBe(201);
    }
  });

  test('a wrong check digit is still refused', async ({ request }) => {
    const response = await request.post('/api/books', { data: { title: 'Typo', authorName: 'Someone', isbn: '978-0-306-40615-8', year: 1900, copies: 1 } });

    expect(response.status()).toBe(400);
    expect(Object.keys(((await response.json()) as { fields: Record<string, string> }).fields)).toEqual(['isbn']);
  });
});
