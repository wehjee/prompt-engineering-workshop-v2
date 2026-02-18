"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Chapter, Section } from "@/lib/types";
import { CodeBlock } from "./CodeBlock";
import { Playground } from "./Playground";
import { ExerciseBlock } from "./ExerciseBlock";
import { Suspense, lazy, useEffect, useState } from "react";

const Dithering = lazy(() =>
  import("@paper-design/shaders-react").then((mod) => ({ default: mod.Dithering }))
);

function MarkdownContent({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ children }) => (
          <h1 className="text-2xl font-semibold text-text mt-10 mb-4 tracking-tight">{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-xl font-semibold text-text mt-8 mb-3 tracking-tight">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-base font-semibold text-text mt-6 mb-2">{children}</h3>
        ),
        p: ({ children }) => (
          <p className="text-[15px] text-text-secondary leading-relaxed mb-4">{children}</p>
        ),
        ul: ({ children }) => (
          <ul className="text-[15px] text-text-secondary leading-relaxed mb-4 pl-5 space-y-1 list-disc">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="text-[15px] text-text-secondary leading-relaxed mb-4 pl-5 space-y-1 list-decimal">{children}</ol>
        ),
        li: ({ children }) => (
          <li className="text-text-secondary">{children}</li>
        ),
        strong: ({ children }) => (
          <strong className="font-semibold text-text">{children}</strong>
        ),
        em: ({ children }) => (
          <em className="italic">{children}</em>
        ),
        code: ({ className, children }) => {
          const isBlock = className?.includes("language-");
          if (isBlock) {
            const lang = className?.replace("language-", "") || "";
            return <CodeBlock code={String(children).trimEnd()} language={lang} />;
          }
          return (
            <code className="text-sm font-mono bg-surface-alt text-accent px-1.5 py-0.5 rounded">
              {children}
            </code>
          );
        },
        pre: ({ children }) => <>{children}</>,
        blockquote: ({ children }) => (
          <blockquote className="border-l-2 border-accent/30 pl-4 my-4 text-text-secondary italic">
            {children}
          </blockquote>
        ),
        a: ({ href, children }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:text-accent-hover underline underline-offset-2 transition-colors"
          >
            {children}
          </a>
        ),
        hr: () => <hr className="border-border my-8" />,
        table: ({ children }) => (
          <div className="overflow-x-auto my-4">
            <table className="w-full text-sm border-collapse">{children}</table>
          </div>
        ),
        th: ({ children }) => (
          <th className="text-left px-3 py-2 bg-surface-alt border border-border font-medium text-text">{children}</th>
        ),
        td: ({ children }) => (
          <td className="px-3 py-2 border border-border text-text-secondary">{children}</td>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

function SectionRenderer({ section }: { section: Section }) {
  switch (section.type) {
    case "text":
      return <MarkdownContent content={section.content} />;
    case "code":
      return <CodeBlock code={section.code} language={section.language} title={section.title} />;
    case "playground":
      return (
        <Playground
          title={section.title}
          description={section.description}
          defaultSystemPrompt={section.defaultSystemPrompt}
          defaultUserMessage={section.defaultUserMessage}
          model={section.model}
          temperature={section.temperature}
        />
      );
    case "exercise":
      return (
        <ExerciseBlock
          title={section.title}
          description={section.description}
          defaultSystemPrompt={section.defaultSystemPrompt}
          defaultUserMessage={section.defaultUserMessage}
          hint={section.hint}
          validation={section.validation}
        />
      );
    default:
      return null;
  }
}

export function LessonContent({ chapter }: { chapter: Chapter }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Trigger on next frame so the initial state renders first
    requestAnimationFrame(() => setMounted(true));
  }, []);

  const partColors: Record<string, string> = {
    beginner: "#34D25c",
    intermediate: "#3b82f6",
    advanced: "#a855f7",
  };
  const shaderColor = partColors[chapter.part] || "#34D25c";

  return (
    <article
      style={{
        opacity: mounted ? 1 : 0,
        transform: mounted ? "translateY(0)" : "translateY(16px)",
        transition: "opacity 500ms cubic-bezier(0.16, 1, 0.3, 1), transform 500ms cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      {/* Chapter hero with dithering */}
      <div className="relative overflow-hidden">
        <Suspense fallback={<div className="absolute inset-0 bg-surface-alt/20" />}>
          <div className="absolute inset-0 z-0 pointer-events-none opacity-30 mix-blend-multiply">
            <Dithering
              colorBack="#00000000"
              colorFront={shaderColor}
              shape="warp"
              type="4x4"
              speed={0.15}
              className="size-full"
              minPixelRatio={1}
            />
          </div>
        </Suspense>
        <div className="relative z-10 max-w-3xl mx-auto px-6 md:px-8 pt-16 pb-12">
          <span className="text-xs font-semibold uppercase tracking-wider text-accent">
            {chapter.partLabel}
          </span>
          <h1 className="text-3xl font-semibold text-text mt-2 mb-3 tracking-tight">
            {chapter.title}
          </h1>
          <p className="text-base text-text-secondary leading-relaxed">
            {chapter.description}
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 md:px-8 py-12">

      {/* Sections */}
      {chapter.sections.map((section, index) => (
        <SectionRenderer key={index} section={section} />
      ))}

      {/* Chapter footer navigation */}
      <div className="mt-16 pt-8 border-t border-border flex justify-between items-center">
        {chapter.id > 1 ? (
          <a
            href={`/chapters/${chapter.id - 1}`}
            className="text-sm text-text-secondary hover:text-accent transition-colors flex items-center gap-1"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 4L6 8L10 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Previous
          </a>
        ) : (
          <div />
        )}
        {chapter.id < 8 ? (
          <a
            href={`/chapters/${chapter.id + 1}`}
            className="text-sm text-text-secondary hover:text-accent transition-colors flex items-center gap-1"
          >
            Next
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        ) : (
          <div />
        )}
      </div>
      </div>
    </article>
  );
}
