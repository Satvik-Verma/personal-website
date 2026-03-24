import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  // Include the full variable weight range so font-black (900) renders correctly
  weight: "variable",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Satvik Verma | Product-Driven Software Engineer",
  description:
    "Founding engineer who ships 0\u21921. Full-stack mobile, backend, cloud, AI/ML. Shipped Xuman.AI to the App Store. Published researcher at AAAI & IEEE.",
  keywords: [
    "Satvik Verma",
    "Software Engineer",
    "Founding Engineer",
    "Full Stack",
    "React Native",
    "AI",
    "ML",
    "San Francisco",
  ],
  authors: [{ name: "Satvik Verma" }],
  openGraph: {
    title: "Satvik Verma | Product-Driven Software Engineer",
    description:
      "Founding engineer who ships 0\u21921. Full-stack mobile, backend, cloud, AI/ML.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Satvik Verma | Product-Driven Software Engineer",
    description:
      "Founding engineer who ships 0\u21921. Full-stack mobile, backend, cloud, AI/ML.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark`}
    >
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
