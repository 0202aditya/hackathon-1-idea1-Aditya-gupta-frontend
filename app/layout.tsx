import type { Metadata } from "next";
import { Suspense } from "react";
import { Bricolage_Grotesque, Instrument_Sans } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { HeaderFallback, SiteHeader } from "@/components/site-header";
import "./globals.css";

const sans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-body-face",
});

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display-face",
});

export const metadata: Metadata = {
  title: "A Una Milla",
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
