import React from "react";
import { CheckCircle2 } from "lucide-react";

const features = [
  "Live Crypto Charts",
  "Real-Time Analytics",
  "Market Insights & Trends",
  "Risk Management Tools",
];

const Action: React.FC = () => {
  return (
    <section className="bg-white dark:bg-gray-900 py-16">
      <div className="container mx-auto px-6 lg:px-12 grid lg:grid-cols-2 items-center gap-12">
        <div className="flex justify-center">
          <img
            src="/action.png"
            alt="Crypto Illustration"
            className="max-w-md w-full drop-shadow-xl"
          />
        </div>

        <div className="text-left">
          <h3 className="text-blue-500 font-semibold uppercase tracking-wide mb-2">
            Explore With Us
          </h3>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Your Gateway to{" "}
            <span className="text-blue-500">Crypto Insights</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Stay ahead in the fast-moving crypto market with live data, in-depth
            analytics, and tools to help you make smarter trading decisions.
          </p>

          <ul className="space-y-3 mb-6">
            {features.map((feature, idx) => (
              <li
                key={idx}
                className="flex items-center gap-2 text-gray-700 dark:text-gray-200"
              >
                <CheckCircle2 className="text-blue-500 w-5 h-5" />
                {feature}
              </li>
            ))}
          </ul>

          <button
            className="mt-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold px-8 py-3 rounded-xl shadow-xl transition-transform transform hover:scale-105 inline-block"
            onClick={() => (window.location.href = "/analytics")}
          >
            Explore Analytics
          </button>
        </div>
      </div>
    </section>
  );
};

export default Action;
