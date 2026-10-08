import { DomainError } from "@/shared/kernel/domain-error.js";

export class InvalidCredentialsError extends DomainError {
  readonly code = "INVALID_CREDENTIALS";
  constructor() {
    super("Invalid email or password. Try again.");
  }
}
