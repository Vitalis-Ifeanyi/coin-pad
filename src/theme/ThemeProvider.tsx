import { useCallback, useMemo, useState, type ReactNode } from "react";
import { ThemeContext, type Theme } from "./theme-context";

// index.html sets the class before React loads, so read it back rather than guessing.
const initialTheme = (): Theme =>
  document.documentElement.classList.contains("dark") ? "dark" : "light";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(initialTheme);

  const toggleTheme = useCallback(() => {
    const next: Theme = document.documentElement.classList.contains("dark") ? "light" : "dark";
    // Flip the class before re-rendering so anything reading CSS variables
    // during render (the candlestick chart) sees the new palette.
    document.documentElement.classList.toggle("dark", next === "dark");
    try {
      localStorage.setItem("theme", next);
    } catch {
      // Private mode / storage disabled: the toggle still works for this visit.
    }
    setTheme(next);
  }, []);

  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
