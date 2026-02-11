"use client";

import { useState } from "react";
import clsx from "clsx";

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
}

export function CodeBlock({ code, language, title }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-lg overflow-hidden border border-border bg-code-bg my-4">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-code-bg border-b border-white/5">
        <span className="text-xs text-white/40 font-mono">
          {title || language || "code"}
        </span>
        <button
          onClick={handleCopy}
          className={clsx(
            "text-xs transition-colors",
            copied ? "text-green-400" : "text-white/30 hover:text-white/60"
          )}
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      {/* Code */}
      <div className="overflow-x-auto">
        <pre className="px-4 py-3 text-sm leading-relaxed">
          <code className="text-white/85 font-mono">{code}</code>
        </pre>
      </div>
    </div>
  );
}
