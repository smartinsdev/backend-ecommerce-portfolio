import { describe, expect, it } from "vitest";
import { UniqueEntityId } from "./unique-entity-id";

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
});
