import { useEffect, useImperativeHandle, useMemo, useRef, type Ref } from "react";
// The core build plus only what this chart uses. The default "apexcharts"
// entry bundles every chart type and adds ~250 KB gzipped.
import ApexCharts, { type ApexOptions } from "apexcharts/core";
import "apexcharts/candlestick";
import "apexcharts/features/toolbar";
import "apexcharts/features/exports";
import type { OhlcRow } from "../types/coin";
import { formatPrice } from "../lib/format";
import { useTheme } from "../theme/theme-context";

export interface CandleChartHandle {
  /** PNG data URL of the current chart, rendered at 2x. */
  toPng: () => Promise<string | undefined>;
}

interface CandleChartProps {
  rows: OhlcRow[];
  currency: string;
  logScale: boolean;
  height?: number;
  ref?: Ref<CandleChartHandle>;
}

const cssVar = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

export default function CandleChart({ rows, currency, logScale, height = 440, ref }: CandleChartProps) {
  const { theme } = useTheme();
  const elRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<ApexCharts | null>(null);

  const options = useMemo<ApexOptions>(() => {
    // `theme` is a dependency so these re-read after a toggle.
    const c = {
      up: cssVar("--up"),
      down: cssVar("--down"),
      line: cssVar("--line"),
      text: cssVar("--muted"),
      surface: cssVar("--surface"),
    };
    const fmt = (v: number) => formatPrice(v, currency);
    // Axis ticks are round numbers; "$2,400.00" is just noise.
    const axis = (v: number) => (Math.abs(v) >= 100 ? formatPrice(v, currency).replace(/\.00$/, "") : fmt(v));

    return {
      series: [{ name: "Price", data: rows.map(([x, o, h, l, cl]) => ({ x, y: [o, h, l, cl] })) }],
      chart: {
        type: "candlestick",
        height,
        background: c.surface,
        fontFamily: "IBM Plex Sans, ui-sans-serif, system-ui, sans-serif",
        foreColor: c.text,
        animations: { enabled: false },
        toolbar: {
          show: true,
          tools: { download: false, selection: false, pan: false, zoom: true, zoomin: true, zoomout: true, reset: true },
        },
        zoom: { enabled: true, type: "x" },
      },
      theme: { mode: theme },
      // Top padding keeps the highest y-axis label clear of the toolbar.
      grid: { borderColor: c.line, strokeDashArray: 0, padding: { top: 24, left: 8, right: 4 } },
      plotOptions: {
        candlestick: {
          colors: { upward: c.up, downward: c.down },
          wick: { useFillColor: true },
        },
      },
      xaxis: {
        type: "datetime",
        labels: { datetimeUTC: false, style: { colors: c.text, fontSize: "11px" } },
        axisBorder: { color: c.line },
        axisTicks: { color: c.line },
        tooltip: { enabled: false },
      },
      yaxis: {
        opposite: true,
        logarithmic: logScale,
        tooltip: { enabled: false },
        labels: { formatter: axis, style: { colors: [c.text], fontSize: "11px" } },
      },
      tooltip: {
        custom: ({ dataPointIndex }: { dataPointIndex: number }) => {
          const row = rows[dataPointIndex];
          if (!row) return "";
          const [ts, o, h, l, close] = row;
          const up = close >= o;
          const line = (k: string, v: number) =>
            `<div style="display:flex;justify-content:space-between;gap:16px"><span style="color:var(--muted)">${k}</span><span>${fmt(v)}</span></div>`;
          return `<div style="padding:8px 10px;font-size:12px;font-variant-numeric:tabular-nums;min-width:170px">
            <div style="color:var(--muted);margin-bottom:4px">${new Date(ts).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}</div>
            ${line("Open", o)}${line("High", h)}${line("Low", l)}
            <div style="display:flex;justify-content:space-between;gap:16px"><span style="color:var(--muted)">Close</span><span style="color:${up ? "var(--up)" : "var(--down)"}">${fmt(close)}</span></div>
          </div>`;
        },
      },
    };
  }, [theme, currency, logScale, rows, height]);

  // Rebuilding on change is simpler than diffing options, and cheap with
  // animations off (a year of 4-day candles is ~90 points).
  useEffect(() => {
    const chart = new ApexCharts(elRef.current!, options);
    chart.render();
    chartRef.current = chart;
    return () => {
      chart.destroy();
      chartRef.current = null;
    };
  }, [options]);

  useImperativeHandle(
    ref,
    () => ({
      toPng: async () => {
        const out = await chartRef.current?.dataURI({ scale: 2 });
        return out && "imgURI" in out ? out.imgURI : undefined;
      },
    }),
    [],
  );

  return <div ref={elRef} style={{ minHeight: height }} />;
}
