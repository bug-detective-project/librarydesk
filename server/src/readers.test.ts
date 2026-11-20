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
    expect(body[0]).toEqual({ id: 1, name: 'Ana Souza', group: 'Class 7B', card: 'R-0001', openLoans: 1, overdueLoans: 0, hasFines: false });
    expect(body.find((reader) => reader.name === 'Bruno Lima')).toMatchObject({ openLoans: 1, overdueLoans: 1 });
    expect(body.find((reader) => reader.name === 'Davi Rocha')).toMatchObject({ openLoans: 0, hasFines: true });
    expect(body.find((reader) => reader.name === 'Elisa Martins')).toMatchObject({ hasFines: false });
  });

  it('are found by name or card', async () => {
    expect((await api.get<ReaderSummary[]>('/api/readers?q=rocha')).body.map((reader) => reader.name)).toEqual(['Davi Rocha']);
    expect((await api.get<ReaderSummary[]>('/api/readers?q=R-0008')).body.map((reader) => reader.name)).toEqual(['Helena Castro']);
  });

  it('show their classmates and the books they wait for', async () => {
    const { status, body } = await api.get<{ name: string; classmates: { name: string }[]; reservations: { book: { title: string } }[] }>('/api/readers/1');

    expect(status).toBe(200);
    expect(body.name).toBe('Ana Souza');
    expect(body.classmates.map((classmate) => classmate.name)).toEqual(['Bruno Lima', 'Carla Mendes']);
    expect(body.reservations.map((reservation) => reservation.book.title)).toEqual(['Ou Isto ou Aquilo']);
  });

  it('have their loans listed, the ones still out first', async () => {
    const { body } = await api.get<LoanView[]>('/api/readers/9/loans');

    expect(body.map((loan) => [loan.book.title, loan.status])).toEqual([
      ['Memórias Póstumas de Brás Cubas', 'overdue'],
      ['A Hora da Estrela', 'returned'],
    ]);
  });

  it('see the fines of the books they brought back late, as decimal text', async () => {
    const { body } = await api.get<LoanView[]>('/api/readers/4/loans');

    expect(body.map((loan) => [loan.book.title, loan.fine, loan.finePaid])).toEqual([
      ['Reinações de Narizinho', '2.00', false],
      ['Iracema', '1.50', false],
    ]);
  });

  it('pay all their fines at once', async () => {
    const { status, body } = await api.post<{ paid: number }>('/api/readers/4/fines/pay');

    expect(status).toBe(200);
    expect(body).toEqual({ paid: 2 });
    const { body: loans } = await api.get<LoanView[]>('/api/readers/4/loans');
    expect(loans.every((loan) => loan.finePaid)).toBe(true);
    expect((await api.get<ReaderSummary[]>('/api/readers?q=davi')).body[0]!.hasFines).toBe(false);
  });
});
