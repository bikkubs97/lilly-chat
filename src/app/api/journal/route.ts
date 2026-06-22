import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/user";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";
import { getEmbedding } from "@/lib/embeddings";

export async function GET(req: NextRequest) {
  try {
    const token = getTokenFromRequest(req);
    const decoded = verifyToken(token);

    await connectToDatabase();
    const user = await User.findById(decoded.userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ journals: user.journals || [] });
  } catch (error) {
    console.error("Journal GET error:", error);
    return NextResponse.json({ error: "Unable to fetch journals" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = getTokenFromRequest(req);
    const decoded = verifyToken(token);

    const body = await req.json();
    const { title, content } = body;

    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
    }

    await connectToDatabase();
    const user = await User.findById(decoded.userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const embedding = await getEmbedding(`${title}\n\n${content}`);
    const journalEntry = {
      title,
      content,
      embedding,
      createdAt: new Date(),
    };

    user.journals = [...(user.journals || []), journalEntry];
    await user.save();

    const savedEntry = user.journals[user.journals.length - 1].toObject();
    delete savedEntry.embedding;
    return NextResponse.json({ journalEntry: savedEntry });
  } catch (error) {
    console.error("Journal POST error:", error);
    return NextResponse.json({ error: "Unable to save journal entry" }, { status: 500 });
  }
}
