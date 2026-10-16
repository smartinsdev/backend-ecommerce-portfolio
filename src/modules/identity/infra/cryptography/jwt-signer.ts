import { SignJWT } from "jose";
import type { Clock } from "../../application/ports/clock.js";
import type { TokenPayload, TokenSigner } from "../../application/ports/token-signer.js";

const TOKEN_TTL_SECONDS = 15 * 60;

export class JwtSigner implements TokenSigner {
  private readonly secret: Uint8Array;

  constructor(
    secret: string,
    private readonly clock: Clock,
  ) {
    this.secret = new TextEncoder().encode(secret);
  }

  async sign(payload: TokenPayload): Promise<string> {
    const issuedAt = Math.floor(this.clock.now().getTime() / 1000);
    const expiresAt = issuedAt + TOKEN_TTL_SECONDS;

    return new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256", typ: "JWT" })
      .setIssuedAt(issuedAt)
      .setExpirationTime(expiresAt)
      .sign(this.secret);
  }
}
