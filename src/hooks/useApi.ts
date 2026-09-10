import { useCallback, useEffect, useRef, useState } from "react";
import { buildUrl, fetchJson, peekCache, type Params } from "../api/coingecko";

interface Options {
  /** How long a cached response counts as fresh. */
  maxAgeMs?: number;
  /** Re-fetch on this interval while the tab is visible. */
  refreshMs?: number;
  /** Keep the last good response across page reloads. */
  persist?: boolean;
}

interface State<T> {
  url: string | null;
  data?: T;
  error?: Error;
  updatedAt?: number;
  refreshing?: boolean;
}

const RETRY_DELAYS_MS = [10_000, 20_000, 40_000, 60_000];

function seed<T>(url: string | null, persist: boolean): State<T> {
  const hit = url && persist ? peekCache<T>(url) : undefined;
  return hit ? { url, data: hit.data, updatedAt: hit.at } : { url: null };
}

/**
 * Fetches a CoinGecko endpoint. Pass `null` as the path to skip.
 *
 * - While a new URL loads, the previous `data` is kept so the UI can dim it
 *   instead of flashing empty.
 * - With `persist`, the last good response renders immediately on reload.
 * - Failures retry on their own with backoff; `data` survives a failed refresh,
 *   so check `error` alongside it to tell the user the numbers are stale.
 */
export function useApi<T>(path: string | null, params?: Params, options: Options = {}) {
  const { maxAgeMs = 60_000, refreshMs, persist = false } = options;
  const url = path ? buildUrl(path, params) : null;
  const [state, setState] = useState<State<T>>(() => seed<T>(url, persist));
  const [reloadToken, setReloadToken] = useState(0);
  const forceRef = useRef(false);

  useEffect(() => {
    if (!url) return;
    let active = true;
    let retryTimer: number | undefined;
    let attempt = 0;

    // Switching to a URL we've seen before: show its saved data while refreshing.
    const hit = persist ? peekCache<T>(url) : undefined;
    if (hit) {
      setState((prev) => (prev.url === url && prev.data ? prev : { url, data: hit.data, updatedAt: hit.at }));
    }

    const load = (maxAge: number) =>
      fetchJson<T>(url, { maxAgeMs: maxAge, persist }).then(
        (data) => {
          if (!active) return;
          attempt = 0;
          // The response may have come from cache, so report when it was actually fetched.
          setState({ url, data, updatedAt: peekCache(url)?.at ?? Date.now() });
        },
        (error: Error) => {
          if (!active) return;
          setState((prev) => ({
            url,
            data: prev.url === url ? prev.data : undefined,
            updatedAt: prev.url === url ? prev.updatedAt : undefined,
            error,
          }));
          const delay = RETRY_DELAYS_MS[Math.min(attempt++, RETRY_DELAYS_MS.length - 1)];
          window.clearTimeout(retryTimer);
          retryTimer = window.setTimeout(() => load(0), delay);
        },
      );

    load(forceRef.current ? 0 : maxAgeMs);
    forceRef.current = false;

    let refreshTimer: number | undefined;
    if (refreshMs) {
      refreshTimer = window.setInterval(() => {
        if (document.visibilityState === "visible") load(refreshMs - 1000);
      }, refreshMs);
    }

    return () => {
      active = false;
      window.clearInterval(refreshTimer);
      window.clearTimeout(retryTimer);
    };
  }, [url, maxAgeMs, refreshMs, persist, reloadToken]);

  const reload = useCallback(() => {
    forceRef.current = true;
    setState((prev) => ({ ...prev, error: undefined, refreshing: true }));
    setReloadToken((n) => n + 1);
  }, []);

  const settled = state.url === url;
  return {
    data: state.data,
    error: settled ? state.error : undefined,
    /** True until the first response (or saved copy) for the current URL is available. */
    loading: url !== null && (!settled || (!state.data && !state.error)),
    /** True during a manual reload() while older data is still on screen. */
    refreshing: Boolean(state.refreshing),
    /** When `data` was fetched from CoinGecko (it may come from a saved copy). */
    updatedAt: state.updatedAt,
    reload,
  };
}
