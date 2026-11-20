import { createContext, use } from 'react';

export const TodayContext = createContext<string | null>(null);

/** The day the server calls today, as YYYY-MM-DD. The app never reads the clock of the computer. */
export function useToday(): string {
  const today = use(TodayContext);
  if (today === null) {
    throw new Error('useToday must be used inside TodayProvider');
  }
  return today;
}
