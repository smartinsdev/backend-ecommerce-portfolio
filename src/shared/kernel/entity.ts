import { UniqueEntityId } from "./unique-entity-id.js";

/**
 * Abstract base class for Entities in Domain-Driven Design (DDD).
 *
 * An Entity is a domain concept defined by a unique identity (`_id`) rather than
 * its attributes. Two Entities are considered equal if they belong to the exact same
 * class and share the same `UniqueEntityId`, even if their properties differ over time.
 *
 * @template Props - Shape of the encapsulated state and attributes of the entity.
 */
export abstract class Entity<Props> {
  /**
   * The unique identifier for the entity instance.
   */
  private readonly _id: UniqueEntityId;

  /**
   * The internal domain properties and state of the entity.
   */
  protected props: Props;

  /**
   * Protected constructor to enforce instantiation through specific static factory methods
   * or domain-level constructors in derived entity classes.
   *
   * @param {Props} props - The domain properties defining the initial state.
   * @param {UniqueEntityId} [id] - Optional unique identifier. A new `UniqueEntityId` is auto-generated if omitted.
   */
  protected constructor(props: Props, id?: UniqueEntityId) {
    this.props = props;
    this._id = id ?? new UniqueEntityId();
  }

  /**
   * Gets the unique identifier of the entity.
   *
   * @returns {UniqueEntityId} The entity's identity instance.
   */
  get id(): UniqueEntityId {
    return this._id;
  }

  /**
   * Compares the identity equality of this Entity with another.
   * Evaluates nullability, instance reference, constructor type, and ID equality.
   *
   * @param {Entity<unknown> | null} [entity] - The target Entity to compare.
   * @returns {boolean} `true` if both instances share the exact same constructor class and ID, otherwise `false`.
   *
   * @example
   * ```typescript
   * interface UserProps {
   *   name: string;
   *   email: string;
   * }
   *
   * class User extends Entity<UserProps> {
   *   static create(props: UserProps, id?: UniqueEntityId): User {
   *     return new User(props, id);
   *   }
   * }
   *
   * const userId = new UniqueEntityId("user-123");
   * const userA = User.create({ name: "Ana", email: "ana@brand.com" }, userId);
   * const userB = User.create({ name: "Ana Silva", email: "ana.silva@brand.com" }, userId);
   *
   * console.log(userA.equals(userB)); // true (same identity despite attribute changes)
   * ```
   */
  equals(entity?: Entity<unknown> | null): boolean {
    if (entity === null || entity === undefined) return false;
    if (this === entity) return true;
    if (entity.constructor !== this.constructor) return false;

    return entity.id.equals(this._id);
  }
}
