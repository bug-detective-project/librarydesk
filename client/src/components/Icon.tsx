import type { ReactNode } from 'react';

/** The line icons of the app, by name, on a 24×24 grid. */
const ICONS = {
  back: <path d="M19 12H5m6-6-6 6 6 6" />,
  book: <path d="M4 5.5C6.7 4.300 9.300 4.500 12 6.500c2.700-2 5.300-2.200 8-1V19c-2.700-1.200-5.300-1-8 1-2.700-2-5.300-2.200-8-1zM12 6.500V20" />,
  bookmark: <path d="M7 3.5h10a1 1 0 0 1 1 1V21l-6-4-6 4V4.500a1 1 0 0 1 1-1z" />,
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="15" rx="2.5" />
      <path d="M3.5 10h17M8 3v4m8-4v4" />
    </>
  ),
  card: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <circle cx="9" cy="11" r="2" />
      <path d="M6 16a3 3 0 0 1 6 0M14.500 10h3.500M14.500 13.500h3.500" />
    </>
  ),
  cash: (
    <>
      <rect x="2.5" y="6" width="19" height="12" rx="2" />
      <circle cx="12" cy="12" r="2.500" />
      <path d="M6 9.500v5M18 9.500v5" />
    </>
  ),
  check: <path d="M5 12.500l4.500 4.500L19 7.500" />,
  close: <path d="M6.500 6.500l11 11m0-11-11 11" />,
  copies: <path d="M8 4h10a2 2 0 0 1 2 2v12M6 8h9a1 1 0 0 1 1 1v11H7a1 1 0 0 1-1-1z" />,
  lend: <path d="M4 12h12m-4-5 5 5-5 5M20 5v14" />,
  plus: <path d="M12 5v14M5 12h14" />,
  renew: <path d="M20 11a8 8 0 0 0-14.500-4.500L4 8m0-4v4h4M4 13a8 8 0 0 0 14.500 4.500L20 16m0 4v-4h-4" />,
  return: <path d="M20 12H8m4-5-5 5 5 5M4 5v14" />,
  search: (
    <>
      <circle cx="11" cy="11" r="6.500" />
      <path d="M16 16l4.500 4.500" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3.500" />
      <path d="M2.500 20a6.500 6.500 0 0 1 13 0M16 4.600a3.500 3.500 0 0 1 0 6.800M17.500 14a6.500 6.500 0 0 1 4 6" />
    </>
  ),
  warning: <path d="M12 4 2.500 20h19zM12 10v4.500m0 2.500v.5" />,
} satisfies Record<string, ReactNode>;

export type IconName = keyof typeof ICONS;

/** An icon in the color of the text it sits in; a label next to it says what it means. */
export function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {ICONS[name]}
    </svg>
  );
}
