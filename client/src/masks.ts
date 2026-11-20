/** The groups of an ISBN-13 as Brazilian books print it: 978-85-0000-000-0. */
const ISBN_GROUPS = [3, 2, 4, 3, 1];

/**
 * An ISBN as the librarian types it: digits only, at most 13, with a dash between the groups.
 * Anything else typed or pasted (letters, spaces, other dashes) is dropped.
 */
export function maskIsbn(typed: string): string {
  let digits = typed.replace(/\D/g, '').slice(0, 13);
  const groups: string[] = [];
  for (const size of ISBN_GROUPS) {
    if (!digits) {
      break;
    }
    groups.push(digits.slice(0, size));
    digits = digits.slice(size);
  }
  return groups.join('-');
}
