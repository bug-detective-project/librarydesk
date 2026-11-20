import { describe, expect, it } from 'vitest';
import { useApi } from './test/api.ts';

interface ReaderSummary {
  id: number;
  name: string;
  group: string;
  card: string;
  openLoans: number;
  overdueLoans: number;
  hasFines: boolean;
}
interface LoanView {
  id: number;
  book: { title: string };
  copy: { code: string };
  dueOn: string;
  returnedAt: string | null;
  status: string;
  fine: string;
  finePaid: boolean;
}

const api = useApi();

describe('readers', () => {
  it('are listed by name with their card, open loans and whether they owe fines', async () => {
    const { status, body } = await api.get<ReaderSummary[]>('/api/readers');

    expect(status).toBe(200);
    expect(body).toHaveLength(9);
    expect(body[0]!.name).toBe('Ava Thompson');
    expect(body.find((reader) => reader.name === 'Emma Johnson')).toEqual({ id: 1, name: 'Emma Johnson', group: 'Grade 7', card: 'R-0001', openLoans: 1, overdueLoans: 0, hasFines: false });
    expect(body.find((reader) => reader.name === 'Liam Carter')).toMatchObject({ openLoans: 1, overdueLoans: 1 });
    expect(body.find((reader) => reader.name === 'Noah Ramirez')).toMatchObject({ openLoans: 0, hasFines: true });
    expect(body.find((reader) => reader.name === 'Ava Thompson')).toMatchObject({ hasFines: false });
  });

  it('are found by name or card', async () => {
    expect((await api.get<ReaderSummary[]>('/api/readers?q=ramirez')).body.map((reader) => reader.name)).toEqual(['Noah Ramirez']);
    expect((await api.get<ReaderSummary[]>('/api/readers?q=R-0008')).body.map((reader) => reader.name)).toEqual(['Laura Mitchell']);
  });

  it('show their classmates and the books they wait for', async () => {
    const { status, body } = await api.get<{ name: string; classmates: { name: string }[]; reservations: { book: { title: string } }[] }>('/api/readers/1');

    expect(status).toBe(200);
    expect(body.name).toBe('Emma Johnson');
    expect(body.classmates.map((classmate) => classmate.name)).toEqual(['Liam Carter', 'Olivia Bennett']);
    expect(body.reservations.map((reservation) => reservation.book.title)).toEqual(['A Wrinkle in Time']);
  });

  it('have their loans listed, the ones still out first', async () => {
    const { body } = await api.get<LoanView[]>('/api/readers/9/loans');

    expect(body.map((loan) => [loan.book.title, loan.status])).toEqual([
      ['Of Mice and Men', 'overdue'],
      ['The Giver', 'returned'],
    ]);
  });

  it('see the fines of the books they brought back late, as decimal text', async () => {
    const { body } = await api.get<LoanView[]>('/api/readers/4/loans');

    expect(body.map((loan) => [loan.book.title, loan.fine, loan.finePaid])).toEqual([
      ['Charlotte\'s Web', '1.00', false],
      ['Hatchet', '0.75', false],
    ]);
  });

  it('pay all their fines at once', async () => {
    const { status, body } = await api.post<{ paid: number }>('/api/readers/4/fines/pay');

    expect(status).toBe(200);
    expect(body).toEqual({ paid: 2 });
    const { body: loans } = await api.get<LoanView[]>('/api/readers/4/loans');
    expect(loans.every((loan) => loan.finePaid)).toBe(true);
    expect((await api.get<ReaderSummary[]>('/api/readers?q=noah')).body[0]!.hasFines).toBe(false);
  });
});
