import { useId, useState } from "react";
import { Search } from "lucide-react";
import { useApi } from "../hooks/useApi";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import type { SearchCoin } from "../types/coin";

export default function CoinSearch({ onSelect }: { onSelect: (coin: SearchCoin) => void }) {
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const listId = useId();

  const query = useDebouncedValue(text.trim(), 300);
  const { data, loading } = useApi<{ coins: SearchCoin[] }>(
    query.length >= 2 ? "/search" : null,
    { query },
    { maxAgeMs: 10 * 60_000 },
  );
  const results = query.length >= 2 ? (data?.coins.slice(0, 8) ?? []) : [];
  const showList = open && query.length >= 2;

  const choose = (coin: SearchCoin) => {
    onSelect(coin);
    setText("");
    setOpen(false);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!results.length) return;
      setOpen(true);
      const delta = e.key === "ArrowDown" ? 1 : -1;
      setActive((i) => (i + delta + results.length) % results.length);
    } else if (e.key === "Enter" && showList && results[active]) {
      e.preventDefault();
      choose(results[active]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div className="relative w-full sm:w-72">
      <Search size={14} className="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-faint" />
      <input
        type="text"
        role="combobox"
        aria-label="Search for a coin"
        aria-expanded={showList}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={showList && results[active] ? `${listId}-${active}` : undefined}
        value={text}
        placeholder="Switch coin…"
        onChange={(e) => {
          setText(e.target.value);
          setActive(0);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onKeyDown={onKeyDown}
        className="h-9 w-full rounded-md border border-line bg-surface pr-3 pl-8 text-sm placeholder:text-faint focus:border-line-strong focus:outline-none"
      />

      {showList && (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-20 mt-1 max-h-80 w-full overflow-y-auto rounded-md border border-line-strong bg-surface py-1 shadow-lg"
        >
          {results.length === 0 && (
            <li className="px-3 py-2 text-sm text-faint">{loading ? "Searching…" : `Nothing found for “${query}”`}</li>
          )}
          {results.map((coin, i) => (
            <li
              key={coin.id}
              id={`${listId}-${i}`}
              role="option"
              aria-selected={i === active}
              // mousedown fires before the input's blur, so the list is still there.
              onMouseDown={(e) => {
                e.preventDefault();
                choose(coin);
              }}
              onMouseEnter={() => setActive(i)}
              className={`flex cursor-pointer items-center gap-2.5 px-3 py-1.5 text-sm ${i === active ? "bg-sunken" : ""}`}
            >
              <img src={coin.thumb} alt="" width={18} height={18} className="size-[18px] rounded-full" />
              <span className="min-w-0 flex-1 truncate">{coin.name}</span>
              <span className="font-mono text-xs text-faint uppercase">{coin.symbol}</span>
              {coin.market_cap_rank && <span className="num w-10 text-right text-xs text-faint">#{coin.market_cap_rank}</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
