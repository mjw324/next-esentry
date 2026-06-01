"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import type { ConditionBreakdown } from "@/types/insights";
import { colorAt } from "./palette";

/**
 * Condition distribution as a donut. Data comes straight from eBay's
 * `conditionDistribution` refinement (full-population match counts).
 */
export default function ConditionDonut({
  data,
}: {
  data: ConditionBreakdown[];
}) {
  const chartData = data
    .filter((d) => d.matchCount > 0)
    .map((d) => ({ name: d.condition, value: d.matchCount }));

  if (chartData.length === 0) {
    return (
      <p className="text-tiny text-default-400">No condition data for this query.</p>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={180}>
      <PieChart>
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={45}
          outerRadius={70}
          paddingAngle={2}
          stroke="none"
        >
          {chartData.map((_, i) => (
            <Cell key={i} fill={colorAt(i)} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value, name) => [Number(value).toLocaleString(), name]}
          contentStyle={{
            background: "hsl(var(--heroui-content1))",
            border: "1px solid hsl(var(--heroui-default-200))",
            borderRadius: 8,
            fontSize: 12,
          }}
        />
        <Legend
          verticalAlign="bottom"
          height={24}
          wrapperStyle={{ fontSize: 12 }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
