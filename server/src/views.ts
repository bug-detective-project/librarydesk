/**
 * What the API answers: the rows of the database turned into the JSON the screens read, with the
 * status of every book, copy and loan worked out from the loans and the reservations.
 */
import { now, today } from './clock.ts';
import { fineFor } from './fines.ts';
import { formatIsbn } from './isbn.ts';
import type { Book, Copy, Loan, Reader, Reservation } from './models.ts';

export type BookStatus = 'available' | 'on_loan' | 'reserved';
export type CopyStatus = 'available' | 'on_loan' | 'overdue';
export type LoanStatus = 'on_loan' | 'overdue' | 'returned';

export function loanStatus(loan: Loan): LoanStatus {
  if (loan.returnedAt) {
    return 'returned';
  }
  return loan.dueOn < today() ? 'overdue' : 'on_loan';
}

/** The loan a copy is out on, if any. */
function openLoanOf(copy: Copy): Loan | undefined {
  return copy.loans?.find((loan) => !loan.returnedAt);
}

function copyStatus(copy: Copy): CopyStatus {
  const loan = openLoanOf(copy);
  return loan ? (loanStatus(loan) as CopyStatus) : 'available';
}

function waiting(book: Book): Reservation[] {
  return (book.reservations ?? []).filter((reservation) => !reservation.fulfilledAt).sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
}

export function availableCopies(book: Book): number {
  return (book.copies ?? []).filter((copy) => !openLoanOf(copy)).length;
}

export function bookStatus(book: Book): BookStatus {
  if (availableCopies(book) > 0) {
    return 'available';
  }
  return waiting(book).length > 0 ? 'reserved' : 'on_loan';
}

export function bookSummary(book: Book) {
  return {
    id: book.id,
    title: book.title,
    author: { id: book.author!.id, name: book.author!.name },
    isbn: formatIsbn(book.isbn),
    year: book.year,
    copies: book.copies?.length ?? 0,
    available: availableCopies(book),
    status: bookStatus(book),
  };
}

export function bookDetails(book: Book) {
  const copies = [...(book.copies ?? [])].sort((a, b) => a.code.localeCompare(b.code));
  return {
    ...bookSummary(book),
    copyList: copies.map((copy) => {
      const loan = openLoanOf(copy);
      return {
        id: copy.id,
        code: copy.code,
        status: copyStatus(copy),
        loan: loan ? { id: loan.id, dueOn: loan.dueOn, reader: { id: loan.reader!.id, name: loan.reader!.name } } : null,
      };
    }),
    reservations: waiting(book).map((reservation, index) => ({
      id: reservation.id,
      position: index + 1,
      reader: { id: reservation.reader!.id, name: reservation.reader!.name },
      createdAt: reservation.createdAt.toISOString(),
    })),
  };
}

/** The fine of a loan: what was charged when it came back, or what it adds up to so far. */
function fineOf(loan: Loan): string {
  if (loan.returnedAt) {
    return loan.fine;
  }
  return fineFor(loan.dueOn, now());
}

export function loanView(loan: Loan) {
  const copy = loan.copy!;
  return {
    id: loan.id,
    copy: { id: copy.id, code: copy.code },
    book: { id: copy.book!.id, title: copy.book!.title },
    reader: { id: loan.reader!.id, name: loan.reader!.name },
    loanedOn: loan.loanedOn,
    dueOn: loan.dueOn,
    returnedAt: loan.returnedAt ? loan.returnedAt.toISOString() : null,
    renewals: loan.renewals,
    status: loanStatus(loan),
    /** Decimal text, as MySQL gives it: '1.50'. */
    fine: fineOf(loan),
    finePaid: loan.finePaid,
  };
}

export function readerSummary(reader: Reader) {
  const loans = reader.loans ?? [];
  return {
    id: reader.id,
    name: reader.name,
    group: reader.group,
    card: reader.card,
    openLoans: loans.filter((loan) => !loan.returnedAt).length,
    overdueLoans: loans.filter((loan) => !loan.returnedAt && loan.dueOn < today()).length,
    hasFines: loans.some((loan) => loan.returnedAt && Number(loan.fine) > 0 && !loan.finePaid),
  };
}
