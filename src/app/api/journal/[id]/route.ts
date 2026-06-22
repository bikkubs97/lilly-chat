import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/user";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = getTokenFromRequest(req);
    const decoded = verifyToken(token);
    const { id } = await params;

    await connectToDatabase();
    const user = await User.findById(decoded.userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const journalEntry = user.journals.id(id);
    if (!journalEntry) {
      return NextResponse.json({ error: "Journal entry not found" }, { status: 404 });
    }

    return NextResponse.json({ journalEntry });
  } catch (error) {
    console.error("Journal entry GET error:", error);
    return NextResponse.json({ error: "Unable to fetch journal entry" }, { status: 500 });
  }
}
