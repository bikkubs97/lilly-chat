import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { isSmtpConfigured, sendPasswordResetEmail } from "@/lib/email";
import User from "@/models/user";

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000;

function hashResetToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const { email } = await request.json();
    const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";

    if (!normalizedEmail) {
      return NextResponse.json(
        { error: "Email is required." },
        { status: 400 }
      );
    }

    const publicMessage =
      "If an account exists for that email, a password reset link has been created.";

    const user = await User.findOne({
      email: new RegExp(`^${escapeRegExp(normalizedEmail)}$`, "i"),
    }).select("+resetPasswordToken +resetPasswordExpires");

    if (!user) {
      return NextResponse.json({ message: publicMessage }, { status: 200 });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = hashResetToken(resetToken);
    user.resetPasswordExpires = new Date(Date.now() + RESET_TOKEN_TTL_MS);
    await user.save();

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin;
    const resetUrl = new URL("/reset-password", appUrl);
    resetUrl.searchParams.set("email", normalizedEmail);
    resetUrl.searchParams.set("token", resetToken);

    if (isSmtpConfigured()) {
      try {
        await sendPasswordResetEmail({
          to: user.email,
          resetUrl: resetUrl.toString(),
        });
      } catch (emailError) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        console.error("Password reset email error:", emailError);
        return NextResponse.json(
          { error: "Could not send reset email. Please try again later." },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      {
        message: publicMessage,
        resetLink:
          !isSmtpConfigured() && process.env.NODE_ENV !== "production"
            ? resetUrl.toString()
            : undefined,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Password reset failed. Please try again later." },
      { status: 500 }
    );
  }
}
