import React, { useContext } from "react";
import { Github, Twitter, Linkedin } from "lucide-react";
import { DarkModeContext } from "../context/DarkModeContext";

const Footer: React.FC = () => {
  const context = useContext(DarkModeContext);

  if (!context) {
    throw new Error("Terms must be used within a DarkModeProvider");
  }

  const { isDark } = context;

  const bgColor = isDark ? "bg-gray-900" : "bg-gray-100";
  const textColor = isDark ? "text-gray-300" : "text-gray-600";
  const linkColor = isDark
    ? "text-blue-400 hover:underline"
    : "text-blue-600 hover:underline";

  return (
    <footer
      className={`${bgColor} border-t pt-10 transition-colors duration-300`}
    >
      <div
        className={`max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center ${textColor} text-sm`}
      >
        {/* Left: Copyright */}
        <p className="mb-3 md:mb-0">
          © {new Date().getFullYear()} COIN PAD. All rights reserved.
        </p>

        {/* Middle: API credit */}
        <p className="mb-3 md:mb-0">
          Data powered by{" "}
          <a
            href="https://www.coingecko.com/"
            target="_blank"
            rel="noopener noreferrer"
            className={linkColor}
          >
            CoinGecko API
          </a>
        </p>

        {/* Right: Social Links */}
        <div className="flex gap-4">
          <a
            href="https://github.com/Vitalis-Ifeanyi"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-500 transition"
          >
            <Github size={18} />
          </a>
          <a
            href="https://twitter.com/delegends"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-500 transition"
          >
            <Twitter size={18} />
          </a>
          <a
            href="https://linkedin.com/in/ifeanyi-vitalis-nwokolo"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-500 transition"
          >
            <Linkedin size={18} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
