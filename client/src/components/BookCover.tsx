import styles from './BookCover.module.css';

/** Cloth colors of old library bindings; a book always gets the same one. */
const BINDINGS = [
  ['#1f5b4f', '#e9dcc0'],
  ['#7a2e2e', '#f1dfc4'],
  ['#2c4a6e', '#e6e0cc'],
  ['#5b3f6e', '#efe2c8'],
  ['#8a5a14', '#f6ead2'],
  ['#3d5a2a', '#ece3c9'],
] as const;

/** A drawn cover: the binding color, the title in serif and the author at the foot. */
export function BookCover({ id, title, author, size = 'small' }: { id: number; title: string; author: string; size?: 'small' | 'large' }) {
  const [cloth, ink] = BINDINGS[id % BINDINGS.length]!;
  return (
    <span aria-hidden="true" className={`${styles.cover} ${styles[size]}`} style={{ background: cloth, color: ink }}>
      <span className={styles.band} />
      <span className={styles.title}>{title}</span>
      <span className={styles.author}>{author}</span>
    </span>
  );
}
