import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { isSmtpConfigured, sendWelcomeEmail } from "@/lib/email";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/user";

function hashVerificationToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const { email, token } = await request.json();
    const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";

    if (!normalizedEmail || !token) {
      return NextResponse.json(
        { error: "Email and verification token are required." },
        { status: 400 }
      );
    }

    const user = await User.findOne({
      email: new RegExp(`^${escapeRegExp(normalizedEmail)}$`, "i"),
    }).select("+emailVerificationToken +emailVerificationExpires");

    if (!user) {
      return NextResponse.json(
        { error: "This verification link is invalid or has expired." },
        { status: 400 }
      );
    }

    if (user.emailVerified) {
      return NextResponse.json(
        { message: "Email already verified. You can log in." },
        { status: 200 }
      );
    }

    const tokenMatches = user.emailVerificationToken === hashVerificationToken(token);
    const tokenIsFresh =
      user.emailVerificationExpires && user.emailVerificationExpires > new Date();

    if (!tokenMatches || !tokenIsFresh) {
      return NextResponse.json(
        { error: "This verification link is invalid or has expired." },
        { status: 400 }
      );
    }

    user.emailVerified = true;
    user.emailVerifiedAt = new Date();
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    if (isSmtpConfigured()) {
      sendWelcomeEmail({
        to: user.email,
        nickname: user.nickname,
      }).catch((emailError) => {
        console.error("Welcome email error:", emailError);
      });
    }

    return NextResponse.json(
      { message: "Email verified successfully. You can now log in." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Email verification error:", error);
    return NextResponse.json(
      { error: "Email verification failed. Please try again later." },
      { status: 500 }
    );
  }
}
