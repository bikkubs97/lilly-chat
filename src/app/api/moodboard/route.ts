import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/user";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const token = getTokenFromRequest(req);
    const decoded = verifyToken(token);

    await connectToDatabase();
    const user = await User.findById(decoded.userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ moodboard: user.moodboard || [] });
  } catch (error) {
    console.error("Moodboard GET error:", error);
    return NextResponse.json({ error: "Unable to fetch moodboard" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = getTokenFromRequest(req);
    const decoded = verifyToken(token);

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "OpenAI API key not configured" }, { status: 500 });
    }

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const body = await req.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages" }, { status: 400 });
    }

    const conversationText = messages
      .filter((message: { role: string }) => message.role !== "system")
      .map((message: { role: string; content: string }) =>
        `${message.role === "assistant" ? "Lilly" : "User"}: ${message.content}`
      )
      .join("\n");

    const analysisPrompt = `You are Lilly, a warm and caring mental health companion. Read the conversation below and infer a short overall mood label, a short emotional word, and a brief note. Respond with valid JSON only in this format: {"mood":"...","emotion":"...","note":"..."}.

Conversation:
${conversationText}`;

    const response = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content:
            "You are Lilly, an empathetic and gentle AI mental health companion.",
        },
        {
          role: "user",
          content: analysisPrompt,
        },
      ],
      temperature: 0.3,
      max_tokens: 200,
    });

    const raw = response.choices?.[0]?.message?.content || "";
    const analysis: { mood: string; emotion: string; note: string } = (() => {
      try {
        const jsonText = raw.slice(raw.indexOf("{"), raw.lastIndexOf("}") + 1);
        return JSON.parse(jsonText);
      } catch {
        return {
          mood: "calm",
          emotion: "neutral",
          note: "Could not infer mood precisely from the conversation.",
        };
      }
    })();

    await connectToDatabase();
    const user = await User.findById(decoded.userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const moodEntry = {
      date: new Date(),
      mood: analysis.mood || "neutral",
      emotion: analysis.emotion || "neutral",
      note: analysis.note || "Mood registered automatically after session end.",
    };

    user.moodboard = [...(user.moodboard || []), moodEntry];
    await user.save();

    return NextResponse.json({ moodEntry });
  } catch (error) {
    console.error("Moodboard API error:", error);
    return NextResponse.json(
      { error: "Unable to save mood entry" },
      { status: 500 }
    );
  }
}
