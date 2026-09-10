import { useMemo, useRef, useState, type ReactNode } from "react";
import { useSearchParams } from "react-router-dom";
import { Download } from "lucide-react";
import { ApiError } from "../api/coingecko";
import { useApi } from "../hooks/useApi";
import type { Coin, OhlcRow } from "../types/coin";
import { formatAge, formatPercent, formatPrice } from "../lib/format";
import { downloadText, downloadUrl, toCsv } from "../lib/download";
import CandleChart, { type CandleChartHandle } from "../components/CandleChart";
import CoinSearch from "../components/CoinSearch";
import Segmented from "../components/Segmented";
import Change from "../components/Change";
import { Bar, ErrorNotice, Spinner } from "../components/States";

const RANGES = [
  { value: "1", label: "24H" },
  { value: "7", label: "7D" },
  { value: "30", label: "1M" },
  { value: "90", label: "3M" },
  { value: "365", label: "1Y" },
] as const;

const CURRENCIES = [
  { value: "usd", label: "USD" },
  { value: "eur", label: "EUR" },
  { value: "ngn", label: "NGN" },
  { value: "btc", label: "BTC" },
] as const;

const SCALES = [
  { value: "linear", label: "Linear" },
  { value: "log", label: "Log" },
] as const;

type Range = (typeof RANGES)[number]["value"];

// CoinGecko picks the candle width from the range; it isn't configurable on the free API.
const CANDLE_WIDTH: Record<Range, string> = {
  "1": "30-minute",
  "7": "4-hour",
  "30": "4-hour",
  "90": "4-day",
  "365": "4-day",
};

const pick = <T extends string>(value: string | null, allowed: readonly { value: T }[], fallback: T): T =>
  allowed.some((o) => o.value === value) ? (value as T) : fallback;

