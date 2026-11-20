import { useEffect, useRef } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';
import { Icon } from './Icon.tsx';
import type { IconName } from './Icon.tsx';
import styles from './Dialog.module.css';
import ui from './ui.module.css';

interface ConfirmDialogProps {
  /** The question in a few words, the name of the dialog: "Mark the fines as paid". */
  title: string;
  /** What the action does, in a sentence or two. */
  children: ReactNode;
  /** The text of the button that does it: "Mark as paid". */
  confirmLabel: string;
  confirmIcon?: IconName;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Asks before an action that cannot be undone at the desk. It opens with the focus on Cancel, the safe choice;
 * Escape, ×, Cancel and a press around it give up, and Tab stays inside it.
 */
export function ConfirmDialog({ title, children, confirmLabel, confirmIcon = 'check', onConfirm, onCancel }: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    cancelRef.current?.focus();
  }, []);

  function dialogKey(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Escape') {
      event.stopPropagation();
      onCancel();
      return;
    }
    if (event.key !== 'Tab') {
      return;
    }
    const stops = [...(dialogRef.current?.querySelectorAll<HTMLElement>('button') ?? [])];
    const first = stops[0];
    const last = stops.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  }

  return (
    <div className={styles.backdrop} onMouseDown={(event) => event.target === event.currentTarget && onCancel()}>
      <div
        ref={dialogRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-text"
        className={styles.dialog}
        onKeyDown={dialogKey}
      >
        <div className={styles.head}>
          <h3 id="confirm-dialog-title">{title}</h3>
          <button type="button" className={styles.close} aria-label="Close" onClick={onCancel}>
            ×
          </button>
        </div>
        <p id="confirm-dialog-text" className={styles.text}>
          {children}
        </p>
        <div className={styles.actions}>
          <button ref={cancelRef} type="button" className={ui.button} onClick={onCancel}>
            <Icon name="close" />
            Cancel
          </button>
          <button type="button" className={ui.primary} onClick={onConfirm}>
            <Icon name={confirmIcon} />
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
