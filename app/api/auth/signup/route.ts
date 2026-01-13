import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { createUser, getUserByEmail } from "@/lib/db/users";
import { cookies } from "next/headers";
import { sign } from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = await hash(password, 10);

    // Create user
    const userId = uuidv4();
    
    const result = await createUser({
      id: userId,
      email,
      passwordHash,
    });

    if (!result.ok || !result.user) {
      return NextResponse.json(
        { error: result.message || "Failed to create user" },
        { status: 500 }
      );
    }

    // Create session token
    const token = sign(
      { userId: result.user.id, email: result.user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return NextResponse.json({
      user: {
        id: result.user.id,
        email: result.user.email,
        role: result.user.role,
      },
    });
  } catch (error: any) {
    console.error("[Auth Signup] Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create account" },
      { status: 500 }
    );
  }
}
