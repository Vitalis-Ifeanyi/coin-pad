import { memo } from "react";

interface SparklineProps {
  prices: number[] | undefined;
  width?: number;
  height?: number;
  /** Shade the area under the line. */
  fill?: boolean;
  className?: string;
}

/**
 * Plain SVG sparkline. The table renders 100 of these, which is why this
 * replaced a charting library — it's a polyline and nothing else.
 */
function Sparkline({ prices, width = 120, height = 36, fill = false, className = "" }: SparklineProps) {
  if (!prices || prices.length < 2) {
    return <svg width={width} height={height} className={className} aria-hidden="true" />;
  }

  // The 7d series has ~168 hourly points; halving it is visually identical at this size.
  const step = prices.length > 100 ? 2 : 1;
  const pts = prices.filter((_, i) => i % step === 0 || i === prices.length - 1);

  let min = Infinity;
  let max = -Infinity;
  for (const p of pts) {
    if (p < min) min = p;
    if (p > max) max = p;
  }
  const range = max - min || 1;
  const pad = 2;
  const x = (i: number) => (i / (pts.length - 1)) * width;
  const y = (p: number) => pad + (1 - (p - min) / range) * (height - pad * 2);

  const line = pts.map((p, i) => `${x(i).toFixed(1)},${y(p).toFixed(1)}`).join(" ");
  const up = pts[pts.length - 1] >= pts[0];
  const tone = up ? "text-up" : "text-down";

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className={`${tone} ${className}`}
      role="img"
      aria-label={`7-day trend ${up ? "up" : "down"}`}
    >
      {fill && (
        <polygon points={`0,${height} ${line} ${width},${height}`} className="fill-current opacity-10" />
      )}
      <polyline
        points={line}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export default memo(Sparkline);
