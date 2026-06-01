"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { AspectValue } from "@/types/insights";
import { colorAt } from "./palette";

/**
 * Top brands as a horizontal bar chart. Data is the "Brand" entry from eBay's
 * `topAspects` refinement (full-population match counts).
 */
export default function TopBrandsBar({
  values,
  max = 6,
}: {
  values: AspectValue[];
  max?: number;
}) {
  const data = values
    .filter((v) => v.matchCount > 0)
    .slice(0, max)
    .map((v) => ({ name: v.value, value: v.matchCount }));

  if (data.length === 0) {
    return <p className="text-tiny text-default-400">No brand data for this query.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={Math.max(120, data.length * 32)}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 0, right: 12, bottom: 0, left: 0 }}
      >
        <XAxis type="number" hide />
        <YAxis
          type="category"
          dataKey="name"
          width={90}
          tick={{ fontSize: 12, fill: "currentColor" }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          cursor={{ fill: "hsl(var(--heroui-default-100))" }}
          formatter={(value) => [Number(value).toLocaleString(), "Listings"]}
          contentStyle={{
            background: "hsl(var(--heroui-content1))",
            border: "1px solid hsl(var(--heroui-default-200))",
            borderRadius: 8,
            fontSize: 12,
          }}
        />
        <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={16}>
          {data.map((_, i) => (
            <Cell key={i} fill={colorAt(i)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
