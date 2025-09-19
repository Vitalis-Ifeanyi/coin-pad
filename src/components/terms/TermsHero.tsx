import React, { useContext } from "react";
import { DarkModeContext } from "../../context/DarkModeContext";
import termHero from "/term-hero.jpg";

const TermsHero: React.FC = () => {
  const context = useContext(DarkModeContext);

  if (!context) {
    throw new Error("Terms must be used within a DarkModeProvider");
  }

  const { isDark } = context;

  return (
    <div className="relative w-full overflow-hidden shadow-lg mb-12">
      <div
        className="absolute inset-0 bg-cover bg-center filter blur-sm opacity-60"
        style={{ backgroundImage: "url('/crypto-hero-bg.jpg')" }}
      />
      <div
        className={`absolute inset-0 bg-gradient-to-r ${
          isDark ? "from-gray-800 to-gray-900" : "from-gray-300 to-gray-600"
        } opacity-90`}
      />

      {/* Content */}
      <div className="relative z-10 px-6 md:px-12 py-12 flex flex-col md:flex-row items-center gap-12 max-w-7xl mx-auto">
        {/* Text */}
        <div className="flex-1 text-center md:text-left max-w-xl md:max-w-lg lg:max-w-2xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Crypto & Trading Terms
          </h1>
          <p className="text-base md:text-lg lg:text-xl leading-relaxed opacity-90">
            Learn and explore hundreds of crypto and trading terms. Expand your
            knowledge, understand concepts, and become confident in the crypto
            market.
          </p>
        </div>

        {/* Illustration */}
        <div className="flex-1 w-full max-w-sm md:max-w-md lg:max-w-xl mx-auto">
          <img
            src={termHero}
            alt="Crypto Illustration"
            className="w-full h-auto rounded-xl shadow-2xl object-cover mix-blend-overlay scale-105 transition-transform duration-500 hover:scale-110"
          />
        </div>
      </div>
    </div>
  );
};

export default TermsHero;
