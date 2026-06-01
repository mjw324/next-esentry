import { useMemo } from "react";
import useDebouncedValue from "@/hooks/useDebouncedValue";
import type { InsightsParams } from "@/types/insights";

/** Normalized, stable string key for a set of insights params (cache/debounce). */
export function paramsKey(p: InsightsParams): string {
  return JSON.stringify({
    keywords: [...(p.keywords ?? [])].map((k) => k.trim()).filter(Boolean).sort(),
    excludedKeywords: [...(p.excludedKeywords ?? [])]
      .map((k) => k.trim())
      .filter(Boolean)
      .sort(),
    minPrice: p.minPrice ?? null,
    maxPrice: p.maxPrice ?? null,
    conditions: [...(p.conditions ?? [])].sort(),
    sellers: [...(p.sellers ?? [])].map((s) => s.trim()).filter(Boolean).sort(),
  });
}

/**
 * Debounces a params key so live insights calls fire only after the user stops
 * editing. Returns the debounced key plus the params reconstructed from it, so
 * fetches always use exactly the debounced snapshot (not a mid-typing value).
 */
export function useDebouncedParams(params: InsightsParams, delayMs = 600) {
  const key = paramsKey(params);
  const debouncedKey = useDebouncedValue(key, delayMs);

  const debouncedParams = useMemo(
    () => JSON.parse(debouncedKey) as InsightsParams,
    [debouncedKey]
  );

  const hasKeywords = debouncedParams.keywords.length > 0;

  return { debouncedKey, debouncedParams, hasKeywords };
}
