import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { mockApi } from './test/mockApi.ts';
import { renderApp } from './test/renderApp.tsx';

describe('the copies available on the book page', () => {
  it('go down by one as soon as a copy is lent', async () => {
    mockApi();
    await renderApp('/books/1');
    expect(await screen.findByText(/of 3 copies available/)).toHaveTextContent('2 of 3 copies available');
    const form = screen.getByRole('form', { name: 'Lend a copy' });

    await userEvent.selectOptions(within(form).getByRole('combobox', { name: 'Reader' }), 'Liam Carter · Grade 7');
    await userEvent.click(within(form).getByRole('button', { name: 'Lend' }));

    await screen.findByText('Copy B001-2 lent to Liam Carter until Mar 23, 2026');
    await waitFor(() => expect(screen.getByText(/of 3 copies available/)).toHaveTextContent('1 of 3 copies available'));
  });

  it('say none once the last copy is lent', async () => {
    mockApi();
    await renderApp('/books/2');
    expect(await screen.findByText(/of 2 copies available/)).toHaveTextContent('2 of 2 copies available');

    for (const reader of ['Liam Carter · Grade 7', 'Laura Mitchell · Teachers']) {
      const form = screen.getByRole('form', { name: 'Lend a copy' });
      await userEvent.selectOptions(within(form).getByRole('combobox', { name: 'Reader' }), reader);
      await userEvent.click(within(form).getByRole('button', { name: 'Lend' }));
      await screen.findByText(new RegExp(`lent to ${reader.split(' · ')[0]}`));
    }

    await waitFor(() => expect(screen.getByText(/of 2 copies available/)).toHaveTextContent('0 of 2 copies available'));
  });
});
