export function partialCompare<T>(obj1: T, obj2: Partial<T>): boolean {
  for (const key in obj2) {
    if (!obj1.hasOwnProperty(key)) return false;
    if (obj1[key] !== obj2[key]) return false;
  }
  return true;
}
