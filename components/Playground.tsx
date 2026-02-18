"use client";

import { useState, useCallback } from "react";
import clsx from "clsx";
import { useApiKey } from "./ApiKeyProvider";
import { sendMessage } from "@/lib/api";

interface PlaygroundProps {
  title?: string;
  description?: string;
  defaultSystemPrompt?: string;
  defaultUserMessage: string;
  model?: string;
  temperature?: number;
}

export function Playground({
  title,
  description,
  defaultSystemPrompt = "",
  defaultUserMessage,
  model,
  temperature,
}: PlaygroundProps) {
  const { apiKey } = useApiKey();
  const [systemPrompt, setSystemPrompt] = useState(defaultSystemPrompt);
  const [userMessage, setUserMessage] = useState(defaultUserMessage);
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSystem, setShowSystem] = useState(!!defaultSystemPrompt);

  const handleSend = useCallback(async () => {
    if (!apiKey) {
      setError("Please enter your API key above to use the playground.");
      return;
    }
    if (!userMessage.trim()) {
      setError("Please enter a message.");
      return;
    }

    setIsLoading(true);
    setError("");
    setResponse("");

    try {
      const result = await sendMessage({
        apiKey,
        messages: [{ role: "user", content: userMessage }],
        system: systemPrompt || undefined,
        model,
        temperature,
      });

      const text = result.content
        .filter((c) => c.type === "text")
        .map((c) => c.text)
        .join("\n");

      setResponse(text);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }, [apiKey, userMessage, systemPrompt, model, temperature]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="rounded-xl border border-border bg-playground-bg my-6">
      {/* Header */}
      {(title || description) && (
        <div className="px-5 pt-5 pb-0">
          {title && (
            <h3 className="text-sm font-semibold text-text mb-1">{title}</h3>
          )}
          {description && (
            <p className="text-sm text-text-secondary">{description}</p>
          )}
        </div>
      )}

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
            User message
          </label>
          <textarea
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter your message..."
            rows={4}
            className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-surface placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/40 resize-y"
          />
        </div>

        {/* Send button */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleSend}
            disabled={isLoading || !userMessage.trim()}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-accent text-white hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? "Sending..." : "Send to AI"}
          </button>
          <span className="text-xs text-text-tertiary">
            {typeof navigator !== "undefined" && navigator.platform?.includes("Mac") ? "\u2318" : "Ctrl"}+Enter
          </span>
        </div>

        {/* Error */}
        {error && (
          <div className="px-3 py-2 text-sm text-error bg-error-light rounded-lg border border-error/10">
            {error}
          </div>
        )}

        {/* Response */}
        {(response || isLoading) && (
          <div className="mt-4">
            <label className="text-xs font-medium text-text-secondary mb-1 block">
              AI&apos;s response
            </label>
            <div className="px-4 py-3 rounded-lg border border-border bg-surface min-h-[60px]">
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
