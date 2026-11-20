import { filingTitle } from '../collection.ts';
import styles from './BookCover.module.css';

/** Cloth colors of old library bindings; a book always gets the same one. */
const BINDINGS = [
  ['#155e75', '#e6f4f8'],
  ['#7f1d1d', '#fbeaea'],
  ['#1e3a8a', '#e8eefc'],
  ['#4c1d95', '#efe9fb'],
  ['#92400e', '#fdf1e2'],
  ['#334155', '#eef2f6'],
] as const;

/**
 * A drawn cover in the color of its binding. The large one carries the title and the author; the
 * small one, too narrow to read a title, carries its initial, as filed ("G" for The Giver).
 */
export function BookCover({ id, title, author, size = 'small' }: { id: number; title: string; author: string; size?: 'small' | 'large' }) {
  const [cloth, ink] = BINDINGS[id % BINDINGS.length]!;
  return (
    <span aria-hidden="true" className={`${styles.cover} ${styles[size]}`} style={{ background: cloth, color: ink }}>
      <span className={styles.band} />
      {size === 'large' ? (
        <>
          <span className={styles.title}>{title}</span>
          <span className={styles.author}>{author}</span>
        </>
      ) : (
        <span className={styles.letter}>{filingTitle(title).charAt(0).toUpperCase()}</span>
      )}
    </span>
  );
}
