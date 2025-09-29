import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3001"
});

export const { signIn, signOut, signUp, useSession } = authClient;