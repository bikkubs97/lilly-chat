import crypto from "crypto";
import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/user";

const strongPasswordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&^_-]).*$/;

function hashResetToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const { email, token, password } = await request.json();
    const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";

    if (!normalizedEmail || !token || !password) {
      return NextResponse.json(
        { error: "Email, reset token, and new password are required." },
        { status: 400 }
      );
    }

    if (typeof password !== "string" || password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    if (!strongPasswordRegex.test(password)) {
      return NextResponse.json(
        {
          error:
            "Password must contain at least one letter, one number, and one special character.",
        },
        { status: 400 }
      );
    }

    const user = await User.findOne({
      email: new RegExp(`^${escapeRegExp(normalizedEmail)}$`, "i"),
      resetPasswordToken: hashResetToken(token),
      resetPasswordExpires: { $gt: new Date() },
    }).select("+resetPasswordToken +resetPasswordExpires");

    if (!user) {
      return NextResponse.json(
        { error: "This reset link is invalid or has expired." },
        { status: 400 }
      );
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return NextResponse.json(
      { message: "Password reset successful. You can now log in." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "Password reset failed. Please try again later." },
      { status: 500 }
    );
  }
}
