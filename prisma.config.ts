import { defineConfig as ormConfig } from "@prisma/orm-postgres/config";
import { definePrismaConfig } from "prisma/config";
import { env } from "./src/shared/infra/env/env.js";

export default definePrismaConfig({
  orm: ormConfig({
    contract: "./src/shared/infra/prisma/contract.prisma",
    db: {
      connection: env.DATABASE_URL,
    },
  }),
});
