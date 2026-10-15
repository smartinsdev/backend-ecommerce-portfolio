import { describe, expect, it } from "vitest";
import { JwtSigner } from "./jwt-signer.js";

// Reads the claims straight from the compact serialisation (RFC 7519) instead
// of asking a JWT library: the token must be readable by any consumer that
// speaks the standard, not only by the library that produced it.
function readClaims(token: string): Record<string, unknown> {
  const [, payload = ""] = token.split(".");

  return JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
}

describe("JwtSigner", () => {
  it("issues a token whose subject is the authenticated user", async () => {
    const signer = new JwtSigner("a-secret-only-these-tests-know");

    const token = await signer.sign({ sub: "user-1" });

    expect(readClaims(token)).toMatchObject({ sub: "user-1" });
  });
});
