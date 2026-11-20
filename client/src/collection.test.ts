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

const books = [book(1, 'Vidas Secas', 'Graciliano Ramos', 1938), book(2, 'Capitães da Areia', 'Jorge Amado', 1937), book(3, 'Dom Casmurro', 'Machado de Assis', 1899)];

describe('sorting the collection', () => {
  it('sorts by title', () => {
    expect(sortBooks(books, 'title').map((item) => item.title)).toEqual(['Capitães da Areia', 'Dom Casmurro', 'Vidas Secas']);
  });

  it('sorts by author', () => {
    expect(sortBooks(books, 'author').map((item) => item.author.name)).toEqual(['Graciliano Ramos', 'Jorge Amado', 'Machado de Assis']);
  });

  it('puts the newest first', () => {
    expect(sortBooks(books, 'newest').map((item) => item.year)).toEqual([1938, 1937, 1899]);
  });

  it('leaves the list it gets as it is', () => {
    sortBooks(books, 'title');
    expect(books.map((item) => item.id)).toEqual([1, 2, 3]);
  });
});
