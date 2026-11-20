import { describe, expect, it } from 'vitest';
import { useApi } from './test/api.ts';

interface Summary {
  id: number;
  title: string;
  author: { id: number; name: string };
  isbn: string;
  year: number;
  copies: number;
  available: number;
  status: string;
}
interface Details extends Summary {
  copyList: { id: number; code: string; status: string; loan: { id: number; dueOn: string; reader: { name: string } } | null }[];
  reservations: { position: number; reader: { name: string } }[];
}

const api = useApi();

describe('the collection', () => {
  it('lists every book with its author, copies and status', async () => {
    const { status, body } = await api.get<Summary[]>('/api/books');

    expect(status).toBe(200);
    expect(body).toHaveLength(15);
    expect(body[0]).toEqual({
      id: 1,
      title: 'Dom Casmurro',
      author: { id: 1, name: 'Machado de Assis' },
      isbn: expect.stringMatching(/^978-85-\d{4}-\d{3}-\d$/),
      year: 1899,
      copies: 3,
      available: 2,
      status: 'available',
    });
    expect(body.find((book) => book.title === 'A Bolsa Amarela')).toMatchObject({ available: 0, status: 'on_loan' });
    expect(body.find((book) => book.title === 'Ou Isto ou Aquilo')).toMatchObject({ available: 0, status: 'reserved' });
  });

  it('finds books by a piece of the title, in any case', async () => {
    const { body } = await api.get<Summary[]>('/api/books?q=capit%C3%A3es');

    expect(body.map((book) => book.title)).toEqual(['Capitães da Areia']);
  });

  it('takes the % of a search literally', async () => {
    const { body } = await api.get<Summary[]>('/api/books?q=%25');

    expect(body).toEqual([]);
  });

  it('shows each copy of a book, who has it and until when, and who is waiting', async () => {
    const { body } = await api.get<Details>('/api/books/9');

    expect(body.title).toBe('Ou Isto ou Aquilo');
    expect(body.copyList).toEqual([{ id: expect.any(Number), code: 'B009-1', status: 'on_loan', loan: { id: expect.any(Number), dueOn: '2026-03-16', reader: { id: 7, name: 'Gabriela Nunes' } } }]);
    expect(body.reservations).toEqual([{ id: expect.any(Number), position: 1, reader: { id: 1, name: 'Ana Souza' }, createdAt: expect.any(String) }]);
  });

  it('marks a copy that should be back already as overdue', async () => {
    const { body } = await api.get<Details>('/api/books/5');

    expect(body.copyList.map((copy) => [copy.code, copy.status])).toEqual([
      ['B005-1', 'overdue'],
      ['B005-2', 'available'],
      ['B005-3', 'available'],
    ]);
  });

  it('answers 404 for a book that does not exist and 400 for an id that is not a number', async () => {
    expect((await api.get('/api/books/999')).status).toBe(404);
    expect((await api.get('/api/books/abc')).status).toBe(400);
  });
});

describe('a new book', () => {
  const input = { title: 'O Cortiço', authorName: 'Aluísio Azevedo', isbn: '9788508040001', year: 1890, copies: 2 };

  it('is added with a new author and its copies, labelled after the book', async () => {
    const { status, body } = await api.post<Details>('/api/books', { ...input, isbn: '9788508000005' });

    expect(status, JSON.stringify(body)).toBe(201);
    expect(body).toMatchObject({ title: 'O Cortiço', author: { name: 'Aluísio Azevedo' }, year: 1890, copies: 2, available: 2, status: 'available' });
    expect(body.copyList.map((copy) => copy.code)).toEqual(['B016-1', 'B016-2']);
  });

  it('can be by an author the library already has', async () => {
    const { status, body } = await api.post<Details>('/api/books', { title: 'Helena', authorId: 1, isbn: '9788508000005', year: 1876 });

    expect(status).toBe(201);
    expect(body.author).toEqual({ id: 1, name: 'Machado de Assis' });
    expect(body.copies).toBe(1);
  });

  it('says which fields need a look', async () => {
    const { status, body } = await api.post<{ fields: Record<string, string> }>('/api/books', { title: '', isbn: '123', year: 3000, copies: 0 });

    expect(status).toBe(400);
    expect(Object.keys(body.fields).sort()).toEqual(['author', 'copies', 'isbn', 'title', 'year']);
  });

  it('refuses an ISBN another book has, and adds nothing', async () => {
    const { body: books } = await api.get<Summary[]>('/api/books');
    const taken = books[0]!.isbn.replace(/-/g, '');

    const { status } = await api.post('/api/books', { ...input, isbn: taken });

    expect(status).toBe(409);
    expect((await api.get<Summary[]>('/api/books')).body).toHaveLength(15);
  });

  it('refuses an author that does not exist', async () => {
    const { status } = await api.post('/api/books', { title: 'Helena', authorId: 999, isbn: '9788508000005', year: 1876 });

    expect(status).toBe(400);
  });
});

describe('authors', () => {
  it('are found by a piece of the name, in alphabetical order', async () => {
    const { body } = await api.get<{ name: string }[]>('/api/authors?q=ma');

    expect(body.map((author) => author.name)).toEqual(['Jorge Amado', 'Machado de Assis', 'Maria José Dupré']);
  });
});
