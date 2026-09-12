import { deepFreeze } from "@/utils/deep-freeze.js";
import { isDeepEqual } from "@/utils/is-deep-equals.js";

/**
 * Base class for immutable value objects.
 *
 * A value object encapsulates a set of properties and compares them by value,
 * not by reference. Subclasses should define their own typed props and expose
 * either getters or factory methods for creating instances.
 *
 * @example
 * ```ts
 * class Money extends ValueObject<{ amount: number; currency: string }> {
 *   constructor(amount: number, currency: string) {
 *     super({ amount, currency });
 *   }
 *
 *   get amount() {
 *     return this.props.amount;
 *   }
 * }
 *
 * const a = new Money(100, "USD");
 * const b = new Money(100, "USD");
 *
 * console.log(a.equals(b)); // true
 * ```
 */
export abstract class ValueObject<Props extends Record<string, unknown>> {
  protected readonly props: Props;

  protected constructor(props: Props) {
    this.props = deepFreeze({ ...props });
  }

  equals(vo?: ValueObject<Props> | null): boolean {
    if (vo === null || vo === undefined) return false;
    if (vo.constructor !== this.constructor) return false;

    return isDeepEqual(this.props, vo.props);
  }
}
