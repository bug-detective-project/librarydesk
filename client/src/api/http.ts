/** An answer of the API that is not a success, with the message the server wrote for the user. */
export class ApiError extends Error {
  status: number;
  fields: Record<string, string>;

  constructor(status: number, message: string, fields: Record<string, string> = {}) {
    super(message);
    this.status = status;
    this.fields = fields;
  }
}

interface ErrorBody {
  error?: string;
  fields?: Record<string, string>;
}

/** Calls the API and gives the JSON it answered (undefined for an empty answer). */
export async function request<T>(path: string, init: { method?: string; body?: unknown; signal?: AbortSignal } = {}): Promise<T> {
  const response = await fetch(path, {
    method: init.method ?? 'GET',
    headers: init.body === undefined ? undefined : { 'Content-Type': 'application/json' },
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
    signal: init.signal,
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as ErrorBody;
    throw new ApiError(response.status, body.error ?? `The request failed (${response.status})`, body.fields);
  }
  if (response.status === 204) {
    return undefined as T;
  }
  return (await response.json()) as T;
}
