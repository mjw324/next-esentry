import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const raleway = Raleway({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "eSentry",
  description:
    "eSentry helps you stay ahead by providing real-time alerts for eBay and Amazon listings that match your preferences, ensuring you never miss out on the perfect deal.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Supress hydration warning for the theme changer
    <html lang="en" suppressHydrationWarning>
      <body className={`${raleway.className} antialiased`}>
        <Providers>
          {/* Navbar dynamically adjusts based on the current path */}
          <Navbar />
          <div>{children}</div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
