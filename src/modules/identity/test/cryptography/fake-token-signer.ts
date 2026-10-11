import type { TokenPayload, TokenSigner } from "../../application/ports/token-signer.js";

export class FakeTokenSigner implements TokenSigner {
  async sign(payload: TokenPayload): Promise<string> {
    return JSON.stringify(payload);
  }
}
