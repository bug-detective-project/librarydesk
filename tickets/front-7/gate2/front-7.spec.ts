import { expect, test } from '@playwright/test';
import { boxOf, openLoans, settle } from '../../../support/app.ts';

for (const width of [375, 768]) {
  test.describe(`Ticket front-7: the loans fit a screen ${width}px wide`, () => {
    test.use({ viewport: { width, height: 800 } });

    test('the page does not scroll sideways', async ({ page }) => {
      await openLoans(page);
      await settle(page);

      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow, 'pixels the page scrolls sideways').toBeLessThanOrEqual(0);
    });

    test('every Return and Renew button is on the screen', async ({ page }) => {
      const table = await openLoans(page);
      await settle(page);

      for (const button of await table.getByRole('button', { name: /^(Return|Renew) / }).all()) {
        const box = await boxOf(button, 'a button of a loan');
        expect(box.x, 'left edge').toBeGreaterThanOrEqual(0);
        expect(box.x + box.width, 'right edge').toBeLessThanOrEqual(width);
      }
    });

    test('the book, the reader and the due date of each loan can be read', async ({ page }) => {
      const table = await openLoans(page);
      await settle(page);

      for (const link of await table.getByRole('link').all()) {
        const box = await boxOf(link, 'a link of a loan');
        expect(box.x + box.width, 'right edge').toBeLessThanOrEqual(width);
      }
    });
  });
}
