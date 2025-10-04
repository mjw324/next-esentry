import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { sendEmail, createPasswordResetEmailTemplate, createVerificationEmailTemplate } from "./lib/email";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    autoSignIn: true,
    sendResetPassword: async ({ user, url, token }, request) => {
      try {
        const { html, text } = createPasswordResetEmailTemplate(url, user.name);

        await sendEmail({
          to: user.email,
          subject: "Reset Your Password",
          html,
          text,
        });

        console.log(`Password reset email sent successfully to ${user.email}`);
      } catch (error) {
        console.error("Failed to send password reset email:", error);
        throw new Error("Failed to send password reset email");
      }
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      try {
        const { html, text } = createVerificationEmailTemplate(url, user.name);

        await sendEmail({
          to: user.email,
          subject: "Verify Your Email Address",
          html,
          text,
        });

        console.log(`Verification email sent successfully to ${user.email}`);
      } catch (error) {
        console.error("Failed to send verification email:", error);
        throw new Error("Failed to send verification email");
      }
    },
  },
  socialProviders: {
    github: {
      clientId: process.env.AUTH_GITHUB_ID as string,
      clientSecret: process.env.AUTH_GITHUB_SECRET as string,
    },
    google: {
      clientId: process.env.AUTH_GOOGLE_ID as string,
      clientSecret: process.env.AUTH_GOOGLE_SECRET as string,
    },
    facebook: { 
        clientId: process.env.FACEBOOK_CLIENT_ID as string, 
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // Cache duration in seconds
    },
    expiresIn: 60 * 60 * 24 * 30, // 30 days (in seconds)
  },
});