"use client";

import { CheckboxGroup, Checkbox } from "@nextui-org/react";

interface ConditionCheckboxGroupProps {
  condition: string[];
  setCondition: (condition: string[]) => void;
}

export default function ConditionCheckboxGroup({
  condition,
  setCondition,
}: ConditionCheckboxGroupProps) {
  return (
    <CheckboxGroup
      label="Condition"
      orientation="horizontal"
      value={condition}
      onChange={setCondition}
    >
      <Checkbox value="new">New</Checkbox>
      <Checkbox value="openBox">Open Box</Checkbox>
      <Checkbox value="used">Used</Checkbox>
    </CheckboxGroup>
  );
}
