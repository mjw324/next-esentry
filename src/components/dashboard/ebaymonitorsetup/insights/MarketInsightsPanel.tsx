"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardBody, CardHeader, Button, Skeleton, Divider } from "@heroui/react";
import { RefreshCw } from "lucide-react";
import insightsService, { isRateLimitError } from "@/services/insightsService";
import type {
  InsightsParams,
  MarketSnapshot,
  OutlierResult,
  SuggestedPriceRange,
} from "@/types/insights";
import { useDebouncedParams } from "./useDebouncedParams";
import PriceBoxPlot from "./charts/PriceBoxPlot";
import ConditionDonut from "./charts/ConditionDonut";
import BuyingOptionSplit from "./charts/BuyingOptionSplit";
import TopBrandsBar from "./charts/TopBrandsBar";
import OutlierPanel from "./OutlierPanel";

interface MarketInsightsPanelProps {
  params: InsightsParams;
  userId?: string;
  onApplyExcludedKeyword: (term: string) => void;
  onApplyPriceRange: (range: SuggestedPriceRange) => void;
}

function findBrandAspect(snapshot: MarketSnapshot) {
  const brand = snapshot.topAspects.find(
    (a) => a.name.toLowerCase() === "brand"
  );
  return (brand ?? snapshot.topAspects[0])?.values ?? [];
}

export default function MarketInsightsPanel({
  params,
  userId,
  onApplyExcludedKeyword,
  onApplyPriceRange,
}: MarketInsightsPanelProps) {
  const { debouncedKey, debouncedParams, hasKeywords } =
    useDebouncedParams(params);

  const [snapshot, setSnapshot] = useState<MarketSnapshot | null>(null);
  const [outliers, setOutliers] = useState<OutlierResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [rateLimited, setRateLimited] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshNonce, setRefreshNonce] = useState(0);

  const requestId = useRef(0);

  useEffect(() => {
    if (!userId || !hasKeywords) {
      setSnapshot(null);
      setOutliers(null);
      setError(null);
      setRateLimited(false);
      return;
    }

    const id = ++requestId.current;
    setLoading(true);
    setError(null);
    setRateLimited(false);

    Promise.all([
      insightsService.market(debouncedParams, userId),
      insightsService.outliers(debouncedParams, userId),
    ])
      .then(([market, outlierResult]) => {
        if (id !== requestId.current) return;
        setSnapshot(market);
        setOutliers(outlierResult);
      })
      .catch((err) => {
        if (id !== requestId.current) return;
        setSnapshot(null);
        setOutliers(null);
        if (isRateLimitError(err)) setRateLimited(true);
        else setError(err instanceof Error ? err.message : "Failed to load insights");
      })
      .finally(() => {
        if (id === requestId.current) setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedKey, userId, hasKeywords, refreshNonce]);

  if (!userId) {
    return (
      <div className="flex h-40 items-center justify-center rounded-medium border border-dashed border-default-200 bg-content2/50 text-center text-small text-default-500">
        Sign in to preview the live eBay market for these filters.
      </div>
    );
  }

  if (!hasKeywords) {
    return (
      <div className="flex h-40 items-center justify-center rounded-medium border border-dashed border-default-200 bg-content2/50 text-center text-small text-default-500">
        Add a keyword on the Filters tab to preview the market.
      </div>
    );
  }

  const currency = snapshot?.priceStats.currency ?? "USD";
  const distributionsEmpty =
    !!snapshot &&
    snapshot.conditionDistribution.length === 0 &&
    snapshot.buyingOptions.length === 0 &&
    snapshot.topAspects.length === 0;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h5 className="text-small font-semibold text-default-700">
          Current eBay market
        </h5>
        <Button
          size="sm"
          variant="light"
          isLoading={loading}
          startContent={!loading && <RefreshCw className="h-3.5 w-3.5" />}
          onPress={() => setRefreshNonce((n) => n + 1)}
        >
          Refresh
        </Button>
      </div>

      {rateLimited && (
        <div className="rounded-medium border border-warning-200 bg-warning-50/50 px-3 py-2 text-tiny text-warning-700">
          Market preview temporarily unavailable (rate limited). Try again
          shortly.
        </div>
      )}

      {error && !rateLimited && (
        <div className="rounded-medium border border-default-200 bg-content2/50 px-3 py-2 text-tiny text-default-500">
          {error}
        </div>
      )}

      {loading && !snapshot && <LoadingSkeleton />}

      {snapshot && (
        <>
          <Card shadow="none" className="border border-default-200 bg-content1">
            <CardHeader className="flex items-baseline justify-between pb-0">
              <div>
                <p className="text-tiny uppercase tracking-wide text-default-400">
                  Active listings
                </p>
                <p className="text-2xl font-semibold text-default-800">
                  {snapshot.totalActive.toLocaleString()}
                </p>
              </div>
              {snapshot.sampleBased && (
                <span className="text-tiny text-default-400">
                  price stats sample-based (n&nbsp;=&nbsp;{snapshot.sampleSize})
                </span>
              )}
            </CardHeader>
            <CardBody className="gap-5">
              {/* Price box/quartile plot */}
              <div>
                <p className="mb-2 text-tiny font-medium uppercase tracking-wide text-default-500">
                  Price spread
                </p>
                <PriceBoxPlot stats={snapshot.priceStats} />
              </div>

              <Divider />

              {distributionsEmpty && (
                <p className="text-tiny text-default-400">
                  No distribution data for this query (eBay Sandbox returns
                  sparse data — try production credentials).
                </p>
              )}

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <p className="mb-1 text-tiny font-medium uppercase tracking-wide text-default-500">
                    Condition
                  </p>
                  <ConditionDonut data={snapshot.conditionDistribution} />
                </div>
                <div className="flex flex-col gap-4">
                  <div>
                    <p className="mb-2 text-tiny font-medium uppercase tracking-wide text-default-500">
                      Buying options
                    </p>
                    <BuyingOptionSplit data={snapshot.buyingOptions} />
                  </div>
                  <div>
                    <p className="mb-1 text-tiny font-medium uppercase tracking-wide text-default-500">
                      Top brands
                    </p>
                    <TopBrandsBar values={findBrandAspect(snapshot)} />
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          {outliers && (
            <Card shadow="none" className="border border-default-200 bg-content1">
              <CardHeader className="pb-0">
                <h5 className="text-small font-semibold text-default-700">
                  Outliers &amp; recalibration
                </h5>
              </CardHeader>
              <CardBody>
                <OutlierPanel
                  result={outliers}
                  currency={currency}
                  onApplyExcludedKeyword={onApplyExcludedKeyword}
                  onApplyPriceRange={onApplyPriceRange}
                />
              </CardBody>
            </Card>
          )}
        </>
      )}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <Card shadow="none" className="border border-default-200 bg-content1">
        <CardBody className="gap-4">
          <Skeleton className="h-8 w-32 rounded-medium" />
          <Skeleton className="h-16 w-full rounded-medium" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Skeleton className="h-44 w-full rounded-medium" />
            <Skeleton className="h-44 w-full rounded-medium" />
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
