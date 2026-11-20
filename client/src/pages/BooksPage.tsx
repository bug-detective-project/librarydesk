import { useState } from 'react';
import { Link } from 'react-router';
import { getBooks } from '../api/books.ts';
import { SORTS, sortBooks } from '../collection.ts';
import type { SortKey } from '../collection.ts';
import { Icon } from '../components/Icon.tsx';
import { StatusBadge } from '../components/StatusBadge.tsx';
import ui from '../components/ui.module.css';
import { useResource } from '../useResource.ts';
import styles from './BooksPage.module.css';

/** The color of a book's spine on its card, always the same for the same book. */
const SPINES = ['#1f6b5c', '#8a5300', '#6b3f7a', '#2f5d8a', '#a23b3b', '#4f6b2a'];

export function BooksPage() {
  const [q, setQ] = useState('');
  const [sort, setSort] = useState<SortKey>('title');
  const { data: books, error } = useResource(`books?q=${q.trim()}`, (signal) => getBooks(q.trim(), signal));
  const shown = books ? sortBooks(books, sort) : null;

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
              <span aria-hidden="true" className={styles.spine} style={{ background: SPINES[book.id % SPINES.length] }} />
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
