import type { Copy } from '../api/types.ts';
import styles from './Availability.module.css';

/** How many copies of a book are on the shelf, in words and as a bar of copies. */
export function Availability({ copies }: { copies: Copy[] }) {
  const available = copies.filter((copy) => copy.status === 'available').length;
  return (
    <div className={styles.meter}>
      <p className={styles.count} aria-live="polite">
        <strong>{available}</strong> of {copies.length} {copies.length === 1 ? 'copy' : 'copies'} available
      </p>
      <span aria-hidden="true" className={styles.bar}>
        {copies.map((copy) => (
          <span key={copy.id} className={copy.status === 'available' ? styles.in : styles.out} />
        ))}
      </span>
    </div>
  );
}
