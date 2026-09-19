import { DomainError } from "@/shared/kernel/domain-error.js";

export class WeakPasswordError extends DomainError {
  readonly code = "WEAK_PASSWORD";
  constructor() {
    super(
      "The password must be at least 8 characters long and include one letter, one number and one special character.",
    );
  }
}
