/**
 * Typed API client — the single request layer for the entire app.
 *
 * - Cookie-based auth (`credentials: "include"`) for same-origin API calls
 * - Automatic request timeout via AbortController
 * - Optional external `signal` for effect cleanup (race-safe requests)
 * - Typed helpers: get / post / put / del
 * - Consistent ResponseError that preserves the backend's error message
 * - External URLs (e.g. Nominatim) are fetched without cookies/JSON headers
 */

export const BASE_URL =
  (import.meta.env.VITE_PUBLIC_BASE_API_URL || "http://127.0.0.1:42007") + "/api";

const DEFAULT_TIMEOUT_MS = 15000;

export class ResponseError extends Error {
  response: Response;
  status: number;
  info: unknown;

  constructor(message: string, response: Response, info: unknown) {
    super(message);
    this.name = "ResponseError";
    this.response = response;
    this.status = response.status;
    this.info = info;
  }
}

export interface RequestOptions {
  method?: string;
  body?: unknown;
  headers?: HeadersInit;
  signal?: AbortSignal;
  timeoutMs?: number;
}

export async function request<T = unknown>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const isRelative = !path.startsWith("http");
  const { timeoutMs = DEFAULT_TIMEOUT_MS, body, signal, headers, method, ...rest } = options;

  const timeoutController = new AbortController();
  const timeoutId = setTimeout(() => timeoutController.abort(), timeoutMs);
  const combinedSignal = signal
    ? AbortSignal.any([timeoutController.signal, signal])
    : timeoutController.signal;

  try {
    const res = await fetch(isRelative ? `${BASE_URL}${path}` : path, {
      ...rest,
      method: method || "GET",
      credentials: isRelative ? "include" : "omit",
      headers: isRelative
        ? { "Content-Type": "application/json", ...(headers || {}) }
        : (headers || {}),
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: combinedSignal,
    });

    if (!res.ok) {
      let info: unknown = null;
      try {
        info = await res.json();
      } catch {
        info = { message: res.statusText || "Request failed" };
      }
      const message =
        info &&
        typeof info === "object" &&
        "message" in info &&
        typeof (info as { message?: unknown }).message === "string"
          ? (info as { message: string }).message
          : "An error occurred while fetching the data.";
      throw new ResponseError(message, res, info);
    }

    if (res.status === 204) return undefined as T;
    const text = await res.text();
    return (text ? JSON.parse(text) : undefined) as T;
  } finally {
    clearTimeout(timeoutId);
  }
}

export const get = <T = unknown>(path: string, options?: RequestOptions) =>
  request<T>(path, { method: "GET", ...options });

export const post = <T = unknown>(path: string, body?: unknown, options?: RequestOptions) =>
  request<T>(path, { method: "POST", body, ...options });

export const put = <T = unknown>(path: string, body?: unknown, options?: RequestOptions) =>
  request<T>(path, { method: "PUT", body, ...options });

export const del = <T = unknown>(path: string, options?: RequestOptions) =>
  request<T>(path, { method: "DELETE", ...options });

/** SWR-compatible GET fetcher. */
export const fetcher = async <T = unknown>(url: string): Promise<T> => request<T>(url);
