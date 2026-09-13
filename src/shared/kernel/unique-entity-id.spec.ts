import { describe, expect, it } from "vitest";
import { UniqueEntityId } from "./unique-entity-id.js";

describe("UniqueEntityId", () => {
  it("generates a UUID when no value is provided", () => {
    const id = new UniqueEntityId();
    expect(id.toString()).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
  });

  it("retains the specified value", () => {
    const id = new UniqueEntityId("existing-id");
    expect(id.toValue()).toBe("existing-id");
  });

  it("considers two IDs with the same value to be equal", () => {
    expect(new UniqueEntityId("a").equals(new UniqueEntityId("a"))).toBe(true);
    expect(new UniqueEntityId("a").equals(new UniqueEntityId("b"))).toBe(false);
  });
  it("returns false when comparing with null or undefined", () => {
    const id = new UniqueEntityId("test-id");
    expect(id.equals(null)).toBe(false);
    expect(id.equals(undefined)).toBe(false);
  });
  it("returns false when comparing with a different type", () => {
    class CustomEntityId extends UniqueEntityId {}
    const id1 = new UniqueEntityId("test-id");
    const id2 = new CustomEntityId("test-id");
    expect(id1.equals(id2)).toBe(false);
  });
});
