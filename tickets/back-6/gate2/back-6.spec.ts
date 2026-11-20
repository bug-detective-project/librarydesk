import { expect, test } from '@playwright/test';
import { BOOKS, READERS, openLoanOf, openLoans } from '../../../support/app.ts';

test.describe('Ticket back-6: renewing a loan', () => {
  test('Renew on the loans page gives two more weeks', async ({ page, request }) => {
    const loan = await openLoanOf(request, READERS.emma.id, BOOKS.mockingbird.title);
    const table = await openLoans(page);

    await table.getByRole('button', { name: `Renew ${BOOKS.mockingbird.title}` }).click();

    await expect(page.getByRole('status').filter({ hasText: 'renewed' })).toHaveText(`${BOOKS.mockingbird.title} is renewed until Mar 23, 2026`);
    await expect(page.getByTestId(`loan-${loan.id}`)).toContainText('Renewed 1×');
    const renewed = await openLoanOf(request, READERS.emma.id, BOOKS.mockingbird.title);
    expect(renewed).toMatchObject({ dueOn: '2026-03-23', renewals: 1 });
  });

  test('a loan is renewed at most twice', async ({ request }) => {
    const loan = await openLoanOf(request, READERS.laura.id, BOOKS.fahrenheit.title);
    for (const count of [1, 2]) {
      const response = await request.post(`/api/loans/${loan.id}/renew`);
      expect(response.status(), `renewal ${count}`).toBe(200);
      expect(((await response.json()) as { renewals: number }).renewals).toBe(count);
    }

    expect((await request.post(`/api/loans/${loan.id}/renew`)).status()).toBe(409);
    expect((await openLoanOf(request, READERS.laura.id, BOOKS.fahrenheit.title)).renewals).toBe(2);
  });

  test('an overdue loan, and one a reader waits for, are not renewed', async ({ request }) => {
    const overdue = await openLoanOf(request, READERS.liam.id, BOOKS.stars.title);
    const waitedFor = await openLoanOf(request, READERS.sophia.id, BOOKS.wrinkle.title);

    expect((await request.post(`/api/loans/${overdue.id}/renew`)).status()).toBe(409);
    expect((await request.post(`/api/loans/${waitedFor.id}/renew`)).status()).toBe(409);
    expect((await openLoanOf(request, READERS.liam.id, BOOKS.stars.title)).dueOn).toBe(overdue.dueOn);
    expect((await openLoanOf(request, READERS.sophia.id, BOOKS.wrinkle.title)).dueOn).toBe(waitedFor.dueOn);
  });

  test('the page says why a renewal is refused', async ({ page, request }) => {
    const wonder = await openLoanOf(request, READERS.ethan.id, BOOKS.wonder.title);
    expect(wonder.renewals).toBe(2);
    const table = await openLoans(page);

    await table.getByRole('button', { name: `Renew ${BOOKS.wonder.title}` }).click();

    await expect(page.getByRole('alert')).toBeVisible();
    await expect(page.getByRole('alert')).not.toHaveText(/not found/i);
  });

  test('a loan that does not exist is a 404', async ({ request }) => {
    expect((await request.post('/api/loans/99999/renew')).status()).toBe(404);
  });
});
