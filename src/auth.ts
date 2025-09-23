import NextAuth from "next-auth"
import authConfig from "./auth.config"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "./prisma"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  ...authConfig,
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user }) {
      if (user?.id) {
        try {
          await prisma.user.update({
            where: { id: user.id },
            data: { lastLoggedIn: new Date() }
          })
        } catch (error) {
          console.error('Failed to update lastLoggedIn:', error)
        }
      }
      return true
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string

        // Update lastLoggedIn if it's been more than 1 hour since last update
        const now = new Date()
        const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000)

        try {
          // Check when lastLoggedIn was last updated
          const user = await prisma.user.findUnique({
            where: { id: token.id as string },
            select: { lastLoggedIn: true }
          })

          // Only update if lastLoggedIn is null or older than 1 hour
          if (user && (!user.lastLoggedIn || user.lastLoggedIn < oneHourAgo)) {
            await prisma.user.update({
              where: { id: token.id as string },
              data: { lastLoggedIn: now }
            })
          }
        } catch (error) {
          console.error('Failed to update lastLoggedIn in session:', error)
        }
      }
      return session
    },
  },
})
