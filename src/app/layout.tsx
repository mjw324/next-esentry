import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";
import "@theme-toggles/react/css/Expand.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { headers } from "next/headers";
import { auth } from "@/auth";

const inter = Inter({ subsets: ["latin"] });

// Server-side session fetching with caching for Better Auth performance
async function getServerSession(requestHeaders: Headers) {
  "use cache";
  try {
    return await auth.api.getSession({
      headers: requestHeaders,
    });
  } catch (error) {
    console.error("Failed to fetch server session:", error);
    return null;
  }
}

export const metadata: Metadata = {
  title: "eSentry",
  description:
    "eSentry helps you stay ahead by providing real-time alerts for eBay listings that match your preferences, ensuring you never miss out on the perfect deal.",
  icons: {
    icon: [
      {
        media: "(prefers-color-scheme: light)",
        url: "/favicon.ico",
        href: "/favicon.ico",
      },
      {
        media: "(prefers-color-scheme: dark)",
        url: "/favicon-dark.ico",
        href: "/favicon-dark.ico",
      },
    ],
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Pre-fetch session on server for SSR optimization
  const requestHeaders = await headers();
  const initialSession = await getServerSession(requestHeaders);

  return (
    // Supress hydration warning for the theme changer, this only supresses hydration warnings for this depth
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <Providers initialSession={initialSession}>
          {/* Navbar dynamically adjusts based on the current path */}
          <Navbar />
          <div>{children}</div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
