import React from "react";
import { headers } from "next/headers";
import { auth } from "@/auth";
import AlertPreferencesClient from "./AlertPreferencesClient";

// Server-side session fetching with caching for preferences
async function getPreferencesSession(requestHeaders: Headers) {
  "use cache";
  try {
    return await auth.api.getSession({
      headers: requestHeaders,
    });
  } catch (error) {
    console.error("Failed to fetch preferences session:", error);
    return null;
  }
}

export default async function AlertPreferences() {
  // Pre-fetch session on server for SSR optimization
  const requestHeaders = await headers();
  const initialSession = await getPreferencesSession(requestHeaders);

  return <AlertPreferencesClient initialSession={initialSession} />;
}
