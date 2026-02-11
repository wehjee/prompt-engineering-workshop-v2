"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface ApiKeyContextValue {
  apiKey: string;
  setApiKey: (key: string) => void;
  clearApiKey: () => void;
  geminiKey: string;
  setGeminiKey: (key: string) => void;
  clearGeminiKey: () => void;
}

const ApiKeyContext = createContext<ApiKeyContextValue>({
  apiKey: "",
  setApiKey: () => {},
  clearApiKey: () => {},
  geminiKey: "",
  setGeminiKey: () => {},
  clearGeminiKey: () => {},
});

export function useApiKey() {
  return useContext(ApiKeyContext);
}

export function ApiKeyProvider({ children }: { children: ReactNode }) {
  const [apiKey, setApiKeyState] = useState("");
  const [geminiKey, setGeminiKeyState] = useState("");

  useEffect(() => {
    const stored = sessionStorage.getItem("anthropic-api-key");
    if (stored) setApiKeyState(stored);
    const storedGemini = sessionStorage.getItem("gemini-api-key");
    if (storedGemini) setGeminiKeyState(storedGemini);
  }, []);

  const setApiKey = (key: string) => {
    setApiKeyState(key);
    sessionStorage.setItem("anthropic-api-key", key);
  };

  const clearApiKey = () => {
    setApiKeyState("");
    sessionStorage.removeItem("anthropic-api-key");
  };

  const setGeminiKey = (key: string) => {
    setGeminiKeyState(key);
    sessionStorage.setItem("gemini-api-key", key);
  };

  const clearGeminiKey = () => {
    setGeminiKeyState("");
    sessionStorage.removeItem("gemini-api-key");
  };

  return (
    <ApiKeyContext.Provider value={{ apiKey, setApiKey, clearApiKey, geminiKey, setGeminiKey, clearGeminiKey }}>
      {children}
    </ApiKeyContext.Provider>
  );
}
