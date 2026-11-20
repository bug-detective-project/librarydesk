import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { mockApi } from './test/mockApi.ts';
import { renderApp } from './test/renderApp.tsx';

describe('the book page', () => {
  it('shows each copy, who has it and until when', async () => {
    mockApi();
    await renderApp('/books/1');

    expect(await screen.findByRole('heading', { name: 'Dom Casmurro', level: 2 })).toBeInTheDocument();
    const lent = screen.getByTestId('copy-B001-1');
    expect(within(lent).getByRole('link', { name: 'Ana Souza' })).toHaveAttribute('href', '/readers/1');
    expect(lent).toHaveTextContent('until Mar 13, 2026');
    expect(screen.getByTestId('copy-B001-2')).not.toHaveTextContent('until');
  });

  it('says how many copies are on the shelf', async () => {
    mockApi();
    await renderApp('/books/1');

    expect(await screen.findByText(/of 3 copies available/)).toHaveTextContent('2 of 3 copies available');
  });

  it('lends the first copy on the shelf to the reader picked, and says until when', async () => {
    const api = mockApi();
    await renderApp('/books/1');
    const form = await screen.findByRole('form', { name: 'Lend a copy' });

    await userEvent.selectOptions(within(form).getByRole('combobox', { name: 'Reader' }), 'Bruno Lima · Class 7B');
    await userEvent.click(within(form).getByRole('button', { name: 'Lend' }));

    expect(await screen.findByText('Copy B001-2 lent to Bruno Lima until Mar 23, 2026')).toBeInTheDocument();
    expect(api.calls('POST', '/api/loans')[0]!.body).toEqual({ copyId: 2, readerId: 2 });
    expect(await within(screen.getByTestId('copy-B001-2')).findByRole('link', { name: 'Bruno Lima' })).toBeInTheDocument();
  });

  it('shows the queue of a book and says when every copy is out', async () => {
    mockApi();
    await renderApp('/books/4');

    const queue = await screen.findByRole('list', { name: 'Queue' });
    expect(within(queue).getByRole('link', { name: 'Ana Souza' })).toBeInTheDocument();
    expect(screen.getByText('Every copy is out. Reserve the book to join the queue.')).toBeInTheDocument();
  });

  it('puts a copy aside for a reader when the book is on the shelf', async () => {
    const api = mockApi();
    await renderApp('/books/2');
    const form = await screen.findByRole('form', { name: 'Reserve' });

    await userEvent.selectOptions(within(form).getByRole('combobox', { name: 'Reader' }), 'Helena Castro · Teachers');
    await userEvent.click(within(form).getByRole('button', { name: 'Reserve' }));

    expect(await screen.findByText('A copy of O Tempo e o Vento is put aside for Helena Castro')).toBeInTheDocument();
    expect(api.calls('POST', '/api/books/2/reservations')[0]!.body).toEqual({ readerId: 4 });
  });

  it('says when the book does not exist', async () => {
    mockApi();
    await renderApp('/books/99');

    expect(await screen.findByText('There is no such book')).toBeInTheDocument();
  });
});
