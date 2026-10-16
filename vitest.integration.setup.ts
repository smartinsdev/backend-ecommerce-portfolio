import { env } from "./src/shared/infra/env/env.js";

const databaseName = new URL(env.DATABASE_URL).pathname.slice(1);

if (databaseName !== "identity_test") {
  throw new Error(`Integration tests must use identity_test database. Received: ${databaseName}`);
}
