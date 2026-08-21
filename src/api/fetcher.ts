/**
 * Typed API client — the single request layer for the entire app.
 *
 * - Cookie-based auth (`credentials: "include"`) for same-origin API calls
 * - Automatic request timeout via AbortController
 * - Optional external `signal` for effect cleanup (race-safe requests)
 * - Typed helpers: get / post / put / del
 * - Consistent ResponseError that preserves the backend's error message
 * - External URLs (e.g. Nominatim) are fetched without cookies/JSON headers
 * - Automatic token refresh on 401 (single retry, then fail)
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

// ─── Token refresh ──────────────────────────────────────────────────────────

let refreshInFlight: Promise<boolean> | null = null;

/**
 * Attempt to refresh the access token via the refresh endpoint.
 * Returns true if the refresh succeeded.
 */
async function refreshAccessToken(): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    return res.ok;
  } catch {
    return false;
  }
}

// ─── Core request function ──────────────────────────────────────────────────

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

    // Auto-refresh on 401 (once per request)
    if (res.status === 401 && isRelative) {
      if (!refreshInFlight) {
        refreshInFlight = refreshAccessToken();
      }
      const refreshed = await refreshInFlight;
      refreshInFlight = null;

      if (refreshed) {
        // Retry the original request once
        const retryRes = await fetch(isRelative ? `${BASE_URL}${path}` : path, {
          ...rest,
          method: method || "GET",
          credentials: isRelative ? "include" : "omit",
          headers: isRelative
            ? { "Content-Type": "application/json", ...(headers || {}) }
            : (headers || {}),
          body: body === undefined ? undefined : JSON.stringify(body),
          signal: combinedSignal,
        });
        if (!retryRes.ok) {
          let info: unknown = null;
          try { info = await retryRes.json(); } catch { info = { message: retryRes.statusText }; }
          const message = info && typeof info === "object" && "message" in info
            ? String((info as any).message) : "An error occurred.";
          throw new ResponseError(message, retryRes, info);
        }
        if (retryRes.status === 204) return undefined as T;
        const retryText = await retryRes.text();
        return (retryText ? JSON.parse(retryText) : undefined) as T;
      }
    }

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
