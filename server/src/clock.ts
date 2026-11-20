/**
 * The library's calendar. Due dates are days ('2026-03-09') in the school's time zone; returns are
 * moments. LIBRARYDESK_TODAY fixes the day (the QA runs on a known Monday) and LIBRARYDESK_TIME the
 * time of day, so every run gives the same due dates and fines.
 */
export const LIBRARY_TIME_ZONE = 'America/New_York';
const DAY_MS = 24 * 60 * 60 * 1000;

const DAY = /^\d{4}-\d{2}-\d{2}$/;
const TIME = /^\d{2}:\d{2}(:\d{2})?$/;

const clockFormat = new Intl.DateTimeFormat('en-US', {
  timeZone: LIBRARY_TIME_ZONE,
  hourCycle: 'h23',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
});

/** The wall clock of the school at a moment: { day: 'YYYY-MM-DD', time: 'HH:MM:SS' }. */
function wallClock(moment: Date): { day: string; time: string } {
  const parts = clockFormat.formatToParts(moment);
  const part = (type: string) => parts.find((item) => item.type === type)!.value;
  return { day: `${part('year')}-${part('month')}-${part('day')}`, time: `${part('hour')}:${part('minute')}:${part('second')}` };
}

/** How far the school's clock is from UTC at a moment (negative: New York is behind), in ms. */
function offsetAt(moment: Date): number {
  const { day, time } = wallClock(moment);
  return Date.parse(`${day}T${time}Z`) - Math.floor(moment.getTime() / 1000) * 1000;
}

/** The moment the school's clock shows a day and a time, daylight saving time included. */
export function libraryMoment(day: string, time: string): Date {
  const seconds = time.length === 5 ? `${time}:00` : time;
  const asUtc = Date.parse(`${day}T${seconds}Z`);
  const first = asUtc - offsetAt(new Date(asUtc));
  return new Date(asUtc - offsetAt(new Date(first)));
}

/** The day of a moment in the school's time zone, as YYYY-MM-DD. */
export function libraryDate(moment: Date): string {
  return wallClock(moment).day;
}

/** Today in the library. */
export function today(env: Record<string, string | undefined> = process.env): string {
  const fixed = env.LIBRARYDESK_TODAY;
  return fixed && DAY.test(fixed) ? fixed : libraryDate(new Date());
}

/** This moment in the library: the fixed day and time when they are set, the real ones otherwise. */
export function now(env: Record<string, string | undefined> = process.env): Date {
  const fixedTime = env.LIBRARYDESK_TIME;
  if (!env.LIBRARYDESK_TODAY && !fixedTime) {
    return new Date();
  }
  const time = fixedTime && TIME.test(fixedTime) ? fixedTime : wallClock(new Date()).time;
  return libraryMoment(today(env), time);
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
