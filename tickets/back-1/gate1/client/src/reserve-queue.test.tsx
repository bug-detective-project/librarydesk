import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { mockApi } from './test/mockApi.ts';
import { renderApp } from './test/renderApp.tsx';

describe('reserving a book with every copy out', () => {
  it('puts the reader in the queue and says their place', async () => {
    const api = mockApi();
    await renderApp('/books/4');
    const form = await screen.findByRole('form', { name: 'Reserve' });

    await userEvent.selectOptions(within(form).getByRole('combobox', { name: 'Reader' }), 'Liam Carter · Grade 7');
    await userEvent.click(within(form).getByRole('button', { name: 'Reserve' }));

    expect(await screen.findByText('Liam Carter is number 2 in the queue for A Wrinkle in Time')).toBeInTheDocument();
    expect(api.calls('POST', '/api/books/4/reservations')[0]!.body).toEqual({ readerId: 2 });
    const queue = screen.getByRole('list', { name: 'Queue' });
    expect(await within(queue).findByRole('link', { name: 'Liam Carter' })).toBeInTheDocument();
    expect(screen.queryByText(/is put aside for Liam Carter/)).not.toBeInTheDocument();
  });

  it('still puts a copy aside when one is in', async () => {
    mockApi();
    await renderApp('/books/2');
    const form = await screen.findByRole('form', { name: 'Reserve' });

    await userEvent.selectOptions(within(form).getByRole('combobox', { name: 'Reader' }), 'Laura Mitchell · Teachers');
    await userEvent.click(within(form).getByRole('button', { name: 'Reserve' }));

    expect(await screen.findByText('A copy of The Grapes of Wrath is put aside for Laura Mitchell')).toBeInTheDocument();
  });
});
