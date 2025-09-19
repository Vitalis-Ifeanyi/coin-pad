import React, { useEffect, useState, useContext } from "react";
import api from "../api/coingecko";
import type { Coin } from "../types/coin";
import CoinTable from "../components/CoinTable";
import TopMovers from "../components/TopMovers";
import InfoCards from "../components/InfoCard";
import Hero from "../components/Hero";
import Loader from "../components/Loader";
import TrendingCoins from "../components/TrendingCoins";
import { XCircle } from "lucide-react";
import { DarkModeContext } from "../context/DarkModeContext";
import GlobalStats from "../components/GlobalStats";
import TopGainersLosers from "../components/TopGainLoss";
import RecentlyAddedCoins from "../components/RecentlyAddedCoin";
import Action from "../components/Action";

const Dashboard: React.FC = () => {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [filteredCoins, setFilteredCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [marketStats, setMarketStats] = useState<any>(null);
  const [trending, setTrending] = useState<any[]>([]);
  const [recentlyAdded, setRecentlyAdded] = useState<Coin[]>([]);
  const { isDark } = useContext(DarkModeContext);

  const handleClear = () => setSearchTerm("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get<Coin[]>("/coins/markets", {
          params: {
            vs_currency: "usd",
            order: "market_cap_desc",
            per_page: 100,
            page: 1,
            sparkline: true,
            price_change_percentage: "24h,7d",
          },
        });

        const statsRes = await api.get("/global");
        const trendingRes = await api.get("/search/trending");

        // 🔹 Recently Added Coins (sort by market_cap_rank descending)
        const recentlyAddedCoins = [...res.data]
          .sort((a, b) => b.market_cap_rank - a.market_cap_rank)
          .slice(0, 5);

        setCoins(res.data);
        setFilteredCoins(res.data);
        setMarketStats(statsRes.data.data);
        setTrending(trendingRes.data.coins);
        setRecentlyAdded(recentlyAddedCoins);
      } catch (err) {
        setError(
          `⚠️ Failed to fetch market data. Try again later. error: ${err}`
        );
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 🔍 Filter coins by search
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredCoins(coins);
    } else {
      setFilteredCoins(
        coins.filter((coin) =>
          coin.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, coins]);

  return (
    <div
      className={`transition-colors duration-300 ${
        isDark ? "bg-gray-900 text-white" : "bg-white text-black"
      } min-h-screen`}
    >
      <Hero />

      <div className="max-w-7xl mx-auto p-4 space-y-10">
        {/* Global Market Stats */}
        {marketStats && <GlobalStats marketStats={marketStats} />}

        {/* Search / Filter */}
        <div
          className={`relative shadow-md rounded-xl flex items-center px-4 py-3 transition-colors ${
            isDark ? "bg-gray-800" : "bg-white"
          }`}
        >
          <img
            src="/search.svg"
            alt="Search"
            className="w-5 h-5 mr-3 opacity-70"
          />
          <input
            type="text"
            placeholder="Search for a coin..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors ${
              isDark
                ? "bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                : "bg-white border-gray-200 text-black placeholder-gray-500"
            }`}
          />
          {searchTerm && (
            <XCircle
              onClick={handleClear}
              className={`absolute right-6 cursor-pointer transition-colors ${
                isDark
                  ? "text-gray-400 hover:text-gray-200"
                  : "text-gray-400 hover:text-gray-600"
              }`}
              size={22}
            />
          )}
        </div>

        {/* Main & Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <main className="lg:col-span-2 space-y-8">
            {loading ? (
              <Loader message="Loading market data..." />
            ) : error ? (
              <div className="text-center py-10 text-red-600">{error}</div>
            ) : (
              <>
                <CoinTable coins={filteredCoins} />

                {/* Recently Added Coins */}
                {recentlyAdded.length > 0 && (
                  <RecentlyAddedCoins coins={recentlyAdded} />
                )}
              </>
            )}
          </main>

          <aside className="space-y-8">
            <InfoCards />
            <TopMovers coins={coins} />
            <TrendingCoins trending={trending} />
            <TopGainersLosers coins={coins} />
          </aside>
        </div>
        <Action />
      </div>
    </div>
  );
};

export default Dashboard;
