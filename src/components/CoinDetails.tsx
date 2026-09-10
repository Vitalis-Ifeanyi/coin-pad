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

/**
 * Native <dialog>: focus trapping, Escape and top-layer stacking come for free.
 * Bottom sheet on phones, centred dialog from `sm` up.
 */
export default function CoinDetails({ coin, onClose }: CoinDetailsProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (coin && !dialog.open) {
      dialog.showModal();
      dialog.scrollTop = 0;
    }
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
      className="coin-sheet mx-auto mt-auto mb-0 max-h-[90dvh] w-full max-w-full overflow-y-auto overscroll-contain rounded-t-2xl border border-b-0 border-line bg-surface p-0 text-fg shadow-2xl sm:m-auto sm:max-h-[88dvh] sm:w-[min(40rem,calc(100%-2rem))] sm:rounded-xl sm:border-b"
    >
      {coin && <Body coin={coin} onClose={onClose} />}
    </dialog>
  );
}

function Body({ coin, onClose }: { coin: Coin; onClose: () => void }) {
  const symbol = coin.symbol.toUpperCase();

  return (
    <div>
      {/* Sticky so the close button stays reachable while the sheet scrolls. */}
      <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-line bg-surface px-4 py-3 sm:border-b-0 sm:px-6 sm:pt-6 sm:pb-0">
        <img src={coin.image} alt="" width={36} height={36} className="size-8 rounded-full sm:size-9" />
        <div className="min-w-0 flex-1">
          <h2 id="coin-details-title" className="truncate text-base leading-tight font-semibold sm:text-lg">
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
          className="-mr-1.5 grid size-9 shrink-0 place-items-center rounded-md text-muted hover:bg-sunken hover:text-fg"
        >
          <X size={18} />
        </button>
      </header>

      <div className="px-4 pt-4 pb-5 sm:px-6 sm:pt-5 sm:pb-6">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <p className="num text-[28px] leading-none font-medium tracking-tight sm:text-3xl">
            {formatPrice(coin.current_price)}
          </p>
          <Change value={coin.price_change_percentage_24h} pill className="text-sm" />
          <span className="text-xs text-faint">24h</span>
        </div>

        <div className="mt-4 rounded-lg border border-line bg-canvas px-3 pt-3 pb-2 sm:mt-5">
          <Sparkline
            prices={coin.sparkline_in_7d?.price}
            width={560}
            height={110}
            fill
            className="block h-[84px] w-full sm:h-[110px] [@media(max-height:32rem)]:h-16"
          />
          <p className="mt-1 flex justify-between text-[11px] text-faint">
            <span>7 days ago</span>
            <Change value={coin.price_change_percentage_7d_in_currency} className="text-[11px]" />
            <span>Now</span>
          </p>
        </div>

        <RangeBar low={coin.low_24h} high={coin.high_24h} current={coin.current_price} />

        <dl className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-line bg-line">
          <Stat label="Market cap">{formatCompactCurrency(coin.market_cap)}</Stat>
          <Stat label="24h volume">{formatCompactCurrency(coin.total_volume)}</Stat>
          <Stat label="Fully diluted value">{formatCompactCurrency(coin.fully_diluted_valuation)}</Stat>
          <Stat label="Circulating supply">
            {formatCompact(coin.circulating_supply)} <span className="text-faint">{symbol}</span>
          </Stat>
          <Stat
            label="All-time high"
            note={
              coin.ath_change_percentage != null
                ? `${formatPercent(coin.ath_change_percentage, 1)} below`
                : undefined
            }
          >
            {formatPrice(coin.ath)}
          </Stat>
          <Stat label="All-time low">{formatPrice(coin.atl)}</Stat>
          <Stat label="Total supply">
            {coin.total_supply ? (
              <>
                {formatCompact(coin.total_supply)} <span className="text-faint">{symbol}</span>
              </>
            ) : (
              DASH
            )}
          </Stat>
          <Stat label="Max supply">
            {coin.max_supply ? (
              <>
                {formatCompact(coin.max_supply)} <span className="text-faint">{symbol}</span>
              </>
            ) : (
              "No cap"
            )}
          </Stat>
        </dl>

        <footer className="mt-5 flex flex-col-reverse gap-3 sm:mt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-center text-xs text-faint sm:text-left">
            {coin.last_updated && `Price as of ${formatTime(new Date(coin.last_updated).getTime())}`}
          </p>
          <Link
            to={`/analytics?coin=${encodeURIComponent(coin.id)}`}
            onClick={onClose}
            className="inline-flex items-center justify-center gap-1.5 rounded-md bg-fg px-3 py-2.5 text-sm font-medium text-canvas hover:opacity-90 sm:py-1.5"
          >
            Candlestick chart <ArrowRight size={14} />
          </Link>
        </footer>
      </div>
    </div>
  );
}

function Stat({ label, note, children }: { label: string; note?: string; children: ReactNode }) {
  return (
    <div className="min-w-0 bg-surface px-3 py-2.5">
      <dt className="truncate text-xs text-muted">{label}</dt>
      <dd className="num mt-0.5 truncate text-sm font-medium">{children}</dd>
      {note && <dd className="truncate text-[11px] text-faint">{note}</dd>}
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
