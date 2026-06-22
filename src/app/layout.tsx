import type { Metadata } from "next";
import { Montserrat } from "next/font/google";

import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // optional: add weights you need
});

export const metadata: Metadata = {
  title: "Lilly | AI Mental Health Companion for Journaling & Mood Tracking",
  description:
    "Lilly is an AI-powered mental wellness companion offering empathetic chat support, private journaling, and mood tracking in one secure experience.",
  keywords: [
    "AI mental health", "emotional wellness", "mental health chatbot", "journal app", "mood tracker", "therapy companion", "self-care", "wellbeing assistant", "mental wellness tool",
  ],
  metadataBase: new URL("https://lilly.live"),
  openGraph: {
    title: "Lilly | AI Mental Health Companion",
    description:
      "Private AI chat support for journaling, mood tracking, and emotional wellness insights.",
    type: "website",
    url: "https://lilly.live",
    siteName: "Lilly",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lilly | AI Mental Health Companion",
    description:
      "Private AI chat support for journaling, mood tracking, and emotional wellness insights.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
