import { Link } from "react-router-dom";
import { useApi } from "../hooks/useApi";
import type { Coin, GlobalMarket, TrendingCoin } from "../types/coin";
import { formatCompactCurrency, formatPercent } from "../lib/format";
import MarketStats from "../components/MarketStats";
import Highlights from "../components/Highlights";
import CoinTable from "../components/CoinTable";
import { Bar, ErrorNotice } from "../components/States";

const MARKETS_PARAMS = {
  vs_currency: "usd",
  order: "market_cap_desc",
  per_page: 100,
  page: 1,
  sparkline: true,
  price_change_percentage: "24h,7d",
};

const REFRESH_MS = 120_000;

export default function Dashboard() {
  const markets = useApi<Coin[]>("/coins/markets", MARKETS_PARAMS, {
    maxAgeMs: REFRESH_MS,
    refreshMs: REFRESH_MS,
    persist: true,
  });
  const global = useApi<{ data: GlobalMarket }>("/global", undefined, {
    maxAgeMs: REFRESH_MS,
    refreshMs: REFRESH_MS,
    persist: true,
  });
  const trending = useApi<{ coins: { item: TrendingCoin }[] }>("/search/trending", undefined, {
    maxAgeMs: 10 * 60_000,
    persist: true,
  });

  const g = global.data?.data;
  const trendingCoins = trending.data?.coins.map((c) => c.item) ?? (trending.error ? [] : undefined);

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 sm:px-6">
      <header className="pt-8 sm:pt-10">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-[28px]">Crypto prices by market cap</h1>
        <div className="mt-2 max-w-3xl text-muted">
          {g ? (
            <p>
              The crypto market is worth{" "}
              <span className="num text-fg">{formatCompactCurrency(g.total_market_cap.usd)}</span> today,{" "}
              <span className={g.market_cap_change_percentage_24h_usd >= 0 ? "text-up" : "text-down"}>
                {g.market_cap_change_percentage_24h_usd >= 0 ? "up" : "down"}{" "}
                <span className="num">{formatPercent(g.market_cap_change_percentage_24h_usd)}</span>
              </span>{" "}
              on yesterday, with <span className="num text-fg">{formatCompactCurrency(g.total_volume.usd)}</span>{" "}
              traded in the last 24 hours. New to the jargon?{" "}
              <Link to="/terms" className="text-fg underline decoration-line-strong underline-offset-2 hover:decoration-fg">
                Read the glossary
              </Link>
              .
            </p>
          ) : global.error ? (
            <p>Live prices for the 100 largest cryptocurrencies, refreshed every couple of minutes.</p>
          ) : (
            <div className="space-y-2 pt-1">
              <Bar className="h-4 w-full max-w-xl" />
              <Bar className="h-4 w-2/3 max-w-md" />
            </div>
          )}
        </div>
      </header>

      {(g || !global.error) && <MarketStats data={g} />}

      {/* Nothing saved to fall back on: explain, and keep the skeletons so the page doesn't look broken. */}
      {markets.error && !markets.data && (
        <ErrorNotice
          message={`${markets.error.message} Retrying automatically…`}
          onRetry={markets.reload}
        />
      )}

      <Highlights coins={markets.data} trending={trendingCoins} />
      <CoinTable
        coins={markets.data}
        updatedAt={markets.updatedAt}
        stale={Boolean(markets.error && markets.data)}
        refreshing={markets.refreshing}
        onRefresh={markets.reload}
      />
    </div>
  );
}
