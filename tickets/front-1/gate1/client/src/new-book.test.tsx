import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { json, mockApi } from './test/mockApi.ts';
import { renderApp } from './test/renderApp.tsx';

async function fillBook(form: HTMLElement) {
  await userEvent.type(within(form).getByLabelText('Title'), 'Go Set a Watchman');
  await userEvent.type(within(form).getByLabelText('ISBN'), '9780306406157');
  await userEvent.type(within(form).getByLabelText('Year'), '2015');
}

describe('a new book', () => {
  it('is added by an author the library has, picked from the list', async () => {
    const api = mockApi();
    await renderApp('/books/new');
    const form = screen.getByRole('form', { name: 'New book' });

    await fillBook(form);
    await userEvent.type(within(form).getByRole('combobox', { name: 'Author' }), 'harp');
    await userEvent.click(await screen.findByRole('option', { name: 'Harper Lee' }));
    await userEvent.click(within(form).getByRole('button', { name: 'Add book' }));

    expect(await screen.findByText('Go Set a Watchman is in the collection')).toBeInTheDocument();
    expect(api.calls('POST', '/api/books')[0]!.body).toEqual({ title: 'Go Set a Watchman', authorId: 1, isbn: '978-0-3064-0615-7', year: 2015, copies: 1 });
    expect(await screen.findByRole('heading', { name: 'Go Set a Watchman', level: 2 })).toBeInTheDocument();
  });

  it('is added by a new author when the name is not on the list', async () => {
    const api = mockApi();
    await renderApp('/books/new');
    const form = screen.getByRole('form', { name: 'New book' });

    await fillBook(form);
    await userEvent.type(within(form).getByRole('combobox', { name: 'Author' }), 'Louisa May Alcott');
    expect(within(form).getByText('New author: Louisa May Alcott')).toBeInTheDocument();
    await userEvent.click(within(form).getByRole('button', { name: 'Add book' }));

    await screen.findByText('Go Set a Watchman is in the collection');
    expect(api.calls('POST', '/api/books')[0]!.body).toMatchObject({ authorName: 'Louisa May Alcott' });
  });

  it('puts the dashes in the ISBN as it is typed, and takes only digits', async () => {
    mockApi();
    await renderApp('/books/new');
    const isbn = within(screen.getByRole('form', { name: 'New book' })).getByLabelText('ISBN');

    await userEvent.type(isbn, '9780a306 40615 7999');

    expect(isbn).toHaveValue('978-0-3064-0615-7');
  });

  it('shows what the API says about each field', async () => {
    mockApi({
      respond: (request) =>
        request.method === 'POST' && request.path === '/api/books'
          ? json({ error: 'Some fields need a look', fields: { isbn: 'Type the 13 digits of the ISBN, with or without dashes' } }, 400)
          : undefined,
    });
    await renderApp('/books/new');
    const form = screen.getByRole('form', { name: 'New book' });

    await fillBook(form);
    await userEvent.click(within(form).getByRole('button', { name: 'Add book' }));

    expect(await within(form).findByText('Type the 13 digits of the ISBN, with or without dashes')).toBeInTheDocument();
    expect(within(form).getByLabelText('ISBN')).toHaveAttribute('aria-invalid', 'true');
  });
});
