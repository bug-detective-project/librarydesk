/**
 * ISBN-13, the number printed on the back of every book since 2007. People type it with dashes or
 * spaces ('978-0-0611-2008-4'); the library keeps only the 13 digits.
 */

/** The digits of an ISBN as typed, without the dashes and spaces between its groups. */
export function normalizeIsbn(typed: string): string {
  return typed.replace(/[\s-]/g, '');
}

/** True for 13 digits whose last one is the check digit of the other twelve. */
export function isValidIsbn(digits: string): boolean {
  if (!/^\d{13}$/.test(digits)) {
    return false;
  }
  const sum = [...digits.slice(0, 12)].reduce((total, digit, index) => total + Number(digit) * (index % 2 === 0 ? 1 : 3), 0);
  return (10 - (sum % 10)) % 10 === Number(digits[12]);
}

/** The digits of a valid ISBN, or null when the text is not one. */
export function parseIsbn(typed: string): string | null {
  const digits = normalizeIsbn(typed);
  return isValidIsbn(digits) ? digits : null;
}

/** The groups the desk prints an ISBN in: 978-0-0000-0000-0. */
const GROUPS = [3, 1, 4, 4, 1];

/** An ISBN as the desk prints it, with a dash between the groups. */
export function formatIsbn(digits: string): string {
  let rest = digits;
  return GROUPS.map((size) => {
    const group = rest.slice(0, size);
    rest = rest.slice(size);
    return group;
  }).join('-');
}
