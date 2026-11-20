import { expect, test } from '@playwright/test';
import { BOOKS, READERS, TODAY, listLoans, openLoanOf, openLoans, readerLoans } from '../../../support/app.ts';

test.describe('Ticket back-1: a copy back on its due day is not late', () => {
  test('returning a copy on its due day charges nothing', async ({ page, request }) => {
    const holes = await openLoanOf(request, READERS.olivia.id, BOOKS.holes.title);
    expect(holes.dueOn, 'Holes is due on the day of the QA').toBe(TODAY);
    const table = await openLoans(page);

    await table.getByRole('button', { name: `Return ${BOOKS.holes.title}` }).click();

    await expect(page.getByRole('status').filter({ hasText: holes.copy.code })).toHaveText(`Copy ${holes.copy.code} is back on the shelf`);
    const returned = (await readerLoans(request, READERS.olivia.id)).find((loan) => loan.id === holes.id)!;
    expect(returned.status).toBe('returned');
    expect(returned.fine).toBe('0.00');
  });

  test('a copy back two days after its due day pays two days', async ({ request }) => {
    const mice = await openLoanOf(request, READERS.david.id, BOOKS.mice.title);
    expect(mice.dueOn).toBe('2026-03-07');

    const response = await request.post(`/api/loans/${mice.id}/return`);

    expect(response.status()).toBe(200);
    expect(((await response.json()) as { fine: string }).fine).toBe('0.50');
  });

  test('an overdue copy owes a whole number of days so far', async ({ request }) => {
    const stars = (await listLoans(request, 'active')).find((loan) => loan.book.title === BOOKS.stars.title)!;
    expect(stars.dueOn, 'Number the Stars was due six days before the QA').toBe('2026-03-03');

    expect(stars.fine).toBe('1.50');
  });
});
