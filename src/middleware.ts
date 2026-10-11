import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

// Optimistic check: only look for the session cookie. The real session check
// runs in src/app/dashboard/layout.tsx. Keeping Better Auth/Prisma out of the
// middleware bundle avoids the Node.js middleware crash on Vercel (SIGSEGV,
// 500 MIDDLEWARE_INVOCATION_FAILED on every /dashboard request).
export function middleware(request: NextRequest) {
    if (!getSessionCookie(request)) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
