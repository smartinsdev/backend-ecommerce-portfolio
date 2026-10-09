import type { UniqueEntityId } from "@/shared/kernel/unique-entity-id.js";
import { RefreshToken } from "../../domain/entities/refresh-token.js";

type RefreshTokenOverride = Partial<{
  expiresAt: Date;
}>;

const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const DEFAULT_TEST_NOW = new Date("2026-10-07T12:00:00Z");

export function makeRefreshToken(
  override: RefreshTokenOverride = {},
  id?: UniqueEntityId,
): RefreshToken {
  return RefreshToken.create(
    {
      usedAt: null,
      expiresAt: override.expiresAt ?? new Date(DEFAULT_TEST_NOW.getTime() + ONE_DAY_MS),
    },
    id,
  );
}
