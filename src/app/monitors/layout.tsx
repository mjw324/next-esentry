import { MonitorProvider } from "@/contexts/MonitorContext";
import { headers } from "next/headers";
import { auth } from "@/auth";

// Server-side session fetching with caching for monitors
async function getMonitorsSession(requestHeaders: Headers) {
  "use cache";
  try {
    return await auth.api.getSession({
      headers: requestHeaders,
    });
  } catch (error) {
    console.error("Failed to fetch monitors session:", error);
    return null;
  }
}

export default async function MonitorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Pre-fetch session on server for SSR optimization
  const requestHeaders = await headers();
  const initialSession = await getMonitorsSession(requestHeaders);

  return (
    <MonitorProvider initialSession={initialSession}>
      {children}
    </MonitorProvider>
  );
}