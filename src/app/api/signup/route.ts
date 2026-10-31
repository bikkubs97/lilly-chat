import connectToDatabase from "@/lib/mongodb";
import { isSmtpConfigured, sendVerificationEmail } from "@/lib/email";
import User from "@/models/user";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { checkRateLimit } from "@/lib/rate-limit";

const EMAIL_VERIFICATION_TOKEN_TTL_MS = 24 * 60 * 60 * 1000;
const strongPasswordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&^_-]).*$/;

function hashVerificationToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const clientIdentifier = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
    const signupRateLimit = checkRateLimit(`signup:ip:${clientIdentifier.split(",")[0]?.trim() || "unknown"}`, 5, 60 * 60 * 1000);
    if (!signupRateLimit.allowed) {
      const retryAfter = Math.max(1, Math.ceil((signupRateLimit.resetAt - Date.now()) / 1000));
      return NextResponse.json(
        { error: "Too many signup attempts. Please wait a moment and try again." },
        { status: 429, headers: { "Retry-After": String(retryAfter) } }
      );
    }

    const { nickname, email, password } = await request.json();
    const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";

    if (!nickname || !normalizedEmail || typeof password !== "string" || password.length < 6 || password.length > 128) {
      return NextResponse.json(
        { error: "Nickname, email, and password are required. Passwords must be at least 6 characters long." },
        { status: 400 }
      );
    }

    if (!strongPasswordRegex.test(password)) {
      return NextResponse.json(
        { error: "Password must contain at least one letter, one number, and one special character." },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({
      email: new RegExp(`^${escapeRegExp(normalizedEmail)}$`, "i"),
    });
    if (existingUser) {
      return NextResponse.json(
        { error: "A user with that email already exists." },
        { status: 409 }
      );
    }

    if (!isSmtpConfigured() && process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { error: "Email verification is temporarily unavailable. Please try again later." },
        { status: 500 }
      );
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const newUser = await User.create({
      nickname,
      email: normalizedEmail,
      password: hashedPassword,
      emailVerified: false,
      emailVerificationToken: hashVerificationToken(verificationToken),
      emailVerificationExpires: new Date(Date.now() + EMAIL_VERIFICATION_TOKEN_TTL_MS),
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin;
    const verificationUrl = new URL("/verify-email", appUrl);
    verificationUrl.searchParams.set("email", normalizedEmail);
    verificationUrl.searchParams.set("token", verificationToken);

    if (isSmtpConfigured()) {
      try {
        await sendVerificationEmail({
          to: newUser.email,
          nickname: newUser.nickname,
          verificationUrl: verificationUrl.toString(),
        });
      } catch (emailError) {
        await User.findByIdAndDelete(newUser._id);

        console.error("Verification email error:", emailError);
        return NextResponse.json(
          { error: "Could not send verification email. Please try again later." },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      {
        message: "Signup successful. Please check your email to verify your account before logging in.",
        verificationLink:
          !isSmtpConfigured() && process.env.NODE_ENV !== "production"
            ? verificationUrl.toString()
            : undefined,
        user: {
          id: newUser._id,
          nickname: newUser.nickname,
          email: newUser.email,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Signup error:", err);
    return NextResponse.json(
      { error: "Signup failed. Please try again later." },
      { status: 500 }
    );
  }
}
