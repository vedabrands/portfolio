import type { Metadata } from "next";
import { Anton, Inter, JetBrains_Mono } from "next/font/google";
import AmbientGlow from "@/components/AmbientGlow";
import VisitorTracker from "@/components/VisitorTracker";
import "./globals.css";

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Your Name | Creative Developer Portfolio",
  description:
    "Building fast, responsive web applications using modern tech stacks.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${anton.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="relative bg-background text-foreground antialiased selection:bg-accent selection:text-background">
        <AmbientGlow />
        <VisitorTracker />
        {children}
      </body>
    </html>
  );
}
