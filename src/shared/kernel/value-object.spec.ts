import { describe, expect, it } from "vitest";
import { ValueObject } from "./value-object.js";

class Cents extends ValueObject<{ amount: number; currency: string }> {
  static create(amount: number, currency: string) {
    return new Cents({ amount, currency });
  }
}

describe("ValueObject", () => {
  it("compares by structural value, not by identity", () => {
    expect(Cents.create(100, "BRL").equals(Cents.create(100, "BRL"))).toBe(true);
    expect(Cents.create(100, "BRL").equals(Cents.create(100, "USD"))).toBe(false);
  });
  it("is not equal to null or undefined", () => {
    expect(Cents.create(100, "BRL").equals(null)).toBe(false);
    expect(Cents.create(100, "BRL").equals(undefined)).toBe(false);
  });
});
