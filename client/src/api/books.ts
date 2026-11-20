import { request } from './http.ts';
import type { Author, Book, BookDetails, NewBook, ReservationResult } from './types.ts';

export function getBooks(q = '', signal?: AbortSignal): Promise<Book[]> {
  return request<Book[]>(q ? `/api/books?q=${encodeURIComponent(q)}` : '/api/books', { signal });
}

export function getBook(id: number, signal?: AbortSignal): Promise<BookDetails> {
  return request<BookDetails>(`/api/books/${id}`, { signal });
}

export function createBook(book: NewBook): Promise<BookDetails> {
  return request<BookDetails>('/api/books', { method: 'POST', body: book });
}

export function searchAuthors(q: string, signal?: AbortSignal): Promise<Author[]> {
  return request<Author[]>(`/api/authors?q=${encodeURIComponent(q)}`, { signal });
}

export function reserveBook(bookId: number, readerId: number): Promise<ReservationResult> {
  return request<ReservationResult>(`/api/books/${bookId}/reservations`, { method: 'POST', body: { readerId } });
}
