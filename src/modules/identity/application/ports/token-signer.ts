export type TokenPayload = {
  sub: string;
};

export interface TokenSigner {
  sign(payload: TokenPayload): Promise<string>;
}
