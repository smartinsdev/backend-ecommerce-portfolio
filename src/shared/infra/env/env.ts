import { config } from "dotenv";
import { z } from "zod";

const { NODE_ENV } = process.env;
const isTest = NODE_ENV === "test";

// The files are a local convenience. In CI and production the variables come
// from the environment itself, so a missing file is not an error: the schema
// below is what rejects a missing variable.
config({
  path: isTest ? ".env.test" : ".env",
  override: isTest,
  quiet: true,
});

const envScheme = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: z.url({
    protocol: /^postgres(?:ql)?$/,
  }),
});

export const env = envScheme.parse(process.env);

export type Env = z.infer<typeof envScheme>;
