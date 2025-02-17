import { prisma } from '@mjw324/prisma-shared'
import { PrismaAdapter } from '@auth/prisma-adapter'

// Ensure single instance during development
const globalForPrisma = global as unknown as {
  prisma: typeof prisma
}

export const db = globalForPrisma.prisma || prisma

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db
}

// Export PrismaAdapter with our prisma instance
export function getPrismaAdapter() {
  return PrismaAdapter(db)
}

export { db as prisma }
