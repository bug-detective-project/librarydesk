/** Reais as Brazilians write them: R$ 3,50. */
const REAIS = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

export function formatReais(amount: number): string {
  // Intl puts a no-break space after R$; a plain one reads and searches the same everywhere.
  return REAIS.format(amount).replace(/\s/, ' ');
}

/** The fines a reader still owes: those of the loans that came back late and are not paid. */
export function finesDue(loans: { returnedAt: string | null; fine: string; finePaid: boolean }[]): number {
  return loans.filter((loan) => loan.returnedAt && !loan.finePaid).reduce((total, loan) => total + Number(loan.fine), 0);
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** A day of the API ('2026-03-23') as the desk reads it: Mar 23, 2026. */
export function formatDay(day: string): string {
  const [year, month, date] = day.split('-').map(Number);
  return `${MONTHS[month! - 1]} ${date}, ${year}`;
}

/** A moment of the API as the day it happened in São Paulo. */
export function formatMoment(iso: string): string {
  return formatDay(new Date(iso).toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' }));
}

/** The initials on a reader's avatar: 'AS' for Ana Souza. */
export function initials(name: string): string {
  const words = name.split(/\s+/).filter(Boolean);
  return `${words[0]?.[0] ?? ''}${words.length > 1 ? words.at(-1)![0] : ''}`.toUpperCase();
}

/** How a due date reads next to today: 'Due today', 'Due in 4 days', '6 days late'. */
export function dueText(dueOn: string, today: string): string {
  const days = Math.round((Date.parse(`${dueOn}T00:00:00Z`) - Date.parse(`${today}T00:00:00Z`)) / 86_400_000);
  if (days === 0) {
    return 'Due today';
  }
  if (days > 0) {
    return days === 1 ? 'Due tomorrow' : `Due in ${days} days`;
  }
  return days === -1 ? '1 day late' : `${-days} days late`;
}
