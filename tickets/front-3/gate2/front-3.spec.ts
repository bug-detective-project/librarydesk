import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
import { listBooks } from '../../../support/app.ts';

/** Every POST the page sends to /api/books from now on: the form being sent. */
function postsOfBooks(page: Page): string[] {
  const posts: string[] = [];
  page.on('request', (request) => {
    if (request.method() === 'POST' && new URL(request.url()).pathname === '/api/books') {
      posts.push(request.url());
    }
  });
  return posts;
}

test.describe('Ticket front-3: Enter in the author field does not send the form', () => {
  test('Enter picks the highlighted author and stays on the form', async ({ page, request }) => {
    const before = (await listBooks(request)).length;
    await page.goto('/books/new');
    const posts = postsOfBooks(page);
    const form = page.getByRole('form', { name: 'New book' });
    const author = form.getByRole('combobox', { name: 'Author' });

    await author.fill('Stein');
    await expect(page.getByRole('option', { name: 'John Steinbeck' })).toBeVisible();
    await author.press('ArrowDown');
    await author.press('Enter');

    await expect(author).toHaveValue('John Steinbeck');
    await page.waitForLoadState('networkidle');
    expect(posts, 'the form must not be sent by Enter').toEqual([]);
    await expect(page).toHaveURL(/\/books\/new$/);
    await expect(form.getByLabel('Title')).not.toHaveAttribute('aria-invalid', 'true');
    expect((await listBooks(request)).length).toBe(before);
  });

  test('Enter keeps a new name and stays on the form', async ({ page, request }) => {
    const before = (await listBooks(request)).length;
    await page.goto('/books/new');
    const posts = postsOfBooks(page);
    const form = page.getByRole('form', { name: 'New book' });

    await form.getByRole('combobox', { name: 'Author' }).fill('Louisa May Alcott');
    await form.getByRole('combobox', { name: 'Author' }).press('Enter');

    await expect(form.getByText('New author: Louisa May Alcott')).toBeVisible();
    await page.waitForLoadState('networkidle');
    expect(posts, 'the form must not be sent by Enter').toEqual([]);
    await expect(page).toHaveURL(/\/books\/new$/);
    expect((await listBooks(request)).length).toBe(before);
  });

  test('the book is added by its button, with the author picked by Enter', async ({ page, request }) => {
    await page.goto('/books/new');
    const form = page.getByRole('form', { name: 'New book' });
    await form.getByLabel('Title').fill('East of Eden');
    const author = form.getByRole('combobox', { name: 'Author' });
    await author.fill('Stein');
    await expect(page.getByRole('option', { name: 'John Steinbeck' })).toBeVisible();
    await author.press('ArrowDown');
    await author.press('Enter');
    await form.getByLabel('ISBN').fill('9780140186390');
    await form.getByLabel('Year').fill('1952');

    await form.getByRole('button', { name: 'Add book' }).click();

    await expect(page.getByRole('heading', { level: 2, name: 'East of Eden' })).toBeVisible();
    expect((await listBooks(request)).find((book) => book.title === 'East of Eden')?.author.name).toBe('John Steinbeck');
  });
});
