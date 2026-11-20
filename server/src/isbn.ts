/**
 * ISBN-13, the number printed on the back of every book since 2007. People type it with dashes or
 * spaces ('978-85-359-0277-5'); the library keeps only the 13 digits.
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

/** An ISBN as it is printed: 978-85-0000-000-0 for the Brazilian ones, the bare digits otherwise. */
export function formatIsbn(digits: string): string {
  return digits.startsWith('97885') ? `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5, 9)}-${digits.slice(9, 12)}-${digits[12]}` : digits;
}
