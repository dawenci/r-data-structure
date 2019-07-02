export interface Comparable {
  // Returns a negative number if this is less than other, 
  // zero if they are equal,
  // and a positive number if this is greater than other.
  compareTo(other: Comparable): number
}

export interface Comparator {
  (a: Comparable, b: Comparable): number
}

export function compare(a: Comparable, b: Comparable): number {
  return a.compareTo(b)
}
