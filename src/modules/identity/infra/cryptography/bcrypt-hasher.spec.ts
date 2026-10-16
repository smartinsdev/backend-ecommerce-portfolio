import { describe, expect, it } from "vitest";
import { PasswordHash } from "../../domain/value-objects/password-hash.js";
import { BcryptHasher } from "./bcrypt-hasher.js";

// Produced outside this codebase (Python `bcrypt`, cost 10) from "Str0ng-passw0rd".
// A literal instead of a library call: it stands for a digest already sitting
// in the database, which the adapter must keep accepting regardless of the
// bcrypt implementation behind it.
const STORED_DIGEST = "$2b$10$K9v0Lv1e/ssjZstk8dsBdeWbzeQb/RCnZ/HaMVuYWYYjrQ5ACJyAi";

describe("BcryptHasher", () => {
  it("accepts the password that produced a stored bcrypt digest", async () => {
    const hasher = new BcryptHasher();

    const matches = await hasher.compare("Str0ng-passw0rd", PasswordHash.create(STORED_DIGEST));

    expect(matches).toBe(true);
  });

  it("refuses a password that differs from the one behind the digest only by case", async () => {
    const hasher = new BcryptHasher();

    const matches = await hasher.compare("str0ng-passw0rd", PasswordHash.create(STORED_DIGEST));

    expect(matches).toBe(false);
  });
});
