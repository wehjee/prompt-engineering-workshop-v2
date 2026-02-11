"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isCoverPage = pathname === "/";

  if (isCoverPage) {
    return (
      <div className="min-h-screen">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Top bar with back link */}
      <header className="sticky top-0 z-30 bg-bg/80 backdrop-blur-md border-b border-border-subtle">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
              <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            All Chapters
          </Link>
          <div className="flex-1" />
        </div>
      </header>
      <main className="flex-1 min-w-0">
        {children}
      </main>
    </div>
  );
}
