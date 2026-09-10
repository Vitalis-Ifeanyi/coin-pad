import { useEffect, useRef, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, X } from "lucide-react";
import type { Coin } from "../types/coin";
import { DASH, formatCompact, formatCompactCurrency, formatPercent, formatPrice, formatTime } from "../lib/format";
import Change from "./Change";
import Sparkline from "./Sparkline";

interface CoinDetailsProps {
  coin: Coin | null;
  onClose: () => void;
}

/** Native <dialog>: focus trapping, Escape and top-layer stacking come for free. */
export default function CoinDetails({ coin, onClose }: CoinDetailsProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (coin && !dialog.open) dialog.showModal();
    if (!coin && dialog.open) dialog.close();
  }, [coin]);

  useEffect(() => {
    if (!coin) return;
    const root = document.documentElement;
    const prev = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = prev;
    };
  }, [coin]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      // The inner wrapper covers the dialog box, so a click landing on the
      // <dialog> element itself can only be on the backdrop.
      onClick={(e) => e.target === e.currentTarget && onClose()}
      aria-labelledby="coin-details-title"
      className="m-auto max-h-[88vh] w-[min(40rem,calc(100%-2rem))] overflow-y-auto rounded-xl border border-line bg-surface p-0 text-fg shadow-2xl"
    >
      {coin && <Body coin={coin} onClose={onClose} />}
    </dialog>
  );
}

function Body({ coin, onClose }: { coin: Coin; onClose: () => void }) {
  const symbol = coin.symbol.toUpperCase();

  return (
    <div className="p-5 sm:p-6">
      <header className="flex items-start gap-3">
        <img src={coin.image} alt="" width={36} height={36} className="size-9 rounded-full" />
        <div className="min-w-0 flex-1">
          <h2 id="coin-details-title" className="text-lg leading-tight font-semibold">
            {coin.name}
          </h2>
          <p className="font-mono text-xs text-faint">
            {symbol} · Rank #{coin.market_cap_rank ?? DASH}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="-mt-1 -mr-1 grid size-8 place-items-center rounded-md text-muted hover:bg-sunken hover:text-fg"
        >
          <X size={18} />
        </button>
      </header>

      <div className="mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <p className="num text-3xl font-medium tracking-tight">{formatPrice(coin.current_price)}</p>
        <Change value={coin.price_change_percentage_24h} pill className="text-sm" />
        <span className="text-xs text-faint">24h</span>
      </div>

      <div className="mt-5 rounded-lg border border-line bg-canvas px-3 pt-3 pb-2">
        <Sparkline prices={coin.sparkline_in_7d?.price} width={560} height={110} fill className="block h-[110px] w-full" />
        <p className="mt-1 flex justify-between text-[11px] text-faint">
          <span>7 days ago</span>
          <Change value={coin.price_change_percentage_7d_in_currency} className="text-[11px]" />
          <span>Now</span>
        </p>
      </div>

      <RangeBar low={coin.low_24h} high={coin.high_24h} current={coin.current_price} />

      <dl className="mt-5 grid grid-cols-1 gap-x-8 sm:grid-cols-2">
        <Row label="Market cap">{formatCompactCurrency(coin.market_cap)}</Row>
        <Row label="Fully diluted value">{formatCompactCurrency(coin.fully_diluted_valuation)}</Row>
        <Row label="24h volume">{formatCompactCurrency(coin.total_volume)}</Row>
        <Row label="Circulating supply">
          {formatCompact(coin.circulating_supply)} {symbol}
        </Row>
        <Row label="All-time high">
          {formatPrice(coin.ath)}
          {coin.ath_change_percentage != null && (
            <span className="ml-1.5 text-xs text-faint">{formatPercent(coin.ath_change_percentage, 1)} below</span>
          )}
        </Row>
        <Row label="Max supply">{coin.max_supply ? `${formatCompact(coin.max_supply)} ${symbol}` : "No cap"}</Row>
        <Row label="All-time low">{formatPrice(coin.atl)}</Row>
        <Row label="Total supply">{coin.total_supply ? `${formatCompact(coin.total_supply)} ${symbol}` : DASH}</Row>
      </dl>

      <footer className="mt-6 flex items-center justify-between gap-3">
        <p className="text-xs text-faint">
          {coin.last_updated && `Price as of ${formatTime(new Date(coin.last_updated).getTime())}`}
        </p>
        <Link
          to={`/analytics?coin=${encodeURIComponent(coin.id)}`}
          onClick={onClose}
          className="inline-flex items-center gap-1.5 rounded-md bg-fg px-3 py-1.5 text-sm font-medium text-canvas hover:opacity-90"
        >
          Candlestick chart <ArrowRight size={14} />
        </Link>
      </footer>
    </div>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-line py-2 text-sm">
      <dt className="text-muted">{label}</dt>
      <dd className="num text-right">{children}</dd>
    </div>
  );
}

function RangeBar({ low, high, current }: { low: number | null; high: number | null; current: number | null }) {
  if (low == null || high == null || current == null || high <= low) return null;
  const pos = Math.min(100, Math.max(0, ((current - low) / (high - low)) * 100));

  return (
    <div className="mt-5">
      <p className="mb-2 text-xs text-muted">24h range</p>
      <div className="relative h-1 rounded-full bg-sunken">
        <span className="absolute inset-y-0 left-0 rounded-full bg-line-strong" style={{ width: `${pos}%` }} />
        <span
          className="absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-surface bg-fg"
          style={{ left: `${pos}%` }}
        />
      </div>
      <p className="num mt-1.5 flex justify-between text-xs text-muted">
        <span>{formatPrice(low)}</span>
        <span>{formatPrice(high)}</span>
      </p>
    </div>
  );
}
