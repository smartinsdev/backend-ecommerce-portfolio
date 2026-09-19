import { describe, expect, it } from "vitest";
import { deepFreeze } from "./deep-freeze.js";

describe("deepFreeze", () => {
  it("rejects mutation of a top-level property", () => {
    const frozen = deepFreeze({ name: "Ada" });
    expect(() => {
      (frozen as { name: string }).name = "Grace";
    }).toThrow(TypeError);
  });

  it("rejects mutation of a nested property", () => {
    const frozen = deepFreeze({ user: { name: "Ada" } });
    expect(() => {
      (frozen.user as { name: string }).name = "Grace";
    }).toThrow(TypeError);
  });

  it("rejects mutation of an object held inside an array", () => {
    const frozen = deepFreeze({ items: [{ quantity: 1 }] });
    expect(() => {
      (frozen.items[0] as { quantity: number }).quantity = 2;
    }).toThrow(TypeError);
  });

  it("freezes values stored under symbol keys", () => {
    const key = Symbol("metadata");
    const frozen = deepFreeze({ [key]: { source: "seed" } });
    expect(Object.isFrozen(frozen[key])).toBe(true);
  });

  it("returns primitives untouched", () => {
    expect(deepFreeze("plain")).toBe("plain");
    expect(deepFreeze(null)).toBe(null);
  });

  it("terminates on circular references", () => {
    const circular: { self?: unknown } = {};
    circular.self = circular;
    expect(() => deepFreeze(circular)).not.toThrow();
    expect(Object.isFrozen(circular)).toBe(true);
  });
});
