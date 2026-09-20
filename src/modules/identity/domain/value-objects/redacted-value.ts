/**
 * The text that stands in for a secret when a Value Object is serialised or
 * inspected.
 *
 * Shared by the Value Objects in this module that carry secrets, so the mask
 * cannot drift between them.
 *
 * It is deliberately never asserted by a test: the specs assert that the secret
 * is *absent* from the output, not that this exact string is present. Rewording
 * it therefore cannot break the suite, while the defence itself stays proven.
 */
export const REDACTED_VALUE = "[REDACTED]";
