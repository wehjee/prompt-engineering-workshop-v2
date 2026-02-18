"use client";

import { useState, useCallback } from "react";
import clsx from "clsx";
import { useApiKey } from "./ApiKeyProvider";
import { sendMessage } from "@/lib/api";

interface ExerciseBlockProps {
  title: string;
  description: string;
  defaultSystemPrompt?: string;
  defaultUserMessage: string;
  hint: string;
  validation: {
    type: "contains" | "regex";
    pattern: string;
    flags?: string;
  };
}

export function ExerciseBlock({
  title,
  description,
  defaultSystemPrompt = "",
  defaultUserMessage,
  hint,
  validation,
}: ExerciseBlockProps) {
  const { apiKey } = useApiKey();
  const [systemPrompt, setSystemPrompt] = useState(defaultSystemPrompt);
  const [userMessage, setUserMessage] = useState(defaultUserMessage);
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [showSystem, setShowSystem] = useState(!!defaultSystemPrompt);
  const [result, setResult] = useState<"pass" | "fail" | null>(null);

  const validate = (text: string): boolean => {
    if (validation.type === "contains") {
      return text.includes(validation.pattern);
    }
    const regex = new RegExp(validation.pattern, validation.flags || "");
    return regex.test(text);
  };

  const handleSend = useCallback(async () => {
    if (!apiKey) {
      setError("Please enter your API key above to use exercises.");
      return;
    }
    if (!userMessage.trim()) {
      setError("Please enter a message.");
      return;
    }

    setIsLoading(true);
    setError("");
    setResponse("");
    setResult(null);

    try {
      const data = await sendMessage({
        apiKey,
        messages: [{ role: "user", content: userMessage }],
        system: systemPrompt || undefined,
      });

      const text = data.content
        .filter((c) => c.type === "text")
        .map((c) => c.text)
        .join("\n");

      setResponse(text);
      setResult(validate(text) ? "pass" : "fail");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }, [apiKey, userMessage, systemPrompt, validation]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="rounded-xl border-2 border-dashed border-border bg-surface my-6">
      {/* Header */}
      <div className="px-5 pt-5 pb-3 border-b border-border-subtle">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-accent">
            Exercise
          </span>
          {result === "pass" && (
            <span className="text-xs font-medium text-success bg-success-light px-2 py-0.5 rounded-full">
              Passed
            </span>
          )}
          {result === "fail" && (
            <span className="text-xs font-medium text-error bg-error-light px-2 py-0.5 rounded-full">
              Not quite
            </span>
          )}
        </div>
        <h3 className="text-sm font-semibold text-text">{title}</h3>
        <p className="text-sm text-text-secondary mt-1">{description}</p>
      </div>

      <div className="p-5 space-y-3">
        {/* System prompt toggle */}
        <div>
          <button
            onClick={() => setShowSystem(!showSystem)}
            className="text-xs font-medium text-text-tertiary hover:text-text-secondary transition-colors flex items-center gap-1"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              className={clsx("transition-transform", showSystem && "rotate-90")}
            >
              <path d="M4 3L8 6L4 9" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            System prompt
          </button>
          {showSystem && (
            <textarea
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter a system prompt (optional)..."
              rows={3}
              className="mt-2 w-full px-3 py-2 text-sm rounded-lg border border-border bg-surface placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/40 resize-y font-mono"
            />
          )}
        </div>

        {/* User message */}
        <div>
          <label className="text-xs font-medium text-text-secondary mb-1 block">
            Your prompt
          </label>
          <textarea
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Write your prompt here..."
            rows={4}
            className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-white placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/40 resize-y"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={handleSend}
            disabled={isLoading || !userMessage.trim()}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-accent text-white hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? "Checking..." : "Check Answer"}
          </button>
          <button
            onClick={() => setShowHint(!showHint)}
            className="text-xs font-medium text-text-tertiary hover:text-accent transition-colors"
          >
            {showHint ? "Hide hint" : "Show hint"}
          </button>
          <span className="text-xs text-text-tertiary">
            {typeof navigator !== "undefined" && navigator.platform?.includes("Mac") ? "\u2318" : "Ctrl"}+Enter
          </span>
        </div>

        {/* Hint */}
        {showHint && (
          <div className="px-3 py-2 text-sm text-text-secondary bg-surface-alt rounded-lg border border-border-subtle">
            <span className="font-medium text-text-tertiary text-xs uppercase tracking-wide">Hint: </span>
            {hint}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="px-3 py-2 text-sm text-error bg-error-light rounded-lg border border-error/10">
            {error}
          </div>
        )}

        {/* Response */}
        {(response || isLoading) && (
          <div>
            <label className="text-xs font-medium text-text-secondary mb-1 block">
              AI&apos;s response
            </label>
            <div className={clsx(
              "px-4 py-3 rounded-lg border min-h-[60px]",
              result === "pass" && "border-success/30 bg-success-light",
              result === "fail" && "border-error/20 bg-error-light",
              !result && "border-border bg-surface"
            )}>
              {isLoading ? (
                <div className="flex items-center gap-2 text-sm text-text-tertiary">
                  <span className="inline-flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-text-tertiary animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-text-tertiary animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-text-tertiary animate-bounce" style={{ animationDelay: "300ms" }} />
                  </span>
                  Thinking...
                </div>
              ) : (
                <pre className="text-sm text-text whitespace-pre-wrap leading-relaxed font-sans">
                  {response}
                </pre>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
