export interface ChatRequest {
  apiKey: string;
  messages: { role: string; content: string }[];
  system?: string;
  model?: string;
  temperature?: number;
  max_tokens?: number;
  stop_sequences?: string[];
}

export interface ChatResponse {
  content: { type: string; text: string }[];
  model: string;
  stop_reason: string;
  usage: { input_tokens: number; output_tokens: number };
}

export async function sendMessage(params: ChatRequest): Promise<ChatResponse> {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Request failed");
  }

  return data;
}
