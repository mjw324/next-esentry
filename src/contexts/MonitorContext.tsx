"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { addToast } from "@heroui/toast";
import MonitorService from "@/services/monitorService";
import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";

export interface Monitor {
  id: string;
  keywords: string[];
  isActive: boolean;
  excludedKeywords?: string[];
  sellers?: string[];
  minPrice?: number;
  maxPrice?: number;
  condition?: string[];
}

interface MonitorContextType {
  monitors: Monitor[];
  hasActiveEmail: boolean;
  editingMonitor: Monitor | null;
  loading: boolean;
  error: string | null;
  addMonitor: (monitor: Omit<Monitor, "id" | "isActive">) => Promise<void>;
  updateMonitor: (id: string, monitor: Partial<Monitor>) => Promise<void>;
  deleteMonitor: (id: string) => Promise<void>;
  toggleMonitor: (id: string) => Promise<void>;
  setEditingMonitor: (monitor: Monitor | null) => void;
  refreshMonitors: () => Promise<void>;
}

const MonitorContext = createContext<MonitorContextType | undefined>(undefined);

// Helper function to extract error message from error objects
const getErrorMessage = (err: unknown): string => {
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  return "An unexpected error occurred";
};

// Check if error is related to missing email setup
const isEmailSetupError = (errorMsg: string): boolean => {
  const lowerCaseMsg = errorMsg.toLowerCase();
  return (
    lowerCaseMsg.includes("no active email") ||
    lowerCaseMsg.includes("set up an active alert email") ||
    (lowerCaseMsg.includes("email") && lowerCaseMsg.includes("before creating"))
  );
};

export function MonitorProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [monitors, setMonitors] = useState<Monitor[]>([]);
  const [hasActiveEmail, setHasActiveEmail] = useState<boolean>(true);
  const [editingMonitor, setEditingMonitor] = useState<Monitor | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const navigateToPreferences = () => {
    router.push("/dashboard/preferences");
  };

  const refreshMonitors = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Check if user is authenticated
      if (!session?.user?.id) {
        setLoading(false);
        return; // Silently exit if not authenticated
      }

      console.log("Refreshing monitors...");
      const data = await MonitorService.getAll(session.user.id);
      console.log("Successfully fetched monitors:", data);

      // Update both monitors and hasActiveEmail state
      setMonitors(data.monitors);
      setHasActiveEmail(data.hasActiveEmail);
    } catch (err) {
      console.error("Error refreshing monitors:", err);
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      addToast({
        title: "Error",
        description: errorMessage,
        color: "danger",
        endContent: (
          <Button size="sm" variant="flat" onPress={() => refreshMonitors()}>
            Retry
          </Button>
        ),
      });
    } finally {
      setLoading(false);
    }
  }, [session]);

  const addMonitor = async (monitorData: Omit<Monitor, "id" | "isActive">) => {
    setLoading(true);
    setError(null);
    try {
      // Validate user is logged in
      if (!session?.user?.id) {
        addToast({
          title: "Error",
          description: "You must be logged in to perform this action",
          color: "danger",
        });
        setLoading(false);
        return;
      }

      console.log("Creating monitor with data:", {
        ...monitorData,
        useLoginEmail: true,
      });
      const newMonitor = await MonitorService.create(
        monitorData,
        session.user.id
      );
      setMonitors((current) => [...current, newMonitor]);
      addToast({
        title: "Monitor Created",
        description: "Press the play button to start the monitor",
        color: "success",
      });
    } catch (err) {
      console.error("Error response from backend:", err);
      const errorMessage = getErrorMessage(err);

      // Check if this is an email setup error
      if (isEmailSetupError(errorMessage)) {
        addToast({
          title: "Email Setup Required",
          description:
            "You need to set up an active alert email before creating a monitor",
          color: "warning",
          endContent: (
            <Button size="sm" color="primary" onPress={navigateToPreferences}>
              Setup
            </Button>
          ),
        });
      } else {
        setError(errorMessage);
        addToast({
          title: "Error",
          description: errorMessage,
          color: "danger",
        });
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateMonitor = async (id: string, updates: Partial<Monitor>) => {
    setLoading(true);
    setError(null);
    try {
      // Validate user is logged in
      if (!session?.user?.id) {
        addToast({
          title: "Error",
          description: "You must be logged in to perform this action",
          color: "danger",
        });
        setLoading(false);
        return;
      }

      const updatedMonitor = await MonitorService.update(
        id,
        updates,
        session.user.id
      );
      setMonitors((current) =>
        current.map((monitor) => (monitor.id === id ? updatedMonitor : monitor))
      );
      addToast({
        title: "Success",
        description: "Monitor updated successfully",
        color: "success",
      });
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      addToast({
        title: "Error",
        description: errorMessage,
        color: "danger",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteMonitor = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      // Validate user is logged in
      if (!session?.user?.id) {
        addToast({
          title: "Error",
          description: "You must be logged in to perform this action",
          color: "danger",
        });
        setLoading(false);
        return;
      }

      await MonitorService.delete(id, session.user.id);
      setMonitors((current) => current.filter((monitor) => monitor.id !== id));
      addToast({
        title: "Success",
        description: "Monitor deleted successfully",
        color: "primary",
      });
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      addToast({
        title: "Error",
        description: errorMessage,
        color: "danger",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const toggleMonitor = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      // Validate user is logged in
      if (!session?.user?.id) {
        addToast({
          title: "Error",
          description: "You must be logged in to perform this action",
          color: "danger",
        });
        setLoading(false);
        return;
      }

      const monitor = monitors.find((m) => m.id === id);
      if (!monitor) throw new Error("Monitor not found");

      const updatedMonitor = await MonitorService.toggle(
        id,
        !monitor.isActive,
        session.user.id
      );
      setMonitors((current) =>
        current.map((m) => (m.id === id ? updatedMonitor : m))
      );

      const statusText = updatedMonitor.isActive ? "started" : "paused";
      addToast({
        title: "Status Changed",
        description: `Monitor has been ${statusText}`,
        color: updatedMonitor.isActive ? "success" : "secondary",
      });
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      addToast({
        title: "Error",
        description: errorMessage,
        color: "danger",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Add useEffect to load monitors on mount or when session changes
  useEffect(() => {
    if (session?.user?.id) {
      refreshMonitors();
    }
  }, [session, refreshMonitors]);

  return (
    <MonitorContext.Provider
      value={{
        monitors,
        hasActiveEmail,
        editingMonitor,
        loading,
        error,
        addMonitor,
        updateMonitor,
        deleteMonitor,
        toggleMonitor,
        setEditingMonitor,
        refreshMonitors,
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
