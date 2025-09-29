"use client";

import { HeroUIProvider } from "@heroui/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ToastProvider } from "@heroui/toast";
import { createContext, useContext, ReactNode } from "react";

// Session context for server-side fallback pattern
const SessionContext = createContext<any>(null);

export function Providers({
  children,
  initialSession
}: {
  children: ReactNode;
  initialSession?: any;
}) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem={true}
    >
      <HeroUIProvider>
        <SessionContext.Provider value={initialSession}>
          <ToastProvider />
          {children}
        </SessionContext.Provider>
      </HeroUIProvider>
    </NextThemesProvider>
  );
}

// Hook to access server-side session fallback
export const useServerSession = () => useContext(SessionContext);
