"use client";

import { CTASection } from "@/components/ui/hero-dithering-card";
import { TiltCard } from "@/components/ui/tilt-card";
import { ApiKeyInput } from "@/components/ApiKeyInput";
import { chapters } from "@/lib/chapters";

const parts = [
  { key: "beginner" as const, label: "Part 1 — Beginner", range: "Chapters 1–3" },
  { key: "intermediate" as const, label: "Part 2 — Intermediate", range: "Chapters 4–6" },
  { key: "advanced" as const, label: "Part 3 — Advanced", range: "Chapters 7–8" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-bg">
      <CTASection />

      {/* API Key + Chapter Cards */}
      <section id="chapters" className="w-full max-w-6xl mx-auto px-6 pb-24 pt-16">
        {/* API Key Input */}
        <div className="mb-16 max-w-2xl mx-auto">
          <ApiKeyInput />
        </div>

        {parts.map((part) => {
          const partChapters = chapters.filter((c) => c.part === part.key);
          return (
            <div key={part.key} className="mb-16">
              <div className="mb-6">
                <h3 className="text-xs font-medium uppercase tracking-wider text-text-tertiary">
                  {part.label}
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {partChapters.map((chapter) => (
                  <TiltCard
                    key={chapter.id}
                    title={chapter.title}
                    description={chapter.description}
                    chapter={chapter.id}
                    part={chapter.part}
                    href={`/chapters/${chapter.id}`}
                  />
                ))}
              </div>
            </div>
          );
        })}

        {/* Bonus */}
        <div className="mb-16">
          <div className="mb-6">
            <h3 className="text-xs font-medium uppercase tracking-wider text-text-tertiary">
              Bonus
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <TiltCard
              title="AI Headshot"
              description="Generate a professional AI headshot using vision capabilities and prompt engineering techniques."
              chapter={9}
              part="advanced"
              href="/headshot"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
