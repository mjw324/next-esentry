// components/dashboard/monitors/MonitorGrid.tsx
"use client";

import { useDisclosure } from "@heroui/react";
import MonitorTile from "./MonitorTile";
import AddMonitorTile from "./AddMonitorTile";
import EbayMonitorModal from "../../ebaymonitorsetup/EbayMonitorModal";
import { useMonitors } from "@/contexts/MonitorContext";

export default function MonitorGrid() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    monitors,
    editingMonitor,
    setEditingMonitor,
    toggleMonitor,
    deleteMonitor,
  } = useMonitors();

  const handleEdit = (id: string) => {
    const monitorToEdit = monitors.find((m) => m.id === id);
    if (monitorToEdit) {
      setEditingMonitor(monitorToEdit);
      onOpen();
    }
  };

  const handleModalClose = () => {
    setEditingMonitor(null);
    onOpenChange();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 md:gap-12 md:gap-x-14 lg:gap-x-32 gap-8">
      {monitors.map((monitor) => (
        <MonitorTile
          key={monitor.id}
          {...monitor}
          onToggle={() => toggleMonitor(monitor.id)}
          onEdit={() => handleEdit(monitor.id)}
          onDelete={() => deleteMonitor(monitor.id)}
        />
      ))}
      <AddMonitorTile onClick={onOpen} />

      <EbayMonitorModal
        isOpen={isOpen}
        onOpenChange={handleModalClose}
        isDemo={false}
        initialKeywords={editingMonitor?.keywords || []}
        initialExcludedKeywords={editingMonitor?.excludedKeywords || []}
        initialCondition={editingMonitor?.condition || []}
        initialSellers={editingMonitor?.sellers || []}
        minPrice={editingMonitor?.minPrice}
        maxPrice={editingMonitor?.maxPrice}
      />
    </div>
  );
}
