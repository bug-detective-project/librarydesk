import { expect } from '@playwright/test';
import type { APIRequestContext, Locator, Page } from '@playwright/test';

/**
 * What every Gate 2 spec knows about the app: the sample library of `npm run db:reset` on the QA's
 * day, Monday 2026-03-09 (LIBRARYDESK_TODAY), and the requests and pages the specs share.
 */
export const TODAY = '2026-03-09';

export type Status = 'available' | 'on_loan' | 'reserved' | 'overdue' | 'returned';

export interface Book {
  id: number;
  title: string;
  author: { id: number; name: string };
  isbn: string;
  year: number;
  copies: number;
  available: number;
  status: 'available' | 'on_loan' | 'reserved';
}

export interface BookDetails extends Book {
  copyList: { id: number; code: string; status: 'available' | 'on_loan' | 'overdue'; loan: { id: number; dueOn: string; reader: { id: number; name: string } } | null }[];
  reservations: { id: number; position: number; reader: { id: number; name: string }; createdAt: string }[];
}

export interface Loan {
  id: number;
  copy: { id: number; code: string };
  book: { id: number; title: string };
  reader: { id: number; name: string };
  loanedOn: string;
  dueOn: string;
  returnedAt: string | null;
  renewals: number;
  status: 'on_loan' | 'overdue' | 'returned';
  fine: string;
  finePaid: boolean;
}

/** The readers of the sample library, by the id `npm run db:reset` gives them. */
export const READERS = {
  emma: { id: 1, name: 'Emma Johnson', group: 'Grade 7' },
  liam: { id: 2, name: 'Liam Carter', group: 'Grade 7' },
  olivia: { id: 3, name: 'Olivia Bennett', group: 'Grade 7' },
  noah: { id: 4, name: 'Noah Ramirez', group: 'Grade 8' },
  ava: { id: 5, name: 'Ava Thompson', group: 'Grade 8' },
  ethan: { id: 6, name: 'Ethan Brooks', group: 'Grade 6' },
  sophia: { id: 7, name: 'Sophia Nguyen', group: 'Grade 6' },
  laura: { id: 8, name: 'Laura Mitchell', group: 'Teachers' },
  david: { id: 9, name: 'David Kim', group: 'Teachers' },
} as const;

/**
 * The books of the sample library, by id, and what the QA's day finds on the shelf:
 * - To Kill a Mockingbird (1): 3 copies, Emma has B001-1 until Mar 13.
 * - Of Mice and Men (2): David has B002-1, overdue since Mar 7.
 * - Number the Stars (5): 3 copies, Liam has B005-1, overdue since Mar 3.
 * - Holes (6): Olivia has B006-1, due today.
 * - A Wrinkle in Time (9): its only copy is with Sophia until Mar 16, and Emma waits for it.
 * - Wonder (12): Ethan has B012-1 until Mar 19, renewed twice already.
 * - Fahrenheit 451 (13): its only copy is with Laura until Mar 21; nobody waits.
 * - Noah owes $1.75: Hatchet (7) came back 3 days late ($0.75) and Charlotte's Web (8) 4 days late ($1.00).
 * - Ava's fine for The Outsiders (10) is paid.
 */
export const BOOKS = {
  mockingbird: { id: 1, title: 'To Kill a Mockingbird' },
  mice: { id: 2, title: 'Of Mice and Men' },
  grapes: { id: 3, title: 'The Grapes of Wrath' },
  giver: { id: 4, title: 'The Giver' },
  stars: { id: 5, title: 'Number the Stars' },
  holes: { id: 6, title: 'Holes' },
  hatchet: { id: 7, title: 'Hatchet' },
  charlotte: { id: 8, title: "Charlotte's Web" },
  wrinkle: { id: 9, title: 'A Wrinkle in Time' },
  outsiders: { id: 10, title: 'The Outsiders' },
  terabithia: { id: 11, title: 'Bridge to Terabithia' },
  wonder: { id: 12, title: 'Wonder' },
  fahrenheit: { id: 13, title: 'Fahrenheit 451' },
  readingSteinbeck: { id: 14, title: 'Reading Steinbeck' },
  gatsby: { id: 15, title: 'The Great Gatsby' },
} as const;

