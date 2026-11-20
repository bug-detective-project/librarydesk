import { expect, test } from '@playwright/test';
import { READERS, openReader, readerLoans } from '../../../support/app.ts';

test.describe('Ticket front-5: the reader page shows the loans of the reader on it', () => {
  test('going to a classmate shows the classmate loans', async ({ page, request }) => {
    const emmas = (await readerLoans(request, READERS.emma.id)).filter((loan) => !loan.returnedAt).map((loan) => loan.book.title);
    const liams = (await readerLoans(request, READERS.liam.id)).filter((loan) => !loan.returnedAt).map((loan) => loan.book.title);
    await openReader(page, READERS.emma.id, READERS.emma.name);
    await expect(page.getByRole('table', { name: 'On loan' }).getByRole('link', { name: emmas[0] })).toBeVisible();

    await page.getByRole('navigation', { name: `Also in ${READERS.emma.group}` }).getByRole('link', { name: READERS.liam.name }).click();

    await expect(page.getByRole('heading', { level: 2, name: READERS.liam.name })).toBeVisible();
    const table = page.getByRole('table', { name: 'On loan' });
    for (const title of liams) {
      await expect(table.getByRole('link', { name: title })).toBeVisible();
    }
    for (const title of emmas.filter((title) => !liams.includes(title))) {
      await expect(table.getByRole('link', { name: title })).toHaveCount(0);
    }
  });

  test('a classmate with no book out shows none, not the books of the reader before', async ({ page, request }) => {
    const avas = (await readerLoans(request, READERS.ava.id)).filter((loan) => !loan.returnedAt);
    expect(avas, 'Ava has no book out').toEqual([]);
    await openReader(page, READERS.noah.id, READERS.noah.name);

    await page.getByRole('navigation', { name: `Also in ${READERS.noah.group}` }).getByRole('link', { name: READERS.ava.name }).click();

    await expect(page.getByRole('heading', { level: 2, name: READERS.ava.name })).toBeVisible();
    await expect(page.getByText('No book out right now.')).toBeVisible();
    await expect(page.getByRole('list', { name: 'History' })).not.toContainText('Hatchet');
  });
});
