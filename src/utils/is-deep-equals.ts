/**
 * Compares two values deeply and returns true when they are structurally equivalent.
 *
 * This function supports primitive values, Date instances, and objects with enumerable
 * own properties. It recursively compares nested values and their keys to determine
 * whether two objects contain the same data.
 *
 * @param obj1 The first value to compare.
 * @param obj2 The second value to compare.
 * @returns true when both values are deeply equal, otherwise false.
 *
 * @example
 * ```ts
 * const first = { id: 1, createdAt: new Date("2024-01-01T00:00:00.000Z") };
 * const second = { id: 1, createdAt: new Date("2024-01-01T00:00:00.000Z") };
 *
 * console.log(isDeepEqual(first, second)); // true
 * ```
 */
export function isDeepEqual(obj1: unknown, obj2: unknown): boolean {
  if (Object.is(obj1, obj2)) return true;

  if (typeof obj1 !== "object" || obj1 === null || typeof obj2 !== "object" || obj2 === null) {
    return false;
  }
  if (obj1 instanceof Date && obj2 instanceof Date) {
    return obj1.getTime() === obj2.getTime();
  }
  const keys1 = Reflect.ownKeys(obj1);
  const keys2 = Reflect.ownKeys(obj2);

  if (keys1.length !== keys2.length) return false;

  const record1 = obj1 as Record<PropertyKey, unknown>;
  const record2 = obj2 as Record<PropertyKey, unknown>;

  return keys1.every(key => Object.hasOwn(record2, key) && isDeepEqual(record1[key], record2[key]));
}
