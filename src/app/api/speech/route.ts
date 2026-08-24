import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const MAX_TTS_INPUT_LENGTH = 4096;

// Audio generation can exceed a platform's short default serverless timeout.
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (typeof text !== "string" || !text.trim()) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    if (text.length > MAX_TTS_INPUT_LENGTH) {
      return NextResponse.json(
        { error: "This message is too long to read aloud." },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "API key not configured" }, { status: 500 });
    }

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const speech = await client.audio.speech.create({
      model: "gpt-4o-mini-tts",
      voice: "coral",
      input: text.trim(),
      instructions: "Speak in a warm, calm, empathetic tone. Keep a gentle and natural pace.",
      response_format: "mp3",
    });

    return new NextResponse(Buffer.from(await speech.arrayBuffer()), {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Speech API error:", error);
    return NextResponse.json({ error: "Unable to create speech right now." }, { status: 500 });
  }
}
