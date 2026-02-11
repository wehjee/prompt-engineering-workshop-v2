"use client";

import { useState } from "react";
import { useApiKey } from "./ApiKeyProvider";

export function ApiKeyInput() {
  const { apiKey, setApiKey, clearApiKey } = useApiKey();
  const [input, setInput] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  if (apiKey && !isEditing) {
    const masked = apiKey.slice(0, 7) + "..." + apiKey.slice(-4);
    return (
      <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-success-light border border-success/10">
        <div className="flex items-center gap-2 text-sm text-success">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
            <path d="M13.333 4L6 11.333 2.667 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>API key active</span>
        </div>
        <code className="text-xs text-text-tertiary font-mono">{masked}</code>
        <div className="ml-auto flex gap-2">
          <button
            onClick={() => { setIsEditing(true); setInput(""); }}
            className="text-xs text-text-tertiary hover:text-text-secondary transition-colors"
          >
            Change
          </button>
          <button
            onClick={clearApiKey}
            className="text-xs text-text-tertiary hover:text-error transition-colors"
          >
            Clear
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-5 py-5 rounded-xl bg-white border border-border">
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <p className="text-sm font-medium text-text mb-1">
            Enter your Anthropic API key to use the interactive examples
          </p>
          <p className="text-xs text-text-tertiary mb-3">
            Your key is stored only in this browser and never sent to our servers.
          </p>
          <div className="flex gap-2">
            <input
              type="password"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && input.trim()) {
                  setApiKey(input.trim());
                  setInput("");
                  setIsEditing(false);
                }
              }}
              placeholder="sk-ant-..."
              className="flex-1 px-3 py-1.5 text-sm rounded-lg border border-border bg-surface placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent font-mono"
            />
            <button
              onClick={() => {
                if (input.trim()) {
                  setApiKey(input.trim());
                  setInput("");
                  setIsEditing(false);
                }
              }}
              disabled={!input.trim()}
              className="px-4 py-1.5 text-sm font-medium rounded-lg bg-black text-white hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Save
            </button>
            {isEditing && (
              <button
                onClick={() => setIsEditing(false)}
                className="px-3 py-1.5 text-sm text-text-tertiary hover:text-text-secondary transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
