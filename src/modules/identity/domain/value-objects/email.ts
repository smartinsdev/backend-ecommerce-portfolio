import { type Either, left, right } from "@/shared/kernel/either.js";
import { ValueObject } from "@/shared/kernel/value-object.js";
import { InvalidEmailError } from "../errors/invalid-email-error.js";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface EmailProps extends Record<string, unknown> {
  value: string;
}

export class Email extends ValueObject<EmailProps> {
  private constructor(props: EmailProps) {
    super(props);
  }

  static create(raw: string): Either<InvalidEmailError, Email> {
    const normlized = raw.trim().toLowerCase();
    if (!EMAIL_PATTERN.test(normlized)) {
      return left(new InvalidEmailError(raw));
    }
    return right(new Email({ value: normlized }));
  }

  get value() {
    return this.props.value;
  }
}
