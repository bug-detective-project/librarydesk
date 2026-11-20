import type { Book } from './api/types.ts';

export type SortKey = 'title' | 'author' | 'newest';

export const SORTS: { key: SortKey; label: string }[] = [
  { key: 'title', label: 'Title' },
  { key: 'author', label: 'Author' },
  { key: 'newest', label: 'Newest' },
];

const collator = new Intl.Collator('en', { sensitivity: 'base' });

/**
 * The filing rule of every library catalog: a title is filed without its leading article, so
 * "The Giver" goes under G and "A Wrinkle in Time" under W.
 */
export function filingTitle(title: string): string {
  return title.replace(/^(the|a|an)\s+/i, '');
}

/** The books in the order the librarian picked; the list it gets is left as it is. */
export function sortBooks(books: Book[], by: SortKey): Book[] {
  const sorted = [...books];
  if (by === 'title') {
    sorted.sort((a, b) => collator.compare(filingTitle(a.title), filingTitle(b.title)));
  } else if (by === 'author') {
    sorted.sort((a, b) => collator.compare(a.author.name, b.author.name) || collator.compare(filingTitle(a.title), filingTitle(b.title)));
  } else {
    sorted.sort((a, b) => b.year - a.year || collator.compare(filingTitle(a.title), filingTitle(b.title)));
  }
  return sorted;
}
