import { describe, expect, it } from 'vitest';
import { parseIsbn } from './isbn.ts';
import { useApi } from './test/api.ts';

const api = useApi();

describe('an ISBN typed with its dashes', () => {
  it('is read as its 13 digits', () => {
    expect(parseIsbn('978-0-306-40615-7')).toBe('9780306406157');
    expect(parseIsbn('978-0-3064-0615-7')).toBe('9780306406157');
    expect(parseIsbn('978 0 306 40615 7')).toBe('9780306406157');
  });

  it('is still refused when its check digit is wrong', () => {
    expect(parseIsbn('978-0-306-40615-8')).toBeNull();
  });

  it('adds the book, kept as digits and printed with its groups', async () => {
    const { status, body } = await api.post<{ title: string; isbn: string }>('/api/books', {
      title: 'Little Women',
      authorName: 'Louisa May Alcott',
      isbn: '978-0-306-40615-7',
      year: 1868,
      copies: 1,
    });

    expect(status, JSON.stringify(body)).toBe(201);
    expect(body.isbn).toBe('978-0-3064-0615-7');
  });
});
