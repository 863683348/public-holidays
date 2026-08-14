import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

// Prisma client singleton (P1-0 — Neon PostgreSQL, Cloudflare Workers compatible)
// Uses @prisma/adapter-pg (pg driver adapter) so Prisma runs inside
// Cloudflare Workers / OpenNext without the native query engine.
// Must never throw at import time. Importing this module is safe even when
// DATABASE_URL is absent (e.g., during `next build` page-data collection or
// local dev without a DB). Construction is deferred to getPrisma().

const DATABASE_URL = process.env.DATABASE_URL ?? "";

export const isDbConfigured = Boolean(DATABASE_URL);

// Reuse a single client across hot reloads in dev to avoid exhausting
// connections.
const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  pgPool?: pg.Pool;
};

export function getPrisma(): PrismaClient {
  if (!isDbConfigured) {
    throw new Error(
      "Database is not configured (missing DATABASE_URL). Call isDbConfigured first."
    );
  }
  if (!globalForPrisma.prisma) {
    globalForPrisma.pgPool ??= new pg.Pool({ connectionString: DATABASE_URL });
    const adapter = new PrismaPg(globalForPrisma.pgPool);
    globalForPrisma.prisma = new PrismaClient({ adapter });
  }
  return globalForPrisma.prisma;
}
