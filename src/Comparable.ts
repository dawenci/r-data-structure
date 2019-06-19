export interface Comparable<T extends Comparable<T>> {
  compareTo(other: T): number
}

export interface Comparator<T extends Comparable<T>> {
  (a: T, b: T): number
}

export function compare<T extends Comparable<T>>(a: T, b: T): number {
  return a.compareTo(b)
}
