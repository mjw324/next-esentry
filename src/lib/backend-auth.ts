import { NextRequest } from "next/server";
import { auth } from "@/auth";

/**
 * Identifies the signed-in user for a call to the backend API (audit F-1).
 *
 * The user comes from the better-auth session cookie, never from a header the
 * browser sends. The backend gets the session token as a Bearer token and
 * checks it against the Session table itself, so it no longer has to trust
 * whoever calls it.
 *
 * Returns null when there is no valid session.
 */
export async function backendAuth(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });

  if (!session) {
    return null;
  }

  return {
    userId: session.user.id,
    headers: {
      Authorization: `Bearer ${session.session.token}`,
      // Only for backends deployed before F-1, which read the user from this
      // header. Taken from the verified session, so it is safe to send. Drop it
      // once the backend that checks the Bearer token is live.
      "User-Id": session.user.id,
    },
  };
}
