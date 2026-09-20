/**
 * Base class for every expected business-rule failure in the domain.
 *
 * A `DomainError` describes a flow the system anticipates: the caller was
 * refused for a reason the business defines, not because something is broken.
 * Instances are carried as the `Left` side of an `Either` and pattern-matched
 * by the controller into an HTTP status — they are never thrown.
 *
 * For the opposite case, a state that should be impossible, see `InvariantError`.
 *
 * @example
 * ```ts
 * export class InvalidCredentialsError extends DomainError {
 *   readonly code = "INVALID_CREDENTIALS";
 * }
 * ```
 */
export abstract class DomainError extends Error {
  /**
   * Stable, machine-readable discriminator in screaming snake case.
   * Declared by each subclass so that clients and logs can branch on the kind
   * of failure without parsing `message`, which is prose and may be reworded.
   */
  abstract readonly code: string;

  /**
   * Creates a domain error and names it after the concrete subclass.
   * `new.target` resolves to the class being instantiated, so `error.name`
   * reads `InvalidCredentialsError` rather than `DomainError`.
   *
   * @param {string} message - Human-readable explanation, safe to show to the
   * end user. It must never interpolate the rejected input: this message
   * reaches structured logs and HTTP response bodies.
   */
  constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}
