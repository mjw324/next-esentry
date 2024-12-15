"use client";
import MonitorGrid from "@/components/dashboard/monitors/tiles/MonitorGrid";

import { MonitorProvider } from "@/contexts/MonitorContext";

export default function Dashboard() {
  return (
    <MonitorProvider>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Your Monitors</h1>
        <MonitorGrid />
      </div>
    </MonitorProvider>
  );
}
