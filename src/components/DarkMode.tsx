import { useContext } from "react";
import { DarkModeContext } from "../context/DarkModeContext";

const DarkModeToggle = () => {
  const context = useContext(DarkModeContext);

  if (!context) {
    throw new Error("Terms must be used within a DarkModeProvider");
  }

  const { isDark, toggleDarkMode } = context;

  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        className="sr-only"
        checked={isDark}
        onChange={toggleDarkMode}
      />
      <div className="w-10 h-6 bg-gray-200 dark:bg-gray-700 rounded-full relative transition-colors">
        <span
          className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
            isDark ? "translate-x-4" : "translate-x-0"
          }`}
        />
      </div>
      <span className="ml-3 text-gray-900 dark:text-white font-medium">
        {isDark ? "🌙" : "☀️"}
      </span>
    </label>
  );
};

export default DarkModeToggle;
