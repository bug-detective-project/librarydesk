import { describe, expect, it } from 'vitest';
import type { Book } from './api/types.ts';
import { sortBooks } from './collection.ts';

const book = (id: number, title: string, author: string, year: number): Book => ({
  id,
  title,
  author: { id, name: author },
  isbn: '',
  year,
  copies: 1,
  available: 1,
  status: 'available',
});

const books = [book(1, 'Wonder', 'R. J. Palacio', 2012), book(2, 'Holes', 'Louis Sachar', 1998), book(3, 'Hatchet', 'Gary Paulsen', 1987)];

describe('sorting the collection', () => {
  it('sorts by title', () => {
    expect(sortBooks(books, 'title').map((item) => item.title)).toEqual(['Hatchet', 'Holes', 'Wonder']);
  });

  it('sorts by author', () => {
    expect(sortBooks(books, 'author').map((item) => item.author.name)).toEqual(['Gary Paulsen', 'Louis Sachar', 'R. J. Palacio']);
  });

  it('puts the newest first', () => {
    expect(sortBooks(books, 'newest').map((item) => item.year)).toEqual([2012, 1998, 1987]);
  });

  it('leaves the list it gets as it is', () => {
    sortBooks(books, 'title');
    expect(books.map((item) => item.id)).toEqual([1, 2, 3]);
  });
});
