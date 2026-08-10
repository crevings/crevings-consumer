import { Middleware } from "swr";

/**
 * Pass-through middleware, kept for API stability.
 *
 * The earlier snapshot-based `staleTime` implementation served cached data and
 * suppressed revalidation on remount — which is exactly why navigation showed
 * stale/empty feeds until a hard refresh ("api from frontend should auto
 * fetch it"). Freshness is now handled by SWR's defaults configured in
 * App.tsx: every page remount revalidates in the background (cached data
 * renders instantly, then updates), and `dedupingInterval` coalesces bursts.
 * Hook-level `staleTime` configs are inert.
 */
export const staleTimeMiddleware: Middleware = (useSWRNext) => (key, fetcher, config) => {
  return useSWRNext(key, fetcher, config);
};
