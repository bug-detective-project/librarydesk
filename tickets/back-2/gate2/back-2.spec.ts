import { expect, test } from '@playwright/test';
import { BOOKS, READERS, getBook, openBook, openLoanOf } from '../../../support/app.ts';

test.describe('Ticket back-2: one copy goes to one reader', () => {
  test('a copy that came back and went out again is refused to a third reader', async ({ page, request }) => {
    const first = await openLoanOf(request, READERS.emma.id, BOOKS.mockingbird.title);
    expect((await request.post(`/api/loans/${first.id}/return`)).status()).toBe(200);
    expect((await request.post('/api/loans', { data: { copyId: first.copy.id, readerId: READERS.liam.id } })).status()).toBe(201);

    const third = await request.post('/api/loans', { data: { copyId: first.copy.id, readerId: READERS.olivia.id } });

    expect(third.status(), 'lending a copy that is out').toBe(409);
    expect(((await third.json()) as { error: string }).error).toContain(first.copy.code);
    const copy = (await getBook(request, BOOKS.mockingbird.id)).copyList.find((item) => item.code === first.copy.code)!;
    expect(copy.loan?.reader.name).toBe(READERS.liam.name);

    await openBook(page, BOOKS.mockingbird.id, BOOKS.mockingbird.title);
    const row = page.getByTestId(`copy-${first.copy.code}`);
    await expect(row.getByRole('link', { name: READERS.liam.name })).toBeVisible();
    await expect(row.getByRole('link', { name: READERS.olivia.name })).toHaveCount(0);
  });

  test('a copy that never came back is refused too', async ({ request }) => {
    const out = await openLoanOf(request, READERS.liam.id, BOOKS.stars.title);

    expect((await request.post('/api/loans', { data: { copyId: out.copy.id, readerId: READERS.ava.id } })).status()).toBe(409);
  });
});
