import { PrismaClient } from "@prisma/client";

// Prisma client singleton (P1-0 — Neon PostgreSQL)
// Must never throw at import time. Importing this module is safe even when
// DATABASE_URL is absent (e.g., during `next build` page-data collection or
// local dev without a DB). Construction is deferred to getPrisma().

const DATABASE_URL = process.env.DATABASE_URL ?? "";

export const isDbConfigured = Boolean(DATABASE_URL);

// Reuse a single client across hot reloads in dev to avoid exhausting
// connections.
const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export function getPrisma(): PrismaClient {
  if (!isDbConfigured) {
    throw new Error(
      "Database is not configured (missing DATABASE_URL). Call isDbConfigured first."
    );
  }
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient();
  }
  return globalForPrisma.prisma;
}
