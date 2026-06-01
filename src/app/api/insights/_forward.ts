import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.BACKEND_API_URL || "http://localhost:3000";

/**
 * Shared proxy logic for the three insights endpoints. Mirrors the
 * `api/monitors/route.ts` pattern: require the `user-id` header, forward the
 * body + `User-Id` to the backend, and pass through the status (including 429
 * for quota) and JSON body.
 */
export async function forwardInsights(
  req: NextRequest,
  endpoint: "market" | "outliers" | "calibrate"
) {
  try {
    const userId = req.headers.get("user-id");

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const response = await fetch(`${API_URL}/api/insights/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Id": userId,
      },
      body: JSON.stringify(body),
    });

    const text = await response.text();

    let data: unknown;
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      // Non-JSON error body — surface it as an error message.
      return NextResponse.json(
        { error: `Insights ${endpoint} request failed: ${text}` },
        { status: response.status }
      );
    }

    // Pass through status (including 429 for rate limiting) so the client can
    // react with a soft, typed message.
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error(`Error in insights ${endpoint} API route:`, error);
    return NextResponse.json(
      {
        error:
          `Failed to fetch insights ${endpoint}: ` +
          (error instanceof Error ? error.message : String(error)),
      },
      { status: 500 }
    );
  }
}
