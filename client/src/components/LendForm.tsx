import { useState } from 'react';
import type { FormEvent } from 'react';
import { lendCopy } from '../api/loans.ts';
import type { Copy, ReaderSummary } from '../api/types.ts';
import { formatDay } from '../format.ts';
import { useToast } from '../useToast.ts';
import { Icon } from './Icon.tsx';
import styles from './BookForms.module.css';
import ui from './ui.module.css';

/** Lends one of the copies on the shelf to a reader. */
export function LendForm({ copies, readers, onLent }: { copies: Copy[]; readers: ReaderSummary[]; onLent: () => void }) {
  const toast = useToast();
  const available = copies.filter((copy) => copy.status === 'available');
  const [copyId, setCopyId] = useState('');
  const [readerId, setReaderId] = useState('');
  const [saving, setSaving] = useState(false);
  // The first copy on the shelf, unless the librarian picked another one that is still there.
  const chosenCopy = available.some((copy) => String(copy.id) === copyId) ? copyId : String(available[0]?.id ?? '');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!readerId || !chosenCopy) {
      return;
    }
    setSaving(true);
    try {
      const loan = await lendCopy(Number(chosenCopy), Number(readerId));
      toast.success(`Copy ${loan.copy.code} lent to ${loan.reader.name} until ${formatDay(loan.dueOn)}`);
      setReaderId('');
      onLent();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not lend the copy');
    } finally {
      setSaving(false);
    }
  }

  if (available.length === 0) {
    return <p className={ui.muted}>Every copy is out. Reserve the book to join the queue.</p>;
  }
  return (
    <form className={styles.form} aria-label="Lend a copy" onSubmit={submit}>
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
      <label className={ui.field}>
        <span>Copy</span>
        <select value={chosenCopy} onChange={(event) => setCopyId(event.target.value)}>
          {available.map((copy) => (
            <option key={copy.id} value={copy.id}>
              {copy.code}
            </option>
          ))}
        </select>
      </label>
      <button type="submit" className={ui.primary} disabled={saving || !readerId}>
        <Icon name="lend" />
        Lend
      </button>
    </form>
  );
}
