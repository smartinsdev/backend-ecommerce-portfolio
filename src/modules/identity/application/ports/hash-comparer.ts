import type { PasswordHash } from "../../domain/value-objects/password-hash.js";

export interface HashComparer {
  compare(plainPassword: string, passwordHash: PasswordHash): Promise<boolean>;
}
