import { randomUUID } from "node:crypto";

/**
 * Represents a unique identifier for domain entities.
 * Generates a standard UUID if no initial value is provided.
 */
export class UniqueEntityId {
  /**
   * The underlying string representation of the unique identifier.
   */
  private readonly value: string;

  /**
   * Creates an instance of `UniqueEntityId`.
   *
   * @param {string} [value] - An optional existing identifier string. Auto-generates a UUID v4 if omitted.
   */
  constructor(value?: string) {
    this.value = value ?? randomUUID();
  }

  /**
   * Returns the string representation of the ID.
   * Invoked implicitly by JavaScript during string conversions and template literal interpolations.
   *
   * @returns {string} The raw UUID or custom string identifier.
   */
  toString(): string {
    return this.value;
  }

  /**
   * Unwraps the primitive string value for persistence layer mapping or external integration.
   *
   * @returns {string} The primitive string representation.
   */
  toValue(): string {
    return this.value;
  }

  /**
   * Compares equality with another `UniqueEntityId`.
   * Validates nullability, constructor identity, and string value equivalence.
   *
   * @param {UniqueEntityId | null} [id] - The target ID instance to compare.
   * @returns {boolean} `true` if both instances share the exact same constructor and value, otherwise `false`.
   *
   * @example
   * ```typescript
   * const idA = new UniqueEntityId("uuid-1");
   * const idB = new UniqueEntityId("uuid-1");
   *
   * console.log(idA.equals(idB)); // true
   * ```
   */
  equals(id?: UniqueEntityId | null): boolean {
    if (id === null || id === undefined) return false;
    if (id.constructor !== this.constructor) return false;

    return id.toValue() === this.value;
  }
}
