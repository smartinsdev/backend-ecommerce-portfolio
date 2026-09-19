import { inspect } from "node:util";
import { describe, expect, it } from "vitest";
import { isLeft, isRight } from "@/shared/kernel/either.js";
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

  it("keeps the raw text out of its serialised form", () => {
    const result = PlainPassword.create("SuperSecret123@");

    expect(isRight(result)).toBe(true);
    if (isRight(result)) {
      expect(JSON.stringify(result.value)).not.toContain("SuperSecret123@");
    }
  });

  it("rejects a password with no letter in it", () => {
    const result = PlainPassword.create("12345678@");

    expect(isLeft(result)).toBe(true);
    if (isLeft(result)) {
      expect(result.value).toBeInstanceOf(WeakPasswordError);
    }
  });

  it("accepts a password whose only letters are uppercase", () => {
    const result = PlainPassword.create("PASSWORD1@");

    expect(isRight(result)).toBe(true);
  });

  it("rejects a password whose only letters fall outside the ASCII alphabet", () => {
    const result = PlainPassword.create("пароль123@");

    expect(isLeft(result)).toBe(true);
    if (isLeft(result)) {
      expect(result.value).toBeInstanceOf(WeakPasswordError);
    }
  });

  it("keeps the raw text out of the runtime inspection output", () => {
    const result = PlainPassword.create("SuperSecret123@");

    expect(isRight(result)).toBe(true);
    if (isRight(result)) {
      expect(inspect(result.value)).not.toContain("SuperSecret123@");
    }
  });
});
