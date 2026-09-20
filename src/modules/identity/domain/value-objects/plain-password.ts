import { type Either, left, right } from "@/shared/kernel/either.js";
import { ValueObject } from "@/shared/kernel/value-object.js";
import { WeakPasswordError } from "../errors/weak-password-error.js";
import { REDACTED_VALUE } from "./redacted-value.js";

interface PlainPasswordProps extends Record<string, unknown> {
  value: string;
}

const MIN_PASSWORD_LENGTH = 8;

export class PlainPassword extends ValueObject<PlainPasswordProps> {
  private constructor(props: PlainPasswordProps) {
    super(props);
  }

  static create(raw: string): Either<WeakPasswordError, PlainPassword> {
    const hasMinLength = raw.length >= MIN_PASSWORD_LENGTH;
    const hasLetters = /[a-zA-Z]/.test(raw);
    const hasNumbers = /\d/.test(raw);
    const hasSpecialChars = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~` ]/.test(raw);
    const isValid = hasMinLength && hasLetters && hasNumbers && hasSpecialChars;

    if (!isValid) {
      return left(new WeakPasswordError(MIN_PASSWORD_LENGTH));
    }
    return right(new PlainPassword({ value: raw }));
  }

  toJSON(): string {
    return REDACTED_VALUE;
  }

  [Symbol.for("nodejs.util.inspect.custom")](): string {
    return REDACTED_VALUE;
  }
}
