import React, { useContext, useState } from "react";
import type { Coin } from "../types/coin";
import { DarkModeContext } from "../context/DarkModeContext";
import CoinDetailsModal from "./CoinDetails";

interface CoinTableProps {
  coins: Coin[];
}

const CoinTable: React.FC<CoinTableProps> = ({ coins }) => {
  const { isDark } = useContext(DarkModeContext);
  const [selectedCoin, setSelectedCoin] = useState<Coin | null>(null);
  return (
    <div
      className={`shadow rounded-xl overflow-x-auto transition-colors duration-300 ${
        isDark ? "bg-gray-800 text-white" : "bg-white text-black"
      }`}
    >
      <table className="w-full text-left border-collapse">
        <thead className={isDark ? "bg-gray-700" : "bg-gray-100"}>
          <tr>
            <th className="py-3 px-4">Coin</th>
            <th className="py-3 px-4">Price</th>
            <th className="py-3 px-4">Market Cap</th>
            <th className="py-3 px-4">24h %</th>
            <th className="py-3 px-4">Volume (24h)</th>
          </tr>
        </thead>
        <tbody>
          {coins.length === 0 ? (
            <tr>
              <td
                colSpan={5}
                className="py-10 text-center text-black dark:text-gray-300"
              >
                ⚠️ No coins found. Try a different search term.
              </td>
            </tr>
          ) : (
            coins.map((coin) => (
              <tr
                key={coin.id}
                className={`border-t transition-colors cursor-pointer ${
                  isDark ? "hover:bg-gray-700" : "hover:bg-gray-50"
                }`}
                onClick={() => setSelectedCoin(coin)}
              >
                <td className="py-3 px-4 flex items-center gap-2">
                  <img
                    src={coin.image}
                    alt={coin.name}
                    className="w-6 h-6 rounded-full"
                  />
                  <span
                    className={`font-medium ${
                      isDark ? "text-white" : "text-gray-800"
                    }`}
                  >
                    {coin.name} ({coin.symbol.toUpperCase()})
                  </span>
                </td>
                <td className="py-3 px-4">
                  ${coin.current_price.toLocaleString()}
                </td>
                <td className="py-3 px-4">
                  ${coin.market_cap.toLocaleString()}
                </td>
                <td
                  className={`py-3 px-4 font-medium ${
                    coin.price_change_percentage_24h > 0
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {coin.price_change_percentage_24h.toFixed(2)}%
                </td>
                <td className="py-3 px-4">
                  ${coin.total_volume.toLocaleString()}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Modal */}
      {selectedCoin && (
        <CoinDetailsModal
          coin={selectedCoin}
          isOpen={!!selectedCoin}
          onClose={() => setSelectedCoin(null)}
        />
      )}
    </div>
  );
};

export default CoinTable;
