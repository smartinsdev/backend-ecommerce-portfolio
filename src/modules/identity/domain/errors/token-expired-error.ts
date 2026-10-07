import { DomainError } from "@/shared/kernel/domain-error.js";

export class TokenExpiredError extends DomainError {
  readonly code = "TOKEN_EXPIRED";

  constructor() {
    super("This refresh token has expired.");
  }
}
