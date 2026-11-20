import { useEffect, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { searchAuthors } from '../api/books.ts';
import type { Author } from '../api/types.ts';
import styles from './AuthorField.module.css';
import ui from './ui.module.css';

export type AuthorChoice = { authorId: number; name: string } | { authorName: string; name: string } | null;

interface AuthorFieldProps {
  value: AuthorChoice;
  onChange: (choice: AuthorChoice) => void;
  error?: string;
}

/**
 * Finds the author as the librarian types: the arrows move through the names the library has,
 * Enter picks one (or keeps the name as a new author), and Escape closes the list.
 */
export function AuthorField({ value, onChange, error }: AuthorFieldProps) {
  const [text, setText] = useState(value?.name ?? '');
  const [matches, setMatches] = useState<Author[]>([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);

  useEffect(() => {
    const q = text.trim();
    if (!open || q.length < 2) {
      return;
    }
    const controller = new AbortController();
    searchAuthors(q, controller.signal).then(
      (found) => {
        setMatches(found);
        setActive(-1);
      },
      () => {},
    );
    return () => controller.abort();
  }, [text, open]);

  const shown = open && text.trim().length >= 2 ? matches : [];

  function pick(author: Author) {
    setText(author.name);
    setOpen(false);
    onChange({ authorId: author.id, name: author.name });
  }

  function keyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowDown' && shown.length > 0) {
      event.preventDefault();
      setActive((index) => (index + 1) % shown.length);
    } else if (event.key === 'ArrowUp' && shown.length > 0) {
      event.preventDefault();
      setActive((index) => (index <= 0 ? shown.length - 1 : index - 1));
    } else if (event.key === 'Escape') {
      setOpen(false);
    } else if (event.key === 'Enter') {
      // Enter answers the list, not the form: the book is saved only by its button.
      event.preventDefault();
      const chosen = shown[active] ?? shown.find((author) => author.name.toLowerCase() === text.trim().toLowerCase());
      if (chosen) {
        pick(chosen);
      } else if (text.trim()) {
        setOpen(false);
        onChange({ authorName: text.trim(), name: text.trim() });
      }
    }
  }

  return (
    <div className={`${ui.field} ${styles.wrap}`}>
      <label htmlFor="author">Author</label>
      <input
        id="author"
        role="combobox"
        autoComplete="off"
        aria-expanded={shown.length > 0}
        aria-controls="author-options"
        aria-activedescendant={active >= 0 ? `author-option-${shown[active]?.id}` : undefined}
        aria-invalid={error ? true : undefined}
        placeholder="Start typing a name"
        value={text}
        onChange={(event) => {
          setText(event.target.value);
          setOpen(true);
          onChange(event.target.value.trim() ? { authorName: event.target.value.trim(), name: event.target.value.trim() } : null);
        }}
        onKeyDown={keyDown}
        onBlur={() => setOpen(false)}
      />
      {shown.length > 0 && (
        <ul id="author-options" role="listbox" aria-label="Authors" className={styles.options}>
          {shown.map((author, index) => (
            <li
              key={author.id}
              id={`author-option-${author.id}`}
              role="option"
              aria-selected={index === active}
              className={index === active ? styles.active : undefined}
              // A mouse press would blur the field first and close the list: keep the focus.
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => pick(author)}
            >
              {author.name}
            </li>
          ))}
        </ul>
      )}
      {value && 'authorName' in value && <span className={styles.hint}>New author: {value.authorName}</span>}
      {error && <span className={ui.fieldError}>{error}</span>}
    </div>
  );
}
