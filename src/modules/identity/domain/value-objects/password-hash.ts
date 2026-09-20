import { InvariantError } from "@/shared/kernel/invariant-error.js";
import { ValueObject } from "@/shared/kernel/value-object.js";

interface PasswordHashProps extends Record<string, unknown> {
  value: string;
}

export class PasswordHash extends ValueObject<PasswordHashProps> {
  private constructor(props: PasswordHashProps) {
    super(props);
  }

  static create(hash: string): PasswordHash {
    if (hash.length === 0 || hash !== hash.trim())
      throw new InvariantError("A PasswordHash cannot be empty or padded with whitespace.");

    return new PasswordHash({ value: hash });
  }
}
