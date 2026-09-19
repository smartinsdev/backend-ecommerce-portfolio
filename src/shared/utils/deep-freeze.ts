/**
 * Recursively freezes a value and everything reachable from it.
 *
 * Symbol keys are frozen alongside string keys, and shared or circular references are
 * visited only once, so a self-referencing graph does not exhaust the stack.
 *
 * @template T
 * @param value - The value to deeply freeze.
 * @returns The same value, now deeply frozen.
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
export function deepFreeze<T>(value: T): T {
  freeze(value, new WeakSet<object>());

  return value;
}

function freeze(value: unknown, visited: WeakSet<object>): void {
  if (value === null || typeof value !== "object") return;
  if (visited.has(value)) return;

  visited.add(value);
  Object.freeze(value);

  for (const key of Reflect.ownKeys(value)) {
    freeze((value as Record<PropertyKey, unknown>)[key], visited);
  }
}
