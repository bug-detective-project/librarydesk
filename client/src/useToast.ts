import { createContext, use } from 'react';

export interface ToastValue {
  /** A short note that an action worked; it goes away by itself after a few seconds. */
  success: (message: string) => void;
  /** What went wrong in an action; it stays a little longer, and is read out at once. */
  error: (message: string) => void;
}

export const ToastContext = createContext<ToastValue | null>(null);

/** The toasts, for any component under the ToastProvider (ToastContext.tsx). */
export function useToast(): ToastValue {
  const value = use(ToastContext);
  if (!value) {
    throw new Error('useToast must be used inside ToastProvider');
  }
  return value;
}
