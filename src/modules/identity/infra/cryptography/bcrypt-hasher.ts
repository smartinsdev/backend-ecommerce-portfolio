import bcrypt from "bcrypt";
import type { HashComparer } from "../../application/ports/hash-comparer.js";
import type { PasswordHash } from "../../domain/value-objects/password-hash.js";

export class BcryptHasher implements HashComparer {
  async compare(plainPassword: string, passwordHash: PasswordHash): Promise<boolean> {
    return bcrypt.compare(plainPassword, passwordHash.value);
  }
}
