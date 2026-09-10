import { formatPercent } from "../lib/format";

interface ChangeProps {
  value: number | null | undefined;
  className?: string;
  /** Pill background, for places where the number stands alone. */
  pill?: boolean;
}

/** A percentage change coloured by direction, with a caret so it isn't colour-only. */
export default function Change({ value, className = "", pill = false }: ChangeProps) {
  if (value == null || !Number.isFinite(value)) {
    return <span className={`num text-faint ${className}`}>—</span>;
  }

  // Anything that rounds to 0.00% (stablecoins, mostly) has no direction.
  if (Math.abs(value) < 0.005) {
    return <span className={`num whitespace-nowrap text-faint ${className}`}>0.00%</span>;
  }

  const up = value > 0;
  const tone = up ? "text-up" : "text-down";
  const bg = pill ? (up ? "bg-up-soft px-1.5 py-0.5 rounded" : "bg-down-soft px-1.5 py-0.5 rounded") : "";

  return (
    <span className={`num inline-flex items-center gap-1 whitespace-nowrap ${tone} ${bg} ${className}`}>
      <svg viewBox="0 0 8 8" className={`size-2 fill-current ${up ? "" : "rotate-180"}`} aria-hidden="true">
        <path d="M4 1 7.5 7h-7z" />
      </svg>
      <span className="sr-only">{up ? "up" : "down"}</span>
      {formatPercent(value)}
    </span>
  );
}
