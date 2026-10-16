import postgres from "@prisma/orm-postgres/runtime";
import { env } from "../env/env.js";
import type { Contract } from "./contract.js";
import contractJson from "./contract.json" with { type: "json" };

export const prisma = postgres<Contract>({
  contractJson,
  url: env.DATABASE_URL,
});

export type PrismaDatabase = typeof prisma;
