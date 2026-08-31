import { DomainError } from "@/shared/kernel/domain-error.js";

export class InvalidEmailError extends DomainError {
  readonly code = "INVALID_EMAIL";

  constructor(raw: string) {
    super(`That email "${raw}" is not valid.`);
  }
}
