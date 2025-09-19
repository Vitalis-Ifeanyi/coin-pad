import React, { useContext } from "react";
import { DarkModeContext } from "../context/DarkModeContext";

interface AnalyticsHeroProps {
  title?: string;
  subtitle?: string;
  illustrationSrc?: string;
}

const AnalyticsHero: React.FC<AnalyticsHeroProps> = ({
  title = "Coin Analytics Dashboard",
  subtitle = "Track, visualize, and export real-time candlestick data of your favorite cryptocurrencies. Analyze trends, compare multiple coins, and make data-driven investment decisions with ease. Our dashboard provides intuitive charts, flexible timeframes, and customizable export options for your analytics workflow.",
  illustrationSrc = "/ana-hero.jpg",
}) => {
  const context = useContext(DarkModeContext);

  if (!context) {
    throw new Error("Terms must be used within a DarkModeProvider");
  }

  const { isDark } = context;

  const bgGradient = isDark ? "from-gray-0 to-gray-900" : "from- to-indigo-300";

  return (
    <div className="relative w-full overflow-hidden shadow-lg ">
      <div
        className="absolute inset-0 bg-cover bg-center filter blur-sm opacity-50"
        style={{ backgroundImage: "url('/hero-ana-bg.jpg')" }}
      />

      <div
        className={`absolute inset-0 bg-gradient-to-r ${bgGradient} opacity-90`}
      />

      <div
        className={`relative z-10 px-6 md:px-12 py-16 flex flex-col md:flex-row items-center gap-12 max-w-7xl mx-auto ${
          isDark ? "text-white" : "text-gray-900"
        }`}
      >
        <div className="flex-1 text-center md:text-left max-w-xl md:max-w-lg lg:max-w-2xl">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            {title}
          </h1>
          <p className="text-md md:text-lg lg:text-xl leading-relaxed opacity-90">
            {subtitle}
          </p>
        </div>

        <div className="flex-1 w-full max-w-sm md:max-w-md lg:max-w-xl mx-auto">
          <img
            src={illustrationSrc}
            alt="Analytics Illustration"
            className="w-full h-auto rounded-xl shadow-2xl object-cover mix-blend-overlay scale-105 transition-transform duration-500 hover:scale-110"
          />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsHero;
