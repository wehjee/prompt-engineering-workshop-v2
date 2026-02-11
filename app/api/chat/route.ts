import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { apiKey, model, system, messages, max_tokens, temperature, stop_sequences } = body;

  if (!apiKey || typeof apiKey !== "string") {
    return NextResponse.json({ error: "API key is required" }, { status: 400 });
  }

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: "Messages array is required" }, { status: 400 });
  }

  const anthropicBody: Record<string, unknown> = {
    model: model || "claude-sonnet-4-5-20250929",
    messages,
    max_tokens: max_tokens || 1024,
  };

  if (system) anthropicBody.system = system;
  if (temperature !== undefined) anthropicBody.temperature = temperature;
  if (stop_sequences) anthropicBody.stop_sequences = stop_sequences;

  try {
    const anthropicResponse = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(anthropicBody),
    });

    const data = await anthropicResponse.json();

    if (!anthropicResponse.ok) {
      return NextResponse.json(
        { error: data.error?.message || "Anthropic API error" },
        { status: anthropicResponse.status }
      );
    }

    return NextResponse.json({
      content: data.content,
      model: data.model,
      stop_reason: data.stop_reason,
      usage: data.usage,
    });
  } catch {
    return NextResponse.json({ error: "Failed to reach Anthropic API" }, { status: 502 });
  }
}
