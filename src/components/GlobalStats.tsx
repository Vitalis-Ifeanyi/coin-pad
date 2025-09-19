// components/GlobalStats.tsx
import React, { useContext } from "react";
import { DarkModeContext } from "../context/DarkModeContext";

interface GlobalStatsProps {
  marketStats: any;
}

import marketCapIcon from "/Coin-Market-Cap-Icon-PNG.jpg";
import hours from "/24-hours-icon.png";
import btcIcon from "/bitcoin.png";
import ethIcon from "/eth.png";
import active from "/active.jpg";
import markets from "/market.jpg";

const GlobalStats: React.FC<GlobalStatsProps> = ({ marketStats }) => {
  const { isDark } = useContext(DarkModeContext);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg rounded-2xl p-6 flex flex-col items-center transition-colors">
        <img
          src={marketCapIcon}
          alt="Market Cap"
          className="w-14 h-10 mb-2 rounded-full"
        />
        <p className="text-sm opacity-80">Total Market Cap</p>
        <h3 className="text-xl font-bold mt-2">
          ${marketStats.total_market_cap.usd.toLocaleString()}
        </h3>
      </div>

      <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg rounded-2xl p-6 flex flex-col items-center transition-colors">
        <img src={hours} alt="24h Volume" className="w-10 h-10 mb-2" />
        <p className="text-sm opacity-80">24h Volume</p>
        <h3 className="text-xl font-bold mt-2">
          ${marketStats.total_volume.usd.toLocaleString()}
        </h3>
      </div>

      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg rounded-2xl p-6 flex flex-col items-center transition-colors">
        <img
          src={btcIcon}
          alt="BTC Logo"
          className="w-10 h-10 mb-2 rounded-full"
        />
        <p className="text-sm opacity-80">BTC Dominance</p>
        <h3 className="text-xl font-bold mt-2">
          {marketStats.market_cap_percentage.btc.toFixed(2)}%
        </h3>
      </div>

      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg rounded-2xl p-6 flex flex-col items-center transition-colors">
        <img src={ethIcon} alt="ETH Logo" className="w-10 h-10 mb-2" />
        <p className="text-sm opacity-80">ETH Dominance</p>
        <h3 className="text-xl font-bold mt-2">
          {marketStats.market_cap_percentage.eth.toFixed(2)}%
        </h3>
      </div>

      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg rounded-2xl p-6 flex flex-col items-center transition-colors">
        <img
          src={active}
          alt="Active Cryptos"
          className="w-10 h-10 mb-2 rounded-full"
        />
        <p className="text-sm opacity-80">Active Cryptos</p>
        <h3 className="text-xl font-bold mt-2">
          {marketStats.active_cryptocurrencies.toLocaleString()}
        </h3>
      </div>

      <div className="bg-gradient-to-r from-pink-500 to-red-500 text-white shadow-lg rounded-2xl p-6 flex flex-col items-center transition-colors">
        <img
          src={markets}
          alt="Markets"
          className="w-10 h-10 mb-2 rounded-full"
        />
        <p className="text-sm opacity-80">Markets</p>
        <h3 className="text-xl font-bold mt-2">
          {marketStats.markets.toLocaleString()}
        </h3>
      </div>
    </div>
  );
};

export default GlobalStats;
