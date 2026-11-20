import { Link, useParams } from 'react-router';
import { getBook } from '../api/books.ts';
import { getReaders } from '../api/readers.ts';
import { Availability } from '../components/Availability.tsx';
import { BookCover } from '../components/BookCover.tsx';
import { Icon } from '../components/Icon.tsx';
import { LendForm } from '../components/LendForm.tsx';
import { ReserveForm } from '../components/ReserveForm.tsx';
import { StatusBadge } from '../components/StatusBadge.tsx';
import ui from '../components/ui.module.css';
import { formatDay, formatMoment } from '../format.ts';
import { useResource } from '../useResource.ts';
import styles from './BookPage.module.css';

export function BookPage() {
  const id = Number(useParams().id);
  const { data: book, error, reload } = useResource(`book-${id}`, (signal) => getBook(id, signal));
  const { data: readers } = useResource('readers', (signal) => getReaders('', signal));

  if (error) {
    return <p className={ui.alert}>{error}</p>;
  }
  if (!book) {
    return <p className={ui.muted}>Loading the book…</p>;
  }
  return (
    <article>
      <Link to="/" className={styles.back}>
        <Icon name="back" />
        Collection
      </Link>
      <header className={styles.header}>
        <BookCover id={book.id} title={book.title} author={book.author.name} size="large" />
        <div className={styles.heading}>
          <StatusBadge status={book.status} />
          <h2>{book.title}</h2>
          <p className={styles.author}>{book.author.name}</p>
          <dl className={styles.facts}>
            <div>
              <dt>Published</dt>
              <dd>{book.year}</dd>
            </div>
            <div>
              <dt>ISBN</dt>
              <dd>{book.isbn}</dd>
            </div>
            <div>
              <dt>Copies</dt>
              <dd>{book.copies}</dd>
            </div>
          </dl>
          <Availability copies={book.copyList} />
        </div>
      </header>

      <div className={styles.columns}>
        <section className={ui.card} aria-labelledby="copies-title">
          <h3 id="copies-title" className={styles.sectionTitle}>
            <Icon name="copies" />
            Copies
          </h3>
          <ul className={styles.copies}>
            {book.copyList.map((copy) => (
              <li key={copy.id} data-testid={`copy-${copy.code}`}>
                <span className={styles.code}>{copy.code}</span>
                <StatusBadge status={copy.status} />
                {copy.loan ? (
                  <span className={styles.holder}>
                    with <Link to={`/readers/${copy.loan.reader.id}`}>{copy.loan.reader.name}</Link> until {formatDay(copy.loan.dueOn)}
                  </span>
                ) : (
                  <span className={styles.holder}>On the shelf</span>
                )}
              </li>
            ))}
          </ul>
        </section>

        <aside className={styles.side} aria-label="Desk">
          <section className={ui.card} aria-labelledby="lend-title">
            <h3 id="lend-title" className={styles.sectionTitle}>
              <Icon name="lend" />
              Lend a copy
            </h3>
            <LendForm copies={book.copyList} readers={readers ?? []} onLent={reload} />
          </section>

          <section className={ui.card} aria-labelledby="reserve-title">
            <h3 id="reserve-title" className={styles.sectionTitle}>
              <Icon name="bookmark" />
              Reservations
            </h3>
            {book.reservations.length > 0 ? (
              <ol className={styles.queue} aria-label="Queue">
                {book.reservations.map((reservation) => (
                  <li key={reservation.id}>
                    <span className={styles.position}>{reservation.position}</span>
                    <Link to={`/readers/${reservation.reader.id}`}>{reservation.reader.name}</Link>
                    <span className={ui.muted}>since {formatMoment(reservation.createdAt)}</span>
                  </li>
                ))}
              </ol>
            ) : (
              <p className={ui.muted}>Nobody is waiting for this book.</p>
            )}
            <ReserveForm book={book} readers={readers ?? []} onReserved={reload} />
          </section>
        </aside>
      </div>
    </article>
  );
}
