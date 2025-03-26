"use client";

import { HeroUIProvider } from "@heroui/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";
import { ToastProvider } from "@heroui/toast"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem={true}
    >
      <HeroUIProvider>
        <SessionProvider>
          <ToastProvider />
          {children}
        </SessionProvider>
      </HeroUIProvider>
    </NextThemesProvider>
  );
}
