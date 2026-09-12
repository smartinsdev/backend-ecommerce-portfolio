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

/**
 * Properties required to create an `Email` Value Object.
 * @extends Record<string, unknown>
 */
interface EmailProps extends Record<string, unknown> {
  /** The normalized string representation of the email address. */
  value: string;
}

/**
 * Represents a valid email address as a Value Object in the domain.
 * Ensures normalization (lowercased and trimmed) and strict format validation.
 *
 * @extends ValueObject<EmailProps>
 */
export class Email extends ValueObject<EmailProps> {
  /**
   * Private constructor to enforce validation through the static `create` factory method.
   *
   * @param {EmailProps} props - The encapsulated properties of the email.
   */
  private constructor(props: EmailProps) {
    super(props);
  }

  /**
   * Creates and validates an `Email` instance from a raw string input.
   * Normalizes the input by trimming whitespace and converting it to lower case.
   *
   * @param {string} raw - The raw string representation of the email.
   * @returns {Either<InvalidEmailError, Email>} A `Right` containing the `Email` instance if valid, or a `Left` containing an `InvalidEmailError`.
   *
   * @example
   * ```typescript
   * // Basic usage:
   * const result = Email.create("  User@Domain.COM  ");
   *
   * if (isRight(result)) {
   *   console.log(result.value.address); // "user@domain.com"
   * }
   *
   * // Functional pattern matching usage:
   * match(
   *   Email.create("invalid-email"),
   *   (error) => console.error("Validation failed:", error.message),
   *   (email) => console.log("Valid email created:", email.value)
   * );
   * ```
   */
  static create(raw: string): Either<InvalidEmailError, Email> {
    const normalized = raw.trim().toLowerCase();
    const localPart = normalized.split("@")[0] ?? "";
    if (normalized.length > 254 || localPart.length > 64 || !EMAIL_PATTERN.test(normalized)) {
      return left(new InvalidEmailError(raw));
    }

    return right(new Email({ value: normalized }));
  }

  /**
   * Gets the normalized email address string.
   *
   * @returns {string} The normalized email value.
   */
  get address(): string {
    return this.props.value;
  }
}
