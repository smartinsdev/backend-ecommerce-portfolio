import { describe, expect, it } from "vitest";
import { isLeft } from "@/shared/kernel/either.js";
import { WeakPasswordError } from "../errors/weak-password-error.js";
import { PlainPassword } from "./plain-password.js";

describe("PlainPassword", () => {
  it("rejects a password shorter than eight characters", () => {
    const result = PlainPassword.create("Ab1@567");

    expect(isLeft(result)).toBe(true);
    if (isLeft(result)) {
      expect(result.value).toBeInstanceOf(WeakPasswordError);
    }
  });
});
