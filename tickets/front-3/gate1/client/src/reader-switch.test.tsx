import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { mockApi } from './test/mockApi.ts';
import { renderApp } from './test/renderApp.tsx';

describe('going from one reader to a classmate', () => {
  it('shows the loans of the classmate, not of the reader before', async () => {
    mockApi();
    await renderApp('/readers/1');
    expect(within(await screen.findByRole('table', { name: 'On loan' })).getByRole('link', { name: 'To Kill a Mockingbird' })).toBeInTheDocument();

    await userEvent.click(within(screen.getByRole('navigation', { name: 'Also in Grade 7' })).getByRole('link', { name: 'Liam Carter' }));

    expect(await screen.findByRole('heading', { name: 'Liam Carter', level: 2 })).toBeInTheDocument();
    const table = await screen.findByRole('table', { name: 'On loan' });
    expect(await within(table).findByRole('link', { name: 'Number the Stars' })).toBeInTheDocument();
    expect(within(table).queryByRole('link', { name: 'To Kill a Mockingbird' })).not.toBeInTheDocument();
  });

  it('and back again shows the first reader loans once more', async () => {
    mockApi();
    await renderApp('/readers/2');
    await within(await screen.findByRole('table', { name: 'On loan' })).findByRole('link', { name: 'Number the Stars' });

    await userEvent.click(within(screen.getByRole('navigation', { name: 'Also in Grade 7' })).getByRole('link', { name: 'Emma Johnson' }));

    await screen.findByRole('heading', { name: 'Emma Johnson', level: 2 });
    expect(await within(screen.getByRole('table', { name: 'On loan' })).findByRole('link', { name: 'To Kill a Mockingbird' })).toBeInTheDocument();
  });
});
