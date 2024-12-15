import React, { useEffect, useState } from "react";
import { Slider, Tooltip, Input } from "@nextui-org/react";
import InfoIcon from "@/svg_components/InfoIcon";
import cn from "@/utils/cn";

interface PriceRangeSliderProps {
  value: [number | undefined, number | undefined];
  onChange: (value: [number | undefined, number | undefined]) => void;
}

export default function PriceRangeSlider({
  value,
  onChange,
}: PriceRangeSliderProps) {
  const [mounted, setMounted] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [tempInputs, setTempInputs] = useState<[string, string]>(["", ""]);
  const MAX_PRICE = 100000;

  // Calculate dynamic slider range based on current values
  const getSliderRange = () => {
    const maxInputValue = value[1] ?? 0;
    const minRange = 500;
    return Math.max(minRange, Math.ceil(maxInputValue + 100));
  };

  useEffect(() => {
    setMounted(true);
    setTempInputs([value[0]?.toString() ?? "", value[1]?.toString() ?? ""]);
  }, [value]);

  const getSliderValue = (): [number, number] => {
    const currentRange = getSliderRange();
    return [value[0] ?? 0, value[1] ?? currentRange];
  };

  const handleSliderChange = (newValue: number | number[]) => {
    const values = Array.isArray(newValue) ? newValue : [newValue, newValue];
    const currentRange = getSliderRange();

    // Ensure values don't exceed MAX_PRICE
    const clampedValues: [number | undefined, number | undefined] = [
      Math.min(values[0], MAX_PRICE) || undefined,
      values[1] === currentRange
        ? undefined
        : Math.min(values[1], MAX_PRICE) || undefined,
    ];

    onChange(clampedValues);
  };

  const handleInputChange = (index: number, inputValue: string) => {
    const newTempInputs = [...tempInputs] as [string, string];
    // Only allow numbers up to MAX_PRICE
    if (inputValue === "" || Number(inputValue) <= MAX_PRICE) {
      newTempInputs[index] = inputValue;
      setTempInputs(newTempInputs);
    }
  };

  const handleInputCommit = (index: number) => {
    const newValue =
      tempInputs[index] === "" ? undefined : Number(tempInputs[index]);
    const updatedValue = [...value] as [number | undefined, number | undefined];

    // Clamp the value to MAX_PRICE
    updatedValue[index] =
      newValue === undefined ? undefined : Math.min(newValue, MAX_PRICE);

    // Apply min/max validation only after commit
    if (updatedValue[0] !== undefined && updatedValue[1] !== undefined) {
      if (updatedValue[1] < updatedValue[0]) {
        updatedValue[1] = updatedValue[0];
        setTempInputs((prev) => [prev[0], updatedValue[0]?.toString() ?? ""]);
      }
    }

    onChange(updatedValue);
  };

  if (!mounted) return null;

  return (
    <>
      <Slider
        label="Price Range"
        minValue={0}
        maxValue={getSliderRange()}
        step={1}
        value={getSliderValue()}
        onChange={handleSliderChange}
        onChangeEnd={() => setIsDragging(false)}
        formatOptions={{ style: "currency", currency: "USD" }}
        classNames={{
          base: "gap-3",
          filler:
            "bg-gradient-to-r from-cyan-300 to-green-300 dark:from-cyan-600 dark:to-green-800",
        }}
        renderLabel={({ children, ...props }) => (
          <label
            {...props}
            className="text-medium text-default-600 flex gap-2 items-center"
          >
            {children}
            <Tooltip
              className="w-[230px] px-1.5 text-tiny text-default-600 rounded-small"
              content={
                <div className="text-left">
                  <p>Set your desired price range.</p>
                  <p>Leave fields empty for no limit.</p>
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
            onMouseDown={() => setIsDragging(true)}
            className="group p-1 top-1/2 bg-background border-small border-default-200 dark:border-default-400/50 shadow-medium rounded-full cursor-grab data-[dragging=true]:cursor-grabbing"
          >
            <span
              className={cn(
                "transition-transform shadow-small rounded-full w-4 h-4 block group-data-[dragging=true]:scale-75",
                index === 0
                  ? "bg-gradient-to-br from-cyan-300 to-cyan-800"
                  : "bg-gradient-to-br from-green-300 to-green-800"
              )}
            />
          </div>
        )}
        renderValue={() => (
          <div className="flex gap-2">
            <Input
              label="Min"
              size="sm"
              value={tempInputs[0]}
              placeholder="-"
              onChange={(e) => handleInputChange(0, e.target.value)}
              onBlur={() => handleInputCommit(0)}
              onKeyDown={(e) => e.key === "Enter" && handleInputCommit(0)}
              type="number"
              labelPlacement="outside"
              classNames={{
                inputWrapper: "max-w-24",
                innerWrapper: "max-w-24",
                input: "max-w-24 text-default-600",
              }}
              variant="bordered"
              startContent={
                <div className="pointer-events-none flex items-center">
                  <span className="text-default-400 text-small">$</span>
                </div>
              }
            />
            <Input
              label="Max"
              size="sm"
              value={tempInputs[1]}
              placeholder="-"
              onChange={(e) => handleInputChange(1, e.target.value)}
              onBlur={() => handleInputCommit(1)}
              onKeyDown={(e) => e.key === "Enter" && handleInputCommit(1)}
              type="number"
              labelPlacement="outside"
              classNames={{
                inputWrapper: "max-w-24",
                innerWrapper: "max-w-24",
                input: "max-w-24 text-default-600",
              }}
              variant="bordered"
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
