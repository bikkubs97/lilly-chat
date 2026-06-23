import connectToDatabase from "@/lib/mongodb";
import { isSmtpConfigured, sendWelcomeEmail } from "@/lib/email";
import User from "@/models/user";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const { nickname, email, password } = await request.json();
    const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";

    if (!nickname || !normalizedEmail || !password) {
      return NextResponse.json(
        { error: "Nickname, email, and password are required." },
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

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = await User.create({
      nickname,
      email: normalizedEmail,
      password: hashedPassword,
    });

    if (isSmtpConfigured()) {
      sendWelcomeEmail({
        to: newUser.email,
        nickname: newUser.nickname,
      }).catch((emailError) => {
        console.error("Welcome email error:", emailError);
      });
    }

    return NextResponse.json(
      {
        message: "Signup successful.",
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
