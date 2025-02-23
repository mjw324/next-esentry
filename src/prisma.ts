import { prisma } from '@mjw324/prisma-shared'

// Ensure single instance during development
const globalForPrisma = global as unknown as {
  prisma: typeof prisma
}

export const db = globalForPrisma.prisma || prisma

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db
}

export { db as prisma }
