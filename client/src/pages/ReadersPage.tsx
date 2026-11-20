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
  const [group, setGroup] = useState('All');
  const { data: readers, error } = useResource(`readers?q=${q.trim()}`, (signal) => getReaders(q.trim(), signal));
  // The classes first, in order, and the teachers at the end.
  const groups = readers ? [...new Set(readers.map((reader) => reader.group))].sort((a, b) => (a === 'Teachers' ? 1 : b === 'Teachers' ? -1 : a.localeCompare(b))) : [];
  const shown = readers?.filter((reader) => group === 'All' || reader.group === group) ?? null;

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
      {groups.length > 1 && (
        <div className={styles.filters} role="group" aria-label="Class">
          {['All', ...groups].map((name) => (
            <button key={name} type="button" className={styles.filter} aria-pressed={group === name} onClick={() => setGroup(name)}>
              {name}
            </button>
          ))}
        </div>
      )}
      {error && <p className={ui.alert}>{error}</p>}
      {shown && shown.length === 0 && <p className={ui.notice}>No reader matches “{q.trim()}”.</p>}
      {shown && shown.length > 0 && (
        <ul className={styles.grid} aria-label="Readers">
          {shown.map((reader) => (
            <li key={reader.id} className={`${styles.card} ${reader.group === 'Teachers' ? styles.teacher : ''}`} data-testid={`reader-${reader.id}`}>
              <div className={styles.band}>
                <span>{reader.group}</span>
                <span className={styles.number}>{reader.card}</span>
              </div>
              <div className={styles.who}>
                <span aria-hidden="true" className={styles.avatar}>
                  {initials(reader.name)}
                </span>
                <h3 className={styles.name}>
                  <Link to={`/readers/${reader.id}`}>{reader.name}</Link>
                </h3>
              </div>
              <dl className={styles.stats}>
                <div>
                  <dt>Out</dt>
                  <dd>
                    {reader.openLoans} {reader.openLoans === 1 ? 'book' : 'books'}
                  </dd>
                </div>
                <div>
                  <dt>Overdue</dt>
                  <dd className={reader.overdueLoans > 0 ? styles.alert : undefined}>{reader.overdueLoans}</dd>
                </div>
                <div>
                  <dt>Fines</dt>
                  <dd className={reader.hasFines ? styles.alert : styles.clear}>{reader.hasFines ? 'Fines due' : 'None'}</dd>
                </div>
              </dl>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
