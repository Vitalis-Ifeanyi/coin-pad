const BASE_URL = "https://api.coingecko.com/api/v3";
// The 100-coin markets call with sparklines can take well over 10s on the free tier.
const TIMEOUT_MS = 25_000;
const STORAGE_PREFIX = "cg:";

export type Params = Record<string, string | number | boolean | undefined>;

export class ApiError extends Error {
  readonly status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

// Optional free "Demo" key from coingecko.com/en/api/pricing: a steady 30 calls/min
// instead of the shared keyless limit. It's sent as a query param because the
// API's CORS rules don't allow its custom header. It ends up in the client
// bundle, which is fine for a free demo key but not for a paid one.
const DEMO_KEY = import.meta.env.VITE_COINGECKO_DEMO_KEY;

export function buildUrl(path: string, params?: Params) {
  const url = new URL(BASE_URL + path);
  if (DEMO_KEY) url.searchParams.set("x_cg_demo_api_key", DEMO_KEY);
  for (const [key, value] of Object.entries(params ?? {})) {
    if (value !== undefined) url.searchParams.set(key, String(value));
  }
  return url.toString();
}

interface Entry {
  at: number;
  data: unknown;
}

// The public CoinGecko API allows roughly 30 calls a minute, so identical
// requests share one in-flight promise and responses are reused until stale.
// Responses can also be persisted, so a reload shows the last good data
// straight away and a failed refresh never leaves the page empty.
const memory = new Map<string, Entry>();
const inflight = new Map<string, Promise<unknown>>();

function readStored(url: string): Entry | undefined {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + url);
    return raw ? (JSON.parse(raw) as Entry) : undefined;
  } catch {
    return undefined;
  }
}

function writeStored(url: string, entry: Entry) {
  const value = JSON.stringify(entry);
  try {
    localStorage.setItem(STORAGE_PREFIX + url, value);
  } catch {
    // Quota exceeded: drop everything we've stored and try once more.
    try {
      for (const key of Object.keys(localStorage)) {
        if (key.startsWith(STORAGE_PREFIX)) localStorage.removeItem(key);
      }
      localStorage.setItem(STORAGE_PREFIX + url, value);
    } catch {
      // Storage unavailable; the in-memory cache still works.
    }
  }
}

/** Last known response for a URL, however old. */
export function peekCache<T>(url: string): { at: number; data: T } | undefined {
  let entry = memory.get(url);
  if (!entry) {
    entry = readStored(url);
    if (entry) memory.set(url, entry);
  }
  return entry as { at: number; data: T } | undefined;
}

export interface FetchOptions {
  /** How long a cached response counts as fresh. */
  maxAgeMs?: number;
  /** Keep the response in localStorage across reloads. */
  persist?: boolean;
}

export function fetchJson<T>(url: string, { maxAgeMs = 60_000, persist = false }: FetchOptions = {}): Promise<T> {
  const hit = persist ? peekCache<T>(url) : (memory.get(url) as { at: number; data: T } | undefined);
  if (hit && Date.now() - hit.at < maxAgeMs) return Promise.resolve(hit.data);

  let pending = inflight.get(url);
  if (!pending) {
    pending = request(url)
      .then((data) => {
        const entry = { at: Date.now(), data };
        memory.set(url, entry);
        if (persist) writeStored(url, entry);
        return data;
      })
      .finally(() => inflight.delete(url));
    inflight.set(url, pending);
  }
  return pending as Promise<T>;
}

async function request(url: string): Promise<unknown> {
  let res: Response;
  try {
    res = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS) });
  } catch (err) {
    if (err instanceof DOMException && err.name === "TimeoutError") {
      throw new ApiError("CoinGecko is taking too long to respond.");
    }
    if (!navigator.onLine) throw new ApiError("You appear to be offline.");
    // CoinGecko's 429 responses can arrive without CORS headers, in which case
    // the browser reports rate limiting as a generic network failure.
    throw new ApiError("CoinGecko didn't respond. Its free API is probably rate-limiting requests.");
  }

  if (res.status === 429) {
    throw new ApiError("CoinGecko's free API is rate-limiting requests.", 429);
  }
  if (!res.ok) {
    throw new ApiError(`CoinGecko returned an error (${res.status}).`, res.status);
  }
  return res.json();
}
