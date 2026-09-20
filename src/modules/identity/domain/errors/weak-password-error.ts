import { DomainError } from "@/shared/kernel/domain-error.js";

/**
 * Returned when a plain password does not meet the strength policy.
 *
 * It states the policy as a whole rather than naming the rule that failed.
 * Per-rule feedback is the better end state and carries no security cost here,
 * since the user is choosing their own password — but nothing consumes it yet,
 * so the decision waits for the HTTP layer and the shape of its 422 body.
 *
 * The message is written for the end user and reaches the response body.
 */
export class WeakPasswordError extends DomainError {
  readonly code = "WEAK_PASSWORD";

  /**
   * @param {number} minLength - The minimum length being enforced. Taken as an
   * argument instead of being hard-coded into the sentence, so the number the
   * user reads can never drift from the number `PlainPassword` actually checks.
   */
  constructor(minLength: number) {
    super(
      `The password must be at least ${minLength} characters long and contain a letter, a digit and a special character (for example ! - or ?).`,
    );
  }
}
