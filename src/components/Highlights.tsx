import { Link } from "react-router-dom";
import type { Coin, TrendingCoin } from "../types/coin";
import { formatPrice } from "../lib/format";
import Change from "./Change";
import { Bar } from "./States";

interface Row {
  id: string;
  name: string;
  symbol: string;
  image: string;
  price: number | null | undefined;
  change: number | null | undefined;
}

function Panel({ title, caption, rows }: { title: string; caption: string; rows?: Row[] }) {
  return (
    <section className="overflow-hidden rounded-lg border border-line bg-surface">
      <header className="flex items-baseline justify-between gap-3 border-b border-line px-4 py-2.5">
        <h2 className="text-sm font-semibold">{title}</h2>
        <p className="text-xs text-faint">{caption}</p>
      </header>

      <ol>
        {rows?.length === 0 && <li className="px-4 py-6 text-center text-sm text-faint">Unavailable right now.</li>}
        {rows
          ? rows.map((row) => (
              <li key={row.id}>
                <Link
                  to={`/analytics?coin=${encodeURIComponent(row.id)}`}
                  className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-sunken"
                  title={`Open ${row.name} chart`}
                >
                  <img src={row.image} alt="" width={20} height={20} loading="lazy" className="size-5 rounded-full" />
                  <span className="min-w-0 flex-1 truncate">
                    {row.name} <span className="font-mono text-xs text-faint uppercase">{row.symbol}</span>
                  </span>
                  <span className="num text-muted">{formatPrice(row.price)}</span>
                  <Change value={row.change} className="w-16 justify-end text-[13px]" />
                </Link>
              </li>
            ))
          : Array.from({ length: 5 }, (_, i) => (
              <li key={i} className="flex items-center gap-3 px-4 py-2.5">
                <Bar className="size-5 rounded-full" />
                <Bar className="h-3.5 flex-1" />
                <Bar className="h-3.5 w-24" />
              </li>
            ))}
      </ol>
    </section>
  );
}

const fromCoin = (c: Coin): Row => ({
  id: c.id,
  name: c.name,
  symbol: c.symbol,
  image: c.image,
  price: c.current_price,
  change: c.price_change_percentage_24h,
});

export default function Highlights({ coins, trending }: { coins?: Coin[]; trending?: TrendingCoin[] }) {
  const withChange = coins?.filter((c) => c.price_change_percentage_24h != null);
  const byChange = withChange?.sort((a, b) => b.price_change_percentage_24h! - a.price_change_percentage_24h!);

  const gainers = byChange?.slice(0, 5).map(fromCoin);
  const losers = byChange?.slice(-5).reverse().map(fromCoin);
  const hot = trending?.slice(0, 5).map((t) => ({
    id: t.id,
    name: t.name,
    symbol: t.symbol,
    image: t.small,
    price: t.data?.price,
    change: t.data?.price_change_percentage_24h?.usd,
  }));

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Panel title="Trending" caption="Most searched, 24h" rows={hot} />
      <Panel title="Biggest gainers" caption="Top 100, 24h" rows={gainers} />
      <Panel title="Biggest losers" caption="Top 100, 24h" rows={losers} />
    </div>
  );
}
