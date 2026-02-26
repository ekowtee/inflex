import type { Metadata } from "next";
import { Rubik, Krub } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import React from "react";

// Configure Rubik font with improved options
const rubik = Rubik({
  subsets: ["latin"],
  variable: "--font-rubik",
  display: "swap",
  weight: ["400", "500", "700", "800"],
  fallback: ["system-ui", "sans-serif"], // Fallback if loading fails
  preload: true,
  adjustFontFallback: true, // Reduce layout shift
});

// Configure Krub with improved options
const krub = Krub({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-krub",
  fallback: ["system-ui", "sans-serif"], // Fallback if loading fails
  preload: true,
  adjustFontFallback: true, // Reduce layout shift
});

export const metadata: Metadata = {
  metadataBase: new URL("https://inflexions.tech"),
  title: {
    default: "Inflexions I.T. — Enterprise IT Solutions & Integration",
    template: "%s | Inflexions I.T.",
  },
  description:
    "Comprehensive IT integration, cloud, and cybersecurity services by Inflexions I.T. Services Ltd. Driving efficiency, innovation, and growth across Africa.",
  keywords:
    "IT services Ghana, IT integration, cloud services, cybersecurity, managed services, Accra, enterprise IT, AI automation, predictive analytics, data-centric solutions, process automation",
  openGraph: {
    type: "website",
    locale: "en_GH",
    siteName: "Inflexions I.T. Services",
    images: [{ url: "/og-image.jpeg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og-image.jpeg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${rubik.variable} ${krub.variable} h-full`}>
      <body className="flex flex-col min-h-full font-sans">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:bg-[#BD2E25] focus:text-white focus:px-4 focus:py-2 focus:rounded focus:text-sm focus:font-medium"
        >
          Skip to main content
        </a>
        <Header />
        <main id="main-content" className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
