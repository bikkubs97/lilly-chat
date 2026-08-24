import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const MAX_AUDIO_SIZE = 10 * 1024 * 1024;

// Transcription latency varies with recording length, especially from a cold start.
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const audio = formData.get("audio");

    if (!(audio instanceof File) || audio.size === 0) {
      return NextResponse.json({ error: "An audio recording is required" }, { status: 400 });
    }

    if (audio.size > MAX_AUDIO_SIZE) {
      return NextResponse.json({ error: "Please keep recordings under 10 MB." }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "API key not configured" }, { status: 500 });
    }

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const transcription = await client.audio.transcriptions.create({
      file: audio,
      model: "gpt-4o-mini-transcribe",
    });

    return NextResponse.json({ transcript: transcription.text });
  } catch (error) {
    console.error("Transcription API error:", error);
    return NextResponse.json({ error: "Unable to transcribe audio right now." }, { status: 500 });
  }
}
