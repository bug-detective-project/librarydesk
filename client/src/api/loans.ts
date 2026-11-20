import { request } from './http.ts';
import type { Loan } from './types.ts';

export function getLoans(status: 'active' | 'overdue', signal?: AbortSignal): Promise<Loan[]> {
  return request<Loan[]>(`/api/loans?status=${status}`, { signal });
}

export function lendCopy(copyId: number, readerId: number): Promise<Loan> {
  return request<Loan>('/api/loans', { method: 'POST', body: { copyId, readerId } });
}

export function returnLoan(id: number): Promise<Loan> {
  return request<Loan>(`/api/loans/${id}/return`, { method: 'POST' });
}

export function renewLoan(id: number): Promise<Loan> {
  return request<Loan>(`/api/loans/${id}/renew`, { method: 'POST' });
}
