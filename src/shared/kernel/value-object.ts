import { deepFreeze } from "../utils/deep-freeze.js";
import { isDeepEqual } from "../utils/is-deep-equal.js";

/**
 * Abstract base class for Value Objects in Domain-Driven Design (DDD).
 *
 * A Value Object is an immutable object defined solely by its attributes
 * rather than an explicit identity (like an ID). Two Value Objects are considered
 * equal if their structural properties are deeply identical.
 *
 * @template Props - Shape of the encapsulated properties, extending a record of key-value pairs.
 */
export abstract class ValueObject<Props extends Record<string, unknown>> {
  /**
   * The frozen internal properties of the Value Object.
   */
  protected readonly props: Props;

  /**
   * Creates an instance of a Value Object.
   * Clones the properties shallowly and deeply freezes the resulting object
   * to guarantee domain immutability and break reference memory links.
   *
   * @param {Props} props - The raw properties representing the value.
   */
  protected constructor(props: Props) {
    this.props = deepFreeze({ ...props });
  }

  /**
   * Compares the structural equality of this Value Object with another.
   * Checks for nullability, constructor identity, and deep property equality.
   *
   * @param {ValueObject<Props> | null} [vo] - The target Value Object to compare.
   * @returns {boolean} `true` if both objects belong to the same class and have deeply equal properties, otherwise `false`.
   *
   * @example
   * ```typescript
   * interface MoneyProps extends Record<string, unknown> {
   *   amount: number;
   *   currency: string;
   * }
   *
   * class Money extends ValueObject<MoneyProps> {
   *   static create(amount: number, currency: string): Money {
   *     return new Money({ amount, currency });
   *   }
   * }
   *
   * const priceA = Money.create(100, "USD");
   * const priceB = Money.create(100, "USD");
   *
   * console.log(priceA.equals(priceB)); // true
   * ```
   */
  equals(vo?: ValueObject<Props> | null): boolean {
    if (vo === null || vo === undefined) return false;
    if (vo.constructor !== this.constructor) return false;

    return isDeepEqual(this.props, vo.props);
  }
}
