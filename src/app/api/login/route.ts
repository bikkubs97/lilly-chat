import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb"; // your Mongoose connection helper
import User from "@/models/user"; // your Mongoose User model
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase(); // connect to MongoDB via Mongoose

    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      return NextResponse.json(
        { error: "Please add JWT_SECRET to .env" },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { email, password } = body;
    const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";

    if (!normalizedEmail || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Find user by email using Mongoose
    const user = await User.findOne({
      email: new RegExp(`^${escapeRegExp(normalizedEmail)}$`, "i"),
    });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Compare password with hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id.toString(), email: user.email, nickname: user.nickname },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return NextResponse.json(
      { message: "Login successful", token },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
