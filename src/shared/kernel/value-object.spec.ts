import { describe, expect, it } from "vitest";
import { ValueObject } from "./value-object.js";

class Cents extends ValueObject<{ amount: number; currency: string }> {
  static create(amount: number, currency: string) {
    return new Cents({ amount, currency });
  }
}

class Sku extends ValueObject<{ value: string }> {
  static create(value: string) {
    return new Sku({ value });
  }
}

class Slug extends ValueObject<{ value: string }> {
  static create(value: string) {
    return new Slug({ value });
  }
}

describe("ValueObject", () => {
  it("compares by structural value, not by identity", () => {
    expect(Cents.create(100, "BRL").equals(Cents.create(100, "BRL"))).toBe(true);
    expect(Cents.create(100, "BRL").equals(Cents.create(100, "USD"))).toBe(false);
  });
  it("is not equal to a value object of another type holding the same props", () => {
    expect(Sku.create("blue-shirt").equals(Slug.create("blue-shirt"))).toBe(false);
  });

  it("is not equal to null or undefined", () => {
    expect(Cents.create(100, "BRL").equals(null)).toBe(false);
    expect(Cents.create(100, "BRL").equals(undefined)).toBe(false);
  });
});
