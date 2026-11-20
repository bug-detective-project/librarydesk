import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { mockApi } from './test/mockApi.ts';
import { renderApp } from './test/renderApp.tsx';

const titles = () =>
  within(screen.getByRole('list', { name: 'Books' }))
    .getAllByRole('heading')
    .map((heading) => heading.textContent);

describe('the collection', () => {
  it('shows every book with its author and how many copies are in', async () => {
    mockApi();
    await renderApp('/');

    const card = await screen.findByTestId('book-1');
    expect(within(card).getByRole('link', { name: 'To Kill a Mockingbird' })).toHaveAttribute('href', '/books/1');
    expect(card).toHaveTextContent('Harper Lee');
    expect(card).toHaveTextContent('2 of 3 in');
    expect(screen.getByTestId('book-4')).toHaveTextContent('0 of 1 in');
  });

  it('searches the API as the librarian types', async () => {
    const api = mockApi();
    await renderApp('/');
    await screen.findByTestId('book-1');

    await userEvent.type(screen.getByRole('searchbox', { name: 'Search the collection' }), 'lowry');

    await waitFor(() => expect(titles()).toEqual(['Number the Stars']));
    expect(api.calls('GET', '/api/books').at(-1)!.query.get('q')).toBe('lowry');
  });

  it('says so when no book matches', async () => {
    mockApi();
    await renderApp('/');
    await screen.findByTestId('book-1');

    await userEvent.type(screen.getByRole('searchbox', { name: 'Search the collection' }), 'zzz');

    expect(await screen.findByText('No book matches “zzz”.')).toBeInTheDocument();
  });

  it('sorts by author and by the newest', async () => {
    mockApi();
    await renderApp('/');
    await screen.findByTestId('book-1');

    await userEvent.selectOptions(screen.getByRole('combobox', { name: 'Sort by' }), 'author');
    expect(titles()[0]).toBe('To Kill a Mockingbird');

    await userEvent.selectOptions(screen.getByRole('combobox', { name: 'Sort by' }), 'newest');
    expect(titles()[0]).toBe('Wonder');
  });
});
