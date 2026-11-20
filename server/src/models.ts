import { DataTypes, Model } from 'sequelize';
import type { CreationOptional, ForeignKey, InferAttributes, InferCreationAttributes, NonAttribute, Sequelize } from 'sequelize';

// The fields are `declare`d: Sequelize defines them itself, and a real class field would hide them.

export class Author extends Model<InferAttributes<Author>, InferCreationAttributes<Author>> {
  declare id: CreationOptional<number>;
  declare name: string;
}

/** A title the library has, with one or more copies on the shelf. */
export class Book extends Model<InferAttributes<Book>, InferCreationAttributes<Book>> {
  declare id: CreationOptional<number>;
  declare authorId: ForeignKey<Author['id']>;
  declare title: string;
  /** The 13 digits, without dashes. */
  declare isbn: string;
  declare year: number;

  declare author?: NonAttribute<Author>;
  declare copies?: NonAttribute<Copy[]>;
  declare reservations?: NonAttribute<Reservation[]>;
}

/** One physical copy of a book, with the code on its spine label ('B005-2'). */
export class Copy extends Model<InferAttributes<Copy>, InferCreationAttributes<Copy>> {
  declare id: CreationOptional<number>;
  declare bookId: ForeignKey<Book['id']>;
  declare code: string;

  declare book?: NonAttribute<Book>;
  declare loans?: NonAttribute<Loan[]>;
}

/** A student or a teacher with a library card. */
export class Reader extends Model<InferAttributes<Reader>, InferCreationAttributes<Reader>> {
  declare id: CreationOptional<number>;
  declare name: string;
  /** 'Class 7B', or 'Teachers'. */
  declare group: string;
  /** The number on the library card: 'R-0007'. */
  declare card: string;

  declare loans?: NonAttribute<Loan[]>;
}

export class Loan extends Model<InferAttributes<Loan>, InferCreationAttributes<Loan>> {
  declare id: CreationOptional<number>;
  declare copyId: ForeignKey<Copy['id']>;
  declare readerId: ForeignKey<Reader['id']>;
  declare loanedOn: string;
  declare dueOn: string;
  /** When the copy came back; null while the reader has it. */
  declare returnedAt: CreationOptional<Date | null>;
  declare renewals: CreationOptional<number>;
  /** Charged when the copy comes back late. MySQL keeps it as DECIMAL, and the driver gives it back as text: '1.50'. */
  declare fine: CreationOptional<string>;
  declare finePaid: CreationOptional<boolean>;

  declare copy?: NonAttribute<Copy>;
  declare reader?: NonAttribute<Reader>;
}

/** A reader waiting for a book: the queue goes by the order they asked. */
export class Reservation extends Model<InferAttributes<Reservation>, InferCreationAttributes<Reservation>> {
  declare id: CreationOptional<number>;
  declare bookId: ForeignKey<Book['id']>;
  declare readerId: ForeignKey<Reader['id']>;
  declare createdAt: CreationOptional<Date>;
  /** When the reader took the book home; null while they still wait. */
  declare fulfilledAt: CreationOptional<Date | null>;

  declare book?: NonAttribute<Book>;
  declare reader?: NonAttribute<Reader>;
}

const id = { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true } as const;

/** Tells Sequelize the tables and how they point to each other. */
export function defineModels(sequelize: Sequelize): void {
  const options = { sequelize, underscored: true, timestamps: false } as const;

  Author.init({ id, name: { type: DataTypes.STRING(120), allowNull: false, unique: true } }, { ...options, tableName: 'authors' });

  Book.init(
    {
      id,
      title: { type: DataTypes.STRING(200), allowNull: false },
      isbn: { type: DataTypes.CHAR(13), allowNull: false, unique: true },
      year: { type: DataTypes.SMALLINT, allowNull: false },
    },
    { ...options, tableName: 'books' },
  );

  Copy.init({ id, code: { type: DataTypes.STRING(20), allowNull: false, unique: true } }, { ...options, tableName: 'copies' });

  Reader.init(
    {
      id,
      name: { type: DataTypes.STRING(120), allowNull: false },
      group: { type: DataTypes.STRING(40), allowNull: false },
      card: { type: DataTypes.STRING(10), allowNull: false, unique: true },
    },
    { ...options, tableName: 'readers' },
  );

  Loan.init(
    {
      id,
      loanedOn: { type: DataTypes.DATEONLY, allowNull: false },
      dueOn: { type: DataTypes.DATEONLY, allowNull: false },
      returnedAt: { type: DataTypes.DATE, allowNull: true, defaultValue: null },
      renewals: { type: DataTypes.TINYINT, allowNull: false, defaultValue: 0 },
      fine: { type: DataTypes.DECIMAL(8, 2), allowNull: false, defaultValue: '0.00' },
      finePaid: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    },
    { ...options, tableName: 'loans' },
  );

  Reservation.init(
    {
      id,
      createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
      fulfilledAt: { type: DataTypes.DATE, allowNull: true, defaultValue: null },
    },
    { ...options, tableName: 'reservations' },
  );

  /** A link every row must have, which keeps the row it points to from being deleted. */
  const required = (name: string) => ({ foreignKey: { name, allowNull: false }, onDelete: 'RESTRICT' }) as const;
  Author.hasMany(Book, { as: 'books', ...required('authorId') });
  Book.belongsTo(Author, { as: 'author', ...required('authorId') });
  Book.hasMany(Copy, { as: 'copies', ...required('bookId') });
  Copy.belongsTo(Book, { as: 'book', ...required('bookId') });
  Copy.hasMany(Loan, { as: 'loans', ...required('copyId') });
  Loan.belongsTo(Copy, { as: 'copy', ...required('copyId') });
  Reader.hasMany(Loan, { as: 'loans', ...required('readerId') });
  Loan.belongsTo(Reader, { as: 'reader', ...required('readerId') });
  Book.hasMany(Reservation, { as: 'reservations', ...required('bookId') });
  Reservation.belongsTo(Book, { as: 'book', ...required('bookId') });
  Reader.hasMany(Reservation, { as: 'reservations', ...required('readerId') });
  Reservation.belongsTo(Reader, { as: 'reader', ...required('readerId') });
}
