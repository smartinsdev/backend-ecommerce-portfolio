import { describe, expect, it } from "vitest";
import { Entity } from "./entity.js";
import { UniqueEntityId } from "./unique-entity-id.js";

class Dummy extends Entity<{ label: string }> {
  static create(label: string, id?: UniqueEntityId) {
    return new Dummy({ label }, id);
  }
}

class Product extends Entity<{ name: string }> {
  static create(name: string, id?: UniqueEntityId) {
    return new Product({ name }, id);
  }
}

describe("Entity", () => {
  it("automatically assigns an ID", () => {
    expect(Dummy.create("a").id).toBeInstanceOf(UniqueEntityId);
  });

  it("compares by identity, not by attributes", () => {
    const id = new UniqueEntityId("same-id");
    expect(Dummy.create("a", id).equals(Dummy.create("b", id))).toBe(true);
    expect(Dummy.create("a").equals(Dummy.create("a"))).toBe(false);
  });

  it("should return false when comparing different entities with the same ID", () => {
    const id = new UniqueEntityId("same-id");
    expect(Dummy.create("a", id).equals(Product.create("b", id))).toBe(false);
  });
});
