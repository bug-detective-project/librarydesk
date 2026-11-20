import { useState } from 'react';
import { Link } from 'react-router';
import { getBooks } from '../api/books.ts';
import { getLoans } from '../api/loans.ts';
import { SORTS, sortBooks } from '../collection.ts';
import type { SortKey } from '../collection.ts';
import { BookCover } from '../components/BookCover.tsx';
import { Icon } from '../components/Icon.tsx';
import { StatusBadge } from '../components/StatusBadge.tsx';
import ui from '../components/ui.module.css';
import { useResource } from '../useResource.ts';
import styles from './BooksPage.module.css';

export function BooksPage() {
  const [q, setQ] = useState('');
  const [sort, setSort] = useState<SortKey>('title');
  const { data: books, error } = useResource(`books?q=${q.trim()}`, (signal) => getBooks(q.trim(), signal));
  const shown = books ? sortBooks(books, sort) : null;
  const { data: everything } = useResource('books-all', (signal) => getBooks('', signal));
  const { data: overdue } = useResource('loans-overdue', (signal) => getLoans('overdue', signal));
  const copies = everything?.reduce((total, book) => total + book.copies, 0) ?? 0;
  const out = everything?.reduce((total, book) => total + book.copies - book.available, 0) ?? 0;

  return (
    <section>
      <div className={ui.titleRow}>
        <div>
          <h2>Collection</h2>
          <p className={`${ui.muted} ${styles.lead}`}>Every title on the shelves, with how many copies are in.</p>
        </div>
        <Link to="/books/new" className={ui.primary}>
          <Icon name="plus" />
          New book
        </Link>
      </div>

      {everything && (
        <dl className={styles.stats} aria-label="The library today">
          <div>
            <dt>Titles</dt>
            <dd>{everything.length}</dd>
          </div>
          <div>
            <dt>Copies</dt>
            <dd>{copies}</dd>
          </div>
          <div>
            <dt>On loan</dt>
            <dd>{out}</dd>
          </div>
          <div className={overdue && overdue.length > 0 ? styles.late : undefined}>
            <dt>Overdue</dt>
            <dd>{overdue?.length ?? '–'}</dd>
          </div>
        </dl>
      )}

      <div className={styles.tools}>
        <label className={styles.search}>
          <Icon name="search" />
          <span className={styles.hidden}>Search the collection</span>
          <input type="search" placeholder="Title or author" value={q} onChange={(event) => setQ(event.target.value)} />
        </label>
        <label className={styles.sort}>
          <span>Sort by</span>
          <select value={sort} onChange={(event) => setSort(event.target.value as SortKey)}>
            {SORTS.map((option) => (
              <option key={option.key} value={option.key}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {error && <p className={ui.alert}>{error}</p>}
      {shown && shown.length === 0 && <p className={ui.notice}>No book matches “{q.trim()}”.</p>}
      {shown && shown.length > 0 && (
        <ul className={styles.grid} aria-label="Books">
          {shown.map((book) => (
            <li key={book.id} className={styles.card} data-testid={`book-${book.id}`}>
              <BookCover id={book.id} title={book.title} author={book.author.name} />
              <div className={styles.body}>
                <h3 className={styles.title}>
                  <Link to={`/books/${book.id}`}>{book.title}</Link>
                </h3>
                <p className={styles.author}>{book.author.name}</p>
                <p className={styles.meta}>
                  {book.year} · ISBN {book.isbn}
                </p>
                <div className={styles.foot}>
                  <StatusBadge status={book.status} />
                  <span className={styles.count}>
                    {book.available} of {book.copies} in
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
