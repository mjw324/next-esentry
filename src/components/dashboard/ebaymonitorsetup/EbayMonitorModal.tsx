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
} from "@nextui-org/react";
import PriceRangeSlider from "./PriceRangeSlider";
import KeywordsInput from "./KeywordsInput";
import ExcludedKeywordsInput from "./ExcludedKeywordsInput";
import ConditionCheckboxGroup from "./ConditionCheckboxGroup";
import SellerInput from "./SellerInput";
import { useMonitors } from "@/contexts/MonitorContext";

interface EbayMonitorModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  isDemo?: boolean;
  initialKeywords?: string[];
  initialExcludedKeywords?: string[];
  initialCondition?: string[];
  initialSeller?: string;
  minPrice?: number;
  maxPrice?: number;
}

interface MonitorData {
  keywords: string[];
  excludedKeywords: string[];
  condition: string[];
  seller: string;
  minPrice?: number;
  maxPrice?: number;
}

// Base Modal Component without context dependency
function BaseEbayMonitorModal({
  isOpen,
  onOpenChange,
  isDemo = false,
  initialKeywords = [],
  initialExcludedKeywords = [],
  initialCondition = [],
  initialSeller = "",
  minPrice,
  maxPrice,
  onSave,
}: EbayMonitorModalProps & { onSave?: (data: MonitorData) => void }) {
  const [keywords, setKeywords] = useState<string[]>(initialKeywords);
  const [excludedKeywords, setExcludedKeywords] = useState<string[]>(
    initialExcludedKeywords
  );
  const [condition, setCondition] = useState<string[]>(initialCondition);
  const [seller, setSeller] = useState(initialSeller);
  const [priceRange, setPriceRange] = useState<
    [number | undefined, number | undefined]
  >([minPrice, maxPrice]);
  const [loading, setLoading] = useState(false);
  const [keywordError, setKeywordError] = useState<string>("");
  const [duplicateError, setDuplicateError] = useState<string>("");

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
    if (!validateMonitor()) {
      return;
    }

    setLoading(true);
    const monitorData = {
      keywords,
      excludedKeywords,
      condition,
      seller,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
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
      onOpenChange();
    }
  };

  useEffect(() => {
    if (isOpen) {
      setKeywords(initialKeywords);
      setExcludedKeywords(initialExcludedKeywords);
      setCondition(initialCondition);
      setSeller(initialSeller);
      setPriceRange([minPrice, maxPrice]);
      setKeywordError("");
      setDuplicateError("");
    }
  }, [
    isOpen,
    initialKeywords,
    initialExcludedKeywords,
    initialCondition,
    initialSeller,
    minPrice,
    maxPrice,
  ]);

  return (
    <Modal
      backdrop="blur"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      radius="lg"
      classNames={{
        body: "py-6 overflow-hidden",
        base: "border-none bg-white/90 dark:bg-gray-900/90 text-white shadow-xl backdrop-blur-lg",
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

            <ModalBody>
              <Spacer y={1} />
              <KeywordsInput
                keywords={keywords}
                setKeywords={setKeywords}
                error={keywordError}
              />

              <Divider />

              <Spacer y={1} />
              <ExcludedKeywordsInput
                excludedKeywords={excludedKeywords}
                setExcludedKeywords={setExcludedKeywords}
                error={duplicateError}
              />

              <Divider />

              <Spacer y={4} />
              <PriceRangeSlider value={priceRange} onChange={setPriceRange} />

              <Divider />

              <Spacer y={1} />
              <ConditionCheckboxGroup
                condition={condition}
                setCondition={setCondition}
              />

              <Divider />

              <Spacer y={1} />
              <SellerInput seller={seller} setSeller={setSeller} />
            </ModalBody>

            <ModalFooter>
              <Button variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button
                color="success"
                variant="flat"
                isLoading={loading}
                onPress={handleSaveMonitor}
                disabled={loading}
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

// Component that uses the monitor context
function MonitorModalWithContext(props: EbayMonitorModalProps) {
  const monitorContext = useMonitors();

  const handleSave = (data: MonitorData) => {
    if (monitorContext.editingMonitor) {
      monitorContext.updateMonitor(monitorContext.editingMonitor.id, data);
    } else {
      monitorContext.addMonitor(data);
    }
    monitorContext.setEditingMonitor(null);
  };

  return <BaseEbayMonitorModal {...props} onSave={handleSave} />;
}

// Wrapper component that handles the context
export default function EbayMonitorModal(props: EbayMonitorModalProps) {
  if (props.isDemo) {
    return <BaseEbayMonitorModal {...props} />;
  }
  return <MonitorModalWithContext {...props} />;
}
