import { type Either, left, right } from "@/shared/kernel/either.js";
import { ValueObject } from "@/shared/kernel/value-object.js";
import { WeakPasswordError } from "../errors/weak-password-error.js";

interface PlainPasswordProps extends Record<string, unknown> {
  value: string;
}

const MIN_PASSWORD_LENGTH = 8;

export class PlainPassword extends ValueObject<PlainPasswordProps> {
  private constructor(props: PlainPasswordProps) {
    super(props);
  }

  private static validate(raw: string): boolean {
    return raw.length >= MIN_PASSWORD_LENGTH;
  }

  static create(raw: string): Either<WeakPasswordError, PlainPassword> {
    if (!PlainPassword.validate(raw)) {
      return left(new WeakPasswordError());
    }
    return right(new PlainPassword({ value: raw }));
  }
}
