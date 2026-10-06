import type { UniqueEntityId } from "@/shared/kernel/unique-entity-id.js";
import { User } from "../../domain/entities/user.js";
import type { Role } from "../../domain/value-objects/role.js";

type UserOverride = Partial<{
  roles: Role[];
}>;

export function makeUser(override: UserOverride = {}, id?: UniqueEntityId): User {
  return User.create(
    {
      roles: override.roles ?? [],
    },
    id,
  );
}
