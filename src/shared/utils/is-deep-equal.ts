/**
 * Compares two values structurally and returns `true` when they represent the same data.
 *
 * Supports primitives, `Date`, `RegExp`, arrays, `Map`, `Set`, plain objects and class
 * instances. Two values of different classes are never equal, even when their own
 * properties match — this is what keeps two Value Objects of distinct types apart.
 *
 * @param a The first value to compare.
 * @param b The second value to compare.
 * @returns `true` when both values are deeply equal, otherwise `false`.
 *
 * @example
 * ```ts
 * const first = { id: 1, createdAt: new Date("2024-01-01T00:00:00.000Z") };
 * const second = { id: 1, createdAt: new Date("2024-01-01T00:00:00.000Z") };
 *
 * console.log(isDeepEqual(first, second)); // true
 * ```
 */
export function isDeepEqual(a: unknown, b: unknown): boolean {
  if (Object.is(a, b)) return true;

  if (typeof a !== "object" || a === null || typeof b !== "object" || b === null) {
    return false;
  }

  if (Object.getPrototypeOf(a) !== Object.getPrototypeOf(b)) return false;

  if (a instanceof Date) return a.getTime() === (b as Date).getTime();
  if (a instanceof RegExp) {
    return a.source === (b as RegExp).source && a.flags === (b as RegExp).flags;
  }
  if (a instanceof Set) return isDeepEqualSet(a, b as Set<unknown>);
  if (a instanceof Map) return isDeepEqualMap(a, b as Map<unknown, unknown>);

  const keysA = Reflect.ownKeys(a);
  const keysB = Reflect.ownKeys(b);

  if (keysA.length !== keysB.length) return false;

  const recordA = a as Record<PropertyKey, unknown>;
  const recordB = b as Record<PropertyKey, unknown>;

  return keysA.every(key => Object.hasOwn(recordB, key) && isDeepEqual(recordA[key], recordB[key]));
}

/**
 * Compares two Sets by membership. Insertion order is irrelevant, so each member of `a`
 * is matched against a still unmatched member of `b`.
 */
function isDeepEqualSet(a: Set<unknown>, b: Set<unknown>): boolean {
  if (a.size !== b.size) return false;

  const unmatched = [...b];

  for (const member of a) {
    const index = unmatched.findIndex(candidate => isDeepEqual(member, candidate));
    if (index === -1) return false;
    unmatched.splice(index, 1);
  }

  return true;
}

/**
 * Compares two Maps by their entries. Keys are compared deeply as well, so Maps keyed by
 * objects behave consistently with Maps keyed by primitives.
 */
function isDeepEqualMap(a: Map<unknown, unknown>, b: Map<unknown, unknown>): boolean {
  if (a.size !== b.size) return false;

  const unmatched = [...b];

  for (const [key, value] of a) {
    const index = unmatched.findIndex(
      ([candidateKey, candidateValue]) =>
        isDeepEqual(key, candidateKey) && isDeepEqual(value, candidateValue),
    );
    if (index === -1) return false;
    unmatched.splice(index, 1);
  }

  return true;
}