export default function Analytics() {
  const [params, setParams] = useSearchParams();
  const coinId = params.get("coin")?.trim() || "bitcoin";
  const range = pick(params.get("range"), RANGES, "30");
  const currency = pick(params.get("vs"), CURRENCIES, "usd");
  const [scale, setScale] = useState<"linear" | "log">("linear");
  const chartRef = useRef<CandleChartHandle>(null);

  const setParam = (key: string, value: string) =>
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set(key, value);
        return next;
      },
      { replace: key !== "coin" },
    );

  const meta = useApi<Coin[]>("/coins/markets", { vs_currency: currency, ids: coinId }, { persist: true });
  const ohlc = useApi<OhlcRow[]>(
    `/coins/${encodeURIComponent(coinId)}/ohlc`,
    { vs_currency: currency, days: range },
    { maxAgeMs: 5 * 60_000, persist: true },
  );

  const coin = meta.data?.find((c) => c.id === coinId);
  const notFound = !meta.loading && meta.data && !coin;
  const rows = ohlc.data;

  const stats = useMemo(() => {
    if (!rows?.length) return null;
    const open = rows[0][1];
    const close = rows[rows.length - 1][4];
    let high = -Infinity;
    let low = Infinity;
    for (const [, , h, l] of rows) {
      if (h > high) high = h;
      if (l < low) low = l;
    }
    return { open, close, high, low, change: ((close - open) / open) * 100 };
  }, [rows]);

  const rangeLabel = RANGES.find((r) => r.value === range)!.label;
  const fileBase = `${coinId}-${currency}-${rangeLabel.toLowerCase()}`;

  const exportCsv = () => {
    if (!rows) return;
    const csv = toCsv(
      rows.map(([t, open, high, low, close]) => ({ time: new Date(t).toISOString(), open, high, low, close })),
    );
    downloadText(csv, `${fileBase}.csv`);
  };

  const exportPng = async () => {
    const png = await chartRef.current?.toPng();
    if (png) downloadUrl(png, `${fileBase}.png`);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 sm:pt-10">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          {coin ? (
            <>
              <div className="flex items-center gap-2.5">
                <img src={coin.image} alt="" width={28} height={28} className="size-7 rounded-full" />
                <h1 className="truncate text-2xl font-semibold tracking-tight">{coin.name}</h1>
                <span className="font-mono text-sm text-faint uppercase">{coin.symbol}</span>
              </div>
              <div className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <p className="num text-3xl font-medium tracking-tight">{formatPrice(coin.current_price, currency)}</p>
                <Change value={coin.price_change_percentage_24h} pill className="text-sm" />
                <span className="text-xs text-faint">24h</span>
              </div>
            </>
          ) : notFound ? (
            <h1 className="text-2xl font-semibold tracking-tight">No coin called “{coinId}”</h1>
          ) : meta.error ? (
            <h1 className="text-2xl font-semibold tracking-tight capitalize">{coinId.replace(/-/g, " ")}</h1>
          ) : (
            <div className="space-y-3 pt-1">
              <Bar className="h-7 w-48" />
              <Bar className="h-8 w-40" />
            </div>
          )}
        </div>

        <CoinSearch onSelect={(c) => setParam("coin", c.id)} />
      </header>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <Segmented label="Time range" value={range} options={RANGES} onChange={(v) => setParam("range", v)} />
        <Segmented label="Currency" value={currency} options={CURRENCIES} onChange={(v) => setParam("vs", v)} />
        <Segmented label="Price scale" value={scale} options={SCALES} onChange={setScale} />

        <div className="ml-auto flex gap-2">
          <ExportButton onClick={exportCsv} disabled={!rows?.length}>
            CSV
          </ExportButton>
          <ExportButton onClick={exportPng} disabled={!rows?.length}>
            PNG
          </ExportButton>
        </div>
      </div>

      <section className="mt-3 overflow-hidden rounded-lg border border-line bg-surface">
        {ohlc.error && !rows ? (
          <div className="p-4">
            <ErrorNotice
              message={
                ohlc.error instanceof ApiError && ohlc.error.status === 404
                  ? "CoinGecko has no chart data for this coin."
                  : ohlc.error.message
              }
              onRetry={ohlc.reload}
            />
          </div>
        ) : !rows ? (
          <Spinner className="h-[456px]" label="Loading candles" />
        ) : rows.length === 0 ? (
          <p className="grid h-[456px] place-items-center text-sm text-muted">No trades in this range.</p>
        ) : (
          <div className={`relative px-1 pt-2 transition-opacity ${ohlc.loading ? "opacity-40" : ""}`}>
            <CandleChart ref={chartRef} rows={rows} currency={currency} logScale={scale === "log"} />
          </div>
        )}
      </section>

      {stats && rows && (
        <>
          <dl className="mt-4 flex flex-wrap gap-px overflow-hidden rounded-lg border border-line bg-line">
            <Stat label={`${rangeLabel} open`}>{formatPrice(stats.open, currency)}</Stat>
            <Stat label={`${rangeLabel} high`}>{formatPrice(stats.high, currency)}</Stat>
            <Stat label={`${rangeLabel} low`}>{formatPrice(stats.low, currency)}</Stat>
            <Stat label="Last close">{formatPrice(stats.close, currency)}</Stat>
            <Stat label={`${rangeLabel} change`}>
              <Change value={stats.change} />
            </Stat>
          </dl>
          <p className="mt-3 text-xs text-faint">
            {ohlc.error && ohlc.updatedAt && (
              <button type="button" onClick={ohlc.reload} className="mr-1 text-down hover:underline">
                Couldn't refresh, showing {formatAge(ohlc.updatedAt)}.
              </button>
            )}
            {rows.length} {CANDLE_WIDTH[range]} candles. High-to-low spread{" "}
            {formatPercent(((stats.high - stats.low) / stats.low) * 100, 1)}. Drag across the chart to zoom.
          </p>
        </>
      )}
    </div>
  );
}

function Stat({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="min-w-[9rem] flex-1 bg-surface px-4 py-3">
      <dt className="text-[13px] text-muted">{label}</dt>
      <dd className="num mt-0.5 font-medium">{children}</dd>
    </div>
  );
}

function ExportButton({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className="inline-flex h-8 items-center gap-1.5 rounded-md border border-line bg-surface px-2.5 text-xs font-medium text-muted hover:border-line-strong hover:text-fg disabled:pointer-events-none disabled:opacity-50"
      {...props}
    >
      <Download size={13} />
      {children}
    </button>
  );
}
