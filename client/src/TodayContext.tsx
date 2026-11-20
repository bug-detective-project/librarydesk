import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { request } from './api/http.ts';
import { TodayContext } from './useToday.ts';

/** Asks the server which day is today and shows the app once it answered. */
export function TodayProvider({ children }: { children: ReactNode }) {
  const [today, setToday] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let current = true;
    request<{ today: string }>('/api/today')
      .then((answer) => {
        if (current) {
          setToday(answer.today);
        }
      })
      .catch(() => {
        if (current) {
          setFailed(true);
        }
      });
    return () => {
      current = false;
    };
  }, []);

  if (failed) {
    return <p role="alert">LibraryDesk could not reach its server. Check that it is running and reload the page.</p>;
  }
  if (today === null) {
    return <p>Loading…</p>;
  }
  return <TodayContext value={today}>{children}</TodayContext>;
}
