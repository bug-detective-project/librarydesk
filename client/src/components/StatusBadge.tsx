import type { Status } from '../api/types.ts';

/**
 * TODO (LD-106): the badge of a status: the status in words ("On loan"), with a color of its own
 * for each one. See the ticket for the five statuses and their colors.
 */
export function StatusBadge({ status }: { status: Status }) {
  return <span>{status}</span>;
}
