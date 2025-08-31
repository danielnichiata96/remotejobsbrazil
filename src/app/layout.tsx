import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Remote Jobs Brazil",
  description: "Lean job board for remote roles in Brazil",
  openGraph: {
    title: "Remote Jobs Brazil 🇧🇷",
    description: "Trabalhos 100% remotos para o Brasil. Next.js + Supabase.",
    type: "website",
    locale: "pt_BR",
    alternateLocale: "en_US",
    siteName: "Remote Jobs Brazil",
  },
  twitter: {
    card: "summary",
    title: "Remote Jobs Brazil 🇧🇷",
    description: "Trabalhos 100% remotos para o Brasil",
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 dark:bg-gray-900`}> 
        <SiteHeader />
        <main className="min-h-[calc(100vh-8rem)]">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
