import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ApiKeyProvider } from "@/components/ApiKeyProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AppShell } from "@/components/AppShell";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Prompt Engineering Tutorial",
  description: "Learn prompt engineering techniques for AI, from beginner to advanced.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* Retro theme fonts — loaded but only used when [data-theme="retro"] */}
        <link
          href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-bg text-text antialiased">
        <ThemeProvider>
          <ApiKeyProvider>
            <AppShell>{children}</AppShell>
          </ApiKeyProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
