import { describe, expect, it } from "vitest";
import { InvalidEmailError } from "../errors/invalid-email-error.js";
import { Email } from "./email.js";

describe("Email", () => {
  it("accepts a valid address", () => {
    const result = Email.create("ana@brand.com");
    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.value).toBe("ana@brand.com");
    }
  });

  it("normalizes spaces and case", () => {
    const result = Email.create("   Ana@Brand.Com   ");
    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.value).toBe("ana@brand.com");
    }
  });

  it.each(["without-an-symbol.com", "no@domain", "with space@brand.com", "@brand.com", ""])(
    "Rejects the invalid address %j",
    raw => {
      const result = Email.create(raw);
      expect(result.isLeft()).toBe(true);
      if (result.isLeft()) {
        expect(result.value).toBeInstanceOf(InvalidEmailError);
      }
    },
  );

  it("considers two emails of equal value to be the same", () => {
    const a = Email.create("ana@brand.com");
    const b = Email.create("ANA@brand.com");
    expect(a.isRight()).toBe(true);
    expect(b.isRight()).toBe(true);
    if (a.isRight() && b.isRight()) expect(a.value.equals(b.value)).toBe(true);
  });
});
