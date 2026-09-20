import { inspect } from "node:util";
import { describe, expect, it } from "vitest";
import { InvariantError } from "@/shared/kernel/invariant-error.js";
import { PasswordHash } from "./password-hash.js";

describe("PasswordHash", () => {
  it("refuses to be built from a hash with no value", () => {
    expect(() => PasswordHash.create("")).toThrow(InvariantError);
  });

  it("refuses to be built from a hash made only of whitespace", () => {
    expect(() => PasswordHash.create("   ")).toThrow(InvariantError);
  });

  it("refuses to be built from a digest padded with whitespace", () => {
    expect(() =>
      PasswordHash.create("  $2b$12$C6UzMDM.H6dfI/f/IKcEeO1ZUvJ0eS2kZ4jXMTGcDhY  "),
    ).toThrow(InvariantError);
  });

  it("treats two hashes rebuilt from the same stored digest as the same hash", () => {
    const stored = "$2b$12$C6UzMDM.H6dfI/f/IKcEeO1ZUvJ0eS2kZ4jXMTGcDhYCN.cpjuyWa";

    expect(PasswordHash.create(stored).equals(PasswordHash.create(stored))).toBe(true);
  });

  it("keeps the digest out of its serialised form", () => {
    const stored = "$2b$12$C6UzMDM.H6dfI/f/IKcEeO1ZUvJ0eS2kZ4jXMTGcDhYCN.cpjuyWa";

    expect(JSON.stringify(PasswordHash.create(stored))).not.toContain(stored);
  });

  it("keeps the digest out of the runtime inspection output", () => {
    const stored = "$2b$12$C6UzMDM.H6dfI/f/IKcEeO1ZUvJ0eS2kZ4jXMTGcDhYCN.cpjuyWa";

    expect(inspect(PasswordHash.create(stored))).not.toContain(stored);
  });
});
