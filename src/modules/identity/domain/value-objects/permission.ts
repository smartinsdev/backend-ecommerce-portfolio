import { InvariantError } from "@/shared/kernel/invariant-error.js";
import { ValueObject } from "@/shared/kernel/value-object.js";

/**
 * How far a permission reaches.
 *
 * `own` covers the actor's own resources, `any` is the administrative reach over
 * everyone's. The two are never interchangeable: the distance between them is the
 * distance between reading your own order and reading every customer's.
 *
 * These two literals are repeated in `isScopeAllowed` below, and the duplication is
 * deliberate. The explicit comparisons are what narrow `scope` to this union, which
 * is what lets the constructor call typecheck without a cast. Collecting them into
 * an array and testing membership with `includes` reads better and gives the
 * narrowing up silently — and the cast comes straight back.
 */
type PermissionScope = "own" | "any";

/**
 * The encapsulated shape of a `Permission`.
 */
interface PermissionProps extends Record<string, unknown> {
  /**
   * What is being acted upon, such as `order`.
   */
  resource: string;

  /**
   * What is being done to it, such as `read`.
   */
  action: string;

  /**
   * How far the permission reaches. An unwritten scope means `own`.
   */
  scope: PermissionScope;
}

/**
 * A capability, written as `resource:action` with an optional scope suffix.
 *
 * This is the first half of the access decision in `docs/architecture.md` §7 —
 * whether a role may, in principle, perform an action at all. The second half,
 * whether this particular resource belongs to the actor, cannot live here: Identity
 * does not know what an order is. It belongs to the aggregate that owns the
 * resource, and the use case composes the two.
 *
 * Scope is a field of its own rather than text folded into `action` so that the set
 * of legal scopes stays closed. That is what makes a typo in seed data fail loudly
 * at boot, instead of quietly minting a permission nobody will ever hold — one where
 * every `can()` answers `false` forever, correctly, with nothing in the logs to say
 * why access was denied.
 *
 * The rules it enforces are pinned by `permission.spec.ts`. They are deliberately
 * not restated here, so that changing one cannot leave this comment lying.
 */
export class Permission extends ValueObject<PermissionProps> {
  /**
   * Private so that a malformed capability can never exist as a `Permission`.
   *
   * @param {PermissionProps} props - The parsed, validated capability.
   */
  private constructor(props: PermissionProps) {
    super(props);
  }

  /**
   * Parses a capability and wraps it.
   *
   * Leaving the scope out and writing it out produce the same value, so the format
   * is closed over its own output: a permission rendered back as
   * `resource:action:scope` can be parsed again. That matters because permissions
   * travel through the JWT when the `Actor` is built, and a parser that rejects its
   * own output would only reveal that at integration time.
   *
   * @param {string} raw - The capability, such as `order:read` or `order:read:any`.
   * @returns {Permission} The Value Object wrapping the parsed capability.
   * @throws {InvariantError} When the string is not a capability. This is an
   * exception rather than an `Either` — deviating from the rule in §6 — because of
   * where these strings come from: seed data and literals written in the use cases,
   * never a request body. A malformed one is a typo in the code, and making every
   * `can()` branch on a case no legitimate path produces would bury the real flows
   * in noise. The day permissions start arriving from outside, that reasoning needs
   * revisiting.
   *
   * @example
   * ```ts
   * const permission = Permission.create("order:read:any");
   * ```
   */
  static create(raw: string): Permission {
    const [resource, action, scope, ...rest] = raw.split(":");

    const hasResource = resource !== undefined && resource !== "";
    const hasAction = action !== undefined && action !== "";
    const hasNoExtraArgs = rest.length === 0;
    const isScopeAllowed = scope === undefined || scope === "any" || scope === "own";

    const isValid = hasResource && hasAction && hasNoExtraArgs && isScopeAllowed;

    if (!isValid) {
      throw new InvariantError(
        `A Permission must follow the format 'resource:action' or 'resource:action:[any | own]'.`,
      );
    }

    return new Permission({
      resource,
      action,
      scope: scope ?? "own",
    });
  }
}
