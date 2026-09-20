import { InvariantError } from "@/shared/kernel/invariant-error.js";
import { ValueObject } from "@/shared/kernel/value-object.js";
import { REDACTED_VALUE } from "./redacted-value.js";

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

  toJSON(): string {
    return REDACTED_VALUE;
  }

  [Symbol.for("nodejs.util.inspect.custom")](): string {
    return REDACTED_VALUE;
  }
}
