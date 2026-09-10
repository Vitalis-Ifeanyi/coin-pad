import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { ArrowDown, ArrowUp, RotateCw, Search, X } from "lucide-react";
import type { Coin } from "../types/coin";
import { formatAge, formatCompactCurrency, formatPrice, formatTime } from "../lib/format";
import Change from "./Change";
import Sparkline from "./Sparkline";
import CoinDetails from "./CoinDetails";
import { Bar } from "./States";

type SortKey = "rank" | "price" | "change24h" | "change7d" | "marketCap" | "volume";
type SortDir = "asc" | "desc";

const sortValue: Record<SortKey, (c: Coin) => number | null | undefined> = {
  rank: (c) => c.market_cap_rank,
  price: (c) => c.current_price,
  change24h: (c) => c.price_change_percentage_24h,
  change7d: (c) => c.price_change_percentage_7d_in_currency,
  marketCap: (c) => c.market_cap,
  volume: (c) => c.total_volume,
};

interface CoinTableProps {
  coins?: Coin[];
  updatedAt?: number;
  /** The last refresh failed, so `coins` is an older copy. */
  stale?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
}

export default function CoinTable({ coins, updatedAt, stale, refreshing, onRefresh }: CoinTableProps) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<{ key: SortKey; dir: SortDir }>({ key: "rank", dir: "asc" });
  const [selected, setSelected] = useState<Coin | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // "/" focuses the filter, like most data tools.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (e.key !== "/" || target.closest("input, textarea, select, dialog")) return;
      e.preventDefault();
      searchRef.current?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const rows = useMemo(() => {
    if (!coins) return undefined;
    const q = query.trim().toLowerCase();
    const filtered = q
      ? coins.filter((c) => c.name.toLowerCase().includes(q) || c.symbol.toLowerCase().includes(q))
      : coins;

    const get = sortValue[sort.key];
    const sign = sort.dir === "asc" ? 1 : -1;
    return [...filtered].sort((a, b) => {
      const va = get(a);
      const vb = get(b);
      if (va == null) return 1; // missing values always sink
      if (vb == null) return -1;
      return (va - vb) * sign;
    });
  }, [coins, query, sort]);

  const toggleSort = (key: SortKey) =>
    setSort((s) =>
      s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: key === "rank" ? "asc" : "desc" },
    );

  const th = (key: SortKey, label: string, className = "") => {
    const active = sort.key === key;
    return (
      <th
        scope="col"
        className={`px-3 py-2.5 font-medium ${className}`}
        aria-sort={active ? (sort.dir === "asc" ? "ascending" : "descending") : undefined}
      >
        <button
          type="button"
          onClick={() => toggleSort(key)}
          className={`inline-flex items-center gap-1 hover:text-fg ${active ? "text-fg" : ""}`}
        >
          {label}
          {active && (sort.dir === "asc" ? <ArrowUp size={12} /> : <ArrowDown size={12} />)}
        </button>
      </th>
    );
  };

  return (
    <section className="overflow-hidden rounded-lg border border-line bg-surface">
      <div className="flex flex-wrap items-center gap-3 border-b border-line px-4 py-3">
        <h2 className="mr-auto text-sm font-semibold">Top 100 by market cap</h2>

        {updatedAt && coins && (
          <button
            type="button"
            onClick={onRefresh}
            disabled={refreshing}
            className={`inline-flex items-center gap-1.5 text-xs disabled:opacity-60 ${
              stale ? "text-down hover:underline" : "text-faint hover:text-fg"
            }`}
            title={stale ? "CoinGecko didn't respond to the last refresh. Click to try again." : "Refresh prices"}
          >
            <RotateCw size={12} className={refreshing ? "animate-spin" : ""} />
            {stale ? `Couldn't refresh · showing ${formatAge(updatedAt)}` : `Updated ${formatTime(updatedAt)}`}
          </button>
        )}

        <label className="relative flex w-full items-center sm:w-64">
          <span className="sr-only">Filter coins</span>
          <Search size={14} className="pointer-events-none absolute left-2.5 text-faint" />
          <input
            ref={searchRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Escape" && setQuery("")}
            placeholder="Filter by name or symbol"
            className="h-8 w-full rounded-md border border-line bg-canvas pr-8 pl-8 text-sm placeholder:text-faint focus:border-line-strong focus:outline-none [&::-webkit-search-cancel-button]:hidden"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear filter"
              className="absolute right-1.5 grid size-5 place-items-center rounded text-faint hover:text-fg"
            >
              <X size={13} />
            </button>
          ) : (
            <kbd className="pointer-events-none absolute right-2 hidden rounded border border-line px-1.5 font-mono text-[11px] text-faint sm:block">
              /
            </kbd>
          )}
        </label>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-line text-left text-xs text-muted">
            <tr>
              {th("rank", "#", "w-12 text-left")}
              <th scope="col" className="px-3 py-2.5 font-medium">
                Coin
              </th>
              {th("price", "Price", "text-right")}
              {th("change24h", "24h", "text-right")}
              {th("change7d", "7d", "hidden text-right sm:table-cell")}
              {th("marketCap", "Market cap", "hidden text-right md:table-cell")}
              {th("volume", "Volume 24h", "hidden text-right lg:table-cell")}
              <th scope="col" className="hidden px-3 py-2.5 text-right font-medium lg:table-cell">
                Last 7 days
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-line">
            {!rows && <SkeletonRows />}

            {rows?.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-muted">
                  No coins match “{query}”.
                </td>
              </tr>
            )}

            {rows?.map((coin) => (
              <tr key={coin.id} onClick={() => setSelected(coin)} className="cursor-pointer hover:bg-sunken/60">
                <Td className="text-faint">{coin.market_cap_rank ?? "—"}</Td>
                <td className="px-3 py-2.5">
                  <button
                    type="button"
                    className="flex min-w-0 items-center gap-2.5 text-left"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelected(coin);
                    }}
                  >
                    <img
                      src={coin.image}
                      alt=""
                      width={22}
                      height={22}
                      loading="lazy"
                      className="size-[22px] shrink-0 rounded-full"
                    />
                    <span className="max-w-[8.5rem] truncate font-medium sm:max-w-[15rem]">{coin.name}</span>
                    <span className="hidden font-mono text-xs text-faint uppercase sm:inline">{coin.symbol}</span>
                  </button>
                </td>
                <Td className="text-right">{formatPrice(coin.current_price)}</Td>
                <Td className="text-right">
                  <Change value={coin.price_change_percentage_24h} />
                </Td>
                <Td className="hidden text-right sm:table-cell">
                  <Change value={coin.price_change_percentage_7d_in_currency} />
                </Td>
                <Td className="hidden text-right md:table-cell">{formatCompactCurrency(coin.market_cap)}</Td>
                <Td className="hidden text-right text-muted lg:table-cell">{formatCompactCurrency(coin.total_volume)}</Td>
                <td className="hidden px-3 py-1.5 lg:table-cell">
                  <Sparkline prices={coin.sparkline_in_7d?.price} width={112} height={32} className="ml-auto block" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <CoinDetails coin={selected} onClose={() => setSelected(null)} />
    </section>
  );
}

