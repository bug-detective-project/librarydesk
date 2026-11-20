import { expect, test } from '@playwright/test';
import { BOOKS, READERS, getBook, openBook } from '../../../support/app.ts';

test.describe('Ticket front-1: the copies available follow the loans', () => {
  test('lending a copy takes one off the count, without reloading the page', async ({ page, request }) => {
    const before = await getBook(request, BOOKS.mockingbird.id);
    await openBook(page, BOOKS.mockingbird.id, BOOKS.mockingbird.title);
    const count = page.getByText(new RegExp(`of ${before.copies} copies available`));
    await expect(count).toHaveText(`${before.available} of ${before.copies} copies available`);
    const form = page.getByRole('form', { name: 'Lend a copy' });

    await form.getByRole('combobox', { name: 'Reader' }).selectOption({ label: `${READERS.ava.name} · ${READERS.ava.group}` });
    await form.getByRole('button', { name: 'Lend' }).click();

    await expect(page.getByRole('status').filter({ hasText: READERS.ava.name })).toBeVisible();
    await expect(count).toHaveText(`${before.available - 1} of ${before.copies} copies available`);
    expect((await getBook(request, BOOKS.mockingbird.id)).available).toBe(before.available - 1);
  });

  test('lending the last copy shows none left', async ({ page, request }) => {
    const before = await getBook(request, BOOKS.terabithia.id);
    await openBook(page, BOOKS.terabithia.id, BOOKS.terabithia.title);
    const readers = [READERS.ethan, READERS.ava].slice(0, before.available);

    for (const reader of readers) {
      const form = page.getByRole('form', { name: 'Lend a copy' });
      await form.getByRole('combobox', { name: 'Reader' }).selectOption({ label: `${reader.name} · ${reader.group}` });
      await form.getByRole('button', { name: 'Lend' }).click();
      await expect(page.getByRole('status').filter({ hasText: `lent to ${reader.name}` })).toBeVisible();
    }

    await expect(page.getByText(new RegExp(`of ${before.copies} copies available`))).toHaveText(`0 of ${before.copies} copies available`);
  });
});
