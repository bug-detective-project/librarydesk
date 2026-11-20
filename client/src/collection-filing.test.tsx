import { screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { Book } from './api/types.ts';
import { sortBooks } from './collection.ts';
import { mockApi } from './test/mockApi.ts';
import { renderApp } from './test/renderApp.tsx';

const book = (id: number, title: string): Book => ({ id, title, author: { id, name: 'Someone' }, isbn: '', year: 2000, copies: 1, available: 1, status: 'available' });

describe('sorting by title', () => {
  it('files a title without its leading article', () => {
    const books = [book(1, 'A Wrinkle in Time'), book(2, 'The Giver'), book(3, 'Holes'), book(4, 'Charlotte\'s Web'), book(5, 'An Ocean Apart')];

    expect(sortBooks(books, 'title').map((item) => item.title)).toEqual(['Charlotte\'s Web', 'The Giver', 'Holes', 'An Ocean Apart', 'A Wrinkle in Time']);
  });

  it('leaves a word that only starts like an article where it is', () => {
    const books = [book(1, 'Theo and the Tide'), book(2, 'Anatomy of a Kite'), book(3, 'Holes')];

    expect(sortBooks(books, 'title').map((item) => item.title)).toEqual(['Anatomy of a Kite', 'Holes', 'Theo and the Tide']);
  });

  it('orders the collection that way when it opens', async () => {
    mockApi();
    await renderApp('/');

    const list = await screen.findByRole('list', { name: 'Books' });
    expect(within(list).getAllByRole('heading').map((heading) => heading.textContent)).toEqual([
      'The Grapes of Wrath',
      'Number the Stars',
      'To Kill a Mockingbird',
      'Wonder',
      'A Wrinkle in Time',
    ]);
  });
});
