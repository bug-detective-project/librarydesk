import { describe, expect, it } from 'vitest';
import { useApi } from './test/api.ts';

interface LoanView {
  id: number;
  copy: { id: number; code: string };
  book: { title: string };
  reader: { name: string };
  returnedAt: string | null;
}
interface Details {
  available: number;
  copyList: { id: number; code: string; status: string; loan: { reader: { name: string } } | null }[];
}

const api = useApi();

describe('a copy at the desk', () => {
  it('that came back and went out again cannot go out a third time', async () => {
    const { body: emmas } = await api.get<LoanView[]>('/api/readers/1/loans');
    const first = emmas.find((loan) => loan.book.title === 'To Kill a Mockingbird' && !loan.returnedAt)!;
    await api.post(`/api/loans/${first.id}/return`);
    expect((await api.post('/api/loans', { copyId: first.copy.id, readerId: 2 })).status).toBe(201);

    const { status, body } = await api.post<{ error: string }>('/api/loans', { copyId: first.copy.id, readerId: 3 });

    expect(status).toBe(409);
    expect(body.error).toBe('Copy B001-1 is already on loan');
    const { body: book } = await api.get<Details>('/api/books/1');
    expect(book.copyList.find((copy) => copy.code === 'B001-1')!.loan!.reader.name).toBe('Liam Carter');
    expect(book.available).toBe(2);
  });

  it('that is out is never lent to a second reader', async () => {
    const { body: book } = await api.get<Details>('/api/books/5');
    const out = book.copyList.find((copy) => copy.code === 'B005-1')!;

    expect((await api.post('/api/loans', { copyId: out.id, readerId: 3 })).status).toBe(409);
    const { body: olivias } = await api.get<LoanView[]>('/api/readers/3/loans');
    expect(olivias.filter((loan) => loan.copy.code === 'B005-1')).toEqual([]);
  });
});
