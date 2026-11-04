import type { ApiError } from '../../shared/types';

export class ApiRequestError extends Error {
  status: number;
  data: ApiError & Record<string, unknown>;
  constructor(status: number, data: ApiError & Record<string, unknown>) {
    super(data.error);
    this.status = status;
    this.data = data;
  }
}

export async function api<T>(
  path: string,
  options: { method?: string; body?: unknown; headers?: Record<string, string>; signal?: AbortSignal } = {},
): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`/api${path}`, {
      method: options.method ?? (options.body ? 'POST' : 'GET'),
      headers: { ...(options.body ? { 'content-type': 'application/json' } : {}), ...options.headers },
      body: options.body ? JSON.stringify(options.body) : undefined,
      signal: options.signal,
    });
  } catch (err) {
    if ((err as Error).name === 'AbortError') throw err;
    throw new ApiRequestError(0, { error: 'Could not reach the store server. Is the API running?' });
  }
  const data = await res.json().catch(() => ({ error: 'Unexpected response from the server.' }));
  if (!res.ok) throw new ApiRequestError(res.status, data);
  return data as T;
}

export const errorMessage = (err: unknown) =>
  err instanceof ApiRequestError || err instanceof Error ? err.message : 'Something went wrong.';
