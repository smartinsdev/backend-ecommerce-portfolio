/**
 * Recursively freezes an object and all of its nested objects.
 *
 * This is useful for creating immutable data structures and preventing
 * accidental mutation of nested state.
 *
 * @template T
 * @param obj - The value to deeply freeze.
 * @returns The same object, now deeply frozen.
 *
 * @example
 * const state = deepFreeze({
 *   user: {
 *     name: "Ada",
 *   },
 * });
 *
 * state.user.name = "Grace"; // TypeError in strict mode
 */
export function deepFreeze<T>(obj: T): T {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }
  Object.keys(obj).forEach(key => {
    const prop = (obj as Record<string, unknown>)[key];
    if (typeof prop === "object" && prop !== null) {
      deepFreeze(prop);
    }
  });

  return Object.freeze(obj);
}
