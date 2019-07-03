declare class SkipNode<K, V> {
    key: K;
    value: V;
    nodeLevel: number;
    [index: number]: SkipNode<K, V> | undefined;
    constructor(key: any, value: any, nodeLevel: any);
}
export declare class SkipList<K, V> {
    _head: SkipNode<K, V>;
    _maxLevel: number;
    _probability: number;
    size: number;
    compare: (a: K, b: K) => number;
    constructor(options?: any);
    insert(key: K, value: V): boolean;
    delete(key: K): boolean;
    getValue(key: K): V;
    forEach(callback: any, thisArg: any): void;
    _predecessors(key: K): {
        [key: number]: SkipNode<K, V>;
    };
    _randomLevel(): number;
}
export {};
