import { type Either, left, right } from "@/shared/kernel/either.js";
import { ValueObject } from "@/shared/kernel/value-object.js";
import { WeakPasswordError } from "../errors/weak-password-error.js";
import { REDACTED_VALUE } from "./redacted-value.js";

/**
 * The encapsulated shape of a `PlainPassword`.
 */
interface PlainPasswordProps extends Record<string, unknown> {
  /**
   * The password exactly as the user typed it.
   */
  value: string;
}

const MIN_PASSWORD_LENGTH = 8;

/**
 * A password in plain text, on its way from the boundary to the hasher.
 *
 * Strength is validated once, at creation, so no later layer has to ask again.
 * It never hashes — hashing is infrastructure and reaches the application
 * through a port — and it is never persisted: the only thing that reaches the
 * database is a `PasswordHash`.
 *
 * The rules it enforces are stated by `WeakPasswordError` and pinned by the
 * boundary tests in `plain-password.spec.ts`. They are deliberately not
 * restated here, so that changing one cannot leave this comment lying.
 */
export class PlainPassword extends ValueObject<PlainPasswordProps> {
  /**
   * Private so that an unvalidated password can never exist as a
   * `PlainPassword`.
   *
   * @param {PlainPasswordProps} props - The validated password.
   */
  private constructor(props: PlainPasswordProps) {
    super(props);
  }

  /**
   * Validates a raw password and wraps it if it satisfies the policy.
   *
   * The input is used exactly as given — never trimmed, never normalised.
   * Whitespace is a legitimate part of a passphrase, and silently editing what
   * the user typed would make the stored hash disagree with what they type at
   * login.
   *
   * @param {string} raw - The password as the user typed it.
   * @returns {Either<WeakPasswordError, PlainPassword>} `Left` when any rule
   * fails, `Right` with the Value Object otherwise. A single error describes
   * the whole policy rather than naming the rule that failed.
   *
   * @example
   * ```ts
   * const result = PlainPassword.create(body.password);
   *
   * if (isLeft(result)) {
   *   return reply.status(422).send({ message: result.value.message });
   * }
   * ```
   */
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

  /**
   * Replaces the password when the object is serialised.
   *
   * Invoked implicitly by `JSON.stringify`, which covers structured logging and
   * any accidental inclusion in a response body.
   *
   * This is not a debug leftover. Removing it writes the user's plain password
   * to disk, to the log aggregator, and to every backup taken afterwards.
   *
   * @returns {string} The redaction mask.
   */
  toJSON(): string {
    return REDACTED_VALUE;
  }

  /**
   * Replaces the password when the object is inspected at runtime.
   *
   * `util.inspect` reads own properties directly and **never consults
   * `toJSON`**, so this is a second, independent channel: `console.log(value)`,
   * `error.cause`, and the dump of a non-serialisable object all bypass the
   * method above. Both are required, and neither covers the other.
   *
   * Declared through `Symbol.for` instead of importing `node:util`, which keeps
   * the domain free of runtime imports. The registry key is the very symbol
   * that `util.inspect.custom` holds.
   *
   * @returns {string} The redaction mask.
   */
  [Symbol.for("nodejs.util.inspect.custom")](): string {
    return REDACTED_VALUE;
  }
}
