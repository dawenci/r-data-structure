export interface Comparable {
    compareTo(other: Comparable): number;
}
export interface Comparator {
    (a: Comparable, b: Comparable): number;
}
export declare function compare(a: Comparable, b: Comparable): number;
