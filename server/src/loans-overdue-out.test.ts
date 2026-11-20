import { describe, expect, it } from 'vitest';
import { useApi } from './test/api.ts';

interface LoanView {
  id: number;
  book: { title: string };
  reader: { name: string };
  returnedAt: string | null;
  status: string;
}

const api = useApi();

describe('the overdue loans', () => {
  it('are only the copies still out after their due day', async () => {
    const { body } = await api.get<LoanView[]>('/api/loans?status=overdue');

    expect(body.map((loan) => [loan.book.title, loan.reader.name])).toEqual([
      ['Number the Stars', 'Liam Carter'],
      ['Of Mice and Men', 'David Kim'],
    ]);
    expect(body.every((loan) => loan.returnedAt === null && loan.status === 'overdue')).toBe(true);
  });

  it('lose a copy as soon as it comes back', async () => {
    const { body: before } = await api.get<LoanView[]>('/api/loans?status=overdue');
    await api.post(`/api/loans/${before[0]!.id}/return`);

    const { body } = await api.get<LoanView[]>('/api/loans?status=overdue');

    expect(body.map((loan) => loan.reader.name)).toEqual(['David Kim']);
  });
});
