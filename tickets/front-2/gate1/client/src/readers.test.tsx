import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { mockApi } from './test/mockApi.ts';
import { renderApp } from './test/renderApp.tsx';

describe('readers', () => {
  it('are listed with their class, card, books out and fines', async () => {
    mockApi();
    await renderApp('/readers');

    const ana = await screen.findByTestId('reader-1');
    expect(within(ana).getByRole('link', { name: 'Emma Johnson' })).toHaveAttribute('href', '/readers/1');
    expect(ana).toHaveTextContent('Grade 7');
    expect(ana).toHaveTextContent('R-0001');
    expect(ana).toHaveTextContent('Out1 book');
    expect(screen.getByTestId('reader-2')).toHaveTextContent('Overdue1');
    expect(screen.getByTestId('reader-3')).toHaveTextContent('Fines due');
    expect(ana).not.toHaveTextContent('Fines due');
  });

  it('are found by name', async () => {
    mockApi();
    await renderApp('/readers');
    await screen.findByTestId('reader-1');

    await userEvent.type(screen.getByRole('searchbox', { name: 'Search readers' }), 'laura');

    await waitFor(() => expect(screen.queryByTestId('reader-1')).not.toBeInTheDocument());
    expect(screen.getByTestId('reader-4')).toBeInTheDocument();
  });

  it('are filtered by class', async () => {
    mockApi();
    await renderApp('/readers');
    await screen.findByTestId('reader-1');

    await userEvent.click(screen.getByRole('button', { name: 'Teachers' }));

    expect(screen.getByRole('button', { name: 'Teachers' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.queryByTestId('reader-1')).not.toBeInTheDocument();
    expect(screen.getByTestId('reader-4')).toBeInTheDocument();
  });
});

describe('the reader page', () => {
  it('shows the books a reader has, what they wait for and their classmates', async () => {
    mockApi();
    await renderApp('/readers/1');

    expect(await screen.findByRole('heading', { name: 'Emma Johnson', level: 2 })).toBeInTheDocument();
    const out = screen.getByRole('table', { name: 'On loan' });
    expect(within(out).getByRole('link', { name: 'To Kill a Mockingbird' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'A Wrinkle in Time' })).toHaveAttribute('href', '/books/4');
    expect(screen.getByRole('navigation', { name: 'Also in Grade 7' })).toHaveTextContent('Liam Carter');
  });

  it('shows the fine a reader owes, and marks it paid after asking', async () => {
    const api = mockApi();
    await renderApp('/readers/3');

    const fines = await screen.findByRole('region', { name: 'Fines' });
    expect(fines).toHaveTextContent('$0.75');

    await userEvent.click(within(fines).getByRole('button', { name: 'Pay fines' }));
    const dialog = screen.getByRole('alertdialog', { name: 'Mark the fines as paid' });
    expect(dialog).toHaveTextContent('Noah Ramirez pays $0.75 at the desk.');
    await userEvent.click(within(dialog).getByRole('button', { name: 'Mark as paid' }));

    expect(await screen.findByText('$0.75 in fines paid')).toBeInTheDocument();
    expect(api.calls('POST', '/api/readers/3/fines/pay')).toHaveLength(1);
    await waitFor(() => expect(screen.getByRole('region', { name: 'Fines' })).toHaveTextContent('$0.00'));
  });

  it('keeps the fines when the librarian cancels', async () => {
    const api = mockApi();
    await renderApp('/readers/3');

    await userEvent.click(await screen.findByRole('button', { name: 'Pay fines' }));
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
    expect(api.calls('POST', '/api/readers/3/fines/pay')).toHaveLength(0);
  });
});
