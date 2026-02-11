import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { geminiKey, imageBase64, mimeType, prompt } = body;

  if (!geminiKey || typeof geminiKey !== "string") {
    return NextResponse.json({ error: "Gemini API key is required" }, { status: 400 });
  }

  if (!imageBase64 || typeof imageBase64 !== "string") {
    return NextResponse.json({ error: "Image data is required" }, { status: 400 });
  }

  const geminiBody = {
    contents: [
      {
        parts: [
          { text: prompt || "Transform this photo into a professional corporate headshot with studio lighting, neutral background, and professional appearance. Maintain the exact facial features and identity of the person." },
          {
            inline_data: {
              mime_type: mimeType || "image/jpeg",
              data: imageBase64,
            },
          },
        ],
      },
    ],
    generationConfig: {
      responseModalities: ["TEXT", "IMAGE"],
      imageConfig: {
        aspectRatio: "1:1",
        imageSize: "2K",
      },
    },
  };

  try {
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image-preview:generateContent?key=${geminiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(geminiBody),
      }
    );

    const data = await geminiResponse.json();

    if (!geminiResponse.ok) {
      const errorMessage = data.error?.message || "Gemini API error";
      return NextResponse.json({ error: errorMessage }, { status: geminiResponse.status });
    }

    // Extract image and text from response
    const parts = data.candidates?.[0]?.content?.parts || [];
    const images: { mimeType: string; data: string }[] = [];
    let text = "";

    for (const part of parts) {
      if (part.inlineData || part.inline_data) {
        const inlineData = part.inlineData || part.inline_data;
        images.push({
          mimeType: inlineData.mimeType || inlineData.mime_type,
          data: inlineData.data,
        });
      }
      if (part.text) {
        text += part.text;
      }
    }

    if (images.length === 0) {
      return NextResponse.json(
        { error: text || "No image was generated. Try a different photo or prompt." },
        { status: 422 }
      );
    }

    return NextResponse.json({ images, text });
  } catch {
    return NextResponse.json({ error: "Failed to reach Gemini API" }, { status: 502 });
  }
}
