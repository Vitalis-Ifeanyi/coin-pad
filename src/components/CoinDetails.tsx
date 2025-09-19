import React from "react";
import MiniChart from "../chart/MiniChart";
import type { Coin } from "../types/coin";

interface CoinDetailsModalProps {
  coin: Coin;
  isOpen: boolean;
  onClose: () => void;
}

const CoinDetailsModal: React.FC<CoinDetailsModalProps> = ({
  coin,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 w-11/12 max-w-3xl relative transition-transform transform scale-95 animate-scale-in"
        onClick={(e) => e.stopPropagation()} // prevent modal from closing when clicking inside
      >
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:hover:text-white text-lg font-bold"
          onClick={onClose}
        >
          ✖
        </button>

        <div className="flex items-center gap-4 mb-6">
          <img
            src={coin.image}
            alt={coin.name}
            className="w-16 h-16 rounded-full shadow-lg"
          />
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {coin.name} ({coin.symbol.toUpperCase()})
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              ${coin.current_price.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2 text-gray-800 dark:text-gray-200">
            <p>
              <strong>Market Cap:</strong> ${coin.market_cap.toLocaleString()}
            </p>
            <p>
              <strong>24h Change:</strong>{" "}
              <span
                className={
                  coin.price_change_percentage_24h > 0
                    ? "text-green-500"
                    : "text-red-500"
                }
              >
                {coin.price_change_percentage_24h.toFixed(2)}%
              </span>
            </p>
            <p>
              <strong>All-Time High:</strong> ${coin.ath.toLocaleString()}
            </p>
            <p>
              <strong>All-Time Low:</strong> ${coin.atl.toLocaleString()}
            </p>
            <p>
              <strong>Circulating / Total Supply:</strong>{" "}
              {coin.circulating_supply.toLocaleString()} /{" "}
              {coin.total_supply?.toLocaleString() || "N/A"}
            </p>
            <p>
              <strong>Market Cap Rank:</strong> #{coin.market_cap_rank}
            </p>
          </div>

          <div className="flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-xl p-4 shadow-inner">
            <MiniChart
              prices={coin.sparkline_in_7d?.price || []}
              isPositive={coin.price_change_percentage_24h > 0}
              width={256}
              height={128}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoinDetailsModal;
