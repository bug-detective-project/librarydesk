import { addDays, now, today } from './clock.ts';
import { Author, Book, Copy, Loan, Reader, Reservation } from './models.ts';

/** A valid ISBN-13 from its first twelve digits: the check digit is computed. */
function isbn(twelve: string): string {
  const sum = [...twelve].reduce((total, digit, index) => total + Number(digit) * (index % 2 === 0 ? 1 : 3), 0);
  return `${twelve}${(10 - (sum % 10)) % 10}`;
}

const AUTHORS = [
  'Machado de Assis',
  'Érico Veríssimo',
  'Clarice Lispector',
  'Jorge Amado',
  'Graciliano Ramos',
  'José de Alencar',
  'Monteiro Lobato',
  'Cecília Meireles',
  'Maria José Dupré',
  'Ruth Rocha',
  'Ziraldo',
  'Lygia Bojunga',
  'Ana Lúcia Prado',
];

/** Title, author, year and how many copies are on the shelf. */
const BOOKS: [string, string, number, number][] = [
  ['Dom Casmurro', 'Machado de Assis', 1899, 3],
  ['Memórias Póstumas de Brás Cubas', 'Machado de Assis', 1881, 2],
  ['O Tempo e o Vento', 'Érico Veríssimo', 1949, 2],
  ['A Hora da Estrela', 'Clarice Lispector', 1977, 2],
  ['Capitães da Areia', 'Jorge Amado', 1937, 3],
  ['Vidas Secas', 'Graciliano Ramos', 1938, 2],
  ['Iracema', 'José de Alencar', 1865, 2],
  ['Reinações de Narizinho', 'Monteiro Lobato', 1931, 2],
  ['Ou Isto ou Aquilo', 'Cecília Meireles', 1964, 1],
  ['Éramos Seis', 'Maria José Dupré', 1943, 2],
  ['Marcelo, Marmelo, Martelo', 'Ruth Rocha', 1976, 2],
  ['O Menino Maluquinho', 'Ziraldo', 1980, 3],
  ['A Bolsa Amarela', 'Lygia Bojunga', 1976, 1],
  ['Machado para Jovens Leitores', 'Ana Lúcia Prado', 2015, 1],
  ['Olhai os Lírios do Campo', 'Érico Veríssimo', 1938, 1],
];

const READERS: [string, string][] = [
  ['Ana Souza', 'Class 7B'],
  ['Bruno Lima', 'Class 7B'],
  ['Carla Mendes', 'Class 7B'],
  ['Davi Rocha', 'Class 8A'],
  ['Elisa Martins', 'Class 8A'],
  ['Felipe Araújo', 'Class 9C'],
  ['Gabriela Nunes', 'Class 9C'],
  ['Helena Castro', 'Teachers'],
  ['Igor Teixeira', 'Teachers'],
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
  { copy: 'B001-1', reader: 'Ana Souza', loaned: -10, due: 4 },
  { copy: 'B003-1', reader: 'Ana Souza', loaned: -30, due: -16, returned: -17 },
  { copy: 'B005-1', reader: 'Bruno Lima', loaned: -20, due: -6 },
  { copy: 'B006-1', reader: 'Carla Mendes', loaned: -14, due: 0 },
  { copy: 'B007-1', reader: 'Davi Rocha', loaned: -22, due: -8, returned: -5, fine: '1.50' },
  { copy: 'B008-1', reader: 'Davi Rocha', loaned: -21, due: -7, returned: -3, fine: '2.00' },
  { copy: 'B010-1', reader: 'Elisa Martins', loaned: -25, due: -11, returned: -9, fine: '1.00', finePaid: true },
  { copy: 'B012-1', reader: 'Felipe Araújo', loaned: -18, due: 10, renewals: 2 },
  { copy: 'B009-1', reader: 'Gabriela Nunes', loaned: -7, due: 7 },
  { copy: 'B013-1', reader: 'Helena Castro', loaned: -2, due: 12 },
  { copy: 'B002-1', reader: 'Igor Teixeira', loaned: -16, due: -2 },
  { copy: 'B004-1', reader: 'Igor Teixeira', loaned: -40, due: -26, returned: -27 },
];

/** Who is waiting for which book, oldest first. */
const RESERVATIONS: [string, string][] = [['Ou Isto ou Aquilo', 'Ana Souza']];

/** Puts the sample library in the empty tables: 15 titles, 27 copies, 9 readers. */
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
    const book = await Book.create({ title, authorId: authors.get(author)!, year, isbn: isbn(`97885${String(index + 1).padStart(7, '0')}`) });
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
  const atTen = (offset: number) => new Date(`${addDays(day, offset)}T10:15:00-03:00`);
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
