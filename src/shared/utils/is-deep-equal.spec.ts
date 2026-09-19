import { describe, expect, it } from "vitest";
import { isDeepEqual } from "./is-deep-equal.js";

describe("isDeepEqual", () => {
  it("considers structurally identical plain objects equal", () => {
    expect(isDeepEqual({ amount: 100, currency: "BRL" }, { amount: 100, currency: "BRL" })).toBe(
      true,
    );
  });

  it("distinguishes objects holding different values under the same keys", () => {
    expect(isDeepEqual({ amount: 100 }, { amount: 200 })).toBe(false);
  });

  it("distinguishes objects with a different number of keys", () => {
    expect(isDeepEqual({ amount: 100 }, { amount: 100, currency: "BRL" })).toBe(false);
  });

  it("compares nested structures recursively", () => {
    expect(isDeepEqual({ price: { amount: 100 } }, { price: { amount: 100 } })).toBe(true);
    expect(isDeepEqual({ price: { amount: 100 } }, { price: { amount: 101 } })).toBe(false);
  });

  it("compares arrays positionally", () => {
    expect(isDeepEqual([1, { a: 2 }], [1, { a: 2 }])).toBe(true);
    expect(isDeepEqual([1, 2], [2, 1])).toBe(false);
  });

  it("does not consider an empty array equal to an empty object", () => {
    expect(isDeepEqual([], {})).toBe(false);
  });

  it("compares Date instances by the instant they represent", () => {
    const instant = "2024-01-01T00:00:00.000Z";
    expect(isDeepEqual(new Date(instant), new Date(instant))).toBe(true);
    expect(isDeepEqual(new Date(instant), new Date("2024-01-02T00:00:00.000Z"))).toBe(false);
  });

  it("does not consider a Date equal to a plain object", () => {
    expect(isDeepEqual(new Date("2024-01-01T00:00:00.000Z"), {})).toBe(false);
  });

  it("does not consider instances of different classes equal", () => {
    class Sku {
      constructor(readonly value: string) {}
    }
    class Slug {
      constructor(readonly value: string) {}
    }
    expect(isDeepEqual(new Sku("blue-shirt"), new Slug("blue-shirt"))).toBe(false);
  });

  it("compares Sets by their members, ignoring insertion order", () => {
    expect(isDeepEqual(new Set([1, 2]), new Set([2, 1]))).toBe(true);
    expect(isDeepEqual(new Set([1]), new Set([2]))).toBe(false);
    expect(isDeepEqual(new Set([1]), new Set([1, 2]))).toBe(false);
  });

  it("compares Maps by their entries", () => {
    expect(isDeepEqual(new Map([["a", 1]]), new Map([["a", 1]]))).toBe(true);
    expect(isDeepEqual(new Map([["a", 1]]), new Map([["a", 2]]))).toBe(false);
    expect(isDeepEqual(new Map([["a", 1]]), new Map([["b", 1]]))).toBe(false);
  });

  it("treats NaN as equal to itself", () => {
    expect(isDeepEqual(Number.NaN, Number.NaN)).toBe(true);
  });

  it("does not consider an object equal to null or to a primitive", () => {
    expect(isDeepEqual({ a: 1 }, null)).toBe(false);
    expect(isDeepEqual({ a: 1 }, "a")).toBe(false);
  });
});
