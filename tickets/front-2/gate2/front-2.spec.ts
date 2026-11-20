import { expect, test } from '@playwright/test';
import { READERS, openReader, readerLoans } from '../../../support/app.ts';

const dollars = (amount: number): string => `$${amount.toFixed(2)}`;

test.describe('Ticket front-2: the fines of a reader add up in dollars', () => {
  test('a reader with two late books sees the total of both', async ({ page, request }) => {
    const owed = (await readerLoans(request, READERS.noah.id)).filter((loan) => loan.returnedAt && !loan.finePaid && Number(loan.fine) > 0);
    expect(owed.length, 'Noah brought two books back late').toBe(2);
    const total = owed.reduce((sum, loan) => sum + Number(loan.fine), 0);

    await openReader(page, READERS.noah.id, READERS.noah.name);

    const fines = page.getByRole('region', { name: 'Fines' });
    await expect(fines).toContainText(dollars(total));
    await expect(fines).not.toContainText('NaN');
  });

  test('paying them asks first, says the amount and leaves nothing due', async ({ page, request }) => {
    const owed = (await readerLoans(request, READERS.noah.id)).filter((loan) => loan.returnedAt && !loan.finePaid);
    const total = dollars(owed.reduce((sum, loan) => sum + Number(loan.fine), 0));
    await openReader(page, READERS.noah.id, READERS.noah.name);

    await page.getByRole('region', { name: 'Fines' }).getByRole('button', { name: 'Pay fines' }).click();
    const dialog = page.getByRole('alertdialog', { name: 'Mark the fines as paid' });
    await expect(dialog).toContainText(total);
    await dialog.getByRole('button', { name: 'Mark as paid' }).click();

    await expect(page.getByRole('status').filter({ hasText: 'in fines paid' })).toHaveText(`${total} in fines paid`);
    await expect(page.getByRole('region', { name: 'Fines' })).toContainText('$0.00');
  });

  test('the history shows each fine with its own amount', async ({ page, request }) => {
    const late = (await readerLoans(request, READERS.ava.id)).filter((loan) => Number(loan.fine) > 0);
    await openReader(page, READERS.ava.id, READERS.ava.name);

    const history = page.getByRole('list', { name: 'History' });
    for (const loan of late) {
      await expect(history).toContainText(dollars(Number(loan.fine)));
    }
    await expect(page.getByRole('region', { name: 'Fines' })).toContainText('$0.00');
  });
});
