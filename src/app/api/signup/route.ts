import connectToDatabase from "@/lib/mongodb";
import User from "@/models/user";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const { nickname, email, password } = await request.json();

    if (!nickname || !email || !password) {
      return NextResponse.json(
        { error: "Nickname, email, and password are required." },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "A user with that email already exists." },
        { status: 409 }
      );
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = await User.create({ nickname, email, password: hashedPassword });

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
