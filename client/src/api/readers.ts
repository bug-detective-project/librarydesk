import { request } from './http.ts';
import type { Loan, ReaderDetails, ReaderSummary } from './types.ts';

export function getReaders(q = '', signal?: AbortSignal): Promise<ReaderSummary[]> {
  return request<ReaderSummary[]>(q ? `/api/readers?q=${encodeURIComponent(q)}` : '/api/readers', { signal });
}

export function getReader(id: number, signal?: AbortSignal): Promise<ReaderDetails> {
  return request<ReaderDetails>(`/api/readers/${id}`, { signal });
}

export function getReaderLoans(id: number, signal?: AbortSignal): Promise<Loan[]> {
  return request<Loan[]>(`/api/readers/${id}/loans`, { signal });
}

export function payFines(id: number): Promise<{ paid: number }> {
  return request<{ paid: number }>(`/api/readers/${id}/fines/pay`, { method: 'POST' });
}
