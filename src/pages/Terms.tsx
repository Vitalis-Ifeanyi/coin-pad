import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { TERMS, slugify, type Term, type TermCategory } from "../data/terms";
import Segmented from "../components/Segmented";

const FILTERS = [
  { value: "all", label: "All" },
  { value: "crypto", label: "Crypto" },
  { value: "trading", label: "Trading" },
] as const;

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

function Highlight({ text, query }: { text: string; query: string }) {
  if (!query) return text;
  const i = text.toLowerCase().indexOf(query.toLowerCase());
  if (i === -1) return text;
  return (
    <>
      {text.slice(0, i)}
      <mark className="rounded-sm bg-[#f5e3a3] px-0.5 text-inherit dark:bg-[#5a4a17]">
        {text.slice(i, i + query.length)}
      </mark>
      {text.slice(i + query.length)}
    </>
  );
}

export default function Terms() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | TermCategory>("all");
  const q = query.trim();

  const groups = useMemo(() => {
    const needle = q.toLowerCase();
    const matches = TERMS.filter(
      (t) =>
        (filter === "all" || t.category === filter) &&
        (!needle || t.term.toLowerCase().includes(needle) || t.definition.toLowerCase().includes(needle)),
    );
    const byLetter = new Map<string, Term[]>();
    for (const t of matches) {
      const letter = t.term[0].toUpperCase();
      byLetter.set(letter, [...(byLetter.get(letter) ?? []), t]);
    }
    return byLetter;
  }, [q, filter]);

  const count = [...groups.values()].reduce((n, g) => n + g.length, 0);

  return (
    <div className="mx-auto max-w-5xl px-4 pt-8 sm:px-6 sm:pt-10">
      <header className="max-w-2xl">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-[28px]">Glossary</h1>
        <p className="mt-2 text-muted">
          {TERMS.length} crypto and trading terms, in plain English. Each one is linkable, so you can send someone
          straight to a definition.
        </p>
      </header>

      <div className="sticky top-14 z-10 -mx-4 mt-6 border-b border-line bg-canvas px-4 py-3 sm:-mx-6 sm:px-6">
        <div className="flex flex-wrap items-center gap-3">
          <label className="relative flex w-full items-center sm:w-72">
            <span className="sr-only">Search terms</span>
            <Search size={14} className="pointer-events-none absolute left-2.5 text-faint" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Escape" && setQuery("")}
              placeholder="Search terms and definitions"
              className="h-9 w-full rounded-md border border-line bg-surface pr-8 pl-8 text-sm placeholder:text-faint focus:border-line-strong focus:outline-none [&::-webkit-search-cancel-button]:hidden"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute right-2 grid size-5 place-items-center rounded text-faint hover:text-fg"
              >
                <X size={13} />
              </button>
            )}
          </label>
          <Segmented label="Category" value={filter} options={FILTERS} onChange={setFilter} />
          <p className="num ml-auto text-xs text-faint">
            {count} {count === 1 ? "term" : "terms"}
          </p>
        </div>

        <nav aria-label="Jump to letter" className="mt-3 hidden flex-wrap gap-0.5 font-mono text-xs sm:flex">
          {ALPHABET.map((l) =>
            groups.has(l) ? (
              <a key={l} href={`#letter-${l}`} className="grid size-6 place-items-center rounded text-muted hover:bg-sunken hover:text-fg">
                {l}
              </a>
            ) : (
              <span key={l} className="grid size-6 place-items-center text-line-strong" aria-hidden="true">
                {l}
              </span>
            ),
          )}
        </nav>
      </div>

      {count === 0 ? (
        <p className="py-16 text-center text-muted">
          Nothing matches “{q}”.{" "}
          <button type="button" onClick={() => setQuery("")} className="text-fg underline underline-offset-2">
            Clear search
          </button>
        </p>
      ) : (
        <div className="divide-y divide-line">
          {[...groups.entries()].map(([letter, terms]) => (
            <section key={letter} id={`letter-${letter}`} className="grid scroll-mt-40 gap-x-8 py-6 sm:grid-cols-[3rem_1fr]">
              <h2 className="mb-3 font-mono text-lg text-faint sm:mb-0">{letter}</h2>
              <dl className="grid gap-x-10 gap-y-5 md:grid-cols-2">
                {terms.map((t) => (
                  <div key={t.term} id={slugify(t.term)} className="group scroll-mt-40 target:rounded-md target:bg-sunken target:ring-8 target:ring-sunken">
                    <dt className="flex items-baseline gap-2">
                      <a href={`#${slugify(t.term)}`} className="font-medium hover:underline hover:underline-offset-2">
                        <Highlight text={t.term} query={q} />
                      </a>
                      <span className="font-mono text-[11px] text-faint">{t.category}</span>
                    </dt>
                    <dd className="mt-1 text-sm leading-relaxed text-muted">
                      <Highlight text={t.definition} query={q} />
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
