"use client";

import { usePathname, useRouter } from "next/navigation";
import { useRef } from "react";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const mainRef = useRef<HTMLDivElement>(null);
  const isCoverPage = pathname === "/";

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = mainRef.current;
    if (el) {
      el.style.transition = "opacity 300ms ease, transform 300ms ease";
      el.style.opacity = "0";
      el.style.transform = "translateY(8px)";
    }
    setTimeout(() => router.push("/"), 300);
  };

  if (isCoverPage) {
    return (
      <div className="min-h-screen">
        {children}
      </div>
    );
  }

  return (
    <div ref={mainRef} className="min-h-screen">
      {/* Top bar with back link */}
      <header className="sticky top-0 z-30 bg-bg/80 backdrop-blur-md border-b border-border-subtle">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center gap-4">
          <a
            href="/"
            onClick={handleBack}
            className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
              <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            All Chapters
          </a>
          <div className="flex-1" />
        </div>
      </header>
      <main className="flex-1 min-w-0">
        {children}
      </main>
    </div>
  );
}
