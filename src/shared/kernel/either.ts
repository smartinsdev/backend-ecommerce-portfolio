/**
 * Represents the failure (or error) side of the Either monad.
 * @template L The type of the error value.
 */
export type Left<L> = { readonly _tag: "Left"; readonly value: L };

/**
 * Represents the success side of the Either monad.
 * @template R The type of the success value.
 */
export type Right<R> = { readonly _tag: "Right"; readonly value: R };

/**
 * A discriminated union that represents a value of one of two possible types.
 * Conventionally, `Left` is used for failure and `Right` is used for success.
 *
 * @template L The type of the Left (failure) value.
 * @template R The type of the Right (success) value.
 */
export type Either<L, R> = Left<L> | Right<R>;

/**
 * Constructs a `Left` instance representing a failure.
 *
 * @template L The type of the failure value.
 * @template R The type of the success value (defaults to `never`).
 * @param {L} value - The failure value to wrap.
 * @returns {Either<L, R>} The `Left` instance.
 */
export const left = <L, R = never>(value: L): Either<L, R> => ({
  _tag: "Left",
  value,
});

/**
 * Constructs a `Right` instance representing a success.
 *
 * @template L The type of the failure value (defaults to `never`).
 * @template R The type of the success value.
 * @param {R} value - The success value to wrap.
 * @returns {Either<L, R>} The `Right` instance.
 */
export const right = <R, L = never>(value: R): Either<L, R> => ({
  _tag: "Right",
  value,
});

/**
 * Type guard to check if an `Either` instance is a `Left` (failure).
 *
 * @template L The type of the failure value.
 * @template R The type of the success value.
 * @param {Either<L, R>} either - The instance to check.
 * @returns {boolean} `true` if the instance is `Left`, otherwise `false`.
 */
export const isLeft = <L, R>(either: Either<L, R>): either is Left<L> => either._tag === "Left";

/**
 * Type guard to check if an `Either` instance is a `Right` (success).
 *
 * @template L The type of the failure value.
 * @template R The type of the success value.
 * @param {Either<L, R>} either - The instance to check.
 * @returns {boolean} `true` if the instance is `Right`, otherwise `false`.
 */
export const isRight = <L, R>(either: Either<L, R>): either is Right<R> => either._tag === "Right";

/**
 * Executes a callback based on the state of the `Either` instance.
 * Useful for resolving both failure and success cases in a declarative way (e.g., in Controllers).
 *
 * @template L The type of the failure value.
 * @template R The type of the success value.
 * @template Out The return type of the callbacks.
 * @param {Either<L, R>} either - The `Either` instance to evaluate.
 * @param {(leftValue: L) => Out} onLeft - The callback executed if the instance is `Left`.
 * @param {(rightValue: R) => Out} onRight - The callback executed if the instance is `Right`.
 * @returns {Out} The result of the executed callback.
 * @example
 * ```ts
 * const result = Email.create("invalid-email");
 * const message = match(
 *   result,
 *   error => `Error: ${error.message}`,
 *   email => `Success: ${email.value}`,
 * );
 * console.log(message); // "Error: Invalid email address"
 * ```
 */
export const match = <L, R, Out>(
  either: Either<L, R>,
  onLeft: (leftValue: L) => Out,
  onRight: (rightValue: R) => Out,
): Out => {
  if (either._tag === "Left") {
    return onLeft(either.value);
  }
  return onRight(either.value);
};

/**
 * Utility type to extract the `Left` type from an `Either`.
 * @template T The `Either` type to infer from.
 */
export type InferLeft<T> = T extends Either<infer L, unknown> ? L : never;

/**
 * Utility type to extract the `Right` type from an `Either`.
 * @template T The `Either` type to infer from.
 */
export type InferRight<T> = T extends Either<unknown, infer R> ? R : never;
