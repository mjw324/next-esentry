// Check if we're in Edge Runtime
const isEdgeRuntime = typeof process.env.NEXT_RUNTIME === 'string' && 
                      process.env.NEXT_RUNTIME === 'edge';

// Only import and initialize Prisma if we're not in Edge Runtime
let prismaFromShared;
if (!isEdgeRuntime) {
  // Dynamic import to avoid loading in Edge Runtime
  prismaFromShared = require('@mjw324/prisma-shared').prisma;
}

// Ensure single instance during development
const globalForPrisma = global as unknown as {
  prisma: typeof prismaFromShared
}

export const db = !isEdgeRuntime && (globalForPrisma.prisma || prismaFromShared)

if (!isEdgeRuntime && process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db
}

export { db as prisma }
