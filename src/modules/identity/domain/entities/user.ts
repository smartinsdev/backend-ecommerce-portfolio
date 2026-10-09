import { Entity } from "@/shared/kernel/entity.js";
import type { UniqueEntityId } from "@/shared/kernel/unique-entity-id.js";
import type { Email } from "../value-objects/email.js";
import type { PasswordHash } from "../value-objects/password-hash.js";
import type { Permission } from "../value-objects/permission.js";
import type { Role } from "../value-objects/role.js";

interface UserProps {
  email: Email;
  passwordHash: PasswordHash;
  roles: Role[];
}

export class User extends Entity<UserProps> {
  private constructor(props: UserProps, id?: UniqueEntityId) {
    super(props, id);
  }

  static create(props: UserProps, id?: UniqueEntityId): User {
    return new User(props, id);
  }

  get email(): Email {
    return this.props.email;
  }

  get passwordHash(): PasswordHash {
    return this.props.passwordHash;
  }

  can(permission: Permission): boolean {
    return this.props.roles.some(role => role.grants(permission));
  }
}
