import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { App } from '../App.tsx';

/** Renders the whole app at an address. */
export async function renderApp(path = '/') {
  const view = render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  );
  await screen.findByRole('navigation', { name: 'Main' });
  return view;
}
