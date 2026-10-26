import type { Metadata } from "next";
import { Suspense } from "react";
import { Hanken_Grotesk, Space_Grotesk } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { HeaderFallback, SiteHeader } from "@/components/site-header";
import "./globals.css";

const sans = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken",
});

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
});

export const metadata: Metadata = {
  title: "Una Milla",
  description: "See what a flight costs after your Indian credit card points.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <Suspense fallback={<HeaderFallback />}>
          <SiteHeader />
        </Suspense>
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
