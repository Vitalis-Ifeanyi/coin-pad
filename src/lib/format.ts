const formatters = new Map<string, Intl.NumberFormat>();

function nf(options: Intl.NumberFormatOptions) {
  const key = JSON.stringify(options);
  let f = formatters.get(key);
  if (!f) {
    f = new Intl.NumberFormat("en-US", options);
    formatters.set(key, f);
  }
  return f;
}

const isNum = (n: number | null | undefined): n is number => typeof n === "number" && Number.isFinite(n);

export const DASH = "—";

/**
 * Prices span ~10 orders of magnitude (BTC vs. meme coins), so sub-$1 prices
 * keep 4 significant digits instead of rounding to $0.00.
 */
export function formatPrice(value: number | null | undefined, currency = "usd") {
  if (!isNum(value)) return DASH;
  const abs = Math.abs(value);
  const base: Intl.NumberFormatOptions = { style: "currency", currency: currency.toUpperCase() };
  if (abs === 0) return nf({ ...base, maximumFractionDigits: 2 }).format(0);
  if (abs < 1) return nf({ ...base, minimumSignificantDigits: 4, maximumSignificantDigits: 4 }).format(value);
  return nf({ ...base, minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
}

/** $2.41T, $980.3M */
export function formatCompactCurrency(value: number | null | undefined, currency = "usd") {
  if (!isNum(value)) return DASH;
  return nf({
    style: "currency",
    currency: currency.toUpperCase(),
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(value);
}

/** 19.7M */
export function formatCompact(value: number | null | undefined) {
  if (!isNum(value)) return DASH;
  return nf({ notation: "compact", maximumFractionDigits: 2 }).format(value);
}

export function formatNumber(value: number | null | undefined) {
  if (!isNum(value)) return DASH;
  return nf({ maximumFractionDigits: 0 }).format(value);
}

/** Absolute percentage; direction is shown separately with colour and a caret. */
export function formatPercent(value: number | null | undefined, digits = 2) {
  if (!isNum(value)) return DASH;
  return `${nf({ minimumFractionDigits: digits, maximumFractionDigits: digits }).format(Math.abs(value))}%`;
}

export function formatTime(ts: number) {
  return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

/** "prices from 12:04", or "prices from Sep 9, 12:04" once it's not today. */
export function formatAge(ts: number) {
  const d = new Date(ts);
  const sameDay = d.toDateString() === new Date().toDateString();
  const when = sameDay
    ? formatTime(ts)
    : d.toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  return `prices from ${when}`;
}
