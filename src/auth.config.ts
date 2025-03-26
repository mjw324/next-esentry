import Google from "next-auth/providers/google"
import GitHub from "next-auth/providers/github"
import Credentials from "next-auth/providers/credentials"
import type { NextAuthConfig } from "next-auth"
import { z } from "zod"

// Schema for validating credentials
const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
})

export default {
  providers: [
    Google,
    GitHub,
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          // Validate the credentials
          const result = loginSchema.safeParse(credentials);
          if (!result.success) {
            return null; // Return null instead of throwing
          }

          const { email, password } = result.data;

          const API_URL = process.env.BACKEND_API_URL || 'http://localhost:3000';
          const response = await fetch(`${API_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          });

          // Handle error responses
          if (!response.ok) {
            const errorData = await response.json();
            console.log("Auth error:", errorData);
            // Return null instead of throwing errors
            return null;
          }

          const userData = await response.json();

          // Verify we have the user data we need
          if (!userData.success || !userData.user || !userData.user.id) {
            return null;
          }

          // Return the user object for the JWT
          return userData.user;
        } catch (error) {
          console.error("Auth error:", error);
          return null; // Return null for any other errors
        }
      }
    })
  ],
  pages: {
    signIn: '/login',
    error: '/login', // Redirect to login page on error
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    authorized: async ({ auth, request }) => {
      const isLoggedIn = !!auth;
      const { pathname, origin } = request.nextUrl

      if (!isLoggedIn && pathname.startsWith('/dashboard')) {
        return Response.redirect(new URL("/login", origin))
      }

      return true;
    },
  },
} satisfies NextAuthConfig
