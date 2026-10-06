import { Entity } from "@/shared/kernel/entity.js";
import type { UniqueEntityId } from "@/shared/kernel/unique-entity-id.js";
import type { Permission } from "../value-objects/permission.js";
import type { Role } from "../value-objects/role.js";

interface UserProps {
  roles: Role[];
}

export class User extends Entity<UserProps> {
  private constructor(props: UserProps, id?: UniqueEntityId) {
    super(props, id);
  }

  static create(props: UserProps, id?: UniqueEntityId): User {
    return new User(props, id);
  }

  can(permission: Permission): boolean {
    return this.props.roles.some(role => role.grants(permission));
  }
}
