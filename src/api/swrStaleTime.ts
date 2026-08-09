import { Middleware } from "swr";

// Per-key snapshot of the last successful fetch (data + timestamp) backing the
// `staleTime` middleware. SWR (2.x) has no built-in staleTime, so we serve the
// snapshot from memory when a remount/revalidate lands inside the freshness
// window and only hit the network after it expires.
//
// No-leak guarantee: entries are pruned once older than PRUNE_MS, so only keys
// actively used in the last few minutes stay in memory (mirrors React Query's
// gcTime — the map cannot grow with request volume).
const PRUNE_MS = 10 * 60_000;
const fetchedAt = new Map<string, { at: number; data: unknown }>();

function prune(): void {
  const cutoff = Date.now() - PRUNE_MS;
  for (const [key, entry] of fetchedAt) {
    if (entry.at < cutoff) fetchedAt.delete(key);
  }
}

/**
 * React-Query-style `staleTime` for SWR. Register once via
 * `SWRConfig value={{ use: [staleTimeMiddleware] }}`; any hook may pass
 * `staleTime: <ms>` in its config to opt in.
 */
export const staleTimeMiddleware: Middleware = (useSWRNext) => (key, fetcher, config) => {
  const staleMs = (config as any).staleTime as number | undefined;
  if (!staleMs || !fetcher) {
    return useSWRNext(key, fetcher, config);
  }

  const wrappedFetcher = (async (...args: any[]) => {
    const snapshotKey = JSON.stringify(key);
    const hit = fetchedAt.get(snapshotKey);
    if (hit && Date.now() - hit.at < staleMs) {
      // Inside the freshness window — serve the snapshot, no network call.
      return hit.data;
    }

    const data = await fetcher(...args);
    if (data !== undefined) {
      prune();
      fetchedAt.set(snapshotKey, { at: Date.now(), data });
    }
    return data;
  }) as typeof fetcher;

  return useSWRNext(key, wrappedFetcher, {
    ...config,
    fetcher: wrappedFetcher,
  });
};
