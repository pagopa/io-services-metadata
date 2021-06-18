/**
 * for a given collections of items return these elements that are
 * repeated more than one time
 * @param items
 * @param equals
 */
export const getDuplicates = <T>(
  items: ReadonlyArray<T>,
  equals: (a: T, b: T) => boolean
): ReadonlyArray<T> => {
  // tslint:disable-next-line: readonly-array
  const duplicates: T[] = [];
  items.forEach(item => {
    if (duplicates.some(d => equals(d, item))) {
      return;
    }
    const filtered = items.filter(innerItem => equals(item, innerItem));
    if (filtered.length > 1) {
      duplicates.push(item);
    }
  });
  return [...duplicates];
};
