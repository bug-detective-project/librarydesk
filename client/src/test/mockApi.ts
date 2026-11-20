import { vi } from 'vitest';
import type { Book, BookDetails, Copy, Loan, ReaderDetails, ReaderSummary } from '../api/types.ts';

/** The day every client test calls today: a Monday. */
export const TODAY = '2026-03-09';

export interface MockRequest {
  method: string;
  path: string;
  query: URLSearchParams;
  body: unknown;
}

export function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
}

function addDays(day: string, n: number): string {
  const date = new Date(`${day}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + n);
  return date.toISOString().slice(0, 10);
}

const AUTHORS = [
  { id: 1, name: 'Harper Lee' },
  { id: 2, name: 'John Steinbeck' },
  { id: 3, name: 'Lois Lowry' },
  { id: 4, name: 'Madeleine L\'Engle' },
  { id: 5, name: 'R. J. Palacio' },
];

/** [id, title, author, year, copies] */
const BOOKS: [number, string, number, number, number][] = [
  [1, 'To Kill a Mockingbird', 1, 1960, 3],
  [2, 'The Grapes of Wrath', 2, 1939, 2],
  [3, 'Number the Stars', 3, 1989, 2],
  [4, 'A Wrinkle in Time', 4, 1962, 1],
  [5, 'Wonder', 5, 2012, 1],
];

const READERS = [
  { id: 1, name: 'Emma Johnson', group: 'Grade 7', card: 'R-0001' },
  { id: 2, name: 'Liam Carter', group: 'Grade 7', card: 'R-0002' },
  { id: 3, name: 'Noah Ramirez', group: 'Grade 8', card: 'R-0003' },
  { id: 4, name: 'Laura Mitchell', group: 'Teachers', card: 'R-0004' },
];

/** A loan as the API sends it: the fine is decimal text, the way MySQL gives it back ('0.75'). */
type ApiLoan = Omit<Loan, 'fine'> & { fine: string };

interface StoredLoan {
  id: number;
  copyId: number;
  readerId: number;
  loanedOn: string;
  dueOn: string;
  returnedAt: string | null;
  renewals: number;
  fine: string;
  finePaid: boolean;
}

/**
 * Replaces the global fetch with an in-memory LibraryDesk API on Monday 2026-03-09. Emma has To
 * Kill a Mockingbird (B001-1); Liam has Number the Stars (B003-1), overdue; Laura has the only copy
 * of A Wrinkle in Time, and Emma waits for it; Noah brought The Grapes of Wrath back late and owes $0.75.
 */
export function mockApi(options: { respond?: (request: MockRequest) => Response | undefined | Promise<Response | undefined> } = {}) {
  const authors = AUTHORS.map((author) => ({ ...author }));
  const books = BOOKS.map(([id, title, authorId, year]) => ({ id, title, authorId, year, isbn: `978-0-0000-000${id}-0` }));
  const copies: { id: number; bookId: number; code: string }[] = [];
  for (const [bookId, , , , count] of BOOKS) {
    for (let n = 1; n <= count; n++) {
      copies.push({ id: copies.length + 1, bookId, code: `B00${bookId}-${n}` });
    }
  }
  const copyByCode = (code: string) => copies.find((copy) => copy.code === code)!;
  const loans: StoredLoan[] = [
    { id: 1, copyId: copyByCode('B001-1').id, readerId: 1, loanedOn: addDays(TODAY, -10), dueOn: addDays(TODAY, 4), returnedAt: null, renewals: 0, fine: '0.00', finePaid: false },
    { id: 2, copyId: copyByCode('B003-1').id, readerId: 2, loanedOn: addDays(TODAY, -20), dueOn: addDays(TODAY, -6), returnedAt: null, renewals: 0, fine: '0.00', finePaid: false },
    { id: 3, copyId: copyByCode('B004-1').id, readerId: 4, loanedOn: addDays(TODAY, -7), dueOn: addDays(TODAY, 7), returnedAt: null, renewals: 0, fine: '0.00', finePaid: false },
    { id: 4, copyId: copyByCode('B002-1').id, readerId: 3, loanedOn: addDays(TODAY, -22), dueOn: addDays(TODAY, -8), returnedAt: `${addDays(TODAY, -5)}T15:15:00.000Z`, renewals: 0, fine: '0.75', finePaid: false },
  ];
  const reservations = [{ id: 1, bookId: 4, readerId: 1, createdAt: `${addDays(TODAY, -1)}T12:00:00.000Z` }];
  const requests: MockRequest[] = [];

  const openLoanOf = (copyId: number) => loans.find((loan) => loan.copyId === copyId && !loan.returnedAt);
  const loanStatus = (loan: StoredLoan): Loan['status'] => (loan.returnedAt ? 'returned' : loan.dueOn < TODAY ? 'overdue' : 'on_loan');
  const reader = (id: number) => READERS.find((one) => one.id === id)!;

  function copyView(copy: (typeof copies)[number]): Copy {
    const loan = openLoanOf(copy.id);
    return {
      id: copy.id,
      code: copy.code,
      status: loan ? (loanStatus(loan) as Copy['status']) : 'available',
      loan: loan ? { id: loan.id, dueOn: loan.dueOn, reader: { id: loan.readerId, name: reader(loan.readerId).name } } : null,
    };
  }

  function bookView(book: (typeof books)[number]): Book {
    const own = copies.filter((copy) => copy.bookId === book.id);
    const available = own.filter((copy) => !openLoanOf(copy.id)).length;
    const waiting = reservations.filter((item) => item.bookId === book.id).length;
    return {
      id: book.id,
      title: book.title,
      author: authors.find((author) => author.id === book.authorId)!,
      isbn: book.isbn,
      year: book.year,
      copies: own.length,
      available,
      status: available > 0 ? 'available' : waiting > 0 ? 'reserved' : 'on_loan',
    };
  }

  function bookDetails(book: (typeof books)[number]): BookDetails {
    return {
      ...bookView(book),
      copyList: copies.filter((copy) => copy.bookId === book.id).map(copyView),
      reservations: reservations
        .filter((item) => item.bookId === book.id)
        .map((item, index) => ({ id: item.id, position: index + 1, reader: { id: item.readerId, name: reader(item.readerId).name }, createdAt: item.createdAt })),
    };
  }

  function loanView(loan: StoredLoan): ApiLoan {
    const copy = copies.find((one) => one.id === loan.copyId)!;
    const book = books.find((one) => one.id === copy.bookId)!;
    const lateDays = Math.max(0, Math.round((Date.parse(TODAY) - Date.parse(loan.dueOn)) / 86_400_000));
    return {
      id: loan.id,
      copy: { id: copy.id, code: copy.code },
      book: { id: book.id, title: book.title },
      reader: { id: loan.readerId, name: reader(loan.readerId).name },
      loanedOn: loan.loanedOn,
      dueOn: loan.dueOn,
      returnedAt: loan.returnedAt,
      renewals: loan.renewals,
      status: loanStatus(loan),
      fine: loan.returnedAt ? loan.fine : (lateDays * 0.25).toFixed(2),
      finePaid: loan.finePaid,
    };
  }

  function readerSummary(one: (typeof READERS)[number]): ReaderSummary {
    const own = loans.filter((loan) => loan.readerId === one.id);
    return { ...one, openLoans: own.filter((loan) => !loan.returnedAt).length, overdueLoans: own.filter((loan) => !loan.returnedAt && loan.dueOn < TODAY).length, hasFines: own.some((loan) => loan.returnedAt && Number(loan.fine) > 0 && !loan.finePaid) };
  }

  function readerDetails(one: (typeof READERS)[number]): ReaderDetails {
    return {
      ...readerSummary(one),
      classmates: READERS.filter((other) => other.group === one.group && other.id !== one.id).map((other) => ({ id: other.id, name: other.name })),
      reservations: reservations
        .filter((item) => item.readerId === one.id)
        .map((item) => ({ id: item.id, book: { id: item.bookId, title: books.find((book) => book.id === item.bookId)!.title } })),
    };
  }

  function handle({ method, path, query, body }: MockRequest): Response {
    const data = (body ?? {}) as Record<string, unknown>;
    const route = `${method} ${path.replace(/\/\d+(?=\/|$)/, '/:id')}`;
    const id = Number(path.match(/\/(\d+)(?=\/|$)/)?.[1]);
    const q = (query.get('q') ?? '').toLowerCase();

    switch (route) {
      case 'GET /api/today':
        return json({ today: TODAY });
      case 'GET /api/books':
        return json(books.filter((book) => !q || book.title.toLowerCase().includes(q) || bookView(book).author.name.toLowerCase().includes(q)).map(bookView));
      case 'GET /api/books/:id': {
        const book = books.find((one) => one.id === id);
        return book ? json(bookDetails(book)) : json({ error: 'There is no such book' }, 404);
      }
      case 'POST /api/books': {
        const authorId = typeof data.authorId === 'number' ? data.authorId : authors.push({ id: authors.length + 1, name: String(data.authorName) }) && authors.length;
        const book = { id: books.length + 1, title: String(data.title), authorId, year: Number(data.year), isbn: String(data.isbn) };
        books.push(book);
        for (let n = 1; n <= Number(data.copies); n++) {
          copies.push({ id: copies.length + 1, bookId: book.id, code: `B00${book.id}-${n}` });
        }
        return json(bookDetails(book), 201);
      }
      case 'GET /api/authors':
        return json(authors.filter((author) => author.name.toLowerCase().includes(q)));
      case 'POST /api/books/:id/reservations': {
        const details = bookDetails(books.find((one) => one.id === id)!);
        reservations.push({ id: reservations.length + 1, bookId: id, readerId: Number(data.readerId), createdAt: `${TODAY}T14:15:00.000Z` });
        return json({ id: reservations.length, position: details.reservations.length + 1, ready: details.available > 0 }, 201);
      }
      case 'GET /api/readers':
        return json(READERS.filter((one) => !q || one.name.toLowerCase().includes(q) || one.card.toLowerCase().includes(q)).map(readerSummary));
      case 'GET /api/readers/:id': {
        const one = READERS.find((item) => item.id === id);
        return one ? json(readerDetails(one)) : json({ error: 'There is no such reader' }, 404);
      }
      case 'GET /api/readers/:id/loans':
        return json(loans.filter((loan) => loan.readerId === id).map(loanView));
      case 'POST /api/readers/:id/fines/pay': {
        const owed = loans.filter((loan) => loan.readerId === id && loan.returnedAt && !loan.finePaid && Number(loan.fine) > 0);
        owed.forEach((loan) => (loan.finePaid = true));
        return json({ paid: owed.length });
      }
      case 'GET /api/loans': {
        const open = loans.filter((loan) => !loan.returnedAt && (query.get('status') !== 'overdue' || loan.dueOn < TODAY));
        return json(open.sort((a, b) => a.dueOn.localeCompare(b.dueOn)).map(loanView));
      }
      case 'POST /api/loans': {
        const loan: StoredLoan = { id: loans.length + 1, copyId: Number(data.copyId), readerId: Number(data.readerId), loanedOn: TODAY, dueOn: addDays(TODAY, 14), returnedAt: null, renewals: 0, fine: '0.00', finePaid: false };
        loans.push(loan);
        return json(loanView(loan), 201);
      }
      case 'POST /api/loans/:id/return': {
        const loan = loans.find((one) => one.id === id)!;
        const fine = loanView(loan).fine;
        Object.assign(loan, { returnedAt: `${TODAY}T14:15:00.000Z`, fine });
        return json(loanView(loan));
      }
      case 'POST /api/loans/:id/renew': {
        const loan = loans.find((one) => one.id === id)!;
        if (loan.dueOn < TODAY) {
          return json({ error: 'The loan is overdue: return the copy first' }, 409);
        }
        Object.assign(loan, { dueOn: addDays(TODAY, 14), renewals: loan.renewals + 1 });
        return json(loanView(loan));
      }
      default:
        return json({ error: 'Not found' }, 404);
    }
  }

  const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = new URL(String(input), 'http://localhost');
    const request: MockRequest = {
      method: init?.method ?? 'GET',
      path: url.pathname,
      query: url.searchParams,
      body: typeof init?.body === 'string' ? JSON.parse(init.body) : undefined,
    };
    requests.push(request);
    return (await options.respond?.(request)) ?? handle(request);
  });
  vi.stubGlobal('fetch', fetchMock);

  return {
    requests,
    /** The requests made with this method to this path, such as ('POST', '/api/loans'). */
    calls: (method: string, path: string) => requests.filter((request) => request.method === method && request.path === path),
  };
}
