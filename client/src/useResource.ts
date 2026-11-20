import { useCallback, useEffect, useState } from 'react';

interface Resource<T> {
  data: T | null;
  error: string | null;
  /** Loads it again, keeping what is on the screen until the new answer comes. */
  reload: () => void;
}

/**
 * Loads something from the API while a screen shows it. `key` says what to load: a new key loads
 * again, and an answer for an old key that comes late is dropped.
 */
export function useResource<T>(key: string, load: (signal: AbortSignal) => Promise<T>): Resource<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal).then(
      (value) => {
        setData(value);
        setError(null);
      },
      (reason: unknown) => {
        if (!controller.signal.aborted) {
          setError(reason instanceof Error ? reason.message : 'Could not load');
        }
      },
    );
    return () => controller.abort();
    // `load` is a new function on every render; the key says when it loads something else.
    // eslint-disable-next-line react-hooks/exhaustive-deps, @eslint-react/exhaustive-deps
  }, [key, version]);

  const reload = useCallback(() => setVersion((value) => value + 1), []);
  return { data, error, reload };
}
