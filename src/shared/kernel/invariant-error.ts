/**
 * Thrown when the domain is asked to hold a state that should be impossible.
 *
 * An `InvariantError` is not a business flow. It means a caller supplied data
 * that no legitimate path could produce — a corrupt column, a broken mapper, a
 * bad migration. It is deliberately an exception rather than an `Either`,
 * because forcing every caller to branch on a case that cannot legitimately
 * occur would bury the real flows in noise.
 *
 * It travels untouched to the global error handler. If one is ever logged in
 * production, the fix belongs in the code, never in the request.
 *
 * Expected business-rule failures use `DomainError` with `Either` instead.
 *
 * @example
 * ```ts
 * if (hash.length === 0) {
 *   throw new InvariantError("A PasswordHash cannot be built from an empty value.");
 * }
 * ```
 */
export class InvariantError extends Error {
  /**
   * @param {string} message - Explanation aimed at the developer reading the
   * stack trace. It should name the invariant that was broken, not the user
   * action that exposed it.
   */
  constructor(message: string) {
    super(message);
    this.name = "InvariantError";
  }
}
