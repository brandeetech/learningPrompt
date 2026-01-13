import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verify } from "jsonwebtoken";
import { getUserById } from "@/lib/db/users";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;

    if (!token) {
      return NextResponse.json({ user: null });
    }

    try {
      const decoded = verify(token, JWT_SECRET) as { userId: string; email: string };
      const user = await getUserById(decoded.userId);

      if (!user) {
        return NextResponse.json({ user: null });
      }

      return NextResponse.json({
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      // Invalid token
      return NextResponse.json({ user: null });
    }
  } catch (error) {
    return NextResponse.json({ user: null });
  }
}
