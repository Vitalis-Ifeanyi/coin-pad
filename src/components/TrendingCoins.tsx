import React, { useContext } from "react";
import trendingIcon from "/trending.jpg";
import { DarkModeContext } from "../context/DarkModeContext";

interface TrendingCoinsProps {
  trending: any[];
}

const TrendingCoins: React.FC<TrendingCoinsProps> = ({ trending }) => {
  const { isDark } = useContext(DarkModeContext);

  const cardBg = isDark ? "bg-gray-800 text-white" : "bg-white text-gray-800";
  const itemBg = isDark
    ? "bg-gray-700 hover:bg-gray-600"
    : "bg-gray-50 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 hover:text-white";

  const textSecondary = isDark ? "text-gray-400" : "text-gray-500";

  return (
    <div
      className={`${cardBg} rounded-2xl shadow-md p-6 transition-colors duration-300`}
    >
      <div className="flex items-center gap-2 mb-2">
        <img
          src={trendingIcon}
          alt="Trending Icon"
          className="w-10 h-10 rounded-full"
        />
        <h2
          className={`text-lg font-semibold ${
            isDark ? "text-white" : "text-gray-700"
          }`}
        >
          Trending Coins
        </h2>
      </div>

      <div className="space-y-4">
        {trending.map((item, index) => {
          const coin = item.item;
          return (
            <div
              key={coin.id}
              className={`flex items-center justify-between p-3 rounded-xl ${itemBg} transition-all duration-300 cursor-pointer`}
            >
              <span
                className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full ${
                  isDark
                    ? "bg-gray-600 text-white"
                    : "bg-blue-100 text-blue-600"
                } font-bold text-sm transition`}
              >
                #{index + 1}
              </span>

              <div className="flex items-center gap-3 flex-1 ml-3">
                <img
                  src={coin.small}
                  alt={coin.name}
                  className={`w-8 h-8 rounded-full border ${
                    isDark ? "border-gray-600" : "border-gray-200"
                  } transition`}
                />
                <div>
                  <p className="text-sm font-medium">{coin.name}</p>
                  <p className={`text-xs uppercase ${textSecondary}`}>
                    {coin.symbol}
                  </p>
                </div>
              </div>

              {coin.data?.price_usd && (
                <span className="text-sm font-semibold">
                  ${parseFloat(coin.data.price_usd).toFixed(2)}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TrendingCoins;
