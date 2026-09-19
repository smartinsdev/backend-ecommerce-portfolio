import { describe, expect, it } from "vitest";
import { WeakPasswordError } from "./weak-password-error.js";

describe("WeakPasswordError", () => {
  it("states the minimum length it was built with", () => {
    expect(new WeakPasswordError(12).message).toContain("12");
  });
});
