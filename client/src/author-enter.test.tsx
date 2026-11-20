import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { mockApi } from './test/mockApi.ts';
import { renderApp } from './test/renderApp.tsx';

describe('Enter in the author field', () => {
  it('picks the highlighted author and does not send the form', async () => {
    const api = mockApi();
    await renderApp('/books/new');
    const form = screen.getByRole('form', { name: 'New book' });
    const author = within(form).getByRole('combobox', { name: 'Author' });

    await userEvent.type(author, 'harp');
    await screen.findByRole('option', { name: 'Harper Lee' });
    await userEvent.keyboard('{ArrowDown}{Enter}');

    expect(author).toHaveValue('Harper Lee');
    expect(screen.queryByRole('listbox', { name: 'Authors' })).not.toBeInTheDocument();
    expect(api.calls('POST', '/api/books')).toEqual([]);
    expect(screen.getByRole('form', { name: 'New book' })).toBeInTheDocument();
  });

  it('keeps a name that is not on the list as a new author, and does not send the form', async () => {
    const api = mockApi();
    await renderApp('/books/new');
    const form = screen.getByRole('form', { name: 'New book' });

    await userEvent.type(within(form).getByRole('combobox', { name: 'Author' }), 'Louisa May Alcott{Enter}');

    expect(within(form).getByText('New author: Louisa May Alcott')).toBeInTheDocument();
    expect(api.calls('POST', '/api/books')).toEqual([]);
  });
});
