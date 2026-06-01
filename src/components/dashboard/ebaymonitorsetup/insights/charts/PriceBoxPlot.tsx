"use client";

import type { PriceStats } from "@/types/insights";
import { CHART_ACCENT } from "./palette";

/**
 * Honest box/quartile plot built from the five summary numbers the backend
 * returns (min / q1 / median / q3 / max). It is NOT a binned histogram — the
 * contract exposes summary stats only (see docs/INSIGHTS.md). Rendered as a
 * lightweight SVG since Recharts has no native box-plot primitive.
 */
export default function PriceBoxPlot({ stats }: { stats: PriceStats }) {
  const { min, q1, median, q3, max, currency } = stats;

  const span = max - min || 1;
  const pct = (v: number) => ((v - min) / span) * 100;

  const fmt = (v: number) =>
    new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: currency || "USD",
      maximumFractionDigits: 0,
    }).format(v);

  const boxLeft = pct(q1);
  const boxWidth = Math.max(pct(q3) - pct(q1), 0.5);
  const medianLeft = pct(median);

  return (
    <div className="w-full">
      <div className="relative h-16 w-full">
        {/* Whisker line (min → max) */}
        <div
          className="absolute top-1/2 h-px bg-default-300"
          style={{ left: "0%", right: "0%" }}
        />
        {/* Whisker caps */}
        <div className="absolute top-1/2 h-6 w-px -translate-y-1/2 bg-default-400 left-0" />
        <div className="absolute top-1/2 h-6 w-px -translate-y-1/2 bg-default-400 right-0" />
        {/* IQR box (q1 → q3) */}
        <div
          className="absolute top-1/2 h-9 -translate-y-1/2 rounded-md border"
          style={{
            left: `${boxLeft}%`,
            width: `${boxWidth}%`,
            backgroundColor: `${CHART_ACCENT}33`,
            borderColor: CHART_ACCENT,
          }}
        />
        {/* Median line */}
        <div
          className="absolute top-1/2 h-9 w-0.5 -translate-y-1/2"
          style={{ left: `${medianLeft}%`, backgroundColor: CHART_ACCENT }}
        />
      </div>
      <div className="mt-2 flex justify-between text-tiny text-default-500">
        <span>min {fmt(min)}</span>
        <span>Q1 {fmt(q1)}</span>
        <span className="font-medium text-default-700">median {fmt(median)}</span>
        <span>Q3 {fmt(q3)}</span>
        <span>max {fmt(max)}</span>
      </div>
    </div>
  );
}
