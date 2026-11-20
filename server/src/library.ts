/**
 * The rules of the desk: lending, returning, renewing, reserving and paying fines. The routes only
 * read the request and call these.
 */
import { Op } from 'sequelize';
import type { Includeable } from 'sequelize';
import { addDays, now, today } from './clock.ts';
import { ConflictError, InvalidError, NotFoundError } from './errors.ts';
import { LOAN_DAYS, MAX_RENEWALS, dollars, fineFor } from './fines.ts';
import { parseIsbn } from './isbn.ts';
import { Author, Book, Copy, Loan, Reader, Reservation } from './models.ts';
import { bookDetails, bookSummary, loanView, readerSummary } from './views.ts';

const loansOut: Includeable = { model: Loan, as: 'loans', where: { returnedAt: null }, required: false, include: [{ model: Reader, as: 'reader' }] };
const bookIncludes: Includeable[] = [
  { model: Author, as: 'author' },
  { model: Copy, as: 'copies', include: [loansOut] },
  { model: Reservation, as: 'reservations', where: { fulfilledAt: null }, required: false, include: [{ model: Reader, as: 'reader' }] },
];
const loanIncludes: Includeable[] = [
  { model: Copy, as: 'copy', include: [{ model: Book, as: 'book' }] },
  { model: Reader, as: 'reader' },
];

/** A whole number from 1 up, from a route parameter or a field. */
function idOf(value: unknown, what: string): number {
  const id = typeof value === 'number' ? value : typeof value === 'string' && /^\d+$/.test(value) ? Number(value) : NaN;
  if (!Number.isSafeInteger(id) || id < 1) {
    throw new InvalidError(`${what} must be a whole number`);
  }
  return id;
}

/** The text of a search, with the % and _ of LIKE taken literally. */
function likeText(q: string): string {
  return `%${q.replace(/[\\%_]/g, (character) => `\\${character}`)}%`;
}

// Books

export async function findBooks(q: unknown) {
  const text = typeof q === 'string' ? q.trim() : '';
  const where = text ? { [Op.or]: [{ title: { [Op.like]: likeText(text) } }, { '$author.name$': { [Op.like]: likeText(text) } }] } : {};
  const books = await Book.findAll({ where, include: bookIncludes, order: [['id', 'ASC']] });
  return books.map(bookSummary);
}

async function loadBook(id: number): Promise<Book> {
  const book = await Book.findByPk(id, { include: bookIncludes });
  if (!book) {
    throw new NotFoundError('There is no such book');
  }
  return book;
}

export async function findBook(id: unknown) {
  return bookDetails(await loadBook(idOf(id, 'The book')));
}

export interface BookInput {
  title?: unknown;
  authorId?: unknown;
  authorName?: unknown;
  isbn?: unknown;
  year?: unknown;
  copies?: unknown;
}

export async function createBook(input: BookInput) {
  const fields: Record<string, string> = {};
  const title = typeof input.title === 'string' ? input.title.trim() : '';
  if (title.length < 1 || title.length > 200) {
    fields.title = 'Write the title (up to 200 characters)';
  }
  const isbn = typeof input.isbn === 'string' ? parseIsbn(input.isbn) : null;
  if (!isbn) {
    fields.isbn = 'Type the 13 digits of the ISBN, with or without dashes';
  }
  const year = Number(input.year);
  if (!Number.isInteger(year) || year < 1500 || year > Number(today().slice(0, 4))) {
    fields.year = 'Use the year the book was published';
  }
  const copies = Number(input.copies ?? 1);
  if (!Number.isInteger(copies) || copies < 1 || copies > 20) {
    fields.copies = 'From 1 to 20 copies';
  }
  const authorName = typeof input.authorName === 'string' ? input.authorName.trim() : '';
  if (input.authorId === undefined && (authorName.length < 1 || authorName.length > 120)) {
    fields.author = 'Pick the author, or write the name of a new one';
  }
  if (Object.keys(fields).length > 0) {
    throw new InvalidError('Some fields need a look', fields);
  }
  if (await Book.findOne({ where: { isbn: isbn! } })) {
    throw new ConflictError('The library already has a book with this ISBN', { isbn: 'Another book has this ISBN' });
  }

  const created = await Book.sequelize!.transaction(async (transaction) => {
    let authorId: number;
    if (input.authorId !== undefined) {
      const author = await Author.findByPk(idOf(input.authorId, 'The author'), { transaction });
      if (!author) {
        throw new InvalidError('Some fields need a look', { author: 'There is no such author' });
      }
      authorId = author.id;
    } else {
      const [author] = await Author.findOrCreate({ where: { name: authorName }, transaction });
      authorId = author.id;
    }
    const book = await Book.create({ title, authorId, isbn: isbn!, year }, { transaction });
    const number = String(book.id).padStart(3, '0');
    for (let n = 1; n <= copies; n++) {
      await Copy.create({ bookId: book.id, code: `B${number}-${n}` }, { transaction });
    }
    return book.id;
  });
  return bookDetails(await loadBook(created));
}

