import { expect, test } from '@playwright/test';
import { BOOKS, READERS, getBook, openBook } from '../../../support/app.ts';

test.describe('Ticket front-8: reserving a book with every copy out', () => {
  test('puts the reader in the queue and says their place', async ({ page, request }) => {
    const before = await getBook(request, BOOKS.wrinkle.id);
    expect(before.available, 'every copy of A Wrinkle in Time is out').toBe(0);
    await openBook(page, BOOKS.wrinkle.id, BOOKS.wrinkle.title);
    const form = page.getByRole('form', { name: 'Reserve' });

    await form.getByRole('combobox', { name: 'Reader' }).selectOption({ label: `${READERS.liam.name} · ${READERS.liam.group}` });
    await form.getByRole('button', { name: 'Reserve' }).click();

    const place = before.reservations.length + 1;
    await expect(page.getByRole('status').filter({ hasText: 'queue' })).toHaveText(`${READERS.liam.name} is number ${place} in the queue for ${BOOKS.wrinkle.title}`);
    await expect(page.getByRole('list', { name: 'Queue' }).getByRole('link', { name: READERS.liam.name })).toBeVisible();
    const after = await getBook(request, BOOKS.wrinkle.id);
    expect(after.reservations.map((item) => item.reader.name)).toEqual([...before.reservations.map((item) => item.reader.name), READERS.liam.name]);
  });

  test('works for a book nobody waits for yet', async ({ page, request }) => {
    const before = await getBook(request, BOOKS.fahrenheit.id);
    expect(before.available).toBe(0);
    expect(before.reservations).toEqual([]);
    await openBook(page, BOOKS.fahrenheit.id, BOOKS.fahrenheit.title);
    const form = page.getByRole('form', { name: 'Reserve' });

    await form.getByRole('combobox', { name: 'Reader' }).selectOption({ label: `${READERS.olivia.name} · ${READERS.olivia.group}` });
    await form.getByRole('button', { name: 'Reserve' }).click();

    await expect(page.getByRole('status').filter({ hasText: 'queue' })).toHaveText(`${READERS.olivia.name} is number 1 in the queue for ${BOOKS.fahrenheit.title}`);
  });

  test('a book with a copy in still puts one aside', async ({ page }) => {
    await openBook(page, BOOKS.giver.id, BOOKS.giver.title);
    const form = page.getByRole('form', { name: 'Reserve' });

    await form.getByRole('combobox', { name: 'Reader' }).selectOption({ label: `${READERS.ethan.name} · ${READERS.ethan.group}` });
    await form.getByRole('button', { name: 'Reserve' }).click();

    await expect(page.getByRole('status').filter({ hasText: 'put aside' })).toHaveText(`A copy of ${BOOKS.giver.title} is put aside for ${READERS.ethan.name}`);
  });
});
