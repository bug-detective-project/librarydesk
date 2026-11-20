/** What the screens show for a book, a copy and a loan; the API works these out. */
export type BookStatus = 'available' | 'on_loan' | 'reserved';
export type CopyStatus = 'available' | 'on_loan' | 'overdue';
export type LoanStatus = 'on_loan' | 'overdue' | 'returned';
export type Status = BookStatus | CopyStatus | LoanStatus;

export interface Author {
  id: number;
  name: string;
}

export interface Book {
  id: number;
  title: string;
  author: Author;
  /** Printed with its dashes: 978-85-0000-001-3. */
  isbn: string;
  year: number;
  copies: number;
  available: number;
  status: BookStatus;
}

export interface Copy {
  id: number;
  code: string;
  status: CopyStatus;
  loan: { id: number; dueOn: string; reader: { id: number; name: string } } | null;
}

export interface Reservation {
  id: number;
  position: number;
  reader: { id: number; name: string };
  createdAt: string;
}

export interface BookDetails extends Book {
  copyList: Copy[];
  reservations: Reservation[];
}

export interface ReaderSummary {
  id: number;
  name: string;
  /** 'Class 7B', or 'Teachers'. */
  group: string;
  card: string;
  openLoans: number;
  overdueLoans: number;
  hasFines: boolean;
}

export interface ReaderDetails extends ReaderSummary {
  classmates: { id: number; name: string }[];
  reservations: { id: number; book: { id: number; title: string } }[];
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
  status: LoanStatus;
  /** Reais as decimal text, the way MySQL keeps them: '1.50'. */
  fine: string;
  finePaid: boolean;
}

export interface NewBook {
  title: string;
  authorId?: number;
  authorName?: string;
  isbn: string;
  year: number;
  copies: number;
}

export interface ReservationResult {
  id: number;
  position: number;
  /** A copy was on the shelf and is put aside at the desk. */
  ready: boolean;
}
