import { type Either, left, right } from "@/shared/kernel/either.js";
import { ValueObject } from "@/shared/kernel/value-object.js";
import { InvalidEmailError } from "../errors/invalid-email-error.js";

/**
 * Local part: letters, numbers, _, +, -, and internal dots.
 * Domain: alphanumeric labels (hyphens in the middle are allowed).
 * TLD: letters only, minimum 2 and maximum 63 characters.
 */
const EMAIL_PATTERN =
  /^[A-Za-z0-9_+-]+(?:\.[A-Za-z0-9_+-]+)*@(?:[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?\.)+[A-Za-z]{2,63}$/;

interface EmailProps extends Record<string, unknown> {
  value: string;
}

export class Email extends ValueObject<EmailProps> {
  private constructor(props: EmailProps) {
    super(props);
  }

  static create(raw: string): Either<InvalidEmailError, Email> {
    const normalized = raw.trim().toLowerCase();
    const localPart = normalized.split("@")[0] ?? "";
    if (normalized.length > 254 || localPart.length > 64 || !EMAIL_PATTERN.test(normalized)) {
      return left(new InvalidEmailError(raw));
    }

    return right(new Email({ value: normalized }));
  }

  get value() {
    return this.props.value;
  }
}
