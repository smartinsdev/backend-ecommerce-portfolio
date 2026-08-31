import { describe, expect, it } from "vitest";
import { InvalidEmailError } from "../errors/invalid-email-error.js";
import { Email } from "./email.js";

describe("Email", () => {
  it.each([
    "ana@brand.com",
    "ana.silva@brand.com",
    "ana+tag@brand.com",
    "ana_silva@brand.com",
    "ana-silva@brand.com",
    "ana@brand.de.org",
    "ana.silva@brand.co.uk",
    "ana.silva+tag@sub.brand.com.br",
    "a@b.co",
  ])("accepts a valid address %j", raw => {
    const result = Email.create(raw);
    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.value).toBe(raw);
    }
  });

  it("normalizes spaces and case", () => {
    const result = Email.create("   Ana@Brand.Com   ");
    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.value).toBe("ana@brand.com");
    }
  });

  it.each([
    "without-an-symbol.com",
    "no@domain",
    "with space@brand.com",
    "@brand.com",
    "",
    ".@brand.com",
    "ana@brand.com.",
    "-@-.-",
    "ana@brand..com",
    "ana%@brand.com",
    ".ana@brand.com",
    "ana@brand.c",
    "ana@brand.1",
    "ana@brand.123",
    "ana@127.0.0.1",
    `${"a".repeat(65)}@brand.com`,
    `${"a".repeat(64)}@${"b".repeat(190)}.com`,
  ])("Rejects the invalid address %j", raw => {
    const result = Email.create(raw);
    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(InvalidEmailError);
    }
  });

  it("considers two emails of equal value to be the same", () => {
    const a = Email.create("ana@brand.com");
    const b = Email.create("ANA@brand.com");
    expect(a.isRight()).toBe(true);
    expect(b.isRight()).toBe(true);
    if (a.isRight() && b.isRight()) expect(a.value.equals(b.value)).toBe(true);
  });
});
