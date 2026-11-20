import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import styles from './toast.module.css';
import { ToastContext } from './useToast.ts';
import type { ToastValue } from './useToast.ts';

type Tone = 'success' | 'error';

interface Toast {
  id: number;
  tone: Tone;
  message: string;
}

/** How long a toast stays, in milliseconds. */
const DURATION: Record<Tone, number> = { success: 4000, error: 7000 };

/** The toasts of the app: put once around the screens, so a toast outlives a change of screen. */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextIdRef = useRef(1);

  const dismiss = useCallback((id: number) => setToasts((list) => list.filter((toast) => toast.id !== id)), []);
  const show = useCallback((tone: Tone, message: string) => {
    const id = nextIdRef.current++;
    setToasts((list) => [...list, { id, tone, message }]);
  }, []);
  const value = useMemo<ToastValue>(() => ({ success: (message) => show('success', message), error: (message) => show('error', message) }), [show]);

  return (
    <ToastContext value={value}>
      {children}
      <div className={styles.region} aria-label="Notifications">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} dismiss={dismiss} />
        ))}
      </div>
    </ToastContext>
  );
}

/** One toast. Its time starts when it shows and depends on nothing else, so another toast does not reset it. */
function ToastItem({ toast, dismiss }: { toast: Toast; dismiss: (id: number) => void }) {
  useEffect(() => {
    const timer = setTimeout(() => dismiss(toast.id), DURATION[toast.tone]);
    return () => clearTimeout(timer);
  }, [toast.id, toast.tone, dismiss]);

  return (
    <div data-testid="toast" className={`${styles.toast} ${styles[toast.tone]}`}>
      <span aria-hidden="true" className={styles.icon}>
        {toast.tone === 'success' ? '✓' : '!'}
      </span>
      {/* The message alone carries the role, so a screen reader (and a test) reads just the message. */}
      <p role={toast.tone === 'success' ? 'status' : 'alert'} className={styles.message}>
        {toast.message}
      </p>
      <button type="button" className={styles.dismiss} aria-label="Dismiss" onClick={() => dismiss(toast.id)}>
        ×
      </button>
    </div>
  );
}
