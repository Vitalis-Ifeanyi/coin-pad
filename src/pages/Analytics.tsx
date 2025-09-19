import React, { useEffect, useState, useCallback, useContext } from "react";
import Chart from "react-apexcharts";
import ApexCharts from "apexcharts";
import debounce from "lodash.debounce";
import Papa from "papaparse";
import { saveAs } from "file-saver";
import api from "../api/coingecko";
import { DarkModeContext } from "../context/DarkModeContext";
import Loader from "../components/Loader";
import AnalyticsHero from "../components/AnalyticsHero";

type CoinData = {
  name: string;
  data: { x: number; y: [number, number, number, number] }[];
};

const AnalyticsPage: React.FC = () => {
  const { isDark } = useContext(DarkModeContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedCoins, setSelectedCoins] = useState<string[]>(["bitcoin"]);
  const [series, setSeries] = useState<CoinData[]>([]);
  const [yAxisType, setYAxisType] = useState<"linear" | "logarithmic">(
    "linear"
  );
  const [currency, setCurrency] = useState("usd");
  const [timeframe, setTimeframe] = useState("30");
  const [loading, setLoading] = useState(false);

  //Debouncing search
  const debouncedSearch = useCallback(
    debounce(async (term: string) => {
      if (!term) {
        setSearchResults([]);
        setShowDropdown(false);
        return;
      }
      try {
        const { data } = await api.get(`/search?query=${term}`);
        if (data.coins.length > 0) {
          setSearchResults(data.coins);
          setShowDropdown(true);
        } else {
          setSearchResults([]);
          setShowDropdown(false);
        }
      } catch (error) {
        console.error("Search failed", error);
        setSearchResults([]);
        setShowDropdown(false);
      }
    }, 500),
    []
  );

  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm, debouncedSearch]);

  //Fetch chart data
  useEffect(() => {
    const fetchData = async () => {
      if (selectedCoins.length === 0) return;
      setLoading(true);
      try {
        const results = await Promise.all(
          selectedCoins.map(async (coin) => {
            const { data } = await api.get(
              `/coins/${coin}/ohlc?vs_currency=${currency}&days=${timeframe}`
            );
            return {
              name: coin,
              data: data.map((d: [number, number, number, number, number]) => ({
                x: d[0],
                y: [d[1], d[2], d[3], d[4]],
              })),
            };
          })
        );
        setSeries(results);
      } catch (err) {
        console.error("Error fetching OHLC:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedCoins, currency, timeframe]);

  //Export handlers
  const handleExportCSV = () => {
    const flatData = series.flatMap((coin) =>
      coin.data.map((d) => ({
        coin: coin.name,
        time: new Date(d.x).toISOString(),
        open: d.y[0],
        high: d.y[1],
        low: d.y[2],
        close: d.y[3],
      }))
    );
    const csv = Papa.unparse(flatData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "chart-data.csv");
  };

  const handleExportPNG = () => {
    ApexCharts.exec("candlestick", "dataURI").then((uri: any) => {
      if (uri?.imgURI) {
        saveAs(uri.imgURI, `${series[0]?.name || "chart"}.png`);
      }
    });
  };

  return (
    <>
      <AnalyticsHero />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <div className="p-6 min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 max-w-6xl mx-auto">
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search coin..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-800"
              />

              {showDropdown && searchResults.length > 0 && (
                <ul className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {searchResults.map((coin) => (
                    <li
                      key={coin.id}
                      className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => {
                        setSelectedCoins([coin.id]);
                        setSearchTerm(coin.name);
                        setSearchResults([]);
                        setShowDropdown(false);
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <img
                          src={coin.thumb}
                          alt={coin.name}
                          className="w-5 h-5"
                        />
                        <span>
                          {coin.name} ({coin.symbol.toUpperCase()})
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="px-4 py-2 rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-800"
            >
              <option value="usd">USD</option>
              <option value="eur">EUR</option>
              <option value="ngn">NGN</option>
              <option value="btc">BTC</option>
            </select>

            <div className="flex gap-2">
              <button
                onClick={() => setTimeframe("1")}
                className={`px-3 py-1 rounded ${
                  timeframe === "1"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 dark:bg-gray-700"
                }`}
              >
                1D
              </button>
              <button
                onClick={() => setTimeframe("7")}
                className={`px-3 py-1 rounded ${
                  timeframe === "7"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 dark:bg-gray-700"
                }`}
              >
                1W
              </button>
              <button
                onClick={() => setTimeframe("30")}
                className={`px-3 py-1 rounded ${
                  timeframe === "30"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 dark:bg-gray-700"
                }`}
              >
                1M
              </button>
            </div>

            <button
              onClick={() =>
                setYAxisType(yAxisType === "linear" ? "logarithmic" : "linear")
              }
              className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white"
            >
              Toggle {yAxisType === "linear" ? "Log Scale" : "Linear Scale"}
            </button>

            <button
              onClick={handleExportCSV}
              className="px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white"
            >
              Export CSV
            </button>
            <button
              onClick={handleExportPNG}
              className="px-4 py-2 rounded-lg bg-purple-500 hover:bg-purple-600 text-white"
            >
              Export PNG
            </button>
          </div>

          {/* Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-2 sm:p-4">
            {loading ? (
              <Loader />
            ) : series.length > 0 ? (
              <>
                <h2 className="text-lg font-semibold mb-3">
                  {series[0].name.toUpperCase()}
                </h2>
                <Chart
                  options={{
                    chart: {
                      id: "candlestick",
                      type: "candlestick",
                      height: 500,
                      background: isDark ? "#1f2937" : "#ffffff",
                      toolbar: { show: true },
                    },
                    theme: { mode: isDark ? "dark" : "light" },
                    tooltip: {
                      enabled: true,
                      theme: isDark ? "dark" : "light",
                      style: {
                        fontSize: "14px",
                        fontFamily: "inherit",
                        color: isDark ? "#f9fafb" : "#111827",
                      },
                      fillSeriesColor: false,
                      custom: function ({
                        series,
                        seriesIndex,
                        dataPointIndex,
                        w,
                      }) {
                        const d =
                          w.globals.initialSeries[seriesIndex].data[
                            dataPointIndex
                          ].y;
                        const ts =
                          w.globals.seriesX[seriesIndex][dataPointIndex];
                        const date = new Date(ts).toLocaleString();

                        return `
                      <div style="padding:8px; border-radius:8px; background:${
                        isDark ? "#1f2937" : "#f9fafb"
                      }; color:${
                          isDark ? "#f9fafb" : "#111827"
                        }; font-size:14px;">
                        <div><b>Time:</b> ${date}</div>
                        <div><b>Open:</b> ${d[0]}</div>
                        <div><b>High:</b> ${d[1]}</div>
                        <div><b>Low:</b> ${d[2]}</div>
                        <div><b>Close:</b> ${d[3]}</div>
                      </div>
                    `;
                      },
                    },
                    xaxis: {
                      type: "datetime",
                      labels: {
                        style: { colors: isDark ? "#e5e7eb" : "#374151" },
                      },
                    },
                    yaxis: {
                      logarithmic: yAxisType === "logarithmic",
                      labels: {
                        style: { colors: isDark ? "#e5e7eb" : "#374151" },
                      },
                    },
                    plotOptions: {
                      candlestick: {
                        colors: {
                          upward: "#10b981",
                          downward: "#ef4444",
                        },
                      },
                    },
                  }}
                  series={series.map((coin) => ({
                    name: coin.name,
                    data: coin.data,
                  }))}
                  type="candlestick"
                  height={500}
                />
              </>
            ) : (
              <p className="text-center text-gray-500">No data available</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AnalyticsPage;
