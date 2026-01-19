import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verify } from "jsonwebtoken";
import { getPromptsWithLatestVersion } from "@/lib/db/prompts";
import { getUserById } from "@/lib/db/users";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

/**
 * GET /api/prompts - Get all prompts for the current user
 */
export async function GET(request: Request) {
  const requestId = `prompts-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  try {
    // Check session cookie on server side
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;

    if (!token) {
      return NextResponse.json(
        { ok: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    let user;
    try {
      const decoded = verify(token, JWT_SECRET) as { userId: string; email: string };
      const dbUser = await getUserById(decoded.userId);
      
      if (!dbUser) {
        return NextResponse.json(
          { ok: false, message: "Unauthorized" },
          { status: 401 }
        );
      }

      user = {
        id: dbUser.id,
        email: dbUser.email,
        role: dbUser.role,
      };
    } catch (error) {
      // Invalid token
      return NextResponse.json(
        { ok: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    console.log("[Prompts API] Fetching prompts for user", {
      requestId,
      userId: user.id,
    });

    const prompts = await getPromptsWithLatestVersion(user.id);

    console.log("[Prompts API] Prompts fetched", {
      requestId,
      count: prompts.length,
    });

    return NextResponse.json({ ok: true, prompts });
  } catch (error) {
    console.error("[Prompts API] Error", {
      requestId,
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json(
      { ok: false, message: "Failed to fetch prompts" },
      { status: 500 }
    );
  }
}
