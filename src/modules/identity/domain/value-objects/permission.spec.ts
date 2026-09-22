import { describe, expect, it } from "vitest";
import { InvariantError } from "@/shared/kernel/invariant-error.js";
import { Permission } from "./permission.js";

describe("Permission", () => {
  it("refuses to be built from a string that names a resource but no action", () => {
    expect(() => Permission.create("order")).toThrow(InvariantError);
  });

  it("treats two permissions parsed from the same string as the same permission", () => {
    expect(Permission.create("order:read").equals(Permission.create("order:read"))).toBe(true);
  });

  it("does not confuse a permission over one's own resource with the administrative one", () => {
    expect(Permission.create("order:read").equals(Permission.create("order:read:any"))).toBe(false);
  });

  it("refuses to be built with a scope it does not recognise", () => {
    expect(() => Permission.create("order:read:xpto")).toThrow(InvariantError);
  });

  it("reads a spelled out own scope as the one it leaves implicit", () => {
    expect(Permission.create("order:read").equals(Permission.create("order:read:own"))).toBe(true);
  });

  it.each([":read", "order:", "order::read", "order:read:any:extra"])(
    "refuses the malformed permission %j",
    raw => {
      expect(() => Permission.create(raw)).toThrow(InvariantError);
    },
  );
});
