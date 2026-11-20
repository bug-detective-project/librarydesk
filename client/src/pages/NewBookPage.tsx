import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router';
import { createBook } from '../api/books.ts';
import { ApiError } from '../api/http.ts';
import { AuthorField } from '../components/AuthorField.tsx';
import type { AuthorChoice } from '../components/AuthorField.tsx';
import { Icon } from '../components/Icon.tsx';
import ui from '../components/ui.module.css';
import { maskIsbn } from '../masks.ts';
import { useToast } from '../useToast.ts';
import styles from './NewBookPage.module.css';

export function NewBookPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState<AuthorChoice>(null);
  const [isbn, setIsbn] = useState('');
  const [year, setYear] = useState('');
  const [copies, setCopies] = useState('1');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    try {
      const book = await createBook({
        title,
        ...(author && 'authorId' in author ? { authorId: author.authorId } : { authorName: author?.name ?? '' }),
        isbn,
        year: Number(year),
        copies: Number(copies),
      });
      toast.success(`${book.title} is in the collection`);
      navigate(`/books/${book.id}`);
    } catch (error) {
      if (error instanceof ApiError && Object.keys(error.fields).length > 0) {
        setErrors(error.fields);
      } else {
        toast.error(error instanceof Error ? error.message : 'Could not add the book');
      }
    } finally {
      setSaving(false);
    }
  }

  const fieldProps = (name: string) => ({ 'aria-invalid': errors[name] ? true : undefined, 'aria-describedby': errors[name] ? `${name}-error` : undefined });
  const fieldError = (name: string) => errors[name] && (
    <span id={`${name}-error`} className={ui.fieldError}>
      {errors[name]}
    </span>
  );

  return (
    <section>
      <Link to="/" className={styles.back}>
        <Icon name="back" />
        Collection
      </Link>
      <div className={ui.titleRow}>
        <h2>New book</h2>
      </div>
      <form className={ui.form} aria-label="New book" onSubmit={submit} noValidate>
        <div className={ui.field}>
          <label htmlFor="title">Title</label>
          <input id="title" value={title} onChange={(event) => setTitle(event.target.value)} {...fieldProps('title')} />
          {fieldError('title')}
        </div>
        <AuthorField value={author} onChange={setAuthor} error={errors.author} />
        <div className={styles.row}>
          <div className={ui.field}>
            <label htmlFor="isbn">ISBN</label>
            <input id="isbn" inputMode="numeric" placeholder="978-0-0000-0000-0" maxLength={17} value={isbn} onChange={(event) => setIsbn(maskIsbn(event.target.value))} {...fieldProps('isbn')} />
            {fieldError('isbn')}
          </div>
          <div className={ui.field}>
            <label htmlFor="year">Year</label>
            <input id="year" inputMode="numeric" value={year} onChange={(event) => setYear(event.target.value)} {...fieldProps('year')} />
            {fieldError('year')}
          </div>
          <div className={ui.field}>
            <label htmlFor="copies">Copies</label>
            <input id="copies" type="number" min="1" max="20" value={copies} onChange={(event) => setCopies(event.target.value)} {...fieldProps('copies')} />
            {fieldError('copies')}
          </div>
        </div>
        <div className={styles.actions}>
          <Link to="/" className={ui.button}>
            <Icon name="close" />
            Cancel
          </Link>
          <button type="submit" className={ui.primary} disabled={saving}>
            <Icon name="check" />
            Add book
          </button>
        </div>
      </form>
    </section>
  );
}