function Td({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <td className={`num px-3 py-2.5 whitespace-nowrap ${className}`}>{children}</td>;
}

function SkeletonRows() {
  return Array.from({ length: 12 }, (_, i) => (
    <tr key={i}>
      <td className="px-3 py-3">
        <Bar className="h-3 w-5" />
      </td>
      <td className="px-3 py-3">
        <div className="flex items-center gap-2.5">
          <Bar className="size-[22px] rounded-full" />
          <Bar className="h-3.5 w-28" />
        </div>
      </td>
      <td className="px-3 py-3">
        <Bar className="ml-auto h-3.5 w-20" />
      </td>
      <td className="px-3 py-3">
        <Bar className="ml-auto h-3.5 w-14" />
      </td>
      <td className="hidden px-3 py-3 sm:table-cell">
        <Bar className="ml-auto h-3.5 w-14" />
      </td>
      <td className="hidden px-3 py-3 md:table-cell">
        <Bar className="ml-auto h-3.5 w-16" />
      </td>
      <td className="hidden px-3 py-3 lg:table-cell">
        <Bar className="ml-auto h-3.5 w-16" />
      </td>
      <td className="hidden px-3 py-3 lg:table-cell">
        <Bar className="ml-auto h-6 w-28" />
      </td>
    </tr>
  ));
}
