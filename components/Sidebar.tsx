"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import clsx from "clsx";
import { chapters } from "@/lib/chapters";
import { useTheme } from "./ThemeProvider";

const parts = [
  { key: "beginner", label: "Beginner", range: "Chapters 1\u20133" },
  { key: "intermediate", label: "Intermediate", range: "Chapters 4\u20137" },
  { key: "advanced", label: "Advanced", range: "Chapters 8\u20139" },
] as const;

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const currentId = pathname?.match(/\/chapters\/(\d+)/)?.[1];
  const isHeadshot = pathname === "/headshot";
  const isRetro = theme === "retro";

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 md:hidden p-2 rounded-lg bg-surface border border-border shadow-sm"
        aria-label="Toggle navigation"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          {isOpen ? (
            <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          ) : (
            <path d="M3 5H17M3 10H17M3 15H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          )}
        </svg>
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/20 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          "fixed top-0 left-0 z-40 h-screen w-72 bg-surface border-r border-border flex flex-col transition-transform duration-200 ease-out",
          "md:translate-x-0 md:sticky md:top-0 md:z-auto md:shrink-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="px-5 py-6 border-b border-border-subtle">
          <Link href="/chapters/1" className="block" onClick={() => setIsOpen(false)}>
            {isRetro ? (
              <>
                <h1 className="text-[11px] font-semibold text-accent tracking-wide leading-[1.8] glow-green">
                  PROMPT ENGINEERING WORKSHOP
                </h1>
                <p className="text-base text-text-tertiary mt-1">
                  <span className="coin">★</span> 2nd March 2026
                </p>
              </>
            ) : (
              <>
                <h1 className="text-base font-semibold text-text tracking-tight">
                  Prompt Engineering Workshop
                </h1>
                <p className="text-xs text-text-tertiary mt-0.5">2nd March 2026</p>
              </>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          {parts.map((part) => {
            const partChapters = chapters.filter((c) => c.part === part.key);
            return (
              <div key={part.key} className="mb-2">
                <div className="px-5 py-2">
                  {isRetro ? (
                    <span className="part-label-retro">
                      {part.key === "beginner" ? "★" : part.key === "intermediate" ? "★★" : "★★★"}{" "}
                      {part.label.toUpperCase()}
                    </span>
                  ) : (
                    <span className="text-[11px] font-medium uppercase tracking-wider text-text-tertiary">
                      {part.label}
                    </span>
                  )}
                </div>
                {partChapters.map((chapter) => {
                  const isActive = currentId === String(chapter.id);
                  return (
                    <Link
                      key={chapter.id}
                      href={`/chapters/${chapter.id}`}
                      onClick={() => setIsOpen(false)}
                      className={clsx(
                        "flex items-baseline gap-3 px-5 py-2 text-sm transition-colors",
                        isRetro && "nav-item-retro",
                        isActive
                          ? "text-accent bg-accent-light font-medium"
                          : "text-text-secondary hover:text-text hover:bg-surface-alt",
                        isRetro && isActive && "active"
                      )}
                    >
                      <span className={clsx(
                        "text-xs tabular-nums shrink-0",
                        isActive ? "text-accent" : "text-text-tertiary"
                      )}>
                        {isRetro ? String(chapter.id).padStart(2, "0") : `${chapter.id}.`}
                      </span>
                      <span className="leading-snug">{chapter.title}</span>
                    </Link>
                  );
                })}
              </div>
            );
          })}

          {/* Bonus section */}
          <div className="mt-4 pt-4 border-t border-border-subtle">
            <div className="px-5 py-2">
              {isRetro ? (
                <span className="part-label-retro">★ BONUS</span>
              ) : (
                <span className="text-[11px] font-medium uppercase tracking-wider text-text-tertiary">
                  Bonus
                </span>
              )}
            </div>
            <Link
              href="/headshot"
              onClick={() => setIsOpen(false)}
              className={clsx(
                "flex items-center gap-3 px-5 py-2 text-sm transition-colors",
                isRetro && "nav-item-retro",
                isHeadshot
                  ? "text-accent bg-accent-light font-medium"
                  : "text-text-secondary hover:text-text hover:bg-surface-alt",
                isRetro && isHeadshot && "active"
              )}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
                <circle cx="8" cy="5.5" r="3" stroke="currentColor" strokeWidth="1.25"/>
                <path d="M2.5 14c0-3 2.5-4.5 5.5-4.5s5.5 1.5 5.5 4.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/>
              </svg>
              <span className="leading-snug">AI Headshot</span>
            </Link>
          </div>
        </nav>

        {/* Theme Toggle */}
        <div className="px-5 py-4 border-t border-border-subtle">
          <button
            onClick={toggleTheme}
            className="theme-toggle w-full"
            aria-label="Toggle theme"
          >
            {isRetro ? (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 text-text-tertiary">
                <rect x="2" y="3" width="12" height="10" stroke="currentColor" strokeWidth="1.25"/>
                <path d="M4 13v1M12 13v1" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/>
                <rect x="4" y="5" width="8" height="6" fill="currentColor" opacity="0.15"/>
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 text-text-tertiary">
                <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.25"/>
                <path d="M8 2v1.5M8 12.5V14M2 8h1.5M12.5 8H14M3.76 3.76l1.06 1.06M11.18 11.18l1.06 1.06M12.24 3.76l-1.06 1.06M4.82 11.18l-1.06 1.06" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/>
              </svg>
            )}
            <span className={clsx(
              "flex-1 text-left",
              isRetro
                ? "text-text-secondary text-sm"
                : "text-xs text-text-tertiary"
            )}>
              {isRetro ? "RETRO MODE" : "Retro mode"}
            </span>
            <div className="theme-toggle-track" data-active={isRetro ? "true" : "false"}>
              <div className="theme-toggle-thumb" />
            </div>
          </button>
        </div>
      </aside>
    </>
  );
}
