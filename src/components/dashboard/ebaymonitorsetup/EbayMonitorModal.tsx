"use client";

import { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Divider,
  Tabs,
  Tab,
} from "@heroui/react";
import { addToast } from "@heroui/toast";
import PriceRangeSlider from "./PriceRangeSlider";
import ChipInput from "./ChipInput";
import ConditionCheckboxGroup from "./ConditionCheckboxGroup";
import MonitorIntervalSlider from "./MonitorIntervalSlider";
import CalibrationStrip from "./insights/CalibrationStrip";
import MarketInsightsPanel from "./insights/MarketInsightsPanel";
import { useMonitors } from "@/contexts/MonitorContext";
import { useSession } from "@/lib/auth-client";
import type { InsightsParams, SuggestedPriceRange } from "@/types/insights";

interface EbayMonitorModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  isDemo?: boolean;
  initialKeywords?: string[];
  initialExcludedKeywords?: string[];
  initialCondition?: string[];
  initialSellers?: string[];
  minPrice?: number;
  maxPrice?: number;
  initialMonitorInterval?: number;
}

interface MonitorData {
  keywords: string[];
  excludedKeywords?: string[];
  condition?: string[];
  sellers?: string[];
  minPrice?: number;
  maxPrice?: number;
  monitorInterval?: number;
}

