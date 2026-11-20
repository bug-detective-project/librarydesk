import { useState } from 'react';
import type { FormEvent } from 'react';
import { reserveBook } from '../api/books.ts';
import type { BookDetails, ReaderSummary } from '../api/types.ts';
import { useToast } from '../useToast.ts';
import { Icon } from './Icon.tsx';
import styles from './BookForms.module.css';
import ui from './ui.module.css';

/** Puts a reader on the list of a book: a copy is put aside if one is in, a place in the queue if not. */
export function ReserveForm({ book, readers, onReserved }: { book: BookDetails; readers: ReaderSummary[]; onReserved: () => void }) {
  const toast = useToast();
  const [readerId, setReaderId] = useState('');
  const [saving, setSaving] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!readerId) {
      return;
    }
    setSaving(true);
    try {
      const reader = readers.find((one) => String(one.id) === readerId)!;
      await reserveBook(book.id, reader.id);
      // TODO (LD-108): a book with every copy out puts the reader in its queue; say their place.
      toast.success(`A copy of ${book.title} is put aside for ${reader.name}`);
      setReaderId('');
      onReserved();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not reserve the book');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className={styles.form} aria-label="Reserve" onSubmit={submit}>
      <label className={ui.field}>
        <span>Reader</span>
        <select value={readerId} onChange={(event) => setReaderId(event.target.value)} required>
          <option value="">Choose a reader</option>
          {readers.map((reader) => (
            <option key={reader.id} value={reader.id}>
              {reader.name} · {reader.group}
            </option>
          ))}
        </select>
      </label>
      <button type="submit" className={ui.button} disabled={saving || !readerId}>
        <Icon name="bookmark" />
        Reserve
      </button>
    </form>
  );
}
