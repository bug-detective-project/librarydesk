import { expect, test } from '@playwright/test';
import { TODAY, listLoans, openLoans } from '../../../support/app.ts';

test.describe('Ticket back-5: the overdue list has only copies still out', () => {
  test('the Overdue tab lists the copies out past their due day, and nothing that came back', async ({ page, request }) => {
    const expected = (await listLoans(request, 'active')).filter((loan) => loan.dueOn < TODAY).map((loan) => loan.book.title);
    const table = await openLoans(page, 'overdue');

    await expect(table.getByRole('row')).toHaveCount(expected.length + 1);
    for (const title of expected) {
      await expect(table.getByRole('link', { name: title })).toBeVisible();
    }
    await expect(table.getByRole('button', { name: /^Return / })).toHaveCount(expected.length);
  });

  test('the API answers the same', async ({ request }) => {
    const overdue = await listLoans(request, 'overdue');

    expect(overdue.length).toBeGreaterThan(0);
    expect(overdue.every((loan) => loan.returnedAt === null && loan.status === 'overdue' && loan.dueOn < TODAY)).toBe(true);
  });

  test('a copy that comes back leaves the list', async ({ page, request }) => {
    const [first, ...rest] = await listLoans(request, 'overdue');
    const table = await openLoans(page, 'overdue');

    await table.getByRole('button', { name: `Return ${first!.book.title}` }).click();

    await expect(page.getByRole('status').filter({ hasText: first!.copy.code })).toBeVisible();
    await expect(table.getByRole('link', { name: first!.book.title })).toHaveCount(0);
    expect((await listLoans(request, 'overdue')).map((loan) => loan.id)).toEqual(rest.map((loan) => loan.id));
  });
});
