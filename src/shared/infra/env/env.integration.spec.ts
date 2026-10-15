import { describe, expect, it } from "vitest";
import { env } from "./env.js";

describe("Env", () => {
  it("should have the variables loaded and validated", () => {
    expect(env.DATABASE_URL).toBeDefined();
  });
});
