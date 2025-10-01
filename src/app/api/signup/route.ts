import connectToDatabase from "@/lib/mongodb";
import User from "@/models/user";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcrypt'

export async function POST(request: NextRequest) {
    try {
        await connectToDatabase()
        const { nickname, email, password } = await request.json()
        const saltRounds = 10; // standard
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const newUser = await User.create({ nickname, email, password:hashedPassword })
        return NextResponse.json(newUser, { status: 201 })
    }
    catch (err) {
        console.log(err)
    }

}