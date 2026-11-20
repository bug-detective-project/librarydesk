import { daysBetween, libraryDate } from './clock.ts';

/** A loan lasts two weeks; a renewal gives two more weeks from the day it is renewed. */
export const LOAN_DAYS = 14;
export const MAX_RENEWALS = 2;
/** R$ 0.50 for each day a book comes back late. */
export const FINE_PER_DAY = 0.5;

/** How many days late a book came back: 0 when it came back on or before its due day. */
export function lateDays(dueOn: string, returnedAt: Date): number {
  return Math.max(0, daysBetween(dueOn, libraryDate(returnedAt)));
}

/** The fine of a book that came back at a moment, as the decimal text MySQL keeps ('1.50'). */
export function fineFor(dueOn: string, returnedAt: Date): string {
  return (lateDays(dueOn, returnedAt) * FINE_PER_DAY).toFixed(2);
}

/** Reais as the desk says them: 'R$ 3.50'. */
export function reais(amount: number): string {
  return `R$ ${amount.toFixed(2)}`;
}
