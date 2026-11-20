import { describe, expect, it } from 'vitest';
import { useApi } from './test/api.ts';

interface LoanView {
  id: number;
  book: { title: string };
  dueOn: string;
  returnedAt: string | null;
  renewals: number;
  status: string;
}

const api = useApi();

async function openLoan(readerId: number, title: string): Promise<LoanView> {
  const { body } = await api.get<LoanView[]>(`/api/readers/${readerId}/loans`);
  return body.find((loan) => loan.book.title === title && !loan.returnedAt)!;
}

describe('renewing a loan', () => {
  it('gives two more weeks from today, and counts the renewal', async () => {
    const loan = await openLoan(1, 'To Kill a Mockingbird');

    const { status, body } = await api.post<LoanView>(`/api/loans/${loan.id}/renew`);

    expect(status).toBe(200);
    expect(body).toMatchObject({ id: loan.id, dueOn: '2026-03-23', renewals: 1, status: 'on_loan' });
    expect((await openLoan(1, 'To Kill a Mockingbird')).dueOn).toBe('2026-03-23');
  });

  it('works twice, and the third time is refused', async () => {
    const loan = await openLoan(1, 'To Kill a Mockingbird');
    expect((await api.post(`/api/loans/${loan.id}/renew`)).status).toBe(200);
    expect((await api.post<LoanView>(`/api/loans/${loan.id}/renew`)).body.renewals).toBe(2);

    const { status, body } = await api.post<{ error: string }>(`/api/loans/${loan.id}/renew`);

    expect(status).toBe(409);
    expect(body.error).toBeTruthy();
    expect((await openLoan(1, 'To Kill a Mockingbird')).renewals).toBe(2);
  });

  it('is refused for a loan renewed twice already', async () => {
    const loan = await openLoan(6, 'Wonder');

    expect((await api.post(`/api/loans/${loan.id}/renew`)).status).toBe(409);
    expect((await openLoan(6, 'Wonder')).dueOn).toBe('2026-03-19');
  });

  it('is refused for an overdue loan', async () => {
    const loan = await openLoan(2, 'Number the Stars');

    expect((await api.post(`/api/loans/${loan.id}/renew`)).status).toBe(409);
    expect((await openLoan(2, 'Number the Stars')).dueOn).toBe('2026-03-03');
  });

  it('is refused when another reader waits for the book', async () => {
    const loan = await openLoan(7, 'A Wrinkle in Time');

    expect((await api.post(`/api/loans/${loan.id}/renew`)).status).toBe(409);
    expect((await openLoan(7, 'A Wrinkle in Time')).renewals).toBe(0);
  });

  it('is refused for a copy that came back', async () => {
    const loan = await openLoan(1, 'To Kill a Mockingbird');
    await api.post(`/api/loans/${loan.id}/return`);

    expect((await api.post(`/api/loans/${loan.id}/renew`)).status).toBe(409);
  });

  it('answers 404 for a loan that does not exist and 400 for an id that is not a number', async () => {
    expect((await api.post('/api/loans/999/renew')).status).toBe(404);
    expect((await api.post('/api/loans/abc/renew')).status).toBe(400);
  });
});
