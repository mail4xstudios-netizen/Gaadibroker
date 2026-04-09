import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import LayoutShell from "@/components/LayoutShell";
import { WebsiteSchema, OrganizationSchema } from "@/components/SchemaMarkup";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-jakarta",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://gaadibroker.com";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#ff6a00",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "GaadiBroker - India's #1 Trusted Used Car Marketplace",
    template: "%s | GaadiBroker",
  },
  description:
    "Buy and sell verified pre-owned cars at the best prices. Explore thousands of certified used cars from trusted sellers across 100+ cities in India. Free inspection, easy financing, hassle-free documentation.",
  keywords: [
    "used cars", "second hand cars", "buy used cars", "sell car", "pre-owned cars",
    "used cars India", "second hand cars Mumbai", "certified used cars",
    "best used car deals", "used car marketplace India", "GaadiBroker",
  ],
  authors: [{ name: "GaadiBroker" }],
  creator: "GaadiBroker",
  publisher: "GaadiBroker",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 },
  },
  openGraph: {
    title: "GaadiBroker - India's #1 Trusted Used Car Marketplace",
    description: "Buy and sell verified pre-owned cars at the best prices across 100+ cities.",
    type: "website",
    locale: "en_IN",
    siteName: "GaadiBroker",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "GaadiBroker - India's #1 Trusted Used Car Marketplace",
    description: "Buy and sell verified pre-owned cars at the best prices.",
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={jakarta.variable}>
      <head>
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="icon" href="/images/logo-icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/images/logo-icon.svg" />
        <WebsiteSchema />
        <OrganizationSchema />
      </head>
      <body className="bg-gray-50 min-h-screen flex flex-col">
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}
