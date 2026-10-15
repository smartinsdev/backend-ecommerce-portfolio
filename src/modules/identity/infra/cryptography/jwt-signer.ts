import { SignJWT } from "jose";
import type { TokenPayload, TokenSigner } from "../../application/ports/token-signer.js";

export class JwtSigner implements TokenSigner {
  private readonly secret: Uint8Array;

  constructor(secret: string) {
    this.secret = new TextEncoder().encode(secret);
  }

  async sign(payload: TokenPayload): Promise<string> {
    return new SignJWT(payload).setProtectedHeader({ alg: "HS256", typ: "JWT" }).sign(this.secret);
  }
}
