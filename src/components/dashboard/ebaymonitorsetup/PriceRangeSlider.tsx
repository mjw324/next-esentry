import React, { useEffect, useState } from "react";
import { Slider, Tooltip, Input } from "@heroui/react";
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
  const [tempInputs, setTempInputs] = useState<[string, string]>([
    value[0]?.toString() ?? "",
    value[1]?.toString() ?? "",
  ]);
  const MAX_PRICE = 100000;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      const newTempInputs: [string, string] = [
        value[0]?.toString() ?? "",
        value[1]?.toString() ?? "",
      ];
      setTempInputs(newTempInputs);
    }
  }, [value, mounted]);

  const getSliderRange = () => {
    const maxInputValue = value[1] ?? 0;
    const minRange = 500;
    return Math.max(minRange, Math.ceil(maxInputValue + 100));
  };

  const getSliderValue = (): [number, number] => {
    const currentRange = getSliderRange();
    const minValue = value[0] ?? 0;
    const maxValue = value[1] ?? currentRange;

    // Ensure slider thumbs respect min/max relationship
    if (minValue > maxValue) {
      return [maxValue, maxValue];
    }
    return [minValue, maxValue];
  };

  const handleSliderChange = (newValue: number | number[]) => {
    if (!mounted) return;

    const values = Array.isArray(newValue) ? newValue : [newValue, newValue];
    const currentRange = getSliderRange();

    let clampedValues: [number | undefined, number | undefined] = [
      values[0] === 0 ? undefined : Math.min(values[0], MAX_PRICE),
      values[1] === currentRange ? undefined : Math.min(values[1], MAX_PRICE),
    ];

    // Ensure min doesn't exceed max and max doesn't go below min
    if (clampedValues[0] !== undefined && clampedValues[1] !== undefined) {
      if (clampedValues[0] > clampedValues[1]) {
        clampedValues = [clampedValues[1], clampedValues[1]];
      }
    }

    if (JSON.stringify(clampedValues) !== JSON.stringify(value)) {
      onChange(clampedValues);
    }
  };

  const handleInputChange = (index: number, inputValue: string) => {
    if (inputValue === "" || Number(inputValue) <= MAX_PRICE) {
      const newTempInputs = [...tempInputs] as [string, string];
      newTempInputs[index] = inputValue;
      setTempInputs(newTempInputs);
    }
  };

  const handleInputCommit = (index: number) => {
    if (!mounted) return;

    const newValue =
      tempInputs[index] === "" ? undefined : Number(tempInputs[index]);
    const updatedValue = [...value] as [number | undefined, number | undefined];
    updatedValue[index] =
      newValue === undefined ? undefined : Math.min(newValue, MAX_PRICE);

    // Handle min > max
    if (
      index === 0 && // Only for min value changes
      updatedValue[0] !== undefined &&
      updatedValue[1] !== undefined &&
      updatedValue[0] > updatedValue[1]
    ) {
      updatedValue[0] = updatedValue[1];
      setTempInputs([updatedValue[1].toString(), tempInputs[1]]);
    }

    // Handle max < min
    if (
      index === 1 && // Only for max value changes
      updatedValue[0] !== undefined &&
      updatedValue[1] !== undefined &&
      updatedValue[1] < updatedValue[0]
    ) {
      updatedValue[1] = updatedValue[0];
      setTempInputs([tempInputs[0], updatedValue[0].toString()]);
    }

    if (JSON.stringify(updatedValue) !== JSON.stringify(value)) {
      onChange(updatedValue);
    }
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
            "bg-gradient-to-r from-primary-300 to-success-300 dark:from-primary-600 dark:to-success-800",
        }}
        renderLabel={({ children, ...props }) => (
          <label
            {...props}
            className="block text-small font-medium text-foreground flex gap-2 items-center"
          >
            {children}
            <Tooltip
              className="w-[230px] px-1.5 text-small text-default-600 rounded-small"
              content={
                <div className="text-left">
                  <p>Set your desired price range.</p>
                  <p>Leave fields empty for no limit.</p>
                </div>
              }
              placement="right"
            >
              <span className="transition-opacity opacity-60 hover:opacity-100">
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
                  ? "bg-gradient-to-br from-primary-300 to-primary-800"
                  : "bg-gradient-to-br from-success-400 to-success-900"
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
