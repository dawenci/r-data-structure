import { BinarySearchTree } from './BinarySearchTree';
import { Node } from './Node';
declare const enum Color {
    Red = 1,
    Black = 0
}
export declare class RedBlackNode<K, V> implements Node<K, V> {
    key: K;
    value?: V;
    parent: this;
    left: this;
    right: this;
    constructor(key: K, value?: V);
    color: Color;
}
export declare class RedBlackTree<K, V, T extends RedBlackNode<K, V>> extends BinarySearchTree<K, V, T> {
    constructor(compare?: (a: K, b: K) => number);
    insert(key: K, value?: V): void;
    delete(key: K): boolean;
    /**
     * 插入后的调整
     *
     * @private
     * @param {(T | Nil)} current
     * @param {(T | Nil)} parent
     * @memberof RedBlackTree
     */
    private _insertFixUp;
    /**
     * 删除后的调整操作
     *
     * @private
     * @param {T} nil
     * @memberof RedBlackTree
     */
    private _removeFixUp;
    private _nil;
}
export {};
