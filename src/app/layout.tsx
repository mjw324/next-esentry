import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import { ThemeProvider } from "next-themes";
import {Providers} from "./providers";
import "./globals.css";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PopupWidget }  from "@/components/PopupWidget";


const raleway = Raleway({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "eSentry",
  description: "eSentry helps you stay ahead by providing real-time alerts for eBay and Amazon listings that match your preferences, ensuring you never miss out on the perfect deal.",
  icons: {
    icon: '/favicon.ico',
  },
};

 
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className='dark'>
      <body className={`${raleway.className} antialiased`}>
        <Providers>
          <ThemeProvider attribute="class">
            <Navbar />
            <div>{children}</div>
            <Footer />
            <PopupWidget />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
