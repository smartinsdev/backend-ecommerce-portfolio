import { describe, expect, it } from "vitest";
import { makeUser } from "@/modules/identity/test/factories/make-user.js";
import { Permission } from "../value-objects/permission.js";
import { Role } from "../value-objects/role.js";

describe("User", () => {
  it("can do what any one of its roles grants", () => {
    const user = makeUser({
      roles: [
        Role.create("customer", [Permission.create("order:read")]),
        Role.create("support", [Permission.create("order:refund:any")]),
      ],
    });

    expect(user.can(Permission.create("order:refund:any"))).toBe(true);
  });
});
