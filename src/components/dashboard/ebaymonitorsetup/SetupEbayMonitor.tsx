"use client";

import { Button } from "@heroui/react";
import { useDisclosure } from "@heroui/react";
import EbayMonitorModal from "./EbayMonitorModal";

interface SetupEbayMonitorProps {
  isDemo?: boolean;
  initialKeywords?: string[];
  initialExcludedKeywords?: string[];
  initialCondition?: string[];
  initialSellers?: string[];
  initialMinPrice?: number;
  initialMaxPrice?: number;
}

export default function SetupEbayMonitor({
  isDemo = false,
  initialKeywords = [],
  initialExcludedKeywords = [],
  initialCondition = [],
  initialSellers = [],
  initialMinPrice = 0,
  initialMaxPrice = 0,
}: SetupEbayMonitorProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button
        onPress={onOpen}
        className="px-4 py-4 text-sm font-semibold text-center text-white bg-success rounded-md"
      >
        {isDemo ? "Try Setting Up This Monitor" : "Set up eBay Monitor"}
      </Button>

      <EbayMonitorModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isDemo={isDemo}
        initialKeywords={initialKeywords}
        initialExcludedKeywords={initialExcludedKeywords}
        initialCondition={initialCondition}
        initialSellers={initialSellers}
        minPrice={initialMinPrice}
        maxPrice={initialMaxPrice}
      />
    </>
  );
}
