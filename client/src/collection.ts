import type { Book } from './api/types.ts';

export type SortKey = 'title' | 'author' | 'newest';

export const SORTS: { key: SortKey; label: string }[] = [
  { key: 'title', label: 'Title' },
  { key: 'author', label: 'Author' },
  { key: 'newest', label: 'Newest' },
];

/** Portuguese alphabetical order: accents sort with their letter ("Éramos" between "Dom" and "Iracema"). */
const collator = new Intl.Collator('pt-BR', { sensitivity: 'base' });

/** The books in the order the librarian picked; the list it gets is left as it is. */
export function sortBooks(books: Book[], by: SortKey): Book[] {
  const sorted = [...books];
  if (by === 'title') {
    sorted.sort((a, b) => collator.compare(a.title, b.title));
  } else if (by === 'author') {
    sorted.sort((a, b) => collator.compare(a.author.name, b.author.name) || collator.compare(a.title, b.title));
  } else {
    sorted.sort((a, b) => b.year - a.year || collator.compare(a.title, b.title));
  }
  return sorted;
}
