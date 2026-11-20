import { expect, test } from '@playwright/test';
import { READERS, openCollection } from '../../../support/app.ts';

test.describe('Ticket back-7: a reader that does not exist does not take the server down', () => {
  test('the API answers 404 in JSON, and keeps answering', async ({ request }) => {
    const missing = await request.get('/api/readers/99999');

    expect(missing.status()).toBe(404);
    expect(await missing.json()).toEqual({ error: expect.any(String) });
    const next = await request.get(`/api/readers/${READERS.emma.id}`);
    expect(next.status(), 'the API still answers after an unknown reader').toBe(200);
  });

  test('an old link to a removed reader shows a message, and the desk keeps working', async ({ page }) => {
    await page.goto('/readers/99999');

    await expect(page.getByText('There is no such reader')).toBeVisible();
    await openCollection(page);
    await page.goto(`/readers/${READERS.emma.id}`);
    await expect(page.getByRole('heading', { level: 2, name: READERS.emma.name })).toBeVisible();
  });
});
