import type {
  InsightsParams,
  MarketSnapshot,
  OutlierResult,
  CalibrationSummary,
} from "@/types/insights";

/** Thrown when the backend signals it is at/near the eBay quota cap (HTTP 429). */
export class RateLimitError extends Error {
  readonly isRateLimit = true;
  constructor(message = "Market preview temporarily unavailable (rate limited)") {
    super(message);
    this.name = "RateLimitError";
  }
}

export function isRateLimitError(err: unknown): err is RateLimitError {
  return err instanceof RateLimitError || (err as RateLimitError)?.isRateLimit === true;
}

/**
 * Client for the Active Market Insights endpoints. Mirrors `monitorService`:
 * each method takes `(params, userId)` and fetches the Next.js proxy route with
 * the `user-id` header. Backend response contracts are the source of truth —
 * these methods return the payloads verbatim without recomputing stats.
 */
class InsightsService {
  private base = "/api/insights";

  private async post<T>(
    endpoint: "market" | "outliers" | "calibrate",
    params: InsightsParams,
    userId: string
  ): Promise<T> {
    const response = await fetch(`${this.base}/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "user-id": userId,
      },
      body: JSON.stringify(params),
    });

    if (response.status === 429) {
      throw new RateLimitError();
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || errorData.message || `Failed to load ${endpoint} insights`
      );
    }

    return response.json() as Promise<T>;
  }

  market(params: InsightsParams, userId: string): Promise<MarketSnapshot> {
    return this.post<MarketSnapshot>("market", params, userId);
  }

  outliers(params: InsightsParams, userId: string): Promise<OutlierResult> {
    return this.post<OutlierResult>("outliers", params, userId);
  }

  calibrate(params: InsightsParams, userId: string): Promise<CalibrationSummary> {
    return this.post<CalibrationSummary>("calibrate", params, userId);
  }
}

const insightsService = new InsightsService();
export default insightsService;
