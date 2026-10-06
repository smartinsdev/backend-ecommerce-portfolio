import { describe, expect, it } from "vitest";
import { Permission } from "./permission.js";
import { Role } from "./role.js";

describe("Role", () => {
  it("grants a permission it was created with", () => {
    const role = Role.create("customer", [Permission.create("order:read")]);

    expect(role.grants(Permission.create("order:read"))).toBe(true);
  });
});
