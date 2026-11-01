// app/lib/prisma.js — creates the ONE connection the whole app shares
import { PrismaClient } from "../generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const globalForPrisma = globalThis;

// 1. wrap the SQLite driver in the adapter, pointing at dev.db
const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL });

// 2. give that adapter to Prisma Client (reuse an existing one if we have it)
export const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });

// 3. in dev, remember it so hot-reloads don't create a new connection each time
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;


/**
 The import changed from @prisma/client to ../generated/prisma/client. 
 * That's the fix for "Cannot find module". 
   Your schema says output = "../app/generated/prisma", so Prisma writes the client code there. 
   From app/lib/, the path is ../generated/prisma/client.
new PrismaBetterSqlite3({ url }) is the adapter. 
    It wraps the better-sqlite3 driver and points it at dev.db.

new PrismaClient({ adapter }) gives Prisma Client that adapter. 
    This is where the whole chain connects.

The globalThis lines exist because of hot reload. 
   In dev, Next re-runs your files every time you save. 
   Without them, each save would open a new database connection. 
   They store the connection on globalThis, which survives reloads, 
   so it gets reused
 * 
 */