import React, { useContext } from "react";
import type { Coin } from "../types/coin";
import MiniChart from "../chart/MiniChart";
import { DarkModeContext } from "../context/DarkModeContext";

interface RecentlyAddedCoinsProps {
  coins: Coin[];
}

const RecentlyAddedCoins: React.FC<RecentlyAddedCoinsProps> = ({ coins }) => {
  const context = useContext(DarkModeContext);

  if (!context) {
    throw new Error("Terms must be used within a DarkModeProvider");
  }

  const { isDark } = context;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
      <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">
        🆕 Recently Added Coins
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {coins.map((coin) => (
          <div
            key={coin.id}
            className={`p-2 rounded-xl flex flex-col  justify-between gap-3 transition cursor-pointer
              ${
                isDark
                  ? "bg-gray-700 hover:bg-gray-600 hover:shadow-lg"
                  : "bg-gray-50 hover:shadow-md"
              }`}
          >
            <div className="flex items-center gap-3 flex-1">
              <div className="flex items-center gap-2 flex-1">
                <img
                  src={coin.image}
                  alt={coin.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p
                    className={`font-medium ${
                      isDark ? "text-gray-100" : "text-gray-900"
                    }`}
                  >
                    {coin.name}
                  </p>
                  <p
                    className={`text-sm ${
                      isDark ? "text-gray-300" : "text-gray-500"
                    }`}
                  >
                    ${coin.current_price.toLocaleString()}
                  </p>
                </div>
              </div>

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

            <MiniChart
              prices={coin.sparkline_in_7d?.price || []}
              isPositive={coin.price_change_percentage_24h > 0}
              width={100}
              height={40}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentlyAddedCoins;
