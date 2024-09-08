"use client";

import { useState } from "react";
import { Input } from "@nextui-org/react";

interface SellerInputProps {
  seller: string;
  setSeller: (seller: string) => void;
}

export default function SellerInput({ seller, setSeller }: SellerInputProps) {
  const [sellerInput, setSellerInput] = useState(seller);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSellerInput(e.target.value);
    setSeller(e.target.value);
  };

  const handleClear = () => {
    setSellerInput("");
    setSeller(""); // Clear both seller input and the seller state
  };

  return (
    <div>
      <Input
        label="Seller Name"
        value={sellerInput}
        onChange={handleInputChange}
        onClear={handleClear} // Clear the seller field on clear button click
        isClearable
        aria-label="Seller Name"
        className="mt-2"
      />
    </div>
  );
}