function BaseEbayMonitorModal({
  isOpen,
  onOpenChange,
  isDemo = false,
  initialKeywords = [],
  initialExcludedKeywords = [],
  initialCondition = [],
  initialSellers = [],
  minPrice,
  maxPrice,
  initialMonitorInterval,
  onSave,
  isSubmitting = false,
}: EbayMonitorModalProps & {
  onSave?: (data: MonitorData) => void;
  isSubmitting?: boolean;
}) {
  const [keywords, setKeywords] = useState<string[]>(initialKeywords);
  const [excludedKeywords, setExcludedKeywords] = useState<string[]>(
    initialExcludedKeywords
  );
  const [condition, setCondition] = useState<string[]>(initialCondition);
  const [sellers, setSellers] = useState<string[]>(initialSellers);
  const [priceRange, setPriceRange] = useState<
    [number | undefined, number | undefined]
  >([minPrice, maxPrice]);
  const [monitorInterval, setMonitorInterval] = useState<number>(
    initialMonitorInterval || 7200000 // Default to 2 hours
  );
  const [loading, setLoading] = useState(false);
  const [keywordError, setKeywordError] = useState<string>("");
  const [duplicateError, setDuplicateError] = useState<string>("");
  const [modalSize, setModalSize] = useState<"lg" | "xl" | "full">("lg");

  const { data: session } = useSession();
  // Insights require an authenticated user; demo mode has no session and shows
  // a "sign in to preview" placeholder instead of calling the endpoints.
  const userId = isDemo ? undefined : session?.user?.id;

  const isLoading = loading || isSubmitting;

  // Params sent to the insights endpoints, derived from the live form state.
  // Mirrors the monitor search-param shape; conditions/sellers passed as-is.
  const insightsParams: InsightsParams = {
    keywords,
    excludedKeywords,
    minPrice: priceRange[0],
    maxPrice: priceRange[1],
    conditions: condition,
    sellers,
  };

  /**
   * Apply a suggested excluded keyword (one-tap recalibration). Dedupes and
   * skips terms that collide with an active keyword (the modal's existing
   * duplicate rule). Shows a confirmation toast with an Undo action.
   */
  const applyExcludedKeyword = (term: string) => {
    const normalized = term.trim();
    if (!normalized) return;
    if (excludedKeywords.includes(normalized)) return;
    if (keywords.includes(normalized)) {
      addToast({
        title: "Already a keyword",
        description: `"${normalized}" is one of your search keywords, so it can't be excluded.`,
        color: "warning",
      });
      return;
    }

    const previous = excludedKeywords;
    setExcludedKeywords([...excludedKeywords, normalized]);
    addToast({
      title: "Filter updated",
      description: `Excluding "${normalized}" from this monitor.`,
      color: "success",
      endContent: (
        <Button
          size="sm"
          variant="flat"
          onPress={() => setExcludedKeywords(previous)}
        >
          Undo
        </Button>
      ),
    });
  };

  /** Apply a suggested tightened price range, with an Undo action. */
  const applyPriceRange = ({ minPrice, maxPrice }: SuggestedPriceRange) => {
    const previous = priceRange;
    setPriceRange([minPrice, maxPrice]);
    addToast({
      title: "Price range tightened",
      description: `Set to $${minPrice}–$${maxPrice}.`,
      color: "success",
      endContent: (
        <Button size="sm" variant="flat" onPress={() => setPriceRange(previous)}>
          Undo
        </Button>
      ),
    });
  };

  useEffect(() => {
    const updateModalSize = () => {
      if (window.innerWidth < 768) {
        setModalSize("full");
      } else if (window.innerWidth < 1024) {
        setModalSize("lg");
      } else {
        setModalSize("xl");
      }
    };

    updateModalSize();
    window.addEventListener("resize", updateModalSize);

    return () => window.removeEventListener("resize", updateModalSize);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    setKeywords(initialKeywords);
    setExcludedKeywords(initialExcludedKeywords);
    setCondition(initialCondition);
    setSellers(initialSellers);
    setPriceRange([minPrice, maxPrice]);
    setMonitorInterval(initialMonitorInterval || 7200000);
    setKeywordError("");
    setDuplicateError("");
  }, [
    isOpen,
    initialKeywords,
    initialExcludedKeywords,
    initialCondition,
    initialSellers,
    minPrice,
    maxPrice,
    initialMonitorInterval,
  ]);

  const validateMonitor = (): boolean => {
    let isValid = true;

    if (keywords.length === 0) {
      setKeywordError("At least one keyword is required");
      isValid = false;
    } else {
      setKeywordError("");
    }

    const duplicates = keywords.filter((keyword) =>
      excludedKeywords.includes(keyword)
    );

    if (duplicates.length > 0) {
      setDuplicateError(
        `Cannot have same keywords in both lists: ${duplicates.join(", ")}`
      );
      isValid = false;
    } else {
      setDuplicateError("");
    }

    return isValid;
  };

  const handleSaveMonitor = () => {
    if (!validateMonitor()) return;

    setLoading(true);
    const monitorData = {
      keywords,
      excludedKeywords,
      condition,
      sellers,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      monitorInterval,
    };

    if (isDemo) {
      setTimeout(() => {
        setLoading(false);
        alert("This is a demo. Sign up to save your monitor!");
        onOpenChange();
      }, 1000);
    } else if (onSave) {
      onSave(monitorData);
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement="center"
      radius="lg"
      size={modalSize}
      shouldBlockScroll={false}
      classNames={{
        wrapper: "items-start h-auto",
        body: "py-6 overflow-hidden",
        base: "border-none bg-gray-50/80 dark:bg-neutral-900/90 text-white shadow-xl backdrop-blur-lg overflow-hidden my-auto",
        header: "border-b border-zinc-300 dark:border-zinc-700",
        footer: "border-t border-zinc-300 dark:border-zinc-700",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <h4 className="text-medium font-semibold text-default-700">
                {isDemo ? "Demo: eBay Monitor Setup" : "eBay Monitor Setup"}
              </h4>
              <p className="text-small text-default-400">
                Customize your monitor so we know when to send you the perfect
                match.
              </p>
            </ModalHeader>

            <ModalBody className="pt-3">
              <Tabs aria-label="Monitor setup tabs" variant="underlined">
                <Tab key="filters" title="Filters">
                  <div className="flex flex-col gap-4">
                    <CalibrationStrip
                      params={insightsParams}
                      userId={userId}
                      onApplyExcludedKeyword={applyExcludedKeyword}
                      onApplyPriceRange={applyPriceRange}
                    />
                    <ChipInput
                      label="Keywords"
                      values={keywords}
                      setValues={setKeywords}
                      error={keywordError}
                      chipColor="success"
                    />
                    <Divider />
                    <ChipInput
                      label="Excluded Keywords"
                      values={excludedKeywords}
                      setValues={setExcludedKeywords}
                      error={duplicateError}
                      chipColor="danger"
                    />
                    <Divider />

                    <PriceRangeSlider
                      value={priceRange}
                      onChange={setPriceRange}
                    />
                    <Divider />
                    <ConditionCheckboxGroup
                      condition={condition}
                      setCondition={setCondition}
                    />
                    <Divider />
                    <ChipInput
                      label="Seller(s)"
                      values={sellers}
                      setValues={setSellers}
                      chipColor="primary"
                    />
                    <Divider />
                    <MonitorIntervalSlider
                      value={monitorInterval}
                      onChange={setMonitorInterval}
                    />
                  </div>
                </Tab>
                <Tab key="insights" title="Market Insights">
                  <MarketInsightsPanel
                    params={insightsParams}
                    userId={userId}
                    onApplyExcludedKeyword={applyExcludedKeyword}
                    onApplyPriceRange={applyPriceRange}
                  />
                </Tab>
              </Tabs>
            </ModalBody>

            <ModalFooter>
              <Button variant="light" onPress={onClose} isDisabled={isLoading}>
                Cancel
              </Button>
              <Button
                color="success"
                variant="flat"
                isLoading={isLoading}
                isDisabled={isLoading}
                onPress={handleSaveMonitor}
              >
                {isDemo ? "Save Monitor (Demo)" : "Save Monitor"}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

function MonitorModalWithContext(props: EbayMonitorModalProps) {
  const monitorContext = useMonitors();
  const [submitting, setSubmitting] = useState(false);

  const handleSave = async (data: MonitorData) => {
    setSubmitting(true);

    try {
      if (monitorContext.editingMonitor) {
        await monitorContext.updateMonitor(
          monitorContext.editingMonitor.id,
          data
        );
      } else {
        await monitorContext.addMonitor(data);
      }
      setTimeout(() => {
        props.onOpenChange();
      }, 0);
    } catch (err) {
      // Error toast is already shown in the context
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <BaseEbayMonitorModal
      {...props}
      onSave={handleSave}
      isSubmitting={submitting}
    />
  );
}

// Wrapper component that handles the context
export default function EbayMonitorModal(props: EbayMonitorModalProps) {
  if (props.isDemo) {
    return <BaseEbayMonitorModal {...props} />;
  }
  return <MonitorModalWithContext {...props} />;
}
