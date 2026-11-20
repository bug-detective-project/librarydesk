import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { mockApi } from './test/mockApi.ts';
import { renderApp } from './test/renderApp.tsx';

describe('the loans', () => {
  it('lists the copies out, the ones due first at the top', async () => {
    mockApi();
    await renderApp('/loans');

    const table = await screen.findByRole('table', { name: 'Loans' });
    const rows = within(table).getAllByRole('row').slice(1);
    expect(rows.map((row) => within(row).getAllByRole('link')[0]!.textContent)).toEqual(['Capitães da Areia', 'Dom Casmurro', 'Ou Isto ou Aquilo']);
    expect(rows[0]).toHaveTextContent('R$ 3,00');
  });

  it('has a tab with the overdue copies', async () => {
    mockApi();
    await renderApp('/loans');
    await screen.findByRole('table', { name: 'Loans' });

    await userEvent.click(screen.getByRole('link', { name: 'Overdue' }));

    const table = await screen.findByRole('table', { name: 'Overdue loans' });
    expect(within(table).getAllByRole('row')).toHaveLength(2);
  });

  it('takes a copy back and says so', async () => {
    const api = mockApi();
    await renderApp('/loans');
    await screen.findByRole('table', { name: 'Loans' });

    await userEvent.click(screen.getByRole('button', { name: 'Return Dom Casmurro' }));

    expect(await screen.findByText('Copy B001-1 is back on the shelf')).toBeInTheDocument();
    expect(api.calls('POST', '/api/loans/1/return')).toHaveLength(1);
    expect(await screen.findByTestId('loan-2')).toBeInTheDocument();
    expect(screen.queryByTestId('loan-1')).not.toBeInTheDocument();
  });

  it('says the fine when a late copy comes back', async () => {
    mockApi();
    await renderApp('/loans');
    await screen.findByRole('table', { name: 'Loans' });

    await userEvent.click(screen.getByRole('button', { name: 'Return Capitães da Areia' }));

    expect(await screen.findByText('Copy B003-1 is back, R$ 3,00 in fines')).toBeInTheDocument();
  });

  it('renews a loan and says the new due date', async () => {
    mockApi();
    await renderApp('/loans');
    await screen.findByRole('table', { name: 'Loans' });

    await userEvent.click(screen.getByRole('button', { name: 'Renew Dom Casmurro' }));

    expect(await screen.findByText('Dom Casmurro is renewed until Mar 23, 2026')).toBeInTheDocument();
    expect(await within(screen.getByTestId('loan-1')).findByText('Renewed 1×')).toBeInTheDocument();
  });

  it('says why a loan cannot be renewed', async () => {
    mockApi();
    await renderApp('/loans');
    await screen.findByRole('table', { name: 'Loans' });

    await userEvent.click(screen.getByRole('button', { name: 'Renew Capitães da Areia' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('The loan is overdue: return the copy first');
  });
});