export async function searchAuthors(q: unknown) {
  const text = typeof q === 'string' ? q.trim() : '';
  const authors = await Author.findAll({ where: text ? { name: { [Op.like]: likeText(text) } } : {}, order: [['name', 'ASC']], limit: 20 });
  return authors.map((author) => ({ id: author.id, name: author.name }));
}

// Readers

export async function findReaders(q: unknown) {
  const text = typeof q === 'string' ? q.trim() : '';
  const where = text ? { [Op.or]: [{ name: { [Op.like]: likeText(text) } }, { card: { [Op.like]: likeText(text) } }] } : {};
  const readers = await Reader.findAll({ where, include: [{ model: Loan, as: 'loans' }], order: [['name', 'ASC']] });
  return readers.map(readerSummary);
}

async function loadReader(id: number): Promise<Reader> {
  const reader = await Reader.findByPk(id, { include: [{ model: Loan, as: 'loans' }] });
  if (!reader) {
    throw new NotFoundError('There is no such reader');
  }
  return reader;
}

export async function findReader(id: unknown) {
  const reader = await loadReader(idOf(id, 'The reader'));
  const classmates = await Reader.findAll({ where: { group: reader.group, id: { [Op.ne]: reader.id } }, order: [['name', 'ASC']] });
  const reservations = await Reservation.findAll({
    where: { readerId: reader.id, fulfilledAt: null },
    include: [{ model: Book, as: 'book' }],
    order: [['createdAt', 'ASC']],
  });
  return {
    ...readerSummary(reader),
    classmates: classmates.map((classmate) => ({ id: classmate.id, name: classmate.name })),
    reservations: reservations.map((reservation) => ({ id: reservation.id, book: { id: reservation.book!.id, title: reservation.book!.title } })),
  };
}

/** Every loan of a reader, the ones still out first. */
export async function openLoans(readerId: unknown) {
  const reader = await loadReader(idOf(readerId, 'The reader'));
  const loans = await Loan.findAll({ where: { readerId: reader.id }, include: loanIncludes });
  const out = loans.filter((loan) => !loan.returnedAt).sort((a, b) => a.dueOn.localeCompare(b.dueOn));
  const back = loans.filter((loan) => loan.returnedAt).sort((a, b) => b.returnedAt!.getTime() - a.returnedAt!.getTime());
  return [...out, ...back].map(loanView);
}

/** The fines of the books a reader brought back late and has not paid yet, in dollars. */
async function finesDue(readerId: number): Promise<number> {
  const loans = await Loan.findAll({ where: { readerId, finePaid: false, returnedAt: { [Op.ne]: null } } });
  return loans.reduce((total, loan) => total + Number(loan.fine), 0);
}

export async function payFines(readerId: unknown) {
  const reader = await loadReader(idOf(readerId, 'The reader'));
  const [paid] = await Loan.update({ finePaid: true }, { where: { readerId: reader.id, finePaid: false, returnedAt: { [Op.ne]: null }, fine: { [Op.gt]: 0 } } });
  return { paid };
}

// Loans

