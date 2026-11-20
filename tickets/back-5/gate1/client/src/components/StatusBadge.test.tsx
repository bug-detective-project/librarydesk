import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { Status } from '../api/types.ts';
import { StatusBadge } from './StatusBadge.tsx';

const LABELS: [Status, string][] = [
  ['available', 'Available'],
  ['on_loan', 'On loan'],
  ['reserved', 'Reserved'],
  ['overdue', 'Overdue'],
  ['returned', 'Returned'],
];

describe('the status badge', () => {
  it('says each status in words', () => {
    for (const [status, label] of LABELS) {
      const { unmount } = render(<StatusBadge status={status} />);
      expect(screen.getByText(label), status).toBeInTheDocument();
      unmount();
    }
  });

  it('marks its status, so a style and a test can tell them apart', () => {
    for (const [status, label] of LABELS) {
      const { unmount } = render(<StatusBadge status={status} />);
      expect(screen.getByText(label).closest('[data-status]'), status).toHaveAttribute('data-status', status);
      unmount();
    }
  });

  it('gives each status a style of its own', () => {
    const classes = LABELS.map(([status, label]) => {
      const { unmount } = render(<StatusBadge status={status} />);
      const name = screen.getByText(label).closest('[data-status]')!.className;
      unmount();
      return name;
    });

    expect(new Set(classes).size).toBe(LABELS.length);
    expect(classes.every((name) => name.trim() !== '')).toBe(true);
  });
});
