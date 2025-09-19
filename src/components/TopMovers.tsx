import React, { useContext } from "react";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import type { Coin } from "../types/coin";
import { DarkModeContext } from "../context/DarkModeContext";

interface TopMoversProps {
  coins: Coin[];
}

const TopMovers: React.FC<TopMoversProps> = ({ coins }) => {
  const { isDark } = useContext(DarkModeContext);

  const movers = [...coins]
    .sort(
      (a, b) =>
        Math.abs(b.price_change_percentage_24h) -
        Math.abs(a.price_change_percentage_24h)
    )
    .slice(0, 5);

  const cardBg = isDark ? "bg-gray-800 text-white" : "bg-white text-gray-800";
  const itemBg = isDark
    ? "bg-gray-700 hover:bg-gray-600"
    : "bg-gray-50 hover:bg-green-50";

  const textSecondary = isDark ? "text-gray-400" : "text-gray-500";

  return (
    <div
      className={`${cardBg} rounded-2xl shadow-md p-6 transition-colors duration-300`}
    >
      <h2
        className={`text-lg font-semibold mb-4 ${
          isDark ? "text-white" : "text-gray-700"
        }`}
      >
        📈 Top Movers (24h)
      </h2>

      <div className="space-y-4">
        {movers.map((coin) => (
          <div
            key={coin.id}
            className={`flex items-center justify-between p-3 rounded-xl ${itemBg} hover:shadow transition-all cursor-pointer`}
          >
            <div className="flex items-center gap-3">
              <img
                src={coin.image}
                alt={coin.name}
                className="w-8 h-8 rounded-full"
              />
              <div>
                <p className="text-sm font-medium">{coin.name}</p>
                <p className={`text-xs uppercase ${textSecondary}`}>
                  {coin.symbol}
                </p>
              </div>
            </div>
            \
            <div className="w-24 h-10">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={coin.sparkline_in_7d?.price.map((p, i) => ({
                    price: p,
                    index: i,
                  }))}
                >
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke={
                      coin.price_change_percentage_24h > 0
                        ? "#16a34a" // green
                        : "#dc2626" // red
                    }
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            {/* % Change */}
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
        ))}
      </div>
    </div>
  );
};

export default TopMovers;
