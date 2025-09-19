import React, { useContext } from "react";
import { Info, TrendingUp, BarChart3 } from "lucide-react";
import { DarkModeContext } from "../context/DarkModeContext";

const InfoCards: React.FC = () => {
  const { isDark } = useContext(DarkModeContext);

  const cardBg = isDark ? "bg-gray-800 text-white" : "bg-white text-gray-800";
  const textSecondary = isDark ? "text-gray-400" : "text-gray-600";

  return (
    <div className="space-y-4">
      <div className={`${cardBg} shadow rounded-xl p-5 flex items-start gap-4`}>
        <Info className="text-blue-600 w-6 h-6 flex-shrink-0" />
        <div>
          <h3 className="font-semibold">What is Market Cap?</h3>
          <p className={`text-sm ${textSecondary}`}>
            Market cap is the total value of a cryptocurrency, calculated as{" "}
            <span className="font-medium">price × circulating supply</span>.
          </p>
        </div>
      </div>

      <div className={`${cardBg} shadow rounded-xl p-5 flex items-start gap-4`}>
        <TrendingUp className="text-green-600 w-6 h-6 flex-shrink-0" />
        <div>
          <h3 className="font-semibold">24h % Change</h3>
          <p className={`text-sm ${textSecondary}`}>
            Shows how much the coin’s price has{" "}
            <span className="text-green-500 font-medium">increased</span> or{" "}
            <span className="text-red-500 font-medium">decreased</span> in the
            last 24 hours.
          </p>
        </div>
      </div>

      <div className={`${cardBg} shadow rounded-xl p-5 flex items-start gap-4`}>
        <BarChart3 className="text-purple-600 w-6 h-6 flex-shrink-0" />
        <div>
          <h3 className="font-semibold">Volume (24h)</h3>
          <p className={`text-sm ${textSecondary}`}>
            The total trading activity of a coin in the last{" "}
            <span className="font-medium">24 hours</span>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default InfoCards;
