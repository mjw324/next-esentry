"use client";

import type { BuyingOptionSplit as BuyingOption } from "@/types/insights";
import { colorAt } from "./palette";

const LABELS: Record<string, string> = {
  FIXED_PRICE: "Buy It Now",
  AUCTION: "Auction",
  BEST_OFFER: "Best Offer",
  CLASSIFIED_AD: "Classified",
};

function labelFor(option: string): string {
  return LABELS[option] ?? option;
}

/**
 * Auction-vs-fixed-price split as a single horizontal stacked bar. Data comes
 * straight from eBay's `buyingOptions` refinement (full-population counts).
 */
export default function BuyingOptionSplit({ data }: { data: BuyingOption[] }) {
  const segments = data.filter((d) => d.matchCount > 0);
  const total = segments.reduce((sum, d) => sum + d.matchCount, 0);

  if (total === 0) {
    return (
      <p className="text-tiny text-default-400">No buying-option data for this query.</p>
    );
  }

  return (
    <div className="w-full">
      <div className="flex h-4 w-full overflow-hidden rounded-full">
        {segments.map((seg, i) => (
          <div
            key={seg.buyingOption}
            style={{
              width: `${(seg.matchCount / total) * 100}%`,
              backgroundColor: colorAt(i),
            }}
            title={`${labelFor(seg.buyingOption)}: ${seg.matchCount.toLocaleString()}`}
          />
        ))}
      </div>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-tiny text-default-500">
        {segments.map((seg, i) => (
          <span key={seg.buyingOption} className="flex items-center gap-1.5">
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: colorAt(i) }}
            />
            {labelFor(seg.buyingOption)} ·{" "}
            {Math.round((seg.matchCount / total) * 100)}%
          </span>
        ))}
      </div>
    </div>
  );
}
