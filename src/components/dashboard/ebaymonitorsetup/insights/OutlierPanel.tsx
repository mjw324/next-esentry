"use client";

import { Chip, Button } from "@heroui/react";
import { AlertTriangle, Scissors, TrendingDown, TrendingUp } from "lucide-react";
import type { OutlierResult, SuggestedPriceRange } from "@/types/insights";

interface OutlierPanelProps {
  result: OutlierResult;
  currency?: string;
  onApplyExcludedKeyword: (term: string) => void;
  onApplyPriceRange: (range: SuggestedPriceRange) => void;
}

export default function OutlierPanel({
  result,
  currency = "USD",
  onApplyExcludedKeyword,
  onApplyPriceRange,
}: OutlierPanelProps) {
  const { outlierListings, suggestedRefinements } = result;
  const { suggestedExcludedKeywords, suggestedPriceRange } = suggestedRefinements;

  const fmt = (v: number) =>
    new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(v);

  const hasSuggestions =
    suggestedExcludedKeywords.length > 0 || !!suggestedPriceRange;

  if (outlierListings.length === 0 && !hasSuggestions) {
    return (
      <p className="text-small text-default-500">
        No obvious outliers in the current sample — this query looks well
        calibrated.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* One-tap recalibration chips */}
      {hasSuggestions && (
        <div className="flex flex-col gap-2">
          <p className="text-tiny font-medium uppercase tracking-wide text-default-500">
            Tighten this monitor
          </p>
          <div className="flex flex-wrap gap-2">
            {suggestedExcludedKeywords.map((term) => (
              <Button
                key={term.term}
                size="sm"
                variant="flat"
                color="danger"
                startContent={<Scissors className="h-3.5 w-3.5" />}
                onPress={() => onApplyExcludedKeyword(term.term)}
              >
                Exclude &quot;{term.term}&quot;
                {term.count > 0 && (
                  <span className="ml-1 opacity-70">−{term.count}</span>
                )}
              </Button>
            ))}
            {suggestedPriceRange && (
              <Button
                size="sm"
                variant="flat"
                color="warning"
                onPress={() => onApplyPriceRange(suggestedPriceRange)}
              >
                Tighten price to {fmt(suggestedPriceRange.minPrice)}–
                {fmt(suggestedPriceRange.maxPrice)}
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Flagged "these look off" listings */}
      {outlierListings.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="flex items-center gap-1.5 text-tiny font-medium uppercase tracking-wide text-default-500">
            <AlertTriangle className="h-3.5 w-3.5" /> These look off
          </p>
          <ul className="flex flex-col gap-2">
            {outlierListings.map((item) => (
              <li
                key={item.itemId}
                className="flex items-start justify-between gap-3 rounded-medium bg-content2 px-3 py-2"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-small text-default-700" title={item.title}>
                    {item.title}
                  </p>
                  {item.matchedTokens.length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-1">
                      {item.matchedTokens.map((token) => (
                        <Chip
                          key={token}
                          size="sm"
                          variant="flat"
                          color="default"
                          className="h-5 text-tiny"
                        >
                          {token}
                        </Chip>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <span className="text-small font-semibold text-default-700">
                    {fmt(item.price)}
                  </span>
                  <Chip
                    size="sm"
                    variant="flat"
                    color={item.tail === "low" ? "primary" : "secondary"}
                    startContent={
                      item.tail === "low" ? (
                        <TrendingDown className="h-3 w-3" />
                      ) : (
                        <TrendingUp className="h-3 w-3" />
                      )
                    }
                    className="h-5 text-tiny"
                  >
                    {item.tail === "low" ? "low" : "high"}
                  </Chip>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
