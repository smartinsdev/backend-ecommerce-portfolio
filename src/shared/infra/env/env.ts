import { config } from "dotenv";
import { z } from "zod";

config();

const envScheme = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: z.url({
    protocol: /^postgres(?:ql)?$/,
  }),
});

export const env = envScheme.parse(process.env);

export type Env = z.infer<typeof envScheme>;
