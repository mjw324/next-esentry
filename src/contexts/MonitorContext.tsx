"use client";

import React, { createContext, useContext, useState } from "react";

export interface Monitor {
  id: string;
  keywords: string[];
  excludedKeywords: string[];
  seller?: string;
  isActive: boolean;
  minPrice?: number;
  maxPrice?: number;
  condition: string[];
}

interface MonitorContextType {
  monitors: Monitor[];
  editingMonitor: Monitor | null;
  addMonitor: (monitor: Omit<Monitor, "id" | "isActive">) => void;
  updateMonitor: (id: string, monitor: Partial<Monitor>) => void;
  deleteMonitor: (id: string) => void;
  toggleMonitor: (id: string) => void;
  setEditingMonitor: (monitor: Monitor | null) => void;
}

const MonitorContext = createContext<MonitorContextType | undefined>(undefined);

export function MonitorProvider({ children }: { children: React.ReactNode }) {
  const [monitors, setMonitors] = useState<Monitor[]>([]);
  const [editingMonitor, setEditingMonitor] = useState<Monitor | null>(null);

  const addMonitor = (monitorData: Omit<Monitor, "id" | "isActive">) => {
    const newMonitor = {
      ...monitorData,
      id: Date.now().toString(),
      isActive: true,
    };
    setMonitors((current) => [...current, newMonitor]);
  };

  const updateMonitor = (id: string, updates: Partial<Monitor>) => {
    setMonitors((current) =>
      current.map((monitor) =>
        monitor.id === id ? { ...monitor, ...updates } : monitor
      )
    );
  };

  const deleteMonitor = (id: string) => {
    setMonitors((current) => current.filter((monitor) => monitor.id !== id));
  };

  const toggleMonitor = (id: string) => {
    setMonitors((current) =>
      current.map((monitor) =>
        monitor.id === id
          ? { ...monitor, isActive: !monitor.isActive }
          : monitor
      )
    );
  };

  return (
    <MonitorContext.Provider
      value={{
        monitors,
        editingMonitor,
        addMonitor,
        updateMonitor,
        deleteMonitor,
        toggleMonitor,
        setEditingMonitor,
      }}
    >
      {children}
    </MonitorContext.Provider>
  );
}

export function useMonitors() {
  const context = useContext(MonitorContext);
  if (context === undefined) {
    throw new Error("useMonitors must be used within a MonitorProvider");
  }
  return context;
}
