"use client";

import { useEffect, useState } from "react";
import { Spinner, Button, Alert } from "@heroui/react";
import { addToast } from "@heroui/toast";
import { useRouter } from "next/navigation";
import MonitorTile from "./MonitorTile";
import AddMonitorTile from "./AddMonitorTile";
import EbayMonitorModal from "../../ebaymonitorsetup/EbayMonitorModal";
import { useMonitors } from "@/contexts/MonitorContext";

export default function MonitorGrid() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    monitors,
    hasActiveEmail,
    editingMonitor,
    setEditingMonitor,
    toggleMonitor,
    deleteMonitor,
    loading,
    error,
    refreshMonitors,
  } = useMonitors();

  const router = useRouter();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleEdit = (id: string) => {
    const monitorToEdit = monitors.find((m) => m.id === id);
    if (monitorToEdit) {
      setEditingMonitor(monitorToEdit);
      openModal();
    }
  };

  const handleModalClose = () => {
    setEditingMonitor(null);
    closeModal();
  };

  const handleToggle = async (id: string) => {
    try {
      await toggleMonitor(id);
    } catch (err) {
      // Error is already handled in context via toast
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMonitor(id);
    } catch (err) {
      // Error is already handled in context via toast
    }
  };

  // Show error toast when error state changes
  useEffect(() => {
    if (error) {
      addToast({
        title: "Error",
        description: error,
        color: "danger",
        endContent: (
          <Button size="sm" variant="flat" onPress={refreshMonitors}>
            Retry
          </Button>
        ),
      });
    }
  }, [error, refreshMonitors]);

  if (loading && monitors.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {!loading && hasActiveEmail && monitors.length === 0 && (
        <div className="flex items-center justify-center w-auto">
          <Alert
            color="secondary"
            title="You don't have any monitors yet. Create your first one!"
          />
        </div>
      )}

      {monitors.length > 0 && (
        <div className="flex items-center justify-center w-auto">
          <Alert
            title="Active monitors will be paused"
            description="If you do not log in after 3 days."
          />
        </div>
      )}

      {!hasActiveEmail && (
        <div className="flex items-center justify-center w-auto">
          <Alert
            color="warning"
            title="Email Setup Required"
            description="You need to set up an active email to receive alerts from your monitors."
            endContent={
              <Button
                color="warning"
                className="font-semibold self-center"
                onPress={() => router.push("/dashboard/preferences")}
              >
                Setup
              </Button>
            }
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 md:gap-12 md:gap-x-14 lg:gap-x-32 gap-8">
        {monitors.map((monitor) => (
          <MonitorTile
            key={monitor.id}
            {...monitor}
            onToggle={() => handleToggle(monitor.id)}
            onEdit={() => handleEdit(monitor.id)}
            onDelete={() => handleDelete(monitor.id)}
          />
        ))}
        <AddMonitorTile onClick={openModal} />
      </div>

      <EbayMonitorModal
        isOpen={isModalOpen}
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
