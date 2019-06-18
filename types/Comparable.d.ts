export interface Comparator<T> {
    (a: Comparable<T>, b: Comparable<T>): number;
}
export interface Comparable<T> {
    compareTo(other: Comparable<T>): number;
}
export declare function compare<T>(a: Comparable<T>, b: Comparable<T>): number;
