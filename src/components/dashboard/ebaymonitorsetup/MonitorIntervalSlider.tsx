import React from "react";
import { Slider, Tooltip } from "@heroui/react";
import type { SliderValue } from "@heroui/react";
import cn from "@/utils/cn";
import { Info, Clock } from "lucide-react";

interface MonitorIntervalSliderProps {
  value: number;
  onChange: (value: number) => void;
}

export default function MonitorIntervalSlider({
  value,
  onChange,
}: MonitorIntervalSliderProps) {
  // Format milliseconds to readable time format (hours and minutes only)
  const formatIntervalTime = (milliseconds: number): string => {
    if (isNaN(milliseconds) || milliseconds < 0) {
      return "0h 0m";
    }

    const totalMinutes = Math.floor(milliseconds / (1000 * 60));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours === 0) {
      return `${minutes}m`;
    } else if (minutes === 0) {
      return `${hours}h`;
    } else {
      return `${hours}h ${minutes}m`;
    }
  };

  const handleChange = (newValue: SliderValue) => {
    onChange(newValue as number);
  };

  return (
    <Slider
      label="Check Frequency"
      value={value}
      onChange={handleChange}
      minValue={300000} // 5 minutes in milliseconds
      maxValue={86400000} // 24 hours in milliseconds
      step={300000} // 5-minute steps
      formatOptions={{
        style: "unit",
        unit: "millisecond",
      }}
      hideValue
      showTooltip
      getTooltipValue={(value: SliderValue) =>
        formatIntervalTime(value as number)
      }
      classNames={{
        base: "gap-3",
        filler:
          "bg-gradient-to-r from-secondary-300 to-primary-300 dark:from-secondary-600 dark:to-primary-600 data-[fill-start=true]:border-s-transparent",
      }}
      renderLabel={({ children, ...props }) => (
        <label
          {...props}
          className="block text-small font-medium text-foreground flex gap-2 items-center"
        >
          <Clock className="w-4 h-4 text-default-600" />
          {children}
          <Tooltip
            className="w-[250px] px-1.5 text-small text-default-600 rounded-small"
            content={
              <div className="text-left">
                <p>How often should we check for new listings?</p>
                <p className="text-tiny text-default-500 mt-1">
                  More frequent checks mean faster notifications but use more
                  resources.
                </p>
              </div>
            }
            placement="right"
          >
            <span className="transition-opacity opacity-60 hover:opacity-100">
              <Info className="w-4 h-4" />
            </span>
          </Tooltip>
        </label>
      )}
      renderThumb={({ ...props }) => (
        <div
          {...props}
          className="group p-1 top-1/2 bg-background border-small border-default-200 dark:border-default-400/50 shadow-medium rounded-full cursor-grab data-[dragging=true]:cursor-grabbing"
        >
          <span
            className={cn(
              "transition-transform shadow-small rounded-full w-4 h-4 block group-data-[dragging=true]:scale-75",
              "bg-gradient-to-br from-secondary-400 to-primary-600"
            )}
          />
        </div>
      )}
      renderValue={() => (
        <div className="text-small text-default-600 font-medium">
          Every {formatIntervalTime(value)}
        </div>
      )}
    />
  );
}
