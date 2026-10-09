import { isLeft } from "@/shared/kernel/either.js";
import type { UniqueEntityId } from "@/shared/kernel/unique-entity-id.js";
import { User } from "../../domain/entities/user.js";
import { Email } from "../../domain/value-objects/email.js";
import { PasswordHash } from "../../domain/value-objects/password-hash.js";
import type { Role } from "../../domain/value-objects/role.js";

type UserOverride = Partial<{
  email: string;
  passwordHash: string;
  roles: Role[];
}>;

export function makeUser(override: UserOverride = {}, id?: UniqueEntityId): User {
  const emailResult = Email.create(override.email ?? "default@brand.com");

  if (isLeft(emailResult)) throw emailResult.value;

  const passwordHash = PasswordHash.create(override.passwordHash ?? "default-password-hashed");

  return User.create(
    {
      email: emailResult.value,
      passwordHash,
      roles: override.roles ?? [],
    },
    id,
  );
}
