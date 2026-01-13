import { NextResponse } from "next/server";
import { compare } from "bcryptjs";
import { getUserByEmail } from "@/lib/db/users";
import { cookies } from "next/headers";
import { sign } from "jsonwebtoken";

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

    // Get user by email
    const user = await getUserByEmail(email);
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Check if user has a password (migration might not have run)
    if (!user.passwordHash) {
      return NextResponse.json(
        { error: "Account not set up. Please sign up first." },
        { status: 401 }
      );
    }

    // Verify password
    const isValid = await compare(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Create session token
    const token = sign(
      { userId: user.id, email: user.email },
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
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error("[Auth Signin] Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to sign in" },
      { status: 500 }
    );
  }
}
