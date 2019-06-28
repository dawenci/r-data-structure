export interface Comparable<T extends Comparable<T>> {
  // Returns a negative number if this is less than other, 
  // zero if they are equal,
  // and a positive number if this is greater than other.
  compareTo(other: T): number
}

export interface Comparator<T extends Comparable<T>> {
  (a: T, b: T): number
}

export function compare<T extends Comparable<T>>(a: T, b: T): number {
  return a.compareTo(b)
}
