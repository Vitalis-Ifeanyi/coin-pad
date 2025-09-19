import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react"; // Lucide icons
import DarkModeToggle from "./DarkMode";

const navData = [
  { name: "Dashboard", path: "/" },
  { name: "Analytics", path: "/analytics" },
  { name: "Terms", path: "/terms" },
];

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link
          to="/"
          className="text-2xl font-heading font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent"
        >
          <img
            src="/Coin-pad.svg"
            alt="CoinPad Logo"
            className="inline-block w-10 h-10"
          />{" "}
          <span>COIN PAD</span>
        </Link>

        <div className="hidden md:flex gap-8 text-gray-700 font-medium">
          {navData.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className={`relative transition duration-300 ${
                location.pathname === item.path
                  ? "text-blue-600 font-semibold"
                  : "hover:text-blue-600"
              }`}
            >
              {item.name}

              {location.pathname === item.path && (
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-blue-600 rounded"></span>
              )}
            </Link>
          ))}
          <DarkModeToggle />
        </div>

        <button
          className="md:hidden text-gray-700 focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden bg-white border-t px-4 py-4 space-y-3 transition-all duration-300 ${
          isOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <DarkModeToggle />
        {navData.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            onClick={() => setIsOpen(false)}
            className={`block px-2 py-1 rounded-lg transition ${
              location.pathname === item.path
                ? "text-blue-600 font-semibold bg-blue-50"
                : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
            }`}
          >
            {item.name}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
