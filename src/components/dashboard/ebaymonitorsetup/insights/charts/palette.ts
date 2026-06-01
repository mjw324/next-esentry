/**
 * Chart palette. The brand accent matches the price slider (#1dd49e); the rest
 * are picked to read well in both light and dark themes. Axis/label text uses
 * `currentColor` in the chart components so it follows the HeroUI foreground.
 */
export const CHART_ACCENT = "#1dd49e";

export const CHART_COLORS = [
  "#1dd49e", // brand green
  "#3b82f6", // blue
  "#f59e0b", // amber
  "#a855f7", // purple
  "#ef4444", // red
  "#14b8a6", // teal
  "#ec4899", // pink
  "#84cc16", // lime
];

export function colorAt(index: number): string {
  return CHART_COLORS[index % CHART_COLORS.length];
}
