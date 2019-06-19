import { Comparable } from './Comparable';
import { Node, BinarySearchTree } from './BinarySearchTree';
export declare type Color = boolean;
export declare class RBNode<K extends Comparable<K>, V = any> extends Node<K, V> {
    /**
     * 结点颜色，新插入结点默认红色
     *
     * @type {Color}
     * @memberof RBNode
     */
    color: Color;
    constructor(key: K, value?: V);
}
export declare class RBNilNode<K extends Comparable<K>, V = any> extends RBNode<K, V> {
    constructor();
}
export declare class RedBlackTree<K extends Comparable<K>, V = any, T extends RBNode<K, V> = RBNode<K, V>> extends BinarySearchTree<K, V, T> {
    isRed(node: T): boolean;
    isBlack(node: T): boolean;
    setBlack(node: T): void;
    setRed(node: T): void;
    getSibling(node: T): T;
    getUncle(node: T): T;
    getGrandparent(node: T): T;
    /**
     * Inserts a new node with a specific key and value into the tree.
     *
     * @param {K} key
     * @param {V} [value]
     * @memberof RedBlackTree
     */
    insert(key: K, value?: V): void;
    /**
     * Deletes a node with a specific key from the tree.
     *
     * @param {K} key
     * @returns {boolean} 是否成功删除结点
     * @memberof RedBlackTree
     */
    delete(key: K): boolean;
    /**
     *
     *
     * @private
     * @param {(T | Nil)} current
     * @param {(T | Nil)} parent
     * @memberof RedBlackTree
     */
    private _insertFixUp;
    /**
     *
     *
     * @private
     * @param {T} RBNil
     * @memberof RedBlackTree
     */
    private _removeFixUp;
}
