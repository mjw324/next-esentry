"use client";

import { useState, useRef } from "react";
import { Input, Chip } from "@nextui-org/react";

interface ExcludedKeywordsInputProps {
  excludedKeywords: string[];
  setExcludedKeywords: (excludedKeywords: string[]) => void;
}

export default function ExcludedKeywordsInput({
  excludedKeywords,
  setExcludedKeywords,
}: ExcludedKeywordsInputProps) {
  const [keywordInput, setKeywordInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Function to add excluded keywords
  const addKeyword = () => {
    if (keywordInput.trim()) {
      setExcludedKeywords([...excludedKeywords, keywordInput.trim()]);
      setKeywordInput(""); // Clear input field after adding
    }
  };

  // Function to add excluded keywords when space is pressed
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === " " || e.key === "Enter") {
      // Prevent the space character from being added to the input
      e.preventDefault();
      addKeyword();
    } else if (
      e.key === "Backspace" &&
      keywordInput === "" &&
      excludedKeywords.length > 0
    ) {
      // If input is empty and backspace is pressed, remove the last chip
      removeKeyword(excludedKeywords.length - 1);
      // Refocus input after removing a chip with backspace
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  // Remove a specific excluded keyword based on index
  const removeKeyword = (indexToRemove: number) => {
    const updatedKeywords = [...excludedKeywords];
    updatedKeywords.splice(indexToRemove, 1); // Remove only the keyword at the specific index
    setExcludedKeywords(updatedKeywords);
  };

  // Handle clear button for individual chip deletions to reset label positioning
  const handleChipClear = (indexToRemove: number) => {
    removeKeyword(indexToRemove);

    // Manually blur and re-focus the input after the chip is removed to recheck the "filled within" state
    if (inputRef.current) {
      setTimeout(() => {
        inputRef.current?.blur();
        inputRef.current?.focus();
      }, 0);
    }
  };

  // Handle adding an excluded keyword when input loses focus
  const handleBlur = () => {
    addKeyword();
  };

  return (
    <div className="flex items-center gap-2">
      {/* Input field with chips conditionally displayed */}
      <Input
        label="Excluded Keywords"
        ref={inputRef} // Set the ref for the input field
        value={keywordInput}
        onChange={(e) => setKeywordInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur} // Add the current input as an excluded keyword when input loses focus
        classNames={{
          inputWrapper: "flex flex-wrap gap-2 pt-1 pb-1",
          input: "flex-auto w-auto",
        }}
        startContent={
          // Conditionally render chips if there are excluded keywords
          excludedKeywords.length > 0 ? (
            <>
              {excludedKeywords.map((keyword, index) => (
                <Chip
                  key={`${keyword}-${index}`}
                  onClose={() => handleChipClear(index)}
                  color="danger"
                  variant="solid"
                  className="mr-1 h-6"
                >
                  {keyword}
                </Chip>
              ))}
            </>
          ) : null
        }
      />
    </div>
  );
}
