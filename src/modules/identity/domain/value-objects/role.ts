import { ValueObject } from "@/shared/kernel/value-object.js";
import type { Permission } from "./permission.js";

interface RoleProps extends Record<string, unknown> {
  name: string;
  permissions: Permission[];
}

export class Role extends ValueObject<RoleProps> {
  private constructor(props: RoleProps) {
    super(props);
  }

  static create(name: string, permissions: Permission[]): Role {
    return new Role({ name, permissions });
  }

  grants(permission: Permission): boolean {
    return this.props.permissions.some(p => p.equals(permission));
  }
}
