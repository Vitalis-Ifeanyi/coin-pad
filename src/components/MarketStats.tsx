import type { ReactNode } from "react";
import type { GlobalMarket } from "../types/coin";
import { formatCompactCurrency, formatNumber, formatPercent } from "../lib/format";
import Change from "./Change";
import { Bar } from "./States";

function Stat({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="min-w-[9.5rem] flex-1 bg-surface px-4 py-3">
      <dt className="text-[13px] text-muted">{label}</dt>
      <dd className="mt-1 text-[17px] font-medium">{children}</dd>
    </div>
  );
}

export default function MarketStats({ data }: { data?: GlobalMarket }) {
  if (!data) {
    return (
      <div className="flex flex-wrap gap-px overflow-hidden rounded-lg border border-line bg-line">
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} className="min-w-[9.5rem] flex-1 space-y-2 bg-surface px-4 py-3.5">
            <Bar className="h-3 w-20" />
            <Bar className="h-4 w-28" />
          </div>
        ))}
      </div>
    );
  }

  const btc = data.market_cap_percentage.btc ?? 0;
  const eth = data.market_cap_percentage.eth ?? 0;

  return (
    <dl className="flex flex-wrap gap-px overflow-hidden rounded-lg border border-line bg-line">
      <Stat label="Market cap">
        <span className="num">{formatCompactCurrency(data.total_market_cap.usd)}</span>{" "}
        <Change value={data.market_cap_change_percentage_24h_usd} className="ml-1 text-[13px]" />
      </Stat>
      <Stat label="24h volume">
        <span className="num">{formatCompactCurrency(data.total_volume.usd)}</span>
      </Stat>
      <Stat label="Dominance">
        <span className="num">
          BTC {formatPercent(btc, 1)} <span className="text-faint">·</span> ETH {formatPercent(eth, 1)}
        </span>
        <span className="mt-2 flex h-1 overflow-hidden rounded-full bg-sunken" aria-hidden="true">
          <span className="bg-fg" style={{ width: `${btc}%` }} />
          <span className="bg-faint" style={{ width: `${eth}%` }} />
        </span>
      </Stat>
      <Stat label="Tracked coins">
        <span className="num">{formatNumber(data.active_cryptocurrencies)}</span>
      </Stat>
      <Stat label="Exchange markets">
        <span className="num">{formatNumber(data.markets)}</span>
      </Stat>
    </dl>
  );
}
