import { DomainError } from "@/shared/kernel/domain-error.js";

/**
 * Raised when a raw string cannot become an `Email`.
 *
 * The rejected input is deliberately absent from the message: this error travels to
 * structured logs and to the HTTP response, and neither is a place for an address the
 * caller typed.
 */
export class InvalidEmailError extends DomainError {
  readonly code = "INVALID_EMAIL";

  constructor() {
    super("The email address provided is not valid.");
  }
}
