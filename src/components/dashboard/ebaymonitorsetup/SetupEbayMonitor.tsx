// dashboard/ebaymonitorsetup/SetupEbayMonitor.tsx
"use client";

import { useState } from "react";
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
import { useDisclosure } from "@nextui-org/react";

interface SetupEbayMonitorProps {
  isDemo?: boolean;
  initialKeywords?: string[];
  initialExcludedKeywords?: string[];
  initialCondition?: string[];
  initialSeller?: string;
}

export default function SetupEbayMonitor({
  isDemo = false,
  initialKeywords = [],
  initialExcludedKeywords = [],
  initialCondition = [],
  initialSeller = "",
}: SetupEbayMonitorProps) {
  const [keywords, setKeywords] = useState<string[]>(initialKeywords);
  const [excludedKeywords, setExcludedKeywords] = useState<string[]>(
    initialExcludedKeywords
  );
  const [condition, setCondition] = useState<string[]>(initialCondition);
  const [seller, setSeller] = useState(initialSeller);
  const [loading, setLoading] = useState(false);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleSaveMonitor = () => {
    setLoading(true);
    // Simulate a delay for mock API call
    setTimeout(() => {
      setLoading(false);
      console.log("eBay Monitor set up with settings:");
      console.log({
        keywords,
        excludedKeywords,
        condition,
        seller,
      });
      if (isDemo) {
        // Show a message or do something specific in demo mode
        alert("This is a demo. Sign up to save your monitor!");
      } else {
        // Normal operation in the dashboard
        // TODO: Implement actual save logic here
      }
      onOpenChange(); // Close modal after saving
    }, 1000); // Simulating a 1-second delay
  };

  return (
    <>
      {/* Button to trigger modal */}
      <Button
        onPress={onOpen}
        className="px-4 py-4 text-sm font-semibold text-center text-white bg-emerald-600 rounded-md"
      >
        {isDemo ? "Try Setting Up a Monitor" : "Set up eBay Monitor"}
      </Button>

      {/* Modal setup with glassmorphism effect */}
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
              {/* Modal Header */}
              <ModalHeader className="flex flex-col gap-1">
                <h4 className="text-medium font-semibold text-default-700">
                  {isDemo ? "Demo: eBay Monitor Setup" : "eBay Monitor Setup"}
                </h4>
                <p className="text-small text-default-400">
                  Customize your monitor so we know when to send you the perfect
                  match.
                </p>
              </ModalHeader>

              {/* Modal Body */}
              <ModalBody>
                {/* Keywords Input */}
                <Spacer y={1} />
                <KeywordsInput keywords={keywords} setKeywords={setKeywords} />

                <Divider />

                {/* Excluded Keywords Input */}
                <Spacer y={1} />
                <ExcludedKeywordsInput
                  excludedKeywords={excludedKeywords}
                  setExcludedKeywords={setExcludedKeywords}
                />

                <Divider />

                {/* Price Range Slider */}
                <Spacer y={4} />
                <PriceRangeSlider />

                <Divider />

                {/* Condition Checkbox Group */}
                <Spacer y={1} />
                <ConditionCheckboxGroup
                  condition={condition}
                  setCondition={setCondition}
                />

                <Divider />

                {/* Seller Input */}
                <Spacer y={1} />
                <SellerInput seller={seller} setSeller={setSeller} />
              </ModalBody>

              {/* Modal Footer */}
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
    </>
  );
}