export async function findLoans(status: unknown) {
  if (status !== undefined && status !== 'active' && status !== 'overdue') {
    throw new InvalidError('status is active or overdue');
  }
  const where = status === 'overdue' ? { dueOn: { [Op.lt]: today() }, returnedAt: null } : { returnedAt: null };
  const loans = await Loan.findAll({ where, include: loanIncludes, order: [['dueOn', 'ASC'], ['id', 'ASC']] });
  return loans.map(loanView);
}

async function loadLoan(id: number): Promise<Loan> {
  const loan = await Loan.findByPk(id, { include: loanIncludes });
  if (!loan) {
    throw new NotFoundError('There is no such loan');
  }
  return loan;
}

export async function lend(input: { copyId?: unknown; readerId?: unknown }) {
  const copyId = idOf(input.copyId, 'copyId');
  const readerId = idOf(input.readerId, 'readerId');
  const copy = await Copy.findByPk(copyId);
  if (!copy) {
    throw new NotFoundError('There is no such copy');
  }
  const reader = await Reader.findByPk(readerId);
  if (!reader) {
    throw new NotFoundError('There is no such reader');
  }
  const last = await Loan.findOne({ where: { copyId: copy.id }, order: [['id', 'ASC']] });
  if (last && !last.returnedAt) {
    throw new ConflictError(`Copy ${copy.code} is already on loan`);
  }
  const due = await finesDue(reader.id);
  if (due > 0) {
    throw new ConflictError(`${reader.name} has ${dollars(due)} in unpaid fines`);
  }

  const day = today();
  // The desk never gives a due date on a Sunday: it moves to the Monday after.
  const loan = await Loan.create({ copyId: copy.id, readerId: reader.id, loanedOn: day, dueOn: addDays(day, LOAN_DAYS) });
  // Taking the book home is what the reader was waiting for.
  await Reservation.update({ fulfilledAt: now() }, { where: { bookId: copy.bookId, readerId: reader.id, fulfilledAt: null } });
  return loanView(await loadLoan(loan.id));
}

export async function returnLoan(id: unknown) {
  const loan = await loadLoan(idOf(id, 'The loan'));
  if (loan.returnedAt) {
    throw new ConflictError('This copy is already back');
  }
  const returnedAt = now();
  await loan.update({ returnedAt, fine: fineFor(loan.dueOn, returnedAt) });
  return loanView(await loadLoan(loan.id));
}

export async function renew(id: unknown) {
  const loan = await loadLoan(idOf(id, 'The loan'));
  if (loan.returnedAt) {
    throw new ConflictError('This copy is already back');
  }
  const day = today();
  if (loan.dueOn < day) {
    throw new ConflictError('The loan is overdue: return the copy first');
  }
  if (loan.renewals >= MAX_RENEWALS) {
    throw new ConflictError(`A loan is renewed at most ${MAX_RENEWALS} times`);
  }
  const waiting = await Reservation.count({ where: { bookId: loan.copy!.bookId, fulfilledAt: null } });
  if (waiting > 0) {
    throw new ConflictError('Another reader is waiting for this book');
  }
  await loan.update({ dueOn: addDays(day, LOAN_DAYS), renewals: loan.renewals + 1 });
  return loanView(await loadLoan(loan.id));
}

// Reservations

export async function reserve(bookId: unknown, input: { readerId?: unknown }) {
  const book = await loadBook(idOf(bookId, 'The book'));
  const readerId = idOf(input.readerId, 'readerId');
  const reader = await Reader.findByPk(readerId);
  if (!reader) {
    throw new NotFoundError('There is no such reader');
  }
  const details = bookDetails(book);
  if (details.reservations.some((reservation) => reservation.reader.id === reader.id)) {
    throw new ConflictError(`${reader.name} is already waiting for this book`);
  }
  if (details.copyList.some((copy) => copy.loan?.reader.id === reader.id)) {
    throw new ConflictError(`${reader.name} has this book already`);
  }
  const reservation = await Reservation.create({ bookId: book.id, readerId: reader.id, createdAt: now() });
  return {
    id: reservation.id,
    book: { id: book.id, title: book.title },
    reader: { id: reader.id, name: reader.name },
    position: details.reservations.length + 1,
    /** A copy is on the shelf: the desk puts it aside for the reader. */
    ready: details.available > 0,
  };
}
