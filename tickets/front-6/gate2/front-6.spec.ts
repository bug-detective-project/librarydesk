import { expect, test } from '@playwright/test';
import type { Locator } from '@playwright/test';
import { BOOKS, openBook, openCollection, openLoans } from '../../../support/app.ts';

const background = (badge: Locator): Promise<string> => badge.evaluate((element) => getComputedStyle(element).backgroundColor);

test.describe('Ticket front-6: the status badge', () => {
  test('the collection says each status in words', async ({ page }) => {
    await openCollection(page);

    await expect(page.getByTestId(`book-${BOOKS.mockingbird.id}`).getByText('Available', { exact: true })).toBeVisible();
    await expect(page.getByTestId(`book-${BOOKS.fahrenheit.id}`).getByText('On loan', { exact: true })).toBeVisible();
    await expect(page.getByTestId(`book-${BOOKS.wrinkle.id}`).getByText('Reserved', { exact: true })).toBeVisible();
    await expect(page.getByRole('list', { name: 'Books' })).not.toContainText(/on_loan|available\b/);
  });

  test('the loans say Overdue and On loan', async ({ page }) => {
    const table = await openLoans(page);

    await expect(table.getByRole('row').filter({ hasText: BOOKS.stars.title }).getByText('Overdue', { exact: true })).toBeVisible();
    await expect(table.getByRole('row').filter({ hasText: BOOKS.mockingbird.title }).getByText('On loan', { exact: true })).toBeVisible();
    await expect(table).not.toContainText('on_loan');
  });

  test('each status has a color of its own', async ({ page }) => {
    await openCollection(page);
    const available = await background(page.getByTestId(`book-${BOOKS.mockingbird.id}`).getByText('Available', { exact: true }));
    const onLoan = await background(page.getByTestId(`book-${BOOKS.fahrenheit.id}`).getByText('On loan', { exact: true }));
    const reserved = await background(page.getByTestId(`book-${BOOKS.wrinkle.id}`).getByText('Reserved', { exact: true }));
    const table = await openLoans(page);
    const overdue = await background(table.getByRole('row').filter({ hasText: BOOKS.stars.title }).getByText('Overdue', { exact: true }));

    const colors = [available, onLoan, reserved, overdue];
    expect(colors.every((color) => color !== 'rgba(0, 0, 0, 0)'), `every badge has a background: ${colors.join(', ')}`).toBe(true);
    expect(new Set(colors).size, `four statuses, four colors: ${colors.join(', ')}`).toBe(4);
  });

  test('the copies of a book carry their badge too', async ({ page }) => {
    await openBook(page, BOOKS.stars.id, BOOKS.stars.title);

    await expect(page.getByTestId('copy-B005-1').getByText('Overdue', { exact: true })).toBeVisible();
    await expect(page.getByTestId('copy-B005-2').getByText('Available', { exact: true })).toBeVisible();
  });
});