async function json<T>(response: Awaited<ReturnType<APIRequestContext['get']>>, what: string, status = 200): Promise<T> {
  expect(response.status(), `${what}: ${await response.text()}`).toBe(status);
  return (await response.json()) as T;
}

export async function listBooks(request: APIRequestContext, q?: string): Promise<Book[]> {
  return json<Book[]>(await request.get('/api/books', { params: q === undefined ? {} : { q } }), `GET /api/books?q=${q ?? ''}`);
}

export async function getBook(request: APIRequestContext, id: number): Promise<BookDetails> {
  return json<BookDetails>(await request.get(`/api/books/${id}`), `GET /api/books/${id}`);
}

export async function listLoans(request: APIRequestContext, status: 'active' | 'overdue'): Promise<Loan[]> {
  return json<Loan[]>(await request.get('/api/loans', { params: { status } }), `GET /api/loans?status=${status}`);
}

export async function readerLoans(request: APIRequestContext, readerId: number): Promise<Loan[]> {
  return json<Loan[]>(await request.get(`/api/readers/${readerId}/loans`), `GET /api/readers/${readerId}/loans`);
}

/** The loan a reader has open for a book. */
export async function openLoanOf(request: APIRequestContext, readerId: number, title: string): Promise<Loan> {
  const loan = (await readerLoans(request, readerId)).find((item) => item.book.title === title && !item.returnedAt);
  expect(loan, `an open loan of ${title} for reader ${readerId}`).toBeDefined();
  return loan!;
}

/** The id of a copy, by the code on its label ('B001-2'). */
export async function copyId(request: APIRequestContext, bookId: number, code: string): Promise<number> {
  const copy = (await getBook(request, bookId)).copyList.find((item) => item.code === code);
  expect(copy, `copy ${code} of book ${bookId}`).toBeDefined();
  return copy!.id;
}

/** Opens the collection and waits for its cards. */
export async function openCollection(page: Page): Promise<void> {
  await page.goto('/');
  await expect(page.getByRole('list', { name: 'Books' })).toBeVisible();
}

/** The titles of the collection, in the order the cards show them. */
export function titlesShown(page: Page): Promise<string[]> {
  return page.getByRole('list', { name: 'Books' }).getByRole('heading', { level: 3 }).allTextContents();
}

/** Opens the page of a book and waits for its title. */
export async function openBook(page: Page, id: number, title: string): Promise<void> {
  await page.goto(`/books/${id}`);
  await expect(page.getByRole('heading', { level: 2, name: title })).toBeVisible();
}

/** Opens the page of a reader and waits for the books they have. */
export async function openReader(page: Page, id: number, name: string): Promise<void> {
  await page.goto(`/readers/${id}`);
  await expect(page.getByRole('heading', { level: 2, name })).toBeVisible();
}

/** Opens the loans (the On loan tab, or Overdue) and waits for the table. */
export async function openLoans(page: Page, tab: 'active' | 'overdue' = 'active'): Promise<Locator> {
  await page.goto(tab === 'overdue' ? '/loans/overdue' : '/loans');
  const table = page.getByRole('table', { name: tab === 'overdue' ? 'Overdue loans' : 'Loans' });
  await expect(table).toBeVisible();
  return table;
}

export interface Box {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** Where an element is on the page; fails when it is not rendered. */
export async function boxOf(locator: Locator, what: string): Promise<Box> {
  const box = await locator.boundingBox();
  expect(box, `${what} must be on the page`).not.toBeNull();
  return box!;
}

/** Waits until the browser has rendered at least two more frames. */
export async function settle(page: Page): Promise<void> {
  await page.evaluate(() => new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
}
