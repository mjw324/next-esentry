"use client";
import { useState, useRef } from "react";
import { Chip } from "@nextui-org/react";

interface ChipInputProps {
  label: string;
  values: string[];
  setValues: (values: string[]) => void;
  error?: string;
  chipColor?: "success" | "danger" | "primary" | "warning";
}

export default function ChipInput({
  label,
  values,
  setValues,
  error,
  chipColor = "success",
}: ChipInputProps) {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const addValue = () => {
    if (inputValue.trim()) {
      setValues([...values, inputValue.trim()]);
      setInputValue("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      addValue();
    } else if (
      e.key === "Backspace" &&
      inputValue === "" &&
      values.length > 0
    ) {
      removeValue(values.length - 1);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const removeValue = (indexToRemove: number) => {
    const updatedValues = [...values];
    updatedValues.splice(indexToRemove, 1);
    setValues(updatedValues);
  };

  const handleChipClear = (indexToRemove: number) => {
    removeValue(indexToRemove);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleBlur = () => {
    addValue();
  };

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label className="block text-small font-medium text-foreground">
        {label}
      </label>
      <div
        className={`flex items-center min-h-[3.5rem] px-3 rounded-medium 
        bg-content1 hover:bg-content2 transition-background overflow-x-auto
        ${error ? "border-2 border-danger" : "border border-default-200"}
        group-data-[focus=true]:bg-content2
        `}
      >
        {values.map((value, index) => (
          <Chip
            key={`${value}-${index}`}
            onClose={() => handleChipClear(index)}
            color={chipColor}
            variant="solid"
            className="h-7 text-md shrink-0 mr-2"
          >
            {value}
          </Chip>
        ))}
        <input
          ref={inputRef}
          type="text"
          className="h-8 bg-transparent outline-none text-foreground text-md w-full min-w-[20px] shrink-0"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          placeholder={values.length === 0 ? "Type and press Enter/Space" : ""}
        />
      </div>
      {error && <div className="text-tiny text-danger">{error}</div>}
    </div>
  );
}
