import React, { useContext } from "react";
import type { Coin } from "../types/coin";
import MiniChart from "../chart/MiniChart";
import { DarkModeContext } from "../context/DarkModeContext";
import { TrendingDown, TrendingUp } from "lucide-react";

interface TopGainersLosersProps {
  coins: Coin[];
}

const TopGainersLosers: React.FC<TopGainersLosersProps> = ({ coins }) => {
  const { isDark } = useContext(DarkModeContext);

  const gainers = [...coins]
    .sort(
      (a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h
    )
    .slice(0, 5);

  const losers = [...coins]
    .sort(
      (a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h
    )
    .slice(0, 5);

  const renderCard = (coin: Coin) => (
    <div
      key={coin.id}
      className={`p-4 rounded-xl flex items-center justify-between gap-3 transition cursor-pointer
        ${
          isDark
            ? "bg-gray-800 hover:bg-gray-700 text-white"
            : "bg-gray-50 hover:bg-gray-100 text-black"
        }`}
    >
      <div className="flex items-center gap-3">
        <img
          src={coin.image}
          alt={coin.name}
          className="w-8 h-8 rounded-full"
        />
        <div>
          <p className="font-medium">{coin.name}</p>
          <p
            className={`text-sm ${isDark ? "text-gray-300" : "text-gray-500"}`}
          >
            ${coin.current_price.toLocaleString()}
          </p>
        </div>
      </div>

      {coin.sparkline_in_7d?.price && (
        <MiniChart
          prices={coin.sparkline_in_7d.price}
          isPositive={coin.price_change_percentage_24h > 0}
          width={100}
          height={40}
        />
      )}

      <span
        className={`text-sm font-semibold ${
          coin.price_change_percentage_24h > 0
            ? "text-green-500"
            : "text-red-500"
        }`}
      >
        {coin.price_change_percentage_24h.toFixed(2)}%
      </span>
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h2
          className={`text-lg font-semibold mb-3 flex items-center gap-2 ${
            isDark ? "text-gray-100" : "text-gray-700"
          }`}
        >
          <TrendingUp /> <span>Top Gainers (24h)</span>
        </h2>
        <div className="space-y-3">{gainers.map(renderCard)}</div>
      </div>

      <div>
        <h2
          className={`text-lg font-semibold mb-3 flex items-center gap-2 ${
            isDark ? "text-gray-100" : "text-gray-700"
          }`}
        >
          <TrendingDown /> <span>Top Losers (24h)</span>
        </h2>
        <div className="space-y-3">{losers.map(renderCard)}</div>
      </div>
    </div>
  );
};

export default TopGainersLosers;
