import { useState } from 'react';
import { Link } from 'react-router';
import { getReaders } from '../api/readers.ts';
import { Icon } from '../components/Icon.tsx';
import ui from '../components/ui.module.css';
import { initials } from '../format.ts';
import { useResource } from '../useResource.ts';
import books from './BooksPage.module.css';
import styles from './ReadersPage.module.css';

export function ReadersPage() {
  const [q, setQ] = useState('');
  const { data: readers, error } = useResource(`readers?q=${q.trim()}`, (signal) => getReaders(q.trim(), signal));

  return (
    <section>
      <div className={ui.titleRow}>
        <div>
          <h2>Readers</h2>
          <p className={`${ui.muted} ${books.lead}`}>Students and teachers with a library card.</p>
        </div>
      </div>
      <div className={books.tools}>
        <label className={books.search}>
          <Icon name="search" />
          <span className={books.hidden}>Search readers</span>
          <input type="search" placeholder="Name or card number" value={q} onChange={(event) => setQ(event.target.value)} />
        </label>
      </div>
      {error && <p className={ui.alert}>{error}</p>}
      {readers && readers.length === 0 && <p className={ui.notice}>No reader matches “{q.trim()}”.</p>}
      {readers && readers.length > 0 && (
        <ul className={styles.grid} aria-label="Readers">
          {readers.map((reader) => (
            <li key={reader.id} className={styles.card} data-testid={`reader-${reader.id}`}>
              <span aria-hidden="true" className={styles.avatar}>
                {initials(reader.name)}
              </span>
              <div className={styles.body}>
                <h3 className={styles.name}>
                  <Link to={`/readers/${reader.id}`}>{reader.name}</Link>
                </h3>
                <p className={styles.meta}>
                  {reader.group} · {reader.card}
                </p>
              </div>
              <div className={styles.tags}>
                <span className={styles.loans}>
                  <Icon name="book" size={15} />
                  {reader.openLoans} {reader.openLoans === 1 ? 'book' : 'books'}
                </span>
                {reader.hasFines && (
                  <span className={styles.fines}>
                    <Icon name="cash" size={15} />
                    Fines due
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
