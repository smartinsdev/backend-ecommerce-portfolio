import { describe, expect, it } from "vitest";
import { makeRefreshToken } from "@/modules/identity/test/factories/make-refresh-token.js";
import { isLeft } from "@/shared/kernel/either.js";
import { TokenAlreadyUsedError } from "../errors/token-already-used-error.js";
import { TokenExpiredError } from "../errors/token-expired-error.js";

describe("RefreshToken", () => {
  it("refuses to rotate a token that has already been used", () => {
    const token = makeRefreshToken();
    const now = new Date("2026-10-07T12:00:00Z");

    token.rotate(now);

    const result = token.rotate(now);

    expect(isLeft(result)).toBe(true);
    if (isLeft(result)) {
      expect(result.value).toBeInstanceOf(TokenAlreadyUsedError);
    }
  });

  it("refuses to rotate a token past its expiration", () => {
    const token = makeRefreshToken({ expiresAt: new Date("2026-10-07T12:00:00Z") });

    const result = token.rotate(new Date("2026-10-07T12:00:01Z"));

    expect(isLeft(result)).toBe(true);
    if (isLeft(result)) {
      expect(result.value).toBeInstanceOf(TokenExpiredError);
    }
  });

  it("treats the instant of expiration as already expired", () => {
    const expiresAt = new Date("2026-10-07T12:00:00Z");
    const token = makeRefreshToken({ expiresAt });
    const result = token.rotate(new Date(expiresAt));

    expect(isLeft(result)).toBe(true);
    if (isLeft(result)) {
      expect(result.value).toBeInstanceOf(TokenExpiredError);
    }
  });

  it("reports a replayed token as reused even after it has expired", () => {
    const token = makeRefreshToken({ expiresAt: new Date("2026-10-07T12:00:00Z") });
    token.rotate(new Date("2026-10-07T11:00:00Z"));

    const result = token.rotate(new Date("2026-10-07T13:00:00Z"));

    expect(isLeft(result)).toBe(true);
    if (isLeft(result)) {
      expect(result.value).toBeInstanceOf(TokenAlreadyUsedError);
    }
  });
});
