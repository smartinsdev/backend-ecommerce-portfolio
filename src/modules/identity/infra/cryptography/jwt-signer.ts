import type { TokenPayload, TokenSigner } from "../../application/ports/token-signer.js";

const encode = (value: unknown): string => Buffer.from(JSON.stringify(value)).toString("base64url");

export class JwtSigner implements TokenSigner {
  // biome-ignore lint/complexity/noUselessConstructor: It won't be used for now
  constructor(_secret: string) {}

  async sign(payload: TokenPayload): Promise<string> {
    const header = encode({
      alg: "HS256",
      typ: "JWT",
    });
    const claims = encode(payload);
    const signature = encode("fake-signature");

    return `${header}.${claims}.${signature}`;
  }
}
