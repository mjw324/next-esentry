"use client";

import { Button } from "@nextui-org/react";
import { useDisclosure } from "@nextui-org/react";
import EbayMonitorModal from "./EbayMonitorModal";

interface SetupEbayMonitorProps {
  isDemo?: boolean;
  initialKeywords?: string[];
  initialExcludedKeywords?: string[];
  initialCondition?: string[];
  initialSeller?: string;
  initialMinPrice?: number;
  initialMaxPrice?: number;
}

export default function SetupEbayMonitor({
  isDemo = false,
  initialKeywords = [],
  initialExcludedKeywords = [],
  initialCondition = [],
  initialSeller = "",
  initialMinPrice = 0,
  initialMaxPrice = 0,
}: SetupEbayMonitorProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button
        onPress={onOpen}
        className="px-4 py-4 text-sm font-semibold text-center text-white bg-emerald-600 rounded-md"
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
        initialSeller={initialSeller}
        minPrice={initialMinPrice}
        maxPrice={initialMaxPrice}
      />
    </>
  );
}
