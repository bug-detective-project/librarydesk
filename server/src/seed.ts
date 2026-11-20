import { addDays, libraryMoment, now, today } from './clock.ts';
import { Author, Book, Copy, Loan, Reader, Reservation } from './models.ts';

/** A valid ISBN-13 from its first twelve digits: the check digit is computed. */
function isbn(twelve: string): string {
  const sum = [...twelve].reduce((total, digit, index) => total + Number(digit) * (index % 2 === 0 ? 1 : 3), 0);
  return `${twelve}${(10 - (sum % 10)) % 10}`;
}

const AUTHORS = [
  'Harper Lee',
  'John Steinbeck',
  'Lois Lowry',
  'Louis Sachar',
  'Gary Paulsen',
  'E. B. White',
  'Madeleine L\'Engle',
  'S. E. Hinton',
  'Katherine Paterson',
  'R. J. Palacio',
  'Ray Bradbury',
  'Dana Whitfield',
  'F. Scott Fitzgerald',
];

/** Title, author, year and how many copies are on the shelf. */
const BOOKS: [string, string, number, number][] = [
  ['To Kill a Mockingbird', 'Harper Lee', 1960, 3],
  ['Of Mice and Men', 'John Steinbeck', 1937, 2],
  ['The Grapes of Wrath', 'John Steinbeck', 1939, 2],
  ['The Giver', 'Lois Lowry', 1993, 2],
  ['Number the Stars', 'Lois Lowry', 1989, 3],
  ['Holes', 'Louis Sachar', 1998, 2],
  ['Hatchet', 'Gary Paulsen', 1987, 2],
  ['Charlotte\'s Web', 'E. B. White', 1952, 2],
  ['A Wrinkle in Time', 'Madeleine L\'Engle', 1962, 1],
  ['The Outsiders', 'S. E. Hinton', 1967, 2],
  ['Bridge to Terabithia', 'Katherine Paterson', 1977, 2],
  ['Wonder', 'R. J. Palacio', 2012, 3],
  ['Fahrenheit 451', 'Ray Bradbury', 1953, 1],
  ['Reading Steinbeck', 'Dana Whitfield', 2016, 1],
  ['The Great Gatsby', 'F. Scott Fitzgerald', 1925, 1],
];

const READERS: [string, string][] = [
  ['Emma Johnson', 'Grade 7'],
  ['Liam Carter', 'Grade 7'],
  ['Olivia Bennett', 'Grade 7'],
  ['Noah Ramirez', 'Grade 8'],
  ['Ava Thompson', 'Grade 8'],
  ['Ethan Brooks', 'Grade 6'],
  ['Sophia Nguyen', 'Grade 6'],
  ['Laura Mitchell', 'Teachers'],
  ['David Kim', 'Teachers'],
];

/** A loan of the sample library, with days counted from today. */
interface SampleLoan {
  copy: string;
  reader: string;
  loaned: number;
  due: number;
  /** The day it came back, from today; absent while the reader has it. */
  returned?: number;
  renewals?: number;
  fine?: string;
  finePaid?: boolean;
}

const LOANS: SampleLoan[] = [
  { copy: 'B001-1', reader: 'Emma Johnson', loaned: -10, due: 4 },
  { copy: 'B003-1', reader: 'Emma Johnson', loaned: -30, due: -16, returned: -17 },
  { copy: 'B005-1', reader: 'Liam Carter', loaned: -20, due: -6 },
  { copy: 'B006-1', reader: 'Olivia Bennett', loaned: -14, due: 0 },
  { copy: 'B007-1', reader: 'Noah Ramirez', loaned: -22, due: -8, returned: -5, fine: '0.75' },
  { copy: 'B008-1', reader: 'Noah Ramirez', loaned: -21, due: -7, returned: -3, fine: '1.00' },
  { copy: 'B010-1', reader: 'Ava Thompson', loaned: -25, due: -11, returned: -9, fine: '0.50', finePaid: true },
  { copy: 'B012-1', reader: 'Ethan Brooks', loaned: -18, due: 10, renewals: 2 },
  { copy: 'B009-1', reader: 'Sophia Nguyen', loaned: -7, due: 7 },
  { copy: 'B013-1', reader: 'Laura Mitchell', loaned: -2, due: 12 },
  { copy: 'B002-1', reader: 'David Kim', loaned: -16, due: -2 },
  { copy: 'B004-1', reader: 'David Kim', loaned: -40, due: -26, returned: -27 },
];

/** Who is waiting for which book, oldest first. */
const RESERVATIONS: [string, string][] = [['A Wrinkle in Time', 'Emma Johnson']];

/** Puts the sample library in the empty tables: 15 titles, 29 copies, 9 readers. */
export async function seedDatabase(): Promise<void> {
  const day = today();
  const authors = new Map<string, number>();
  for (const name of AUTHORS) {
    authors.set(name, (await Author.create({ name })).id);
  }

  const copies = new Map<string, number>();
  const books = new Map<string, number>();
  for (const [index, [title, author, year, count]] of BOOKS.entries()) {
    const number = String(index + 1).padStart(3, '0');
    const book = await Book.create({ title, authorId: authors.get(author)!, year, isbn: isbn(`97800${String(index + 1).padStart(7, '0')}`) });
    books.set(title, book.id);
    for (let n = 1; n <= count; n++) {
      const code = `B${number}-${n}`;
      copies.set(code, (await Copy.create({ bookId: book.id, code })).id);
    }
  }

  const readers = new Map<string, number>();
  for (const [index, [name, group]] of READERS.entries()) {
    readers.set(name, (await Reader.create({ name, group, card: `R-${String(index + 1).padStart(4, '0')}` })).id);
  }

  // Returns happened at a quarter past ten in the morning, library time.
  const atTen = (offset: number) => libraryMoment(addDays(day, offset), '10:15');
  for (const loan of LOANS) {
    await Loan.create({
      copyId: copies.get(loan.copy)!,
      readerId: readers.get(loan.reader)!,
      loanedOn: addDays(day, loan.loaned),
      dueOn: addDays(day, loan.due),
      returnedAt: loan.returned === undefined ? null : atTen(loan.returned),
      renewals: loan.renewals ?? 0,
      fine: loan.fine ?? '0.00',
      finePaid: loan.finePaid ?? false,
    });
  }

  const asked = now();
  for (const [index, [title, reader]] of RESERVATIONS.entries()) {
    await Reservation.create({ bookId: books.get(title)!, readerId: readers.get(reader)!, createdAt: new Date(asked.getTime() - (index + 1) * 3_600_000) });
  }
}
