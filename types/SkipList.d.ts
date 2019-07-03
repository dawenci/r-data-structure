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
    /**
     * 数据插入
     */
    insert(key: K, value: V): void;
    /**
     * 数据删除
     */
    delete(key: K): void;
    /**
     * 获取 key 对应的值
     */
    value(key: K): V;
    /**
     * 遍历列表
     * @param {(key: K, value: V) => any} iteratee
     */
    forEach(iteratee: any): void;
    _predecessors(key: K): {
        [key: number]: SkipNode<K, V>;
    };
    _randomLevel(): number;
}
export {};
