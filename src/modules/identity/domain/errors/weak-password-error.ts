import { DomainError } from "@/shared/kernel/domain-error.js";

export class WeakPasswordError extends DomainError {
  readonly code = "WEAK_PASSWORD";
  constructor(minLength: number) {
    super(
      `The password must be at least ${minLength} characters long and contain a letter, a digit and a special character (for example ! - or ?).`,
    );
  }
}
