import { createHmac } from "node:crypto";
import { describe, expect, it } from "vitest";
import { JwtSigner } from "./jwt-signer.js";

const SECRET = "a-secret-only-these-tests-know";

// Reads the claims straight from the compact serialisation (RFC 7519) instead
// of asking a JWT library: the token must be readable by any consumer that
// speaks the standard, not only by the library that produced it.
function readClaims(token: string): Record<string, unknown> {
  const [, payload = ""] = token.split(".");

  return JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
}

// Recomputes the HS256 signature by its definition (RFC 7518 §3.2): an
// HMAC-SHA256 over "header.payload", keyed by the shared secret.
function signatureFor(token: string, secret: string): string {
  const [header = "", payload = ""] = token.split(".");

  return createHmac("sha256", secret).update(`${header}.${payload}`).digest("base64url");
}

describe("JwtSigner", () => {
  it("issues a token whose subject is the authenticated user", async () => {
    const signer = new JwtSigner(SECRET);

    const token = await signer.sign({ sub: "user-1" });

    expect(readClaims(token)).toMatchObject({ sub: "user-1" });
  });

  it("signs the token with the secret, so no one without it could have issued it", async () => {
    const signer = new JwtSigner(SECRET);

    const token = await signer.sign({ sub: "user-1" });

    const [, , signature] = token.split(".");
    expect(signature).toBe(signatureFor(token, SECRET));
  });
});
