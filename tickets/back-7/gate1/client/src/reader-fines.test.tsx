import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { finesDue } from './format.ts';
import { json, mockApi } from './test/mockApi.ts';
import { renderApp } from './test/renderApp.tsx';

/** Two loans Noah brought back late, with their fines as the API sends them: decimal text. */
const LATE = [
  {
    id: 4,
    copy: { id: 4, code: 'B002-1' },
    book: { id: 2, title: 'The Grapes of Wrath' },
    reader: { id: 3, name: 'Noah Ramirez' },
    loanedOn: '2026-02-15',
    dueOn: '2026-03-01',
    returnedAt: '2026-03-04T15:15:00.000Z',
    renewals: 0,
    status: 'returned',
    fine: '0.75',
    finePaid: false,
  },
  {
    id: 5,
    copy: { id: 6, code: 'B003-2' },
    book: { id: 3, title: 'Number the Stars' },
    reader: { id: 3, name: 'Noah Ramirez' },
    loanedOn: '2026-02-16',
    dueOn: '2026-03-02',
    returnedAt: '2026-03-06T15:15:00.000Z',
    renewals: 0,
    status: 'returned',
    fine: '1.00',
    finePaid: false,
  },
];

describe('the fines of a reader', () => {
  it('add up the amounts, whatever form the API sends them in', () => {
    expect(finesDue(LATE)).toBe(1.75);
    expect(finesDue([LATE[0]!, { ...LATE[1]!, finePaid: true }])).toBe(0.75);
  });

  it('show the total of two late books in dollars', async () => {
    mockApi({ respond: (request) => (request.method === 'GET' && request.path === '/api/readers/3/loans' ? json(LATE) : undefined) });
    await renderApp('/readers/3');

    const fines = await screen.findByRole('region', { name: 'Fines' });
    expect(fines).toHaveTextContent('$1.75');
    expect(fines).not.toHaveTextContent('NaN');
    expect(screen.getByRole('button', { name: 'Pay fines' })).toBeInTheDocument();
  });
});
