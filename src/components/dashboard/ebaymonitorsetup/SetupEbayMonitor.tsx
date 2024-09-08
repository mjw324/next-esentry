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
import PriceRangeSlider from "@/components/dashboard/ebaymonitorsetup/PriceRangeSlider";
import KeywordsInput from "@/components/dashboard/ebaymonitorsetup/KeywordsInput";
import ExcludedKeywordsInput from "@/components/dashboard/ebaymonitorsetup/ExcludedKeywordsInput";
import ConditionCheckboxGroup from "@/components/dashboard/ebaymonitorsetup/ConditionCheckboxGroup";
import SellerInput from "@/components/dashboard/ebaymonitorsetup/SellerInput";
import { useDisclosure } from "@nextui-org/react";

export default function SetupEbayMonitor() {
  const [keywords, setKeywords] = useState<string[]>([]);
  const [excludedKeywords, setExcludedKeywords] = useState<string[]>([]);
  const [condition, setCondition] = useState<string[]>([]);
  const [seller, setSeller] = useState("");
  const [loading, setLoading] = useState(false); // Loading state for save button

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
      onOpenChange(false); // Close modal after saving
    }, 1000); // Simulating a 1-second delay
  };

  return (
    <>
      {/* Button to trigger modal */}
      <Button
        onPress={onOpen}
        className="px-4 py-4 text-sm font-semibold text-center text-white bg-emerald-600 rounded-md"
      >
        Set up eBay Monitor
      </Button>

      {/* Modal setup with glassmorphism effect */}
      <Modal
        backdrop="blur" // Glassmorphism backdrop effect
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        radius="lg"
        classNames={{
          body: "py-6 overflow-hidden", // Ensures body content doesn't overflow horizontally
          backdrop: "bg-white/20 backdrop-blur-md", // Glass-like effect with blurred background
          base: "border-none bg-white/30 dark:bg-gray-900/30 text-white shadow-xl backdrop-blur-lg", // Glassmorphism effect
          header: "border-b border-gray-300 dark:border-gray-700",
          footer: "border-t border-gray-300 dark:border-gray-700",
          closeButton: "hover:bg-white/5 active:bg-white/10",
        }}
        css={{
          maxWidth: "100%", // Ensures modal doesn't exceed viewport width
          width: "700px",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              {/* Modal Header */}
              <ModalHeader className="flex flex-col gap-1">
                <h4 className="text-medium font-medium">eBay Monitor Setup</h4>
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
                <Button color="foreground" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="success"
                  variant="flat"
                  isLoading={loading} // Use the isLoading prop to control the loading state
                  onPress={handleSaveMonitor}
                  disabled={loading} // Disable the button while loading
                  spinner={
                    <svg
                      className="animate-spin h-5 w-5 text-current"
                      fill="none"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        fill="currentColor"
                      />
                    </svg>
                  }
                >
                  Save Monitor
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
