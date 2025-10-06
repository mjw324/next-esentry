"use client";

import { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Spacer,
  Divider,
  Slider,
} from "@heroui/react";
import type { SliderValue } from "@heroui/react";
import PriceRangeSlider from "./PriceRangeSlider";
import ChipInput from "./ChipInput";
import ConditionCheckboxGroup from "./ConditionCheckboxGroup";
import { useMonitors } from "@/contexts/MonitorContext";

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

  // Helper function to format milliseconds to HH:MM:SS
  const formatMillisecondsToHHMMSS = (milliseconds: number) => {
    if (isNaN(milliseconds) || milliseconds < 0) {
      return "00:00:00"; // Default for invalid input
    }

    let totalSeconds = Math.floor(milliseconds / 1000);
    let hours = Math.floor(totalSeconds / 3600);

    totalSeconds %= 3600;
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = totalSeconds % 60;

    const pad = (num: number) => String(num).padStart(2, "0");

    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  };

  const isLoading = loading || isSubmitting;

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

              <PriceRangeSlider value={priceRange} onChange={setPriceRange} />
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
              <Slider
                hideValue
                showTooltip
                value={monitorInterval}
                onChange={(value: SliderValue) => setMonitorInterval(value as number)}
                getTooltipValue={(value: SliderValue) => formatMillisecondsToHHMMSS(value as number)}
                label="Monitor Interval (hh:mm:ss)"
                minValue={300000} // 5 minutes in milliseconds
                maxValue={86400000} // 24 hours in milliseconds
                step={300000} // 5-minute steps
                className="w-full"
              />
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
