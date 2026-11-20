import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { json, mockApi } from './test/mockApi.ts';
import { renderApp } from './test/renderApp.tsx';

async function fillBook(form: HTMLElement) {
  await userEvent.type(within(form).getByLabelText('Title'), 'Helena');
  await userEvent.type(within(form).getByLabelText('ISBN'), '978-85-0800-000-5');
  await userEvent.type(within(form).getByLabelText('Year'), '1876');
}

describe('a new book', () => {
  it('is added by an author the library has, picked from the list', async () => {
    const api = mockApi();
    await renderApp('/books/new');
    const form = screen.getByRole('form', { name: 'New book' });

    await fillBook(form);
    await userEvent.type(within(form).getByRole('combobox', { name: 'Author' }), 'mach');
    await userEvent.click(await screen.findByRole('option', { name: 'Machado de Assis' }));
    await userEvent.click(within(form).getByRole('button', { name: 'Add book' }));

    expect(await screen.findByText('Helena is in the collection')).toBeInTheDocument();
    expect(api.calls('POST', '/api/books')[0]!.body).toEqual({ title: 'Helena', authorId: 1, isbn: '978-85-0800-000-5', year: 1876, copies: 1 });
    expect(await screen.findByRole('heading', { name: 'Helena', level: 2 })).toBeInTheDocument();
  });

  it('is added by a new author when the name is not on the list', async () => {
    const api = mockApi();
    await renderApp('/books/new');
    const form = screen.getByRole('form', { name: 'New book' });

    await fillBook(form);
    await userEvent.type(within(form).getByRole('combobox', { name: 'Author' }), 'Aluísio Azevedo');
    expect(within(form).getByText('New author: Aluísio Azevedo')).toBeInTheDocument();
    await userEvent.click(within(form).getByRole('button', { name: 'Add book' }));

    await screen.findByText('Helena is in the collection');
    expect(api.calls('POST', '/api/books')[0]!.body).toMatchObject({ authorName: 'Aluísio Azevedo' });
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
