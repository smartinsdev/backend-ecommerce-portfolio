import { DomainError } from "@/shared/kernel/domain-error.js";

export class TokenAlreadyUsedError extends DomainError {
  readonly code = "TOKEN_ALREADY_USED";
  constructor() {
    super("This refresh token has already been used.");
  }
}
