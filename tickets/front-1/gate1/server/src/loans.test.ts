import { describe, expect, it } from 'vitest';
import { useApi } from './test/api.ts';

interface LoanView {
  id: number;
  book: { id: number; title: string };
  copy: { id: number; code: string };
  reader: { id: number; name: string };
  loanedOn: string;
  dueOn: string;
  returnedAt: string | null;
  renewals: number;
  status: string;
  fine: string;
  finePaid: boolean;
}
interface Details {
  available: number;
  status: string;
  copyList: { id: number; code: string; status: string }[];
  reservations: { reader: { name: string } }[];
}

const api = useApi();

/** The copy of a book with that code. */
async function copyId(bookId: number, code: string): Promise<number> {
  const { body } = await api.get<Details>(`/api/books/${bookId}`);
  return body.copyList.find((copy) => copy.code === code)!.id;
}

/** The open loan of a reader for a book. */
async function loanOf(readerId: number, title: string): Promise<LoanView> {
  const { body } = await api.get<LoanView[]>(`/api/readers/${readerId}/loans`);
  return body.find((loan) => loan.book.title === title && !loan.returnedAt)!;
}

describe('the loans at the desk', () => {
  it('lists the copies that are out, the ones due first at the top', async () => {
    const { status, body } = await api.get<LoanView[]>('/api/loans?status=active');

    expect(status).toBe(200);
    expect(body).toHaveLength(7);
    expect(body[0]).toMatchObject({ book: { title: 'Number the Stars' }, copy: { code: 'B005-1' }, reader: { name: 'Liam Carter' }, dueOn: '2026-03-03', status: 'overdue' });
    expect(body.every((loan) => loan.returnedAt === null)).toBe(true);
  });

  it('lists the overdue copies', async () => {
    const { body } = await api.get<LoanView[]>('/api/loans?status=overdue');

    expect(body.map((loan) => loan.reader.name)).toEqual(expect.arrayContaining(['Liam Carter', 'David Kim']));
    expect(body.every((loan) => loan.dueOn < '2026-03-09')).toBe(true);
  });

  it('shows what an overdue loan owes so far', async () => {
    const { body } = await api.get<LoanView[]>('/api/loans?status=active');

    expect(Number(body.find((loan) => loan.reader.name === 'Liam Carter')!.fine)).toBeGreaterThan(0);
    expect(body.find((loan) => loan.reader.name === 'Emma Johnson')!.fine).toBe('0.00');
  });

  it('refuses a status it does not know', async () => {
    expect((await api.get('/api/loans?status=lost')).status).toBe(400);
  });
});

describe('lending', () => {
  it('lends a copy on the shelf for 14 days, and the book has one copy fewer', async () => {
    const copy = await copyId(1, 'B001-2');

    const { status, body } = await api.post<LoanView>('/api/loans', { copyId: copy, readerId: 2 });

    expect(status).toBe(201);
    expect(body).toMatchObject({ copy: { code: 'B001-2' }, reader: { name: 'Liam Carter' }, loanedOn: '2026-03-09', dueOn: '2026-03-23', renewals: 0, status: 'on_loan', fine: '0.00' });
    expect((await api.get<Details>('/api/books/1')).body.available).toBe(1);
  });

  it('refuses a reader who owes fines, and says how much', async () => {
    const copy = await copyId(1, 'B001-2');

    const { status, body } = await api.post<{ error: string }>('/api/loans', { copyId: copy, readerId: 4 });

    expect(status).toBe(409);
    expect(body.error).toBe('Noah Ramirez has $1.75 in unpaid fines');
  });

  it('lends again once the fines are paid', async () => {
    await api.post('/api/readers/4/fines/pay');

    const { status } = await api.post('/api/loans', { copyId: await copyId(1, 'B001-2'), readerId: 4 });

    expect(status).toBe(201);
  });

  it('answers 404 for a copy that does not exist and 400 without a reader', async () => {
    expect((await api.post('/api/loans', { copyId: 999, readerId: 1 })).status).toBe(404);
    expect((await api.post('/api/loans', { copyId: 1 })).status).toBe(400);
  });

  it('takes the reader off the queue of the book they take home', async () => {
    const sophia = await loanOf(7, 'A Wrinkle in Time');
    await api.post(`/api/loans/${sophia.id}/return`);

    const { status } = await api.post('/api/loans', { copyId: sophia.copy.id, readerId: 1 });

    expect(status).toBe(201);
    expect((await api.get<Details>('/api/books/9')).body.reservations).toEqual([]);
  });
});

describe('returning', () => {
  it('takes a copy back early without a fine, and it is on the shelf again', async () => {
    const loan = await loanOf(1, 'To Kill a Mockingbird');

    const { status, body } = await api.post<LoanView>(`/api/loans/${loan.id}/return`);

    expect(status).toBe(200);
    expect(body).toMatchObject({ status: 'returned', fine: '0.00', returnedAt: '2026-03-09T14:15:00.000Z' });
    expect((await api.get<Details>('/api/books/1')).body.available).toBe(3);
  });

  it('charges a fine for a copy that comes back days late', async () => {
    const loan = await loanOf(2, 'Number the Stars');

    const { body } = await api.post<LoanView>(`/api/loans/${loan.id}/return`);

    expect(Number(body.fine)).toBeGreaterThan(0);
    expect(body.finePaid).toBe(false);
  });

  it('refuses a copy that is already back', async () => {
    const loan = await loanOf(1, 'To Kill a Mockingbird');
    await api.post(`/api/loans/${loan.id}/return`);

    expect((await api.post(`/api/loans/${loan.id}/return`)).status).toBe(409);
  });
});

describe('reserving', () => {
  it('puts a reader in the queue of a book with every copy out', async () => {
    const { status, body } = await api.post<{ position: number; ready: boolean }>('/api/books/9/reservations', { readerId: 2 });

    expect(status).toBe(201);
    expect(body).toMatchObject({ position: 2, ready: false });
    expect((await api.get<Details>('/api/books/9')).body.reservations.map((reservation) => reservation.reader.name)).toEqual(['Emma Johnson', 'Liam Carter']);
  });

  it('puts a copy aside when the book is on the shelf', async () => {
    const { status, body } = await api.post<{ position: number; ready: boolean }>('/api/books/3/reservations', { readerId: 2 });

    expect(status).toBe(201);
    expect(body).toMatchObject({ position: 1, ready: true });
  });

  it('refuses a reader who already waits for the book or has it', async () => {
    expect((await api.post('/api/books/9/reservations', { readerId: 1 })).status).toBe(409);
    expect((await api.post('/api/books/9/reservations', { readerId: 7 })).status).toBe(409);
  });
});
