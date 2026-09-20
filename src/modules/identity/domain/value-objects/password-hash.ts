import { InvariantError } from "@/shared/kernel/invariant-error.js";
import { ValueObject } from "@/shared/kernel/value-object.js";
import { REDACTED_VALUE } from "./redacted-value.js";

/**
 * The encapsulated shape of a `PasswordHash`.
 */
interface PasswordHashProps extends Record<string, unknown> {
  /**
   * The digest exactly as it was produced or stored, byte for byte.
   */
  value: string;
}

/**
 * A password digest, treated as an opaque value.
 *
 * This Value Object does not know what bcrypt is, does not hash anything, and
 * does not judge strength. Any non-empty digest is valid: strength is a rule
 * about the plain text and belongs to `PlainPassword`, while hashing itself
 * lives behind an application port, so the domain never depends on a library.
 *
 * Its reason to exist is to make a digest impossible to confuse with a plain
 * password at the type level, and to keep itself out of logs.
 */
export class PasswordHash extends ValueObject<PasswordHashProps> {
  /**
   * Private so that a digest can only enter the domain through `create`, where
   * the invariant is checked.
   *
   * @param {PasswordHashProps} props - The validated digest.
   */
  private constructor(props: PasswordHashProps) {
    super(props);
  }

  /**
   * Rebuilds a `PasswordHash` from a digest that already exists — a column read
   * by the mapper, or the value a hasher has just returned.
   *
   * It reconstitutes and never transforms. Passing a plain password here stores
   * the plain password.
   *
   * @param {string} hash - The digest, exactly as produced or stored.
   * @returns {PasswordHash} The Value Object wrapping the digest.
   * @throws {InvariantError} When the digest is empty or padded with
   * whitespace. No hashing algorithm emits either, so both mean the value was
   * written by something other than a hasher. Padding is refused rather than
   * trimmed: repairing it silently would turn a corrupt column into an
   * authentication failure with no trace of where it came from.
   *
   * @example
   * ```ts
   * const passwordHash = PasswordHash.create(row.password_hash);
   * ```
   */
  static create(hash: string): PasswordHash {
    if (hash.length === 0 || hash !== hash.trim())
      throw new InvariantError("A PasswordHash cannot be empty or padded with whitespace.");

    return new PasswordHash({ value: hash });
  }

  /**
   * Replaces the digest when the object is serialised.
   *
   * Invoked implicitly by `JSON.stringify`, which covers structured logging and
   * any accidental inclusion in a response body.
   *
   * This is not a debug leftover. Removing it leaks the digest: a digest is not
   * the password, but whoever reads one no longer needs the database — they
   * attack it offline, unhurried, against a cost factor chosen to resist online
   * guessing.
   *
   * @returns {string} The redaction mask.
   */
  toJSON(): string {
    return REDACTED_VALUE;
  }

  /**
   * Replaces the digest when the object is inspected at runtime.
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
