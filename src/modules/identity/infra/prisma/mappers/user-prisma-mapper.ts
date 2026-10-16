import { User } from "@/modules/identity/domain/entities/user.js";
import { Email } from "@/modules/identity/domain/value-objects/email.js";
import { PasswordHash } from "@/modules/identity/domain/value-objects/password-hash.js";
import { isLeft } from "@/shared/kernel/either.js";
import { InvariantError } from "@/shared/kernel/invariant-error.js";
import { UniqueEntityId } from "@/shared/kernel/unique-entity-id.js";

type UserPrismaRecord = {
  id: string;
  email: string;
  passwordHash: string;
};

const toDomain = (record: UserPrismaRecord): User => {
  const email = Email.create(record.email);

  if (isLeft(email)) {
    throw new InvariantError("Cannot restore User: persisted email violates domain invariants.");
  }

  const id = new UniqueEntityId(record.id);
  const passwordHash = PasswordHash.create(record.passwordHash);

  return User.create(
    {
      email: email.value,
      passwordHash,
      roles: [],
    },
    id,
  );
};

export const UserPrismaMapper = {
  toDomain,
};
