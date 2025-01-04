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
      classNames={{
        label:
          "block text-small font-medium text-foreground flex gap-2 items-center",
      }}
    >
      <Checkbox value="new">New</Checkbox>
      <Checkbox value="openBox">Open Box</Checkbox>
      <Checkbox value="used">Used</Checkbox>
    </CheckboxGroup>
  );
}
