import MonitorGrid from "@/components/dashboard/monitors/tiles/MonitorGrid";
import { MonitorProvider } from "@/contexts/MonitorContext";
import { headers } from "next/headers";
import { auth } from "@/auth";

// Server-side session fetching with caching for dashboard
async function getDashboardSession(requestHeaders: Headers) {
  "use cache";
  try {
    return await auth.api.getSession({
      headers: requestHeaders,
    });
  } catch (error) {
    console.error("Failed to fetch dashboard session:", error);
    return null;
  }
}

export default async function Dashboard() {
  // Pre-fetch session on server for SSR optimization
  const requestHeaders = await headers();
  const initialSession = await getDashboardSession(requestHeaders);
  return (
    <MonitorProvider initialSession={initialSession}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Your Monitors</h1>
        <MonitorGrid />
      </div>
    </MonitorProvider>
  );
}
