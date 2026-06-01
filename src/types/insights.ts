/**
 * Frontend mirror of the backend Active Market Insights contracts.
 * Source of truth: next-esentry-nodejs/docs/INSIGHTS.md
 *
 * Backend response contracts are authoritative — the frontend renders these
 * values and never recomputes stats client-side.
 */

/** Shared request body — same shape as a monitor's search params. */
export interface InsightsParams {
  keywords: string[];
  excludedKeywords?: string[];
  minPrice?: number;
  maxPrice?: number;
  conditions?: string[];
  sellers?: string[];
}

/** Sample-based price statistics (computed over the fetched sample, not full population). */
export interface PriceStats {
  min: number;
  max: number;
  mean: number;
  median: number;
  q1: number;
  q3: number;
  iqr: number;
  sampleSize: number;
  currency: string;
}

export interface ConditionBreakdown {
  condition: string;
  conditionId: string;
  matchCount: number;
}

export interface BuyingOptionSplit {
  buyingOption: string;
  matchCount: number;
}

export interface AspectValue {
  value: string;
  matchCount: number;
}

export interface AspectSummary {
  name: string;
  values: AspectValue[];
}

/** `POST /api/insights/market` */
export interface MarketSnapshot {
  totalActive: number;
  priceStats: PriceStats;
  conditionDistribution: ConditionBreakdown[];
  buyingOptions: BuyingOptionSplit[];
  topAspects: AspectSummary[];
  sampleBased: boolean;
  sampleSize: number;
}

export type OutlierMethod = "mad" | "tukey" | "token";
export type OutlierTail = "low" | "high";

export interface OutlierListing {
  itemId: string;
  title: string;
  price: number;
  /** |price − sample median|, in currency units. */
  metric: number;
  method: OutlierMethod;
  tail: OutlierTail;
  matchedTokens: string[];
}

/** A candidate noise term, over-represented in a price tail. */
export interface NoiseTerm {
  term: string;
  inOutliers: number;
  inOverall: number;
  /** How many sampled listings the term would remove. */
  count: number;
}

export interface SuggestedPriceRange {
  minPrice: number;
  maxPrice: number;
}

export interface SuggestedRefinements {
  suggestedExcludedKeywords: NoiseTerm[];
  suggestedPriceRange: SuggestedPriceRange | null;
}

/** `POST /api/insights/outliers` */
export interface OutlierResult {
  outlierListings: OutlierListing[];
  suggestedRefinements: SuggestedRefinements;
  sampleSize: number;
}

/** `POST /api/insights/calibrate` — compact summary for live use on the form. */
export interface CalibrationSummary {
  totalActive: number;
  sampleSize: number;
  /** Where the user's maxPrice sits among current listings (0–100), or null if no maxPrice set. */
  maxPricePercentile: number | null;
  /** Fraction (0–1) of sampled matches that look like noise. */
  noiseFraction: number;
  topSuggestedExcludedKeywords: NoiseTerm[];
  suggestedPriceRange: SuggestedPriceRange | null;
}
