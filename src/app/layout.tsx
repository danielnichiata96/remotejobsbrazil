import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { AnalyticsClient } from "@/components/AnalyticsClient";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: "Remote Jobs Brazil",
  description: "Lean job board for remote roles in Brazil",
  openGraph: {
    title: "Remote Jobs Brazil 🇧🇷",
    description: "100% remote jobs for Brazil. Next.js + Supabase.",
    type: "website",
  locale: "pt_BR",
  alternateLocale: "en_US",
    siteName: "Remote Jobs Brazil",
    url: "/",
    images: [
      {
        url: "/api/og",
        width: 1200,
        height: 630,
        alt: "Remote Jobs Brazil - 100% remote opportunities for Brazilian developers",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Remote Jobs Brazil 🇧🇷",
    description: "100% remote jobs for Brazil",
    images: ["/api/og"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Remote Jobs Brazil",
    description: "Job board for remote work opportunities in Brazil",
    url: "https://remotejobsbrazil.vercel.app",
    sameAs: [],
  };
  return (
  <html lang="pt-BR">
      <head>
  <link rel="alternate" type="application/atom+xml" href="/feed.xml" />
  <link rel="alternate" type="application/atom+xml" href="/feed/react.xml" />
  <link rel="alternate" type="application/atom+xml" href="/feed/node.xml" />
  <link rel="alternate" type="application/atom+xml" href="/feed/qa.xml" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
  <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}> 
        <SiteHeader />
        <main className="min-h-[calc(100vh-8rem)]">{children}</main>
  <SiteFooter />
  <AnalyticsClient />
      </body>
    </html>
  );
}
