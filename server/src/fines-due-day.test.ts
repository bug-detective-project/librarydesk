import { describe, expect, it } from 'vitest';
import { libraryMoment } from './clock.ts';
import { fineFor, lateDays } from './fines.ts';
import { useApi } from './test/api.ts';

interface LoanView {
  id: number;
  book: { title: string };
  returnedAt: string | null;
  status: string;
  fine: string;
}

const api = useApi();

async function openLoan(readerId: number, title: string): Promise<LoanView> {
  const { body } = await api.get<LoanView[]>(`/api/readers/${readerId}/loans`);
  return body.find((loan) => loan.book.title === title && !loan.returnedAt)!;
}

describe('a copy that comes back on its due day', () => {
  it('is on time at any hour of that day, in the school time', () => {
    for (const time of ['00:30', '08:00', '10:15', '19:59', '20:00', '23:30']) {
      expect(lateDays('2026-03-09', libraryMoment('2026-03-09', time)), `returned at ${time}`).toBe(0);
      expect(fineFor('2026-03-09', libraryMoment('2026-03-09', time)), `returned at ${time}`).toBe('0.00');
    }
  });

  it('is late by whole days from the day after', () => {
    expect(lateDays('2026-03-08', libraryMoment('2026-03-09', '00:30'))).toBe(1);
    expect(lateDays('2026-03-06', libraryMoment('2026-03-09', '10:15'))).toBe(3);
    expect(fineFor('2026-03-06', libraryMoment('2026-03-09', '23:30'))).toBe('0.75');
  });

  it('is charged nothing at the desk', async () => {
    const holes = await openLoan(3, 'Holes');

    const { status, body } = await api.post<LoanView>(`/api/loans/${holes.id}/return`);

    expect(status).toBe(200);
    expect(body).toMatchObject({ status: 'returned', fine: '0.00' });
  });

  it('two days late, is charged two days', async () => {
    const mice = await openLoan(9, 'Of Mice and Men');

    const { body } = await api.post<LoanView>(`/api/loans/${mice.id}/return`);

    expect(body.fine).toBe('0.50');
  });
});
