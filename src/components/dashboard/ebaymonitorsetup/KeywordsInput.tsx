"use client";

import { useState, useRef } from "react";
import { Input, Chip } from "@nextui-org/react";

interface KeywordsInputProps {
  keywords: string[];
  setKeywords: (keywords: string[]) => void;
}

export default function KeywordsInput({
  keywords,
  setKeywords,
}: KeywordsInputProps) {
  const [keywordInput, setKeywordInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Function to add keywords
  const addKeyword = () => {
    if (keywordInput.trim()) {
      setKeywords([...keywords, keywordInput.trim()]);
      setKeywordInput(""); // Clear input field after adding
    }
  };

  // Function to add keywords when space is pressed
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === " " || e.key === "Enter") {
      // Prevent the space character from being added to the input
      e.preventDefault();
      addKeyword();
    } else if (
      e.key === "Backspace" &&
      keywordInput === "" &&
      keywords.length > 0
    ) {
      // If input is empty and backspace is pressed, remove the last chip
      removeKeyword(keywords.length - 1);
      // Refocus input after removing a chip with backspace
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  // Remove a specific keyword based on index
  const removeKeyword = (indexToRemove: number) => {
    const updatedKeywords = [...keywords];
    updatedKeywords.splice(indexToRemove, 1); // Remove only the keyword at the specific index
    setKeywords(updatedKeywords);

    // Force the input to recheck its "filled within" state after a chip is removed, but only when closing a chip manually
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

  // Handle adding a keyword when input loses focus
  const handleBlur = () => {
    addKeyword();
  };

  return (
    <div className="flex items-center gap-2">
      {/* Input field with chips conditionally displayed */}
      <Input
        isRequired
        label="Keywords"
        ref={inputRef} // Set the ref for the input field
        value={keywordInput}
        onChange={(e) => setKeywordInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur} // Add the current input as a keyword when input loses focus
        classNames={{
          inputWrapper: "flex flex-wrap gap-2 pt-1 pb-1",
          input: "flex-auto w-auto",
        }}
        startContent={
          // Conditionally render chips if there are keywords
          keywords.length > 0 ? (
            <>
              {keywords.map((keyword, index) => (
                <Chip
                  key={`${keyword}-${index}`}
                  onClose={() => handleChipClear(index)} // Remove by index to avoid removing duplicates
                  color="success"
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
