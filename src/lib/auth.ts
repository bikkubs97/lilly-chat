import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

export function getTokenFromRequest(req: NextRequest) {
  const authHeader = req.headers.get("authorization") || "";
  const token = authHeader.split(" ")[1];
  return token;
}

export function verifyToken(token: string) {
  if (!token) {
    throw new Error("Missing auth token");
  }

  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    throw new Error("Please add JWT_SECRET to .env");
  }

  const decoded = jwt.verify(token, JWT_SECRET);

  if (
    typeof decoded !== "object" ||
    decoded === null ||
    typeof (decoded as { userId?: unknown }).userId !== "string"
  ) {
    throw new Error("Invalid token payload");
  }

  return decoded as {
    userId: string;
    email?: string;
    nickname?: string;
  };
}
