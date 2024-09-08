"use client";

import { useEffect, useState } from "react";
import React from "react";
import { Slider, Tooltip, Input } from "@nextui-org/react";
import InfoIcon from "@/svg_components/InfoIcon";
import cn from "@/utils/cn";

export default function PriceRangeSlider() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Mark the component as mounted after hydration
    setMounted(true);
  }, []);

  // State for the price range and max value
  const [priceRange, setPriceRange] = useState([0, 0]);
  const [maxValue, setMaxValue] = useState(500);

  // Function to handle manual input for min and max prices
  const handlePriceInputChange = (index: number, value: string) => {
    let newValue = Number(value);
    let updatedPriceRange = [...priceRange];

    // If input is for min (index === 0), ensure it's not greater than the max
    if (index === 0) {
      if (newValue > priceRange[1]) {
        newValue = priceRange[1]; // Prevent min from being greater than max
      }
      updatedPriceRange[0] = newValue;
    }

    // If input is for max (index === 1), ensure it's not smaller than the min
    if (index === 1) {
      if (newValue < priceRange[0]) {
        newValue = priceRange[0]; // Prevent max from being less than min
      }
      updatedPriceRange[1] = newValue;

      // If the new max value exceeds 500, update maxValue
      if (newValue > 500) {
        setMaxValue(newValue);
      } else if (newValue <= 500) {
        // If max goes back below 500, reset maxValue to 500 unless the min value is above 500
        setMaxValue(Math.max(500, priceRange[0]));
      }
    }

    // Update price range with the new values
    setPriceRange(updatedPriceRange);
  };

  // Return null on the server to prevent any rendering during SSR
  if (!mounted) {
    return null;
  }

  return (
    <>
      <Slider
        label="Price Range"
        minValue={0}
        maxValue={maxValue} // Dynamically set max value
        step={1}
        value={priceRange}
        defaultValue={[0, 0]}
        onChange={(value) => setPriceRange(value)}
        formatOptions={{ style: "currency", currency: "USD" }}
        classNames={{
          base: "gap-3",
          filler:
            "bg-gradient-to-r from-slate-300 to-emerald-300 dark:from-slate-600 dark:to-emerald-800",
        }}
        renderLabel={({ children, ...props }) => (
          <label {...props} className="text-medium flex gap-2 items-center">
            {children}
            <Tooltip
              className="w-[230px] px-1.5 text-tiny text-default-600 rounded-small"
              content={
                <div className="text-left">
                  <p>The price range your monitor will search for.</p>
                  <p>Leave both min and max at 0 for any.</p>
                </div>
              }
              placement="right"
            >
              <span className="transition-opacity opacity-80 hover:opacity-100">
                <InfoIcon />
              </span>
            </Tooltip>
          </label>
        )}
        renderThumb={({ index, ...props }) => (
          <div
            {...props}
            className="group p-1 top-1/2 bg-background border-small border-default-200 dark:border-default-400/50 shadow-medium rounded-full cursor-grab data-[dragging=true]:cursor-grabbing"
          >
            <span
              className={cn(
                "transition-transform shadow-small rounded-full w-5 h-5 block group-data-[dragging=true]:scale-80",
                index === 0
                  ? "bg-gradient-to-br from-slate-300 to-slate-600"
                  : "bg-gradient-to-br from-emerald-300 to-emerald-800"
              )}
            />
          </div>
        )}
        renderValue={() => (
          <div className="flex gap-2">
            {/* Min Price Input */}
            <Input
              label="Min"
              size="sm"
              value={priceRange[0]}
              onChange={(e) => handlePriceInputChange(0, e.target.value)}
              type="number"
              labelPlacement="outside"
              classNames={{
                inputWrapper: "max-w-24", // Override w-full with w-auto
                innerWrapper: "max-w-24", // Ensure the internal wrapper takes only the input size
                input: "max-w-24", // Make the input take only the required space
              }}
              variant="bordered"
              isClearable={false}
              fullWidth={false}
              startContent={
                <div className="pointer-events-none flex items-center">
                  <span className="text-default-400 text-small">$</span>
                </div>
              }
            />
            {/* Max Price Input */}
            <Input
              label="Max"
              size="sm"
              value={priceRange[1]}
              onChange={(e) => handlePriceInputChange(1, e.target.value)}
              type="number"
              labelPlacement="outside"
              classNames={{
                inputWrapper: "max-w-24", // Override w-full with w-auto
                innerWrapper: "max-w-24", // Ensure the internal wrapper takes only the input size
                input: "max-w-24", // Make the input take only the required space
              }}
              variant="bordered"
              isClearable={false}
              fullWidth={false}
              startContent={
                <div className="pointer-events-none flex items-center">
                  <span className="text-default-400 text-small">$</span>
                </div>
              }
            />
          </div>
        )}
      />
    </>
  );
}
