/**
 * The library's calendar. Due dates are days ('2026-03-09') in the school's time zone; returns are
 * moments. LIBRARYDESK_TODAY fixes the day (the QA runs on a known Monday) and LIBRARYDESK_TIME the
 * time of day, so every run gives the same due dates and fines.
 */
export const LIBRARY_TIME_ZONE = 'America/Sao_Paulo';
/** São Paulo has had no daylight saving time since 2019. */
const LIBRARY_UTC_OFFSET = '-03:00';
const DAY_MS = 24 * 60 * 60 * 1000;

const DAY = /^\d{4}-\d{2}-\d{2}$/;
const TIME = /^\d{2}:\d{2}(:\d{2})?$/;

/** The day of a moment in the school's time zone, as YYYY-MM-DD. */
export function libraryDate(moment: Date): string {
  return moment.toLocaleDateString('en-CA', { timeZone: LIBRARY_TIME_ZONE });
}

function libraryTime(moment: Date): string {
  return moment.toLocaleTimeString('en-GB', { timeZone: LIBRARY_TIME_ZONE, hour12: false });
}

/** Today in the library. */
export function today(env: Record<string, string | undefined> = process.env): string {
  const fixed = env.LIBRARYDESK_TODAY;
  return fixed && DAY.test(fixed) ? fixed : libraryDate(new Date());
}

/** This moment in the library: the fixed day and time when they are set, the real ones otherwise. */
export function now(env: Record<string, string | undefined> = process.env): Date {
  const day = today(env);
  const fixedTime = env.LIBRARYDESK_TIME;
  const time = fixedTime && TIME.test(fixedTime) ? fixedTime : libraryTime(new Date());
  return new Date(`${day}T${time.length === 5 ? `${time}:00` : time}${LIBRARY_UTC_OFFSET}`);
}

/** The day n days after (or before, for a negative n) a day. */
export function addDays(day: string, n: number): string {
  const date = new Date(`${day}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + n);
  return date.toISOString().slice(0, 10);
}

/** How many days go from one day to another: 1 from Monday to Tuesday, -1 back. */
export function daysBetween(from: string, to: string): number {
  return Math.round((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / DAY_MS);
}
