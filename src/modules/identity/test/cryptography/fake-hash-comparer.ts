import type { HashComparer } from "../../application/ports/hash-comparer.js";
import { PasswordHash } from "../../domain/value-objects/password-hash.js";

export class FakeHashComparer implements HashComparer {
  async compare(plainPassword: string, passwordHash: PasswordHash): Promise<boolean> {
    return PasswordHash.create(`${plainPassword}-hashed`).equals(passwordHash);
  }
}
