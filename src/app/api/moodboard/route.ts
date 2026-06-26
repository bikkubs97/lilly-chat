import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/user";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";

type MoodAnalysis = {
  mood: string;
  emotion: string;
  note: string;
};

type MoodMessage = {
  role?: string;
  content?: unknown;
};

function cleanAnalysisValue(value: unknown, fallback: string) {
  if (typeof value !== "string") return fallback;
  const cleaned = value.trim().replace(/\s+/g, " ");
  return cleaned || fallback;
}

function parseMoodAnalysis(raw: string): MoodAnalysis {
  try {
    const jsonText = raw.slice(raw.indexOf("{"), raw.lastIndexOf("}") + 1);
    const parsed = JSON.parse(jsonText);

    return {
      mood: cleanAnalysisValue(parsed.mood, "neutral").slice(0, 40),
      emotion: cleanAnalysisValue(parsed.emotion, "unclear").slice(0, 40),
      note: cleanAnalysisValue(
        parsed.note,
        "Could not infer the user's mood precisely from their messages."
      ).slice(0, 240),
    };
  } catch {
    return {
      mood: "neutral",
      emotion: "unclear",
      note: "Could not infer the user's mood precisely from their messages.",
    };
  }
}

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

    const conversationMessages = messages
      .filter((message: MoodMessage): message is { role: string; content: string } => (
        (message.role === "user" || message.role === "assistant") &&
        typeof message.content === "string" &&
        message.content.trim().length > 0
      ))
      .slice(-16);

    const userMessages = conversationMessages.filter((message) => message.role === "user");

    if (userMessages.length === 0) {
      return NextResponse.json({ error: "No user messages to analyze" }, { status: 400 });
    }

    const conversationText = messages
      .filter((message: MoodMessage): message is { role: string; content: string } => (
        (message.role === "user" || message.role === "assistant") &&
        typeof message.content === "string" &&
        message.content.trim().length > 0
      ))
      .slice(-16)
      .map((message) =>
        `${message.role === "assistant" ? "Lilly" : "User"}: ${message.content}`
      )
      .join("\n");

    const userText = userMessages
      .map((message, index) => `${index + 1}. ${message.content}`)
      .join("\n");

    const analysisPrompt = `Analyze only the user's own messages to infer how the user seems to feel. Lilly's messages are context only; do not treat Lilly's supportive tone, suggestions, or wording as the user's mood.

Return valid JSON only in this format: {"mood":"...","emotion":"...","note":"..."}.

Rules:
- "mood" should be a short broad label such as happy, sad, anxious, angry, stressed, overwhelmed, lonely, hopeful, calm, neutral, or crisis.
- "emotion" should be the most specific feeling you can infer from the user's words.
- If the user expresses mixed feelings, choose the strongest current feeling and mention the mix in "note".
- If the user's feeling is unclear, use mood "neutral" and emotion "unclear".
- The note must describe the user's expressed feeling, not Lilly's response.

User messages to analyze:
${userText}

Conversation context, for reference only:
${conversationText}`;

    const response = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content:
            "You extract the user's emotional state from user-authored messages only. Ignore assistant tone when deciding mood.",
        },
        {
          role: "user",
          content: analysisPrompt,
        },
      ],
      temperature: 0.3,
      max_tokens: 200,
      response_format: { type: "json_object" },
    });

    const raw = response.choices?.[0]?.message?.content || "";
    const analysis = parseMoodAnalysis(raw);

    const moodEntry = {
      date: new Date(),
      mood: analysis.mood || "neutral",
      emotion: analysis.emotion || "neutral",
      note: analysis.note || "Mood registered automatically after session end.",
    };

    await connectToDatabase();
    const user = await User.findByIdAndUpdate(
      decoded.userId,
      { $push: { moodboard: moodEntry } },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ moodEntry });
  } catch (error) {
    console.error("Moodboard API error:", error);
    return NextResponse.json(
      { error: "Unable to save mood entry" },
      { status: 500 }
    );
  }
}
