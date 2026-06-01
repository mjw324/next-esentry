"use client";

import { useEffect, useRef, useState } from "react";
import { Button, Chip, Spinner } from "@heroui/react";
import { Scissors } from "lucide-react";
import insightsService, { isRateLimitError } from "@/services/insightsService";
import type {
  CalibrationSummary,
  InsightsParams,
  SuggestedPriceRange,
} from "@/types/insights";
import { useDebouncedParams } from "./useDebouncedParams";

interface CalibrationStripProps {
  params: InsightsParams;
  userId?: string;
  onApplyExcludedKeyword: (term: string) => void;
  onApplyPriceRange: (range: SuggestedPriceRange) => void;
}

/**
 * Compact live-calibration line shown atop the Filters tab. Debounced calls to
 * `/api/insights/calibrate` as the user edits filters; renders a one-line
 * summary (total · % noise · price percentile) plus inline recalibration chips.
 */
export default function CalibrationStrip({
  params,
  userId,
  onApplyExcludedKeyword,
  onApplyPriceRange,
}: CalibrationStripProps) {
  const { debouncedKey, debouncedParams, hasKeywords } =
    useDebouncedParams(params);

  const [summary, setSummary] = useState<CalibrationSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [rateLimited, setRateLimited] = useState(false);
  const [error, setError] = useState(false);

  // Guards against out-of-order responses when params change quickly.
  const requestId = useRef(0);

  useEffect(() => {
    if (!userId || !hasKeywords) {
      setSummary(null);
      setError(false);
      setRateLimited(false);
      return;
    }

    const id = ++requestId.current;
    setLoading(true);
    setError(false);
    setRateLimited(false);

    insightsService
      .calibrate(debouncedParams, userId)
      .then((result) => {
        if (id !== requestId.current) return;
        setSummary(result);
      })
      .catch((err) => {
        if (id !== requestId.current) return;
        setSummary(null);
        if (isRateLimitError(err)) setRateLimited(true);
        else setError(true);
      })
      .finally(() => {
        if (id === requestId.current) setLoading(false);
      });
    // debouncedKey captures the param snapshot; debouncedParams is derived from it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedKey, userId, hasKeywords]);

  // Demo / signed-out: invite sign-in, don't call the API.
  if (!userId) {
    return (
      <div className="rounded-medium border border-dashed border-default-200 bg-content2/50 px-3 py-2 text-tiny text-default-500">
        Sign in to preview the live eBay market for these filters.
      </div>
    );
  }

  if (!hasKeywords) {
    return (
      <div className="rounded-medium border border-dashed border-default-200 bg-content2/50 px-3 py-2 text-tiny text-default-500">
        Add a keyword to preview the market.
      </div>
    );
  }

  return (
    <div className="rounded-medium border border-default-200 bg-content2/50 px-3 py-2">
      <div className="flex items-center gap-2 text-tiny text-default-600">
        {loading && <Spinner size="sm" />}
        {rateLimited && (
          <span className="text-warning-600">
            Market preview temporarily unavailable (rate limited).
          </span>
        )}
        {error && !rateLimited && (
          <span className="text-default-400">
            Couldn&apos;t load the market preview.
          </span>
        )}
        {!loading && !rateLimited && !error && summary && (
          <CalibrationLine summary={summary} />
        )}
      </div>

      {summary && !rateLimited && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {summary.topSuggestedExcludedKeywords.map((term) => (
            <Chip
              key={term.term}
              size="sm"
              variant="flat"
              color="danger"
              className="cursor-pointer"
              startContent={<Scissors className="h-3 w-3" />}
              onClick={() => onApplyExcludedKeyword(term.term)}
            >
              Exclude &quot;{term.term}&quot;
              {term.count > 0 && (
                <span className="ml-1 opacity-70">−{term.count}</span>
              )}
            </Chip>
          ))}
          {summary.suggestedPriceRange && (
            <Button
              size="sm"
              variant="flat"
              color="warning"
              className="h-6 min-w-0 px-2 text-tiny"
              onPress={() => onApplyPriceRange(summary.suggestedPriceRange!)}
            >
              Tighten price to ${summary.suggestedPriceRange.minPrice}–$
              {summary.suggestedPriceRange.maxPrice}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

function CalibrationLine({ summary }: { summary: CalibrationSummary }) {
  const parts: string[] = [
    `~${summary.totalActive.toLocaleString()} active listings match`,
  ];

  if (summary.noiseFraction > 0) {
    parts.push(`~${Math.round(summary.noiseFraction * 100)}% look like accessories`);
  }

  if (summary.maxPricePercentile != null) {
    parts.push(
      `your max price sits at ~the ${Math.round(summary.maxPricePercentile)}th percentile`
    );
  }

  return <span>{parts.join(" · ")}</span>;
}
